using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteTrackPublication : TrackPublication
    {
        [Preserve]
        public RemoteTrackPublication(IntPtr ptr) : base(ptr)
        {

        }
    }
}