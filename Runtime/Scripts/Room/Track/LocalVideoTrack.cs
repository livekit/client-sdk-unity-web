using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalVideoTrack : LocalTrack
    {
        [Preserve]
        public LocalVideoTrack(IntPtr ptr) : base(ptr)
        {

        }
    }
}