using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
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