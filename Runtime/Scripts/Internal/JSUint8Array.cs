using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSUint8Array : JSObject
    {
        [Preserve]
        internal JSUint8Array(JSHandle handle) : base(handle)
        {
            
        }

        public int Length
        {
            get
            {
                JSNative.PushString("byteLength");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
            }
        }

        public byte[] ToArray()
        {
            var buff = new byte[Length];
            JSNative.CopyData(NativeHandle, buff, 0, buff.Length);
            return buff;
        }
    }
}