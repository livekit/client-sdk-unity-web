using System;
using System.Collections.Generic;

namespace LiveKit{

    public class JSRef
    {
        public static readonly IntPtr LiveKit;
        internal static Dictionary<IntPtr, WeakReference<JSRef>> BridgeData = new Dictionary<IntPtr, WeakReference<JSRef>>();
        public readonly IntPtr NativePtr;

        static JSRef(){
            LiveKit = JSNative.GetRef(IntPtr.Zero, "livekit");
        }

        public JSRef() : this(JSNative.NewRef())
        {

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