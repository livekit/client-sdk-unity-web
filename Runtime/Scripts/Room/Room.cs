using System;
using System.Runtime.Serialization;
using AOT;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ConnectionState {
        [EnumMember(Value = "disconnected")]
        Disconnected,
        [EnumMember(Value = "connecting")]
        Connecting,
        [EnumMember(Value = "connected")]
        Connected,
        [EnumMember(Value = "reconnecting")]
        Reconnecting
    }

    public class Room : JSEventEmitter<RoomEvent>, IDisposable
    {
        public delegate void ReconnectingDelegate();
        public delegate void ReconnectedDelegate();
        public delegate void DisconnectedDelegate(DisconnectReason? reason);
        public delegate void StateChangedDelegate(ConnectionState state);
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
        public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publication, TrackStreamState streamState, RemoteParticipant participant);
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

        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void EventReceived(IntPtr iptr)
        {
            var handle = new JSHandle(iptr, true);
            var evRef = Acquire<EventWrapper>(handle);

            try
            {
                var room = Acquire<Room>(JSNative.GetFunctionInstance());

                switch (evRef.Event)
                {
                    case RoomEvent.Reconnecting:
                        Log.Debug("Room: Received Reconnecting");
                        room.Reconnecting?.Invoke();
                        break;
                    case RoomEvent.Reconnected:
                        Log.Debug("Room: Received Reconnected");
                        room.Reconnected?.Invoke();
                        break;
                    case RoomEvent.Disconnected:
                    {
                        var pPtr = JSNative.ShiftStack();
                        DisconnectReason? reason = null;
                        if(JSNative.IsNumber(pPtr))
                            reason = (DisconnectReason?) JSNative.GetNumber(pPtr);

                        Log.Debug($"Room: Received Disconnected({reason})");
                        room.Disconnected?.Invoke(reason);
                        break;
                    }
                    case RoomEvent.StateChanged:
                        {
                            var str = JSNative.GetString(JSNative.ShiftStack());
                            Log.Debug($"Room: Received StateChanged(\"{str}\"");
                            room.StateChanged?.Invoke(Utils.ToEnum<ConnectionState>(str));
                            break;
                        }
                    case RoomEvent.MediaDevicesChanged:
                        Log.Debug($"Room: Received MediaDevicesChanged");
                        room.MediaDevicesChanged?.Invoke();
                        break;
                    case RoomEvent.ParticipantConnected:
                        {
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ParticipantConnected({participant.Sid})");
                            room.ParticipantConnected?.Invoke(participant);
                            break;
                        }
                    case RoomEvent.ParticipantDisconnected:
                        {
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ParticipantDisconnected({participant.Sid})");
                            room.ParticipantDisconnected?.Invoke(participant);
                            break;
                        }
                    case RoomEvent.TrackPublished:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackPublished({publication}, {participant.Sid})");
                            room.TrackPublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscribed:
                        {
                            var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackSubscribed({track.Sid}, {publication}, {participant.Sid})");
                            room.TrackSubscribed?.Invoke(track, publication, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscriptionFailed:
                        {
                            var sid = JSNative.GetString(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackSubscriptionFailed({sid}, {participant.Sid})");
                            room.TrackSubscriptionFailed?.Invoke(sid, participant);
                            break;
                        }
                    case RoomEvent.TrackUnpublished:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackUnpublished({publication}, {participant.Sid})");
                            room.TrackUnpublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackUnsubscribed:
                        {
                            var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackUnsubscribed({track}, {publication}, {participant.Sid})");
                            room.TrackUnsubscribed?.Invoke(track, publication, participant);
                            break;
                        }
                    case RoomEvent.TrackMuted:
                        {
                            var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackMuted({publication}, {participant.Sid})");
                            room.TrackMuted?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.TrackUnmuted:
                        {
                            var publication = Acquire<TrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received TrackUnmuted({publication}, {participant.Sid})");
                            room.TrackUnmuted?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.LocalTrackPublished:
                        {
                            var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received LocalTrackPublished({publication}, {participant.Sid})");
                            room.LocalTrackPublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.LocalTrackUnpublished:
                        {
                            var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
                            var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received LocalTrackUnpublished({publication}, {participant.Sid})");
                            room.LocalTrackUnpublished?.Invoke(publication, participant);
                            break;
                        }
                    case RoomEvent.ParticipantMetadataChanged:
                        {
                            var mdPtr = JSNative.ShiftStack();
                            string metadata = null;
                            if (JSNative.IsString(mdPtr))
                                metadata = JSNative.GetString(mdPtr);

                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ParticipantMetadataChanged(\"{metadata}\", {participant.Sid})");
                            room.ParticipantMetadataChanged?.Invoke(metadata, participant);
                            break;
                        }
                    case RoomEvent.ActiveSpeakersChanged:
                        {
                            var jsarray = Acquire<JSArray<Participant>>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ActiveSpeakersChanged({jsarray})");
                            room.ActiveSpeakersChanged?.Invoke(jsarray);
                            break;
                        }
                    case RoomEvent.RoomMetadataChanged:
                        {
                            var metadata = JSNative.GetString(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ActiveSpeakersChanged(\"{metadata}\")");
                            room.RoomMetadataChanged?.Invoke(metadata);
                            break;
                        }
                    case RoomEvent.DataReceived:
                        {
                            var data = Acquire<JSUint8Array>(JSNative.ShiftStack());

                            var pPtr = JSNative.ShiftStack();
                            RemoteParticipant participant = null;
                            if(JSNative.IsObject(pPtr))
                                participant = Acquire<RemoteParticipant>(pPtr);

                            var kindPtr = JSNative.ShiftStack();
                            DataPacketKind? kind = null;
                            if (JSNative.IsNumber(kindPtr))
                                kind = (DataPacketKind?) JSNative.GetNumber(kindPtr);

                            Log.Debug($"Room: Received DataReceived({data}, {participant?.Sid}, {kind})");
                            room.DataReceived?.Invoke(data.ToArray(), participant, kind);
                            break;
                        }
                    case RoomEvent.ConnectionQualityChanged:
                        {
                            var quality = Utils.ToEnum<ConnectionQuality>(JSNative.GetString(JSNative.ShiftStack()));
                            var participant = Acquire<Participant>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received ConnectionQualityChanged({quality}, {participant.Sid})");
                            room.ConnectionQualityChanged?.Invoke(quality, participant);
                            break;
                        }
                    case RoomEvent.MediaDevicesError:
                        {
                            var error = Acquire<JSError>(JSNative.ShiftStack());
                            Log.Debug($"Room: Received MediaDevicesError({error.Message})");
                            room.MediaDevicesError?.Invoke(error);
                            break;
                        }
                    case RoomEvent.TrackStreamStateChanged:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var stateref = JSNative.ShiftStack();

                            var state = Utils.ToEnum<TrackStreamState>(JSNative.GetString(stateref));
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

                            Log.Debug($"Room: Received TrackStreamStateChanged({publication}, {state}, {participant.Sid})");
                            room.TrackStreamStateChanged?.Invoke(publication, state, participant);
                            break;
                        }
                    case RoomEvent.TrackSubscriptionPermissionChanged:
                        {
                            var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
                            var stateref = JSNative.GetString(JSNative.ShiftStack());

                            var status = Utils.ToEnum<SubscriptionStatus>(stateref);
                            var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

                            Log.Debug($"Room: Received TrackSubscriptionPermissionChanged({publication}, {status}, {participant.Sid})");
                            room.TrackSubscriptionPermissionChanged?.Invoke(publication, status, participant);
                            break;
                        }
                    case RoomEvent.AudioPlaybackStatusChanged:
                        {
                            var status = JSNative.GetBoolean(JSNative.ShiftStack());
                            Log.Debug($"Room: Received AudioPlaybackChanged({status})");
                            room.AudioPlaybackChanged?.Invoke(status);
                            break;
                        }
                }
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on RoomEvent.{evRef.Event} ( Is your listeners working correctly ? ): {Environment.NewLine} {e.Message}");
            }
        }

        public bool IsClosed
        {
            get
            {
                JSNative.PushString("isClosed");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }

        public ConnectionState State
        {
            get
            {
                JSNative.PushString("state");
                return Utils.ToEnum<ConnectionState>(JSNative.GetString(JSNative.GetProperty(NativeHandle)));
            }
        }

        public JSMap<string, RemoteParticipant> Participants
        {
            get
            {
                JSNative.PushString("participants");
                return Acquire<JSMap<string, RemoteParticipant>>(JSNative.GetProperty(NativeHandle));
            }
        }

        public JSArray<Participant> ActiveSpeakers
        {
            get
            {
                JSNative.PushString("activeSpeakers");
                return Acquire<JSArray<Participant>>(JSNative.GetProperty(NativeHandle));
            }
        }

        public string Sid
        {
            get
            {
                JSNative.PushString("sid");
                return JSNative.GetString(JSNative.GetProperty(NativeHandle));
            }
        }

        public string Name
        {
            get
            {
                JSNative.PushString("name");
                return JSNative.GetString(JSNative.GetProperty(NativeHandle));
            }
        }

        public LocalParticipant LocalParticipant
        {
            get
            {
                JSNative.PushString("localParticipant");
                return Acquire<LocalParticipant>(JSNative.GetProperty(NativeHandle));
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

        public RoomOptions RoomOptions
        {
            get
            {
                JSNative.PushString("options");
                return JSNative.GetStruct<RoomOptions>(JSNative.GetProperty(NativeHandle));
            }
        }

        public bool CanPlaybackAudio
        {
            get
            {
                JSNative.PushString("canPlaybackAudio");
                return JSNative.GetBoolean(JSNative.GetProperty(NativeHandle));
            }
        }

        [Preserve]
        internal Room(JSHandle handle) : base(handle)
        {
            RegisterEvents();
        }

        public Room(RoomOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            JSNative.NewInstance(JSNative.LiveKit, NativeHandle, "Room");
            RegisterEvents();

            JSBridge.SendRoomCreated(this);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            SetKeepAlive(LocalParticipant, false);
        }

        public static JSPromise<JSArray<MediaDeviceInfo>> GetLocalDevices(MediaDeviceKind? kind = null, bool? requestPermissions = null)
        {
            JSNative.PushString("Room");
            var roomClazz = JSNative.GetProperty(JSNative.LiveKit);

            if(kind.HasValue)
                JSNative.PushString(Utils.ToEnumString(kind.Value));
            else
                JSNative.PushUndefined();

            if(requestPermissions.HasValue)
                JSNative.PushBoolean(requestPermissions.Value);

            return Acquire<JSPromise<JSArray<MediaDeviceInfo>>>(JSNative.CallMethod(roomClazz, "getLocalDevices"));
        }

        private void RegisterEvents()
        {
            foreach (var e in Enum.GetValues(typeof(RoomEvent)))
                SetListener((RoomEvent) e, EventReceived);

            SetKeepAlive(LocalParticipant, true);

            ParticipantConnected += (p) => SetKeepAlive(p, true);
            ParticipantDisconnected += (p) => SetKeepAlive(p, false);

            LocalTrackPublished += (publication, participant) => SetKeepAlive(publication.Track, true);
            LocalTrackUnpublished += (publication, participant) => SetKeepAlive(publication.Track, false);

            TrackSubscribed += (track, publication, participant) => SetKeepAlive(track, true);
            TrackUnsubscribed += (track, publication, participant) => SetKeepAlive(track, false);
        }

        public ConnectOperation Connect(string url, string token, RoomConnectOptions? options = null)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);

            if(options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<ConnectOperation>(JSNative.CallMethod(NativeHandle, "connect"));
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Disconnect(bool stopTracks = true)
        {
            JSNative.PushBoolean(stopTracks);
            JSNative.CallMethod(NativeHandle, "disconnect");
        }

        public Participant GetParticipantByIdentity(string identity)
        {
            JSNative.PushString(identity);

            var ptr = JSNative.CallMethod(NativeHandle, "getParticipantByIdentity");
            if (!JSNative.IsObject(ptr))
                return null;

            return Acquire<Participant>(ptr);
        }

        public JSPromise StartAudio()
        {
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "startAudio"));
        }

        public JSPromise SwitchActiveDevice(MediaDeviceKind kind, string deviceId)
        {
            JSNative.PushString(Utils.ToEnumString(kind));
            JSNative.PushString(deviceId);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "switchActiveDevice"));
        }
    }

    public class ConnectOperation : JSPromise
    {
        public JSError Error { get; private set; }

        [Preserve]
        internal ConnectOperation(JSHandle handle) : base(handle)
        {

        }

        protected override void OnReject()
        {
            Error = Acquire<JSError>(RejectHandle);
        }
    }
}