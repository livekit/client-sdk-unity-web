using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RoomEvent
    {
        [EnumMember(Value = "reconnecting")]
        Reconnecting,
        [EnumMember(Value = "reconnected")]
        Reconnected,
        [EnumMember(Value = "disconnected")]
        Disconnected,
        [EnumMember(Value = "stateChanged")]
        StateChanged,
        [EnumMember(Value = "mediaDevicesChanged")]
        MediaDevicesChanged,
        [EnumMember(Value = "participantConnected")]
        ParticipantConnected,
        [EnumMember(Value = "participantDisconnected")]
        ParticipantDisconnected,
        [EnumMember(Value = "trackPublished")]
        TrackPublished,
        [EnumMember(Value = "trackSubscribed")]
        TrackSubscribed,
        [EnumMember(Value = "trackSubscriptionFailed")]
        TrackSubscriptionFailed,
        [EnumMember(Value = "trackUnpublished")]
        TrackUnpublished,
        [EnumMember(Value = "trackUnsubscribed")]
        TrackUnsubscribed,
        [EnumMember(Value = "trackMuted")]
        TrackMuted,
        [EnumMember(Value = "trackUnmuted")]
        TrackUnmuted,
        [EnumMember(Value = "localTrackPublished")]
        LocalTrackPublished,
        [EnumMember(Value = "localTrackUnpublished")]
        LocalTrackUnpublished,
        [EnumMember(Value = "activeSpeakersChanged")]
        ActiveSpeakersChanged,
        [EnumMember(Value = "participantMetadataChanged")]
        ParticipantMetadataChanged,
        [EnumMember(Value = "roomMetadataChanged")]
        RoomMetadataChanged,
        [EnumMember(Value = "dataReceived")]
        DataReceived,
        [EnumMember(Value = "connectionQualityChanged")]
        ConnectionQualityChanged,
        [EnumMember(Value = "trackStreamStateChanged")]
        TrackStreamStateChanged,
        [EnumMember(Value = "trackSubscriptionPermissionChanged")]
        TrackSubscriptionPermissionChanged,
        [EnumMember(Value = "audioPlaybackChanged")]
        AudioPlaybackStatusChanged,
        [EnumMember(Value = "mediaDevicesError")]
        MediaDevicesError
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum ParticipantEvent
    {
        [EnumMember(Value = "trackPublished")]
        TrackPublished,
        [EnumMember(Value = "trackSubscribed")]
        TrackSubscribed,
        [EnumMember(Value = "trackSubscriptionFailed")]
        TrackSubscriptionFailed,
        [EnumMember(Value = "trackUnpublished")]
        TrackUnpublished,
        [EnumMember(Value = "trackUnsubscribed")]
        TrackUnsubscribed,
        [EnumMember(Value = "trackMuted")]
        TrackMuted,
        [EnumMember(Value = "trackUnmuted")]
        TrackUnmuted,
        [EnumMember(Value = "localTrackPublished")]
        LocalTrackPublished,
        [EnumMember(Value = "localTrackUnpublished")]
        LocalTrackUnpublished,
        [EnumMember(Value = "participantMetadataChanged")]
        ParticipantMetadataChanged,
        [EnumMember(Value = "dataReceived")]
        DataReceived,
        [EnumMember(Value = "isSpeakingChanged")]
        IsSpeakingChanged,
        [EnumMember(Value = "connectionQualityChanged")]
        ConnectionQualityChanged,
        [EnumMember(Value = "trackStreamStateChanged")]
        TrackStreamStateChanged,
        [EnumMember(Value = "trackSubscriptionPermissionChanged")]
        TrackSubscriptionPermissionChanged,
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum TrackEvent
    {
        [EnumMember(Value = "message")]
        Message,
        [EnumMember(Value = "muted")]
        Muted,
        [EnumMember(Value = "unmuted")]
        Unmuted,
        [EnumMember(Value = "ended")]
        Ended
    }
}