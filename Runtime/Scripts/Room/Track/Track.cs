using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;
using UnityEngine.Scripting;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TrackKind
    {
        [EnumMember(Value = "audio")]
        Audio,
        [EnumMember(Value = "video")]
        Video,
        [EnumMember(Value = "unknown")]
        Unknown,
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum TrackSource
    {
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
    public enum TrackStreamState
    {
        [EnumMember(Value = "active")]
        Active,
        [EnumMember(Value = "paused")]
        Paused,
        [EnumMember(Value = "unknown")]
        Unknown,
    }

    public struct TrackDimensions
    {
        [JsonProperty("width")]
        public int Width;
        [JsonProperty("height")]
        public int Height;
    }


    public class Track : JSRef
    {
        public TrackKind Kind
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "kind"));
                return Utils.ToEnum<TrackKind>(JSNative.GetString(ptr.NativePtr));
            }
        }

        [Preserve]
        public Track(IntPtr ptr) : base(ptr)
        {
            
        }

        public HTMLMediaElement Attach()
        {
            var ptr = JSNative.CallMethod(NativePtr, "attach");

            if (Kind == TrackKind.Video)
                return Acquire<HTMLVideoElement>(ptr);
            else if(Kind == TrackKind.Audio)
                return Acquire<HTMLAudioElement>(ptr);

            return null;
        }
    }
}