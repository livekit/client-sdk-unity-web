using Newtonsoft.Json;

namespace LiveKit
{
    public class ConstrainBoolean
    {
        [JsonProperty("exact")]
        bool Exact;
        [JsonProperty("ideal")]
        bool Idea;
    }

    public class ConstrainDOMString
    {
        [JsonProperty("exact")]
        string[] Exact;
        [JsonProperty("ideal")]
        string[] Ideal;
    }

    public class ULongRange
    {
        [JsonProperty("min")]
        int Min;
        [JsonProperty("max")]
        int Max;
    }

    public class ConstrainULong : ULongRange
    {
        [JsonProperty("exact")]
        int Exact;
        [JsonProperty("ideal")]
        int Ideal;
    }

    public class DoubleRange
    {
        [JsonProperty("min")]
        double Min;
        [JsonProperty("max")]
        double Max;
    }

    public class ConstrainDouble : DoubleRange
    {
        [JsonProperty("exact")]
        double Exact;
        [JsonProperty("ideal")]
        double Ideal;
    }

    public enum FacingMode
    {
        [JsonProperty("user")]
        User,
        [JsonProperty("environment")]
        Environment,
        [JsonProperty("left")]
        Left,
        [JsonProperty("right")]
        Right
    }

    public class TrackPublishDefaults
    {
        [JsonProperty("videoEncoding")]
        VideoEncoding? videoEncoding;
        [JsonProperty("screenShareEncoding")]
        VideoEncoding? ScreenShareEncoding;
        [JsonProperty("videoCodec")]
        VideoCodec? VideoCodec;
        [JsonProperty("audioBitrate")]
        int? AudioBitrate;
        [JsonProperty("dtx")]
        bool? DTX;
        [JsonProperty("simulcast")]
        bool? Simulcast;
        [JsonProperty("stopMicTrackOnMute")]
        bool? StopMicTrackOnMute;
    }

    public class TrackPublishOptions : TrackPublishDefaults
    {
        [JsonProperty("name")]
        string? Name;
        [JsonProperty("source")]
        Track.Source? Source;
    }

    public class CreateLocalTracksOptions
    {
        [JsonProperty("audio")]
        bool? AudioEnabled;
        [JsonProperty("audio")]
        AudioCaptureOptions? Audio;

        [JsonProperty("video")]
        bool? VideoEnabled;
        [JsonProperty("video")]
        VideoCaptureOptions? Video;
    }

    public class VideoCaptureOptions
    {
        [JsonProperty("deviceId")]
        ConstrainDOMString DeviceId;
        [JsonProperty("facingMode")]
        FacingMode? facingMode;
        [JsonProperty("resolution")]
        VideoResolution? Resolution;
    }

    public class ScreenShareCaptureOptions
    {
        [JsonProperty("audio")]
        bool? Audio;
        [JsonProperty("resolution")]
        VideoResolution? Resolution;
    }

    public class AudioCaptureOptions
    {
        [JsonProperty("autoGainControl")]
        ConstrainBoolean AutoGainControl;

        [JsonProperty("channelCount")]
        ConstrainULong ChannelCount;

        [JsonProperty("deviceId")]
        ConstrainDOMString DeviceId;

        [JsonProperty("echoCancellation")]
        ConstrainBoolean EchoCancellation;

        [JsonProperty("latency")]
        ConstrainDouble Latency;

        [JsonProperty("noiseSuppression")]
        ConstrainBoolean NoiseSuppression;

        [JsonProperty("sampleRate")]
        ConstrainULong SampleRate;

        [JsonProperty("sampleSize")]
        ConstrainULong SampleSize;
    }

    public class VideoResolution
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

    public class VideoPreset
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

    public class AudioPreset
    {
        [JsonProperty("maxBitrate")]
        public int MaxBitrate;
    }

    public enum VideoCodec
    {
        [JsonProperty("vp8")]
        VP8,
        [JsonProperty("h264")]
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