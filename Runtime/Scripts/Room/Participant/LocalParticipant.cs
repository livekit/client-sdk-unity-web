using Newtonsoft.Json;
using UnityEngine;
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

        public new LocalTrackPublication GetTrackPublication(TrackSource source)
        {
            return base.GetTrackPublication(source) as LocalTrackPublication;
        }

        public new LocalTrackPublication GetTrackPublicationByName(string name)
        {
            return base.GetTrackPublicationByName(name) as LocalTrackPublication;
        }

        public new LocalTrackPublication GetTrackPublicationBySid(string sid)
        {
            return base.GetTrackPublicationBySid(sid) as LocalTrackPublication;
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
            var options = new PublishDataOptions
            {
                Reliable = reliable,
                DestinationIdentities = destinationIdentities,
                Topic = topic
            };
           
            JSNative.PushData(data, offset, size);
            JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

            var result = JSNative.CallMethod(NativeHandle, "publishData");
            return Acquire<JSPromise>(result);
        }

        public void SetTrackSubscriptionPermissions(bool allParticipantsAllowed,
            ParticipantTrackPermission[] participantTrackPermissions)
        {
            JSNative.PushBoolean(allParticipantsAllowed);
            JSNative.PushObject(new JSArray<ParticipantTrackPermission>(participantTrackPermissions).NativeHandle);

            JSNative.CallMethod(NativeHandle, "setTrackSubscriptionPermissions");
        }

        public JSPromise SetName(string name)
        {
            JSNative.PushString(name);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "setName"));
        }

        public JSPromise SetMetadata(string metadata)
        {
            JSNative.PushString(metadata);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "setMetadata"));
        }

        public JSPromise SetAttributes(JSMap<string, string> attributes) {
            JSNative.PushObject(attributes.NativeHandle);
            return Acquire<JSPromise>(JSNative.CallMethod(NativeHandle, "setAttributes"));
        }
    }
}