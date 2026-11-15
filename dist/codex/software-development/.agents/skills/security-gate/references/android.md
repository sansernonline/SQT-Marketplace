# Android checklist — used by `security-gate` step 2

**Android checklist** — Read the merged `AndroidManifest.xml`, not just the source file, because plugins add permissions on their own. The folder changes with the Android Gradle Plugin (AGP) version (`merged_manifests/<variant>/` or `merged_manifest/<variant>/process<Variant>MainManifest/` — `ยังไม่ได้ตรวจ`). After a release build, find it with `find build -path '*merged_manifest*' -name AndroidManifest.xml`.
- `android:exported` — only the main activity may be `true`. Every other component needs a stated reason.
- `android:allowBackup` / `dataExtractionRules` — state clearly which data may be backed up. Do not leave the defaults.
- `android:debuggable` must not appear in release, and `usesCleartextTraffic` must not be `true`.
- Request only the permissions the app really uses. An offline app must not have `INTERNET`, and you must also check the permissions plugins added.
- `key.properties` · `*.jks` · `*.keystore` must not be in git (run `git ls-files` and search the output).
