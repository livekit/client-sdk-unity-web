using System.Runtime.InteropServices;
using System;

namespace LiveKit
{
    internal static class JSNative
    {
        [DllImport("__Internal")]
        internal static extern IntPtr NewRef();

        [DllImport("__Internal")]
        internal static extern void FreeRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetRef(IntPtr ptr, string obj);

        [DllImport("__Internal")]
        internal static extern void PushNull();

        [DllImport("__Internal")]
        internal static extern void PushNumber(double nb);

        [DllImport("__Internal")]
        internal static extern void PushBoolean(bool b);

        [DllImport("__Internal")]
        internal static extern void PushString(string str);

        [DllImport("__Internal")]
        internal static extern void CallFunction(string fnc);

        [DllImport("__Internal")]
        internal static extern void CallMethod(IntPtr ptr, string fnc);

        [DllImport("__Internal")]
        internal static extern void NewInstance(IntPtr ptr, IntPtr toPtr, string clazz);

        [DllImport("__Internal")]
        internal static extern string GetString(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern double GetNumber(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool GetBool(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetData(IntPtr ptr);
    }

}