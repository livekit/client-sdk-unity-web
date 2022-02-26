

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
}