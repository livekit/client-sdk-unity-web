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
        public LivekitError(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class ConnectionError : LivekitError
    {
        [Preserve]
        public ConnectionError(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class TrackInvalidError : LivekitError
    {
        [Preserve]
        public TrackInvalidError(JSHandle ptr) : base(ptr)
        {

        }
    }
    public class UnsupportedServer : LivekitError
    {
        [Preserve]
        public UnsupportedServer(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class UnexpectedConnectionState : LivekitError
    {
        [Preserve]
        public UnexpectedConnectionState(JSHandle ptr) : base(ptr)
        {

        }
    }

    public class PublishDataError : LivekitError
    {
        [Preserve]
        public PublishDataError(JSHandle ptr) : base(ptr)
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