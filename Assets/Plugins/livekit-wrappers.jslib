mergeInto(LibraryManager.library, {

    Connect: function(url, token, callback){
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
                const video = track.videoTrack.attach();
                console.log(video);
                document.body.appendChild(video);

                // Create texture manually because glTexImage2D is faster than glTexSubImage2D in some browsers
                var tex = GLctx.createTexture();
                if (!tex) {
                    // Error
                }
                var id = GL.getNewId(GL.textures);
                tex.name = id;
                GL.textures[id] = tex;

                // Update texture
                var lastTime = -1;
                var update = function(){
                    var time = video.currentTime;
                    if (time !== lastTime) {
                        GLctx.bindTexture(GLctx.TEXTURE_2D, tex);
                        // Flip
                        GLctx.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                        GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, video);
                        GLctx.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

                        GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MAG_FILTER, GLctx.LINEAR);
                        GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
                        GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
                        GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
                        GLctx.bindTexture(GLctx.TEXTURE_2D, null);
                
                        lastTime = time;
                    }

                    requestAnimationFrame(update);
                };

                requestAnimationFrame(update);
                Runtime.dynCall("vi", callback, [id]);
            });
        });
    }
});