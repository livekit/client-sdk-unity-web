using System.Diagnostics;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace LiveKit
{
    internal static class Log
    {
        private const string LK_DEBUG = "LK_DEBUG";

        [Conditional(LK_DEBUG)]
        public static void Info(object msg)
        {
            Debug.unityLogger.Log(LogType.Log, $"LKBridge: {msg}");
        }
    }
}