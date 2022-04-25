using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;

namespace LiveKit
{
    public class FacingMode
    {
        public static readonly string User = "user";
        public static readonly string Environment = "environment";
        public static readonly string Left = "left";
        public static readonly string Right = "right";
    }

    [JsonConverter(typeof(CreateLocalTracksOptionsWriter))]
    public struct CreateLocalTracksOptions
    {
        public bool? Audio;
        public bool? Video;

        public AudioCaptureOptions? AudioOptions;
        public VideoCaptureOptions? VideoOptions;
    }

    public class CreateLocalTracksOptionsWriter : JsonConverter<CreateLocalTracksOptions>
    {
        public override bool CanRead => false;

        public override CreateLocalTracksOptions ReadJson(JsonReader reader, Type objectType, CreateLocalTracksOptions existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, CreateLocalTracksOptions value, JsonSerializer serializer)
        {
            writer.WriteStartObject();

            if(value.AudioOptions != null && value.Audio.GetValueOrDefault(true))
            {
                writer.WritePropertyName("audio");
                serializer.Serialize(writer, value.AudioOptions);
            }
            else if(value.Audio != null)
            {
                writer.WritePropertyName("audio");
                writer.WriteValue(value.Audio);
            }

            if (value.VideoOptions != null && value.Video.GetValueOrDefault(true))
            {
                writer.WritePropertyName("video");
                serializer.Serialize(writer, value.VideoOptions);
            }
            else if (value.Video != null)
            {
                writer.WritePropertyName("video");
                writer.WriteValue(value.Video);
            }

            writer.WriteEndObject();
        }
    }

    // NOTE This struct is copied (See below)
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
        [JsonProperty("videoSimulcastLayers")]
        public VideoPreset[] VideoSimulcastLayers;
        [JsonProperty("screenShareSimulcastLayers")]
        public VideoPreset[] ScreenShareSimulcastLayers;
    }

    public struct TrackPublishOptions
    {
        [JsonProperty("name")]
        public string Name;
        [JsonProperty("source")]
        public TrackSource? Source;

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
        [JsonProperty("videoSimulcastLayers")]
        public VideoPreset[] VideoSimulcastLayers;
        [JsonProperty("screenShareSimulcastLayers")]
        public VideoPreset[] ScreenShareSimulcastLayers;
    }

    public struct VideoCaptureOptions
    {
        [JsonProperty("deviceId")]
        public ConstrainDOMString DeviceId;
        [JsonProperty("facingMode")]
        public ConstrainDOMString? FacingMode;
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

        public readonly VideoResolution GetResolution()
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
        H264,
        [EnumMember(Value = "av1")]
        AV1,
        [EnumMember(Value = "vp9")]
        VP9
    }

    public class AudioPresets
    {
        public static readonly AudioPreset Telephone = new AudioPreset { MaxBitrate = 12_000 };
        public static readonly AudioPreset Speech = new AudioPreset { MaxBitrate = 20_000 };
        public static readonly AudioPreset Music = new AudioPreset { MaxBitrate = 32_000 };
    }

    public class VideoPresets
    {
        public static readonly VideoPreset H90 = new VideoPreset(160, 90, 60_000, 15);
        public static readonly VideoPreset H180 = new VideoPreset(320, 180, 120_000, 15);
        public static readonly VideoPreset H216 = new VideoPreset(384, 216, 180_000, 15);
        public static readonly VideoPreset H360 = new VideoPreset(640, 360, 300_000, 20);
        public static readonly VideoPreset H540 = new VideoPreset(960, 540, 600_000, 25);
        public static readonly VideoPreset H720 = new VideoPreset(1280, 720, 2_000_000, 30);
        public static readonly VideoPreset H1080 = new VideoPreset(1920, 1080, 3_000_000, 30);
        public static readonly VideoPreset H1440 = new VideoPreset(2560, 1440, 5_000_000, 30);
        public static readonly VideoPreset H2160 = new VideoPreset(3840, 2160, 8_000_000, 30);
        [Obsolete] public static readonly VideoPreset QVGA = new VideoPreset(320, 180, 120_000, 10);
        [Obsolete] public static readonly VideoPreset VGA = new VideoPreset(320, 180, 120_000, 10);
        [Obsolete] public static readonly VideoPreset QHD = new VideoPreset(320, 180, 120_000, 10);
        [Obsolete] public static readonly VideoPreset HD = new VideoPreset(320, 180, 120_000, 10);
        [Obsolete] public static readonly VideoPreset FHD = new VideoPreset(320, 180, 120_000, 10);
    }
        
    public class VideoPresets43
    {
        public static readonly VideoPreset H120 = new VideoPreset(160, 120, 80_000, 15);
        public static readonly VideoPreset H180 = new VideoPreset(240, 180, 100_000, 15);
        public static readonly VideoPreset H240 = new VideoPreset(320, 240, 150_000, 15);
        public static readonly VideoPreset H360 = new VideoPreset(480, 360, 225_000, 20);
        public static readonly VideoPreset H480 = new VideoPreset(640, 480, 300_000, 20);
        public static readonly VideoPreset H540 = new VideoPreset(720, 540, 450_000, 25);
        public static readonly VideoPreset H720 = new VideoPreset(960, 720, 1_500_000, 30);
        public static readonly VideoPreset H1080 = new VideoPreset(1440, 1080, 2_500_000, 30);
        public static readonly VideoPreset H1440 = new VideoPreset(1920, 1440, 3_500_000, 30);
        [Obsolete] public static readonly VideoPreset QVGA = new VideoPreset(240, 180, 90_000, 10);
        [Obsolete] public static readonly VideoPreset VGA = new VideoPreset(480, 360, 225_000, 20);
        [Obsolete] public static readonly VideoPreset QHD = new VideoPreset(720, 540, 450_000, 25);
        [Obsolete] public static readonly VideoPreset HD = new VideoPreset(960, 720, 1_500_000, 30);
        [Obsolete] public static readonly VideoPreset FHD = new VideoPreset(1440, 1080, 2_800_000, 30);
    }

    public class ScreenSharePresets
    {
        public static readonly VideoPreset H360_FPS3 = new VideoPreset(640, 360, 200_000, 3);
        public static readonly VideoPreset H720_FPS5 = new VideoPreset(1280, 720, 400_000, 5);
        public static readonly VideoPreset H720_FPS15 = new VideoPreset(1280, 720, 1_000_000, 15);
        public static readonly VideoPreset H1080_FPS15 = new VideoPreset(1920, 1080, 1_500_000, 15);
        public static readonly VideoPreset H1080_FPS30 = new VideoPreset(1920, 1080, 3_000_000, 30);
        [Obsolete] public static readonly VideoPreset VGA = new VideoPreset(640, 360, 200_000, 3);
        [Obsolete] public static readonly VideoPreset HD_8 = new VideoPreset(1280, 720, 400_000, 5);
        [Obsolete] public static readonly VideoPreset HD_15 = new VideoPreset(1280, 720, 1_000_000, 15);
        [Obsolete] public static readonly VideoPreset FHD_15 = new VideoPreset(1920, 1080, 1_500_000, 15);
        [Obsolete] public static readonly VideoPreset FHD_30 = new VideoPreset(1920, 1080, 3_000_000, 30);
    }
}