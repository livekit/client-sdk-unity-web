using Newtonsoft.Json;

namespace LiveKit
{
    public enum LogLevel
    {
        [JsonProperty("trace")]
        Trace,
        [JsonProperty("debug")]
        Debug,
        [JsonProperty("info")]
        Info,
        [JsonProperty("warn")]
        Warn,
        [JsonProperty("error")]
        Error,
        [JsonProperty("silent")]
        Silent
    }

    public struct RoomOptions
    {
        [JsonProperty("adaptiveStream")]
        bool AdaptiveStream;
        [JsonProperty("dynacast")]
        bool Dynacast;
        [JsonProperty("audioCaptureDefaults")]
        AudioCaptureDefaults?: AudioCaptureOptions;
        [JsonProperty("videoCaptureDefaults")]
        VideoCaptureDefaults?: VideoCaptureOptions;
        [JsonProperty("publishDefaults")]
        PublishDefaults?: TrackPublishDefaults;
         [JsonProperty("stopLocalTrackOnUnpublish")]
        bool StopLocalTrackOnUnpublish;
        [JsonProperty("expDisableLayerPause")]
        bool ExpDisableLayerPause;
        [JsonProperty("expSignalLatency")]
        double ExpSignalLatency;
    }


    public struct RoomConnectOptions
    {
        [JsonProperty("autoSubscribe")]
        bool AutoSubscribe;
        [JsonProperty("rtcConfig")]
        RTCConfiguration? RTCConfig;
    }

    public struct ConnectOptions : CreateLocalTracksOptions
    {
        [JsonProperty("autoSubscribe")]
        bool? AutoSubscribe;
        [JsonProperty("adaptiveStream")]
        bool? AdaptiveStream;
        [JsonProperty("autoManageVideo")]
        bool? AutoManageVideo;
        [JsonProperty("dynacast")]
        bool? Dynacast;
        [JsonProperty("logLevel")]
        LogLevel? LogLevel;
        [JsonProperty("autoSubscribe")]
        iceServers?: RTCIceServer [];
        [JsonProperty("autoSubscribe")]
        rtcConfig?: RTCConfiguration;
        [JsonProperty("autoSubscribe")]
        audio?: boolean;
        [JsonProperty("autoSubscribe")]
        video?: boolean;
        [JsonProperty("autoSubscribe")]
        audioCaptureDefaults?: AudioCaptureOptions;
        [JsonProperty("autoSubscribe")]
        videoCaptureDefaults?: VideoCaptureOptions;
        [JsonProperty("autoSubscribe")]
        publishDefaults?: TrackPublishDefaults;
        [JsonProperty("autoSubscribe")]
        stopLocalTrackOnUnpublish?: boolean;
        [JsonProperty("autoSubscribe")]
        expDisableLayerPause?: boolean;
    }

}