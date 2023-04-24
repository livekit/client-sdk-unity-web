var NativeLib = {
    $LKBridge: {
        Data: null, // Map<number, object>
        Pointers: null, // Map<object, number>
        RefCount: null, // Map<number, number>
        Debug: false,
        IsLinear: false,
        RefIndex: 1,
        Stack: [],
        StackCSharp: [],
        FunctionInstance: null, // Current instance in a callback ( = this )
        NullPtr: 0,

        DynCall: function (sig, fnc, args) {
            if (typeof Runtime !== 'undefined') {
                Runtime.dynCall(sig, fnc, args); // Old Unity version
            } else {
                dynCall(sig, fnc, args);
            }
        },

        NewRef: function () {
            var nPtr = LKBridge.RefIndex++;
            LKBridge.RefCount.set(nPtr, 0);
            LKBridge.SetRef(nPtr, null); // Set to null by default
            return nPtr;
        },

        FreeRef: function (ptr) {
            var obj = LKBridge.Data.get(ptr);
            LKBridge.Data.delete(ptr);
            LKBridge.RefCount.delete(ptr);
            LKBridge.Pointers.delete(obj);
        },

        SetRef: function (ptr, obj) {
            LKBridge.Data.set(ptr, obj);

            if (typeof obj === 'object' && obj !== null) {
                LKBridge.Pointers.set(obj, ptr);
            }
        },

        GetOrNewRef: function (obj) {
            var ptr = LKBridge.Pointers.get(obj);
            if (ptr === undefined || typeof obj !== 'object' || obj === null) {
                ptr = LKBridge.NewRef();
                LKBridge.SetRef(ptr, obj);
            }

            return ptr;
        },

        AddRef: function (ptr) {
            LKBridge.RefCount.set(ptr, LKBridge.RefCount.get(ptr) + 1);
            return ptr;
        },

        RemRef: function (ptr) {
            var count = LKBridge.RefCount.get(ptr) - 1;
            LKBridge.RefCount.set(ptr, count);

            if (count < 0) {
                console.error('LKBridge: The ref count of ' + ptr +  '(obj: ' + LKBridge.Data.get(ptr) + ') is negative ( Ptr management is wrong ! )');
            }
            
            if (count <= 0) {
                LKBridge.FreeRef(ptr);
            }

            return ptr;
        }
    },

    NewRef: function () {
        return LKBridge.AddRef(LKBridge.NewRef());
    },
    
    AddRef: function (ptr) {
        LKBridge.AddRef(ptr);
    },

    RemRef: function (ptr) {
        LKBridge.RemRef(ptr);
        return true;
    },
    
    SetRef: function(ptr){
        var value = LKBridge.Stack[0];
        LKBridge.Stack = [];
        LKBridge.SetRef(ptr, value);
    },

    InitLiveKit: function (debug, isLinear) {
        // When initializing these variables directly, emscripten replace the type by {} (not sure why)
        LKBridge.Debug = debug === 1;
        LKBridge.IsLinear = isLinear === 1;
        LKBridge.Data = new Map();
        LKBridge.Pointers = new Map();
        LKBridge.RefCount = new Map();

        window.lkinternal = LKBridge;
    },

    GetProperty: function (ptr) {
        var key = LKBridge.Stack[0];
        LKBridge.Stack = [];

        var p = LKBridge.Data.get(ptr);
        var obj = p[key];
        
        return LKBridge.AddRef(LKBridge.GetOrNewRef(obj));
    },

    SetProperty: function (ptr) {
        var key = LKBridge.Stack[0];
        var value = LKBridge.Stack[1];
        LKBridge.Stack = [];

        var obj = LKBridge.Data.get(ptr);
        obj[key] = value;
    },

    IsNull: function (ptr) {
        return LKBridge.Data.get(ptr) === null;
    },

    IsUndefined: function (ptr) {
        return LKBridge.Data.get(ptr) === undefined;
    },

    IsString: function (ptr) {
        var obj = LKBridge.Data.get(ptr);
        return typeof obj === 'string' || obj instanceof String;
    },

    IsNumber: function (ptr) {
        var obj = LKBridge.Data.get(ptr);
        return typeof obj === 'number' && !isNaN(obj);
    },

    IsBoolean: function (ptr) {
        var obj = LKBridge.Data.get(ptr);
        return typeof obj === 'boolean';
    },

    IsObject: function (ptr) {
        var obj = LKBridge.Data.get(ptr);
        return typeof obj === 'object' && obj !== null;
    },

    PushNull: function () {
        LKBridge.Stack.push(null);
    },

    PushUndefined: function () {
        LKBridge.Stack.push(undefined);
    },

    PushNumber: function (nb) {
        LKBridge.Stack.push(nb);
    },

    PushBoolean: function (bool) {
        LKBridge.Stack.push(bool === 1);
    },

    PushString: function (str) {
        LKBridge.Stack.push(UTF8ToString(str));
    },

    PushStruct: function (json) {
        LKBridge.Stack.push(JSON.parse(UTF8ToString(json)));
    },

    PushData: function (data, offset, size) {
        var of = data + offset;
        LKBridge.Stack.push(HEAPU8.subarray(of, of + size));
    },

    PushFunction: function (ptr, fnc, labelPtr) {
        var label = UTF8ToString(labelPtr);
        LKBridge.Stack.push(function () {
            if (!LKBridge.Data.has(ptr)) {
                console.warn("Trying to fire an event on a freed object", ptr, fnc, label);
                return;
            } 
            
            try{
                LKBridge.StackCSharp = Array.from(arguments);
                LKBridge.FunctionInstance = this;

                LKBridge.DynCall('vi', fnc, [LKBridge.AddRef(ptr)]);

                LKBridge.FunctionInstance = null;
                LKBridge.StackCSharp = [];
            } catch (e) {
                console.error("An error occured when calling C# callback", fnc, e, label,
                    "StackCSharp:", LKBridge.StackCSharp);
            }
        });
    },

    PushObject: function (ptr) {
        LKBridge.Stack.push(LKBridge.Data.get(ptr));
    },

    CallMethod: function (ptr, str) {
        var stack = LKBridge.Stack;
        LKBridge.Stack = [];
        
        var obj = LKBridge.Data.get(ptr);
        var mName = UTF8ToString(str);
        var fnc = obj[mName];
        var result = undefined;
        
        try{
            result = fnc.apply(obj, stack);
        }catch (e) {
            console.error("Internal issue when calling " + mName + "\n", "Stack: ", stack, e)
        }
        
        return LKBridge.AddRef(LKBridge.GetOrNewRef(result));
    },

    NewInstance: function (ptr, toPtr, clazz) {
        var stack = LKBridge.Stack;
        LKBridge.Stack = [];

        var obj;
        if (ptr === 0) {
            obj = window;
        } else {
            obj = LKBridge.Data.get(ptr);
        }

        var clazz = UTF8ToString(clazz);
        
        var inst = undefined;
        try{
            inst = new (Function.prototype.bind.apply(obj[clazz], stack));
        }catch (e) {
            console.error("Internal issue when trying to instantiate " + clazz + "\n", "Stack: ", stack, e)
        }
        LKBridge.SetRef(toPtr, inst);
    },

    ShiftStack: function () {
        var v = LKBridge.StackCSharp.shift();
        return LKBridge.AddRef(LKBridge.GetOrNewRef(v));
    },

    GetFunctionInstance: function () {
        var v = LKBridge.FunctionInstance;
        return LKBridge.AddRef(LKBridge.GetOrNewRef(v));
    },

    GetString: function (ptr) {
        var value = LKBridge.Data.get(ptr);
        if (value === undefined || value === null)
            return null;

        var bufferSize = lengthBytesUTF8(value) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(value, buffer, bufferSize);
        return buffer;
    },

    GetNumber: function (ptr) {
        return LKBridge.Data.get(ptr);
    },

    GetBoolean: function (ptr) {
        return LKBridge.Data.get(ptr);
    },
    
    CopyData: function(ptr, buff, offset, count) {
        var value = LKBridge.Data.get(ptr);
        var arr = new Uint8Array(value, offset, count);
        HEAPU8.set(arr, buff);
    },

    RetrieveBridgeObject: function(){
        return LKBridge.AddRef(LKBridge.GetOrNewRef(LKBridge));
    },
    
    RetrieveWindowObject: function(){
        return LKBridge.AddRef(LKBridge.GetOrNewRef(window));
    },

    // Video Receive
    NewTexture: function () {
        var tex = GLctx.createTexture();
        if (!tex){
            console.error("Failed to create a new texture for VideoReceiving")
            return LKBridge.NullPtr;
        }

        var id = GL.getNewId(GL.textures);
        tex.name = id;
        GL.textures[id] = tex;
        return id;
    },

    DestroyTexture: function (id) {
        GLctx.deleteTexture(GL.textures[id]);
    },

    AttachVideo: function (videoPtr, texId) {
        var tex = GL.textures[texId];
        var lastTime = -1;

        var initialVideo = LKBridge.Data.get(videoPtr);
        initialVideo.style.opacity = 0;
        initialVideo.style.width = 0;
        initialVideo.style.height = 0;
        setTimeout(function() {
            initialVideo.play();
        }, 0)
        initialVideo.addEventListener("canplay", (event) => {
            initialVideo.play();
        });
 
        document.body.appendChild(initialVideo);
        var updateVideo = function () {
            var video = LKBridge.Data.get(videoPtr);
            if (video === undefined) {
                initialVideo.remove();
                return;
            }
            
            var time = video.currentTime;
            if (!video.paused && video.srcObject !== null && time !== lastTime) {
                lastTime = time;
                GLctx.bindTexture(GLctx.TEXTURE_2D, tex);
                
                // Flip Y
                GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, true);
                GLctx.texImage2D(GLctx.TEXTURE_2D, 0, LKBridge.IsLinear ? GLctx.SRGB8_ALPHA8 : GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, video);
                GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, false);

                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MAG_FILTER, GLctx.LINEAR);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
                GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
            }
            
            requestAnimationFrame(updateVideo);
        };
        
        requestAnimationFrame(updateVideo);
    },
};

autoAddDeps(NativeLib, '$LKBridge');
mergeInto(LibraryManager.library, NativeLib);
