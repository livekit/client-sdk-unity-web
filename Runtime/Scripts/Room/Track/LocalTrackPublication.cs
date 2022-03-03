using System;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalTrackPublication : TrackPublication
    {
        public new LocalTrack Track => base.Track as LocalTrack;
        public new LocalAudioTrack AudioTrack => base.AudioTrack as LocalAudioTrack;
        public new LocalVideoTrack VideoTrack => base.VideoTrack as LocalVideoTrack;

        public TrackPublishOptions? Options
        {
            get
            {
                JSNative.PushString("dimensions");
                var ptr = AcquireOrNull(JSNative.GetProperty(NativePtr));
                if (ptr == null)
                    return null;

                return JSNative.GetStruct<TrackPublishOptions>(ptr.NativePtr);
            }
        }


        [Preserve]
        public LocalTrackPublication(IntPtr ptr) : base(ptr)
        {

        }
    }
}