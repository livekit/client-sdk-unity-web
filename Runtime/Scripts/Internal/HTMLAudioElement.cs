using UnityEngine.Scripting;

namespace LiveKit
{

    public class HTMLAudioElement : HTMLMediaElement
    {
        [Preserve]
        public HTMLAudioElement(JSHandle ptr) : base(ptr)
        {

        }
    }
}