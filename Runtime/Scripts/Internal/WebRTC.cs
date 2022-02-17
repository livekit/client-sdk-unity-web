using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RTCIceCredentialType
    {
        [EnumMember(Value = "oauth")]
        OAuth,
        [EnumMember(Value = "password")]
        Password,
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum RTCBundlePolicy
    {
        [EnumMember(Value = "balanced")]
        Balanced,
        [EnumMember(Value = "max-bundle")]
        MaxBundle,
        [EnumMember(Value = "max-compat")]
        MaxCompat,
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum RTCIceTransportPolicy
    {
        [EnumMember(Value = "all")]
        All,
        [EnumMember(Value = "relay")]
        Relay
    };


    [JsonConverter(typeof(StringEnumConverter))]
    public enum RTCRtcpMuxPolicy
    {
        [EnumMember(Value = "require")]
        Require,
        [EnumMember(Value = "negotiate")]
        Negotiate,
    };

    public struct RTCIceServer
    {
        [JsonProperty("credential")]
        public string? Credential;
        [JsonProperty("credentialType")]
        public RTCIceCredentialType? CredentialType;
        [JsonProperty("urls")]
        public string[] URLs;
        [JsonProperty("username")]
        public string? Username;
}

    public struct RTCConfiguration
    {
        [JsonProperty("bundlePolicy")]
        public RTCBundlePolicy? BundlePolicy;
        [JsonProperty("certificates")]
        public JSRef[] Certificates;
        [JsonProperty("iceCandidatePoolSize")]
        public ushort? IceCandidatePoolSize;
        [JsonProperty("iceServers")]
        public RTCIceServer[] IceServers;
        [JsonProperty("iceTransportPolicy")]
        public RTCIceTransportPolicy? IceTransportPolicy;
        [JsonProperty("rtcpMuxPolicy")]
        public RTCRtcpMuxPolicy? RTCPMuxPolicy;
    }
}