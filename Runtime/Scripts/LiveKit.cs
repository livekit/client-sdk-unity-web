
using Newtonsoft.Json;

namespace LiveKit
{
    public class Client
    {

        public static JSPromise<JSArray<LocalTrack>> CreateLocalTracks(CreateLocalTracksOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalTracks"));
        }

        public static JSPromise<LocalVideoTrack> CreateLocalVideoTrack(VideoCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalVideoTrack>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalVideoTrack"));
        }

        public static JSPromise<LocalAudioTrack> CreateLocalAudioTrack(AudioCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalAudioTrack>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalAudioTrack"));
        }

        public static JSPromise<LocalAudioTrack> createLocalAudioTrack(AudioCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalAudioTrack>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalAudioTrack"));
        }

        public static JSPromise<JSArray<LocalTrack>> CreateLocalScreenTracks(ScreenShareCaptureOptions? options)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalScreenTracks"));
        }
    }
}