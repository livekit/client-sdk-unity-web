using UnityEngine;
using System;

namespace LiveKit{


    public class JSRef
    {


        public JSRef()
        {
            var lol = JSNative.InstanceGetDataPtr(new IntPtr(0), "data");
            Debug.Log(lol);

        }
    



    }
}