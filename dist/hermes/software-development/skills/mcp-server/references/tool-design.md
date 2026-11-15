# ออกแบบ tool ให้ agent — ชื่อ · พารามิเตอร์ · error · แบ่งหน้า · idempotency

> เรียบเรียงจากสเปก MCP 2026-07-28 (server/tools) · Python SDK v2 docs · `mcp-builder` ของ Anthropic (Apache-2.0 · เขียนใหม่ ไม่คัดลอก) · ตรวจ 2026-10-23 · ตัวอย่างโค้ดเป็น Python SDK v2 (`mcp` ≥ 2) · TypeScript ทำเหมือนกันด้วย Zod

## สารบัญ

1. [ชื่อ](#1-ชื่อ)
2. [พารามิเตอร์](#2-พารามิเตอร์)
3. [คำอธิบาย tool](#3-คำอธิบาย-tool)
4. [ผลลัพธ์](#4-ผลลัพธ์)
5. [error เป็นข้อมูล](#5-error-เป็นข้อมูล)
6. [แบ่งหน้า](#6-แบ่งหน้า)
7. [idempotency และ tool เขียน](#7-idempotency-และ-tool-เขียน)
8. [annotations](#8-annotations)
9. [ขนาดผลลัพธ์](#9-ขนาดผลลัพธ์)
10. [ตัวอย่างชุด tool คลังสินค้า](#10-ตัวอย่างชุด-tool-คลังสินค้า)
11. [แหล่งที่มา](#11-แหล่งที่มา)

## 1 · ชื่อ

| กฎ | ดี | ไม่ดี | เพราะ |
|---|---|---|---|
| `<ระบบ>_<กริยา>_<สิ่งของ>` snake_case | `inventory_search_products` | `searchProducts` · `products` | prefix กันชนกับ server อื่นใน client เดียวกัน · กริยาบอกผลข้างเคียง |
| กริยาชุดเดียวทั้ง server | `get` (1 ตัว) · `search`/`list` (หลายตัว) · `create` · `update` · `delete` | `fetch` ปนกับ `get` · `find` ปนกับ `search` | โมเดลเดาชื่อ tool ถัดไปได้จากแบบแผน |
| สิ่งของเป็นพหูพจน์เมื่อคืนรายการ | `list_low_stock_items` | `list_low_stock_item` | บอกว่าคืน array |
| ไม่ใส่เลขรุ่นหรือชื่อเทคโนโลยี | `erp_get_invoice` | `erp_get_invoice_v2` · `sql_get_invoice` | เปลี่ยนข้างในได้โดยไม่เปลี่ยนชื่อ |
| ยาวไม่เกิน ~40 ตัวอักษร | `inventory_get_stock` | `inventory_get_current_stock_level_for_sku` | client บางตัวแสดงชื่อเต็ม |

ชื่อ server: Python `<ระบบ>_mcp` หรือโฟลเดอร์ `<ระบบ>-mcp` · Node `<ระบบ>-mcp-server` · ไม่มีเลขรุ่น (แนว `mcp-builder`)

## 2 · พารามิเตอร์

```python
from typing import Annotated, Literal
from pydantic import Field

@mcp.tool(title="หาใบแจ้งหนี้", annotations=READ_ONLY)
def erp_search_invoices(
    customer_code: Annotated[str, Field(pattern=r"^C\d{5}$", description="รหัสลูกค้า เช่น C00042")],
    status: Annotated[Literal["open", "paid", "overdue"], Field(description="สถานะ")] = "open",
    issued_after: Annotated[str | None, Field(description="วันที่ ค.ศ. รูปแบบ YYYY-MM-DD")] = None,
    limit: Annotated[int, Field(ge=1, le=50, description="จำนวนสูงสุดต่อหน้า")] = 20,
    offset: Annotated[int, Field(ge=0, description="ข้ามกี่รายการ")] = 0,
) -> dict: ...
```

- **ทุกตัวมี type · ขอบเขต · description** — SDK แปลงเป็น JSON Schema ให้ client และปฏิเสธ input ผิดก่อนถึงโค้ดเรา
- **ค่าที่มีชุดจำกัดใช้ `Literal`/enum** ไม่ใช่ str อิสระ — โมเดลเลือกจากรายการแทนการสะกดเอง
- **วันที่เป็น ISO ค.ศ.** ในพารามิเตอร์และผลลัพธ์ · แปลงเป็น พ.ศ. ที่หน้าจอ ไม่ใช่ที่ tool (`i18n-and-locale`)
- **ไม่รับ `dict` หรือ `Any`** — ถ้าต้องรับโครงซ้อน ใช้ Pydantic model ที่มี field ชัด
- **ค่าเริ่มต้นปลอดภัย** — `limit` เล็ก · `status="open"` · ไม่มีค่าเริ่มต้นที่แปลว่า "ทั้งหมด"
- **id เป็น str ที่มี pattern** แม้ข้างในเป็นเลข — กันโมเดลส่ง `1` แทน `"SKU-0001"`
- พารามิเตอร์ ≤ 6 ตัวต่อ tool · เกินนั้นแตก tool หรือรวมเป็น model เดียว

## 3 · คำอธิบาย tool

docstring (Python) หรือ `description` (TypeScript) คือสิ่งที่โมเดลอ่านเพื่อเลือก tool — เขียน 1–2 ประโยค:

1. ทำอะไร คืนอะไร — "หาใบแจ้งหนี้ของลูกค้า 1 รายตามสถานะ · คืน items · total · has_more"
2. เมื่อไหร่ใช้ / ไม่ใช้ ถ้ามี tool คล้ายกัน — "ถ้ารู้เลขใบแจ้งหนี้แล้ว ใช้ erp_get_invoice แทน"
3. ไม่เขียน "This tool…" · ไม่เล่าวิธีทำงานข้างใน · ไม่ใส่ตัวอย่าง JSON ยาว (schema บอกอยู่แล้ว)

`title` เป็นชื่อให้คนอ่านใน UI (ไทยได้) · `name` เป็นของโมเดล (อังกฤษ snake_case)

## 4 · ผลลัพธ์

| คืนจากฟังก์ชัน | `structured_content` | `content` (ข้อความ) |
|---|---|---|
| `dict[str, …]` · Pydantic model · TypedDict · dataclass | object นั้นตรง ๆ | JSON ของ object เดียวกัน |
| `int` · `str` · `float` · `bool` | `{"result": ค่า}` | ค่าเป็นข้อความ |
| `list[…]` | `{"result": [...]}` | TextContent ทีละรายการ |

(พฤติกรรม Python SDK v2 · servers/structured-output · ตรวจ 2026-10-23)

- **คืน dict เสมอ** สำหรับ tool จริง — ได้ field ชื่อชัดและเติม field ใหม่ได้โดยไม่พังของเก่า · ไม่คืน list เปล่า (จะถูกห่อเป็น `result` และแตกเป็นหลาย content block)
- ชื่อ field snake_case ชุดเดียวทั้ง server · เวลาเป็น ISO 8601 · เงินเป็นเลขทศนิยม + `currency` · ไม่มี `null` ที่แปลว่า "ไม่ส่ง" ปนกับ "ไม่มีค่า"
- รายการใช้โครงเดียวทั้ง server: `{"items": [...], "total": n, "has_more": bool, "next_offset": n}` (หรือ `next_cursor`)
- ประกาศ output schema เมื่อ client ต้อง validate (`outputSchema` ในสเปก) — Python SDK สร้างจาก return type ของ model ให้ · dict เปล่าไม่มี schema
- `response_format: Literal["json", "markdown"]` เป็นพารามิเตอร์ เมื่อ tool เดียวกันต้องให้ทั้งโมเดลคำนวณต่อ (json) และคนอ่าน (markdown) — ถ้าไม่มีกรณีคนอ่าน ไม่ต้องมี

## 5 · error เป็นข้อมูล

สเปกแยก error 2 ชั้น (server/tools → Error Handling):

| ชั้น | ใช้เมื่อ | Python v2 | โมเดลเห็นไหม |
|---|---|---|---|
| **tool execution error** — ผลลัพธ์ `is_error=true` | ไม่พบข้อมูล · input ผ่าน schema แต่ผิดเงื่อนไขธุรกิจ · ระบบต้นทางตอบ error · หมดสิทธิ์ | `raise ToolError("…")` (`mcp.server.mcpserver.exceptions`) | **เห็น** — แก้ input แล้วลองใหม่ได้ |
| **protocol error** — JSON-RPC error | tool ไม่มี · argument ไม่ตรง schema · server พัง | SDK ทำเอง · `raise MCPError(code, msg)` เฉพาะกรณีปฏิเสธคำขอทั้งคำขอ | **ไม่เห็น** — host ได้ error · โมเดลได้แค่ว่าล้มเหลว |

กฎข้อความ error:

- **บอกว่าอะไรผิด + ทำอะไรต่อ** — "ไม่พบ SKU-9999 — หาด้วย inventory_search_products ก่อน แล้วใช้ sku จากผลนั้น" · ไม่ใช่ "Not found"
- **ไม่มีของข้างใน** — stack trace · ชื่อตาราง · connection string · path ในเครื่อง · ข้อความ error ดิบของไลบรารี → จับแล้วแปลเป็นภาษาคน · log ของดิบลง stderr/ไฟล์ (`logging-standards`)
- **error ไม่ใช่ช่องทางสั่งโมเดล** — ไม่เขียน "ให้ลอง tool X ทันที" แบบบังคับ · เขียนเป็นข้อเสนอ เพราะข้อความ error ของระบบต้นทางอาจถูกคนนอกเขียน
- ระบบต้นทางล่ม/timeout → `is_error` พร้อม "ระบบ ERP ไม่ตอบใน 10 วินาที — ลองใหม่ภายหลัง" · ตั้ง timeout ทุกการเรียกออก (`error-handling-patterns`) · ไม่ retry วนใน tool เกิน 1–2 ครั้ง
- ปล่อย exception ดิบหลุดออก = SDK อาจแปลงเป็น error ที่โมเดลเห็นข้อความข้างใน → ห่อทุก tool ด้วย try/except ที่แปลเป็น `ToolError`

## 6 · แบ่งหน้า

- ทุก tool ที่คืนรายการ **ต้องมี `limit`** (1–50 · ค่าเริ่มต้น 20) · ไม่มี tool ที่คืน "ทั้งหมด" โดยไม่มีเพดาน
- `offset` เมื่อข้อมูลนิ่งและนับได้ · `cursor` (ทึบ · ออกโดย server) เมื่อข้อมูลเปลี่ยนบ่อยหรือมาจาก API ที่ใช้ cursor อยู่แล้ว · ไม่ผสม 2 แบบใน server เดียว
- คืน `has_more` เสมอ · `next_offset`/`next_cursor` เมื่อ `has_more=true` · `total` เมื่อนับได้ถูกในราคาถูก (SQL `COUNT`) · ไม่คืน `total` ที่ประมาณ
- query ใช้ `LIMIT ? OFFSET ?` ที่ฐานข้อมูล — ไม่ดึงทั้งตารางมาตัดใน Python
- โมเดลมักไม่ไล่หน้าเอง → ให้ตัวกรองที่ดี (สถานะ · ช่วงวันที่ · หมวด) สำคัญกว่าหน้าถัดไป

## 7 · idempotency และ tool เขียน

| ประเภท | ตัวอย่าง | ออกแบบ |
|---|---|---|
| อ่าน | `get` · `search` · `list` | ไม่มีผลข้างเคียง · `read_only_hint=True` · `idempotent_hint=True` · เรียกซ้ำกี่ครั้งก็เหมือนเดิม |
| เขียนแบบซ้ำได้ | `update_stock(sku, qty=50)` ตั้งค่า · `set_status` | รับ "ค่าปลายทาง" ไม่ใช่ "ส่วนต่าง" (`qty=50` ไม่ใช่ `delta=-3`) · `idempotent_hint=True` · เรียกซ้ำแล้วผลเท่าเดิม |
| เขียนแบบซ้ำไม่ได้ | `create_purchase_order` · `send_line_message` | รับ `idempotency_key` จากผู้เรียก · server จำ key 24 ชั่วโมง คืนผลเดิมเมื่อซ้ำ (`principle-safe-to-rerun`) · `idempotent_hint=False` |
| ทำลาย | `delete` · `cancel` · ส่งเงิน | `destructive_hint=True` · ต้องมี `confirm: Literal[True]` หรือ 2 ขั้น (เตรียม → ยืนยันด้วย id ที่ได้จากขั้นแรก) · audit log ก่อนและหลัง (`audit-trail`) |

- **tool เขียนทุกตัวอยู่หลัง env flag** (`<SERVER>_ALLOW_WRITE=1`) และลงทะเบียนในไฟล์แยก — server ที่ลูกค้ารันโดยไม่ตั้ง flag ไม่มี tool เขียนให้เห็นเลย
- โมเดลเรียก tool เขียนซ้ำได้เสมอเมื่อ connection หลุดหรือมันไม่แน่ใจ → ออกแบบให้ "เรียกซ้ำแล้วไม่เสียหาย" เป็นค่าเริ่มต้น ไม่ใช่ข้อยกเว้น
- ผลของ tool เขียนต้องคืน **สถานะหลังเขียน** (แถวที่อัปเดต · id ที่สร้าง) ไม่ใช่แค่ `"ok"` — โมเดลใช้ยืนยันกับผู้ใช้

## 8 · annotations

| annotation | ค่าเริ่มต้นตามสเปก | ตั้งเป็น | หมายเหตุ |
|---|---|---|---|
| `read_only_hint` | `false` | `True` ทุก tool อ่าน | client อาจไม่ถามยืนยันซ้ำ |
| `destructive_hint` | `true` | `False` เมื่อเขียนแบบเพิ่ม/ตั้งค่า · `True` เมื่อลบหรือเปลี่ยนกลับไม่ได้ | มีผลเฉพาะเมื่อ `read_only_hint=False` |
| `idempotent_hint` | `false` | `True` เมื่อเรียกซ้ำไม่เพิ่มผล | ดูข้อ 7 |
| `open_world_hint` | `true` | `False` เมื่อ tool คุยกับระบบปิดของเรา (ฐานข้อมูล · ERP) · `True` เมื่อออกอินเทอร์เน็ต (ค้นเว็บ · เรียก API คนอื่น) | client ใช้ตัดสินความเสี่ยง |

- Python v2: `annotations=ToolAnnotations(read_only_hint=True, open_world_hint=False)` จาก `mcp.types` · ชื่อ snake_case (v1 เป็น camelCase)
- เป็น**คำใบ้** — สเปกบอกให้ client ถือว่าไม่น่าเชื่อถือเว้นแต่ server ไว้ใจได้ · การป้องกันจริงคือบัญชีอ่านอย่างเดียว · flag · audit log

## 9 · ขนาดผลลัพธ์

- Claude Code เตือนเมื่อผล tool เกิน 10,000 token · เพดานเริ่มต้น 25,000 (`MAX_MCP_OUTPUT_TOKENS`) · ข้อความสำเร็จยาวเกิน 50,000 ตัวอักษรถูกเก็บลงไฟล์แทน (code.claude.com/docs/en/mcp · 2026-10-23)
- เป้า: ผลปกติ < 2,000 token · ผลใหญ่สุด < 10,000 — วัดด้วย Inspector แล้วจดในตาราง tool ของ README
- วิธีลด: เลือกคอลัมน์ (`fields` พารามิเตอร์เมื่อจำเป็น) · ตัดข้อความอิสระที่ 200–500 ตัวอักษรพร้อม `…` และ `truncated: true` · ไม่ส่ง base64 ของไฟล์ — ส่ง `resource_link` หรือ path ให้ client อ่านเอง
- ถ้าโมเดลต้องสรุปข้อมูลใหญ่ ให้ tool สรุปให้ (`count` · `sum` · `group by`) แทนส่งแถวดิบ

## 10 · ตัวอย่างชุด tool คลังสินค้า

ชุดจริงสำหรับระบบคลังของลูกค้า SME (ต่อยอดจาก `assets/inventory-mcp/` ที่มี 3 ตัวแรก):

| # | tool | ประเภท | annotations | พารามิเตอร์หลัก |
|---|---|---|---|---|
| 1 | `inventory_search_products` | อ่าน | read_only · idempotent | `query_text` · `category?` · `limit` · `offset` |
| 2 | `inventory_get_stock` | อ่าน | read_only · idempotent | `sku` |
| 3 | `inventory_list_low_stock` | อ่าน | read_only · idempotent | `limit` |
| 4 | `inventory_get_movements` | อ่าน | read_only · idempotent | `sku` · `since` (ISO) · `limit` |
| 5 | `inventory_get_supplier` | อ่าน (มีข้อมูลติดต่อ → PDPA) | read_only · idempotent | `supplier_code` · เหตุผลที่ต้องเห็นเบอร์ติดต่อเขียนใน README |
| 6 | `inventory_set_reorder_point` | เขียนแบบซ้ำได้ (flag) | destructive=False · idempotent | `sku` · `reorder_point` |
| 7 | `inventory_create_purchase_order` | เขียนซ้ำไม่ได้ (flag) | destructive=False · idempotent=False | `supplier_code` · `lines[]` · `idempotency_key` |
| 8 | `inventory_cancel_purchase_order` | ทำลาย (flag) | destructive=True | `po_id` · `confirm: Literal[True]` · `reason` |

8 tool · ชื่อแบบแผนเดียว · 5 อ่าน 3 เขียน · ทุกตัวมี `limit` เมื่อคืนรายการ · tool 6–8 ลงทะเบียนเฉพาะเมื่อ `INVENTORY_ALLOW_WRITE=1`

## 11 · แหล่งที่มา

| เรื่อง | ที่มา (ตรวจ 2026-10-23) |
|---|---|
| tool definition · result · `isError` 2 ชั้น · annotations default · server MUST validate | modelcontextprotocol.io/specification/2025-06-18/server/tools (รุ่น 2026-07-28 ขยาย schema ให้รับ JSON Schema 2020-12 ทุก keyword — changelog) |
| `ToolError` vs `MCPError` · structured output wrapping | py.sdk.modelcontextprotocol.io → servers/handling-errors · servers/structured-output · servers/tools |
| ชื่อ `{service}_{action}_{resource}` · pagination 20–50 · `response_format` · error มีขั้นถัดไป · annotations table · ชื่อ server | github.com/anthropics/skills → skills/mcp-builder/reference/mcp_best_practices.md (Apache-2.0 · เรียบเรียงใหม่) |
| เพดาน token ของผล tool | code.claude.com/docs/en/mcp |
| idempotency key · 2 ขั้นสำหรับงานทำลาย | แนวทางทีม + `principle-safe-to-rerun` · ไม่ใช่ข้อกำหนดสเปก |
| ตัวเลขเป้า < 2,000 / < 10,000 token · พารามิเตอร์ ≤ 6 · ข้อความอิสระ 200–500 ตัว | ค่าตั้งต้นของทีม · ยังไม่ได้วัดกับงานจริง |
