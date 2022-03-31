using System;
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
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackStreamState>(ptr.ToString());
            }
        }
        
        [Preserve]
        public RemoteTrack(JSHandle ptr) : base(ptr)
        {

        }

        public void Start()
        {
            Acquire(JSNative.CallMethod(NativePtr, "start"));
        }
    }
}