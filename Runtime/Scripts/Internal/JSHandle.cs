using System;
using Microsoft.Win32.SafeHandles;

namespace LiveKit
{
    public class JSHandle : SafeHandleZeroOrMinusOneIsInvalid
    {
        public static JSHandle Zero = new JSHandle();
        
        private JSHandle() : base(true)
        {
            
        }

        internal JSHandle(IntPtr ptr) : base(true)
        {
            SetHandle(ptr);
        }

        protected override bool ReleaseHandle()
        {
            return JSNative.RemRef(handle);
        }
    }
}