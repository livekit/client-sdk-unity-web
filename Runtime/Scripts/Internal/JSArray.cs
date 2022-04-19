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
            JSNative.NewInstance(JSNative.Window, NativePtr, "Array");
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
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
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
                var ptr = JSNative.GetProperty(NativePtr);
                if (JSNative.IsPrimitive(typeof(T)))
                    return (T) JSNative.GetPrimitive(ptr);
                
                return (T)(object) Acquire<JSRef>(ptr);
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
            return (int) JSNative.GetNumber(JSNative.CallMethod(NativePtr, "indexOf"));
        }

        public void Insert(int index, T item)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(0);
            PushValue(item);
            JSNative.CallMethod(NativePtr, "push");
        }

        public void RemoveAt(int index)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(1);
            JSNative.CallMethod(NativePtr, "splice");
        }

        public void Add(T obj)
        {
            PushValue(obj);
            JSNative.CallMethod(NativePtr, "push");
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