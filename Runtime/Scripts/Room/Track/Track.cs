using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using AOT;
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
        public delegate void MessageDelegate();
        public delegate void MutedDelegate(Track track);
        public delegate void UnmutedDelegate(Track track);
        public delegate void EndedDelegate(Track track);

        public event MessageDelegate Message;
        public event MutedDelegate Muted;
        public event UnmutedDelegate Unmuted;
        public event EndedDelegate Ended;
        
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

        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void EventReceived(IntPtr iptr)
        {
            try
            {
                var evRef = Acquire<JSEventListener<TrackEvent>>(iptr);
                evRef.JSRef.TryGetTarget(out var jsRef);
                var track = Acquire<Track>(JSNative.GetFunctionInstance());
            
                switch (evRef.Event)
                {
                    case TrackEvent.Message:
                        track.Message?.Invoke();
                        Log.Info($"Track: Message()");
                        break;
                    case TrackEvent.Muted:
                    {
                        var t = AcquireOrNull<Track>(JSNative.ShiftStack());
                        Log.Info($"Track: Muted({t})");
                        track.Muted?.Invoke(t);
                        break;
                    }
                    case TrackEvent.Unmuted:
                    {
                        var t = AcquireOrNull<Track>(JSNative.ShiftStack());
                        Log.Info($"Track: Unmuted({t})");
                        track.Unmuted?.Invoke(t);
                        break;
                    }
                    case TrackEvent.Ended:
                    {
                        var t = AcquireOrNull<Track>(JSNative.ShiftStack());
                        Log.Info($"Track: Ended({t})");
                        track.Ended?.Invoke(t);
                        break;
                    }
                } 
            }
            catch (Exception e)
            {
                Log.Info(e.Message);
                throw;
            }
        }
        
        private List<JSEventListener<TrackEvent>> m_Listeners = new List<JSEventListener<TrackEvent>>();

        [Preserve]
        public Track(IntPtr ptr) : base(ptr)
        {
            KeepAlive(this);
            
            foreach(var e in Enum.GetValues(typeof(TrackEvent)))
                m_Listeners.Add(new JSEventListener<TrackEvent>(this, (TrackEvent) e, EventReceived));
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