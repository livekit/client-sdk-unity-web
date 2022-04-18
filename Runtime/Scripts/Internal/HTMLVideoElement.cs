using AOT;
using System;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    public delegate void VideoReceivedDelegate(Texture2D tex);

    public class HTMLVideoElement : HTMLMediaElement
    {
        private JSHandle m_AttachRef; // Keep a reference
        private int m_TexId;

        public int VideoWidth
        {
            get
            {
                JSNative.PushString("videoWidth");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
        }

        public int VideoHeight
        {
            get
            {
                JSNative.PushString("videoHeight");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
        }

        public event VideoReceivedDelegate VideoReceived;

        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void ResizeEvent(IntPtr ptr)
        {
            try
            {
                var handle = new JSHandle(ptr, true);
                var el = AcquireOrNull<HTMLVideoElement>(handle);
                if (el == null)
                    return;
                
                Log.Debug($"Received HTMLVideoElement.Resize {el.VideoWidth}x{el.VideoHeight}");
                
                var tex = Texture2D.CreateExternalTexture(el.VideoWidth, el.VideoHeight, TextureFormat.RGBA32, false, false, new IntPtr(el.m_TexId));
                el.VideoReceived?.Invoke(tex);
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on HTMLVideoElement.VideoReceived ( Is your listeners working correctly ? ): {Environment.NewLine} {e.Message}");
                throw;
            }
        }

        [Preserve]
        public HTMLVideoElement(JSHandle ptr) : base(ptr)
        {
            m_TexId = JSNative.NewTexture();
            m_AttachRef = JSNative.AttachVideo(m_TexId, NativePtr);
            AddEventListener("resize", ResizeEvent);
        }

        ~HTMLVideoElement()
        {
            JSNative.DestroyTexture(m_TexId);
        }
    }
}