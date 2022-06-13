using System;
using AOT;
using UnityEngine;
using UnityEngine.Scripting;
using Object = UnityEngine.Object;

namespace LiveKit
{
    public class HTMLVideoElement : HTMLMediaElement
    {
        public int VideoWidth
        {
            get
            {
                JSNative.PushString("videoWidth");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
        }
        
        public int VideoHeight
        {
            get
            {
                JSNative.PushString("videoHeight");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
        }
        
        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void ResizeEvent(IntPtr ptr)
        {
            try
            {
                var handle = new JSHandle(ptr, true);
                if (!JSNative.IsObject(handle))
                    return;
                
                var el = Acquire<HTMLVideoElement>(handle);
                Log.Debug($"Received HTMLVideoElement.Resize {el.VideoWidth}x{el.VideoHeight}");
                
                el.SetupTexture();
                el.VideoReceived?.Invoke(el.Texture);
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on HTMLVideoElement.VideoReceived ( Is your listeners working correctly ? ): {Environment.NewLine} {e.Message}");
                throw;
            }
        }
        
        public delegate void VideoReceivedDelegate(Texture2D tex);
        public event VideoReceivedDelegate VideoReceived;
        
        public Texture2D Texture { get; private set; }
        private readonly int m_TextureId;

        [Preserve]
        internal HTMLVideoElement(JSHandle handle) : base(handle)
        {
            m_TextureId = JSNative.NewTexture();
            SetupTexture();
            JSNative.AttachVideo(NativeHandle, m_TextureId);
            AddEventListener("resize", ResizeEvent);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            Object.Destroy(Texture);
            JSNative.DestroyTexture(m_TextureId);
        }

        void SetupTexture()
        {
            if (Texture != null)
                Object.Destroy(Texture);
            
            Texture = Texture2D.CreateExternalTexture(VideoWidth, VideoHeight, TextureFormat.RGBA32, false, false, (IntPtr) m_TextureId);
        }
    }
}