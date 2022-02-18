
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    public class Track : JSRef
    {

        [JsonConverter(typeof(StringEnumConverter))]
        public enum Kind {
            [EnumMember(Value = "audio")]
            Audio,
            [EnumMember(Value = "video")]
            Video,
            [EnumMember(Value = "unknown")]
            Unknown,
        }

        [JsonConverter(typeof(StringEnumConverter))]
        public enum Source {
            [EnumMember(Value = "camera")]
            Camera,
            [EnumMember(Value = "microphone")]
            Microphone,
            [EnumMember(Value = "screen_share")]
            ScreenShare,
            [EnumMember(Value = "screen_share_audio")]
            ScreenShareAudio,
            [EnumMember(Value = "unknown")]
            Unknown,
        }

        [JsonConverter(typeof(StringEnumConverter))]
        public enum StreamState {
            [EnumMember(Value = "active")]
            Active,
            [EnumMember(Value = "paused")]
            Paused,
            [EnumMember(Value = "unknown")]
            Unknown,
        }

        public struct Dimensions {
            [JsonProperty("width")]
            public int Width;
            [JsonProperty("height")]
            public int Height;
        }
    }
}