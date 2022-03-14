using Newtonsoft.Json;

namespace LiveKit
{
    public class Client
    {
        public static JSPromise<JSArray<LocalTrack>> CreateLocalTracks(CreateLocalTracksOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSNative.LiveKit.NativePtr, "createLocalTracks"));
        }

        public static JSPromise<LocalVideoTrack> CreateLocalVideoTrack(VideoCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalVideoTrack>>(JSNative.CallMethod(JSNative.LiveKit.NativePtr, "createLocalVideoTrack"));
        }

        public static JSPromise<LocalAudioTrack> CreateLocalAudioTrack(AudioCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalAudioTrack>>(JSNative.CallMethod(JSNative.LiveKit.NativePtr, "createLocalAudioTrack"));
        }

        public static JSPromise<JSArray<LocalTrack>> CreateLocalScreenTracks(ScreenShareCaptureOptions? options)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSNative.LiveKit.NativePtr, "createLocalScreenTracks"));
        }

        public static ConnectOperation Connect(string url, string token, ConnectOptions? options)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);

            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return new ConnectOperation(JSRef.Acquire<JSPromise<Room>>(JSNative.CallMethod(JSNative.LiveKit.NativePtr, "connect")));
        }
    }
}