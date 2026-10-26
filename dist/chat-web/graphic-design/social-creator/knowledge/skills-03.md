# skill: line-richmenu

Use when a LINE OA needs a rich menu built (image sizes, tap areas, JSON, API calls).

# LINE Rich Menu

The rich menu is the shop front. 6 clear buttons work better than 12 tiny ones.

## 1. Hard limits

Image sizes are also kept in `social-formats` with source and check date — if the two differ, trust that one and re-check the LINE page.

| Item | Limit |
|---|---|
| Image format | JPEG or PNG |
| Image size (px) | full **2500×1686**, compact **2500×843** (also 1200×810, 1200×405, 800×540, 800×270). The API accepts any size inside its limits: width 800–2500, height ≥ 250, width/height ≥ 1.45 · the sizes listed are the ones the OA Manager templates use |
| File size | max **1 MB** |
| Tap areas | max **20** per menu (bounds x, y, width, height in image pixels) |
| `chatBarText` | max **14** characters |
| Rich menus per channel | **1,000** |
| Bulk link or unlink | max **500** user IDs per call |

ตรวจล่าสุด 2026-10-26 (ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-26) · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ (หัวข้อ Requirements for rich menu image · rich menu object · bulk link) · https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · ค่าในตารางนี้เป็นเพดานที่ API ของ LINE กำหนดเอง จึงใช้หน้าอ้างอิง API ทางการเป็นแหล่งหลัก (เกินเพดาน API ตอบ error ทันที)

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
5. Each button → `message` (a keyword the bot knows, see `e-commerce:line-chatbot` if installed), `postback`, `uri` (https:// or tel:), or `richmenuswitch` for tabs.

## 4. API sequence

```
POST   https://api.line.me/v2/bot/richmenu/validate                      check the JSON
POST   https://api.line.me/v2/bot/richmenu                               create → {richMenuId}
POST   https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content     upload (Content-Type image/png or image/jpeg)
POST   https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}         set default for everyone
POST   https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}    link to one user (e.g. member)
DELETE https://api.line.me/v2/bot/user/{userId}/richmenu                 unlink → user falls back to default
```

All calls need `Authorization: Bearer {channel access token}`. Many users at once: `POST /v2/bot/richmenu/bulk/link` (up to 500 user IDs per call · ตรวจล่าสุด 2026-10-26 ในหน้าอ้างอิง API).

A ready JSON for a 6-button full menu with the grid coordinates: [references/richmenu-6.md](references/richmenu-6.md).

## 5. Workflow

1. Pick the 6 main customer tasks from chat history.
2. Designer brief — size, grid, safe margins, brand colours, text per cell · no brand yet → **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `app` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้.
3. Export ≤ 1 MB (PNG-8 or JPEG quality ~80).
4. Validate → create → upload → set default → test on iOS and Android.
5. Text fallback: the greeting message lists the same 6 keywords.
6. Seasonal menu: create the new one first, switch default, then delete the old one.

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there.

## Related

`line-oa-setup` · `line-chatbot` · `line-broadcast` (plugin `e-commerce`, if installed).


## reference: richmenu-6.md

# Six-button full rich menu (2500×1686)

Grid: 3 columns × 2 rows. Column widths 833 / 834 / 833, row height 843.

| Cell | x | y | width | height | Label | Action |
|---|---|---|---|---|---|---|
| A | 0 | 0 | 833 | 843 | เช็คราคา | message "ราคา" |
| B | 833 | 0 | 834 | 843 | สั่งซื้อ | uri shop |
| C | 1667 | 0 | 833 | 843 | ติดตามพัสดุ | message "พัสดุ" |
| D | 0 | 843 | 833 | 843 | โปรโมชัน | message "โปร" |
| E | 833 | 843 | 834 | 843 | ที่ตั้ง | uri map |
| F | 1667 | 843 | 833 | 843 | ติดต่อเจ้าหน้าที่ | message "ติดต่อเจ้าหน้าที่" |

```json
{
  "size": { "width": 2500, "height": 1686 },
  "selected": true,
  "name": "main-menu-2026-10",
  "chatBarText": "เมนู",
  "areas": [
    { "bounds": { "x": 0,    "y": 0,   "width": 833, "height": 843 }, "action": { "type": "message", "text": "ราคา" } },
    { "bounds": { "x": 833,  "y": 0,   "width": 834, "height": 843 }, "action": { "type": "uri", "uri": "https://example.co.th/shop" } },
    { "bounds": { "x": 1667, "y": 0,   "width": 833, "height": 843 }, "action": { "type": "message", "text": "พัสดุ" } },
    { "bounds": { "x": 0,    "y": 843, "width": 833, "height": 843 }, "action": { "type": "message", "text": "โปร" } },
    { "bounds": { "x": 833,  "y": 843, "width": 834, "height": 843 }, "action": { "type": "uri", "uri": "https://maps.app.goo.gl/xxxx" } },
    { "bounds": { "x": 1667, "y": 843, "width": 833, "height": 843 }, "action": { "type": "message", "text": "ติดต่อเจ้าหน้าที่" } }
  ]
}
```

`selected: true` opens the menu automatically when the chat opens. Compact (2500×843): 1 row, 3 cells 833 / 834 / 833 wide × 843 high.


---

# skill: youtube-thumbnail

Use when a YouTube video needs a thumbnail (ภาพปกคลิป), Thai text on it reads badly on a phone, or the user wants to test several thumbnails.

# youtube-thumbnail — ภาพปกคลิป YouTube ที่อ่านออกบนจอมือถือ

อยู่ใน plugin `graphic-design` · ถ้อยคำเขียนตาม `human-writing` · เจ้าของคือ agent `social-creator` · ขนาดของทุกแพลตฟอร์มอยู่ที่ `social-formats` ไฟล์ `references/platform-sizes.md` หัวข้อ YouTube (หน้านี้คัดมาเฉพาะของ thumbnail)

> **กฎข้อเดียว:** ปกต้องอ่านรู้เรื่องที่ขนาดเท่าแสตมป์ · ย่อภาพเหลือกว้าง 168 px (ราวขนาดในรายการแนะนำบนมือถือ · ค่าของเรา ยังไม่ได้วัดกับแอปทุกรุ่น) แล้วยังอ่านคำบนปกออกและรู้ว่าคลิปเรื่องอะไร จึงส่งได้

## ใช้เมื่อ

- ทำภาพปกคลิป YouTube ใหม่ หรือแก้ปกที่คนไม่กด
- ข้อความไทยบนปกเล็กไป จม หรือวรรณยุกต์ชนกัน
- อยากทดสอบหลายปกว่าแบบไหนดีกว่า

## ไม่ใช้เมื่อ (ใช้ตัวอื่นแทนหรือคู่กัน)

| งาน | ใช้ |
|---|---|
| ปก TikTok · Reels · โพสต์ หรือแบนเนอร์ช่อง | `social-formats` |
| บทพูดหรือ hook ช่วง 5 วินาทีแรกของคลิป | `speaking-script` · `video-script-to-clip` |
| ภาพคนหรือฉากที่ต้องสร้างด้วย AI | `brief-to-image` · `image-generation` |
| ปกทั้งซีรีส์ต้องหน้าตาเป็นชุด | `style-consistency` · สีและฟอนต์จาก `brand-kit` |
| ตรวจความสวยก่อนส่ง | `design-review` |
| เริ่มออกแบบปกที่ยังไม่มีแนว | **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `social` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้ |

## ขั้นตอน

1. **เลือกเรื่องเดียวที่ปกต้องบอก** ให้ปกกับชื่อคลิปช่วยกันเล่า ไม่ซ้ำคำกัน · ชื่อคลิปบอกรายละเอียด ปกบอกอารมณ์หรือผลลัพธ์
2. **ตั้งหน้า 1280 × 720 (16:9)** แล้วส่งออกเป็น JPG หรือ PNG · ภาพต้นทางใหญ่กว่านั้นได้ถึง 3840 × 2160
3. **ข้อความไม่เกิน 3–4 คำ** ตัวหนา สูงอย่างน้อยราว 1/6 ของความสูงภาพ (ค่าของเรา) · ภาษาไทยเว้นที่บนล่างของบรรทัดให้วรรณยุกต์และสระ (ระยะบรรทัดอย่างน้อย 1.3 เท่าของขนาดตัวอักษร · ค่าของเรา) · ใช้ฟอนต์ไทยที่มีน้ำหนัก Bold หรือ Black จริง ไม่ใช่ตัวปกติที่ทำหนาเทียม
4. **คอนทราสต์:** ข้อความกับพื้นหลังต่างกันอย่างน้อย 4.5:1 (เกณฑ์ WCAG 2.2 ของตัวอักษรปกติ ใช้ตัวเลขเดียวกับ `brand-kit`) · พื้นรก → ใส่ขอบตัวอักษร เงา หรือแถบสีหลังข้อความ
5. **เว้นมุมขวาล่าง** YouTube วางป้ายความยาวคลิปทับมุมนั้น (เห็นได้บนทุกหน้ารายการ) · ข้อความและหน้าคนอยู่ทางซ้ายหรือกลาง
6. **คลิปแนวตั้ง:** YouTube สร้างปก 4:5 ให้อัตโนมัติจากปก 16:9 ในหน้าแรกและหน้าติดตาม · วางเรื่องสำคัญไว้กลางภาพให้รอดการครอป
7. **ย่อดูที่กว้าง 168 px** (ด้วยสคริปต์หรือโปรแกรมใดก็ได้) แล้วตอบ 2 ข้อ: อ่านข้อความออกไหม · รู้ไหมว่าเรื่องอะไร · ไม่ผ่าน → ตัดคำ ขยายตัวอักษร หรือลดองค์ประกอบ
8. **ทดสอบหลายปก (Test & compare)** เมื่อช่องเปิดใช้ได้ (ตารางข้างล่าง) · ทำ 2–3 แบบที่ต่างกันจริง 1 เรื่อง (หน้าคน กับ ภาพสินค้า · ข้อความ กับ ไม่มีข้อความ) ไม่ใช่ต่างแค่สี

## ข้อกำหนดของ YouTube

| เรื่อง | ค่า | สถานะ |
|---|---|---|
| ขนาด | 16:9 · ใหญ่สุด 3840 × 2160 · กว้างอย่างน้อย 640 · ทำงานที่ 1280 × 720 · ปก Shorts 9:16 ใหญ่สุด 2160 × 3840 | หน้าทางการแหล่งเดียว (รอยืนยัน) · หน้าทางการไม่ระบุ 1280 × 720 และ GIF แล้ว |
| ไฟล์ | JPG หรือ PNG · ไม่เกิน 2 MB เมื่ออัปจากมือถือ · 50 MB จากคอมพิวเตอร์ | หน้าทางการแหล่งเดียว (รอยืนยัน) |
| สิทธิ์อัปโหลดปกเอง | ต้องยืนยันบัญชีก่อน · มีจำนวนอัปโหลดต่อวันจำกัด | หน้าทางการ |
| Test & compare: ทดสอบได้กี่แบบ | สูงสุด **3** แบบ (ปก · ชื่อ หรือทั้งคู่) | ยืนยัน 4 แหล่ง |
| Test & compare: ใครใช้ได้ | ช่องที่เปิด advanced features · ทำใน YouTube Studio บนคอมพิวเตอร์ · ใช้ไม่ได้กับ Shorts · คลิปสำหรับเด็ก · คลิปสำหรับผู้ใหญ่หรือ 18+ · คลิปส่วนตัว · ไลฟ์ที่ตั้งเวลา · Premiere ที่ยังไม่จบ | หน้าทางการ + 1 แหล่ง |
| Test & compare: ตัดสินอย่างไร | ใช้ **ส่วนแบ่งเวลาดู (watch time share)** ไม่ใช่อัตราการกด · ไม่มีผู้ชนะชัด → แสดงแบบแรกที่อัปโหลด · ผลขึ้นเป็น Winner หรือ Preferred | ยืนยัน 3 แหล่ง |
| Test & compare: ใช้เวลานานเท่าไร | จบภายใน 2 สัปดาห์ บ่อยครั้งไม่กี่วัน | ยืนยัน 3 แหล่ง |

ผลทดสอบตัดสินด้วยเวลาดู ปกที่ล่อให้กดแต่คนออกเร็วจึงแพ้ · อย่าสัญญาผู้ใช้ว่า "ยอดกดจะเพิ่ม"

## ตัวอย่างจริง

โจทย์: ช่องสอนทำอาหาร คลิป "ต้มยำกุ้งน้ำข้น 15 นาที"

| ขั้น | ทำ | ผล |
|---|---|---|
| เรื่องเดียว | ปกบอก "เร็ว" ชื่อคลิปบอกเมนู | ข้อความบนปก "15 นาที" 2 คำ |
| วาง | ชามต้มยำทางซ้าย หน้าคนทำทางขวาบน มุมขวาล่างว่าง | ป้ายความยาวคลิปไม่ทับอะไร |
| ย่อดู 168 px | "15 นาที" อ่านออก · เห็นชามสีส้ม | ผ่าน |
| ทดสอบ | แบบ A มีหน้าคน · แบบ B ชามอย่างเดียว | ตั้ง Test & compare แล้วรอผลภายใน 2 สัปดาห์ |

## ตรวจก่อนส่ง

- [ ] 16:9 · 1280 × 720 ขึ้นไป · JPG/PNG ไม่เกิน 2 MB (อัปได้ทั้งมือถือและคอม)
- [ ] ข้อความ ≤ 4 คำ คอนทราสต์ ≥ 4.5:1 · วรรณยุกต์ไทยไม่ชนขอบหรือบรรทัดอื่น
- [ ] มุมขวาล่างว่าง · คลิปแนวตั้งมีเรื่องสำคัญอยู่กลางภาพ
- [ ] ย่อเหลือกว้าง 168 px แล้วยังอ่านออก
- [ ] ปกตรงกับเนื้อคลิปจริง ไม่หลอกให้กด · ภาพ ฟอนต์ และหน้าคนมีสิทธิ์ใช้
- [ ] ผ่าน `no-ai-look` ข้อ 3

## ที่มา (ตรวจล่าสุด 2026-10-26 · ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-26)

- YouTube Help: [Add video thumbnails](https://support.google.com/youtube/answer/72431) (ขนาด · ไฟล์ · ยืนยันบัญชี · ปก 4:5 ของคลิปแนวตั้ง) · [Test & compare thumbnails and titles](https://support.google.com/youtube/answer/13861714) (ทางการ)
- Test & compare ตรงกับ thumbnailtest.com · digit.in · streamlabs.com (thumbnailtest.com ยังเขียนว่าใช้ได้เฉพาะผู้ทดสอบรุ่นเบต้า ซึ่งเก่าแล้ว)
- คอนทราสต์: [WCAG 2.2 Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (อ้างผ่าน `brand-kit` ตรวจ 2026-10-06)
- ค่าที่เขียนว่า "ค่าของเรา" (กว้าง 168 px · ตัวอักษร 1/6 ของความสูง · ระยะบรรทัด 1.3 · มุมขวาล่าง) เป็นแนวทางที่ใช้ภายใน ยังไม่ได้วัดกับแอปจริง
