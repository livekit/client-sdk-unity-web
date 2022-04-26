using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrack : Track
    {
        [Preserve]
        internal LocalTrack(JSHandle ptr) : base(ptr)
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
    
        public DeviceIdPromise GetDeviceId()
        {
            return Acquire<DeviceIdPromise>(JSNative.CallMethod(NativePtr, "getDeviceId"));
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

    public class DeviceIdPromise : JSPromise
    {
        public string DeviceId { get; private set; }

        [Preserve]
        internal DeviceIdPromise(JSHandle ptr) : base(ptr)
        {

        }
        
        protected virtual void OnResolve()
        {
            base.OnResolve();
            if (!JSNative.IsUndefined(ResolveHandle))
                DeviceId = JSNative.GetString(ResolveHandle);
        }
    }
}