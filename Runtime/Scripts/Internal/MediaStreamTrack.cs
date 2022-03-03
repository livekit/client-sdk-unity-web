using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class MediaStreamTrack : JSObject
    {

        [Preserve]
        public MediaStreamTrack(IntPtr ptr) : base(ptr) {

        }
    }
}