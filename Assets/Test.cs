using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class Test : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void Connect(string url, string token);

    void Start() {
        Connect("ws://localhost:7880", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDU2MzEyMzUsImlzcyI6IkFQSU1mNERxRW40VHFjWCIsImp0aSI6InBhcnRpY2lwYW50MiIsIm5iZiI6MTY0MzAzOTIzNSwic3ViIjoicGFydGljaXBhbnQyIiwidmlkZW8iOnsicm9vbSI6InRlc3Ryb29tIiwicm9vbUpvaW4iOnRydWV9fQ.Wf-IzjPu2lbov2QdfphNKtCKDN4Srcv8OHd6QjFXVo0");
    }
}
