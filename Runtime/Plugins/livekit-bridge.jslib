var NativeLib = {
	$BridgeData: {},
	$BridgePtr: {}, // O(1)
	$RefCounter: 1, // 0 is nullptr
	$Stack: [],
	$StackCSharp: [],
	$nullptr: 0,

	$NewRef: function () {
		return RefCounter++;
	},

	$SetRef: function (ptr, obj) {
		BridgeData[ptr] = obj;

		if (obj !== undefined && obj !== null) {
			BridgePtr[obj] = ptr;
        }
	},

	$GetOrNewRef: function (obj) {
		// Always create a new ref for primitives
		var ptr; 
		if (typeof val !== "object" || obj === null || !(obj in BridgePtr)) {
			ptr = NewRef();
			SetRef(ptr, obj);
		} else {
			ptr = BridgePtr[obj];
		}

		return ptr;
	},

	NewRef: function () {
		return NewRef();
	},

	FreeRef: function (ptr) {
		var obj = BridgeData[ptr];
		delete BridgePtr[obj];
		delete BridgeData[ptr];
	},

	GetProperty: function (ptr, str) {
		str = Pointer_stringify(str);
		var obj;
		if (ptr == nullptr) {
			obj = window[str];
		} else {
			if (!(ptr in BridgeData))
				return nullptr;

			obj = BridgeData[ptr][str];
        }

		if (!obj)
			return nullptr;

		return GetOrNewRef(obj);
	},

	IsNull: function (ptr) {
		var obj = BridgeData[ptr];
		return obj === null;
	},

	IsUndefined: function (ptr) {
		var obj = BridgeData[ptr];
		return obj === undefined;
	},

	IsString: function (ptr) {
		var obj = BridgeData[ptr];
		return typeof obj === 'string' || obj instanceof String;
	},

	IsObject: function (ptr) {
		var obj = BridgeData[ptr];
		return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
	},

	PushNull: function () {
		Stack.push(null);
	},

	PushNumber: function (nb) {
		Stack.push(nb);
	},

	PushBoolean: function (bool) {
		Stack.push(bool);
	},

	PushString: function (str) {
		Stack.push(Pointer_stringify(str));
	},

	PushStruct: function (json) {
		Stack.push(JSON.parse(Pointer_stringify(json)));
	},

	PushFunction: function (ptr, fnc) {
		Stack.push(function () {
			StackCSharp = Array.from(arguments);
			Runtime.dynCall("vi", fnc, [ptr]);
			StackCSharp = [];
        });
	},

	CallFunction: function (str) {
		var returnptr = NewRef();
		var fnc = window[Pointer_stringify(str)];
		var result = fnc.apply(null, Stack);
		SetRef(returnptr, result);
		Stack = [];
		return returnptr;
	},

	CallMethod: function (ptr, str) {
		var returnptr = NewRef();
		var obj = BridgeData[ptr];
		var fnc = obj[Pointer_stringify(str)]
		var result = fnc.apply(obj, Stack);
		SetRef(returnptr, result);
		Stack = [];
		return returnptr;
	},

	NewInstance: function (ptr, toPtr, clazz) {
		var obj;
		if (ptr == 0) {
			obj = window;
		} else {
			obj = BridgeData[ptr];
		}

		var inst = new (Function.prototype.bind.apply(obj[Pointer_stringify(clazz)], Stack));
		SetRef(toPtr, inst);
		Stack = [];
	},

	ShiftStack: function () {
		var v = StackCSharp.shift();
		return GetOrNewRef(v);
    },

	GetString: function (ptr) {
		var value = BridgeData[ptr];
		var bufferSize = lengthBytesUTF8(value) + 1;
		var buffer = _malloc(bufferSize);
		stringToUTF8(value, buffer, bufferSize);
		return buffer;
	},

	GetNumber: function (ptr) {
		var value = BridgeData[ptr];
		return value;
	},

	GetBool: function (ptr) {
		var value = BridgeData[ptr];
		return value;
	},

	GetDataPtr: function (ptr) {
		var value = BridgeData[ptr];
		var arr = new Uint8Array(value);
		var ptr = _malloc(arr.byteLength + 4);
		HEAP32.set([arr.length], ptr >> 2); // First 4 bytes is the size of the array 
		HEAPU8.set(arr, ptr + 4);
		setTimeout(function () {
			_free(ptr);
		}, 0);
		return ptr;
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
