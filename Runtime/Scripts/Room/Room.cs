using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using AOT;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RoomState {
        [EnumMember(Value = "disconnected")]
        Disconnected,
        [EnumMember(Value = "connected")]
        Connected,
        [EnumMember(Value = "reconnecting")]
        Reconnecting
    }

    public class Room : JSObject
    {
        public delegate void ReconnectingDelegate();
        public delegate void ReconnectedDelegate();
        public delegate void DisconnectedDelegate();
        public delegate void StateChangedDelegate(RoomState state);
        public delegate void MediaDevicesChangedDelegate();
        public delegate void ParticipantConnectedDelegate(RemoteParticipant participant);
        public delegate void ParticipantDisconnectedDelegate(RemoteParticipant participant);
        public delegate void TrackPublishedDelegate(RemoteTrackPublication publication, RemoteParticipant participant);
        public delegate void TrackSubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication, RemoteParticipant participant);
        public delegate void TrackSubscriptionFailedDelegate(string trackSid, RemoteParticipant participant);
        public delegate void TrackUnpublishedDelegate(RemoteTrackPublication publication, RemoteParticipant participant);
        public delegate void TrackUnsubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication, RemoteParticipant participant);
        public delegate void TrackMutedDelegate(TrackPublication publication, Participant participant);
        public delegate void TrackUnmutedDelegate(TrackPublication publication, Participant participant);
        public delegate void LocalTrackPublishedDelegate(LocalTrackPublication publication, LocalParticipant participant);
        public delegate void LocalTrackUnpublishedDelegate(LocalTrackPublication publication, LocalParticipant participant);
        public delegate void ParticipantMetadataChangedDelegate(string metadata, Participant participant);
        public delegate void ActiveSpeakersChangedDelegate(JSArray<Participant> speakers);
        public delegate void RoomMetadataChangedDelegate(string metadata);
        public delegate void DataReceivedDelegate(byte[] data, RemoteParticipant participant, DataPacketKind? kind);
        public delegate void ConnectionQualityChangedDelegate(ConnectionQuality quality, Participant participant);
        public delegate void MediaDevicesErrorDelegate(JSError error);
        public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publicationb, TrackStreamState streamState, RemoteParticipant participant);
        public delegate void TrackSubscriptionPermissionChangedDelegate(RemoteTrackPublication publication, SubscriptionStatus status, RemoteParticipant participant);
        public delegate void AudioPlaybackChangedDelegate(bool playing);
        
        public event ReconnectingDelegate Reconnecting;
        public event ReconnectedDelegate Reconnected;
        public event DisconnectedDelegate Disconnected;
        public event StateChangedDelegate StateChanged;
        public event MediaDevicesChangedDelegate MediaDevicesChanged;
        public event ParticipantConnectedDelegate ParticipantConnected;
        public event ParticipantDisconnectedDelegate ParticipantDisconnected;
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
        public event ActiveSpeakersChangedDelegate ActiveSpeakersChanged;
        public event RoomMetadataChangedDelegate RoomMetadataChanged;
        public event DataReceivedDelegate DataReceived;
        public event ConnectionQualityChangedDelegate ConnectionQualityChanged;
        public event MediaDevicesErrorDelegate MediaDevicesError;
        public event TrackStreamStateChangedDelegate TrackStreamStateChanged;
        public event TrackSubscriptionPermissionChangedDelegate TrackSubscriptionPermissionChanged;
        public event AudioPlaybackChangedDelegate AudioPlaybackChanged;

        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void EventReceived(IntPtr iptr)
        {
            try
            {
                var evRef = Acquire<JSEventListener<RoomEvent>>(iptr);
                evRef.JSRef.TryGetTarget(out var jsRef);
                var room = Acquire<Room>(JSNative.GetFunctionInstance());

                switch (evRef.Event)
                {
                    case RoomEvent.Reconnecting:
                        Log.Info("Room: Received Reconnecting");
                        room.Reconnecting?.Invoke();
                        break;
                    case RoomEvent.Reconnected:
                        Log.Info("Room: Received Reconnected");
                        room.Reconnected?.Invoke();
                        break;
                    case RoomEvent.Disconnected:
                        Log.Info("Room: Received Disconnected");
                        room.Disconnected?.Invoke();
                        break;
                    case RoomEvent.StateChanged:
                        {
                            var str = Acquire<JSString>(JSNative.ShiftStack()).ToString();
                            Log.Info($"Room: Received StateChanged(\"{str}\"");
                            room.StateChanged?.Invoke(Utils.ToEnum<RoomState>(str));
                            break;
                        }
                    case RoomEvent.MediaDevicesChanged:
                        Log.Info($"Room: Received MediaDevicesChanged");
                        room.MediaDevicesChanged?.Invoke();
                        break;
                    case RoomEvent.ParticipantConnected:
                        {
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received ParticipantConnected({participant.Sid})");
                            room.ParticipantConnected?.Invoke(participant);
                            break;
                        }
                    case RoomEvent.ParticipantDisconnected:
                        {
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received ParticipantDisconnected({participant.Sid})");
                            room.ParticipantDisconnected?.Invoke(participant);
                            break;
                        }
                    case RoomEvent.TrackPublished:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackPublished({publication}, {participant.Sid})");
                            room.TrackPublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscribed:
                        {
                            var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackSubscribed({track.Sid}, {publication}, {participant.Sid})");
                            room.TrackSubscribed?.Invoke(track, publication, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscriptionFailed:
                        {
                            var sid = Acquire<JSString>(JSNative.ShiftStack()).ToString();
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackSubscriptionFailed({sid}, {participant.Sid})");
                            room.TrackSubscriptionFailed?.Invoke(sid, participant);
                            break;
                        }
                    case RoomEvent.TrackUnpublished:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackUnpublished({publication}, {participant.Sid})");
                            room.TrackUnpublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackUnsubscribed:
                        {
                            var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackUnsubscribed({track}, {publication}, {participant.Sid})");
                            room.TrackUnsubscribed?.Invoke(track, publication, participant);
                            break;
                        }
                    case RoomEvent.TrackMuted:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackMuted({publication}, {participant.Sid})");
                            room.TrackMuted?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackUnmuted:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received TrackUnmuted({publication}, {participant.Sid})");
                            room.TrackUnmuted?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.LocalTrackPublished:
                        {
                            var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received LocalTrackPublished({publication}, {participant.Sid})");
                            room.LocalTrackPublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.LocalTrackUnpublished:
                        {
                            var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received LocalTrackUnpublished({publication}, {participant.Sid})");
                            room.LocalTrackUnpublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.ParticipantMetadataChanged:
                        {
                            var metadata = AcquireOrNull<JSString>(JSNative.ShiftStack());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received ParticipantMetadataChanged(\"{metadata}\", {participant.Sid})");
                            room.ParticipantMetadataChanged?.Invoke(metadata?.ToString(), participant);
                            break;
                        }
                    case RoomEvent.ActiveSpeakersChanged:
                        {
                            var jsarray = Acquire<JSArray<Participant>>(JSNative.ShiftStack());
                            Log.Info($"Room: Received ActiveSpeakersChanged({jsarray})");
                            room.ActiveSpeakersChanged?.Invoke(jsarray);
                            break;
                        }
                    case RoomEvent.RoomMetadataChanged:
                        {
                            var metadata = Acquire<JSString>(JSNative.ShiftStack()).ToString();
                            Log.Info($"Room: Received ActiveSpeakersChanged(\"{metadata}\")");
                            room.RoomMetadataChanged?.Invoke(metadata);
                            break;
                        }
                    case RoomEvent.DataReceived:
                        {
                            var dataref = Acquire<JSRef>(JSNative.ShiftStack());
                            var dataPtr = JSNative.GetDataPtr(dataref.NativePtr);
                            var data = JSNative.GetData(dataPtr);

                            var participant = AcquireOrNull<RemoteParticipant>(JSNative.ShiftStack());

                            var kindObj = AcquireOrNull<JSNumber>(JSNative.ShiftStack());
                            var kind = kindObj != null ? (DataPacketKind?) kindObj.ToNumber() : null;

                            Log.Info($"Room: Received DataReceived({data}, {participant.Sid}, {kind})");
                            room.DataReceived?.Invoke(data, participant, kind);
                            break;
                        }
                    case RoomEvent.ConnectionQualityChanged:
                        {
                            var quality = Utils.ToEnum<ConnectionQuality>(Acquire<JSString>(JSNative.ShiftStack()).ToString());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Info($"Room: Received ConnectionQualityChanged({quality}, {participant.Sid})");
                            room.ConnectionQualityChanged?.Invoke(quality, participant);
                            break;
                        }
                    case RoomEvent.MediaDevicesError:
                        {
                            var error = Acquire<JSError>(JSNative.ShiftStack());
                            Log.Info($"Room: Received MediaDevicesError({error.Message})");
                            room.MediaDevicesError?.Invoke(error);
                            break;
                        }
                    case RoomEvent.TrackStreamStateChanged:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var stateref = Acquire(JSNative.ShiftStack());

                            var state = Utils.ToEnum<TrackStreamState>(JSNative.GetString(stateref.NativePtr));
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

                            Log.Info($"Room: Received TrackStreamStateChanged({publication}, {state}, {participant.Sid})");
                            room.TrackStreamStateChanged?.Invoke(publication, state, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscriptionPermissionChanged:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var stateref = Acquire<JSString>(JSNative.ShiftStack());

                            var status = Utils.ToEnum<SubscriptionStatus>(stateref.ToString());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

                            Log.Info($"Room: Received TrackSubscriptionPermissionChanged({publication}, {status}, {participant.Sid})");
                            room.TrackSubscriptionPermissionChanged?.Invoke(publication, status, participant);
                            break;
                        }
                    case RoomEvent.AudioPlaybackStatusChanged:
                        {
                            bool status = Acquire<JSBoolean>(JSNative.ShiftStack()).ToBool();
                            Log.Info($"Room: Received AudioPlaybackChanged({status})");
                            room.AudioPlaybackChanged?.Invoke(status);
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
        
        public RoomState State
        {
            get
            {
                JSNative.PushString("state");
                var ptr = Acquire<JSString>(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<RoomState>(ptr.ToString());
            }
        }

        public JSMap<string, RemoteParticipant> Participants
        {
            get
            {
                JSNative.PushString("participants");
                return Acquire<JSMap<string, RemoteParticipant>>(JSNative.GetProperty(NativePtr));
            }
        }

        public JSArray<Participant> ActiveSpeakers
        {
            get
            {
                JSNative.PushString("activeSpeakers");
                return Acquire<JSArray<Participant>>(JSNative.GetProperty(NativePtr));
            }
        }

        public string Sid
        {
            get 
            {
                JSNative.PushString("sid");
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }

        public string Name
        {
            get
            {
                JSNative.PushString("name");
                return Acquire<JSString>(JSNative.GetProperty(NativePtr)).ToString();
            }
        }

        public LocalParticipant LocalParticipant
        {
            get
            {
                JSNative.PushString("localParticipant");
                return Acquire<LocalParticipant>(JSNative.GetProperty(NativePtr));
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

        public RoomOptions RoomOptions
        {
            get
            {
                JSNative.PushString("options");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetStruct<RoomOptions>(ptr.NativePtr);
            }
        }

        public bool CanPlaybackAudio
        {
            get
            {
                JSNative.PushString("canPlaybackAudio");
                var ptr = Acquire<JSBoolean>(JSNative.GetProperty(NativePtr));
                return ptr.ToBool();
            }
        }

        private List<JSEventListener<RoomEvent>> m_Listeners = new List<JSEventListener<RoomEvent>>();
        
        [Preserve]
        public Room(IntPtr ptr) : base(ptr)
        {
            Init();
        }

        public Room(RoomOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            JSNative.NewInstance(JSNative.LiveKit.NativePtr, NativePtr, "Room");
            Init();

            JSBridge.SendRoomCreated(this);
        }

        private void Init()
        {
            KeepAlive(this);
            
            foreach(var e in Enum.GetValues(typeof(RoomEvent)))
                m_Listeners.Add(new JSEventListener<RoomEvent>(this, (RoomEvent) e, EventReceived));
        }

        public ConnectOperation Connect(string url, string token, RoomConnectOptions? options = null)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);

            if(options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return new ConnectOperation(Acquire<JSPromise<Room>>(JSNative.CallMethod(NativePtr, "connect")));
        }

        public void Disconnect(bool stopTracks = true)
        {
            JSNative.PushBoolean(stopTracks);
            Acquire(JSNative.CallMethod(NativePtr, "disconnect"));
        }

        public Participant GetParticipantByIdentity(string identity)
        {
            JSNative.PushString(identity);
            return AcquireOrNull<Participant>(JSNative.CallMethod(NativePtr, "getParticipantByIdentity"));
        }

        public JSPromise StartAudio()
        {
            return Acquire<JSPromise>(JSNative.CallMethod(NativePtr, "startAudio"));
        }

        public JSPromise SwitchActiveDevice(MediaDeviceKind kind, string deviceId)
        {
            JSNative.PushString(Utils.ToEnumString(kind));
            JSNative.PushString(deviceId);
            return Acquire<JSPromise>(JSNative.CallMethod(NativePtr, "switchActiveDevice"));
        }
    }

    public class ConnectOperation : PromiseWrapper<Room>
    {
        public Room Room { get; private set; }
        public JSError Error { get; private set; }

        public ConnectOperation(JSPromise<Room> promise) : base(promise)
        {

        }

        public override void OnDone()
        {
            if (!m_Promise.IsError)
                Room = m_Promise.ResolveValue;
            else
                Error = m_Promise.RejectValue as JSError;
        }
    }
}