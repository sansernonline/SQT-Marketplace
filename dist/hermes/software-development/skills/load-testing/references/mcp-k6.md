# MCP ของ k6 (grafana/mcp-k6)

ส่วนขยายของ `load-testing` · ตรวจ 2026-10-28 จาก https://github.com/grafana/mcp-k6 และ https://api.github.com/repos/grafana/mcp-k6/releases · ไม่ฝังใน plugin ผู้ใช้ติดตั้งเองถ้าต้องการ

## สถานะ

| เรื่อง | ที่เห็น |
|---|---|
| ผู้ดูแล | Grafana (repo `grafana/mcp-k6`) |
| สถานะ | README เขียนว่ายังเป็นของทดลอง (experimental) |
| รุ่นล่าสุด | v0.7.0 วันที่ 2026-10-05 |
| ใบอนุญาต | หน้า repo ไม่ตรงกัน: แถบข้างเขียน AGPL-3.0 แต่ README เขียน MIT · เปิดไฟล์ LICENSE ก่อนใช้ในงานลูกค้า |
| เครื่องมือ | `validate_script` (รัน 1 VU 1 รอบ) · `run_script` (รันจริง ไม่เกิน 5 นาที) · `list_sections` · `get_documentation` |

## ข้อควรระวัง

- `run_script` ยิงคำขอจริงไปยังปลายทางในสคริปต์ · `validate_script` ก็ยิง 1 รอบ · ด่านอนุญาตใน `load-testing` หัวข้อ 2 ใช้กับการเรียกผ่าน MCP ด้วย ไม่มีข้อยกเว้น
- เริ่มใช้แค่ `get_documentation` กับ `validate_script` ที่ชี้ staging · ให้ agent เรียก `run_script` เฉพาะเมื่อผู้ใช้อนุญาตในรอบนั้น
- โหมด HTTP ไม่มีระบบยืนยันตัวตนในตัว ใช้ในเครือข่ายที่เชื่อถือได้เท่านั้น · ใช้แบบ stdio บนเครื่องตัวเองดีกว่า

## ติดตั้ง (ผู้ใช้ทำเอง ล็อกรุ่น)

Claude Code ผ่าน Docker (รูปแบบคำสั่งตาม README):

```bash
claude mcp add --scope=user --transport=stdio k6 -- docker run --rm -i grafana/mcp-k6:<tag ของ v0.7.0>
```

ชื่อ tag ของ image บน Docker Hub ที่ตรงกับ v0.7.0 `(ยังไม่ได้ตรวจ)` · README ใช้ `latest` แต่ให้เปิดหน้า tag แล้วใส่รุ่นที่ล็อกได้แทน · ทางอื่น: Homebrew (`brew tap grafana/grafana` แล้ว `brew install mcp-k6`) หรือแพ็กเกจ `.deb` `.rpm` จากหน้า release ของ v0.7.0 · รันแบบ native ต้องมี k6 อยู่ใน PATH ด้วย

เอกสาร k6 ยังพูดถึงคำสั่ง `k6 x mcp` ที่ดึงรุ่นล่าสุดอัตโนมัติ · ต้องการล็อกรุ่นให้ใช้ตัวแยก `mcp-k6` แบบข้างบน (จากผลค้นหาที่อ้างหน้า https://grafana.com/docs/k6/v2.3.x/set-up/configure-ai-assistant/ ยังไม่ได้เปิดหน้านั้นเอง)
