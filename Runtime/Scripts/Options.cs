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
        [JsonProperty("publishOnly")]
        public string PublishOnly;
    }
    
    [Obsolete("Use new Room(RoomOptions) and room.connect(RoomConnectOptions) instead")]
    public struct ConnectOptions
    {
        [JsonProperty("autoSubscribe")]
        public bool? AutoSubscribe;
        [JsonProperty("adaptiveStream")]
        public bool? AdaptiveStream;
        [JsonProperty("autoManageVideo")]
        public bool? AutoManageVideo;
        [JsonProperty("dynacast")]
        public bool? Dynacast;
        [JsonProperty("logLevel")]
        public LogLevel? LogLevel;
        [JsonProperty("iceServers")]
        public RTCIceServer[] iceServers;
        [JsonProperty("rtcConfig")]
        public RTCConfiguration? RTCConfig;
        [JsonProperty("audio")]
        public bool? PublishAudio;
        [JsonProperty("video")]
        public bool? PublishVideo;
        [JsonProperty("audioCaptureDefaults")]
        public AudioCaptureOptions? AudioCaptureDefaults;
        [JsonProperty("videoCaptureDefaults")]
        public VideoCaptureOptions? VideoCaptureDefaults;
        [JsonProperty("publishDefaults")]
        public TrackPublishDefaults? PublishDefaults;
        [JsonProperty("stopLocalTrackOnUnpublish")]
        public bool? StopLocalTrackOnUnpublish;
        [JsonProperty("expDisableLayerPause")]
        public bool? ExpDisableLayerPause;

        // CreateLocalTracksOptions TODO
        /*[JsonProperty("audio")]
        public bool? AudioEnabled;
        [JsonProperty("audio")]
        public AudioCaptureOptions? Audio;

        [JsonProperty("video")]
        public bool? VideoEnabled;
        [JsonProperty("video")]
        public VideoCaptureOptions? Video;*/
    }
}