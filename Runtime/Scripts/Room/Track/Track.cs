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
                JSNative.PushString("kind");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackKind>(JSNative.GetString(ptr.NativePtr));
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
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetBoolean(ptr.NativePtr);
            }
        }

        public TrackStreamState StreamState
        {
            get
            {
                JSNative.PushString("streamState");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackStreamState>(JSNative.GetString(ptr.NativePtr));
            }
        }

        public TrackSource Source
        {
            get
            {
                JSNative.PushString("source");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<TrackSource>(JSNative.GetString(ptr.NativePtr));
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (!JSNative.IsString(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
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