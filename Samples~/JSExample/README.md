# JSExample

## Build

1. Create a new Unity project with the LiveKit Unity SDK for WebGL (https://github.com/livekit/client-sdk-unity-web).
2. Copy the contents of this folder into the root of the `Assets` directory.
3. Build the javascript:
`(cd Assets/JSPackage\~/ && npm run build)`
4. In ProjectSettings > Player > WebGL > Resolution and Presentation, select the WebGL Template named "LiveKitDemoJS." If the WebGLTemplate template isn't detected, move the WebGLTemplates folder to the assets root directory.
5. In Build Settings, select the WebGL platform.
6. In Build Settings, add the JSExample scene to the "Scenes in Build" list.
7. Build the project!