using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteVideoTrack : RemoteTrack
    {
        public bool IsAdaptiveStream
        {
            get
            {
                JSNative.PushString("isAdaptiveStream");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return JSNative.GetBoolean(ptr.NativePtr);
            }
        }

        [Preserve]
        public RemoteVideoTrack(IntPtr ptr) : base(ptr)
        {

        }
    }
}