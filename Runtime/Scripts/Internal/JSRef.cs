using System;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit{

    public class JSRef
    {
        internal static readonly JSRef LiveKit;
        internal static Dictionary<IntPtr, WeakReference<JSRef>> BridgeData = new Dictionary<IntPtr, WeakReference<JSRef>>();
        internal IntPtr NativePtr { get; private set; }

        static JSRef()
        {
            LiveKit = Acquire(JSNative.GetProperty(IntPtr.Zero, "livekit"));
        }

        internal static T Acquire<T>(IntPtr ptr) where T : JSRef
        {
            if (!BridgeData.ContainsKey(ptr))
                return Activator.CreateInstance(typeof(T), ptr) as T;

            BridgeData[ptr].TryGetTarget(out JSRef fref);
            return fref as T;
        }

        internal static JSRef Acquire(IntPtr ptr)
        {
            return Acquire<JSRef>(ptr);
        }

        public static T CopyRef<T>(JSRef pref) where T : JSRef
        {
            return Acquire<T>(JSNative.CopyRef(pref.NativePtr));
        }

        [Preserve]
        public JSRef(IntPtr ptr)
        {
            NativePtr = ptr;
            BridgeData.Add(NativePtr, new WeakReference<JSRef>(this));
        }

        ~JSRef()
        {
            Free();
        }

        internal void Free()
        {
            if (NativePtr == IntPtr.Zero)
                return;

            JSNative.FreeRef(Release());
        }

        internal IntPtr Release()
        {
            var ptr = NativePtr;
            BridgeData.Remove(ptr);
            NativePtr = IntPtr.Zero;
            return ptr;
        }
    }
}