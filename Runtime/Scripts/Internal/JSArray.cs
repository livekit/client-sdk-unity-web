using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSArray<T> : JSObject, IList<T>
    {
        private object m_Lock = new object();

        [Preserve]
        public JSArray(JSHandle ptr) : base(ptr)
        {

        }

        public JSArray()
        {
            JSNative.NewInstance(JSHandle.Zero, NativePtr, "Array");
        }

        public JSArray(IEnumerable<T> f) : this()
        {
            foreach(var i in f)
                Add(i);
        }

        public bool IsFixedSize => false;

        public bool IsReadOnly => false;

        public int Count {
            get 
            {
                JSNative.PushString("length");
                return (int) Acquire<JSNumber>(JSNative.GetProperty(NativePtr)).ToNumber();
            }
        }

        public bool IsSynchronized => false;

        public object SyncRoot => m_Lock;

        public T this[int index]
        {
            get 
            {
                if(index >= Count)
                    throw new IndexOutOfRangeException();

                JSNative.PushNumber(index);
                var ptr = AcquireOrNull(JSNative.GetProperty(NativePtr));
                if(ptr == null)
                    return default(T);

                if (JSNative.IsPrimitive(typeof(T)))
                    return (T) JSNative.GetPrimitive(ptr.NativePtr);
                else
                    return (T)(object) ptr;
            }
            set {
                JSNative.PushNumber(index);
                PushValue(value);
                JSNative.SetProperty(NativePtr);
            }
        }

        public int IndexOf(T item)
        {
            PushValue(item);
            return (int) Acquire<JSNumber>(JSNative.CallMethod(NativePtr, "indexOf")).ToNumber();
        }

        public void Insert(int index, T item)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(0);
            PushValue(item);
            Acquire(JSNative.CallMethod(NativePtr, "push"));
        }

        public void RemoveAt(int index)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(1);
            Acquire(JSNative.CallMethod(NativePtr, "splice"));
        }

        public void Add(T obj)
        {
            PushValue(obj);
            Acquire(JSNative.CallMethod(NativePtr, "push"));
        }

        public void Clear()
        {
            JSNative.PushString("length");
            JSNative.PushNumber(0);
            JSNative.SetProperty(NativePtr);
        }

        public bool Contains(T item)
        {
            return IndexOf(item) > -1;
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            for(var i = 0; i < Count; i++)
                array[arrayIndex++] = this[i];
        }

        public bool Remove(T item)
        {
            var i = IndexOf(item);
            if(i > -1)
            {
                RemoveAt(i);
                return true;
            }

            return false;
        }

        public IEnumerator<T> GetEnumerator()
        {
            for(var i = 0; i < Count; i++)
                yield return this[i];
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        private void PushValue(T value)
        {
            if (JSNative.IsPrimitive(typeof(T)))
                JSNative.PushPrimitive(value);
            else
                JSNative.PushObject((value as JSRef).NativePtr);
        }
    }
}