using System.Collections.Generic;
using System.Linq;
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
        
        internal readonly Dictionary<T, EventWrapper> Events = new Dictionary<T, EventWrapper>();

        [Preserve]
        public JSEventEmitter(JSHandle ptr) : base(ptr)
        {
            SetKeepAlive(NativePtr, true);
        }

        internal JSEventEmitter()
        {
            SetKeepAlive(NativePtr, true);
        }
        
        ~JSEventEmitter()
        {
            // Clear events automatically 
            foreach(var k in Events.Keys.ToList())
                RemoveListener(k);                
            
            SetKeepAlive(NativePtr, false);
        }

        // Similar to "on" but we only accepts one listener (No need for multiple in internal use)
        internal void SetListener(T eventt, JSNative.JSDelegate fnc)
        {
            var wrapper = new EventWrapper()
            {
                Event = eventt,
                FncRef = new JSRef()
            };
            
            SetKeepAlive(wrapper.FncRef, true);
            
            Events.Add(eventt, wrapper);
            
            JSNative.PushFunction(wrapper.NativePtr, fnc);
            JSNative.SetRef(wrapper.FncRef.NativePtr);
            
            JSNative.PushString(Utils.ToEnumString(eventt));
            JSNative.PushObject(wrapper.FncRef.NativePtr);
            JSNative.CallMethod(NativePtr, "on");
        }

        internal void RemoveListener(T eventt)
        {
            if (!Events.TryGetValue(eventt, out var wrapper))
                return;
            
            SetKeepAlive(wrapper.FncRef, false);
            
            JSNative.PushString(Utils.ToEnumString(eventt));
            JSNative.PushObject(wrapper.FncRef.NativePtr);
            JSNative.CallMethod(NativePtr, "removeListener");

            Events.Remove(eventt);
        }
    }
}