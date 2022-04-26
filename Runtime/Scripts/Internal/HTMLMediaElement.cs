using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit
{
    public abstract class HTMLMediaElement : HTMLElement
    {
        public float Volume
        {
            get
            {
                JSNative.PushString("volume");
                return (float) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
            set
            {
                JSNative.PushString("volume");
                JSNative.PushNumber(value);
                JSNative.SetProperty(NativePtr);
            }
        }

        [Preserve]
        internal HTMLMediaElement(JSHandle ptr) : base(ptr)
        {
            
        }
    }
}