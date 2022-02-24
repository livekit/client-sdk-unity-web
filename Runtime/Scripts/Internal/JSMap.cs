using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSMap<TKey, TValue> : JSRef, IDictionary<TKey, TValue> where TKey : JSRef where TValue : JSRef
    {
        public ICollection<TKey> Keys
        {
            get 
            {
                var keys = Acquire(JSNative.CallMethod(NativePtr, "keys"));
                
                JSNative.PushString("Array");
                var array = Acquire(JSNative.GetProperty(IntPtr.Zero));

                JSNative.PushObject(keys.NativePtr);
                return Acquire<JSArray<TKey>>(JSNative.CallMethod(array.NativePtr, "from"));
            }
        }

        public ICollection<TValue> Values
        {
            get
            {
                var values = Acquire(JSNative.CallMethod(NativePtr, "values"));

                JSNative.PushString("Array");
                var array = Acquire(JSNative.GetProperty(IntPtr.Zero));

                JSNative.PushObject(values.NativePtr);
                return Acquire<JSArray<TValue>>(JSNative.CallMethod(array.NativePtr, "from"));
            }
        }

        public int Count
        {
            get
            {
                JSNative.PushString("size");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativePtr));
            }
        }

        public bool IsReadOnly => false;

        public TValue this[TKey key] 
        {
            get
            {
                if (!ContainsKey(key))
                    throw new KeyNotFoundException();

                JSNative.PushObject(key.NativePtr);
                return Acquire<TValue>(JSNative.CallMethod(NativePtr, "get"));
            }
            set
            {
                JSNative.PushObject(key.NativePtr);
                JSNative.PushObject(value.NativePtr);
                Acquire(JSNative.CallMethod(NativePtr, "set"));
            }
        }

        public JSMap() : this(JSNative.NewRef())
        {
            JSNative.NewInstance(IntPtr.Zero, NativePtr, "Map");
        }


        [Preserve]
        public JSMap(IntPtr ptr) : base(ptr)
        {

        }

        public void Add(TKey key, TValue value)
        {
            if(ContainsKey(key)) 
                throw new ArgumentException("Key already exits");

            this[key] = value;
        }

        public bool ContainsKey(TKey key)
        {
            JSNative.PushObject(key.NativePtr);
            var cref = Acquire(JSNative.CallMethod(NativePtr, "has"));
            return JSNative.GetBool(cref.NativePtr);
        }

        public bool Remove(TKey key)
        {
            JSNative.PushObject(key.NativePtr);
            var cref = Acquire(JSNative.CallMethod(NativePtr, "delete"));
            return JSNative.GetBool(cref.NativePtr);
        }

        public bool TryGetValue(TKey key, out TValue value)
        {
            if (!ContainsKey(key))
            {
                value = null;
                return false;
            }

            value = this[key];
            return true;
        }

        public void Add(KeyValuePair<TKey, TValue> item)
        {
            Add(item.Key, item.Value);
        }

        public void Clear()
        {
            Acquire(JSNative.CallMethod(NativePtr, "clear"));
        }

        public bool Contains(KeyValuePair<TKey, TValue> item)
        {
            if(TryGetValue(item.Key, out var cref))
                return cref == item.Value;

            return false;
        }

        public void CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex)
        {
            foreach (var p in this)
                array[arrayIndex++] = p;
        }

        public bool Remove(KeyValuePair<TKey, TValue> item)
        {
            if (TryGetValue(item.Key, out TValue v) && item.Value == v)
                return Remove(item.Key);

            return false;
        }

        public IEnumerator<KeyValuePair<TKey, TValue>> GetEnumerator()
        {
            foreach(var k in Keys)
                yield return new KeyValuePair<TKey, TValue>(k, this[k]);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}