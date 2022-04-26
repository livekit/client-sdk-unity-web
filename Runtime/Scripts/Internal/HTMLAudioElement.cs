using UnityEngine.Scripting;

namespace LiveKit
{

    public class HTMLAudioElement : HTMLMediaElement
    {
        [Preserve]
        internal HTMLAudioElement(JSHandle ptr) : base(ptr)
        {

        }
    }
}