using System;
using UnityEngine.Scripting;

namespace LiveKit
{

    public class HTMLAudioElement : HTMLMediaElement
    {
        public float Volume
        {
            get
            {
                JSNative.PushString("volume");
                var ptr = Acquire(JSNative.GetProperty(NativePtr));
                return (int)JSNative.GetNumber(ptr.NativePtr);
            }
            set
            {
                JSNative.PushString("volume");
                JSNative.PushNumber(value);
                JSNative.SetProperty(NativePtr);
            }
        }

        [Preserve]
        public HTMLAudioElement(IntPtr ptr) : base(ptr)
        {

        }
    }
}