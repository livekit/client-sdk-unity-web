using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSBoolean : JSObject
    {
        [Preserve]
        public JSBoolean(IntPtr ptr) : base(ptr)
        {

        }

        public bool ToBool()
        {
            return JSNative.GetBoolean(NativePtr);
        }

        public static explicit operator bool(JSBoolean b)
        {
            return b.ToBool();
        }
    }
}
