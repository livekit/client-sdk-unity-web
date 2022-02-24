
using Newtonsoft.Json;

namespace LiveKit
{
    public class Client
    {

        public static JSPromise<JSArray<LocalTrack>> CreateLocalTracks(CreateLocalTracksOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return JSRef.Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(JSRef.LiveKit.NativePtr, "createLocalTracks"));
        }
    }
}