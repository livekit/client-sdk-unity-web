namespace LiveKit
{
    public interface ITrack
    {
        public delegate void MessageDelegate();
        public delegate void MutedDelegate(Track track);
        public delegate void UnmutedDelegate(Track track);
        public delegate void EndedDelegate(Track track);
        public delegate void ElementAttachedDelegate(HTMLMediaElement element);
        public delegate void ElementDetachedDelegate(HTMLMediaElement element);

        event MessageDelegate Message;
        event MutedDelegate Muted;
        event UnmutedDelegate Unmuted;
        event EndedDelegate Ended;
        event ElementAttachedDelegate ElementAttached;
        event ElementDetachedDelegate ElementDetached;

        TrackKind Kind { get; }
        MediaStreamTrack MediaStreamTrack { get; }
        JSArray<HTMLMediaElement> AttachedElements { get; }
        bool IsMuted { get; }
        TrackSource Source { get; }
        string Sid { get; }
        HTMLMediaElement Attach();
        JSArray<HTMLMediaElement> Detach();
        void Stop();
    }
}