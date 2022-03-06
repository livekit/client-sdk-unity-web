import { UnityBridge, UnityEvent } from '@livekit/livekit-unity'

UnityBridge.instance.on(UnityEvent.RoomCreated, async (room) => {
    console.log('Received a room from Unity');

    await room.connect('<url>', '<your-token');
});