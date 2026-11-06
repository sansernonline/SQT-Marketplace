---
name: design-system
description: Use when authoring design tokens (primitive, semantic, component), CSS variables, state tables or a Tailwind theme. Reading existing code → ui-craft
---

# Design System — token สามชั้นและสเปกคอมโพเนนต์

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **กฎข้อเดียว:** โค้ดหน้าจอห้ามมีสีหรือระยะดิบ ทุกค่าอ้าง token · token มี 3 ชั้น: **primitive** (ค่าดิบ `--color-blue-600`) → **semantic** (หน้าที่ `--color-primary`) → **component** (`--button-bg`) · เปลี่ยนธีมแก้ชั้นกลางที่เดียว

อยู่ใน plugin `software-company` · ลอกและปรับจาก ui-ux-pro-max-skill (MIT · commit `b7d5353` · ดู 2026-11-05) · ต้นฉบับอังกฤษคงไว้ที่ `data/upstream/` ไม่แก้ · สัญญาอนุญาต `data/upstream/LICENSE`

## ใช้ตัวไหน

| งาน | ใช้ |
|---|---|
| มีโค้ดอยู่แล้ว อยากรู้ว่าใช้ค่าอะไร หลุดสเกลตรงไหน | `ui-craft` → `scripts/design_tokens.py` (อ่านโค้ด → `docs/DESIGN.md`) |
| เขียน token ใหม่ สร้าง CSS จาก JSON ตรวจว่าโค้ดไม่มีค่าดิบ | **skill นี้** |
| สเกลระยะและขนาดตัวอักษร | `ui-craft` ข้อ 1–2 (ใช้สเกลเดียวกับ token ที่ตั้ง) |
| เลือกสีและฟอนต์เริ่มต้น | `design-direction-lookup` |
| สีและฟอนต์ของแบรนด์ที่มีเอกสารแล้ว | `brand-guidelines` (plugin `graphic-design`) → ซิงก์เข้าไฟล์ token ที่นี่ |

## ขั้นตอน

1. **เริ่มจากแม่แบบ** `templates/design-tokens-starter.json` (มี 3 ชั้นครบ) · ใส่สีแบรนด์ที่ชั้น primitive · ระยะใช้สเกล 4 8 12 16 24 32 48 64 ของ `ui-craft`
2. **สร้าง CSS:** `node scripts/generate-tokens.cjs --config <tokens.json> -o <tokens.css>` (ทดสอบ 2026-11-05 กับแม่แบบ ได้ `:root` ครบ)
3. **ตรวจโค้ด:** `node scripts/validate-tokens.cjs --dir src/` → รายงานสีและ px ดิบที่ควรเป็น token (ทดสอบ 2026-11-05: เจอ hex 1 · px 1 ในไฟล์ตัวอย่าง) · ผลเป็นเหตุผลให้ดูซ้ำ ไม่ใช่ให้แก้ทุกบรรทัด
4. **สถานะคอมโพเนนต์:** ปุ่ม · input · การ์ด ทำตารางสถานะ default / hover / active / focus / disabled ตาม `data/upstream/states-and-variants.md` ก่อนเขียน CSS
5. **Tailwind:** `data/upstream/tailwind-integration.md` — ผูก token เข้า theme · สีต้องมาจากแบรนด์ ไม่ใช่ชุดตั้งต้นของ framework (`no-ai-look`)

สคริปต์เป็น Node ไม่ติดตั้งแพ็กเกจเพิ่ม ไม่ต่อเน็ต

## ไฟล์ต้นฉบับ

| หัวข้อ | ไฟล์ใน `data/upstream/` |
|---|---|
| ภาพรวมสามชั้น | `token-architecture.md` |
| ค่าดิบ · หน้าที่ · คอมโพเนนต์ | `primitive-tokens.md` · `semantic-tokens.md` · `component-tokens.md` |
| สเปกคอมโพเนนต์และสถานะ | `component-specs.md` · `states-and-variants.md` |
| Tailwind | `tailwind-integration.md` |

## ไม่ได้ลอกมา (เหตุผล)

- ระบบสร้างสไลด์ (`search-slides.py` · `generate-slide.py` · `slide-token-validator.py` · CSV `slide-*`): CSV มีอยู่แล้วใน `design-direction-lookup/data/upstream/uipro/` · ส่วนที่เหลือซ้ำกับ `presentation-design` และ `html-slide-deck`
- `fetch-background.py`: ดึงภาพจากเน็ตตอนรัน ขัดกฎไม่ดาวน์โหลดตอนรัน
- ตัวอย่างในต้นฉบับใช้สีฟ้า-ม่วงแบบ SaaS เป็นแค่รูปแบบข้อมูล ไม่ใช่ค่าแนะนำ

## ตรวจก่อนส่ง

1. `validate-tokens.cjs` ไม่เหลือสีหรือ px ดิบในโค้ดใหม่ (ยกเว้นที่จดเหตุผลไว้)
2. ทุกคู่ semantic ข้อความ/พื้นผ่าน 4.5:1 ทั้งโหมดสว่างและมืด
3. คอมโพเนนต์ทุกตัวมีครบ 5 สถานะ

## ที่มา

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/design-system` · MIT · commit `b7d5353` · ดู 2026-11-05 · ไฟล์ใน `data/upstream/` `scripts/` `templates/` คัดลอกไม่แก้
