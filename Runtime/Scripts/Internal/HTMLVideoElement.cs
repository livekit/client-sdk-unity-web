using AOT;
using System;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    public delegate void VideoReceivedDelegate(Texture2D tex);

    public class HTMLVideoElement : HTMLMediaElement
    {
        private JSRef m_AttachRef;
        private int m_TexId;

        public int VideoWidth
        {
            get
            {
                JSNative.PushString("videoWidth");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return (int) JSNative.GetNumber(ptr.NativePtr);
            }
        }

        public int VideoHeight
        {
            get
            {
                JSNative.PushString("videoHeight");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return (int) JSNative.GetNumber(ptr.NativePtr);
            }
        }

        public event VideoReceivedDelegate VideoReceived;


        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        private static void ResizeEvent(IntPtr ptr)
        {
            var el = Acquire<HTMLVideoElement>(ptr);
            var tex = Texture2D.CreateExternalTexture(el.VideoWidth, el.VideoHeight, TextureFormat.RGBA32, false, false, new IntPtr(el.m_TexId));
            el.VideoReceived?.Invoke(tex);
        }

        [Preserve]
        public HTMLVideoElement(IntPtr ptr) : base(ptr)
        {
            m_TexId = JSNative.NewTexture();
            m_AttachRef = Acquire(JSNative.AttachVideo(m_TexId, NativePtr));
            AddEventListener("resize", ResizeEvent);
        }
    }
}