using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSArray<T> : JSRef, IList<T> where T : JSRef
    {
        private object m_Lock = new object();

        [Preserve]
        public JSArray(IntPtr ptr) : base(ptr)
        {

        }

        public JSArray() : this(JSNative.NewRef())
        {
            JSNative.NewInstance(IntPtr.Zero, NativePtr, "Array");
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
            get {
                JSNative.PushNumber(index);
                var ptr = JSNative.GetProperty(NativePtr);
                if (ptr == IntPtr.Zero)
                    return null;

                return Acquire<T>(ptr);
            }
            set {
                JSNative.PushNumber(index);
                JSNative.PushObject(value.NativePtr);
                JSNative.SetProperty(NativePtr);
            }
        }

        public int IndexOf(T item)
        {
            JSNative.PushObject(item.NativePtr);
            return (int) JSNative.GetNumber(JSNative.CallMethod(NativePtr, "indexOf"));
        }

        public void Insert(int index, T item)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(0);
            JSNative.PushObject(item.NativePtr);
            JSNative.FreeRef(JSNative.CallMethod(NativePtr, "push"));
        }

        public void RemoveAt(int index)
        {
            JSNative.PushNumber(index);
            JSNative.PushNumber(1);
            JSNative.FreeRef(JSNative.CallMethod(NativePtr, "splice"));
        }

        public void Add(T obj)
        {
            JSNative.PushObject(obj.NativePtr);
            JSNative.FreeRef(JSNative.CallMethod(NativePtr, "push"));
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
    }
}