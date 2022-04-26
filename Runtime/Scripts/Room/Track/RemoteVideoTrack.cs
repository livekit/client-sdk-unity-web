using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteVideoTrack : RemoteTrack
    {
        public bool IsAdaptiveStream
        {
            get
            {
                JSNative.PushString("isAdaptiveStream");
                return JSNative.GetBoolean(JSNative.GetProperty(NativePtr));
            }
        }

        [Preserve]
        internal RemoteVideoTrack(JSHandle ptr) : base(ptr)
        {

        }
    }
}