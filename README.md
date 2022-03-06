# LiveKit Unity SDK
This package works only on the WebGL platform of Unity

## Installation :
Follow this [unity tutorial](https://docs.unity3d.com/Manual/upm-ui-giturl.html) using the `https://github.com/livekit/client-sdk-unity-web.git` link.
You can then directly import the samples into the package manager.

If you want to write JavaScript code in your application (e.g. you want to use React for your UI), you can install our [TypeScript package](https://www.npmjs.com/package/@livekit/livekit-unity) via npm.

## Package version :
To avoid confusion, the npm package and the Unity package will always have the same version number.

## Usage : 
There are two different ways to build an application using this package :
1. Write your application entirely in C# (e.g. [ExampleRoom](https://github.com/livekit/client-sdk-unity-web/tree/main/Samples~/ExampleRoom))
2. Still use JS and be able to bridge the Room object by using our npm package. (e.g. [JSExample](https://github.com/livekit/client-sdk-unity-web/tree/main/Samples~/JSExample))

## Simple example
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
