var NativeLib = {

    InitCopyPaste: function (fnc) {
        window.addEventListener('paste', function (e) {
            var data = e.clipboardData.getData('text');
            var bufferSize = lengthBytesUTF8(data) + 1;
            var buffer = _malloc(bufferSize);
            stringToUTF8(data, buffer, bufferSize);

            if (typeof Runtime !== "undefined") {
                Runtime.dynCall("vi", fnc, [buffer]);
            } else {
                dynCall("vi", fnc, [buffer]);
            }
        });
    },

};

mergeInto(LibraryManager.library, NativeLib);