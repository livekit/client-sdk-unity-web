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

    public class Participant : JSObject
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
                var ptr = Acquire<JSNumber>(JSNative.GetProperty(NativePtr));
                return (int) ptr.ToNumber();
            }
        }

        public bool IsSpeaking
        {
            get
            {
                JSNative.PushString("isSpeaking");
                var ptr = Acquire<JSBoolean>(JSNative.GetProperty(NativePtr));
                return ptr.ToBool();
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return ptr.ToString();
            }
        }

        public string Identity
        {
            get
            {
                JSNative.PushString("identity");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return ptr.ToString();
            }
        }

        public string Name
        {
            get
            {
                JSNative.PushString("name");
                var ptr = AcquireOrNull<JSString>(JSNative.GetProperty(NativePtr));
                return ptr?.ToString();
            }
        }

        public string Metadata
        {
            get
            {
                JSNative.PushString("metadata");
                var ptr = AcquireOrNull<JSString>(JSNative.GetProperty(NativePtr));
                return ptr?.ToString();
            }
        }

        public DateTime? LastSpokeAt
        {
            get
            {
                JSNative.PushString("lastSpokeAt");
                var ptr = AcquireOrNull(JSNative.GetProperty(NativePtr));
                if(ptr == null)
                    return null;

                var tPtr = Acquire<JSNumber>(JSNative.CallMethod(ptr.NativePtr, "getTime"));
                return new DateTime((long) tPtr.ToNumber());
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
            return AcquireOrNull<TrackPublication>(JSNative.CallMethod(NativePtr, "getTrack"));
        }

        public TrackPublication GetTrackByName(string name)
        {
            JSNative.PushString(name);
            return AcquireOrNull<TrackPublication>(JSNative.CallMethod(NativePtr, "getTrackByName"));
        }
    }
}