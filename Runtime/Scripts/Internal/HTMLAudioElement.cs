using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class HTMLAudioElement : HTMLMediaElement
    {
        [Preserve]
        public HTMLAudioElement(IntPtr ptr) : base(ptr)
        {

        }
    }
}