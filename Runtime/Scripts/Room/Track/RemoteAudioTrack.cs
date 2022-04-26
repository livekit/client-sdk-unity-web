using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteAudioTrack : RemoteTrack
    {
        [Preserve]
        internal RemoteAudioTrack(JSHandle ptr) : base(ptr)
        {

        }

        public void SetVolume(float volume)
        {
            JSNative.PushNumber(volume);
            JSNative.CallMethod(NativePtr, "setVolume");
        }

        public float GetVolume()
        {
            return (float) JSNative.GetNumber(JSNative.CallMethod(NativePtr, "getVolume"));
        }
    }
}