using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSString : JSObject
    {
        [Preserve]
        public JSString(JSHandle ptr) : base(ptr)
        {

        }

        public override string ToString()
        {
            return JSNative.GetString(NativePtr);
        }
    }
}
