using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrack : Track
    {
        [Preserve]
        internal LocalTrack(JSHandle handle) : base(handle)
        {

        }

        public string GetId()
        {
            return JSNative.GetString(JSNative.CallMethod(NativeHandle, "id"));
        }

        public TrackDimensions? GetDimensions()
        {
            var ptr = JSNative.CallMethod(NativeHandle, "dimensions");
            if (!JSNative.IsObject(ptr))
                return null;

            return JSNative.GetStruct<TrackDimensions>(ptr);
        }
    
        public DeviceIdPromise GetDeviceId()
        {
            return Acquire<DeviceIdPromise>(JSNative.CallMethod(NativeHandle, "getDeviceId"));
        }

        public JSPromise<LocalTrack> Mute()
        {
            return Acquire<JSPromise<LocalTrack>>(JSNative.CallMethod(NativeHandle, "mute"));
        }

        public JSPromise<LocalTrack> Unmute()
        {
            return Acquire<JSPromise<LocalTrack>>(JSNative.CallMethod(NativeHandle, "unmute"));
        }
    }

    public class DeviceIdPromise : JSPromise
    {
        public string DeviceId { get; private set; }

        [Preserve]
        internal DeviceIdPromise(JSHandle handle) : base(handle)
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