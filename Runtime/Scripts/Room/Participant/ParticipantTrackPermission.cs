using Newtonsoft.Json;

namespace LiveKit
{
    public struct ParticipantTrackPermission
    {
        [JsonProperty("participantSid")]
        public string ParticipantSid;
        [JsonProperty("allowAll")]
        public bool? AllowAll;
        [JsonProperty("allowedTrackSids")]
        public string[] AllowedTrackSids;
    }
}