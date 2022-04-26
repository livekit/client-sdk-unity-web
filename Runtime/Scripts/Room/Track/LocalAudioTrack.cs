using Newtonsoft.Json;
using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalAudioTrack : LocalTrack
    {
        [Preserve]
        internal LocalAudioTrack(JSHandle handle) : base(handle)
        {

        }

        public JSPromise SetDeviceId(string deviceId)
        {
            JSNative.PushString(deviceId);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "setDeviceId"));
        }

        public JSPromise RestartTrack(AudioCaptureOptions? options = null)
        {
            if(options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "restartTrack"));
        }
    }
}