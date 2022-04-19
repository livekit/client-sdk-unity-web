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
                return Utils.ToEnum<TrackKind>(JSNative.GetString(JSNative.GetProperty(NativePtr)));
            }
        }

        public string TrackName
        {
            get
            {
                JSNative.PushString("trackName");
                return JSNative.GetString(JSNative.GetProperty(NativePtr));
            }
        }

        public string TrackSid
        {
            get
            {
                JSNative.PushString("trackSid");
                return JSNative.GetString(JSNative.GetProperty(NativePtr));
            }
        }

        public Track Track
        {
            get
            {
                JSNative.PushString("track");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsObject(ptr))
                    return null;
                
                return Acquire<Track>(ptr);
            }
        }

        public TrackSource Source
        {
            get
            {
                JSNative.PushString("source");
                return Utils.ToEnum<TrackSource>(JSNative.GetString(JSNative.GetProperty(NativePtr)));
            }
        }

        public string MimeType
        {
            get
            {
                JSNative.PushString("mimeType");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        public TrackDimensions? Dimensions
        {
            get
            {
                JSNative.PushString("dimensions");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsObject(ptr))
                    return null;

                return JSNative.GetStruct<TrackDimensions>(ptr);
            }
        }

        public bool? Simulcasted
        {
            get
            {
                JSNative.PushString("simulcasted");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.GetBoolean(ptr))
                    return null;

                return JSNative.GetBoolean(ptr);
            }
        }

        public bool IsMuted
        {
            get
            {
                JSNative.PushString("isMuted");
                return JSNative.GetBoolean(JSNative.GetProperty(NativePtr));
            }
        }

        public bool IsEnabled
        {
            get
            {
                JSNative.PushString("isEnabled");
                return JSNative.GetBoolean(JSNative.GetProperty(NativePtr));
            }
        }

        public bool IsSubscribed
        {
            get
            {
                JSNative.PushString("isSubscribed");
                return JSNative.GetBoolean(JSNative.GetProperty(NativePtr));
            }
        }

        public Track AudioTrack
        {
            get
            {
                JSNative.PushString("audioTrack");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsObject(ptr))
                    return null;
                
                return Acquire<Track>(ptr);
            }
        }

        public Track VideoTrack
        {
            get
            {
                JSNative.PushString("videoTrack");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsObject(ptr))
                    return null;
                
                return Acquire<Track>(ptr);
            }
        }


        [Preserve]
        public TrackPublication(JSHandle ptr) : base(ptr)
        {

        }
    }
}