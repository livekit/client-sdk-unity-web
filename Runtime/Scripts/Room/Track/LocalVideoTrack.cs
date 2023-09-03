using Newtonsoft.Json;
using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalVideoTrack : LocalTrack, IVideoTrack
    {

        public bool IsSimulcast
        {
            get
            {
                JSNative.PushString("isSimulcast");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }

        [Preserve]
        internal LocalVideoTrack(JSHandle handle) : base(handle)
        {
            
        }

        public void SetPublishingQuality(VideoQuality maxQuality)
        {
            JSNative.PushNumber((double)maxQuality);
            JSNative.CallMethod(NativeHandle, "setPublishingQuality");
        }

        public JSPromise SetDeviceId(string deviceId)
        {
            JSNative.PushString(deviceId);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "setDeviceId"));
        }

        public JSPromise RestartTrack(VideoCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "restartTrack"));
        }

        public JSPromise SetProcessor (JSHandle processor, bool showProcessedStreamLocally = true) {
            JSNative.PushObject (processor);
            JSNative.PushBoolean (showProcessedStreamLocally);
            return Acquire<JSPromise> (JSNative.CallMethod (NativeHandle, "setProcessor"));
        }
    }
}