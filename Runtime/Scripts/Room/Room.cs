using System;
using Newtonsoft.Json;

namespace LiveKit
{
    public class Room : JSRef
    {
        public Room(RoomOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            JSNative.NewInstance(LiveKit, NativePtr, "Room");
        }

        public JSPromise Connect(string url, string token, ConnectOptions? options = null)
        {
            JSNative.PushString(url);
            JSNative.PushString(token);
            
            if(options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return new JSPromise(JSNative.CallMethod(NativePtr, "connect"));
        }
    }
}