# Native (PE · ELF · Mach-O) and .NET

Ideas adapted from REA's `native-and-artifacts.md` (MIT · © 2026 morluto), rewritten to use local scripts and a Ghidra the user installed.

| Section | |
|---|---|
| [1 · Native, step by step](#1--native-step-by-step) | [2 · .NET](#2--net) |
| [3 · Ghidra headless](#3--ghidra-headless) | [4 · Packed files and special languages](#4--packed-files-and-special-languages) |

## 1 · Native, step by step

Every step only reads the file. The binary is never loaded or run.

| Step | Command | Result |
|---|---|---|
| 1 File type | `python -I scripts/triage.py <file>` | PE / ELF / Mach-O · architecture · .NET or not |
| 2 header · section · import · export | `python -I scripts/pe_elf_info.py <file>` (`--limit 0` shows everything · `--json` keeps it for comparing) | DLLs or .so files used · functions called · functions exposed to others |
| 3 strings | `python -I scripts/triage.py <file> --pattern '<regex>'` such as `https?://` or `select .* from` | URLs · SQL · error messages (secrets are masked) |
| 4 disassembly of the spot of interest | `objdump -d --start-address=0x… --stop-address=0x… <file>` | Assembly for that range only (long output; write it to a file) |
| 5 pseudo-C | Ghidra headless (section 3) | Readable functions; names are lost if there are no symbols |

Imports tell you a lot without decompiling:

| Import seen | What it tells you |
|---|---|
| `WINHTTP` · `WININET` · `ws2_32` · `libcurl` · `libssl` | Goes out to the network |
| `bcrypt` · `ncrypt` · `crypt32` · `libcrypto` | Encryption · certificates |
| `advapi32!Reg*` | Reads and writes the registry |
| `sqlite3_*` · `odbc32` | Database |
| `mscoree.dll` only | It is .NET; go to section 2 |

- Addresses and pseudocode are analysis results, not the original source.
- No imports or symbols does not mean no calls (they may be loaded at runtime with `LoadLibrary` / `dlopen`, or stripped). Record it as an unknown.
- For PE delay-load imports, the script does not list names yet; it only says they exist. Use `objdump -p` to go further.
- For Mach-O, the script reads only the header and linked dylibs. Use Ghidra for imports and exports.

## 2 · .NET

- Look at the structure first with `python -I scripts/dotnet_meta.py <dll>`. It lists referenced assemblies · classes · methods · P/Invoke (`Type.method -> dll!name`) · resources. `--strings` shows user strings with secrets masked. Nothing to install. It does not support `#-` metadata with pointer tables.
- For readable C# code use `ilspycmd` (command in SKILL.md section 5.1). You get code almost equal to the original, with all SQL; only comments and variable names are lost.
- A `.pdb` placed alongside restores file names and line numbers. `.dll.config` holds settings (and often secrets; report names only).
- ASP.NET MVC with precompiled views: `.cshtml` comes back as a class under `<Assembly>.Views.<Controller>`.
- Xamarin or .NET for Android: the C# code is in the APK's `assemblies/*.dll` (sometimes LZ4-compressed, starting with `XALZ`). Extract that, not `classes.dex`.
- **NativeAOT** compiles to machine code, so .NET decompilers do not work. `pe_elf_info.py` will say `dotnet: False` even though strings contain .NET namespace names. Analyze it as native (sections 1 and 3). Recovered types are not the original C#.
- A single-file bundle (one exe holding dlls) must be extracted first with `ilspycmd -d -o <out> App.exe`. If triage finds an obfuscator, stop and tell the user first. An obfuscated assembly gives only the outline; say so plainly.
- Common `ilspycmd` options: one type → `-t Namespace.TypeName` · IL instead of C# → `-il` · class list → `-l c` · dependencies in another folder → `-r <folder>` (checked against the ICSharpCode.ILSpyCmd README 2026-10-23).
- ReadyToRun still has IL, so it decompiles normally. A trimmed build drops unused members, so missing code does not mean it never existed. (These 2 points come from general .NET documentation and have not been checked against ILSpy.)

## 3 · Ghidra headless

Use when steps 1–4 cannot answer the question. The user must install Ghidra and JDK 21 (SKILL.md section 5). Not tried on the machine where this document was written, because it has no Ghidra (`ยังไม่ได้ตรวจ`, not yet checked).

```bash
# Windows ใช้ support\analyzeHeadless.bat · project ชั่วคราว ลบทิ้งเมื่อจบ ไม่แก้ byte ของไฟล์เป้าหมาย
<ghidra>/support/analyzeHeadless _to_delete/re/<ชื่อ>/ghidra tmp -import <file> \
  -scriptPath <โฟลเดอร์สคริปต์ของเรา> -postScript <สคริปต์ส่งออก> _to_delete/re/<ชื่อ>/out -deleteProject
```

- Export pseudo-C only for the functions you need to see (by address from an import or string), not the whole file. The output would be too long to read.
- What one run should produce: function list with addresses · strings with where they are referenced (xref) · imports and exports · pseudo-C and disassembly of the functions of interest. The export script must be written yourself through Ghidra's API.
- Always read pseudo-C against the disassembly before citing a function in the report, because the decompiler can guess types and collapse code wrongly. The disassembly is what actually runs. (Idea from ghidra-headless in trailofbits/skills-curated (CC-BY-SA), rewritten in our own words.)
- Check whether Ghidra · IDA · Hopper exist with `node scripts/check-tools.mjs --target native`.
- ELF addresses are virtual addresses, not file offsets. Never add the image base yourself.
- For an untrusted target, run Ghidra in `docker-sandbox` too, because Ghidra's parser reads the file with the user's privileges.
- IDA · Hopper · Binary Ninja may be used instead only under the user's own license, opened read-only, never saving over the file.

## 4 · Packed files and special languages

| What you see | It means | What to do next |
|---|---|---|
| Sections named `UPX0` `UPX1` · a section with raw size 0 but large virtual size | Packed | Record the identity of the original file and the unpacked file separately · unpacking the stub does not mean you have the real program · ask the user before unpacking |
| `.gopclntab` (script says `Go binary`) · string `go1.` | Go | Function names remain in pclntab · recent Ghidra versions can read them |
| String `/rustc/` · `.cargo/registry` | Rust | Crate names come from paths in strings · no `.dep-v0` section does not mean no dependencies |
| File with no header (firmware) | Raw binary | Need the architecture and entry point first; ask the user or read the device documentation · for an image with several parts see [firmware](firmware.md) |
| `.wasm` | WebAssembly | WABT (`wasm2wat`) installed by the user · WAT is not the original source |
