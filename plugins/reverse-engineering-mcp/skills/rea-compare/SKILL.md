---
name: rea-compare
description: Compare two versions of an authorized app, package or binary with REA and report what changed, with evidence.
argument-hint: <old version path> <new version path> [what to look for]
disable-model-invocation: true
---

ใช้ skill `reverse-engineer-anything` เทียบ: **$ARGUMENTS**

1. **สิทธิ์** — ถามและจดเหตุผลที่ผู้ใช้มีสิทธิ์ทั้ง 2 รุ่น (skill หัวข้อ 1) · จด SHA-256 ทั้งคู่
2. **เลือกเครื่องมือเทียบตามชนิด** — แต่ละรุ่นวิเคราะห์ครั้งเดียว แล้วเทียบจาก Evidence:

   | ชนิด | วิเคราะห์ | เทียบ |
   |---|---|---|
   | JavaScript/Electron | `analyze_javascript_application` | `compare_application_versions` · รูปร่างค่าที่ export คืน: `compare_javascript_export_shapes` |
   | package (ZIP · APK (Android Package) · IPA (iOS App Store Package) · MSIX (ไฟล์ติดตั้งแอป Windows)) | `open_binary` + `inspect_artifact` | `compare_artifacts` |
   | .NET | `inspect_managed_members` | `compare_managed_members` · หรือ `compare_members.py` ของ `software-company:reverse-engineering` เมื่อเทียบกับซอร์สใน repo |
   | native | `analyze_function` เฉพาะฟังก์ชันที่สงสัย | `compare_functions` แล้ว `find_changed_behavior` |
   | WebAssembly | `inspect_wasm_artifact` | `compare_wasm_interfaces` |

3. **อ่านผลให้ถูก** — บอก "เพิ่ม" หรือ "หาย" ได้เมื่ออีกฝั่งครอบคลุมครบเท่านั้น ไม่งั้นเป็นสิ่งที่ยังไม่รู้ · ชื่อที่ย่อแล้วและเลขลำดับ module ไม่ใช่ตัวตน · ความต่างแบบ static เป็นผู้ต้องสงสัย ไม่ใช่ต้นเหตุ
4. **รายงาน** — ตาราง: สิ่งที่เปลี่ยน · เพิ่ม/หาย/แก้/ยังไม่รู้ · Evidence ID · ผลต่อผู้ใช้ · ปิดท้ายด้วยสิ่งที่ยังไม่รู้และวิธีตอบ · แล้ว `close_binary`
