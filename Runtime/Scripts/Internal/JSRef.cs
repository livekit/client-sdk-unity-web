using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSRef
    {
        private static readonly Dictionary<string, Type> s_TypeMap = new Dictionary<string, Type>()
        {
            {"Error", typeof(JSError)},
            {"Uint8Array", typeof(JSUint8Array)},
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

        internal static readonly Dictionary<IntPtr, WeakReference<JSRef>> Cache = new Dictionary<IntPtr, WeakReference<JSRef>>();
        internal static readonly HashSet<object> AliveCache = new HashSet<object>(); // Used to hold a reference and release it manually

        internal readonly JSHandle NativeHandle; // Own the handle

        internal static T Acquire<T>(JSHandle handle) where T : JSRef
        {
            if (handle.IsClosed || handle.IsInvalid)
                throw new Exception("Trying to acquire an invalid handle");
                
            var ptr = handle.DangerousGetHandle();
            if (Cache.TryGetValue(ptr, out var wRef) && wRef.TryGetTarget(out JSRef jsRef))
                return jsRef as T;

            var type = typeof(T);
            if (JSNative.IsObject(handle))
            {
                // Maintain class hierarchy 
                JSNative.PushString("constructor");
                var ctor = JSNative.GetProperty(handle);

                JSNative.PushString("name");
                var typeName = JSNative.GetString(JSNative.GetProperty(ctor));
                
                if (s_TypeMap.TryGetValue(typeName, out Type correctType))
                    type = correctType;
            }

            return Activator.CreateInstance(type, BindingFlags.NonPublic | BindingFlags.Instance, null, new object[]{handle}, null) as T;
        }

        internal static void SetKeepAlive(object reff, bool keepAlive)
        {
            if (reff == null)
                throw new ArgumentNullException(nameof(reff));
            
            Log.Debug($"SetKeepAlive of {reff} to {keepAlive}");
            
            if (keepAlive)
                AliveCache.Add(reff);
            else
                AliveCache.Remove(reff);
        }

        [Preserve]
        internal JSRef(JSHandle handle)
        {
            NativeHandle = handle;

            // We add the instantiated object into the cache se we can retrieve it later if not garbage collected.
            // Note that if JSRef has been garbage collected, it doesn't mean that the key doesn't exists on this map ( Finalizer is unpredictable )
            Cache[handle.DangerousGetHandle()] = new WeakReference<JSRef>(this);
        }

        internal JSRef() : this(JSNative.NewRef())
        {
            
        }

        ~JSRef()
        {
            Dispose(false);
        }

        protected virtual void Dispose(bool disposing)
        {
            var ptr = NativeHandle.DangerousGetHandle();
            Cache.Remove(ptr);

            if (disposing)
            {
                NativeHandle.Dispose();
            }
        }
    }
}