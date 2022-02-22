using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLMediaElement : HTMLElement
    {
        [Preserve]
        public HTMLMediaElement(IntPtr ptr) : base(ptr)
        {

        }
    }
}