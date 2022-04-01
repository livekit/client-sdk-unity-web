using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSEventEmitter<T> : JSObject
    {
        internal class EventWrapper : JSObject
        {
            public T Event;
            public JSRef FncRef;
        }
        
        private readonly Dictionary<T, EventWrapper> m_Events = new Dictionary<T, EventWrapper>();

        [Preserve]
        public JSEventEmitter(JSHandle ptr) : base(ptr)
        {
            
        }

        internal JSEventEmitter()
        {
            
        }

        ~JSEventEmitter()
        {
            foreach (var k in m_Events.Keys)
                RemoveListener(k);
        }

        // Similar to "on" but we only accepts one listener (No need for multiple in internal use)
        internal void SetListener(T eventt, JSNative.JSDelegate fnc)
        {
            var fncRef = new JSRef();
            var wrapper = new EventWrapper()
            {
                Event = eventt,
                FncRef = fncRef
            };
            
            JSNative.PushFunction(wrapper.NativePtr, fnc);
            JSNative.SetRef(fncRef.NativePtr);
            
            JSNative.PushString(Utils.ToEnumString(eventt));
            JSNative.PushObject(fncRef.NativePtr);
            JSNative.CallMethod(NativePtr, "on");

            m_Events.Add(eventt, wrapper);
        }

        internal void RemoveListener(T eventt)
        {
            Log.Info($"Removing listener {eventt} for {GetType()}");
            
            var wrapper = m_Events[eventt];
            JSNative.PushString(Utils.ToEnumString(eventt));
            JSNative.PushObject(wrapper.FncRef.NativePtr);
            JSNative.CallMethod(NativePtr, "removeListener");

            m_Events.Remove(eventt);
        }
    }
}