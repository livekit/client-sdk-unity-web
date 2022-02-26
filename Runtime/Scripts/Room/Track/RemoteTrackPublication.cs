using Newtonsoft.Json;
using System;
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
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return Utils.ToEnum<SubscriptionStatus>(JSNative.GetString(ptr.NativePtr));
            }
        }

        public VideoQuality? VideoQuality
        {
            get
            {
                JSNative.PushString("videoQuality");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                if (JSNative.IsUndefined(ptr.NativePtr))
                    return null;

                return (VideoQuality)JSNative.GetNumber(ptr.NativePtr);
            }
        }


        [Preserve]
        public RemoteTrackPublication(IntPtr ptr) : base(ptr)
        {

        }

        public void SetSubscribed(bool subscribed)
        {
            JSNative.PushBoolean(subscribed);
            Acquire(JSNative.CallMethod(NativePtr, "setSubscribed"));
        }

        public void SetEnabled(bool enabled)
        {
            JSNative.PushBoolean(enabled);
            Acquire(JSNative.CallMethod(NativePtr, "setEnabled"));
        }

        public void SetVideoQuality(VideoQuality quality)
        {
            JSNative.PushNumber((double)quality);
            Acquire(JSNative.CallMethod(NativePtr, "setVideoQuality"));
        }

        public void SetVideoDimensions(TrackDimensions dimensions)
        {
            JSNative.PushStruct(JsonConvert.SerializeObject(dimensions, JSNative.JsonSettings));
            Acquire(JSNative.CallMethod(NativePtr, "setVideoDimensions"));
        }

        public void SetTrack(Track track = null)
        {
            if (track != null)
                JSNative.PushObject(track.NativePtr);

            Acquire(JSNative.CallMethod(NativePtr, "setTrack"));
        }

    }
}