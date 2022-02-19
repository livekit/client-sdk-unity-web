using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using AOT;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using UnityEngine;

namespace LiveKit
{
	[JsonConverter(typeof(StringEnumConverter))]
	public enum RoomState {
		[EnumMember(Value = "disconnected")]
		Disconnected,
		[EnumMember(Value = "connected")]
		Connected,
		[EnumMember(Value = "reconnecting")]
		Reconnecting
	}

	public class Room : JSRef
	{
		public delegate void ReconnectingDelegate();
		public delegate void ReconnectedDelegate();
		public delegate void DisconnectedDelegate();
		public delegate void StateChangedDelegate(RoomState state);
		public delegate void MediaDevicesChangedDelegate();
		public delegate void ParticipantConnectedDelegate(RemoteParticipant participant);
		public delegate void ParticipantDisconnectedDelegate(RemoteParticipant participant);
		public delegate void TrackPublishedDelegate(RemoteTrackPublication publication, RemoteParticipant participant);
		public delegate void TrackSubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication, RemoteParticipant participant);
		public delegate void TrackSubscriptionFailedDelegate(string trackSid, RemoteParticipant participant);
		public delegate void TrackUnpublishedDelegate(RemoteTrackPublication publication, RemoteParticipant participant);
		public delegate void TrackUnsubscribedDelegate(RemoteTrack track, RemoteTrackPublication publication, RemoteParticipant participant);
		public delegate void TrackMutedDelegate(TrackPublication publication, Participant participant);
		public delegate void TrackUnmutedDelegate(TrackPublication publication, Participant participant);
		public delegate void LocalTrackPublishedDelegate(LocalTrackPublication publication, LocalParticipant participant);
		public delegate void LocalTrackUnpublishedDelegate(LocalTrackPublication publication, LocalParticipant participant);
		public delegate void ParticipantMetadataChangedDelegate(string? metadata, Participant participant);
		public delegate void ActiveSpeakersChangedDelegate(JSArray<Participant> speakers);
		public delegate void RoomMetadataChangedDelegate(string metadata);
		public delegate void DataReceivedDelegate(byte[] data, RemoteParticipant? participant, DataPacketKind? kind);
		public delegate void ConnectionQualityChangedDelegate(ConnectionQuality quality, Participant participant);
		public delegate void MediaDevicesErrorDelegate(JSError error);
		public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publicationb, Track.StreamState streamState, RemoteParticipant participant);
		public delegate void TrackSubscriptionPermissionChangedDelegate(RemoteTrackPublication publication, TrackPublication.SubscriptionStatus status, RemoteParticipant participant);
		public delegate void AudioPlaybackChangedDelegate(bool playing);

		public event ReconnectingDelegate Reconnecting;
		public event ReconnectedDelegate Reconnected;
		public event DisconnectedDelegate Disconnected;
		public event StateChangedDelegate StateChanged;
		public event MediaDevicesChangedDelegate MediaDevicesChanged;
		public event ParticipantConnectedDelegate ParticipantConnected;
		public event ParticipantDisconnectedDelegate ParticipantDisconnected;
		public event TrackPublishedDelegate TrackPublished;
		public event TrackSubscribedDelegate TrackSubscribed;
		public event TrackSubscriptionFailedDelegate TrackSubscriptionFailed;
		public event TrackUnpublishedDelegate TrackUnpublished;
		public event TrackUnsubscribedDelegate TrackUnsubscribed;
		public event TrackMutedDelegate TrackMuted;
		public event TrackUnmutedDelegate TrackUnmuted;
		public event LocalTrackPublishedDelegate LocalTrackPublished;
		public event LocalTrackUnpublishedDelegate LocalTrackUnpublished;
		public event ParticipantMetadataChangedDelegate ParticipantMetadataChanged;
		public event ActiveSpeakersChangedDelegate ActiveSpeakersChanged;
		public event RoomMetadataChangedDelegate RoomMetadataChanged;
		public event DataReceivedDelegate DataReceived;
		public event ConnectionQualityChangedDelegate ConnectionQualityChanged;
		public event MediaDevicesErrorDelegate MediaDevicesError;
		public event TrackStreamStateChangedDelegate TrackStreamStateChanged;
		public event TrackSubscriptionPermissionChangedDelegate TrackSubscriptionPermissionChanged;
		public event AudioPlaybackChangedDelegate AudioPlaybackChanged;

		private class EventReceiver : JSRef
		{
			[MonoPInvokeCallback(typeof(Action<IntPtr>))]
			private static void EventReceived(IntPtr iptr)
			{
				BridgeData[iptr].TryGetTarget(out JSRef jsref);
				var evRef = jsref as EventReceiver;

				evRef.m_Room.TryGetTarget(out Room room);

				switch (evRef.m_Event)
				{
					case RoomEvent.Reconnecting:
						room.Reconnecting?.Invoke();
						break;
					case RoomEvent.Reconnected:
						room.Reconnected?.Invoke();
						break;
					case RoomEvent.Disconnected:
						room.Disconnected?.Invoke();
						break;
					case RoomEvent.StateChanged:
						{
							var fref = FromPtr(JSNative.ShiftStack());
							var str = JSNative.GetString(fref.NativePtr);
							room.StateChanged?.Invoke(Utils.ToEnum<RoomState>(str));
							break;
						}
					case RoomEvent.MediaDevicesChanged:
						room.MediaDevicesChanged?.Invoke();
						break;
					case RoomEvent.ParticipantConnected:
						{
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.ParticipantConnected?.Invoke(participant);
							break;
						}
					case RoomEvent.ParticipantDisconnected:
						{
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.ParticipantDisconnected?.Invoke(participant);
							break;
						}
					case RoomEvent.TrackPublished:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackPublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackSubscribed:
						{
							var track = FromPtr<RemoteTrack>(JSNative.ShiftStack());
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackSubscribed?.Invoke(track, publication, participant);
							break;
						}
					case RoomEvent.TrackSubscriptionFailed:
						{
							var fref = FromPtr(JSNative.ShiftStack());
							var sid = JSNative.GetString(fref.NativePtr);
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackSubscriptionFailed?.Invoke(sid, participant);
							break;
						}
					case RoomEvent.TrackUnpublished:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackUnpublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackUnsubscribed:
						{
							var track = FromPtr<RemoteTrack>(JSNative.ShiftStack());
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackUnsubscribed?.Invoke(track, publication, participant);
							break;
						}
					case RoomEvent.TrackMuted:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<Participant>(JSNative.ShiftStack());
							room.TrackMuted?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackUnmuted:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<Participant>(JSNative.ShiftStack());
							room.TrackUnmuted?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.LocalTrackPublished:
						{
							var publication = FromPtr<LocalTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<LocalParticipant>(JSNative.ShiftStack());
							room.LocalTrackPublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.LocalTrackUnpublished:
						{
							var publication = FromPtr<LocalTrackPublication>(JSNative.ShiftStack());
							var participant = FromPtr<LocalParticipant>(JSNative.ShiftStack());
							room.LocalTrackUnpublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.ParticipantMetadataChanged:
						{
							var fref = FromPtr(JSNative.ShiftStack());
							var metadata = JSNative.IsString(fref.NativePtr) ? JSNative.GetString(fref.NativePtr) : null;
							var participant = FromPtr<Participant>(JSNative.ShiftStack());
							room.ParticipantMetadataChanged?.Invoke(metadata, participant);
							break;
						}
					case RoomEvent.ActiveSpeakersChanged:
						{
							var jsarray = FromPtr<JSArray<Participant>>(JSNative.ShiftStack());
							room.ActiveSpeakersChanged?.Invoke(jsarray);
							break;
						}
					case RoomEvent.RoomMetadataChanged:
						{
							var fref = FromPtr<JSRef>(JSNative.ShiftStack());
							var metadata = JSNative.GetString(fref.NativePtr);
							room.RoomMetadataChanged?.Invoke(metadata);
							break;
						}
					case RoomEvent.DataReceived:
						{
							var dataref = FromPtr<JSRef>(JSNative.ShiftStack());
							var data = JSNative.GetData(dataref.NativePtr);

							var pref = FromPtr<JSRef>(JSNative.ShiftStack());
							var participant = JSNative.IsObject(pref.NativePtr) ? pref as RemoteParticipant : null;

							var kindref = FromPtr<JSRef>(JSNative.ShiftStack());
							var kind = JSNative.IsString(kindref.NativePtr)
								? Utils.ToEnum<DataPacketKind?>(JSNative.GetString(kindref.NativePtr)) : null;

							room.DataReceived?.Invoke(data, participant, kind);
							break;
						}
					case RoomEvent.ConnectionQualityChanged:
						{
							var fref = FromPtr(JSNative.ShiftStack());
							var quality = Utils.ToEnum<ConnectionQuality>(JSNative.GetString(fref.NativePtr));
							var participant = FromPtr<Participant>(JSNative.ShiftStack());
							room.ConnectionQualityChanged?.Invoke(quality, participant);
							break;
						}
					case RoomEvent.MediaDevicesError:
						{
							var error = FromPtr<JSError>(JSNative.ShiftStack());
							room.MediaDevicesError?.Invoke(error);
							break;
						}
					case RoomEvent.TrackStreamStateChanged:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var stateref = FromPtr(JSNative.ShiftStack());

							var state = Utils.ToEnum<Track.StreamState>(JSNative.GetString(stateref.NativePtr));
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());

							room.TrackStreamStateChanged?.Invoke(publication, state, participant);
							break;
						}
					case RoomEvent.TrackSubscriptionPermissionChanged:
						{
							var publication = FromPtr<RemoteTrackPublication>(JSNative.ShiftStack());
							var stateref = FromPtr(JSNative.ShiftStack());

							var status = Utils.ToEnum<TrackPublication.SubscriptionStatus>(JSNative.GetString(stateref.NativePtr));
							var participant = FromPtr<RemoteParticipant>(JSNative.ShiftStack());

							room.TrackSubscriptionPermissionChanged?.Invoke(publication, status, participant);
							break;
						}
					case RoomEvent.AudioPlaybackStatusChanged:
						{
							var fref = FromPtr(JSNative.ShiftStack());
							var playing = JSNative.GetBool(fref.NativePtr);
							room.AudioPlaybackChanged?.Invoke(playing);
							break;
						}
				}
			}

			private readonly WeakReference<Room> m_Room;
			private RoomEvent m_Event;
			
			public EventReceiver(Room room, RoomEvent e)
			{
				m_Room = new WeakReference<Room>(room);
				m_Event = e;

				JSNative.PushString(Utils.ToEnumString(e));
				JSNative.PushFunction(NativePtr, EventReceived);
				JSNative.FreeRef(JSNative.CallMethod(room.NativePtr, "on"));
			}
		}

		private List<EventReceiver> m_Events = new List<EventReceiver>(); // Avoid EventReceiver from being garbage collected

		public Room(RoomOptions? options = null)
		{
			if (options != null)
				JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

			JSNative.NewInstance(LiveKit, NativePtr, "Room");

			foreach(var e in Enum.GetValues(typeof(RoomEvent))){
				m_Events.Add(new EventReceiver(this, (RoomEvent) e));
			}
		}

		public JSPromise Connect(string url, string token, ConnectOptions? options = null)
		{
			JSNative.PushString(url);
			JSNative.PushString(token);

			if(options != null)
				JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

			return new JSPromise(JSNative.CallMethod(NativePtr, "connect"));
		}
	}
}