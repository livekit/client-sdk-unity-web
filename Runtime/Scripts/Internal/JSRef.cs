using System;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSRef
    {
        // Used to maintain class hierarchy
        private static readonly Dictionary<string, Type> s_TypeMap = new Dictionary<string, Type>()
        {
            {"Error", typeof(JSError)},
            {"LivekitError", typeof(LivekitError)},
            {"ConnectionError", typeof(ConnectionError)},
            {"TrackInvalidError", typeof(TrackInvalidError)},
            {"UnsupportedServer", typeof(UnsupportedServer)},
            {"UnexpectedConnectionState", typeof(UnexpectedConnectionState)},
            {"PublishDataError", typeof(PublishDataError)},
            {"Room", typeof(Room)},
            {"Participant", typeof(Participant)},
            {"LocalParticipant", typeof(LocalParticipant)},
            {"RemoteParticipant", typeof(RemoteParticipant)},
            {"Track", typeof(Track)},
            {"RemoteTrack", typeof(RemoteTrack)},
            {"RemoteVideoTrack", typeof(RemoteVideoTrack)},
            {"RemoteAudioTrack", typeof(RemoteAudioTrack)},
            {"LocalTrack", typeof(LocalTrack)},
            {"LocalVideoTrack", typeof(LocalVideoTrack)},
            {"LocalAudioTrack", typeof(LocalAudioTrack)},
            {"TrackPublication", typeof(TrackPublication)},
            {"RemoteTrackPublication", typeof(RemoteTrackPublication)},
            {"LocalTrackPublication", typeof(LocalTrackPublication)},
            {"HTMLVideoElement", typeof(HTMLVideoElement)},
            {"HTMLAudioElement", typeof(HTMLAudioElement)},
        };

        internal static Dictionary<IntPtr, WeakReference<JSRef>> BridgeData = new Dictionary<IntPtr, WeakReference<JSRef>>();
        internal IntPtr NativePtr { get; private set; }

        internal static T Acquire<T>(IntPtr ptr) where T : JSRef
        {
            if (!BridgeData.ContainsKey(ptr))
            {
                var type = typeof(T);
                if (JSNative.IsObject(ptr))
                {
                    // Maintain class hierarchy 
                    JSNative.PushString("constructor");
                    var ctor = Acquire(JSNative.GetProperty(ptr));

                    JSNative.PushString("name");
                    var cName = Acquire(JSNative.GetProperty(ctor.NativePtr));
                    var typeName = JSNative.GetString(cName.NativePtr);

                    if (s_TypeMap.TryGetValue(typeName, out Type correctType))
                        type = correctType;
                }

                return Activator.CreateInstance(type, ptr) as T;
            }

            BridgeData[ptr].TryGetTarget(out JSRef fref);
            return fref as T;
        }

        internal static JSRef Acquire(IntPtr ptr)
        {
            return Acquire<JSRef>(ptr);
        }

        [Preserve]
        public JSRef(IntPtr ptr)
        {
            NativePtr = ptr;
            BridgeData.Add(NativePtr, new WeakReference<JSRef>(this));
        }

        ~JSRef()
        {
            Free();
        }

        internal void Free()
        {
            if (NativePtr == IntPtr.Zero)
                return;

            JSNative.FreeRef(Release());
        }

        internal IntPtr Release()
        {
            var ptr = NativePtr;
            BridgeData.Remove(ptr);
            NativePtr = IntPtr.Zero;
            return ptr;
        }
    }
}