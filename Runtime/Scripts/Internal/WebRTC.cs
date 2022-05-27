using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
    public struct ConstrainBoolean
    {
        [JsonProperty("exact")]
        public bool Exact;
        [JsonProperty("ideal")]
        public bool Ideal;
        
        public static implicit operator ConstrainBoolean(bool value)
        {
            return new ConstrainBoolean()
            {
                Exact = value
            };
        }
    }

    public struct ConstrainDOMString
    {
        [JsonProperty("exact")] 
        public string[] Exact;
        [JsonProperty("ideal")]
        public string[] Ideal;
        
        public static implicit operator ConstrainDOMString(string value)
        {
            return new ConstrainDOMString()
            {
                Exact = new string[] {value}
            };
        }
        
        public static implicit operator ConstrainDOMString(string[] value)
        {
            return new ConstrainDOMString()
            {
                Exact = value
            };
        }
    }

    public struct ConstrainULong
    {
        [JsonProperty("exact")]
        public ulong Exact;
        [JsonProperty("ideal")]
        public ulong Ideal;
        [JsonProperty("min")]
        public ulong Min;
        [JsonProperty("max")]
        public ulong Max;
        
        public static implicit operator ConstrainULong(ulong value)
        {
            return new ConstrainULong()
            {
                Exact = value
            };
        }
    }

    public struct ConstrainDouble
    {
        [JsonProperty("exact")]
        public double Exact;
        [JsonProperty("ideal")]
        public double Ideal;
        [JsonProperty("min")]
        public double Min;
        [JsonProperty("max")]
        public double Max;
        
        public static implicit operator ConstrainDouble(double value)
        {
            return new ConstrainDouble()
            {
                Exact = value
            };
        }
    }
    
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
        public string Credential;
        [JsonProperty("credentialType")]
        public RTCIceCredentialType? CredentialType;
        [JsonProperty("urls")]
        public string[] URLs;
        [JsonProperty("username")]
        public string Username;
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
    
    [JsonConverter(typeof(StringEnumConverter))]
    public enum MediaDeviceKind
    {
        [EnumMember(Value = "audioinput")]
        AudioInput,
        [EnumMember(Value = "audiooutput")]
        AudioOutput,
        [EnumMember(Value = "videoinput")]
        VideoInput
    }
    
    public struct MediaDeviceInfo
    {
        [JsonProperty("deviceId")]
        public string DeviceId;
        [JsonProperty("groupId")]
        public string GroupId;
        [JsonProperty("kind")]
        public MediaDeviceKind Kind;
        [JsonProperty("label")]
        public string Label;
    }
}