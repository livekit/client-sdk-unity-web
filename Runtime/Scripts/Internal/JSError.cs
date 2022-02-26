using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSError : JSRef
    {
        public string Name
        {
            get
            {
                JSNative.PushString("name");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Message
        {
            get
            {
                JSNative.PushString("message");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Stack
        {
            get
            {
                JSNative.PushString("stack");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
            }
        }

        [Preserve]
        public JSError(IntPtr ptr) : base(ptr)
        {

        }
    }
}