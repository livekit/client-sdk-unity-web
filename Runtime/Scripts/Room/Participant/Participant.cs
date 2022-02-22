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
        public string Sid { 
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "sid"));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public int AudioLevel
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "audioLevel"));
                return (int) JSNative.GetNumber(ptr.NativePtr);
            }
        }

        public bool IsSpeaking
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "isSpeaking"));
                return JSNative.GetBool(ptr.NativePtr);
            }
        }

        public string Identity
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "identity"));
                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Name
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "name"));
                if (!JSNative.IsString(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
            }
        }

        public string Metadata
        {
            get
            {
                var ptr = Acquire(JSNative.GetProperty(NativePtr, "metadata"));
                if (!JSNative.IsString(ptr.NativePtr))
                    return null;

                return JSNative.GetString(ptr.NativePtr);
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
            var ptr = JSNative.CallMethod(NativePtr, "getTrack");
            
            if (JSNative.IsUndefined(ptr))
                return null;

            return Acquire<TrackPublication>(ptr);
        }

        public TrackPublication GetTrackByName(string name)
        {
            JSNative.PushString(name);
            var ptr = JSNative.CallMethod(NativePtr, "getTrackByName");

            if (JSNative.IsUndefined(ptr))
                return null;

            return Acquire<TrackPublication>(ptr);
        }
    }
}