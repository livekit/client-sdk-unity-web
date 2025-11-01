using Newtonsoft.Json;
namespace LiveKit
{
    public struct PublishDataOptions
    {
        [JsonProperty("reliable")]
        public bool Reliable;
        [JsonProperty("destinationIdentities")]
        public string[] DestinationIdentities;
        [JsonProperty("topic")]
        public string Topic;
    }
}
