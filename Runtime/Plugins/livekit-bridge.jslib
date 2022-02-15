var NativeLib = {
	$BridgeData: {
		0: {
			data: new Uint8Array([10, 20, 30, 40, 50, 60])
        }
	},

	InstanceGetString: function (ptr, property) {
		if (!BridgeData[ptr])
			return;

		var value = BridgeData[ptr][Pointer_stringify(property)];
		var bufferSize = lengthBytesUTF8(value) + 1;
		var buffer = _malloc(bufferSize);
		stringToUTF8(value, buffer, bufferSize);
		return buffer;
	},

	InstanceGetNumber: function (ptr, property) {
		if (!BridgeData[ptr])
			return;

		var value = BridgeData[ptr][Pointer_stringify(property)];
		return value;
	},

	InstanceGetBool: function (ptr, property) {
		if (!BridgeData[ptr])
			return;

		var value = BridgeData[ptr][Pointer_stringify(property)];
		return value;
	},

	InstanceGetDataPtr: function (ptr, property) {
		if (!BridgeData[ptr])
			return;

		var value = BridgeData[ptr][Pointer_stringify(property)];
		var arr = new Uint8Array(value);
		var ptr = _malloc(arr.byteLength + 4);
		HEAP32.set([arr.length], ptr >> 2); // First 4 bytes is the size of the array 
		HEAPU8.set(arr, ptr + 4);

		// TODO Should I free ptr ?
		return ptr;
    },

	InstanceSetter: function(ptr, property, type, value){
		
	}
};

autoAddDeps(NativeLib, '$BridgeData');
mergeInto(LibraryManager.library, NativeLib);