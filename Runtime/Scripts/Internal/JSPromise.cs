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
            try
            {
                var handle = new JSHandle(id, true);
                if (!JSNative.IsObject(handle))
                    return; // The promise can be garbage collected before completed (When ignoring Promise)
            
                var promise = Acquire<JSPromise>(handle);
                promise.OnResolve();
                promise.IsDone = true;
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on JSPromise.PromiseResolve: {Environment.NewLine} {e.Message}");  
            }
        }

        [MonoPInvokeCallback(typeof(JSNative.JSDelegate))]
        private static void PromiseReject(IntPtr id)
        {
            try
            {
                var handle = new JSHandle(id, true);
                if (!JSNative.IsObject(handle))
                    return;
            
                var promise = Acquire<JSPromise>(handle);
                promise.OnReject();
                promise.IsDone = true;
                promise.IsError = true;
            }
            catch (Exception e)
            {
                Log.Error($"Error happened on JSPromise.PromiseReject: {Environment.NewLine} {e.Message}"); 
            }
        }

        public bool IsDone { get; private set; }
        public bool IsError { get; private set; }
        internal JSHandle ResolveHandle { get; private set; }
        internal JSHandle RejectHandle { get; private set; }

        [Preserve]
        internal JSPromise(JSHandle handle) : base(handle)
        {
            JSNative.PushFunction(NativeHandle, PromiseResolve, "PromiseResolve");
            JSNative.PushFunction(NativeHandle, PromiseReject, "PromiseReject");
            JSNative.CallMethod(NativeHandle, "then");
        }

        protected virtual void OnResolve()
        {
            ResolveHandle = JSNative.ShiftStack();
        }

        protected virtual void OnReject()
        {
            RejectHandle = JSNative.ShiftStack();
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

    public class JSPromise<T> : JSPromise where T : JSObject
    {
        public T ResolveValue { get; private set; } // Nullable

        [Preserve]
        internal JSPromise(JSHandle handle) : base(handle)
        {

        }

        protected override void OnResolve()
        {
            base.OnResolve();
            if (JSNative.IsUndefined(ResolveHandle) || JSNative.IsNull(ResolveHandle))
                return;
            
            ResolveValue = Acquire<T>(ResolveHandle);
        }
    }
}