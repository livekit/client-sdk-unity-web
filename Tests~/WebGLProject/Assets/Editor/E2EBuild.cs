using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace LiveKit.E2E.Editor
{
    public static class E2EBuild
    {
        const string ScenePath = "Assets/E2E/E2E.unity";

        // CI entry point: game-ci/unity-builder calls this via `buildMethod` and passes -customBuildPath.
        // The scene is generated so no scene YAML has to be checked in; E2ERunner boots itself.
        [MenuItem("LiveKit/E2E/Build WebGL")]
        public static void Build()
        {
            var outputPath = GetArg("-customBuildPath") ?? "Build/WebGL";

            Directory.CreateDirectory(Path.GetDirectoryName(ScenePath));
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            EditorSceneManager.SaveScene(scene, ScenePath);

            PlayerSettings.runInBackground = true;
            // A plain static server can serve uncompressed files without Content-Encoding headers.
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            PlayerSettings.WebGL.decompressionFallback = false;
            PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.FullWithStacktrace;
            // Keep "[E2E]" lines readable; errors and exceptions still log stack traces.
            PlayerSettings.SetStackTraceLogType(LogType.Log, StackTraceLogType.None);
            PlayerSettings.SetStackTraceLogType(LogType.Warning, StackTraceLogType.None);

            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { ScenePath },
                locationPathName = outputPath,
                target = BuildTarget.WebGL,
                targetGroup = BuildTargetGroup.WebGL,
                options = BuildOptions.None,
            });

            var summary = report.summary;
            Debug.Log($"[E2EBuild] {summary.result} in {summary.totalTime}, {summary.totalErrors} errors -> {outputPath}");

            // Throwing makes Unity exit non-zero in batch mode, which fails the CI step.
            if (summary.result != BuildResult.Succeeded)
                throw new Exception($"WebGL build failed: {summary.result}");
        }

        static string GetArg(string name)
        {
            var args = Environment.GetCommandLineArgs();
            for (var i = 0; i < args.Length - 1; i++)
                if (args[i] == name)
                    return args[i + 1];
            return null;
        }
    }
}
