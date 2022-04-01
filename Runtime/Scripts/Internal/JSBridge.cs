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
        private static JSHandle JSUnityBridge;

        static JSBridge()
        {
#if !UNITY_EDITOR && UNITY_WEBGL
            JSNative.PushString("UnityBridge");
            var ptr = JSNative.GetProperty(JSNative.LKBridge);

            JSNative.PushString("instance");
            JSUnityBridge = JSNative.GetProperty(ptr);
#endif
        }

        internal static void SendReady()
        {
            JSNative.PushString(Utils.ToEnumString(JSUnityEvent.BridgeReady));
            JSNative.CallMethod(JSUnityBridge, "emit");
        }

        public static void SendRoomCreated(Room room)
        {
            JSNative.PushString(Utils.ToEnumString(JSUnityEvent.RoomCreated));
            JSNative.PushObject(room.NativePtr);
            JSNative.CallMethod(JSUnityBridge, "emit");
        }
    }
}
