using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrack : Track
    {
        [Preserve]
        public LocalTrack(JSHandle ptr) : base(ptr)
        {

        }

        public string GetId()
        {
            return JSNative.GetString(JSNative.CallMethod(NativePtr, "id"));
        }

        public TrackDimensions? GetDimensions()
        {
            var ptr = JSNative.CallMethod(NativePtr, "dimensions");
            if (!JSNative.IsObject(ptr))
                return null;

            return JSNative.GetStruct<TrackDimensions>(ptr);
        }
    
        public GetDeviceIdOperation GetDeviceId()
        {
            var ptr = Acquire<JSPromise<JSRef>>(JSNative.CallMethod(NativePtr, "getDeviceId"));
            return new GetDeviceIdOperation(ptr);
        }

        public JSPromise<LocalTrack> Mute()
        {
            return Acquire<JSPromise<LocalTrack>>(JSNative.CallMethod(NativePtr, "mute"));
        }

        public JSPromise<LocalTrack> Unmute()
        {
            return Acquire<JSPromise<LocalTrack>>(JSNative.CallMethod(NativePtr, "unmute"));
        }
    }

    public class GetDeviceIdOperation : PromiseWrapper<JSRef>
    {
        public string DeviceId { get; private set; }

        public GetDeviceIdOperation(JSPromise<JSRef> promise) : base(promise)
        {

        }

        public override void OnDone()
        {
            if (m_Promise.IsError) 
                return;
            
            var ptr = m_Promise.ResolveValue.NativePtr;
            if (!JSNative.IsUndefined(ptr))
                DeviceId = JSNative.GetString(ptr);
        }
    }
}