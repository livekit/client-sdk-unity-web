using System;
using System.Collections.Generic;

namespace LiveKit
{
    internal class JSEventListener<T> : JSRef
    {
        public readonly WeakReference<JSRef> JSRef;
        public readonly T Event;

        public JSEventListener(JSRef jsRef, T e, Action<IntPtr> receiver) : base(JSNative.NewRef())
        {
            JSRef = new WeakReference<JSRef>(jsRef);
            Event = e;

            JSNative.PushString(Utils.ToEnumString(e));
            JSNative.PushFunction(NativePtr, receiver);
            Acquire(JSNative.CallMethod(jsRef.NativePtr, "on"));
        }
    }
}