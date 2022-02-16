using System;

namespace LiveKit
{

    public class Room : JSRef
    {
        public Room(RoomOptions? options)
        {
            JSNative.NewInstance(LiveKit, NativePtr, "Room");
        }

    }

}