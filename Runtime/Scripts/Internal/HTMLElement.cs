using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLElement : JSObject
    {
        [Preserve]
        internal HTMLElement(JSHandle handle) : base(handle)
        {
        
        }

        internal void AddEventListener(string e, JSNative.JSDelegate callback, JSHandle identifier = null)
        {
            if (identifier == null)
                identifier = NativeHandle;

            JSNative.PushString(e);
            JSNative.PushFunction(identifier, callback, $"HTMLElement - EventListener: {e}");
            JSNative.CallMethod(NativeHandle, "addEventListener");
        }
    }
}