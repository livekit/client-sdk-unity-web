using AOT;
using System;
using System.Runtime.InteropServices;
using UnityEngine;


/*
 * This script is only used as a workaround for copying and pasting text into text fields,
 * as it is not supported by Unity on the WebGL platform. You can ignore it 
 */
public class CopyPaste
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterAssembliesLoaded)]
    private static void Init()
    {
        InitCopyPaste(PasteReceived);
    }

    [MonoPInvokeCallback(typeof(Action<string>))]
    private static void PasteReceived(string data)
    {
        GUIUtility.systemCopyBuffer = data;
    }

    [DllImport("__Internal")]
    internal static extern void InitCopyPaste(Action<string> action);
}
