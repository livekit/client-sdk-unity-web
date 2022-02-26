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

    public class TrackPublication : JSRef
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

        public string TrackName
        {
            get
            {
                JSNative.PushString("trackName");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string TrackSid
        {
            get
            {
                JSNative.PushString("trackSid");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public Track Track
        {
            get
            {
                JSNative.PushString("track");
                var ptr = Acquire<Track>(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return ptr;
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

        public string MimeType
        {
            get
            {
                JSNative.PushString("mimeType");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;
                
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public TrackDimensions? Dimensions
        {
            get
            {
                JSNative.PushString("dimensions");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return JSNative.GetStruct<TrackDimensions>(ptr.NativePtr);
            }
        }

        public bool? Simulcasted
        {
            get
            {
                JSNative.PushString("simulcasted");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return JSNative.GetBoolean(ptr.NativePtr);
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

        public bool IsEnabled
        {
            get
            {
                JSNative.PushString("isEnabled");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetBoolean(ptr.NativePtr);
            }
        }

        public bool IsSubscribed
        {
            get
            {
                JSNative.PushString("isSubscribed");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetBoolean(ptr.NativePtr); 
            }
        }

        public Track AudioTrack
        {
            get
            {
                JSNative.PushString("audioTrack");
                var ptr = Acquire<Track>(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return ptr;
            }
        }

        public Track VideoTrack
        {
            get
            {
                JSNative.PushString("videoTrack");
                var ptr = Acquire<Track>(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return ptr;
            }
        }


        [Preserve]
        public TrackPublication(IntPtr ptr) : base(ptr)
        {

        }
    }
}