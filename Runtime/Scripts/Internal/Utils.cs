using System;
using System.Linq;
using System.Runtime.Serialization;

namespace LiveKit
{
    public class Utils
    {
        internal static string ToEnumString<T>(T type)
        {
            var eType = typeof(T);
            var name = Enum.GetName(eType, type);
            var attributes = ((EnumMemberAttribute[]) eType.GetField(name).GetCustomAttributes(typeof(EnumMemberAttribute), true)).Single();
            return attributes.Value;
        }

        internal static T ToEnum<T>(string str)
        {
            var eType = typeof(T);
            foreach (var name in Enum.GetNames(eType))
            {
                var attributes = ((EnumMemberAttribute[]) eType.GetField(name).GetCustomAttributes(typeof(EnumMemberAttribute), true)).Single();
                if (attributes.Value == str)
                    return (T) Enum.Parse(eType, name);
            }

            throw new NullReferenceException("Enum not found");
        }
        
        internal static bool IsNumber(Type type)
        {
            switch (Type.GetTypeCode(type))
            {
                case TypeCode.Byte:
                case TypeCode.SByte:
                case TypeCode.UInt16:
                case TypeCode.UInt32:
                case TypeCode.UInt64:
                case TypeCode.Int16:
                case TypeCode.Int32:
                case TypeCode.Int64:
                case TypeCode.Decimal:
                case TypeCode.Double:
                case TypeCode.Single:
                    return true;
                default:
                    return false;
            }
        }

        public static void PrintHandle(JSHandle handle)
        {
            JSNative.PushString("console");
            var console = JSNative.GetProperty(JSNative.Window);
            
            JSNative.PushObject(handle);
            JSNative.CallMethod(console, "log");
        }
        
        public static void PrintHandle(JSRef reff)
        {
            PrintHandle(reff.NativeHandle);
        }
    }
}