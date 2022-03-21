using System;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    /*
     * JSObject ensures that we are using a non-null reference
     */
    public class JSObject : JSRef
    {
        [Preserve]
        public JSObject(IntPtr ptr) : base(ptr)
        {
            if (JSNative.IsUndefined(ptr) || JSNative.IsNull(ptr))
                throw new ArgumentException($"An object reference cannot be null, {GetType()}");
        }

        internal JSObject() : base(JSNative.NewRef())
        {
            
        }
    }
}
