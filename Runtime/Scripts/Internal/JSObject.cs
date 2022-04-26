using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    /*
     * JSObject ensures that we are using a non-null reference
     */
    public class JSObject : JSRef
    {
        [Preserve]
        internal JSObject(JSHandle ptr) : base(ptr)
        {
            if (JSNative.IsUndefined(ptr) || JSNative.IsNull(ptr))
                throw new ArgumentException($"An object reference cannot be null, {GetType()}");
        }

        internal JSObject()
        {
            
        }
    }
}
