using System.Runtime.InteropServices;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Utilities;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;
using UnityEngine;

namespace LiveKit
{
    internal static class JSNative
    {
        internal static JSRef LiveKit { get; private set; }
        internal static JSRef LKBridge { get; private set; }

        internal static JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
        {
            Formatting = Formatting.None,
            NullValueHandling = NullValueHandling.Ignore,
        };

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterAssembliesLoaded)]
        private static void InitJSNative()
        {
            AotHelper.EnsureType<StringEnumConverter>();
            Init();

            PushString("livekit");
            LiveKit = JSRef.Acquire(GetProperty(IntPtr.Zero));

            PushString("lkbridge");
            LKBridge = JSRef.Acquire(GetProperty(IntPtr.Zero));

            JSBridge.SendReady();
        }

        [DllImport("__Internal")]
        internal static extern void Init();

        [DllImport("__Internal")]
        internal static extern IntPtr NewRef();

        [DllImport("__Internal")]
        internal static extern void FreeRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void SetRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetProperty(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void SetProperty(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void PushNull();

        [DllImport("__Internal")]
        internal static extern void PushUndefined();

        [DllImport("__Internal")]
        internal static extern void PushNumber(double nb);

        [DllImport("__Internal")]
        internal static extern void PushBoolean(bool b);

        [DllImport("__Internal")]
        internal static extern void PushString(string str);

        [DllImport("__Internal")]
        internal static extern void PushStruct(string json);

        [DllImport("__Internal")]
        internal static extern void PushData(byte[] data, int size);

        [DllImport("__Internal")]
        internal static extern void PushObject(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void PushFunction(IntPtr ptr, Action<IntPtr> action);

        [DllImport("__Internal")]
        internal static extern IntPtr CallFunction(string fnc);

        [DllImport("__Internal")]
        internal static extern IntPtr CallMethod(IntPtr ptr, string fnc);

        [DllImport("__Internal")]
        internal static extern void NewInstance(IntPtr ptr, IntPtr toPtr, string clazz);

        [DllImport("__Internal")]
        internal static extern IntPtr ShiftStack();

        [DllImport("__Internal")]
        internal static extern bool IsString(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool IsNull(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool IsUndefined(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool IsObject(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool IsArray(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool IsNumber(IntPtr ptr);
        
        [DllImport("__Internal")]
        internal static extern bool IsBoolean(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern string GetString(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern double GetNumber(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern bool GetBoolean(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetDataPtr(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern int NewTexture();

        [DllImport("__Internal")]
        internal static extern void DestroyTexture(int id);

        [DllImport("__Internal")]
        internal static extern IntPtr AttachVideo(int texId, IntPtr videoPtr);

        internal static unsafe byte[] GetData(IntPtr ptr)
        {
            var length = *(int*) ptr;
            var data = new byte[length];
            Marshal.Copy(ptr + 4, data, 0, length); // TODO Maybe not copy ?
            return data;
        }

        internal static T GetStruct<T>(IntPtr ptr)
        {
            PushString("JSON");
            var json = JSRef.Acquire(GetProperty(IntPtr.Zero));

            PushObject(ptr);
            var r = JSRef.AcquireOrNull<JSString>(CallMethod(json.NativePtr, "stringify"));
            if (r == null)
                return default(T);

            return JsonConvert.DeserializeObject<T>(r.ToString());
        }

        internal static void PushPrimitive(object obj)
        {
            if (obj is string str)
                PushString(str);
            else if (Utils.IsNumber(obj.GetType()))
                PushNumber((double)obj);
            else if (obj is bool b)
                PushBoolean(b);
            else if (obj == null)
                PushNull();
            else
                throw new ArgumentException("Unsupported type");
        }

        internal static object GetPrimitive(IntPtr ptr)
        {
            if (IsString(ptr))
                return GetString(ptr);
            else if (IsNumber(ptr))
                return GetNumber(ptr);
            else if (IsBoolean(ptr))
                return GetBoolean(ptr);
            else if (IsNull(ptr) || IsUndefined(ptr))
                return null;

            throw new ArgumentException("Unsupported type");
        }

        internal static bool IsPrimitive(Type type)
        {
            var tc = Type.GetTypeCode(type);
            return tc == TypeCode.String || tc == TypeCode.Boolean || Utils.IsNumber(type);
        }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum MediaDeviceKind
    {
        [EnumMember(Value = "audioinput")]
        AudioInput,
        [EnumMember(Value = "audiooutput")]
        AudioOutput,
        [EnumMember(Value = "videoinput")]
        VideoInput
    }
}