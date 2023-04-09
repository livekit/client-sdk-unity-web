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

    public class Participant : JSEventEmitter<ParticipantEvent>
    {
        public delegate void TrackPublishedDelegate(RemoteTrackPublication publication);
        public delegate void TrackSubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication);
        public delegate void TrackSubscriptionFailedDelegate(string trackSid);
        public delegate void TrackUnpublishedDelegate(RemoteTrackPublication publication);
        public delegate void TrackUnsubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication);
        public delegate void TrackMutedDelegate(TrackPublication publication);
        public delegate void TrackUnmutedDelegate(TrackPublication publication);
        public delegate void LocalTrackPublishedDelegate(LocalTrackPublication publication);
        public delegate void LocalTrackUnpublishedDelegate(LocalTrackPublication publication);
        public delegate void ParticipantMetadataChangedDelegate(string prevMetadata);
        public delegate void DataReceivedDelegate(byte[] data, DataPacketKind kind);
        public delegate void IsSpeakingChangedDelegate(bool speaking);
        public delegate void ConnectionQualityChangedDelegate(ConnectionQuality quality);
        public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publication, TrackStreamState streamState); 
        public delegate void TrackSubscriptionPermissionChangedDelegate(RemoteTrackPublication publication, SubscriptionStatus status);
        
        public event TrackPublishedDelegate TrackPublished;
        public event TrackSubscribedDelegate TrackSubscribed;
        public event TrackSubscriptionFailedDelegate TrackSubscriptionFailed;
        public event TrackUnpublishedDelegate TrackUnpublished;
        public event TrackUnsubscribedDelegate TrackUnsubscribed;
        public event TrackMutedDelegate TrackMuted;
        public event TrackUnmutedDelegate TrackUnmuted;
        public event LocalTrackPublishedDelegate LocalTrackPublished;
        public event LocalTrackUnpublishedDelegate LocalTrackUnpublished;
        public event ParticipantMetadataChangedDelegate ParticipantMetadataChanged;
        public event DataReceivedDelegate DataReceived;
        public event IsSpeakingChangedDelegate IsSpeakingChanged;
        public event ConnectionQualityChangedDelegate ConnectionQualityChanged;
        public event TrackStreamStateChangedDelegate TrackStreamStateChanged;
        public event TrackSubscriptionPermissionChangedDelegate TrackSubscriptionPermissionChanged;
        
        public JSMap<string, TrackPublication> AudioTracks
        {
            get
            {
                JSNative.PushString("audioTracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativeHandle));
            }
        }

        public JSMap<string, TrackPublication> VideoTracks
        {
            get
            {
                JSNative.PushString("videoTracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativeHandle));
            }
        }

        public JSMap<string, TrackPublication> Tracks
        {
            get
            {
                JSNative.PushString("tracks");
                return Acquire<JSMap<string, TrackPublication>>(JSNative.GetProperty(NativeHandle));
            }
        }

        public double AudioLevel
        {
            get
            {
                JSNative.PushString("audioLevel");
                return JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
        }

        public bool IsSpeaking
        {
            get
            {
                JSNative.PushString("isSpeaking");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        public string Identity
        {
            get
            {
                JSNative.PushString("identity");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        public string Name
        {
            get
            {
                JSNative.PushString("name");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        public string Metadata
        {
            get
            {
                JSNative.PushString("metadata");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsString(ptr))
                    return null;

                return JSNative.GetString(ptr);
            }
        }

        public DateTime? LastSpokeAt
        {
            get
            {
                JSNative.PushString("lastSpokeAt");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsObject(ptr))
                    return null;
                
                var time = JSNative.GetNumber(JSNative.CallMethod(ptr, "getTime"));
                return new DateTime((long) time);
            }
        }
        
        public bool IsCameraEnabled
        {
            get
            {
                JSNative.PushString("isCameraEnabled");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }
        
        public bool IsMicrophoneEnabled
        {
            get
            {
                JSNative.PushString("isMicrophoneEnabled");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }
        
        public bool IsScreenShareEnabled
        {
            get
            {
                JSNative.PushString("isScreenShareEnabled");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }   
        
        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void EventReceived(IntPtr iptr)
        {
            var handle = new JSHandle(iptr, true);
            var evRef = Acquire<EventWrapper>(handle);

            try
            {
                var participant = Acquire<Participant>(JSNative.GetFunctionInstance());
                
                switch (evRef.Event)
                {
                    case ParticipantEvent.TrackPublished:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackPublished({publication})");
                        participant.TrackPublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackSubscribed:
                    {
                        var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackSubscribed({track.Sid}, {publication})");
                        participant.TrackSubscribed?.Invoke(track, publication);
                        break;
                    }
                    case ParticipantEvent.TrackSubscriptionFailed:
                    {
                        var trackSid = JSNative.GetString(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackSubscriptionFailed(\"{trackSid}\"");
                        participant.TrackSubscriptionFailed?.Invoke(trackSid);
                        break;
                    }
                    case ParticipantEvent.TrackUnpublished:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackUnpublished({publication})");
                        participant.TrackUnpublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackUnsubscribed:
                    {
                        var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackUnsubscribed({track.Sid}, {publication})");
                        participant.TrackUnsubscribed?.Invoke(track, publication);
                        break;
                    }
                    case ParticipantEvent.TrackMuted:
                    {
                        var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackMuted({publication})");
                        participant.TrackMuted?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackUnmuted:
                    {
                        var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: TrackUnmuted({publication})");
                        participant.TrackUnmuted?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.LocalTrackPublished:
                    {
                        var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: LocalTrackPublished({publication})");
                        participant.LocalTrackPublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.LocalTrackUnpublished:
                    {
                        var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                        Log.Debug($"Participant: LocalTrackUnpublished({publication})");
                        participant.LocalTrackUnpublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.ParticipantMetadataChanged:
                    {
                        var pmPtr = JSNative.ShiftStack();
                        string prevMetadata = null;
                        if (JSNative.IsString(pmPtr))
                            prevMetadata = JSNative.GetString(pmPtr);
                        
                        Log.Debug($"Participant: ParticipantMetadataChanged({prevMetadata})");
                        participant.ParticipantMetadataChanged?.Invoke(prevMetadata);
                        break;
                    }
                    case ParticipantEvent.DataReceived:
                    {
                        var data = Acquire<JSUint8Array>(JSNative.ShiftStack());
                        var kind = (DataPacketKind) JSNative.GetNumber(JSNative.ShiftStack());
                        Log.Debug($"Participant: DataReceived({data}, {kind})");
                        participant.DataReceived?.Invoke(data.ToArray(), kind);
                        break;
                    }
                    case ParticipantEvent.IsSpeakingChanged:
                    {
                        var isSpeaking = JSNative.GetBoolean(JSNative.ShiftStack());
                        Log.Debug($"Participant: IsSpeakingChanged({isSpeaking})");
                        participant.IsSpeakingChanged?.Invoke(isSpeaking);
                        break;
                    }
                    case ParticipantEvent.ConnectionQualityChanged:
                    {
                        var quality = Utils.ToEnum<ConnectionQuality>(JSNative.GetString(JSNative.ShiftStack()));
                        Log.Debug($"Participant: ConnectionQualityChanged({quality})");
                        participant.ConnectionQualityChanged?.Invoke(quality);
                        break;
                    }
                    case ParticipantEvent.TrackStreamStateChanged:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        var stateref = JSNative.GetString(JSNative.ShiftStack());

                        var state = Utils.ToEnum<TrackStreamState>(stateref);
                        Log.Debug($"Participant: TrackStreamStateChanged({publication}, {state})");
                        participant.TrackStreamStateChanged?.Invoke(publication, state);
                        break;
                    }
                    case ParticipantEvent.TrackSubscriptionPermissionChanged:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        var stateref = JSNative.GetString(JSNative.ShiftStack());

                        var status = Utils.ToEnum<SubscriptionStatus>(stateref);
                        Log.Debug($"Participant: TrackStreamStateChanged({publication}, {status})");
                        participant.TrackSubscriptionPermissionChanged?.Invoke(publication, status);
                        break;
                    }
                }
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on ParticipantEvent.{evRef.Event} ( Is your listeners working correctly ? ): {Environment.NewLine} {e.Message}");
            }
        }

        [Preserve]
        internal Participant(JSHandle handle) : base(handle)
        {
            RegisterEvents();
        }
        
        private void RegisterEvents()
        {
            foreach (var e in Enum.GetValues(typeof(ParticipantEvent)))
                SetListener((ParticipantEvent) e, EventReceived);
        }

        public JSArray<TrackPublication> GetTracks()
        {
            return Acquire<JSArray<TrackPublication>>(JSNative.CallMethod(NativeHandle, "getTracks"));
        }

        public TrackPublication GetTrack(TrackSource source)
        {
            JSNative.PushString(Utils.ToEnumString(source));

            var ptr = JSNative.CallMethod(NativeHandle, "getTrack");
            if (!JSNative.IsObject(ptr))
                return null;
            
            return Acquire<TrackPublication>(ptr);
        }

        public TrackPublication GetTrackByName(string name)
        {
            JSNative.PushString(name);

            var ptr = JSNative.CallMethod(NativeHandle, "getTrackByName");
            if (!JSNative.IsObject(ptr))
                return null;
            
            return Acquire<TrackPublication>(ptr);
        }
    }
}
