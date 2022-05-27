using System;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine.Scripting;

namespace LiveKit
{
    public class JSMap<TKey, TValue> : JSObject, IDictionary<TKey, TValue>
    {
        public ICollection<TKey> Keys
        {
            get 
            {
                var keys = JSNative.CallMethod(NativeHandle, "keys");
                
                JSNative.PushString("Array");
                var array = JSNative.GetProperty(JSNative.Window);

                JSNative.PushObject(keys);
                return Acquire<JSArray<TKey>>(JSNative.CallMethod(array, "from"));
            }
        }

        public ICollection<TValue> Values
        {
            get
            {
                var values = JSNative.CallMethod(NativeHandle, "values");

                JSNative.PushString("Array");
                var array = JSNative.GetProperty(JSNative.Window);

                JSNative.PushObject(values);
                return Acquire<JSArray<TValue>>(JSNative.CallMethod(array, "from"));
            }
        }

        public int Count
        {
            get
            {
                JSNative.PushString("size");
                return (int) JSNative.GetNumber(JSNative.GetProperty(NativeHandle));
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
                var ptr = JSNative.CallMethod(NativeHandle, "get");
                var type = typeof(TValue);
                if(JSNative.IsPrimitive(type))
                    return (TValue) JSNative.GetPrimitive(ptr);

                if (type.IsValueType)
                    return JSNative.GetStruct<TValue>(ptr);
                
                return (TValue)(object) Acquire<JSRef>(ptr);
            }
            set
            {
                PushKey(key);
                PushValue(value);
                JSNative.CallMethod(NativeHandle, "set");
            }
        }

        public JSMap()
        {
            JSNative.NewInstance(JSNative.Window, NativeHandle, "Map");
        }

        [Preserve]
        internal JSMap(JSHandle handle) : base(handle)
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
            return JSNative.GetBoolean(JSNative.CallMethod(NativeHandle, "has"));
        }

        public bool Remove(TKey key)
        {
            PushKey(key);
            return JSNative.GetBoolean(JSNative.CallMethod(NativeHandle, "delete"));
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
            JSNative.CallMethod(NativeHandle, "clear");
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
            var type = typeof(TKey);
            if (JSNative.IsPrimitive(type))
                JSNative.PushPrimitive(key);
            else if(type.IsValueType)
                JSNative.PushStruct(JsonConvert.SerializeObject(key, JSNative.JsonSettings));
            else
                JSNative.PushObject((key as JSRef).NativeHandle);
        }

        private void PushValue(TValue value)
        {
            var type = typeof(TValue);
            if (JSNative.IsPrimitive(type))
                JSNative.PushPrimitive(value);
            else if(type.IsValueType)
                JSNative.PushStruct(JsonConvert.SerializeObject(value, JSNative.JsonSettings));
            else
                JSNative.PushObject((value as JSRef).NativeHandle);
        }
    }
}