﻿using System;
using Microsoft.Win32.SafeHandles;

namespace LiveKit
{
    public class JSHandle : SafeHandleZeroOrMinusOneIsInvalid
    {
        private JSHandle() : base(true)
        {

        }

        internal JSHandle(IntPtr ptr, bool ownsHandle) : base(ownsHandle)
        {
            SetHandle(ptr);
        }

        protected override bool ReleaseHandle()
        {
            return JSNative.RemRef(handle);
        }
    }
}