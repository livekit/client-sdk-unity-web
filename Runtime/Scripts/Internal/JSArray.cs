using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSArray<T> : JSRef
    {

        [Preserve]
        public JSArray(IntPtr ptr) : base(ptr)
        {

        }
    }
}