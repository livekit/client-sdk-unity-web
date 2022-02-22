using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLElement : JSRef
    {
        [Preserve]
        public HTMLElement(IntPtr ptr) : base(ptr)
        {

        }

        public void AddEventListener(string e, Action<IntPtr> callback, IntPtr? identifier = null)
        {
            if (identifier == null)
                identifier = NativePtr;

            JSNative.PushString(e);
            JSNative.PushFunction(identifier.Value, callback);
            JSNative.CallMethod(NativePtr, "addEventListener");
        }
    }
}