---
name: line-richmenu
description: Use when a LINE OA needs a rich menu built. Image sizes and limits, tap areas, JSON, and API calls to create, upload, set default and link per user.
---

# LINE Rich Menu

The rich menu is the shop front. 6 clear buttons work better than 12 tiny ones.

## 1. Hard limits

| Item | Limit |
|---|---|
| Image format | JPEG or PNG |
| Image size (px) | full **2500×1686**, compact **2500×843** (also 1200×810, 1200×405, 800×540, 800×270) |
| File size | max **1 MB** |
| Tap areas | max **20** per menu (bounds x, y, width, height in image pixels) |
| `chatBarText` | max 14 characters (รอยืนยัน) |
| Rich menus per channel | 1,000 (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · https://developers.line.biz/en/reference/messaging-api/ (rich menu image requirements)

What a user sees, highest priority first: **per-user menu (API) > default menu (API) > default menu set in OA Manager**.

## 2. No-code or API?

| Need | Use |
|---|---|
| 1 menu for everyone, ≤ 6 buttons, from a template | OA Manager → Rich menus (no developer needed) |
| Different menus for members and guests, tabs, A/B | Messaging API, per-user link or rich menu alias |
| Button sends a silent postback the bot handles | API (OA Manager offers text, link, coupon and similar) |

## 3. Design rules

1. Max 6 buttons on full size, 3 on compact: เช็คราคา · สั่งซื้อ · ติดตามพัสดุ · โปรโมชัน · ที่ตั้ง/เวลาทำการ · ติดต่อเจ้าหน้าที่.
2. 1–2 words plus an icon per button; Thai text at least ~60 px tall on the 2500 px image so it reads on a phone.
3. Primary action biggest (e.g. a double-width cell); "ติดต่อเจ้าหน้าที่" always present.
4. Keep 30–50 px inside each cell edge free of text.
5. Each button → `message` (a keyword the bot knows, see `line-chatbot`), `postback`, `uri` (https:// or tel:), or `richmenuswitch` for tabs.

## 4. API sequence

```
POST   https://api.line.me/v2/bot/richmenu/validate                      check the JSON
POST   https://api.line.me/v2/bot/richmenu                               create → {richMenuId}
POST   https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content     upload (Content-Type image/png or image/jpeg)
POST   https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}         set default for everyone
POST   https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}    link to one user (e.g. member)
DELETE https://api.line.me/v2/bot/user/{userId}/richmenu                 unlink → user falls back to default
```

All calls need `Authorization: Bearer {channel access token}`. Many users at once: `POST /v2/bot/richmenu/bulk/link` (up to 500 user IDs per call, รอยืนยัน).

A ready JSON for a 6-button full menu with the grid coordinates: [references/richmenu-6.md](references/richmenu-6.md).

## 5. Workflow

1. Pick the 6 main customer tasks from chat history.
2. Designer brief — size, grid, safe margins, brand colours, text per cell (if installed: `graphic-design`, software-company).
3. Export ≤ 1 MB (PNG-8 or JPEG quality ~80).
4. Validate → create → upload → set default → test on iOS and Android.
5. Text fallback: the greeting message lists the same 6 keywords.
6. Seasonal menu: create the new one first, switch default, then delete the old one.

## Related

`line-oa-setup` · `line-chatbot` · `line-broadcast`.
