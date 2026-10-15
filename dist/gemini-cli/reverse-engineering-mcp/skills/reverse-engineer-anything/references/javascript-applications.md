# แอป JavaScript และ Electron

ดัดแปลงจาก `references/javascript-applications.md` ของ REA 6.5.0 (MIT · © 2026 morluto)

## วิเคราะห์ครั้งเดียว

- `analyze_javascript_application` กับไฟล์ ASAR (Atom Shell Archive — ไฟล์รวมโค้ดของแอป Electron) หรือโฟลเดอร์ที่แตกแล้วโดยตรง · ไม่รันโค้ดของแอป
- รู้ไฟล์ที่ต้องดูแล้วและ server ประกาศ `source_paths` ให้เลือกเฉพาะไฟล์ เช่น `["package.json", "main.js", "preload.js"]` · ใส่ manifest และ source map ที่เกี่ยวเองด้วย เพราะ dependency ไม่ถูกวิเคราะห์ให้อัตโนมัติ · ไฟล์นอกที่เลือกถือเป็นสิ่งที่ยังไม่รู้
- ใหญ่หรือไม่รู้ขนาด ส่ง `detail: "summary"` แล้วอ่านต่อจาก `normalized_result.parent_evidence_id` · summary ลดขนาดผลที่ส่งกลับ ไม่ได้ลดงานวิเคราะห์
- `max_heap_mb` (ค่าเริ่ม 1024) · `analysis_timeout_ms` (ค่าเริ่ม 300000) ใช้กับตัววิเคราะห์ที่แยก process · ผลที่ติดเพดานยังเก็บสิ่งที่เสร็จแล้วไว้ ดูข้อจำกัดก่อนลองใหม่
- โค้ดที่ถูกย่อจนอ่านไม่ออก: `recover_javascript_sources` (ต้องมี Wakaru บน Linux x64 ที่ผู้ใช้หามาเอง) แล้ววิเคราะห์โฟลเดอร์ `analysis_input` ที่ได้

## อ่านทีละ module โดยไม่วิเคราะห์ซ้ำ

1. ขอหน้ารายชื่อ module (`source.evidence_id` ใช้ ID จริงที่ได้คืนมา ห้ามแต่ง):
   ```json
   { "source": { "kind": "retained-evidence", "evidence_id": "<parent ID>" },
     "view": { "kind": "page", "collection": "modules", "offset": 0, "limit": 16 } }
   ```
2. เลือกด้วย `node_id` จากหน้านั้น (`"view": {"kind": "item", "collection": "modules", "selector": {"node_id": "<node ID>"}}`) · path เดียวมีได้หลายบทบาท ใช้ `selector.path` เมื่อรู้แน่ว่าไม่ซ้ำ
3. item ไม่มีข้อเท็จจริงบางอย่าง ไม่ได้แปลว่าทั้งแอปไม่มี

## ไล่ฟีเจอร์เฉพาะคำถามที่เหลือ

- `trace_application_feature` จาก Evidence ของแอป ด้วยจุดเริ่ม 1 อย่าง: node ID · route · string · API · ช่อง IPC (Inter-Process Communication) · module · native export
- ทิศ `incoming` (อะไรนำมาสู่จุดนี้) · `outgoing` (จุดนี้ไปไหน) · `both` เมื่อจำเป็นจริง เพราะลากความสัมพันธ์แบบ "อยู่ใน" ไปไกลจนเจอ module ที่ไม่เกี่ยว · ทุก node ที่เจอไม่ได้แปลว่ามีส่วนในฟีเจอร์
- BrowserWindow · preload · contextBridge · ช่อง IPC · utility process · native binding ที่เจอ เป็นสิ่งที่เห็นจาก syntax · จับคู่ IPC ได้เฉพาะชื่อช่องที่เป็นตัวอักษรตรงกันตัวเดียว · ห้ามสรุปว่ารันถึงจริงหรือบังคับใช้จริงจาก static

## เทียบรุ่น

- วิเคราะห์แต่ละรุ่นครั้งเดียว แล้ว `compare_application_versions` · ยอมรับเฉพาะการจับคู่ด้วย digest · source map · ลายนิ้วมือโครงสร้าง · เลขลำดับ module และชื่อที่ย่อแล้วไม่ใช่ตัวตน
- บอกว่า "เพิ่ม" หรือ "หาย" ได้ต่อเมื่ออีกฝั่งครอบคลุมครบ ไม่งั้นเป็นสิ่งที่ยังไม่รู้
- รูปร่าง object ที่ฟังก์ชัน export คืนเปลี่ยนไปอย่างไร: `compare_javascript_export_shapes` ระบุ path ของ module และชื่อ export · ค่าที่เป็น dynamic ยังเป็นสิ่งที่ยังไม่รู้ · ผลเป็นการอนุมานแบบ static

## ผลใหญ่เกิน

- `resource_constraint` กับ `details.resource: "transport"` → ใช้ `details.reported_limits.evidence_reference` กับ `inspect_analysis_view` หรือ `export_evidence_bundle` ลงไฟล์ที่เลือก
- client ตัดผลเองโดยไม่มี error → ถือว่าอ่านไม่ครบ ใช้ ID เดิมขอดูทีละส่วน · ID หายจากผลที่ถูกตัดให้หาจาก summary เดิม ห้ามแต่ง ID หรือรันซ้ำ
- `close_binary` ล้าง reference ที่เก็บไว้ · export ก่อนปิดถ้ายังต้องใช้
