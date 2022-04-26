using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using AOT;
using UnityEngine;
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

    public class Track : JSEventEmitter<TrackEvent>
    {
        public delegate void MessageDelegate();
        public delegate void MutedDelegate(Track track);
        public delegate void UnmutedDelegate(Track track);
        public delegate void EndedDelegate(Track track);
        internal delegate void ElementAttachedDelegate(HTMLMediaElement element);
        internal delegate void ElementDetachedDelegate(HTMLMediaElement element);

        public event MessageDelegate Message;
        public event MutedDelegate Muted;
        public event UnmutedDelegate Unmuted;
        public event EndedDelegate Ended;
        internal event ElementAttachedDelegate ElementAttached;
        internal event ElementDetachedDelegate ElementDetached;
        
        public TrackKind Kind
        {
            get
            {
                JSNative.PushString("kind");
                return Utils.ToEnum<TrackKind>(JSNative.GetString(JSNative.GetProperty(NativePtr)));
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
                return JSNative.GetBoolean(JSNative.GetProperty(NativePtr));
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

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void EventReceived(IntPtr iptr)
        {
            var handle = new JSHandle(iptr, true);
            var evRef = Acquire<EventWrapper>(handle);
            try
            {
                var track = Acquire<Track>(JSNative.GetFunctionInstance());
            
                switch (evRef.Event)
                {
                    case TrackEvent.Message:
                        track.Message?.Invoke();
                        Log.Debug($"Track: Message()");
                        break;
                    case TrackEvent.Muted:
                    {
                        var ptr = JSNative.ShiftStack();
                        Track t = null;
                        if(JSNative.IsObject(ptr))
                            t = Acquire<Track>(ptr);
                        
                        Log.Debug($"Track: Muted({t})");
                        track.Muted?.Invoke(t);
                        break;
                    }
                    case TrackEvent.Unmuted:
                    {
                        var ptr = JSNative.ShiftStack();
                        Track t = null;
                        if(JSNative.IsObject(ptr))
                            t = Acquire<Track>(ptr);
                        
                        Log.Debug($"Track: Unmuted({t})");
                        track.Unmuted?.Invoke(t);
                        break;
                    }
                    case TrackEvent.Ended:
                    {
                        var ptr = JSNative.ShiftStack();
                        Track t = null;
                        if(JSNative.IsObject(ptr))
                            t = Acquire<Track>(ptr);
                        
                        Log.Debug($"Track: Ended({t})");
                        track.Ended?.Invoke(t);
                        break;
                    }
                    case TrackEvent.ElementAttached:
                    {
                        var element = Acquire<HTMLMediaElement>(JSNative.ShiftStack());
                        Log.Debug($"Track: ElementAttached({element})");
                        track.ElementAttached?.Invoke(element);                        
                        break;
                    }
                    case TrackEvent.ElementDetached:
                    {
                        var element = Acquire<HTMLMediaElement>(JSNative.ShiftStack());
                        Log.Debug($"Track: ElementDetached({element})");
                        track.ElementDetached?.Invoke(element);                        
                        break;
                    }
                } 
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on TrackEvent.{evRef.Event} ( Is your listeners working correctly ? ): {Environment.NewLine} {e.Message}");
                throw;
            }
        }
        
        [Preserve]
        internal Track(JSHandle ptr) : base(ptr)
        {
            RegisterEvents();
            
            // This is required for video because in finalization of HTMLVideoElement, we destroy the
            // WebGL texture
            ElementAttached += element => SetKeepAlive(element, true);
            ElementDetached += element => SetKeepAlive(element, false);
        }

        private void RegisterEvents()
        {
            foreach (var e in Enum.GetValues(typeof(TrackEvent)))
                SetListener((TrackEvent) e, EventReceived);
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
            JSNative.CallMethod(NativePtr, "stop");
        }
    }
}