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
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
        }

        [Preserve]
        internal LivekitError(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class ConnectionError : LivekitError
    {
        [Preserve]
        internal ConnectionError(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class TrackInvalidError : LivekitError
    {
        [Preserve]
        internal TrackInvalidError(JSHandle ptr) : base(ptr)
        {

        }
    }
    public class UnsupportedServer : LivekitError
    {
        [Preserve]
        internal UnsupportedServer(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class UnexpectedConnectionState : LivekitError
    {
        [Preserve]
        internal UnexpectedConnectionState(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class PublishDataError : LivekitError
    {
        [Preserve]
        internal PublishDataError(JSHandle ptr) : base(ptr)
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

            JSNative.PushObject(error.NativePtr);
            var rPtr = JSNative.CallMethod(ptr, "getFailure");
            if (!JSNative.IsString(rPtr))
                return null;
            
            return Utils.ToEnum<MediaDeviceFailure>(JSNative.GetString(rPtr));
        }
    }
}