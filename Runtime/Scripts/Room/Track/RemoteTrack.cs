using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteTrack : Track
    {
        public TrackStreamState StreamState
        {
            get
            {
                JSNative.PushString("streamState");
                return Utils.ToEnum<TrackStreamState>(JSNative.GetString(JSNative.GetProperty(NativeHandle)));
            }
        }
        
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