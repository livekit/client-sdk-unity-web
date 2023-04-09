using Newtonsoft.Json;

namespace LiveKit
{
    public struct ParticipantTrackPermission
    {
        [JsonProperty("participantIdentity")]
        public string ParticipantIdentity;
        [JsonProperty("allowAll")]
        public bool? AllowAll;
        [JsonProperty("allowedTrackSids")]
        public string[] AllowedTrackSids;
    }
}