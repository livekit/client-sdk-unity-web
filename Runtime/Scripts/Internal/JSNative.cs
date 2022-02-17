using System.Runtime.InteropServices;
using System;
using Newtonsoft.Json;

namespace LiveKit
{
    internal static class JSNative
    {
        public static JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
        {
            Formatting = Formatting.None,
            NullValueHandling = NullValueHandling.Ignore,
        };


        [DllImport("__Internal")]
        internal static extern IntPtr NewRef();

        [DllImport("__Internal")]
        internal static extern void FreeRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetProperty(IntPtr ptr, string obj);

        [DllImport("__Internal")]
        internal static extern void PushNull();

        [DllImport("__Internal")]
        internal static extern void PushNumber(double nb);

        [DllImport("__Internal")]
        internal static extern void PushBoolean(bool b);

        [DllImport("__Internal")]
        internal static extern void PushString(string str);

        [DllImport("__Internal")]
        internal static extern void PushStruct(string json);

        [DllImport("__Internal")]
        internal static extern void PushFunction(IntPtr ptr, Action<IntPtr> action);

        [DllImport("__Internal")]
        internal static extern IntPtr CallFunction(string fnc);

        [DllImport("__Internal")]
        internal static extern IntPtr CallMethod(IntPtr ptr, string fnc);

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