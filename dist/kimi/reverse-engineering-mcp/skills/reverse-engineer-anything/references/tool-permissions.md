# tool ของ REA ที่ต้องขออนุญาตทุกครั้ง

ที่มา: `src/contracts/toolEffects.ts` ของ rea-agents 6.5.0 (commit `cf0a38a`) · ตาราง `TOOL_EFFECTS` มี 207 tool · คอลัมน์ บรรทัด คือเลขบรรทัดในไฟล์นั้น · ตรวจ 2026-10-15

hook `hooks/ask-before-run.mjs` ของ plugin ใช้รายชื่อเดียวกันนี้ บังคับให้ Claude Code ขึ้นหน้าถามก่อนเรียก (โหมด auto ก็ต้องถาม) · ชื่อเต็มที่ใช้ในกฎสิทธิ์คือ `mcp__plugin_reverse-engineering-mcp_rea__<ชื่อ tool>` · hook จับ `mcp__rea__<ชื่อ tool>` ด้วย (กรณีลงทะเบียน REA เองในชื่อ `rea`)

## 1 · รันโค้ดของเป้าหมาย (ธง `executesForeignCode` · 15 tool)

REA นิยามว่า "รันหรือขับโค้ดที่ REA ไม่ได้เป็นเจ้าของบนเครื่อง: ตัวเป้าหมาย โปรแกรมที่ผู้เรียกเลือก หรือแอปที่โหลดอยู่ในนั้น" · ทำงานด้วยสิทธิ์ผู้ใช้เต็ม ไม่มี sandbox

| tool | บรรทัด | ทำอะไร |
|---|---|---|
| `cutter_command` | 57 | สั่ง Cutter ตรง ๆ |
| `gdb_console` | 76 | สั่ง GDB ตรง ๆ |
| `start_rizin_debug_session` | 86 | เปิด debugger Rizin บนเป้าหมาย |
| `rizin_debug_command` | 93 | สั่ง debugger Rizin |
| `close_rizin_debug_session` | 105 | ปิด debugger Rizin |
| `close_gdb_session` | 111 | ปิด session GDB |
| `execute_rizin_command` | 118 | สั่ง Rizin ตรง ๆ |
| `load_frida_script` | 211 | ฉีด script Frida เข้า process |
| `resume_frida_session` | 219 | ให้ process ที่ Frida หยุดไว้วิ่งต่อ |
| `instrument_with_frida` | 242 | เปิดหรือเกาะ process แล้วฉีด Frida |
| `capture_native_ui_scenario` | 568 | เปิดแอป native แล้วกดตามขั้นตอน |
| `observe_native_calls` | 580 | เปิด process ใหม่ใต้ LLDB แล้วดูการเรียกฟังก์ชัน |
| `capture_browser_scenario` | 624 | สั่งเบราว์เซอร์กด พิมพ์ เปิดหน้า |
| `capture_electron_scenario` | 637 | สั่งแอป Electron ตามขั้นตอน |
| `capture_process_scenario` | 690 | รัน process แล้วบันทึกพฤติกรรม |

## 2 · แก้อุปกรณ์ Android (ธง `mutatesDevice` · 6 tool)

| tool | บรรทัด |
|---|---|
| `push_adb_file` | 355 |
| `install_adb_package` | 418 |
| `uninstall_adb_package` | 426 |
| `start_adb_app` | 434 |
| `start_adb_activity` | 442 |
| `stop_adb_app` | 450 |

## 3 · เกาะหรือเปลี่ยนสถานะ process ที่กำลังรัน (ธง `mutatesTarget` ที่แตะ process หรือหน้าเว็บที่รันอยู่ · 4 จาก 30 tool ที่มีธงนี้)

อีก 26 tool ที่มีธงนี้: 13 ตัวอยู่ในกลุ่ม 1 แล้ว · 6 ตัวอยู่ในกลุ่ม 2 แล้ว · 7 ตัวเป็น tool ตั้งชื่อและหมายเหตุที่ไม่ต้องถาม (ดูท้ายไฟล์)

| tool | บรรทัด | ทำไมต้องถาม |
|---|---|---|
| `start_frida_session` | 204 | เกาะ process ที่รันอยู่ |
| `unload_frida_script` | 227 | เอา script ออกจาก process |
| `close_frida_session` | 235 | ปล่อย process |
| `observe_web_execution` | 170 | ล้างตัวนับและปิด optimization ของหน้าเว็บชั่วคราว |

## 4 · อ่านข้อมูลสดจากของที่กำลังรัน (ไม่มีธง · 9 tool)

REA ไม่ได้ติดธงแก้หรือรันให้ tool กลุ่มนี้ แต่ทุกตัวอ่านของจริงที่ผู้ใช้กำลังใช้อยู่ (หน้าเว็บ แอป Electron หรืออุปกรณ์ Android) ซึ่งอาจมีข้อมูลส่วนตัว จึงให้ถามก่อน

| tool | บรรทัด | อ่านอะไร |
|---|---|---|
| `observe_web_session` | 619 | ทราฟฟิกและเหตุการณ์ของหน้าเว็บที่เปิดอยู่ |
| `inspect_web_page` | 617 | หน้าเว็บที่เปิดอยู่ |
| `inspect_electron_page` | 636 | หน้าของแอป Electron ที่เปิดอยู่ |
| `capture_web_screenshot` | 622 | ภาพหน้าจอของหน้าเว็บ |
| `pull_adb_file` | 348 | ดึงไฟล์จากอุปกรณ์ Android |
| `pull_adb_package` | 331 | ดึงแพ็กเกจแอปจากอุปกรณ์ |
| `read_adb_logcat` | 338 | log ของอุปกรณ์ |
| `collect_adb_bugreport` | 406 | bugreport ทั้งเครื่อง |
| `capture_adb_screen` | 364 | ภาพหน้าจออุปกรณ์ |

## ไม่ต้องถาม แต่ควรรู้

- tool ตั้งชื่อและหมายเหตุ (`annotate_native_function` · `set_address_name` · `set_addresses_names` · `set_bookmark` · `unset_bookmark` · `set_comment` · `set_inline_comment`) แก้แค่ฐานข้อมูลวิเคราะห์ ไม่แก้ byte ของไฟล์
- `close_binary` (675) และ `export_evidence_bundle` (682) ทิ้งหรือเขียนทับข้อมูลได้ · export ก่อนปิดถ้าต้องเก็บ
- `extract_firmware` เขียนลงโฟลเดอร์ใหม่ที่ระบุเอง (path เต็ม ต้องยังไม่มีอยู่) · `extract_artifact` เขียนลงโฟลเดอร์ชั่วคราวใหม่ที่ REA เลือกเอง และบอก path ในผล
- ทุก tool ใช้เครื่องมือภายนอก (Ghidra · JADX · tshark ฯลฯ) parse ไฟล์ด้วยสิทธิ์ผู้ใช้ · เป้าหมายที่ไม่น่าไว้ใจให้ทำทั้งหมดใน `software-company:docker-sandbox`

## ขึ้นรุ่น REA

อ่าน `toolEffects.ts` ของรุ่นใหม่ หา tool ที่มีธง `executesForeignCode` · `mutatesDevice` · `mutatesTarget` ที่แตะ process หรือหน้าเว็บที่รันอยู่ (ไม่นับ tool ตั้งชื่อและหมายเหตุที่แก้แค่ฐานข้อมูลวิเคราะห์) และ tool ใหม่ที่อ่านหน้าเว็บ แอป หรืออุปกรณ์ที่กำลังรัน แล้วแก้ทั้งไฟล์นี้และรายชื่อใน `hooks/ask-before-run.mjs` ให้ตรงกัน · แก้จำนวนที่ self-test ของ hook คาดไว้ด้วย

เทียบกับไฟล์ที่ npm ส่งจริงด้วย ไม่ใช่แค่ source บน GitHub: ดาวน์โหลด tarball ของรุ่นนั้นแล้วเทียบ `dist/contracts/toolEffects.js` กับรายชื่อใน hook
