using System;
using NUnit.Framework;

namespace LiveKit.Tests
{
    public class JSHandleTest
    {

        [Test]
        public static void TestHandleFree()
        {
            var handle = JSNative.NewRef();
            handle = null;

            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            
            Assert.IsTrue(handle.IsClosed);
            Assert.IsTrue(JSNative.IsUndefined(new JSHandle(handle.DangerousGetHandle(), false)));
        }
    }
}