using NUnit.Framework;

namespace LiveKit.Tests
{
    public class JSHandleTest
    {
        // JSRef only exposes the protected Dispose(bool) pattern, so expose it for the test.
        private class DisposableRef : JSRef
        {
            public void Free() => Dispose(true);
        }

        [Test]
        public static void TestHandleFree()
        {
            var room = new DisposableRef(); // There is only 1 reference to a JSHandle here
            var ptr = room.NativeHandle.DangerousGetHandle();

            Assert.IsTrue(JSRef.Cache.ContainsKey(ptr), "Object isn't on the C# cache");
            Assert.IsTrue(LKTests.BridgeData.ContainsKey(ptr.ToInt64()), "Object isn't on the JS cache");

            room.Free(); // It'll only free the room NativePtr, other resources are garbage collected

            Assert.IsFalse(JSRef.Cache.ContainsKey(ptr), "Object is still on the C# cache");
            Assert.IsFalse(LKTests.BridgeData.ContainsKey(ptr.ToInt64()), "Object is still on the JS cache");
        }
    }
}