using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class LocalParticipant : Participant
    {
        [Preserve]
        public LocalParticipant(IntPtr ptr) : base(ptr)
        {

        }

        public JSPromise PublishData(byte[] data, DataPacketKind kind)
        {
            JSNative.PushData(data, data.Length);
            JSNative.PushNumber((double) kind);
            /*if (participants == null)
            {
                JSNative.PushNull();
            }
            else
            {
                
            }*/

            return new JSPromise(JSNative.CallMethod(NativePtr, "publishData")); //Acquire<JSPromise>(JSNative.CallMethod(NativePtr, "publishData"));
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