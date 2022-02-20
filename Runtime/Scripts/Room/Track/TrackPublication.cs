using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class TrackPublication : JSRef
    {
        [Preserve]
        public TrackPublication(IntPtr ptr) : base(ptr)
        {

        }

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