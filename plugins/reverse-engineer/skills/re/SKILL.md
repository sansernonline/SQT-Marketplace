---
name: re
description: Reverse-engineer a feature from an app, binary, assembly, website or APK — evidence-first, then rebuild it.
argument-hint: <target path or URL> <feature to understand>
disable-model-invocation: true
---

Run the `reverse-engineer-analyst` agent starting from the `reverse-engineer` skill: **$ARGUMENTS**

1. Confirm the user owns the target or is authorized to examine it — ask once if unclear; stop if not authorized.
2. Classify the target and open the matching module (`analyze-js-electron` · `analyze-native-binary` · `analyze-website` · `analyze-dotnet` · `analyze-apk`).
3. Use REA (`npx rea-agents@latest`) as the engine when available; otherwise follow the module's manual static steps.
4. Every conclusion cites evidence (file, offset, string, request); inferences are marked `อนุมาน`; every report ends with a limitations section.
5. Explain how the feature works in plain language, then write a fresh implementation with tests that compare against the original's observed behavior.
