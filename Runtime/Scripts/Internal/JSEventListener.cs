using System;

namespace LiveKit
{
    internal class JSEventListener<T> : JSObject
    {
        public readonly WeakReference<JSRef> JSRef;
        public readonly T Event;

        public JSEventListener(JSRef jsRef, T e, JSNative.JSDelegate receiver)
        {
            JSRef = new WeakReference<JSRef>(jsRef);
            Event = e;

            JSNative.PushString(Utils.ToEnumString(e));
            JSNative.PushFunction(NativePtr, receiver);
            Acquire(JSNative.CallMethod(jsRef.NativePtr, "on"));
        }
    }
}