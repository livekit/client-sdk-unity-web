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

    public class Track : JSObject
    {
        public TrackKind Kind
        {
            get
            {
                JSNative.PushString("kind");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackKind>(ptr.ToString());
            }
        }

        public MediaStreamTrack MediaStreamTrack
        {
            get
            {
                JSNative.PushString("mediaStreamTrack");
                return Acquire<MediaStreamTrack>(JSNative.GetProperty(NativePtr));
            }
        }

        public JSArray<HTMLMediaElement> AttachedElements
        {
            get
            {
                JSNative.PushString("attachedElements");
                return Acquire<JSArray<HTMLMediaElement>>(JSNative.GetProperty(NativePtr));
            }
        }

        public bool IsMuted
        {
            get
            {
                JSNative.PushString("isMuted");
                var ptr = Acquire<JSBoolean>(JSNative.GetProperty(NativePtr));
                return ptr.ToBool();
            }
        }

        public TrackStreamState StreamState
        {
            get
            {
                JSNative.PushString("streamState");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackStreamState>(ptr.ToString());
            }
        }

        public TrackSource Source
        {
            get
            {
                JSNative.PushString("source");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackSource>(ptr.ToString());
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = AcquireOrNull<JSString>(JSNative.GetProperty(NativePtr));
                return ptr?.ToString();
            }
        }

        [Preserve]
        public Track(IntPtr ptr) : base(ptr)
        {
            
        }

        public HTMLMediaElement Attach()
        {
            return Acquire<HTMLMediaElement>(JSNative.CallMethod(NativePtr, "attach"));
        }

        public JSArray<HTMLMediaElement> Detach()
        {
            return Acquire<JSArray<HTMLMediaElement>>(JSNative.CallMethod(NativePtr, "detach"));
        }

        public void Stop()
        {
            Acquire(JSNative.CallMethod(NativePtr, "stop"));
        }
    }
}