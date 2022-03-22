using System;
using Microsoft.Win32.SafeHandles;

namespace LiveKit
{
    public class JSHandle : SafeHandleZeroOrMinusOneIsInvalid
    {
        public JSHandle(IntPtr handle) : base(true)
        {
            SetHandle(handle);
        }

        protected override bool ReleaseHandle()
        {
            JSNative.RemoveRefCounter(handle);
            return true;            
        }
    }
}