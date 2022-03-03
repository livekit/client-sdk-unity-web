using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;
using UnityEngine.Scripting;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SubscriptionStatus
    {
        [EnumMember(Value = "subscribed")]
        Subscribed,
        [EnumMember(Value = "not_allowed")]
        NotAllowed,
        [EnumMember(Value = "unsubscribed")]
        Unsubscribed
    }

    public class TrackPublication : JSObject
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

        public string TrackName
        {
            get
            {
                JSNative.PushString("trackName");
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }

        public string TrackSid
        {
            get
            {
                JSNative.PushString("trackSid");
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }

        public Track Track
        {
            get
            {
                JSNative.PushString("track");
                return AcquireOrNull<Track>(JSNative.GetProperty(NativePtr));
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

        public string MimeType
        {
            get
            {
                JSNative.PushString("mimeType");
                var ptr = AcquireOrNull(JSNative.GetProperty(NativePtr));
                return ptr?.ToString();
            }
        }

        public TrackDimensions? Dimensions
        {
            get
            {
                JSNative.PushString("dimensions");
                var ptr = AcquireOrNull(JSNative.GetProperty(NativePtr));
                if (ptr == null)
                    return null;

                return JSNative.GetStruct<TrackDimensions>(ptr.NativePtr);
            }
        }

        public bool? Simulcasted
        {
            get
            {
                JSNative.PushString("simulcasted");
                var ptr = AcquireOrNull<JSBoolean>(JSNative.GetProperty(NativePtr));
                return ptr?.ToBool();
            }
        }

        public bool IsMuted
        {
            get
            {
                JSNative.PushString("isMuted");
                return Acquire<JSBoolean>(JSNative.GetProperty(NativePtr)).ToBool();
            }
        }

        public bool IsEnabled
        {
            get
            {
                JSNative.PushString("isEnabled");
                return Acquire<JSBoolean>(JSNative.GetProperty(NativePtr)).ToBool();
            }
        }

        public bool IsSubscribed
        {
            get
            {
                JSNative.PushString("isSubscribed");
                return Acquire<JSBoolean>(JSNative.GetProperty(NativePtr)).ToBool();
            }
        }

        public Track AudioTrack
        {
            get
            {
                JSNative.PushString("audioTrack");
                return AcquireOrNull<Track>(JSNative.GetProperty(NativePtr));
            }
        }

        public Track VideoTrack
        {
            get
            {
                JSNative.PushString("videoTrack");
                return AcquireOrNull<Track>(JSNative.GetProperty(NativePtr));
            }
        }


        [Preserve]
        public TrackPublication(IntPtr ptr) : base(ptr)
        {

        }
    }
}