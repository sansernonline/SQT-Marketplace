# Common application packaging patterns

Recognizing the packaging leads straight to the readable layer. Check these before touching a decompiler.

## Mozilla apps (Firefox, Thunderbird)

- Full Windows installer is a **7-Zip SFX stub** (small PE32, sections=3) with the app in an appended archive. `7z x setup.exe` extracts `core/` plus `setup.exe`.
- `core/application.ini` — version, BuildID, source repository and SourceStamp (build provenance evidence).
- `core/omni.ja` — ZIP archive (97MB+ for Thunderbird) holding nearly all app JavaScript (`modules/`, `chrome/`) and default prefs (`defaults/pref/*.js`). Extract with 7z; Grep it to trace features. `omni.ja` is usually the cheapest route to full answers.
- The big DLLs are the native layer: `xul.dll` (Gecko engine), `nss3.dll`/`freebl3.dll` (crypto), `rnp.dll` (OpenPGP), `libotr.dll` (chat encryption).
- `thunderbird.exe` itself is only a launcher stub.

## Electron / Node apps

- `app.asar` — ASAR archive; `npx asar extract app.asar outdir`. Renderer JS is often minified but readable; `.map` source maps may contain original source.
- `resources/app/package.json` names the app, entry point, and dependency list.
- Native modules: `*.node` files (PE DLLs) — treat as native binaries.

## .NET applications

- PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd <dll>` or ILSpy gives near-original C#.
- Check for bundled/single-file deployment (self-extracting extractors) — extract first.
- P/Invoke declarations map managed code to native DLL entry points.

## Android APK

- ZIP; contains `classes.dex` (Dalvik bytecode — use `jadx` or `apktool` for near-Java output), `AndroidManifest.xml` (binary XML — use `apktool` or `aapt`), `resources.arsc`, native libs under `lib/`.

## Windows installers generally

- 7-Zip SFX: extract with `7z x`.
- NSIS: extract with `7z x` (triage detects `NullsoftInstall` marker).
- MSI: `msiexec /a file.msi /qb TARGETDIR=<out>` or 7z.
- MSI transforms and stub downloaders may contain no payload — identify early to avoid wasted work.
