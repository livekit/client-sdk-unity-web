using System;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class HTMLVideoElement : HTMLMediaElement
    {
        private JSRef m_AttachRef;
        private Texture2D m_Texture;

        [Preserve]
        public HTMLVideoElement(IntPtr ptr) : base(ptr)
        {
            var texId = JSNative.NewTexture();
            m_Texture = Texture2D.CreateExternalTexture(200, 200, TextureFormat.RGBA32, false, false, new IntPtr(texId));
            m_AttachRef = Acquire(JSNative.AttachVideo(texId, NativePtr));
        }

        ~HTMLVideoElement()
        {

        }

        public Texture GetTexture()
        {
            return m_Texture;
        }
    }
}