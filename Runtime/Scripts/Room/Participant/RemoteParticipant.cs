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

        public new RemoteTrackPublication GetTrackPublication(TrackSource source)
        {
            return base.GetTrackPublication(source) as RemoteTrackPublication;
        }

        public new RemoteTrackPublication GetTrackPublicationByName(string name)
        {
            return base.GetTrackPublicationByName(name) as RemoteTrackPublication;
        }


        public new RemoteTrackPublication GetTrackPublicationBySid(string sid)
        {
            return base.GetTrackPublicationBySid(sid) as RemoteTrackPublication;
        }

        public JSMap<string, RemoteTrackPublication> RemotePublications
        {
            get
            {
                JSNative.PushString("trackPublications");
                return Acquire<JSMap<string, RemoteTrackPublication>>(JSNative.GetProperty(NativeHandle));
            }
        }
    }
}