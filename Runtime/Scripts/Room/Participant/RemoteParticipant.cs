using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class RemoteParticipant : Participant
    {

        [Preserve]
        public RemoteParticipant(IntPtr ptr) : base(ptr)
        {

        }

    }


}