# WebGL end-to-end tests

Runs the SDK for real inside a WebGL player: C# → JS bridge → livekit-client → LiveKit server.
CI: `.github/workflows/webgl-e2e.yml`.

- `WebGLProject/` – minimal Unity project that references the package. `Assets/E2E/E2ERunner.cs` holds the tests
  and boots itself in the player; `Assets/Editor/E2EBuild.cs` generates a scene and builds WebGL.
- `e2e/run.mjs` – serves the build, mints tokens, opens it in headless Chromium and reports `[E2E] PASS/FAIL` lines.

## Run locally

```sh
# 1. Build (or open WebGLProject in Unity 2022.3 and use LiveKit > E2E > Build WebGL)
Unity -batchmode -quit -projectPath Tests~/WebGLProject -buildTarget WebGL \
  -executeMethod LiveKit.E2E.Editor.E2EBuild.Build -customBuildPath Build/WebGL

# 2. Start a dev server (devkey / secret on ws://localhost:7880)
livekit-server --dev

# 3. Run
cd Tests~/e2e && npm ci && npx playwright install chromium
LIVEKIT_URL=ws://localhost:7880 LIVEKIT_API_KEY=devkey LIVEKIT_API_SECRET=secret \
  node run.mjs ../WebGLProject/Build/WebGL
```

The runner defaults to the dev server, but `LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`
from your shell take precedence, so set them explicitly as above.

## Adding a test

Add an `IEnumerator` method to `E2ERunner` and a `yield return Run(nameof(MyTest), MyTest);` line in `Start()`.
Use `yield return WaitFor(() => condition);` for async work, then `Check(...)` / `Equal(...)`.
