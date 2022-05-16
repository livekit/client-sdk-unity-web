# LiveKit Unity SDK
This package only works on the WebGL platform of Unity

## Docs
Docs and guides at https://docs.livekit.io

As this package is a bridge to [client-sdk-js](https://github.com/livekit/client-sdk-js), you can use its [SDK reference](https://docs.livekit.io/client-sdk-js/)

## Installation :
Follow this [unity tutorial](https://docs.unity3d.com/Manual/upm-ui-giturl.html) using the `https://github.com/livekit/client-sdk-unity-web.git` link.
You can then directly import the samples into the package manager.

If you want to write JavaScript code in your application (e.g. you want to use React for your UI), you can install our [TypeScript package](https://www.npmjs.com/package/@livekit/livekit-unity) via npm.
To avoid confusion, the npm package and the Unity package will always have the same version number.

## Usage : 
There are two different ways to build an application using this package :
1. Write your application entirely in C# (e.g. [ExampleRoom](https://github.com/livekit/client-sdk-unity-web/tree/main/Samples~/ExampleRoom))
2. Still use JS and be able to bridge the Room object by using our npm package. (e.g. [JSExample](https://github.com/livekit/client-sdk-unity-web/tree/main/Samples~/JSExample))

### Debugging
To display internal LiveKit logs, add LK DEBUG to define symbols

## Examples
For a complete example, look at our [demo](https://unity.livekit.io)
### Connecting to a room
```cs
public class MyObject : MonoBehaviour
{
    public Room Room;

    IEnumerator Start()
    {
        Room = new Room();
        var c = Room.Connect("<livekit-url>", "<your-token>");
        yield return c;

        if (!c.IsError) {
            // Connected
        }
    }
}

```

### Publishing video & audio

```cs
yield return Room.LocalParticipant.EnableCameraAndMicrophone();
```

### Display a video on a RawImage
```cs
RawImage image = GetComponent<RawImage>();

Room.TrackSubscribed += (track, publication, participant) =>
{
    if(track.Kind == TrackKind.Video)
    {
        var video = track.Attach() as HTMLVideoElement;
        video.VideoReceived += tex =>
        {
            // VideoReceived is called every time the video resolution changes
            image.texture = tex;
        };
    }
};
```

### Sending/Receiving data
```cs
Room.DataReceived += (data, participant, kind) =>
{
    Debug.Log("Received data : " + Encoding.ASCII.GetString(data));
};

yield return Room.LocalParticipant.PublishData(Encoding.ASCII.GetBytes("This is as test"), DataPacketKind.RELIABLE);
```