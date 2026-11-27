# Common app packaging patterns

Once you know how an app is packed, you can go straight to the layer you can read. Check this page before opening a decompiler. Every command here **only reads or extracts files**, except those marked **ask first** (see the permission table in `SKILL.md` §2).

## Mozilla apps (Firefox · Thunderbird)

- The full Windows installer is a **7-Zip SFX stub** (a small PE32 with 3 sections) with the app archive appended at the end. `7z x setup.exe` gives `core/` and `setup.exe`.
- `core/application.ini` — version · BuildID · source repository · SourceStamp (evidence of which source it was built from)
- `core/omni.ja` — a ZIP file (97 MB or more for Thunderbird) holding almost all of the app's JavaScript (`modules/` · `chrome/`) and the defaults (`defaults/pref/*.js`). Extract it with 7z, then Grep for the feature. `omni.ja` is often the cheapest route to a full answer.
- The large DLLs are the native layer: `xul.dll` (Gecko engine) · `nss3.dll`/`freebl3.dll` (cryptography) · `rnp.dll` (OpenPGP) · `libotr.dll` (chat encryption)
- `thunderbird.exe` is only a launcher stub.

## Electron / Node apps

- `app.asar` — an ASAR archive. Use `python -I scripts/asar_extract.py extract app.asar outdir` (see javascript-electron.md). Renderer-side JS is usually minified but still readable. A `.map` file (source map) may hold the original source (`scripts/sourcemap_list.py`).
- `resources/app/package.json` gives the app name · the start point · the dependency list.
- Native modules: `*.node` files (these are PE DLLs) — treat them as native binaries.

## .NET apps

- A PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd -p -o <out> <dll>` gives a C# project close to the original. Tried on real work: the logic matched, all SQL was present, and only the comments and local variable names were lost.
- A `.pdb` next to the dll restores the original file names and line numbers. A `.dll.config` holds settings (and often secrets).
- ASP.NET MVC with precompiled views: each `.cshtml` comes back as a class under `<Assembly>.Views.<Controller>`.
- Xamarin APK: the C# code sits in `assemblies/*.dll` inside the APK (sometimes LZ4-compressed as `XALZ`). Decompile these files, not `classes.dex`.
- Check whether it is a bundled or single-file deployment (it unpacks itself at run time). If so, extract it first.
- A P/Invoke declaration tells you which function in a native DLL the managed code calls.

## Android APK

- A ZIP. It holds `classes.dex` (Dalvik bytecode — `jadx` or `apktool` gives code close to Java) · `AndroidManifest.xml` (binary XML — `scripts/apk_inventory.py` can decode it, otherwise use `apktool` or `aapt2`) · `resources.arsc` · native libraries under `lib/`

## Common Windows installers

- 7-Zip SFX: extract with `7z x`
- NSIS: extract with `7z x` (triage finds the `NullsoftInstall` marker)
- MSI: **try `7z x file.msi` or `lessmsi x file.msi <out>\` first.** These only read the file and never call Windows Installer. `msiexec /a file.msi /qb TARGETDIR=<out>` (administrative install) is **ask first**, because it runs Windows Installer on the user's machine (say what you will run and on which file). For a file of unknown origin, run it only in `infra-and-deploy`.
- An MSI transform, or a stub that downloads the real payload later, may have no payload at all. Learn this at the start so you do not waste effort.

## Organisation report files and ETL (Extract-Transform-Load) files

These are often the only place where the calculation formulas live. You do not need a decompiler at all.

| File | What it is | Layer you can read |
|---|---|---|
| `.rpt` Crystal Reports | OLE compound file | `strings` shows the SQL, table names and fields. For formulas, use Crystal Designer or export with RptToXml |
| `.pbix` Power BI | ZIP | `Report/Layout` is UTF-16 JSON (page and visual filters). Measures in `DataModel` need pbi-tools or Tabular Editor |
| `.dtsx` SQL Server Integration Services (SSIS) | XML | Search for `SqlCommand` · `ConnectionManager` · `DTS:ObjectName`. The package order is in the master package |
| `.rdl` SQL Server Reporting Services (SSRS) | XML | The `CommandText` of each dataset |
| `.mdb` / `.accdb` | Access database | Queries and VBA modules. Open with mdbtools or Access |
