

namespace LiveKit
{
    public enum DataPacketKind
    {
        RELIABLE = 0,
        LOSSY = 1,
        UNRECOGNIZED = -1,
    }

    public enum VideoQuality
    {
        LOW = 0,
        MEDIUM = 1,
        HIGH = 2,
        OFF = 3,
        UNRECOGNIZED = -1,
    }
    
    public enum DisconnectReason {
        UNKNOWN_REASON = 0,
        CLIENT_INITIATED = 1,
        DUPLICATE_IDENTITY = 2,
        SERVER_SHUTDOWN = 3,
        PARTICIPANT_REMOVED = 4,
        ROOM_DELETED = 5,
        STATE_MISMATCH = 6,
        UNRECOGNIZED = -1,
    }
}