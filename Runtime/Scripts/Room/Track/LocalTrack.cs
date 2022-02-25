using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrack : Track
    {
        [Preserve]
        public LocalTrack(IntPtr ptr) : base(ptr)
        {

        }

        public string GetId()
        {
            var ptr = Acquire(JSNative.CallMethod(NativePtr, "id"));
            return JSNative.GetString(ptr.NativePtr);
        }

        public TrackDimensions? GetDimensions()
        {
            var ptr = Acquire(JSNative.CallMethod(NativePtr, "dimensions"));
            if (JSNative.IsUndefined(ptr.NativePtr))
                return null;

            return JSNative.GetStruct<TrackDimensions>(ptr.NativePtr);
        }
    
        public GetDeviceIdOperation GetDeviceId()
        {
            var ptr = Acquire(JSNative.CallMethod(NativePtr, "getDeviceId"));
            return new GetDeviceIdOperation(Acquire<JSPromise<JSRef>>(ptr.NativePtr));
        }

        public void Mute()
        {
            Acquire(JSNative.CallMethod(NativePtr, "mute"));
        }

        public void Unmute()
        {
            Acquire(JSNative.CallMethod(NativePtr, "unmute"));
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
            if (!m_Promise.IsError)
            {
                var ptr = m_Promise.ResolveValue.NativePtr;
                if (!JSNative.IsUndefined(ptr))
                    DeviceId = JSNative.GetString(ptr);
            }
        }
    }
}