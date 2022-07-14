using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    /*
     * JSObject ensures that we are using a non-null reference
     */
    public class JSObject : JSRef
    {
        [Preserve]
        internal JSObject(JSHandle handle) : base(handle)
        {
            if (JSNative.IsUndefined(handle) || JSNative.IsNull(handle))
                Debug.LogError($"An object reference cannot be null, {GetType()}");
        }

        internal JSObject()
        {
            
        }
    }
}
