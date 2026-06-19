<!--BEGIN_BANNER_IMAGE-->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/banner_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="/.github/banner_light.png">
  <img style="width:100%;" alt="The LiveKit icon, the name of the repository and some sample code in the background." src="https://raw.githubusercontent.com/livekit/client-sdk-unity-web/main/.github/banner_light.png">
</picture>

<!--END_BANNER_IMAGE-->

# LiveKit Unity SDK

<!--BEGIN_DESCRIPTION-->
Use this SDK to add realtime video, audio and data features to your Unity (WebGL) app. By connecting to <a href="https://livekit.io/">LiveKit</a> Cloud or a self-hosted server, you can quickly build applications such as multi-modal AI, live streaming, or video calls with just a few lines of code.
<!--END_DESCRIPTION-->

## Docs
Docs and guides at https://docs.livekit.io

[SDK reference](https://livekit.github.io/client-sdk-unity-web/)

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
For a complete example, look at our [demo](https://github.com/livekit/client-unity-demo)
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
Room.DataReceived += (data, participant, kind, topic) =>
{
    Debug.Log("Received data : " + Encoding.ASCII.GetString(data));
};

yield return Room.LocalParticipant.PublishData(
    Encoding.ASCII.GetBytes("This is as test"),
    reliable: true,
    destinationIdentities: null,
    topic: null
);
```

### Agent Communication
For agent voice (audio/video) communication, follow the basic publish/subscribe examples above. This section focuses on agent messaging, state, and transcription.

#### 1) Send message to an agent (`AgentSendTextExample`)
Sends a message to a specific participant identity on `lk.chat`.

```cs
public class AgentSendTextExample : MonoBehaviour
{
    public Room Room;
    public string AgentIdentity;

    public IEnumerator SendToAgent(string message)
    {
        var send = Room.LocalParticipant.SendText(
            text: message,
            destinationIdentities: new[] { AgentIdentity },
            topic: "lk.chat"
        );
        yield return send;
    }
}
```

#### 2) Listen for agent transcription (`AgentTranscriptionExample`)
Attach transcription listener when the matching agent participant connects.

```cs
public class AgentTranscriptionExample : MonoBehaviour
{
    public Room Room;
    public string AgentIdentity;
    private RemoteParticipant _agent;

    // Room.ParticipantConnected event listener
    public void OnAgentConnected(RemoteParticipant participant)
    {
        if (participant.Identity != AgentIdentity) return;
        _agent = participant;
        _agent.TranscriptionReceived += OnAgentTranscriptionReceived;
    }
    // Room.ParticipantDisconnected event listener
    public void OnAgentDisconnected(RemoteParticipant participant)
    {
        if (_agent != null && participant.Identity == _agent.Identity)
        {
            _agent.TranscriptionReceived -= OnAgentTranscriptionReceived;
            _agent = null;
        }
    }

    private void OnAgentTranscriptionReceived(List<TranscriptionSegment> segments, TrackPublication publication)
    {
        foreach (var segment in segments)
        {
            Debug.Log($"Agent with identity {_agent.Identity} transcription received: '{segment.Text}'");
        }
    }
}
```

#### 3) Listen for agent state changes (`AgentAttributesChangedExample`)
Uses `Room.AttributesChanged` and reads `lk.agent.state`.

```cs
public class AgentAttributesChangedExample : MonoBehaviour
{
    public Room Room;
    public string AgentIdentity;
    private RemoteParticipant _agent;
    // Room.ParticipantConnected event listener
    public void OnAgentConnected(RemoteParticipant participant)
    {
        if (participant.Identity != AgentIdentity) return;
        _agent = participant;
        Room.AttributesChanged += OnAgentAttributesChanged;
    }
    // Room.ParticipantDisconnected event listener
    public void OnAgentDisconnected(RemoteParticipant participant)
    {
        if (_agent != null && participant.Identity == _agent.Identity)
        {
            Room.AttributesChanged -= OnAgentAttributesChanged;
            _agent = null;
        }
    }

    public void OnAgentAttributesChanged(Participant participant, IReadOnlyDictionary<string, string> changedAttributes)
    {
        if (_agent == null || participant.Identity != _agent.Identity) return;
        if (changedAttributes.TryGetValue("lk.agent.state", out var state))
        {
            Debug.Log($"Agent with identity {participant.Identity} is now {state}");
        }
    }
}
```

<!--BEGIN_REPO_NAV-->
<br/><table>
<thead><tr><th colspan="2">LiveKit Ecosystem</th></tr></thead>
<tbody>
<tr><td>Agents SDKs</td><td><a href="https://github.com/livekit/agents">Python</a> · <a href="https://github.com/livekit/agents-js">Node.js</a></td></tr><tr></tr>
<tr><td>LiveKit SDKs</td><td><a href="https://github.com/livekit/client-sdk-js">Browser</a> · <a href="https://github.com/livekit/client-sdk-swift">Swift</a> · <a href="https://github.com/livekit/client-sdk-android">Android</a> · <a href="https://github.com/livekit/client-sdk-flutter">Flutter</a> · <a href="https://github.com/livekit/client-sdk-react-native">React Native</a> · <a href="https://github.com/livekit/rust-sdks">Rust</a> · <a href="https://github.com/livekit/node-sdks">Node.js</a> · <a href="https://github.com/livekit/python-sdks">Python</a> · <a href="https://github.com/livekit/client-sdk-unity">Unity</a> · <b>Unity (WebGL)</b> · <a href="https://github.com/livekit/client-sdk-esp32">ESP32</a> · <a href="https://github.com/livekit/client-sdk-cpp">C++</a></td></tr><tr></tr>
<tr><td>Starter Apps</td><td><a href="https://github.com/livekit-examples/agent-starter-python">Python Agent</a> · <a href="https://github.com/livekit-examples/agent-starter-node">TypeScript Agent</a> · <a href="https://github.com/livekit-examples/agent-starter-react">React App</a> · <a href="https://github.com/livekit-examples/agent-starter-swift">SwiftUI App</a> · <a href="https://github.com/livekit-examples/agent-starter-android">Android App</a> · <a href="https://github.com/livekit-examples/agent-starter-flutter">Flutter App</a> · <a href="https://github.com/livekit-examples/agent-starter-react-native">React Native App</a> · <a href="https://github.com/livekit-examples/agent-starter-embed">Web Embed</a></td></tr><tr></tr>
<tr><td>UI Components</td><td><a href="https://github.com/livekit/components-js">React</a> · <a href="https://github.com/livekit/components-android">Android Compose</a> · <a href="https://github.com/livekit/components-swift">SwiftUI</a> · <a href="https://github.com/livekit/components-flutter">Flutter</a></td></tr><tr></tr>
<tr><td>Server APIs</td><td><a href="https://github.com/livekit/node-sdks">Node.js</a> · <a href="https://github.com/livekit/server-sdk-go">Golang</a> · <a href="https://github.com/livekit/server-sdk-ruby">Ruby</a> · <a href="https://github.com/livekit/server-sdk-kotlin">Java/Kotlin</a> · <a href="https://github.com/livekit/python-sdks">Python</a> · <a href="https://github.com/livekit/rust-sdks">Rust</a> · <a href="https://github.com/agence104/livekit-server-sdk-php">PHP (community)</a> · <a href="https://github.com/pabloFuente/livekit-server-sdk-dotnet">.NET (community)</a></td></tr><tr></tr>
<tr><td>Resources</td><td><a href="https://docs.livekit.io">Docs</a> · <a href="https://docs.livekit.io/mcp">Docs MCP Server</a> · <a href="https://github.com/livekit/livekit-cli">CLI</a> · <a href="https://cloud.livekit.io">LiveKit Cloud</a></td></tr><tr></tr>
<tr><td>LiveKit Server OSS</td><td><a href="https://github.com/livekit/livekit">LiveKit server</a> · <a href="https://github.com/livekit/egress">Egress</a> · <a href="https://github.com/livekit/ingress">Ingress</a> · <a href="https://github.com/livekit/sip">SIP</a></td></tr><tr></tr>
<tr><td>Community</td><td><a href="https://community.livekit.io">Developer Community</a> · <a href="https://livekit.io/join-slack">Slack</a> · <a href="https://x.com/livekit">X</a> · <a href="https://www.youtube.com/@livekit_io">YouTube</a></td></tr>
</tbody>
</table>
<!--END_REPO_NAV-->
