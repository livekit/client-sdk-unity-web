


using Newtonsoft.Json;

namespace LiveKit
{
    public enum RTCIceCredentialType
    {
        [JsonProperty("oauth")]
        OAuth,
        [JsonProperty("password")]
        Password,
    }

    public enum RTCBundlePolicy
    {
        [JsonProperty("balanced")]
        Balanced,
        [JsonProperty("max-bundle")]
        MaxBundle,
        [JsonProperty("max-compat")]
        MaxCompat,
    }
    public enum RTCIceTransportPolicy
    {
        [JsonProperty("all")]
        All,
        [JsonProperty("relay")]
        Relay
    };

    public enum RTCRtcpMuxPolicy
    {
        [JsonProperty("require")]
        Require,
        [JsonProperty("negotiate")]
        Negotiate,
    };

    public struct RTCIceServer
    {
        [JsonProperty("credential")]
        string? Credential;
        [JsonProperty("credentialType")]
        RTCIceCredentialType? CredentialType;
        [JsonProperty("urls")]
        string[] URLs;
        [JsonProperty("username")]
        string? Username;
}

    public struct RTCConfiguration
    {
        [JsonProperty("bundlePolicy")]
        RTCBundlePolicy? BundlePolicy;
        [JsonProperty("certificates")]
        JSRef[] Certificates;
        [JsonProperty("iceCandidatePoolSize")]
        ushort? IceCandidatePoolSize;
        [JsonProperty("iceServers")]
        RTCIceServer[] IceServers;
        [JsonProperty("iceTransportPolicy")]
        RTCIceTransportPolicy? IceTransportPolicy;
        [JsonProperty("iceTransportPolicy")]
        RTCRtcpMuxPolicy? RTCPMuxPolicy;
    }
}