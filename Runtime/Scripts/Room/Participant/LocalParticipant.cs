using Newtonsoft.Json;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class LocalParticipant : Participant
    {
        [Preserve]
        internal LocalParticipant(JSHandle handle) : base(handle)
        {
        }

        public JSError LastCameraError()
        {
            var ptr = JSNative.CallMethod(NativeHandle, "lastCameraError");
            if (JSNative.IsObject(ptr))
                return null;

            return Acquire<JSError>(ptr);
        }

        public JSError LastMicrophoneError()
        {
            var ptr = JSNative.CallMethod(NativeHandle, "lastMicrophoneError");
            if (JSNative.IsObject(ptr))
                return null;

            return Acquire<JSError>(ptr);
        }

        public new LocalTrackPublication GetTrack(TrackSource source)
        {
            return base.GetTrack(source) as LocalTrackPublication;
        }

        public new LocalTrackPublication GetTrackByName(string name)
        {
            return base.GetTrackByName(name) as LocalTrackPublication;
        }

        public JSPromise<LocalTrackPublication> SetCameraEnabled(bool enabled, VideoCaptureOptions? options = null,
            TrackPublishOptions? publishOptions = null)
        {
            JSNative.PushBoolean(enabled);
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));
            else
                JSNative.PushUndefined();
           
            if (publishOptions != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(publishOptions, JSNative.JsonSettings));

            return Acquire<JSPromise<LocalTrackPublication>>(JSNative.CallMethod(NativeHandle, "setCameraEnabled"));
        }

        public JSPromise<LocalTrackPublication> SetMicrophoneEnabled(bool enabled, AudioCaptureOptions? options = null,
            TrackPublishOptions? publishOptions = null)
        {
            JSNative.PushBoolean(enabled);
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));
            else
                JSNative.PushUndefined();
           
            if (publishOptions != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(publishOptions, JSNative.JsonSettings));

            return Acquire<JSPromise<LocalTrackPublication>>(JSNative.CallMethod(NativeHandle, "setMicrophoneEnabled"));
        }

        public JSPromise<LocalTrackPublication> SetScreenShareEnabled(bool enabled,
            ScreenShareCaptureOptions? options = null, TrackPublishOptions? publishOptions = null)
        {
            JSNative.PushBoolean(enabled);
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));
            else
                JSNative.PushUndefined();
           
            if (publishOptions != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(publishOptions, JSNative.JsonSettings));

            return Acquire<JSPromise<LocalTrackPublication>>(JSNative.CallMethod(NativeHandle,
                "setScreenShareEnabled"));
        }

        public JSPromise EnableCameraAndMicrophone()
        {
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "enableCameraAndMicrophone"));
        }

        public JSPromise<JSArray<LocalTrack>> CreateTracks(CreateLocalTracksOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(NativeHandle, "createTracks"));
        }

        public JSPromise<JSArray<LocalTrack>> CreateScreenTracks(ScreenShareCaptureOptions? options = null)
        {
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<JSPromise<JSArray<LocalTrack>>>(JSNative.CallMethod(NativeHandle, "createScreenTracks"));
        }

        public JSPromise<LocalTrackPublication> PublishTrack(LocalTrack track, TrackPublishOptions? options = null)
        {
            JSNative.PushObject(track.NativeHandle);
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));


            return Acquire<JSPromise<LocalTrackPublication>>(JSNative.CallMethod(NativeHandle, "publishTrack"));
        }

        public JSPromise<LocalTrackPublication> PublishTrack(MediaStreamTrack track,
            TrackPublishOptions? options = null)
        {
            JSNative.PushObject(track.NativeHandle);
            if (options != null)
                JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            return Acquire<JSPromise<LocalTrackPublication>>(JSNative.CallMethod(NativeHandle, "publishTrack"));
        }

        public LocalTrackPublication UnpublishTrack(LocalTrack track, bool? stopOnUnpublish = null)
        {
            JSNative.PushObject(track.NativeHandle);

            if (stopOnUnpublish != null)
                JSNative.PushBoolean(stopOnUnpublish.Value);

            var ptr = JSNative.CallMethod(NativeHandle, "unpublishTrack");
            if (JSNative.IsObject(ptr))
                return null;

            return Acquire<LocalTrackPublication>(ptr);
        }

        public LocalTrackPublication UnpublishTrack(MediaStreamTrack track, bool? stopOnUnpublish = null)
        {
            JSNative.PushObject(track.NativeHandle);

            if (stopOnUnpublish != null)
                JSNative.PushBoolean(stopOnUnpublish.Value);

            var ptr = JSNative.CallMethod(NativeHandle, "unpublishTrack");
            if (JSNative.IsObject(ptr))
                return null;

            return Acquire<LocalTrackPublication>(ptr);
        }

        public JSPromise PublishData(byte[] data, bool reliable, string[] destinationIdentities, string topic)
        {
            return PublishData(data, 0, data.Length, reliable, destinationIdentities, topic);
        }

        public JSPromise PublishData(byte[] data, int offset, int size, bool reliable, string[] destinationIdentities, string topic)
        {
            JSArray<string> arr = null;
            if (destinationIdentities != null)
                arr = new JSArray<string>(destinationIdentities);

            JSNative.PushData(data, offset, size);
            JSNative.PushBoolean((bool)reliable);

            if (destinationIdentities == null)
                JSNative.PushUndefined();
            else
                JSNative.PushObject(arr.NativeHandle);

            if(topic == null)
                JSNative.PushUndefined();
            else
                JSNative.PushString(topic);

            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "publishData"));
        }

        public void SetTrackSubscriptionPermissions(bool allParticipantsAllowed,
            ParticipantTrackPermission[] participantTrackPermissions)
        {
            JSNative.PushBoolean(allParticipantsAllowed);
            JSNative.PushObject(new JSArray<ParticipantTrackPermission>(participantTrackPermissions).NativeHandle);

            JSNative.CallMethod(NativeHandle, "setTrackSubscriptionPermissions");
        }
    }
}