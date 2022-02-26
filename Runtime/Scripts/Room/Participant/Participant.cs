using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;
using UnityEngine.Scripting;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ConnectionQuality
    {
        [EnumMember(Value = "excellent")]
        Excellent,
        [EnumMember(Value = "good")]
        Good,
        [EnumMember(Value = "poor")]
        Poor,
        [EnumMember(Value = "unknown")]
        Unknown
    }

    public class Participant : JSRef
    {

        public JSMap<string, TrackPublication> AudioTracks
        {
            get
            {
                JSNative.PushString("audioTracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativePtr));
            }
        }

        public JSMap<string, TrackPublication> VideoTracks
        {
            get
            {
                JSNative.PushString("videoTracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativePtr));
            }
        }

        public JSMap<string, TrackPublication> Tracks
        {
            get
            {
                JSNative.PushString("tracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativePtr));
            }
        }

        public int AudioLevel
        {
            get
            {
                JSNative.PushString("audioLevel");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return (int) JSNative.GetNumber(ptr.NativePtr);
            }
        }

        public bool IsSpeaking
        {
            get
            {
                JSNative.PushString("isSpeaking");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetBoolean(ptr.NativePtr);
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Identity
        {
            get
            {
                JSNative.PushString("identity");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Name
        {
            get
            {
                JSNative.PushString("name");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (!JSNative.IsString(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Metadata
        {
            get
            {
                JSNative.PushString("metadata");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (!JSNative.IsString(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public DateTime? LastSpokeAt
        {
            get
            {
                JSNative.PushString("lastSpokeAt");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (!JSNative.IsObject(ptr.NativePtr))
                    return null;

                var tPtr = Acquire(JSNative.CallMethod(ptr.NativePtr, "getTime"));
                return new DateTime((long)JSNative.GetNumber(tPtr.NativePtr));
            }
        }

        [Preserve]
        public Participant(IntPtr ptr) : base(ptr)
        {

        }

        public JSArray<TrackPublication> GetTracks()
        {
            return Acquire<JSArray<TrackPublication>>(JSNative.CallMethod(NativePtr, "getTracks"));
        }

        public TrackPublication GetTrack(TrackSource source)
        {
            JSNative.PushString(Utils.ToEnumString(source));
            var r = Acquire<TrackPublication>(JSNative.CallMethod(NativePtr, "getTrack"));
            
            if (JSNative.IsUndefined(r.NativePtr))
                return null;

            return r;
        }

        public TrackPublication GetTrackByName(string name)
        {
            JSNative.PushString(name);
            var r = Acquire<TrackPublication>(JSNative.CallMethod(NativePtr, "getTrackByName"));

            if (JSNative.IsUndefined(r.NativePtr))
                return null;

            return r;
        }
    }
}