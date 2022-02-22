using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLMediaElement : JSRef
    {
        [Preserve]
        public HTMLMediaElement(IntPtr ptr) : base(ptr)
        {

        }
    }
}