# LiveKit Unity SDK
This package works only on the WebGL platform of Unity

## Installation :
Follow this [unity tutorial](https://docs.unity3d.com/Manual/upm-ui-giturl.html) using the `https://github.com/livekit/unity-webgl-bridge.git` link.
You can then directly import the samples into the package manager

## Usage : 

```cs
public class MyObject : MonoBehaviour
{
    public Room Room;
    public RawImage RawImage;

    IEnumerator Start()
    {
        Room = new Room();
        var c = Room.Connect("<livekit-url>", "<your-token>");
        yield return c;

        Room.ParticipantConnected += (p) =>
        {
            Debug.Log($"Participant connected : {p.Sid}");
        };

        Room.TrackSubscribed += (track, publication, participant) =>
        {
            if(track.Kind == TrackKind.Video)
            {
                var video = track.Attach() as HTMLVideoElement;
                video.VideoReceived += tex =>
                {
                    // Do what you want with tex (tex is an instance of Texture2D)
                    RawImage.texture = tex;
                };
            }
            else if(track.Kind == TrackKind.Audio)
            {
                var audio = track.Attach() as HTMLAudioElement;
                audio.Volume = 0.5f;
            }
        };

        Room.DataReceived += (data, participant, kind) =>
        {
            Debug.Log("Received data : " + Encoding.ASCII.GetString(data));
        };

        yield return Room.LocalParticipant.PublishData(Encoding.ASCII.GetBytes("This is as test"), DataPacketKind.RELIABLE);
    }
}

```
