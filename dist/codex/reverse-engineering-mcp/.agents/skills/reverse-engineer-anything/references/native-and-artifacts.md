# native · .NET · package · การแตกไฟล์

ดัดแปลงจาก `references/native-and-artifacts.md` ของ REA 6.5.0 (MIT · © 2026 morluto)

| หัวข้อ | |
|---|---|
| [1 · native (Ghidra · Hopper · IDA)](#1--native-ghidra--hopper--ida) | [2 · .NET](#2--net) |
| [3 · package และการแตกไฟล์](#3--package-และการแตกไฟล์) | [4 · ไฟล์เฉพาะทาง](#4--ไฟล์เฉพาะทาง) |
| [5 · ภาพเฉพาะที่ไม่มี header](#5--ภาพเฉพาะที่ไม่มี-header) | |

## 1 · native (Ghidra · Hopper · IDA)

- หลัง `open_binary` ใช้ tool ค้น · ฟังก์ชัน · pseudocode · ใครเรียก · เรียกใคร · cross-reference ได้เลย · `binary_overview` เมื่ออยากได้ภาพรวม (IDA ไม่มีตัวนี้)
- address และ pseudocode เป็นผลวิเคราะห์ ไม่ใช่ซอร์สต้นฉบับ · provider ไม่มีหรือไม่รองรับ = ยังไม่รู้ ไม่ใช่ "ไม่มี"
- dossier ของ `analyze_function` ที่เสร็จแล้ว อ่านทีละส่วนด้วย `inspect_analysis_view` และ `view: {kind: "native", facet: "value_flow_operations", offset: 0, limit: 32}` · facet อื่น: procedure · pseudocode · assembly · basic blocks · comments · callers/callees · references · unresolved calls · strings · names
- `binary_session` ไม่ส่ง argument → เห็นเป้าหมายที่เปิด provider ที่เลือก และ `tool_availability` (ธงที่ไม่ได้ระบุ = false)
- Ghidra: `procedure_pseudo_code` รับ `procedure: "file-offset:0x..."` ได้ · ELF (Executable and Linkable Format — ไฟล์โปรแกรมของ Linux) virtual address ไม่ใช่ file offset ห้ามบวก image base เอาเอง · `read_bytes` อ่านหน่วยความจำที่วิเคราะห์ · `address_to_file_offset` โยงกลับ byte ในไฟล์
- ไฟล์ที่ถูก pack: เก็บตัวตนของไฟล์เดิมและไฟล์ที่แตกออกแยกกัน · ถอด stub ที่แตกไฟล์ไม่ได้แปลว่าได้โปรแกรมจริง
- ตั้งชื่อและหมายเหตุใน Ghidra (`annotate_native_function` · `set_address_name` · `set_addresses_names`) แก้แค่ฐานข้อมูลของ session ไม่แก้ byte · Windows Ghidra P0 แก้ฐานข้อมูลไม่ได้
- IDA: `open_binary` ด้วยไฟล์ต้นฉบับและ `provider_id: "ida"` · อ่านอย่างเดียว ไม่ save · ผู้ใช้ต้องตั้ง ida-pro-mcp และมีสัญญาอนุญาต IDA ของตัวเอง
- Mach-O ใหญ่: `inspect_macho` กับ `detail: "summary"` แล้วอ่านทีละหน้า (`view: {kind: "macho", facet: "exports", offset: 0, limit: 64}`)
- `observe_native_calls` เปิด process ใหม่ใต้ LLDB = **รันเป้าหมาย** แก้ไฟล์หรือออกเครือข่ายได้ ต้องขออนุญาต

## 2 · .NET

- โค้ด C# อ่านได้ → `software-company:reverse-engineering` (`ilspycmd`) · REA ใช้ตอบเรื่องตัวตน · reference · resource · attribute · การเรียกระหว่าง member
- `inspect_managed_artifact` ไม่โหลดหรือรัน assembly · ห้ามเขียนว่า load · reflect · execute แล้ว · `detail: "summary"` แล้วอ่าน `view: {kind: "managed", collection: "attributes", offset: 0, limit: 16}` (collection: `references` · `resources` · `attributes`)
- `inspect_managed_members` เลือก type ด้วย `type_names` และ `detail: "summary"` · อ่านต่อด้วย `view: {kind: "managed-members", collection: "call_edges", ...}` (types · exported_types · fields · methods · member_refs · call_edges · field_accesses · user_strings)
- **NativeAOT** เป็น machine code — decompiler ของ CIL (Common Intermediate Language — โค้ดกลางของ .NET) ใช้ไม่ได้ · วิเคราะห์แบบ native · type ที่กู้ได้และ pseudocode ไม่ใช่ C# ต้นฉบับ · มี parser ในตัวสำหรับ PE (Portable Executable — ไฟล์ .exe .dll ของ Windows) x64 ที่มี metadata .NET 8 RTR 9.1 (ใช้บน Windows Ghidra P0 ได้)

## 3 · package และการแตกไฟล์

- `inspect_artifact` กับ ZIP · APK (Android Package) · IPA (iOS App Store Package) · MSIX (ไฟล์ติดตั้งแอป Windows) · AppX · ASAR (Atom Shell Archive ของ Electron) · DMG ได้กราฟของไฟล์ทั้งหมด
- IPA หรือ `.app` · ZIP · DMG ของ macOS: ส่ง Evidence ต่อให้ `project_apple_application_graph` (บทบาทมาจากรูปแบบ path ไม่ใช่การอ่าน plist — อ่าน plist ด้วย `inspect_plist`) · `trace_dylib_resolution` ดูว่า `@rpath` โหลดไฟล์ไหน
- `extract_artifact` แตกไฟล์ทุกตัวลงโฟลเดอร์ชั่วคราวที่ REA เลือก · symlink และไฟล์เข้ารหัสไม่ถูกแตก
- DMG บน macOS mount แบบอ่านอย่างเดียวให้เอง · เครื่องอื่นเป็นข้อจำกัด อย่าอ้างว่าเห็นไฟล์ข้างใน

## 4 · ไฟล์เฉพาะทาง

| ไฟล์ | tool | ข้อควรรู้ |
|---|---|---|
| Go | `inspect_go_binary` | เวอร์ชัน compiler · module · build setting · ไม่มี record ไม่ได้แปลว่าไม่ใช่ Go |
| Rust | `inspect_rust_binary` | อ่าน `.dep-v0` ของ cargo-auditable · ไม่มี section ไม่ได้แปลว่าไม่มี dependency |
| SQLite | `inspect_sqlite_database` | ต้อง Node 24.15+ หรือ 26+ · ใช้ snapshot ที่นิ่ง · อ่านไฟล์ `-wal` ข้าง ๆ ด้วย · ค่าเริ่ม 20 แถว ลำดับไม่แน่นอน |
| core dump Linux x86-64 | `inspect_recorded_crash` | PID ในไฟล์เป็นประวัติ ไม่ใช่สิทธิ์เกาะ process จริง |
| ELF layout | `inspect_binary_layout` | ต้องมี pwntools · อ่านต่อด้วย `inspect_analysis_view` ไม่รันซ้ำ |
| WebAssembly | `inspect_wasm_artifact` | ต้องมี WABT 1.0.42 (`REA_WABT_BIN_DIRECTORY`) · WAT ไม่ใช่ซอร์สต้นฉบับ · `compare_wasm_interfaces` เทียบ import/export |
| PE resource | `inspect_pe_resources` | ไม่ต้องเปิดเป้าหมาย · payload อื่นนอกจาก icon เป็นก้อนทึบ |

## 5 · ภาพเฉพาะที่ไม่มี header

- DOS COM: `open_binary` กับ `format: "dos-com"` · ตรวจ load image ด้วย `inspect_native_load_image` ก่อนเชื่อผลวิเคราะห์ฟังก์ชัน
- firmware ไม่มี header: `format: "raw-binary"` + `architecture` (`x86` · `x86_64` · `arm` · `arm64` · `6502`) + `entry_point` · ใช้ได้กับ Ghidra เท่านั้น · big-endian · Thumb-only · Cortex-M ไม่รองรับ
