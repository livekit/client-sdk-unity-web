using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSObject : JSRef
    {


        [Preserve]
        public JSObject(IntPtr ptr) : base(ptr)
        {
            if (JSNative.IsUndefined(ptr) || JSNative.IsNull(ptr))
                throw new ArgumentException("An object reference cannot be null");
        }

        public JSObject() : base(JSNative.NewRef())
        {
            
        }
    }
}
