using System;
using Newtonsoft.Json;

namespace LiveKit
{
    public class Client
    {
        public static void SetLogLevel(LogLevel level)
        {
            JSNative.PushString(Utils.ToEnumString(level));
            JSNative.CallMethod(JSNative.LiveKit, "setLogLevel");
        }
        
        public static JSPromise<JSArray<LocalTrack>> CreateLocalTracks(CreateLocalTracksOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSNative.LiveKit, "createLocalTracks"));
        }

        public static JSPromise<LocalVideoTrack> CreateLocalVideoTrack(VideoCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalVideoTrack>>(JSNative.CallMethod(JSNative.LiveKit, "createLocalVideoTrack"));
        }

        public static JSPromise<LocalAudioTrack> CreateLocalAudioTrack(AudioCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<LocalAudioTrack>>(JSNative.CallMethod(JSNative.LiveKit, "createLocalAudioTrack"));
        }

        public static JSPromise<JSArray<LocalTrack>> CreateLocalScreenTracks(ScreenShareCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSNative.LiveKit, "createLocalScreenTracks"));
        }

        [Obsolete("Use room.connect() instead")]
        public static ConnectOperation Connect(string url, string token, ConnectOptions? options)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);

            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return new ConnectOperation(JSRef.Acquire<JSPromise<Room>>(JSNative.CallMethod(JSNative.LiveKit, "connect")));
        }
    }
}