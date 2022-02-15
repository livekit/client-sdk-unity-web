using System.Runtime.InteropServices;
using System;
using AOT;

namespace LiveKit
{
    internal static class JSNative
    {
        [DllImport("__Internal")]
        internal static extern string InstanceGetString(IntPtr ptr, string property);

        [DllImport("__Internal")]
        internal static extern double InstanceGetNumber(IntPtr ptr, string property);

        [DllImport("__Internal")]
        internal static extern bool InstanceGetBool(IntPtr ptr, string property);

        [DllImport("__Internal")]
        internal static extern IntPtr InstanceGetDataPtr(IntPtr ptr, string property);

        [DllImport("__Internal")]
        internal static extern void InstanceSetter(IntPtr ptr, string property, string type, object value);






    
    }

}