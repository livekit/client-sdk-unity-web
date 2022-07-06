using System.Diagnostics;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace LiveKit
{
    internal static class Log
    {
        private const string PREFIX = "LKBridge:";
        private const string LK_DEBUG = "LK_DEBUG";

        [Conditional(LK_DEBUG)]
        public static void Debug(object msg)
        {
            UnityEngine.Debug.unityLogger.Log(LogType.Log, $"{PREFIX} {msg}");
        }
        
        [Conditional(LK_DEBUG)]
        public static void DebugHandle(JSRef reff)
        {
            Utils.PrintHandle(reff);
        }
        
        public static void Error(object msg)
        {
            UnityEngine.Debug.unityLogger.Log(LogType.Error, $"{PREFIX} {msg}");
        }
    }
}