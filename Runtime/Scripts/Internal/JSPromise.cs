using AOT;
using System;
using System.Collections;
using UnityEngine.Scripting;

namespace LiveKit
{
    // TODO Support "Then" chaining ?
    public class JSPromise : JSRef, IEnumerator
    {
        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        public static void PromiseResolve(IntPtr id)
        {
            BridgeData[id].TryGetTarget(out JSRef jsref);
            var promise = jsref as JSPromise;
            promise.IsDone = true;

            if (promise.m_IgnoreFirst)
            {
                promise.m_IgnoreFirst = false;
                return;
            }
            
            promise.m_Resolve();
        }

        [MonoPInvokeCallback(typeof(Action<IntPtr>))]
        public static void PromiseReject(IntPtr id)
        {
            BridgeData[id].TryGetTarget(out JSRef jsref);
            var promise = jsref as JSPromise;
            promise.IsDone = true;
            promise.IsError = true;

            if (promise.m_IgnoreFirst)
            {
                promise.m_IgnoreFirst = false;
                return;
            }

            promise.m_Reject();
        }

        public delegate void PromiseResolveDelegate();
        public delegate void PromiseRejectDelegate();

        private PromiseResolveDelegate m_Resolve;
        private PromiseRejectDelegate m_Reject;
        private bool m_IgnoreFirst;

        public bool IsDone { get; private set; }
        public bool IsError { get; private set; }

        [Preserve]
        public JSPromise(IntPtr ptr) : base(ptr)
        {
            m_IgnoreFirst = true; // Support yield operation
            Then(() => { }, () => { });
        }

        public void Then(PromiseResolveDelegate resolve, PromiseRejectDelegate reject)
        {
            m_Resolve = resolve;
            m_Reject = reject;

            JSNative.PushFunction(NativePtr, PromiseResolve);
            JSNative.PushFunction(NativePtr, PromiseReject);
            JSNative.CallMethod(NativePtr, "then");
        }

        public void Catch(PromiseRejectDelegate reject)
        {
            m_Reject = reject;

            JSNative.PushFunction(NativePtr, PromiseResolve);
            JSNative.CallMethod(NativePtr, "catch");
        }

        // Coroutines impl
        public object Current => null;

        public bool MoveNext()
        {
            return !IsDone;
        }

        public void Reset()
        {
            // Ignore
        }
    }
}