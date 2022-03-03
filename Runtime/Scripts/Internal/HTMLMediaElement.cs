using AOT;
using System;
using System.Collections.Generic;
using UnityEngine;
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
            var el = AcquireOrNull<HTMLMediaElement>(ptr);
            if (el == null)
                return;

            m_Attached.Remove(el);
        }

        [Preserve]
        public HTMLMediaElement(IntPtr ptr) : base(ptr)
        {
            m_Attached.Add(this);
            AddEventListener("emptied", EmptiedEvent);
        }
    }
}