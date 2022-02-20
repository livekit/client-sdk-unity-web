using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteTrack : Track
    {
        [Preserve]
        public RemoteTrack(IntPtr ptr) : base(ptr)
        {

        }
    }
}