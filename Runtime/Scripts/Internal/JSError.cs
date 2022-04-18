using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSError : JSObject
    {
        public string Name
        {
            get
            {
                JSNative.PushString("name");
                return JSNative.GetString(JSNative.GetProperty(NativePtr));
            }
        }

        public string Message
        {
            get
            {
                JSNative.PushString("message");
                return JSNative.GetString(JSNative.GetProperty(NativePtr));
            }
        }


        [Preserve]
        public JSError(JSHandle ptr) : base(ptr)
        {

        }
    }
}