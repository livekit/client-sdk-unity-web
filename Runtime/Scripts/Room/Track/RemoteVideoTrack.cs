using System.Linq;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteVideoTrack : RemoteTrack, IVideoTrack
    {
        public bool IsAdaptiveStream
        {
            get
            {
                JSNative.PushString("isAdaptiveStream");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }

        [Preserve]
        internal RemoteVideoTrack(JSHandle handle) : base(handle)
        {

        }
    }
}