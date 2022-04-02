using NUnit.Framework;

namespace LiveKit.Tests
{
    [SetUpFixture]
    public class LKTests
    {
        internal static JSMap<double, JSRef> BridgeData { get; private set; }
        
        [OneTimeSetUp]
        public void RunBeforeAnyTests()
        {
            JSNative.PushString("Data");
            BridgeData = JSRef.Acquire<JSMap<double, JSRef>>(JSNative.GetProperty(JSNative.BridgeData));
        }

        [OneTimeTearDown]
        public void RunAfterAnyTests()
        {
            
        }
    }
}