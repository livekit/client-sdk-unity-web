using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

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


    public class Room : JSRef
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
        public delegate void LocalTrackUnpublished(LocalTrackPublication publication, LocalParticipant participant);
        public delegate void ParticipantMetadataChangedDelegate(string? metadata, Participant participant);
        public delegate void ActiveSpeakersChangedDelegate(JSArray<Participant> speakers);
        public delegate void RoomMetadataChangedDelegate(string metadata);
        public delegate void DataReceivedDelegate(byte[] data, RemoteParticipant? participant, DataPacketKind? kind);
        public delegate void ConnectionQualityChangedDelegate(ConnectionQuality quality, Participant participant);
        public delegate void MediaDevicesErrorDelegate(JSError error);
        public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publicationb, Track.StreamState streamState, RemoteParticipant participant);
        public delegate void TrackSubscriptionPermissionChanged(RemoteTrackPublication publication, TrackPublication.SubscriptionStatus status, RemoteParticipant participant);
        public delegate void AudioPlaybackChangedDelegate(bool playing);

        public Room(RoomOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            JSNative.NewInstance(LiveKit, NativePtr, "Room");
        }

        public JSPromise Connect(string url, string token, ConnectOptions? options = null)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);

            if(options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return new JSPromise(JSNative.CallMethod(NativePtr, "connect"));
        }

    }
}