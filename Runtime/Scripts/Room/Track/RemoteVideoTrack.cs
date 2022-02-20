using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteVideoTrack : RemoteTrack
    {
        [Preserve]
        public RemoteVideoTrack(IntPtr ptr) : base(ptr)
        {

        }
    }
}