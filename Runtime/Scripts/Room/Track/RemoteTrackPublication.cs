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
                return Utils.ToEnum<SubscriptionStatus>(JSNative.GetString(JSNative.GetProperty(NativePtr)));
            }
        }

        public VideoQuality? VideoQuality
        {
            get
            {
                JSNative.PushString("videoQuality");
                var ptr = JSNative.GetProperty(NativePtr);
                if (!JSNative.IsNumber(ptr))
                    return null;

                return (VideoQuality?) JSNative.GetNumber(ptr);
            }
        }


        [Preserve]
        internal RemoteTrackPublication(JSHandle ptr) : base(ptr)
        {

        }

        public void SetSubscribed(bool subscribed)
        {
            JSNative.PushBoolean(subscribed);
            JSNative.CallMethod(NativePtr, "setSubscribed");
        }

        public void SetEnabled(bool enabled)
        {
            JSNative.PushBoolean(enabled);
            JSNative.CallMethod(NativePtr, "setEnabled");
        }

        public void SetVideoQuality(VideoQuality quality)
        {
            JSNative.PushNumber((double)quality);
            JSNative.CallMethod(NativePtr, "setVideoQuality");
        }

        public void SetVideoDimensions(TrackDimensions dimensions)
        {
            JSNative.PushStruct(JsonConvert.SerializeObject(dimensions, JSNative.JsonSettings));
            JSNative.CallMethod(NativePtr, "setVideoDimensions");
        }

        public void SetTrack(Track track = null)
        {
            if (track != null)
                JSNative.PushObject(track.NativePtr);

            JSNative.CallMethod(NativePtr, "setTrack");
        }
    }
}