using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class LocalAudioTrack : LocalTrack
    {
        [Preserve]
        public LocalAudioTrack(IntPtr ptr) : base(ptr)
        {

        }

    }

}