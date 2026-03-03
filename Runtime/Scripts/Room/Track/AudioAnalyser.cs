using UnityEngine.Scripting;

namespace LiveKit
{
    public interface IAudioAnalyser
    {
        float CalculateAvgAmplitude();
        void Cleanup();
    }
    public sealed class AudioAnalyser : JSObject, IAudioAnalyser
    {
        [Preserve]
        internal AudioAnalyser(JSHandle handle) : base(handle)
        {
        }
        public float CalculateAvgAmplitude()
        {
            var ret = JSNative.CallMethod(NativeHandle, "calculateVolume");
            return (float)JSNative.GetNumber(ret);
        }
        public void Cleanup()
        {
            JSNative.CallMethod(NativeHandle, "cleanup");
        }
    }
}