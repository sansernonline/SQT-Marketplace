---
name: reverse-engineering
description: "Use when asked to reverse engineer, decompile or disassemble an app with no source, find how a feature or protocol works \"under the hood\", analyze an unknown file, or \"how does X app do Y\" / \"ดูว่าแอปนี้ทำงานยังไง\"."
---

# Reverse Engineering

Investigation model (adapted from the REA project): **Decompile → Understand → Recreate**, with evidence recorded at every step. Never claim to recover original source code; report what the evidence actually shows and mark unknowns explicitly.

## Safety and legality

- Only analyze software and files the user owns or is authorized to analyze (their own apps, licensed software, CTF targets, malware samples in a sandbox).
- Do not help bypass licensing, DRM, activation checks, or access controls on third-party software.
- Do not exfiltrate data found inside binaries (credentials, keys) to third parties.
- Malware analysis: static-only unless the user explicitly asks for dynamic analysis in an isolated environment.

## Workflow

### Step 1 — Triage (identify the target)

Run `scripts/triage.py <target>` to identify the file type, architecture, entry hints, and extract useful strings. It recognizes PE (Windows), ELF (Linux), Mach-O (macOS), .NET/CLI, APK (ZIP), ASAR, plist, JavaScript, and generic binaries.

Classify the target first, because it determines the tool chain:

| Target kind | Typical forms | Main route |
|---|---|---|
| Native binary | PE, ELF, Mach-O | Strings → symbols → decompile |
| .NET / managed | `.exe`/`.dll` with CLI header | IL metadata → decompile (ILSpy) |
| JavaScript / Electron | `.js`, bundles, `.asar`, source maps | Static JS graph — usually the fastest route |
| Mobile | `.apk`, `.ipa` | Unpack first, then treat contents by kind |
| Web app / site | URL of the user's own site | Passive observation, bundle/source-map analysis |
| Unknown format | custom file | Hex/structure analysis, entropy, repeated patterns |

**Installers and stubs**: if triage reports a 7-Zip SFX or NSIS installer, do NOT analyze strings in it — they are compressed noise. Extract first (`7z x <file>`), then triage the real payload inside. For known packaging patterns (Mozilla `omni.ja`/`application.ini`, Electron ASAR, .NET bundles, APK layout), see [references/packaging-patterns.md](references/packaging-patterns.md).

Confirm what the user actually wants before deep work: explain a feature, recover an algorithm/format, or recreate the feature in their stack.

### Step 2 — Decompile (recover readable clues)

Work from cheapest to most expensive:

1. **Strings and metadata**: names, endpoints, constants, error messages. `scripts/triage.py --strings` for keyword-filtered output, or `scripts/triage.py --pattern '<regex>'` to hunt a specific clue (e.g. `--pattern 'oauth|autoconfig'`). Grep over extracted resources for text files.
2. **Symbols/imports/exports**: which APIs the binary calls (`imports`) reveal behavior (crypto, networking, storage).
3. **JavaScript/Electron**: unpack ASAR (`npx asar extract`), beautify bundles, read source maps (`.map` often contains original source). This frequently answers the whole question without touching native code.
4. **Managed (.NET)**: `ilspycmd` or ILSpy GUI to get near-original C#.
5. **Native deep analysis**: Ghidra (free, headless mode) or Hopper. Use when strings/symbols are not enough. On Windows, Ghidra headless + Python scripts is the reliable path.

For each interesting finding (a feature name, an endpoint, an algorithm string), record it as evidence: file, address/offset, and what it suggests.

### Step 3 — Understand (connect clues to code)

Trace from clue to implementation:

1. Find where the string/symbol is referenced (xrefs).
2. Find the function that contains the reference (callers/callees, control flow).
3. Decompile those functions; follow the data flow in and out.
4. Build a short narrative: "feature X works by A calling B, storing in C, gated by D."

Keep static inference and runtime observation separate — say which one each claim comes from. Mark unresolved links explicitly instead of guessing.

### Step 4 — Recreate (build the user's version)

Only after the user confirms the understanding is correct, implement the equivalent feature in their project using their normal file-editing and test tools. Adapt to their stack and requirements; do not copy code wholesale from proprietary binaries. If the original used a standard algorithm or format (JSON, protobuf, zlib, AES), linking against or reimplementing that standard is fine.

### Step 5 — Report

Deliver a structured summary:

- **How it works**: the narrative from Step 3, with evidence locations.
- **Evidence list**: each claim tied to a file/address/observation.
- **Unknowns**: what could not be determined and what would resolve it.
- **Recreated feature**: files changed/created, and how to verify.

## Rules of thumb

- Prefer static analysis; avoid executing unknown binaries.
- Cheapest sufficient evidence wins: JS bundle > symbols > decompiler > debugger.
- Binary analysis requires an explicit request or clear authorization; when in doubt, ask.
- Windows note: many classic Unix RE tools are absent; prefer Python scripts (bundled or written on the spot) and Node-based tools over assuming `strings`/`objdump` exist.
