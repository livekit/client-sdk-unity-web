using Newtonsoft.Json;
using System;

namespace LiveKit
{
    [Serializable]
    public struct TranscriptionSegment
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("language")]
        public string Language { get; set; }
        [JsonProperty("startTime")]
        public int StartTime { get; set; }
        [JsonProperty("endTime")]
        public int EndTime { get; set; }
        [JsonProperty("final")]
        public bool Final { get; set; }
        [JsonProperty("firstReceivedTime")]
        public long FirstReceivedTime { get; set; }
        [JsonProperty("lastReceivedTime")]
        public long LastReceivedTime { get; set; }
    }
}