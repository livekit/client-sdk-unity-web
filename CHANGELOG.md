# Changelog

## 3.0.0

### Major Changes

- Participant attributes use `IReadOnlyDictionary<string, string>` instead of `JSMap<string, string>`: `Participant.attributes`, `AttributesChangedDelegate` and `LocalParticipant.SetAttributes`. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))
- `Room.DataReceivedDelegate` now takes the packet's `topic` as a fourth parameter, so handlers need a `string topic` argument. `PublishData` now sends the topic it is given. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))
- Remove the JSExample sample and the documented way to use the room from JavaScript through the `@livekit/livekit-unity` npm package, which is no longer published. Write the application in C#. - [#95](https://github.com/livekit/client-sdk-unity-web/pull/95) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))

### Minor Changes

- Add `LocalParticipant.SendText` and `TranscriptionReceived` events on `Room` and `Participant` to talk to LiveKit agents. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))
- Add `Client.CreateAudioAnalyser` to analyse the audio of a track. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))

### Patch Changes

- Update the bundled livekit-client to 2.23.0. - [#92](https://github.com/livekit/client-sdk-unity-web/pull/92) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))
- Fix `Room.Connect` never finishing when the connection fails, for example with an invalid token or an unreachable server. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))
- Fix callbacks from JavaScript into C# on Unity versions without `Runtime.dynCall` or a global `dynCall`. - [#93](https://github.com/livekit/client-sdk-unity-web/pull/93) ([@MaxHeimbrock](https://github.com/MaxHeimbrock))


The notes for 2.0.0 and earlier are on the [releases page](https://github.com/livekit/client-sdk-unity-web/releases).
