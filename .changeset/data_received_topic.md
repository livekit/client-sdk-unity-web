---
io.livekit.unity: major
---

`Room.DataReceivedDelegate` now takes the packet's `topic` as a fourth parameter, so handlers need a `string topic` argument. `PublishData` now sends the topic it is given.
