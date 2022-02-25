using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using AOT;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using UnityEngine.Scripting;

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
	public delegate void ParticipantMetadataChangedDelegate(string metadata, Participant participant);
	public delegate void ActiveSpeakersChangedDelegate(JSArray<Participant> speakers);
	public delegate void RoomMetadataChangedDelegate(string metadata);
	public delegate void DataReceivedDelegate(byte[] data, RemoteParticipant participant, DataPacketKind? kind);
	public delegate void ConnectionQualityChangedDelegate(ConnectionQuality quality, Participant participant);
	public delegate void MediaDevicesErrorDelegate(JSError error);
	public delegate void TrackStreamStateChangedDelegate(RemoteTrackPublication publicationb, TrackStreamState streamState, RemoteParticipant participant);
	public delegate void TrackSubscriptionPermissionChangedDelegate(RemoteTrackPublication publication, TrackPublication.SubscriptionStatus status, RemoteParticipant participant);
	public delegate void AudioPlaybackChangedDelegate(bool playing);

	public class Room : JSRef
	{
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
				var evRef = Acquire<EventReceiver>(iptr);
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
							var fref = Acquire(JSNative.ShiftStack());
							var str = JSNative.GetString(fref.NativePtr);
							room.StateChanged?.Invoke(Utils.ToEnum<RoomState>(str));
							break;
						}
					case RoomEvent.MediaDevicesChanged:
						room.MediaDevicesChanged?.Invoke();
						break;
					case RoomEvent.ParticipantConnected:
						{
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.ParticipantConnected?.Invoke(participant);
							break;
						}
					case RoomEvent.ParticipantDisconnected:
						{
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.ParticipantDisconnected?.Invoke(participant);
							break;
						}
					case RoomEvent.TrackPublished:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackPublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackSubscribed:
						{
							var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackSubscribed?.Invoke(track, publication, participant);
							break;
						}
					case RoomEvent.TrackSubscriptionFailed:
						{
							var fref = Acquire(JSNative.ShiftStack());
							var sid = JSNative.GetString(fref.NativePtr);
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackSubscriptionFailed?.Invoke(sid, participant);
							break;
						}
					case RoomEvent.TrackUnpublished:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackUnpublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackUnsubscribed:
						{
							var track = Acquire<RemoteTrack>(JSNative.ShiftStack());
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());
							room.TrackUnsubscribed?.Invoke(track, publication, participant);
							break;
						}
					case RoomEvent.TrackMuted:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<Participant>(JSNative.ShiftStack());
							room.TrackMuted?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.TrackUnmuted:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<Participant>(JSNative.ShiftStack());
							room.TrackUnmuted?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.LocalTrackPublished:
						{
							var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
							room.LocalTrackPublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.LocalTrackUnpublished:
						{
							var publication = Acquire<LocalTrackPublication>(JSNative.ShiftStack());
							var participant = Acquire<LocalParticipant>(JSNative.ShiftStack());
							room.LocalTrackUnpublished?.Invoke(publication, participant);
							break;
						}
					case RoomEvent.ParticipantMetadataChanged:
						{
							var fref = Acquire(JSNative.ShiftStack());
							var metadata = JSNative.IsString(fref.NativePtr) ? JSNative.GetString(fref.NativePtr) : null;
							var participant = Acquire<Participant>(JSNative.ShiftStack());
							room.ParticipantMetadataChanged?.Invoke(metadata, participant);
							break;
						}
					case RoomEvent.ActiveSpeakersChanged:
						{
							var jsarray = Acquire<JSArray<Participant>>(JSNative.ShiftStack());
							room.ActiveSpeakersChanged?.Invoke(jsarray);
							break;
						}
					case RoomEvent.RoomMetadataChanged:
						{
							var fref = Acquire<JSRef>(JSNative.ShiftStack());
							var metadata = JSNative.GetString(fref.NativePtr);
							room.RoomMetadataChanged?.Invoke(metadata);
							break;
						}
					case RoomEvent.DataReceived:
						{
							var dataref = Acquire<JSRef>(JSNative.ShiftStack());
							var data = JSNative.GetData(JSNative.GetDataPtr(dataref.NativePtr));

							var pref = Acquire<JSRef>(JSNative.ShiftStack());
							var participant = JSNative.IsObject(pref.NativePtr) ? pref as RemoteParticipant : null;

							var kindref = Acquire<JSRef>(JSNative.ShiftStack());
							var kind = JSNative.IsString(kindref.NativePtr)
								? Utils.ToEnum<DataPacketKind?>(JSNative.GetString(kindref.NativePtr)) : null;

							room.DataReceived?.Invoke(data, participant, kind);
							break;
						}
					case RoomEvent.ConnectionQualityChanged:
						{
							var fref = Acquire(JSNative.ShiftStack());
							var quality = Utils.ToEnum<ConnectionQuality>(JSNative.GetString(fref.NativePtr));
							var participant = Acquire<Participant>(JSNative.ShiftStack());
							room.ConnectionQualityChanged?.Invoke(quality, participant);
							break;
						}
					case RoomEvent.MediaDevicesError:
						{
							var error = Acquire<JSError>(JSNative.ShiftStack());
							room.MediaDevicesError?.Invoke(error);
							break;
						}
					case RoomEvent.TrackStreamStateChanged:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var stateref = Acquire(JSNative.ShiftStack());

							var state = Utils.ToEnum<TrackStreamState>(JSNative.GetString(stateref.NativePtr));
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

							room.TrackStreamStateChanged?.Invoke(publication, state, participant);
							break;
						}
					case RoomEvent.TrackSubscriptionPermissionChanged:
						{
							var publication = Acquire<RemoteTrackPublication>(JSNative.ShiftStack());
							var stateref = Acquire(JSNative.ShiftStack());

							var status = Utils.ToEnum<TrackPublication.SubscriptionStatus>(JSNative.GetString(stateref.NativePtr));
							var participant = Acquire<RemoteParticipant>(JSNative.ShiftStack());

							room.TrackSubscriptionPermissionChanged?.Invoke(publication, status, participant);
							break;
						}
					case RoomEvent.AudioPlaybackStatusChanged:
						{
							var fref = Acquire(JSNative.ShiftStack());
							var playing = JSNative.GetBool(fref.NativePtr);
							room.AudioPlaybackChanged?.Invoke(playing);
							break;
						}
				}
			}

			private readonly WeakReference<Room> m_Room;
			private RoomEvent m_Event;
			
			public EventReceiver(Room room, RoomEvent e) : base(JSNative.NewRef())
			{
				m_Room = new WeakReference<Room>(room);
				m_Event = e;

				JSNative.PushString(Utils.ToEnumString(e));
				JSNative.PushFunction(NativePtr, EventReceived);
				Acquire(JSNative.CallMethod(room.NativePtr, "on"));
			}
		}

		private List<EventReceiver> m_Events = new List<EventReceiver>(); // Avoid EventReceiver from being garbage collected
		public LocalParticipant LocalParticipant
        {
            get
            {
				JSNative.PushString("localParticipant");
				return Acquire<LocalParticipant>(JSNative.GetProperty(NativePtr));
			}
        }

		[Preserve]
		public Room(IntPtr ptr) : base(ptr)
        {

        }

		public Room(RoomOptions? options = null) : base(JSNative.NewRef())
		{
			if (options != null)
				JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

			JSNative.NewInstance(LiveKit.NativePtr, NativePtr, "Room");

			foreach(var e in Enum.GetValues(typeof(RoomEvent))){
				m_Events.Add(new EventReceiver(this, (RoomEvent) e));
			}
		}

		public ConnectOperation Connect(string url, string token, ConnectOptions? options = null)
		{
			JSNative.PushString(url);
			JSNative.PushString(token);

			if(options != null)
				JSNative.PushStruct(JsonConvert.SerializeObject(options, JSNative.JsonSettings));

			return new ConnectOperation(Acquire<JSPromise<Room>>(JSNative.CallMethod(NativePtr, "connect")));
		}
	}


	public class ConnectOperation : PromiseWrapper<Room>
	{
		public Room Room { get; private set; }

		public ConnectOperation(JSPromise<Room> promise) : base(promise)
		{

		}

		public override void OnDone()
		{
			if(!m_Promise.IsError)
				Room = m_Promise.ResolveValue;
		}
	}

}