using System;
using System.Collections.Generic;
using UnityEngine;

namespace LiveKit{

    public class JSRef
    {
        internal static readonly IntPtr LiveKit;
        internal static Dictionary<IntPtr, WeakReference<JSRef>> BridgeData = new Dictionary<IntPtr, WeakReference<JSRef>>();
        internal readonly IntPtr NativePtr;

        internal static T FromPtr<T>(IntPtr ptr) where T : JSRef
        {
            if (!BridgeData.ContainsKey(ptr))
            {
                return Activator.CreateInstance(typeof(T), ptr) as T;
            }

            BridgeData[ptr].TryGetTarget(out JSRef fref);
            return fref as T;
        }

        internal static JSRef FromPtr(IntPtr ptr)
        {
            return FromPtr<JSRef>(ptr);
        }

        static JSRef()
        {
            LiveKit = JSNative.GetProperty(IntPtr.Zero, "livekit");
        }

        public JSRef(IntPtr ptr)
        {
            NativePtr = ptr;
            BridgeData.Add(NativePtr, new WeakReference<JSRef>(this));
        }

        ~JSRef()
        {
            JSNative.FreeRef(NativePtr);
            BridgeData.Remove(NativePtr);
        }
    }
}