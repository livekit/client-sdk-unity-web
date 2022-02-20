using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteAudioTrack : RemoteTrack
    {

        [Preserve]
        public RemoteAudioTrack(IntPtr ptr) : base(ptr)
        {

        }

    }

}