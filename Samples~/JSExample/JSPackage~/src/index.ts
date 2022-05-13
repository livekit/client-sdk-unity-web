import { UnityBridge, UnityEvent } from '@livekit/livekit-unity'
import { Room } from 'livekit-client'

var room : Room
UnityBridge.instance.on(UnityEvent.RoomCreated, async (r) => {
    room = r;
});

var muteBtn = document.getElementById('mutebtn');
muteBtn!.addEventListener('click', async () => {
    await room.localParticipant.setMicrophoneEnabled(false);
});