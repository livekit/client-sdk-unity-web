var NativeLib = {
	$BridgeData: {},
	$BridgePtr: {}, // O(1)
	$RefCounter: 1, // 0 is nullptr
	$Stack: [],
	$StackCSharp: [],

	$NewRef: function () {
		return RefCounter++;
	},

	$SetRef: function (ptr, obj) {
		BridgeData[ptr] = obj;

		if (obj !== undefined || obj !== null) {
			BridgePtr[obj] = ptr;
        }
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
			oPtr = NewRef();
			SetRef(oPtr, obj);
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

	PushStruct: function (json) {
		Stack.push(JSON.parse(Pointer_stringify(json)));
	},

	PushFunction: function (ptr, fnc) {
		Stack.push(function () {
			StackCSharp = arguments;
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
		var ptr = NewRef();
		var v = StackCSharp.shift();
		SetRef(ptr, v);
		return ptr;
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

autoAddDeps(NativeLib, '$NewRef');
autoAddDeps(NativeLib, '$SetRef');
autoAddDeps(NativeLib, '$BridgeData');
autoAddDeps(NativeLib, '$BridgePtr');
autoAddDeps(NativeLib, '$RefCounter');
autoAddDeps(NativeLib, '$Stack');
autoAddDeps(NativeLib, '$StackCSharp');

mergeInto(LibraryManager.library, NativeLib);