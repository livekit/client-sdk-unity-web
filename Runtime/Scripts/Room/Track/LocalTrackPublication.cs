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
                var handle = JSNative.GetProperty(NativeHandle);
                if (JSNative.IsUndefined(handle) || JSNative.IsNull(handle))
                    return null;

                return JSNative.GetStruct<TrackPublishOptions>(handle);
            }
        }

        [Preserve]
        internal LocalTrackPublication(JSHandle handle) : base(handle)
        {

        }
    }
}