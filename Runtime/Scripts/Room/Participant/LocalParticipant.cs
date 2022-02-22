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