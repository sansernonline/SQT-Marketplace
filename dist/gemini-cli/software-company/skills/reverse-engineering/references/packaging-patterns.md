# Common application packaging patterns

Recognizing the packaging leads straight to the readable layer. Check these before touching a decompiler.

## Mozilla apps (Firefox, Thunderbird)

- Full Windows installer is a **7-Zip SFX stub** (small PE32, sections=3) with the app in an appended archive. `7z x setup.exe` extracts `core/` plus `setup.exe`.
- `core/application.ini` — version, BuildID, source repository and SourceStamp (build provenance evidence).
- `core/omni.ja` — ZIP archive (97MB+ for Thunderbird) holding nearly all app JavaScript (`modules/`, `chrome/`) and default prefs (`defaults/pref/*.js`). Extract with 7z; Grep it to trace features. `omni.ja` is usually the cheapest route to full answers.
- The big DLLs are the native layer: `xul.dll` (Gecko engine), `nss3.dll`/`freebl3.dll` (crypto), `rnp.dll` (OpenPGP), `libotr.dll` (chat encryption).
- `thunderbird.exe` itself is only a launcher stub.

## Electron / Node apps

- `app.asar` — ASAR archive; `npx @electron/asar extract app.asar outdir` (the old `asar` package name is deprecated). Renderer JS is often minified but readable; `.map` source maps may contain original source.
- `resources/app/package.json` names the app, entry point, and dependency list.
- Native modules: `*.node` files (PE DLLs) — treat as native binaries.

## .NET applications

- PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd -p -o <out> <dll>` gives a near-original C# project — field-tested: identical logic, SQL strings intact, only comments and local names lost.
- A `.pdb` beside the dll restores original file names and line numbers; a `.dll.config` holds settings (and often secrets).
- ASP.NET MVC with precompiled views: `.cshtml` come back as classes under `<Assembly>.Views.<Controller>`.
- Xamarin APK: the C# lives in `assemblies/*.dll` inside the APK (sometimes LZ4-compressed `XALZ`) — decompile those, not `classes.dex`.
- Check for bundled/single-file deployment (self-extracting extractors) — extract first.
- P/Invoke declarations map managed code to native DLL entry points.

## Android APK

- ZIP; contains `classes.dex` (Dalvik bytecode — use `jadx` or `apktool` for near-Java output), `AndroidManifest.xml` (binary XML — use `apktool` or `aapt`), `resources.arsc`, native libs under `lib/`.

## Windows installers generally

- 7-Zip SFX: extract with `7z x`.
- NSIS: extract with `7z x` (triage detects `NullsoftInstall` marker).
- MSI: `msiexec /a file.msi /qb TARGETDIR=<out>` or 7z.
- MSI transforms and stub downloaders may contain no payload — identify early to avoid wasted work.

## Enterprise report and ETL files

Often the only place a calculation lives. None need a decompiler.

| File | What it is | Readable layer |
|---|---|---|
| `.rpt` Crystal Reports | OLE compound file | `strings` shows SQL, table and field names; formulas need Crystal Designer or an RptToXml export |
| `.pbix` Power BI | ZIP | `Report/Layout` is UTF-16 JSON (pages, visuals, filters); measures in `DataModel` need pbi-tools or Tabular Editor |
| `.dtsx` SSIS | XML | Search `SqlCommand`, `ConnectionManager`, `DTS:ObjectName`; package order in the master package |
| `.rdl` SSRS | XML | `CommandText` per dataset |
| `.mdb` / `.accdb` | Access database | Queries and VBA modules; open with mdbtools or Access |
