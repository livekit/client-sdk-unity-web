using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    public struct ConstrainBoolean
    {
        [JsonProperty("exact")]
        public bool Exact;
        [JsonProperty("ideal")]
        public bool Idea;
    }

    public struct ConstrainDOMString
    {
        [JsonProperty("exact")]
        public string[] Exact;
        [JsonProperty("ideal")]
        public string[] Ideal;
    }

    public struct ConstrainULong
    {
        [JsonProperty("exact")]
        public int Exact;
        [JsonProperty("ideal")]
        public int Ideal;
        [JsonProperty("min")]
        public int Min;
        [JsonProperty("max")]
        public int Max;
    }

    public struct ConstrainDouble
    {
        [JsonProperty("exact")]
        public double Exact;
        [JsonProperty("ideal")]
        public double Ideal;
        [JsonProperty("min")]
        public double Min;
        [JsonProperty("max")]
        public double Max;
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum FacingMode
    {
        [EnumMember(Value = "user")]
        User,
        [EnumMember(Value = "environment")]
        Environment,
        [EnumMember(Value = "left")]
        Left,
        [EnumMember(Value = "right")]
        Right
    }


    public struct TrackPublishDefaults
    {
        [JsonProperty("videoEncoding")]
        public VideoEncoding? videoEncoding;
        [JsonProperty("screenShareEncoding")]
        public VideoEncoding? ScreenShareEncoding;
        [JsonProperty("videoCodec")]
        public VideoCodec? VideoCodec;
        [JsonProperty("audioBitrate")]
        public int? AudioBitrate;
        [JsonProperty("dtx")]
        public bool? DTX;
        [JsonProperty("simulcast")]
        public bool? Simulcast;
        [JsonProperty("stopMicTrackOnMute")]
        public bool? StopMicTrackOnMute;
    }

    public struct TrackPublishOptions
    {
        [JsonProperty("name")]
        public string? Name;
        [JsonProperty("source")]
        public Track.Source? Source;

        // TrackPublishDefaults copied (no struct inheritance)
        [JsonProperty("videoEncoding")]
        public VideoEncoding? videoEncoding;
        [JsonProperty("screenShareEncoding")]
        public VideoEncoding? ScreenShareEncoding;
        [JsonProperty("videoCodec")]
        public VideoCodec? VideoCodec;
        [JsonProperty("audioBitrate")]
        public int? AudioBitrate;
        [JsonProperty("dtx")]
        public bool? DTX;
        [JsonProperty("simulcast")]
        public bool? Simulcast;
        [JsonProperty("stopMicTrackOnMute")]
        public bool? StopMicTrackOnMute;
    }

    public struct VideoCaptureOptions
    {
        [JsonProperty("deviceId")]
        public ConstrainDOMString DeviceId;
        [JsonProperty("facingMode")]
        public FacingMode? facingMode;
        [JsonProperty("resolution")]
        public VideoResolution? Resolution;
    }

    public struct ScreenShareCaptureOptions
    {
        [JsonProperty("audio")]
        public bool? Audio;
        [JsonProperty("resolution")]
        public VideoResolution? Resolution;
    }

    public struct AudioCaptureOptions
    {
        [JsonProperty("autoGainControl")]
        public ConstrainBoolean? AutoGainControl;

        [JsonProperty("channelCount")]
        public ConstrainULong? ChannelCount;

        [JsonProperty("deviceId")]
        public ConstrainDOMString? DeviceId;

        [JsonProperty("echoCancellation")]
        public ConstrainBoolean? EchoCancellation;

        [JsonProperty("latency")]
        public ConstrainDouble? Latency;

        [JsonProperty("noiseSuppression")]
        public ConstrainBoolean? NoiseSuppression;

        [JsonProperty("sampleRate")]
        public ConstrainULong? SampleRate;

        [JsonProperty("sampleSize")]
        public ConstrainULong? SampleSize;
    }

    public struct VideoResolution
    {
        [JsonProperty("width")]
        public int Width;
        [JsonProperty("height")]
        public int Height;
        [JsonProperty("frameRate")]
        public int? FrameRate;
        [JsonProperty("aspectRatio")]
        public double? AspectRatio;
    }

    public struct VideoEncoding
    {
        [JsonProperty("maxBitrate")]
        public int? MaxBitrate;
        [JsonProperty("maxFramerate")]
        public int? MaxFramerate;
    }

    public struct VideoPreset
    {
        public VideoEncoding Encoding;
        public int Width;
        public int Height;

        public VideoPreset(int width, int height, int maxBitrate, int? maxFramerate)
        {
            Width = width;
            Height = height;
            Encoding = new VideoEncoding {
                MaxBitrate = maxBitrate,
                MaxFramerate = maxFramerate
            };
        }

        VideoResolution GetResolution()
        {
            return new VideoResolution
            {
                Width = Width,
                Height = Height,
                FrameRate = Encoding.MaxFramerate,
                AspectRatio = Width / Height,
            };
        }
    }

    public struct AudioPreset
    {
        [JsonProperty("maxBitrate")]
        public int MaxBitrate;
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum VideoCodec
    {
        [EnumMember(Value = "vp8")]
        VP8,
        [EnumMember(Value = "h264")]
        H264
    }

    public class AudioPresets
    {
        public static readonly AudioPreset Telephone = new AudioPreset { MaxBitrate = 12_000 };
        public static readonly AudioPreset Speech = new AudioPreset { MaxBitrate = 20_000 };
        public static readonly AudioPreset Music = new AudioPreset { MaxBitrate = 32_000 };
    }

    public class VideoPresets
    {
        public static readonly VideoPreset QVGA = new VideoPreset(320, 180, 120_000, 10);
        public static readonly VideoPreset VGA = new VideoPreset(320, 180, 120_000, 10);
        public static readonly VideoPreset QHD = new VideoPreset(320, 180, 120_000, 10);
        public static readonly VideoPreset HD = new VideoPreset(320, 180, 120_000, 10);
        public static readonly VideoPreset FHD = new VideoPreset(320, 180, 120_000, 10);
    }

    public class VideoPresets43
    {
        public static readonly VideoPreset QVGA = new VideoPreset(240, 180, 90_000, 10);
        public static readonly VideoPreset VGA = new VideoPreset(480, 360, 225_000, 20);
        public static readonly VideoPreset QHD = new VideoPreset(720, 540, 450_000, 25);
        public static readonly VideoPreset HD = new VideoPreset(960, 720, 1_500_000, 30);
        public static readonly VideoPreset FHD = new VideoPreset(1440, 1080, 2_800_000, 30);
    }

    public class ScreenSharePresets
    {
        public static readonly VideoPreset VGA = new VideoPreset(640, 360, 200_000, 3);
        public static readonly VideoPreset HD_8 = new VideoPreset(1280, 720, 400_000, 5);
        public static readonly VideoPreset HD_15 = new VideoPreset(1280, 720, 1_000_000, 15);
        public static readonly VideoPreset FHD_15 = new VideoPreset(1920, 1080, 1_500_000, 15);
        public static readonly VideoPreset FHD_30 = new VideoPreset(1920, 1080, 3_000_000, 30);
    }
}