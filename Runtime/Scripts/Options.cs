using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum LogLevel
    {
        [EnumMember(Value = "trace")]
        Trace,
        [EnumMember(Value = "debug")]
        Debug,
        [EnumMember(Value = "info")]
        Info,
        [EnumMember(Value = "warn")]
        Warn,
        [EnumMember(Value = "error")]
        Error,
        [EnumMember(Value = "silent")]
        Silent
    }

    public struct RoomOptions
    {
        [JsonProperty("adaptiveStream")]
        public bool AdaptiveStream;
        [JsonProperty("dynacast")]
        public bool Dynacast;
        [JsonProperty("audioCaptureDefaults")]
        public AudioCaptureOptions? AudioCaptureDefaults;
        [JsonProperty("videoCaptureDefaults")]
        public VideoCaptureOptions? VideoCaptureDefaults;
        [JsonProperty("publishDefaults")]
        public TrackPublishDefaults? PublishDefaults;
        [JsonProperty("stopLocalTrackOnUnpublish")]
        public bool StopLocalTrackOnUnpublish;
        [JsonProperty("expDisableLayerPause")]
        public bool ExpDisableLayerPause;
    }

    public struct RoomConnectOptions
    {
        [JsonProperty("autoSubscribe")]
        public bool AutoSubscribe;
        [JsonProperty("rtcConfig")]
        public RTCConfiguration? RTCConfig;
    }
}
