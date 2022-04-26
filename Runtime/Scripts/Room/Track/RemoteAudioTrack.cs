using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteAudioTrack : RemoteTrack
    {
        [Preserve]
        internal RemoteAudioTrack(JSHandle handle) : base(handle)
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
    }
}