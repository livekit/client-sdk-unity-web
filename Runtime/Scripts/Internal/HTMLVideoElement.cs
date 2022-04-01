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
                var ptr = Acquire<JSNumber>(JSNative.GetProperty(NativePtr));
                return (int)ptr.ToNumber();
            }
        }

        public int VideoHeight
        {
            get
            {
                JSNative.PushString("videoHeight");
                var ptr = Acquire<JSNumber>(JSNative.GetProperty(NativePtr));
                return (int)ptr.ToNumber();
            }
        }

        public event VideoReceivedDelegate VideoReceived;


        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void ResizeEvent(IntPtr ptr)
        {
            var handle = new JSHandle(ptr);
            var el = Acquire<HTMLVideoElement>(handle);
            var tex = Texture2D.CreateExternalTexture(el.VideoWidth, el.VideoHeight, TextureFormat.RGBA32, false, false, new IntPtr(el.m_TexId));
            el.VideoReceived?.Invoke(tex);
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