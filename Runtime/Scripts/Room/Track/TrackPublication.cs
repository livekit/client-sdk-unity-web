using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    public class TrackPublication : JSRef
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public enum SubscriptionStatus
        {
            [EnumMember(Value = "subscribed")]
            Subscribed,
            [EnumMember(Value = "not_allowed")]
            NotAllowed,
            [EnumMember(Value = "unsubscribed")]
            Unsubscribed
        }
    }
}