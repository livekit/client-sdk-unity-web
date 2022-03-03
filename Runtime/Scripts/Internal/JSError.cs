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
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }

        public string Message
        {
            get
            {
                JSNative.PushString("message");
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }


        [Preserve]
        public JSError(IntPtr ptr) : base(ptr)
        {

        }
    }
}