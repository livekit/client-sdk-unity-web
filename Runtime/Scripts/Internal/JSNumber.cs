using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSNumber : JSObject
    {
        [Preserve]
        public JSNumber(JSHandle ptr) : base(ptr)
        {

        }
        public double ToNumber()
        {
            return JSNative.GetNumber(NativePtr);
        }
    }
}
