using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class MediaStreamTrack : JSObject
    {

        [Preserve]
        public MediaStreamTrack(JSHandle ptr) : base(ptr) 
        {

        }
    }
}