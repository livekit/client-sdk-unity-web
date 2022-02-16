var NativeLib = {
	$BridgeData: {},
	$BridgePtr: {}, // O(1)
	$RefCounter: 1, // 0 is nullptr
	$Stack: [],

	NewRef: function () {
		return RefCounter++;
	},

	FreeRef: function (ptr) {
		if (ptr in BridgeData) {
			var obj = BridgeData[ptr];
			delete BridgePtr[obj];
        }

		delete BridgeData[ptr];
	},

	// Get a property by string from an object (if ptr = 0, then the object is window)
	GetRef: function (ptr, str) {
		str = Pointer_stringify(str);
		var obj;
		if (ptr == 0) {
			obj = window[str];
		} else {
			if (!(ptr in BridgeData))
				return 0;

			obj = BridgeData[ptr][str];
        }

		if (!obj)
			return 0;

		var oPtr;
		if (!(obj in BridgePtr)) {
			oPtr = RefCounter++;
			BridgeData[oPtr] = obj;
			BridgePtr[obj] = oPtr;
		} else {
			oPtr = BridgePtr[obj];
		}

		return oPtr;
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

	CallFunction: function (str) {
		var fnc = window[Pointer_stringify(str)];
		fnc.apply(Stack);
		Stack = [];
	},

	CallMethod: function (ptr, str) {
		var fnc = BridgeData[ptr][Pointer_stringify(str)];
		fnc.apply(Stack);
		Stack = [];
	},

	NewInstance: function (ptr, toPtr, clazz) {
		var obj;
		if (ptr == 0) {
			obj = window;
		} else {
			obj = BridgeData[ptr];
		}

		var inst = new (Function.prototype.bind.apply(obj[Pointer_stringify(clazz)], Stack));
		BridgeData[toPtr] = inst;
		BridgePtr[inst] = toPtr;
		Stack = [];
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

	GetData: function (ptr) {
		var value = BridgeData[ptr];
		var arr = new Uint8Array(value);
		var ptr = _malloc(arr.byteLength + 4);
		HEAP32.set([arr.length], ptr >> 2); // First 4 bytes is the size of the array 
		HEAPU8.set(arr, ptr + 4);

		// TODO Should I free ptr ?
		return ptr;
    },
};

autoAddDeps(NativeLib, '$BridgeData');
autoAddDeps(NativeLib, '$BridgePtr');
autoAddDeps(NativeLib, '$RefCounter');
autoAddDeps(NativeLib, '$Stack');

mergeInto(LibraryManager.library, NativeLib);