mergeInto(LibraryManager.library, {

    Connect: function(url, token){
        const room = new livekit.Room({
            adaptiveStream: true,
            dynacast: true,
            videoCaptureDefaults: {
                resolution: livekit.VideoPresets.hd.resolution,
            }
        });
        
        room.connect(Pointer_stringify(url), Pointer_stringify(token)).then(function(){
            const p = room.localParticipant;

            p.setCameraEnabled(true).then(function(){
                const track = p.getTrack(livekit.Track.Source.Camera);
                const videoElement = track.videoTrack.attach();
                console.log(videoElement);
            });
        });
    }
});