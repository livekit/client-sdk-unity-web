using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class MediaStreamTrack : JSObject
    {

        [Preserve]
        internal MediaStreamTrack(JSHandle ptr) : base(ptr) 
        {

        }
    }
}