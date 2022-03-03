using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using LiveKit;
using UnityEngine.SceneManagement;

public class JoinMenu : MonoBehaviour
{
    public static string LivekitURL { get; private set; }
    public static string RoomToken { get; private set; }

    private LocalVideoTrack m_PreviewTrack;
    public RawImage PreviewCamera;
    public InputField URLField;
    public InputField TokenField;
    public Button ConnectButton;

    void Start()
    {
        StartCoroutine(StartPreviewCamera());

        ConnectButton.onClick.AddListener(() =>
        {
            LivekitURL = URLField.text;
            RoomToken = TokenField.text;

            if (string.IsNullOrWhiteSpace(RoomToken))
                return;

            m_PreviewTrack?.Detach();
            m_PreviewTrack?.Stop();
            SceneManager.LoadScene("RoomScene", LoadSceneMode.Single);
        });
    }

    private IEnumerator StartPreviewCamera()
    {
        var f = Client.CreateLocalVideoTrack();
        yield return f;

        if (f.IsError)
            yield break;

        m_PreviewTrack = f.ResolveValue;

        var video = m_PreviewTrack.Attach() as HTMLVideoElement;
        video.VideoReceived += tex =>
        {
            PreviewCamera.texture = tex;
        };
    }
}
