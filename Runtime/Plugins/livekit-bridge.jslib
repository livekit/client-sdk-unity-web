var NativeLib = {
    $BridgeData: null,
    $BridgePtr: null,
    $RefCounter: 1,
    $Stack: [],
    $StackCSharp: [],
    $nullptr: 0,

    $NewRef: function () {
        return RefCounter++;
    },

    $SetRef: function (ptr, obj) {
        BridgeData.set(ptr, obj);

        if (typeof obj === 'object' && obj !== null) {
            BridgePtr.set(obj, ptr);
        }
    },

    $GetOrNewRef: function (obj) {
        var ptr = BridgePtr.get(obj); 
        if (ptr === undefined || typeof obj !== 'object' || obj === null) {
            ptr = NewRef();
            SetRef(ptr, obj);
        }

        return ptr;
    },

    Init: function () {
        // When initializing these variables directly, emscripten replace the type by {} (not sure why)
        BridgeData = new Map();
        BridgePtr = new Map();
    },

    NewRef: function () {
        return NewRef();
    },

    FreeRef: function (ptr) {
        var obj = BridgeData.get(ptr);
        BridgeData.delete(ptr);
        BridgePtr.delete(obj);
    },

    SetRef: function (ptr) {
        var value = Stack[0];
        SetRef(ptr, value);
    },

    GetProperty: function (ptr) {
        var key = Stack[0];
        Stack = [];

        var obj;
        if (ptr == nullptr) {
            obj = window[key];
        } else {
            var p = BridgeData.get(ptr);
            if (p === undefined)
                return nullptr;

            obj = p[key];
        }

        return GetOrNewRef(obj);
    },

    SetProperty: function (ptr) {
        var key = Stack[0];
        var value = Stack[1];
        Stack = [];

        var obj;
        if (ptr == nullptr) {
            obj = window;
        } else {
            obj = BridgeData.get(ptr);
            if (obj === undefined)
                return;
        }

        obj[key] = value;
    },

    IsNull: function (ptr) {
        return BridgeData.get(ptr) === null;
    },

    IsUndefined: function (ptr) {
        return BridgeData.get(ptr) === undefined;
    },

    IsString: function (ptr) {
        var obj = BridgeData.get(ptr);
        return typeof obj === 'string' || obj instanceof String;
    },

    IsNumber: function (ptr) {
        var obj = BridgeData.get(ptr);
        return typeof obj === 'number' && !isNaN(obj);
    },

    IsBoolean: function (ptr) {
        var obj = BridgeData.get(ptr);
        return typeof obj === 'boolean';
    },

    IsObject: function (ptr) {
        var obj = BridgeData.get(ptr);
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    },

    IsArray: function (ptr) {
        var obj = BridgeData.get(ptr);
        return Array.isArray(obj);
    },

    PushNull: function () {
        Stack.push(null);
    },

    PushUndefined: function () {
        Stack.push(undefined);
    },

    PushNumber: function (nb) {
        Stack.push(nb);
    },

    PushBoolean: function (bool) {
        Stack.push(bool === 1);
    },

    PushString: function (str) {
        Stack.push(UTF8ToString(str));
    },

    PushStruct: function (json) {
        Stack.push(JSON.parse(UTF8ToString(json)));
    },

    PushData: function (data, size) {
        Stack.push(HEAPU8.subarray(data, data + size));
    },

    PushFunction: function (ptr, fnc) {
        Stack.push(function () {
            StackCSharp = Array.from(arguments);

            if (typeof Runtime !== "undefined") {
                Runtime.dynCall("vi", fnc, [ptr]);
            } else {
                dynCall("vi", fnc, [ptr]);
            }

            StackCSharp = [];
        });
    },

    PushObject: function (ptr) {
        Stack.push(BridgeData.get(ptr));
    },

    CallFunction: function (str) {
        var fnc = window[UTF8ToString(str)];
        var result = fnc.apply(null, Stack);
        Stack = [];
        return GetOrNewRef(result);
    },

    CallMethod: function (ptr, str) {
        var obj = BridgeData.get(ptr);
        var fnc = obj[UTF8ToString(str)];
        var result = fnc.apply(obj, Stack);
        Stack = [];
        return GetOrNewRef(result);
    },

    NewInstance: function (ptr, toPtr, clazz) {
        var obj;
        if (ptr == 0) {
            obj = window;
        } else {
            obj = BridgeData.get(ptr);
        }

        var inst = new (Function.prototype.bind.apply(obj[UTF8ToString(clazz)], Stack));
        SetRef(toPtr, inst);
        Stack = [];
    },

    ShiftStack: function () {
        var v = StackCSharp.shift();
        return GetOrNewRef(v);
    },

    GetString: function (ptr) {
        var value = BridgeData.get(ptr);
        if (value === undefined || value === null)
            return null;

        var bufferSize = lengthBytesUTF8(value) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(value, buffer, bufferSize);
        return buffer;
    },

    GetNumber: function (ptr) {
        var value = BridgeData.get(ptr);
        return value;
    },

    GetBoolean: function (ptr) {
        var value = BridgeData.get(ptr);
        return value;
    },

    GetDataPtr: function (pptr) {
        var value = BridgeData.get(pptr);
        var arr = new Uint8Array(value);
        var ptr = _malloc(arr.byteLength + 4);
        HEAP32.set([arr.length], ptr >> 2); // First 4 bytes is the size of the array 
        HEAPU8.set(arr, ptr + 4);
        setTimeout(function () {
            _free(ptr);
        }, 0);
        return ptr;
    },

    // Video Receive
    NewTexture: function () {
        var tex = GLctx.createTexture();
        if (!tex)
            return nullptr;

        var id = GL.getNewId(GL.textures);
        tex.name = id;
        GL.textures[id] = tex;
        return id;
    },

    DestroyTexture: function (id) {
        GLctx.deleteTexture(GL.textures[id]);
    },

    AttachVideo: function (texId, videoPtr) {
        var attachPtr = NewRef();
        SetRef(attachPtr, true);

        var tex = GL.textures[texId];
        var video = BridgeData.get(videoPtr);
        var lastTime = -1;

        var updateVideo = function () {
            if (!BridgeData.get(attachPtr))
                return; // Detached

            var time = video.currentTime;
            if (!video.paused && video.srcObject !== null && time !== lastTime) {
                GLctx.bindTexture(GLctx.TEXTURE_2D, tex);

                // Flip
                GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, true);
                GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, video);
                GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, false);

                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MAG_FILTER, GLctx.LINEAR);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
                GLctx.bindTexture(GLctx.TEXTURE_2D, null);

                lastTime = time;
            }

            requestAnimationFrame(updateVideo);
        };

        requestAnimationFrame(updateVideo);
        return attachPtr;
    },
};

autoAddDeps(NativeLib, '$GetOrNewRef');
autoAddDeps(NativeLib, '$NewRef');
autoAddDeps(NativeLib, '$SetRef');
autoAddDeps(NativeLib, '$BridgeData');
autoAddDeps(NativeLib, '$BridgePtr');
autoAddDeps(NativeLib, '$RefCounter');
autoAddDeps(NativeLib, '$Stack');
autoAddDeps(NativeLib, '$StackCSharp');
autoAddDeps(NativeLib, '$nullptr');

mergeInto(LibraryManager.library, NativeLib);
