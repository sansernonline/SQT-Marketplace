# technical-writer templates — README · tutorial · API reference · release notes

**Contents:** README · Tutorial Template · API Reference Template · Release Notes Template

Open when you actually have to write this kind of document · put `(รอยืนยัน)` (to be confirmed) on any part you do not know.

## Standard Outputs

### README

There is no README template here — use the single template of `project-bootstrap` (`SKILL.md` item 2 and `assets/starter-files.md`). The 15-section skeleton (9 always present · 6 present when the project has that thing) is in `references/readme-skeleton.md` · commands per language are in `references/readme-by-stack.md`.

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes must always come before the other sections (right after Highlights) — the full release notes rules are in the skill `release-notes`.

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (Thai)

> Same structure as the English version · wording at news register (`human-writing` `references/thai-grammar.md` section 4): no first person · each line has subject + verb + object · numbers must be measured, and if there are none, leave them out · right/wrong examples are in the skill `release-notes` item 4.

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````
