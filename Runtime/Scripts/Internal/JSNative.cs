using System.Runtime.InteropServices;
using System;
using System.Runtime.CompilerServices;
using System.Runtime.ConstrainedExecution;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;
using System.Security;
using Newtonsoft.Json.Utilities;
using UnityEngine;

[assembly: InternalsVisibleTo("LiveKit.BridgeTests")] 
namespace LiveKit
{
    [SuppressUnmanagedCodeSecurity]
    internal static class JSNative
    {
        // JSHandle can't be marshalled in a delegate
        // JSHandle must be created with ptr when the callback is called
        public delegate void JSDelegate(IntPtr ptr);

        internal static JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
        {
            Formatting = Formatting.None,
            NullValueHandling = NullValueHandling.Ignore,
        };

        internal static JSHandle LiveKit { get; private set; }
        internal static JSHandle BridgeInterface { get; private set; } // TypeScript interface
        internal static JSHandle Window { get; private set; }
        internal static JSHandle BridgeData { get; private set; }

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

            Window = RetrieveWindowObject();
            BridgeData = RetrieveBridgeObject();

            PushString("livekit");
            LiveKit = GetProperty(Window);

            PushString("lkbridge");
            BridgeInterface = GetProperty(Window);

#if LK_DEBUG
            Client.SetLogLevel(LogLevel.Debug);
#endif

            JSBridge.SendReady();
#endif
        }

        [DllImport("__Internal")]
        internal static extern void InitLiveKit(bool debug);

        [DllImport("__Internal")]
        internal static extern JSHandle NewRef();

        [DllImport("__Internal")]
        internal static extern void AddRef(JSHandle ptr);

        [DllImport("__Internal"), ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
        internal static extern bool RemRef(IntPtr ptr);

        [DllImport("__Internal")]
        internal static extern void SetRef(JSHandle ptr);

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
        internal static extern void PushData(byte[] data, int offset, int size);

        [DllImport("__Internal")]
        internal static extern void PushObject(JSHandle ptr);

        [DllImport("__Internal")]
        internal static extern void PushFunction(JSHandle ptr, JSDelegate action, string debugLabel);

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
        internal static extern bool CopyData(JSHandle ptr, [Out] byte[] data, int offset, int count);

        [DllImport("__Internal")]
        internal static extern JSHandle RetrieveBridgeObject();

        [DllImport("__Internal")]
        internal static extern JSHandle RetrieveWindowObject();

        [DllImport("__Internal")]
        internal static extern int NewTexture();

        [DllImport("__Internal")]
        internal static extern void DestroyTexture(int id);
        
        [DllImport("__Internal")]
        internal static extern void AttachVideo(JSHandle video, int texId);

        internal static T GetStruct<T>(JSHandle ptr)
        {
            PushString("JSON");
            var json = GetProperty(Window);

            PushObject(ptr);
            var strifyPtr = CallMethod(json, "stringify");
            
            if(!IsString(strifyPtr))
                throw new Exception($"Failed to bridge {typeof(T)}");

            return JsonConvert.DeserializeObject<T>(GetString(strifyPtr));
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
            if (IsNumber(ptr))
                return GetNumber(ptr);
            if (IsBoolean(ptr))
                return GetBoolean(ptr);
            if (IsNull(ptr) || IsUndefined(ptr))
                return null;

            throw new ArgumentException("Unsupported type");
        }

        internal static bool IsPrimitive(Type type)
        {
            var tc = Type.GetTypeCode(type);
            return tc == TypeCode.String || tc == TypeCode.Boolean || Utils.IsNumber(type);
        }
    }


}