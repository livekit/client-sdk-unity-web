using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Scripting;

namespace LiveKit.E2E
{
    // Runs inside the WebGL player, so C# -> JS bridge -> livekit-client -> server is exercised for real.
    // Tests/e2e/run.mjs opens the page with ?url=&room=&tokenA=&tokenB= and parses the "[E2E] ..." console lines.
    public class E2ERunner : MonoBehaviour
    {
        const string Prefix = "[E2E]";
        const string IdentityA = "unity-a"; // must match run.mjs
        const string IdentityB = "unity-b";
        const float DefaultTimeout = 20f;

        string _url, _roomName, _tokenA, _tokenB;
        Room _roomA, _roomB;
        string _unexpectedException;
        int _passed, _failed;

        [Preserve]
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Boot()
        {
#if !UNITY_EDITOR && UNITY_WEBGL
            var go = new GameObject("LiveKitE2E");
            DontDestroyOnLoad(go);
            go.AddComponent<E2ERunner>();
#endif
        }

        IEnumerator Start()
        {
            Application.logMessageReceived += OnLog;

            var query = ParseQuery(Application.absoluteURL);
            query.TryGetValue("url", out _url);
            query.TryGetValue("room", out _roomName);
            query.TryGetValue("tokenA", out _tokenA);
            query.TryGetValue("tokenB", out _tokenB);

            if (string.IsNullOrEmpty(_url) || string.IsNullOrEmpty(_tokenA) || string.IsNullOrEmpty(_tokenB))
            {
                Debug.Log($"{Prefix} FAIL Setup 0.00s :: missing url/tokenA/tokenB query parameters");
                Debug.Log($"{Prefix} DONE passed=0 failed=1");
                yield break;
            }

            // Tests share rooms and run in order: A connects, B joins, B sends data to A, B leaves.
            yield return Run(nameof(ConnectWithInvalidTokenFails), ConnectWithInvalidTokenFails);
            yield return Run(nameof(ConnectSucceeds), ConnectSucceeds);
            yield return Run(nameof(RemoteParticipantJoinIsSeen), RemoteParticipantJoinIsSeen);
            yield return Run(nameof(PublishDataIsReceived), PublishDataIsReceived);
            yield return Run(nameof(DisconnectIsSeen), DisconnectIsSeen);

            Debug.Log($"{Prefix} DONE passed={_passed} failed={_failed}");
        }

        // ---------- Tests ----------

        IEnumerator ConnectWithInvalidTokenFails()
        {
            var room = new Room();
            var op = room.Connect(_url, "not-a-valid-token");
            yield return WaitFor(() => op.IsDone);

            Check(op.IsDone, "Connect with an invalid token never completed");
            Check(op.IsError, "Connect with an invalid token succeeded");
            Check(op.Error != null, "ConnectOperation.Error is null after a failed connect");
            Debug.Log($"{Prefix} INFO invalid token error: {op.Error.Message}");
            room.Disconnect();
        }

        IEnumerator ConnectSucceeds()
        {
            _roomA = new Room();
            var op = _roomA.Connect(_url, _tokenA);
            yield return WaitFor(() => op.IsDone);

            Check(op.IsDone, "Connect timed out");
            Check(!op.IsError, $"Connect failed: {op.Error?.Message}");
            Equal(ConnectionState.Connected, _roomA.State, "room A state");
            Equal(IdentityA, _roomA.LocalParticipant.Identity, "room A local identity");
            Equal(_roomName, _roomA.Name, "room A name");
        }

        IEnumerator RemoteParticipantJoinIsSeen()
        {
            Check(_roomA != null && _roomA.State == ConnectionState.Connected, "room A is not connected");

            string joined = null;
            Room.ParticipantConnectedDelegate onJoined = p => joined = p.Identity;
            _roomA.ParticipantConnected += onJoined;

            _roomB = new Room();
            var op = _roomB.Connect(_url, _tokenB);
            yield return WaitFor(() => op.IsDone);
            Check(op.IsDone && !op.IsError, $"room B connect failed: {op.Error?.Message ?? "timed out"}");

            yield return WaitFor(() => joined != null);
            _roomA.ParticipantConnected -= onJoined;

            Equal(IdentityB, joined, "identity from room A's ParticipantConnected");
            Check(_roomB.GetParticipantByIdentity(IdentityA) != null, $"room B can't find {IdentityA}");
        }

        IEnumerator PublishDataIsReceived()
        {
            Check(_roomB != null && _roomB.State == ConnectionState.Connected, "room B is not connected");

            var sent = $"hello from {IdentityB} {Guid.NewGuid()}";
            string received = null, topic = null, sender = null;
            Room.DataReceivedDelegate onData = (data, participant, kind, t) =>
            {
                received = Encoding.UTF8.GetString(data);
                topic = t;
                sender = participant?.Identity;
            };
            _roomA.DataReceived += onData;

            var publish = _roomB.LocalParticipant.PublishData(Encoding.UTF8.GetBytes(sent), true, new[] { IdentityA }, "e2e");
            yield return WaitFor(() => publish.IsDone);
            Check(publish.IsDone && !publish.IsError, "PublishData failed or timed out");

            yield return WaitFor(() => received != null);
            _roomA.DataReceived -= onData;

            Equal(sent, received, "payload");
            Equal("e2e", topic, "topic");
            Equal(IdentityB, sender, "sender identity");
        }

        IEnumerator DisconnectIsSeen()
        {
            Check(_roomB != null, "room B was never created");

            string left = null;
            var bDisconnected = false;
            Room.ParticipantDisconnectedDelegate onLeft = p => left = p.Identity;
            _roomA.ParticipantDisconnected += onLeft;
            _roomB.Disconnected += _ => bDisconnected = true;

            _roomB.Disconnect();
            yield return WaitFor(() => left != null && bDisconnected);
            _roomA.ParticipantDisconnected -= onLeft;

            Check(bDisconnected, "room B never raised Disconnected");
            Equal(ConnectionState.Disconnected, _roomB.State, "room B state");
            Equal(IdentityB, left, "identity from room A's ParticipantDisconnected");

            _roomA.Disconnect();
            yield return WaitFor(() => _roomA.State == ConnectionState.Disconnected);
            Equal(ConnectionState.Disconnected, _roomA.State, "room A state");
        }

        // ---------- Mini test harness ----------

        // Steps the test by hand so exceptions thrown between yields fail the test instead of killing the runner.
        IEnumerator Run(string name, Func<IEnumerator> test)
        {
            Debug.Log($"{Prefix} START {name}");
            var start = Time.realtimeSinceStartup;
            _unexpectedException = null;
            string error = null;

            IEnumerator body = null;
            try { body = test(); }
            catch (Exception e) { error = Describe(e); }

            while (error == null)
            {
                bool hasNext;
                try { hasNext = body.MoveNext(); }
                catch (Exception e) { error = Describe(e); break; }

                if (!hasNext) break;
                yield return body.Current;
            }

            // Exceptions inside SDK event callbacks are only logged, so surface them here.
            error ??= _unexpectedException;

            var seconds = (Time.realtimeSinceStartup - start).ToString("0.00");
            if (error == null)
            {
                _passed++;
                Debug.Log($"{Prefix} PASS {name} {seconds}s");
            }
            else
            {
                _failed++;
                Debug.Log($"{Prefix} FAIL {name} {seconds}s :: {error.Replace('\n', ' ').Replace('\r', ' ')}");
            }
        }

        static IEnumerator WaitFor(Func<bool> condition, float timeout = DefaultTimeout)
        {
            var deadline = Time.realtimeSinceStartup + timeout;
            while (!condition() && Time.realtimeSinceStartup < deadline)
                yield return null;
        }

        void OnLog(string message, string stackTrace, LogType type)
        {
            if (type == LogType.Exception && _unexpectedException == null)
                _unexpectedException = $"unhandled exception: {message}";
        }

        static void Check(bool condition, string message)
        {
            if (!condition) throw new E2EAssertionException(message);
        }

        static void Equal<T>(T expected, T actual, string what)
        {
            if (!EqualityComparer<T>.Default.Equals(expected, actual))
                throw new E2EAssertionException($"{what}: expected '{expected}', got '{actual}'");
        }

        static string Describe(Exception e) =>
            e is E2EAssertionException ? e.Message : $"{e.GetType().Name}: {e.Message}";

        static Dictionary<string, string> ParseQuery(string url)
        {
            var result = new Dictionary<string, string>();
            var q = url.IndexOf('?');
            if (q < 0) return result;

            var query = url.Substring(q + 1);
            var hash = query.IndexOf('#');
            if (hash >= 0) query = query.Substring(0, hash);

            foreach (var pair in query.Split('&'))
            {
                if (pair.Length == 0) continue;
                var eq = pair.IndexOf('=');
                var key = eq < 0 ? pair : pair.Substring(0, eq);
                var value = eq < 0 ? "" : pair.Substring(eq + 1);
                result[Uri.UnescapeDataString(key.Replace('+', ' '))] = Uri.UnescapeDataString(value.Replace('+', ' '));
            }
            return result;
        }

        class E2EAssertionException : Exception
        {
            public E2EAssertionException(string message) : base(message) { }
        }
    }
}
