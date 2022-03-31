using System;
using System.Collections.Generic;
using System.Runtime.ConstrainedExecution;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSRef : CriticalFinalizerObject
    {
        // Used to maintain class hierarchy
        private static readonly Dictionary<string, Type> s_TypeMap = new Dictionary<string, Type>()
        {
            {"Number", typeof(JSNumber)},
            {"String", typeof(JSString)},
            {"Boolean", typeof(JSBoolean)},
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

        private static readonly Dictionary<IntPtr, WeakReference<JSRef>> BridgeData = new Dictionary<IntPtr, WeakReference<JSRef>>();

        internal JSHandle NativePtr { get; }

        internal static T Acquire<T>(JSHandle handle) where T : JSRef
        {
            if (handle.IsClosed)
                throw new Exception("Trying to acquire an invalid handle");

            var ptr = handle.DangerousGetHandle();
            if (BridgeData.TryGetValue(ptr, out var wRef) && wRef.TryGetTarget(out JSRef jsRef))
                return jsRef as T;

            var type = typeof(T);
            if (JSNative.IsObject(handle))
            {
                // Maintain class hierarchy 
                JSNative.PushString("constructor");
                var ctor = Acquire(JSNative.GetProperty(handle));

                JSNative.PushString("name");
                var typeName = Acquire<JSString>(JSNative.GetProperty(ctor.NativePtr));

                if (s_TypeMap.TryGetValue(typeName.ToString(), out Type correctType))
                    type = correctType;
            }

            var i = Activator.CreateInstance(type, handle) as T;
            return i;
        }

        internal static JSRef Acquire(JSHandle ptr)
        {
            return Acquire<JSRef>(ptr);
        }

        internal static T AcquireOrNull<T>(JSHandle ptr) where T : JSRef
        {
            if (JSNative.IsUndefined(ptr) || JSNative.IsNull(ptr))
            {
                Acquire(ptr);
                return null;
            }

            return Acquire<T>(ptr);
        }

        internal static JSRef AcquireOrNull(JSHandle ptr)
        {
            return AcquireOrNull<JSRef>(ptr);
        }

        [Preserve]
        public JSRef(JSHandle ptr)
        {
            NativePtr = ptr;
            BridgeData.Add(ptr.DangerousGetHandle(), new WeakReference<JSRef>(this));
        }
    }
}