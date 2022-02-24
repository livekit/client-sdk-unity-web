using System;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalParticipant : Participant
    {
        [Preserve]
        public LocalParticipant(IntPtr ptr) : base(ptr)
        {

        }

        public JSPromise<JSRef> PublishData(byte[] data, DataPacketKind kind, RemoteParticipant[] participants = null)
        {
            JSNative.PushData(data, data.Length);
            JSNative.PushNumber((double) kind);
            if (participants == null)
            {
                JSNative.PushUndefined();
            }
            else
            {
                var arr = new JSArray<RemoteParticipant>(participants);
                JSNative.PushObject(arr.NativePtr);
            }

            return Acquire<JSPromise<JSRef>>(JSNative.CallMethod(NativePtr, "publishData"));
        }

        public new LocalTrackPublication GetTrack(TrackSource source)
        {
            return base.GetTrack(source) as LocalTrackPublication;
        }

        public new LocalTrackPublication GetTrackByName(string name)
        {
            return base.GetTrackByName(name) as LocalTrackPublication;
        }
    }
}