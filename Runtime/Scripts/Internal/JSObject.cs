using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    /*
     * JSObject ensures that we are using a non-null reference
     */
    public class JSObject : JSRef
    {
        public static HashSet<JSObject> s_Cache = new HashSet<JSObject>();

        public static void KeepAlive(JSObject obj)
        {
            s_Cache.Add(obj);
        }

        [Preserve]
        public JSObject(JSHandle ptr) : base(ptr)
        {
            if (JSNative.IsUndefined(ptr) || JSNative.IsNull(ptr))
                throw new ArgumentException($"An object reference cannot be null, {GetType()}");
        }

        internal JSObject() : base(JSNative.NewRef())
        {
            Debug.Log("Base has been called");
            JSNative.AddRef(NativePtr);
        }
    }
}
