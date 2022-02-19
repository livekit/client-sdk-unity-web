using System;
using System.Linq;
using System.Runtime.Serialization;

namespace LiveKit
{

    internal class Utils
    {
        public static string ToEnumString<T>(T type)
        {
            var eType = typeof(T);
            var name = Enum.GetName(eType, type);
            var attributes = ((EnumMemberAttribute[]) eType.GetField(name).GetCustomAttributes(typeof(EnumMemberAttribute), true)).Single();
            return attributes.Value;
        }

        public static T ToEnum<T>(string str)
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
    }
}