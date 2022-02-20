using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class JSError : JSRef
    {

        [Preserve]
        public JSError(IntPtr ptr) : base(ptr)
        {

        }


    }
}