using AOT;
using System;
using System.Collections;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSPromise : JSObject, IEnumerator
    {
        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void PromiseResolve(IntPtr id)
        {
            var handle = new JSHandle(id, true);
            if (!JSNative.IsObject(handle))
                return; // The promise can be garbage collected before completed (When ignoring Promise)
            
            var promise = Acquire<JSPromise>(handle);
            promise.OnResolve();
            promise.IsDone = true;
        }

        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void PromiseReject(IntPtr id)
        {
            var handle = new JSHandle(id, true);
            if (!JSNative.IsObject(handle))
                return;
            
            var promise = Acquire<JSPromise>(handle);
            promise.OnReject();
            promise.IsDone = true;
            promise.IsError = true;
        }

        public bool IsDone { get; private set; }
        public bool IsError { get; private set; }
        public JSRef ResolveValue { get; protected set; }
        public JSRef RejectValue { get; protected set; }

        [Preserve]
        public JSPromise(JSHandle ptr) : base(ptr)
        {
            JSNative.PushFunction(NativePtr, PromiseResolve);
            JSNative.PushFunction(NativePtr, PromiseReject);
            JSNative.CallMethod(NativePtr, "then");
        }

        protected virtual void OnResolve()
        {
            ResolveValue = Acquire<JSRef>(JSNative.ShiftStack());
        }

        protected virtual void OnReject()
        {
            RejectValue = Acquire<JSRef>(JSNative.ShiftStack());
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

    public class JSPromise<T> : JSPromise where T : JSRef
    {
        public new T ResolveValue => base.ResolveValue as T;

        [Preserve]
        public JSPromise(JSHandle ptr) : base(ptr)
        {

        }

        protected override void OnResolve()
        {
            base.ResolveValue = Acquire<T>(JSNative.ShiftStack());
        }
    }

    public abstract class PromiseWrapper<T> : IEnumerator where T : JSRef
    {
        protected JSPromise<T> m_Promise;
        public bool IsError => m_Promise.IsError;
        public bool IsDone => m_Promise.IsDone;
        
        protected PromiseWrapper(JSPromise<T> promise)
        {
            m_Promise = promise;
        }

        public abstract void OnDone();

        public object Current => null;

        public bool MoveNext()
        {
            if (m_Promise.IsDone)
            {
                OnDone();
                return false;
            }

            return true;
        }

        public void Reset()
        {
            
        }
    }
}