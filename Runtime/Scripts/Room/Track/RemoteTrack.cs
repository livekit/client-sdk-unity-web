using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteTrack : Track
    {
        [Preserve]
        internal RemoteTrack(JSHandle handle) : base(handle)
        {

        }

        public void Start()
        {
            JSNative.CallMethod(NativeHandle, "start");
        }
    }
}