using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace LiveKit
{
    [JsonConverter(typeof(StringEnumConverter))]
    internal enum JSUnityEvent
    {
        [EnumMember(Value = "bridgeReady")]
        BridgeReady,
        [EnumMember(Value = "roomCreated")]
        RoomCreated,
    }

    internal class JSBridge
    {
        private static JSRef JSUnityBridge;

        static JSBridge()
        {
#if !UNITY_EDITOR && UNITY_WEBGL
            JSNative.PushString("UnityBridge");
            var ptr = JSRef.Acquire(JSNative.GetProperty(JSNative.LKBridge.NativePtr));

            JSNative.PushString("instance");
            JSUnityBridge = JSRef.Acquire(JSNative.GetProperty(ptr.NativePtr));
#endif
        }

        internal static void SendReady()
        {
            JSNative.PushString(Utils.ToEnumString(JSUnityEvent.BridgeReady));
            JSRef.Acquire(JSNative.CallMethod(JSUnityBridge.NativePtr, "emit"));
        }

        public static void SendRoomCreated(Room room)
        {
            JSNative.PushString(Utils.ToEnumString(JSUnityEvent.RoomCreated));
            JSNative.PushObject(room.NativePtr);
            JSRef.Acquire(JSNative.CallMethod(JSUnityBridge.NativePtr, "emit"));
        }
    }
}
