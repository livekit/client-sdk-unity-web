using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSMap<TKey, TValue> : JSObject, IDictionary<TKey, TValue>
    {
        public ICollection<TKey> Keys
        {
            get 
            {
                var keys = JSNative.CallMethod(NativePtr, "keys");
                
                JSNative.PushString("Array");
                var array = JSNative.GetProperty(JSHandle.Zero);

                JSNative.PushObject(keys);
                return Acquire<JSArray<TKey>>(JSNative.CallMethod(array, "from"));
            }
        }

        public ICollection<TValue> Values
        {
            get
            {
                var values = JSNative.CallMethod(NativePtr, "values");

                JSNative.PushString("Array");
                var array = JSNative.GetProperty(JSHandle.Zero);

                JSNative.PushObject(values);
                return Acquire<JSArray<TValue>>(JSNative.CallMethod(array, "from"));
            }
        }

        public int Count
        {
            get
            {
                JSNative.PushString("size");
                var ptr = Acquire<JSNumber>(JSNative.GetProperty(NativePtr));
                return (int)ptr.ToNumber();
            }
        }

        public bool IsReadOnly => false;

        public TValue this[TKey key] 
        {
            get
            {
                if (!ContainsKey(key))
                    throw new KeyNotFoundException();

                PushKey(key);
                var ptr = AcquireOrNull(JSNative.CallMethod(NativePtr, "get"));
                if (ptr == null)
                    return default;

                if(JSNative.IsPrimitive(typeof(TValue)))
                    return (TValue) JSNative.GetPrimitive(ptr.NativePtr);

                return (TValue)(object)ptr;
            }
            set
            {
                PushKey(key);
                PushValue(value);
                JSNative.CallMethod(NativePtr, "set");
            }
        }

        public JSMap()
        {
            JSNative.NewInstance(JSHandle.Zero, NativePtr, "Map");
        }

        [Preserve]
        public JSMap(JSHandle ptr) : base(ptr)
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
            PushKey(key);
            return Acquire<JSBoolean>(JSNative.CallMethod(NativePtr, "has")).ToBool();
        }

        public bool Remove(TKey key)
        {
            PushKey(key);
            return Acquire<JSBoolean>(JSNative.CallMethod(NativePtr, "delete")).ToBool();
        }

        public bool TryGetValue(TKey key, out TValue value)
        {
            if (!ContainsKey(key))
            {
                value = default(TValue);
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
            JSNative.CallMethod(NativePtr, "clear");
        }

        public bool Contains(KeyValuePair<TKey, TValue> item)
        {
            if(TryGetValue(item.Key, out var cref))
                return cref.Equals(item.Value);

            return false;
        }

        public void CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex)
        {
            foreach (var p in this)
                array[arrayIndex++] = p;
        }

        public bool Remove(KeyValuePair<TKey, TValue> item)
        {
            if (TryGetValue(item.Key, out TValue v) && item.Value.Equals(v))
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

        private void PushKey(TKey key)
        {
            if (JSNative.IsPrimitive(typeof(TKey)))
                JSNative.PushPrimitive(key);
            else
                JSNative.PushObject((key as JSRef).NativePtr);
        }

        private void PushValue(TValue value)
        {
            if (JSNative.IsPrimitive(typeof(TValue)))
                JSNative.PushPrimitive(value);
            else
                JSNative.PushObject((value as JSRef).NativePtr);
        }
    }
}