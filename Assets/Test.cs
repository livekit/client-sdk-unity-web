using UnityEngine;
using System;
using System.Runtime.InteropServices;
using AOT;
using UnityEngine.UI;

public class Test : MonoBehaviour
{
    private static Test t;
    public RawImage RawImage;

    [DllImport("__Internal")]
    private static extern void Connect(string url, string token, Action<int> callback);

    [MonoPInvokeCallback(typeof(Action<int>))]
    public static void CallbackTexture(int id){
        Debug.Log($"Texture found {id}");
        var tex = Texture2D.CreateExternalTexture(200, 200, TextureFormat.RGBA32, false, false, new System.IntPtr(id));

        t.RawImage.texture = tex;
    }

    void Start() {
        t = this;
        Connect("ws://localhost:7880", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDU2MzEyMzUsImlzcyI6IkFQSU1mNERxRW40VHFjWCIsImp0aSI6InBhcnRpY2lwYW50MiIsIm5iZiI6MTY0MzAzOTIzNSwic3ViIjoicGFydGljaXBhbnQyIiwidmlkZW8iOnsicm9vbSI6InRlc3Ryb29tIiwicm9vbUpvaW4iOnRydWV9fQ.Wf-IzjPu2lbov2QdfphNKtCKDN4Srcv8OHd6QjFXVo0", CallbackTexture);
    }
}
