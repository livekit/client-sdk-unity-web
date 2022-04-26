using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LivekitError : JSError
    {
        public int Code
        {
            get
            {
                JSNative.PushString("code");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
        }

        [Preserve]
        internal LivekitError(JSHandle handle) : base(handle)
        {

        }
    }

    public class ConnectionError : LivekitError
    {
        [Preserve]
        internal ConnectionError(JSHandle handle) : base(handle)
        {

        }
    }

    public class TrackInvalidError : LivekitError
    {
        [Preserve]
        internal TrackInvalidError(JSHandle handle) : base(handle)
        {

        }
    }
    public class UnsupportedServer : LivekitError
    {
        [Preserve]
        internal UnsupportedServer(JSHandle handle) : base(handle)
        {

        }
    }

    public class UnexpectedConnectionState : LivekitError
    {
        [Preserve]
        internal UnexpectedConnectionState(JSHandle handle) : base(handle)
        {

        }
    }

    public class PublishDataError : LivekitError
    {
        [Preserve]
        internal PublishDataError(JSHandle handle) : base(handle)
        {

        }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum MediaDeviceFailure
    {
        [EnumMember(Value = "PermissionDenied")]
        PermissionDenied,
        [EnumMember(Value = "NotFound")]
        NotFound,
        [EnumMember(Value = "DeviceInUse")]
        DeviceInUse,
        [EnumMember(Value = "Other")]
        Other
    }

    public class Errors
    {
        public static MediaDeviceFailure? GetFailure(JSError error)
        {
            JSNative.PushString("MediaDeviceFailure");
            var ptr = JSNative.GetProperty(JSNative.Window);

            JSNative.PushObject(error.NativeHandle);
            var rPtr = JSNative.CallMethod(ptr, "getFailure");
            if (!JSNative.IsString(rPtr))
                return null;
            
            return Utils.ToEnum<MediaDeviceFailure>(JSNative.GetString(rPtr));
        }
    }
}