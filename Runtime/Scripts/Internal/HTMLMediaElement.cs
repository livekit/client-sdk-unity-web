using AOT;
using System;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLMediaElement : HTMLElement
    {
        private static List<HTMLMediaElement> m_Attached = new List<HTMLMediaElement>();
        
        // This method is called when the track has been detached
        // Not sure if this is the best event to hook
        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void EmptiedEvent(IntPtr ptr)
        {
            var handle = new JSHandle(ptr, true);
            if (!JSNative.IsObject(handle))
                return;
            
            var el = Acquire<HTMLMediaElement>(handle);
            m_Attached.Remove(el);
        }
        
        public float Volume
        {
            get
            {
                JSNative.PushString("volume");
                return (float) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
            set
            {
                JSNative.PushString("volume");
                JSNative.PushNumber(value);
                JSNative.SetProperty(NativePtr);
            }
        }

        [Preserve]
        public HTMLMediaElement(JSHandle ptr) : base(ptr)
        {
            m_Attached.Add(this);
            //AddEventListener("emptied", EmptiedEvent); // TODO This is breaking VideoTrack on mute
        }
    }
}