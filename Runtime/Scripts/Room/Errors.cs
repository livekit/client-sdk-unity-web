using System;
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
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return (int) JSNative.GetNumber(ptr.NativePtr);
            }
        }

        [Preserve]
        public LivekitError(IntPtr ptr) : base(ptr)
        {

        }
    }

    public class ConnectionError : LivekitError
    {
        [Preserve]
        public ConnectionError(IntPtr ptr) : base(ptr)
        {

        }
    }

    public class TrackInvalidError : LivekitError
    {
        [Preserve]
        public TrackInvalidError(IntPtr ptr) : base(ptr)
        {

        }
    }
    public class UnsupportedServer : LivekitError
    {
        [Preserve]
        public UnsupportedServer(IntPtr ptr) : base(ptr)
        {

        }
    }

    public class UnexpectedConnectionState : LivekitError
    {
        [Preserve]
        public UnexpectedConnectionState(IntPtr ptr) : base(ptr)
        {

        }
    }

    public class PublishDataError : LivekitError
    {
        [Preserve]
        public PublishDataError(IntPtr ptr) : base(ptr)
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
            var ptr = JSRef.Acquire(JSNative.GetProperty(IntPtr.Zero));

            JSNative.PushObject(error.NativePtr);
            var rPtr = JSRef.Acquire(JSNative.CallMethod(ptr.NativePtr, "getFailure"));
            if (JSNative.IsUndefined(rPtr.NativePtr))
                return null;

            return Utils.ToEnum<MediaDeviceFailure>(JSNative.GetString(rPtr.NativePtr));
        }
    }
}