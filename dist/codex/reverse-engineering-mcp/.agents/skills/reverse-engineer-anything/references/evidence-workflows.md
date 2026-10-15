# Evidence · การเทียบ · สิ่งที่ยังไม่รู้ · ตรวจงานที่เขียนใหม่

ดัดแปลงจาก `references/evidence-workflows.md` ของ REA 6.5.0 (MIT · © 2026 morluto)

## อ่าน Evidence

- tool ที่สร้าง Evidence คืนผลเต็มใน `structuredContent` · ข้อมูลอยู่ที่ `normalized_result` · อ้างด้วย `evidence_id`
- คงสิทธิ์ ข้อจำกัด coverage และสิ่งที่ยังไม่รู้ไว้ทุกครั้ง · อ่านหน้าถัดไปเฉพาะเมื่อส่วนที่เหลือสำคัญกับคำถาม
- `inspect_artifact` ที่เสร็จแล้วขอดูเป็นส่วนได้ เช่น `view: {kind: "inventory", collection: "occurrences", logical_paths: ["package.json", "main.js"]}` · collection อื่น: `nodes` · `edges` · `integrity_contradictions`
- `source_complete` ต่างจาก "หน้าหมดแล้ว" · หาไม่เจอใน Evidence ที่ไม่ครบไม่ได้แปลว่าไม่มี

## สิ่งที่ยังไม่รู้

- `record_unknown` จดคำถามที่ค้าง พร้อมสิทธิ์หรือสภาพแวดล้อมที่ต้องมีเพื่อตอบ และ Evidence ที่สนับสนุนหรือขัดแย้ง
- `update_unknown` ส่งเลข revision ปัจจุบัน · revision เก่าให้อ่านใหม่ก่อน อย่าลองซ้ำมั่ว ๆ · ปิดข้อได้ด้วยสิ่งที่เห็นจริงเท่านั้น

## เทียบ (ต้องมีหน้าครบทั้ง 2 ฝั่งก่อนบอกว่าเท่ากันหรือไม่มี)

| tool | เทียบอะไร | ระวัง |
|---|---|---|
| `compare_artifacts` | รายการไฟล์: path · เนื้อ · metadata · ความสัมพันธ์ | |
| `compare_functions` | Evidence ของฟังก์ชันที่ระบุ | ไม่ใช่จับคู่ทั้ง binary แบบคร่าว ๆ |
| `compare_bundles` | สมาชิกของ bundle และประวัติสิ่งที่ยังไม่รู้ | |
| `find_changed_behavior` | รวมผลเทียบที่มี | ความต่างแบบ static เป็นผู้ต้องสงสัย ไม่ใช่ต้นเหตุ |
| `build_call_path` | เส้นทางการเรียกจาก dossier ของ artifact เดียว | ขอบไม่ครบ → "ไม่มีเส้นทาง" เป็นสิ่งที่ยังไม่รู้ |
| `correlate_static_and_runtime` | จับคู่ static กับ runtime ตามที่ระบุ | ตรงกันเป็นสมมติฐาน ไม่ใช่เหตุและผล |
| `verify_reconstruction` | โค้ดที่เขียนใหม่ตรงกับ spec ที่กำหนดไหม | ผ่าน = ผ่านเฉพาะข้อที่ประกาศ ไม่ใช่เท่ากันทั้งระบบ |

## จับ process (รันเป้าหมาย ต้องขออนุญาต)

- การจับ process เป็นหลักฐานพฤติกรรม **ไม่ใช่ sandbox** · เป้าหมายไม่น่าไว้ใจให้ทำใน `software-company:docker-sandbox`
- แยกการจบของ process หลักกับ process ลูก · เป้าหมายที่ต้องเขียนรายงานตอนหมดเวลาใช้ `finalization_ms` (REA ส่ง SIGTERM แล้ว SIGKILL ครั้งเดียวถ้ายังไม่จบ)

## สรุป API จากไฟล์ HAR (HTTP Archive — ไฟล์บันทึกทราฟฟิกจากเบราว์เซอร์)

- `inspect_analysis_view` กับ `view: {kind: "api-surface"}` บน Evidence ของ `inspect_web_network_capture` จัดกลุ่ม request ตาม method · origin · รูปแบบ path
- การจัดกลุ่มเป็นการอนุมาน ไม่ใช่ schema ของ server · ไม่เก็บค่า query · ไม่ยิง request ซ้ำ
