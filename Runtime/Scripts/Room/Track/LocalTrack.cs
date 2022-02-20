using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrack : Track
    {
        [Preserve]
        public LocalTrack(IntPtr ptr) : base(ptr)
        {

        }
    }

}