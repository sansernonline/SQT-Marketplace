---
name: reverse-engineering
description: Use when there is a compiled app or unknown file but no usable source — lost source, a deployed build that may differ from the repository, or a feature, format or protocol to understand. Decompiles, traces and reports with evidence.
---

# Reverse Engineering

**Decompile → Understand → Recreate**, with evidence at every step. Never claim the original source was recovered; report what the evidence shows and mark what is unknown.

Source code is available but there are no documents → use `legacy-spec-recovery` instead. Once this skill has recovered readable code, `legacy-spec-recovery` turns it into a spec.

## What works in practice

Effort depends almost entirely on what the target was built with. Classify first, then set expectations with the user.

| Target | Result to expect | Effort | Route |
|---|---|---|---|
| .NET (C#, VB.NET, Xamarin) | Near-original source: same logic, same SQL strings; comments and local names lost | Minutes | `ilspycmd` |
| Java, Kotlin, Android | Near-original source | Minutes | jadx, CFR, Vineflower |
| JavaScript, Electron | The code itself, often minified; source maps may give the original | Minutes | unpack, beautify |
| Python `.pyc`, PyInstaller | Usually recoverable for Python ≤ 3.8, partial after | Hours | pyinstxtractor, decompyle3 / pycdc |
| Native C, C++, Go, Rust | Pseudo-C only; names gone unless symbols exist | Days per feature | strings → imports → Ghidra |
| Obfuscated or packed | Depends on the protector; can stop the job | Unknown | identify the tool first, then ask |

Field test (2026-10, ASP.NET MVC app of about 55,000 lines): `ilspycmd` produced a C# project of 51,700 lines in 9 seconds. Compared against the real source, a cancel method matched statement for statement, and all 1,431 methods matched by name.

## Safety and legality

- Analyse only software the user owns or is authorised to analyse: their own or their client's systems, licensed software where the licence allows it, CTF targets, malware samples in a sandbox.
- Do not help bypass licensing, DRM, activation or access controls in third-party software.
- **Secrets come out with the code.** Connection strings, passwords and API keys sit in decompiled code and `.config` files. Name them, never paste their values — `triage.py` masks them in its output.
- Malware: static analysis only, unless the user explicitly asks for dynamic analysis in an isolated environment.
- Work on copies in a scratch folder. Never write decompiled output into the user's source tree; it is not the source of record.

## Workflow

### Step 1 — Triage

```bash
python -I scripts/triage.py <file>                          # format, architecture, next step
python -I scripts/triage.py <file> --pattern 'oauth|WHT'    # hunt a clue in strings (secrets masked)
```

It recognises PE, .NET, ELF, Mach-O, APK, IPA, JAR, ASAR, Power BI, Office, OLE (Crystal Reports, MSI), SSIS and config XML. For a .NET assembly it also reports a `.pdb` or `.config` lying beside it and known obfuscator markers.

Installers (7-Zip SFX, NSIS, MSI): extract first — strings inside are compressed noise. Packaging layouts and report and ETL formats: [references/packaging-patterns.md](references/packaging-patterns.md).

Confirm what the user wants before deep work: explain one feature, recover a format or algorithm, recover lost source, or check a deployed build against the repository.

### Step 2 — Decompile, cheapest first

1. **Strings and metadata.** Often enough on their own. In the field test, SQL statements embedded in a .NET dll — including commented-out ones — came out of the strings alone.
2. **Managed code (.NET, Java)** — go straight to the decompiler; it is cheap.
   ```bash
   dotnet tool install ilspycmd --tool-path <scratch>/tools --version <x>
   <scratch>/tools/ilspycmd -p -o <scratch>/out <file.dll>
   ```
   The newest `ilspycmd` needs the newest .NET SDK. If installation fails with *"DotnetToolSettings.xml was not found"*, pin an older version that matches an installed SDK (`dotnet --list-sdks`); for example, 9.1.0.7988 works with SDK 9. Install into the scratch folder, not globally.
3. **JavaScript/Electron** — `npx @electron/asar extract app.asar <out>`, beautify, look for `.map` files.
4. **Native** — imports and exports first (they reveal crypto, network and storage use), then Ghidra headless for the functions that matter. On Windows, prefer Python and Node scripts over assuming Unix tools exist.

Record each finding as evidence: file, offset, type or method, and what it suggests.

### Step 3 — Understand

Trace from clue to implementation: who references the string, which function contains it, what flows in and out. Write a short narrative: "feature X works by A calling B, storing in C, gated by D". Keep static reading separate from runtime observation, and mark unresolved links instead of guessing.

### Step 4 — Use the result

| Goal | Do this |
|---|---|
| Explain a feature | Narrative + evidence list (Step 5) |
| Lost source | Decompiled project goes to the user as a recovery, clearly labelled; then `legacy-spec-recovery` for the spec |
| **Deployed build vs repository (drift check)** | Decompile the production binary, then `python -I scripts/compare_members.py <decompiled> <source>` — lists methods only in the binary (hot-fixes never committed) or only in the source (not deployed). Then diff the bodies of the methods it flags. |
| Recreate in the user's stack | Only after the user confirms the understanding. Reimplement, do not copy proprietary code; standard algorithms and formats (JSON, zlib, AES) are fine to reuse |

`compare_members.py` was field-tested both ways: on a matching build it reported 1,431 shared methods and no differences, and a method renamed in a copy of the source was caught.

### Step 5 — Report

- **How it works**: the narrative, with evidence locations.
- **Evidence**: each claim tied to a file, offset or method.
- **Unknowns**: what could not be determined and what would resolve it.
- **Secrets seen**: key names and locations only — and tell the user they should be rotated if the binary or config has left their control.
- **Output**: where the decompiled files are, and how to verify any recreated feature.

## Rules of thumb

- Cheapest sufficient evidence wins: strings > managed decompiler > native decompiler > debugger.
- Prefer static analysis; do not run unknown binaries.
- Decompiled code is evidence, not the source. Label it that way wherever it is handed over.
- If triage reports an obfuscator, stop and tell the user what that means for effort before going on.
