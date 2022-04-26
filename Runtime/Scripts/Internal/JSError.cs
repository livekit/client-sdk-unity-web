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
                return JSNative.GetString(JSNative.GetProperty(NativeHandle));
            }
        }

        public string Message
        {
            get
            {
                JSNative.PushString("message");
                return JSNative.GetString(JSNative.GetProperty(NativeHandle));
            }
        }


        [Preserve]
        internal JSError(JSHandle handle) : base(handle)
        {

        }
    }
}