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
                return Utils.ToEnum<TrackStreamState>(JSNative.GetString(JSNative.GetProperty(NativePtr)));
            }
        }
        
        [Preserve]
        internal RemoteTrack(JSHandle ptr) : base(ptr)
        {

        }

        public void Start()
        {
            JSNative.CallMethod(NativePtr, "start");
        }
    }
}