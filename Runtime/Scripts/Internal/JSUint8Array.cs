using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSUint8Array : JSObject
    {
        [Preserve]
        public JSUint8Array(JSHandle ptr) : base(ptr)
        {
            
        }

        public int Length
        {
            get
            {
                JSNative.PushString("byteLength");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
        }

        public byte[] ToArray()
        {
            var buff = new byte[Length];
            JSNative.CopyData(NativePtr, buff, 0, buff.Length);
            return buff;
        }
    }
}