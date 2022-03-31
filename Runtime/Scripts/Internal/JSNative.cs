using System.Runtime.InteropServices;
using System;
using System.Runtime.ConstrainedExecution;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;
using System.Security;
using Newtonsoft.Json.Utilities;
using UnityEngine;

namespace LiveKit
{
    
    [SuppressUnmanagedCodeSecurity]
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
#if !UNITY_EDITOR && UNITY_WEBGL

#if LK_DEBUG
            InitLiveKit(true);
#else
            InitLiveKit(false);
#endif

            PushString("livekit");
            LiveKit = JSRef.Acquire(GetProperty(JSHandle.Zero));

            PushString("lkbridge");
            LKBridge = JSRef.Acquire(GetProperty(JSHandle.Zero));

            JSBridge.SendReady();
#endif
        }

        // JSHandle can't be marshalled in a delegate
        // JSHandle must be created with ptr when the callback is called
        public delegate void JSDelegate(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void InitLiveKit(bool debug);

        [DllImport("__Internal")]
        internal static extern JSHandle NewRef();
        
        [DllImport("__Internal"), ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
        internal static extern void AddRef(JSHandle ptr);
        
        [DllImport("__Internal")]
        internal static extern bool RemRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern JSHandle GetProperty(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern void SetProperty(JSHandle ptr);

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
        internal static extern void PushObject(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern void PushFunction(JSHandle ptr, JSDelegate action);

        [DllImport("__Internal")]
        internal static extern JSHandle CallMethod(JSHandle ptr, string fnc);

        [DllImport("__Internal")]
        internal static extern void NewInstance(JSHandle ptr, JSHandle toPtr, string clazz);

        [DllImport("__Internal")]
        internal static extern JSHandle ShiftStack();
        
        [DllImport("__Internal")]
        internal static extern JSHandle GetFunctionInstance();

        [DllImport("__Internal")]
        internal static extern bool IsString(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern bool IsNull(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern bool IsUndefined(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern bool IsObject(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern bool IsNumber(JSHandle ptr);
        
        [DllImport("__Internal")]
        internal static extern bool IsBoolean(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern string GetString(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern double GetNumber(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern bool GetBoolean(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern IntPtr GetDataPtr(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern int NewTexture();

        [DllImport("__Internal")]
        internal static extern void DestroyTexture(int id);

        [DllImport("__Internal")]
        internal static extern JSHandle AttachVideo(int texId, JSHandle videoPtr);

        internal static unsafe byte[] GetData(IntPtr ptr)
        {
            var length = *(int*) ptr;
            var data = new byte[length];
            Marshal.Copy(ptr + 4, data, 0, length); // TODO Maybe not copy ?
            return data;
        }

        internal static T GetStruct<T>(JSHandle ptr)
        {
            PushString("JSON");
            var json = JSRef.Acquire(GetProperty(JSHandle.Zero));

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
            else if (obj is bool b)
                PushBoolean(b);
            else if (obj == null)
                PushNull();
            else if (Utils.IsNumber(obj.GetType()))
                PushNumber((double) obj);
            else
                throw new ArgumentException("Unsupported type");
        }

        internal static object GetPrimitive(JSHandle ptr)
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