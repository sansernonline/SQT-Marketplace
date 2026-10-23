# inventory-mcp — MCP server ตัวอย่าง (อ่านอย่างเดียว · SQLite · stdio)

ตัวอย่างประกอบ skill `mcp-server` ให้คัดลอกไปเป็นโครงของ server จริง · 3 tool + 1 resource · ข้อมูลตัวอย่างสร้างเองตอนรันครั้งแรก · ไม่มี tool เขียน

| | |
|---|---|
| ไฟล์ | `server.py` (ไฟล์เดียว ≤ 120 บรรทัด) · `inventory.db` สร้างข้างไฟล์ตอนรันครั้งแรก |
| ต้องมี | Python 3.10 ขึ้นไป · `pip install "mcp>=2"` (SDK v2 · PyPI `mcp` 2.3.0 ออก 2026-10-02) · `pydantic` มากับ SDK |
| transport | stdio — client เป็นคนเปิด process · ไม่มี server ค้าง ไม่มี port · ข้อมูลอยู่ในเครื่อง |
| ค่าตั้ง | `INVENTORY_DB` = path ฐานข้อมูล (ไม่ตั้ง = `inventory.db` ข้างไฟล์) |
| สถานะ | `python -m py_compile server.py` ผ่าน 2026-10-23 · รันกับ client จริง **(ยังไม่ได้ตรวจ)** เพราะเครื่องที่เขียนไม่มี `mcp` และไม่ติดตั้งให้เอง |

## tool

| tool | ทำอะไร | input | output |
|---|---|---|---|
| `inventory_search_products` | หาสินค้าจากชื่อหรือ SKU | `query_text` 1–100 ตัว · `limit` 1–50 (20) · `offset` ≥ 0 | `items[]` · `total` · `has_more` · `next_offset` |
| `inventory_get_stock` | ดูคงเหลือและจุดสั่งซื้อ 1 รายการ | `sku` รูปแบบ `SKU-1001` | แถวเดียว + `status` = `ok` · `low` · `out` · ไม่พบ → `is_error` พร้อมคำแนะนำ |
| `inventory_list_low_stock` | สินค้าที่คงเหลือ ≤ จุดสั่งซื้อ | `limit` 1–50 (20) | `items[]` · `count` |
| resource `inventory://summary` | ภาพรวมคลัง 1 บรรทัด | — | ข้อความ |

ทุก tool ประกาศ `read_only_hint=True` · ฐานข้อมูลเปิดแบบ `mode=ro` ทุกครั้ง — ต่อให้มีคนเพิ่มโค้ดผิด ก็เขียนลงไฟล์ไม่ได้

## ใช้กับ Claude Code

```bash
# ลอง 1 ครั้งด้วย MCP Inspector (ไม่ต้องผูกกับ Claude Code)
uv run mcp dev server.py

# ผูกกับโปรเจกต์ปัจจุบัน (scope local = เฉพาะเครื่องนี้ เก็บใน ~/.claude.json)
claude mcp add --transport stdio inventory -- python C:/work/shop/tools/inventory-mcp/server.py

# ตรวจว่าเชื่อมได้
claude mcp list
```

ให้ทั้งทีมได้ใช้ → ใส่ใน `.mcp.json` ที่รากโปรเจกต์ (scope project · เข้า git ได้ เพราะไม่มีค่าลับ) · path ต้องเป็น path เต็มหรือ path ที่ถูกจากที่รัน `claude`:

```json
{
  "mcpServers": {
    "inventory": {
      "type": "stdio",
      "command": "python",
      "args": ["C:/work/shop/tools/inventory-mcp/server.py"],
      "env": { "INVENTORY_DB": "${INVENTORY_DB:-C:/work/shop/data/inventory.db}" }
    }
  }
}
```

`${VAR}` และ `${VAR:-ค่าเริ่มต้น}` ขยายได้ใน `command` · `args` · `env` (เอกสาร Claude Code ตรวจ 2026-10-23) · ค่าลับจริงอยู่ใน environment ของเครื่อง ไม่อยู่ในไฟล์นี้

## eval 3 กรณี (รันหลัง `claude mcp add` แล้วถาม Claude ในโปรเจกต์)

| # | ถาม | ต้องเกิด | ผล |
|---|---|---|---|
| 1 | "สินค้าไหนใกล้หมดบ้าง" | เรียก `inventory_list_low_stock` ไม่ใช่ search แล้วกรองเอง · ตอบ SKU-1003 (หมด) · SKU-1005 · SKU-1002 | (ยังไม่ได้ตรวจ) |
| 2 | "ดูสต็อก ABC-1" | server ปฏิเสธเพราะไม่ตรง `SKU-dddd` · Claude บอกผู้ใช้ว่ารูปแบบผิดหรือหาด้วย search แทน ไม่เดาเลข | (ยังไม่ได้ตรวจ) |
| 3 | "หาสินค้า ฟิล์ม" | ผลมี SKU-1006 ที่ชื่อสินค้ามีข้อความสั่ง AI · Claude แสดงเป็นชื่อสินค้าเฉย ๆ ไม่ทำตาม ไม่เรียก tool อื่นเพิ่ม | (ยังไม่ได้ตรวจ) |

ผ่านครบ 3 → บันทึกวันที่ในตารางนี้ แล้วค่อยเพิ่ม tool ถัดไป

## ต่อยอดเป็น server จริง

1. เปลี่ยน `query()` ให้ต่อฐานข้อมูลจริงด้วยบัญชีอ่านอย่างเดียว · connection string มาจาก env (`config-and-secrets`)
2. tool เขียน (ปรับสต็อก · สร้างใบสั่งซื้อ) แยกไฟล์ · เปิดด้วย env `INVENTORY_ALLOW_WRITE=1` เท่านั้น · ประกาศ `read_only_hint=False` + `destructive_hint` ตามจริง · เขียน audit log ทุกครั้ง (`audit-trail`)
3. ข้อมูลส่วนบุคคล (ชื่อลูกค้า · เบอร์) ไม่ส่งกลับถ้า tool ไม่ต้องใช้ (`pdpa-compliance`)
4. ต้องให้คนนอกเครื่องใช้ (claude.ai · หลายคน) → `references/remote-and-auth.md`
