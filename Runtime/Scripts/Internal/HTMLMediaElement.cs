using System;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLMediaElement : HTMLElement
    {
        // TODO Think about when to release the reference ?
        private static List<HTMLMediaElement> m_Attached = new List<HTMLMediaElement>(); // Keep a reference

        [Preserve]
        public HTMLMediaElement(IntPtr ptr) : base(ptr)
        {
            m_Attached.Add(this);
        }
    }
}