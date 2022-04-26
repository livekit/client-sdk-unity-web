using Newtonsoft.Json;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class RemoteTrackPublication : TrackPublication
    {
        public new RemoteTrack Track => base.Track as RemoteTrack;

        public SubscriptionStatus SubscriptionStatus
        {
            get
            {
                JSNative.PushString("subscriptionStatus");
                return Utils.ToEnum<SubscriptionStatus>(JSNative.GetString(JSNative.GetProperty(NativeHandle)));
            }
        }

        public VideoQuality? VideoQuality
        {
            get
            {
                JSNative.PushString("videoQuality");
                var ptr = JSNative.GetProperty(NativeHandle);
                if (!JSNative.IsNumber(ptr))
                    return null;

                return (VideoQuality?) JSNative.GetNumber(ptr);
            }
        }


        [Preserve]
        internal RemoteTrackPublication(JSHandle handle) : base(handle)
        {

        }

        public void SetSubscribed(bool subscribed)
        {
            JSNative.PushBoolean(subscribed);
            JSNative.CallMethod(NativeHandle, "setSubscribed");
        }

        public void SetEnabled(bool enabled)
        {
            JSNative.PushBoolean(enabled);
            JSNative.CallMethod(NativeHandle, "setEnabled");
        }

        public void SetVideoQuality(VideoQuality quality)
        {
            JSNative.PushNumber((double)quality);
            JSNative.CallMethod(NativeHandle, "setVideoQuality");
        }

        public void SetVideoDimensions(TrackDimensions dimensions)
        {
            JSNative.PushStruct(JsonConvert.SerializeObject(dimensions, JSNative.JsonSettings));
            JSNative.CallMethod(NativeHandle, "setVideoDimensions");
        }

        public void SetTrack(Track track = null)
        {
            if (track != null)
                JSNative.PushObject(track.NativeHandle);

            JSNative.CallMethod(NativeHandle, "setTrack");
        }
    }
}