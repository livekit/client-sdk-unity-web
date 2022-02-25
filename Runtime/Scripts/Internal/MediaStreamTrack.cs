using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class MediaStreamTrack : JSRef
    {

        [Preserve]
        public MediaStreamTrack(IntPtr ptr) : base(ptr) {

        }
    }
}