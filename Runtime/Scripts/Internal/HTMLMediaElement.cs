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
                return (float) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
            set
            {
                JSNative.PushString("volume");
                JSNative.PushNumber(value);
                JSNative.SetProperty(NativeHandle);
            }
        }

        [Preserve]
        internal HTMLMediaElement(JSHandle handle) : base(handle)
        {
            
        }
    }
}