using System;
using System.Collections.Generic;

namespace LiveKit
{
    internal class JSEventReceiver<T> : JSRef
    {
        // TODO Release events when a Participant disconnects ?
        private static List<JSRef> s_Receivers = new List<JSRef>(); // Avoid EventReceiver from being garbage collected
        
        public readonly WeakReference<JSRef> JSRef;
        public readonly T Event;

        public static void ListenEvent(JSRef jsRef, T e, Action<IntPtr> receiver)
        {
            s_Receivers.Add(new JSEventReceiver<T>(jsRef, e, receiver));
        }
        
        private JSEventReceiver(JSRef jsRef, T e, Action<IntPtr> receiver) : base(JSNative.NewRef())
        {
            JSRef = new WeakReference<JSRef>(jsRef);
            Event = e;

            JSNative.PushString(Utils.ToEnumString(e));
            JSNative.PushFunction(NativePtr, receiver);
            Acquire(JSNative.CallMethod(jsRef.NativePtr, "on"));
        }
    }
}