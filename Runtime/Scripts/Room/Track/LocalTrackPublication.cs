using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class LocalTrackPublication : TrackPublication
    {
        [Preserve]
        public LocalTrackPublication(IntPtr ptr) : base(ptr)
        {

        }

    }

}