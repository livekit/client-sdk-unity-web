using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteParticipant : Participant
    {
        [Preserve]
        internal RemoteParticipant(JSHandle handle) : base(handle)
        {

        }
        
        public void SetVolume(float volume)
        {
            JSNative.PushNumber(volume);
            JSNative.CallMethod(NativeHandle, "setVolume");
        }

        public float GetVolume()
        {
            return (float) JSNative.GetNumber(JSNative.CallMethod(NativeHandle, "getVolume"));
        }

        public new RemoteTrackPublication GetTrack(TrackSource source)
        {
            return base.GetTrack(source) as RemoteTrackPublication;
        }

        public new RemoteTrackPublication GetTrackByName(string name)
        {
            return base.GetTrackByName(name) as RemoteTrackPublication;
        }

        public RemoteTrackPublication GetTrackPublication(string sid)
        {
            JSNative.PushString(sid);

            var ptr = JSNative.CallMethod(NativeHandle, "getTrackPublication");
            if (!JSNative.IsObject(ptr))
                return null;
            
            return Acquire<RemoteTrackPublication>(ptr);
        }
    }
}