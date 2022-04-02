using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLElement : JSObject
    {
        [Preserve]
        public HTMLElement(JSHandle ptr) : base(ptr)
        {
        
        }

        internal void AddEventListener(string e, JSNative.JSDelegate callback, JSHandle identifier = null)
        {
            if (identifier == null)
                identifier = NativePtr;

            JSNative.PushString(e);
            JSNative.PushFunction(identifier, callback);
            JSNative.CallMethod(NativePtr, "addEventListener");
        }
    }
}