using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteAudioTrack : RemoteTrack
    {

        [Preserve]
        public RemoteAudioTrack(JSHandle ptr) : base(ptr)
        {

        }

    }

}