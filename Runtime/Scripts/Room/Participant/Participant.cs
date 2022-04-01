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

        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void EventReceived(IntPtr iptr)
        {
            var handle = new JSHandle(iptr);
            try
            {
                var evRef = Acquire<EventWrapper>(handle);
                var participant = Acquire<Participant>(JSNative.GetFunctionInstance());
                
                switch (evRef.Event)
                {
                    case ParticipantEvent.TrackPublished:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackPublished({publication})");
                        participant.TrackPublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackSubscribed:
                    {
                        var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackSubscribed({track.Sid}, {publication})");
                        participant.TrackSubscribed?.Invoke(track, publication);
                        break;
                    }
                    case ParticipantEvent.TrackSubscriptionFailed:
                    {
                        var trackSid = Acquire<JSString>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackSubscriptionFailed(\"{trackSid}\"");
                        participant.TrackSubscriptionFailed?.Invoke(trackSid.ToString());
                        break;
                    }
                    case ParticipantEvent.TrackUnpublished:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackUnpublished({publication})");
                        participant.TrackUnpublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackUnsubscribed:
                    {
                        var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackUnsubscribed({track.Sid}, {publication})");
                        participant.TrackUnsubscribed?.Invoke(track, publication);
                        break;
                    }
                    case ParticipantEvent.TrackMuted:
                    {
                        var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackMuted({publication})");
                        participant.TrackMuted?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.TrackUnmuted:
                    {
                        var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: TrackUnmuted({publication})");
                        participant.TrackUnmuted?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.LocalTrackPublished:
                    {
                        var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: LocalTrackPublished({publication})");
                        participant.LocalTrackPublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.LocalTrackUnpublished:
                    {
                        var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                        Log.Info($"Participant: LocalTrackUnpublished({publication})");
                        participant.LocalTrackUnpublished?.Invoke(publication);
                        break;
                    }
                    case ParticipantEvent.ParticipantMetadataChanged:
                    {
                        var prevMetadata = AcquireOrNull<JSString>(JSNative.ShiftStack())?.ToString();
                        Log.Info($"Participant: ParticipantMetadataChanged({prevMetadata})");
                        participant.ParticipantMetadataChanged?.Invoke(prevMetadata);
                        break;
                    }
                    case ParticipantEvent.DataReceived:
                    {
                        var dataref = Acquire<JSRef>(JSNative.ShiftStack());
                        var dataPtr = JSNative.GetDataPtr(dataref.NativePtr);
                        var data = JSNative.GetData(dataPtr);

                        var kind = (DataPacketKind) Acquire<JSNumber>(JSNative.ShiftStack()).ToNumber();
                        Log.Info($"Participant: DataReceived({data}, {kind})");
                        participant.DataReceived?.Invoke(data, kind);
                        break;
                    }
                    case ParticipantEvent.IsSpeakingChanged:
                    {
                        var isSpeaking = Acquire<JSBoolean>(JSNative.ShiftStack()).ToBool();
                        Log.Info($"Participant: IsSpeakingChanged({isSpeaking})");
                        participant.IsSpeakingChanged?.Invoke(isSpeaking);
                        break;
                    }
                    case ParticipantEvent.ConnectionQualityChanged:
                    {
                        var quality = Utils.ToEnum<ConnectionQuality>(Acquire<JSString>(JSNative.ShiftStack()).ToString());
                        Log.Info($"Participant: ConnectionQualityChanged({quality})");
                        participant.ConnectionQualityChanged?.Invoke(quality);
                        break;
                    }
                    case ParticipantEvent.TrackStreamStateChanged:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        var stateref = Acquire<JSString>(JSNative.ShiftStack());

                        var state = Utils.ToEnum<TrackStreamState>(stateref.ToString());
                        Log.Info($"Participant: TrackStreamStateChanged({publication}, {state})");
                        participant.TrackStreamStateChanged?.Invoke(publication, state);
                        break;
                    }
                    case ParticipantEvent.TrackSubscriptionPermissionChanged:
                    {
                        var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                        var stateref = Acquire<JSString>(JSNative.ShiftStack());

                        var status = Utils.ToEnum<SubscriptionStatus>(stateref.ToString());
                        Log.Info($"Participant: TrackStreamStateChanged({publication}, {status})");
                        participant.TrackSubscriptionPermissionChanged?.Invoke(publication, status);
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


        [Preserve]
        public Participant(JSHandle ptr) : base(ptr)
        {
            foreach (var e in Enum.GetValues(typeof(ParticipantEvent)))
                SetListener((ParticipantEvent) e, EventReceived);
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