# skill: graphic-design

Use for a one-off logo or poster, not a full brand kit

# Graphic Design

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **กฎข้อเดียวของ skill นี้:** เขียนทิศทางเป็นไฟล์ก่อน แล้วค่อยแตะพิกเซลแรก
> ทิศทางที่ไม่ได้เขียนไว้ จะถูกลืมตอนทำแผ่นที่ 3

---

## เมื่อไหร่ใช้ skill นี้

โลโก้ · ระบบสีและตัวอักษรของแบรนด์ · โปสเตอร์ · ใบปลิว · โพสต์โซเชียล ·
rich menu ของ LINE Official Account (LINE OA) · ฉลากสินค้า · นามบัตร · ภาพปก

รวมถึงตอนรีวิวงานที่ "ดูเหมือน AI ทำ" แต่บอกไม่ถูกว่าเพราะอะไร

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| หน้าจอแอป เว็บ มือถือ Windows | `ui-craft` + skill แพลตฟอร์ม |
| เลย์เอาต์สไลด์ | `presentation-design` |
| หน้าตาไฟล์ Word / PowerPoint | `branded-document-design` |
| ไดอะแกรมซอฟต์แวร์ | `software-diagrams` |
| กราฟข้อมูล | `web-app-design` → `references/tokens.md` หัวข้อ "สีข้อมูล (กราฟ)" |
| rich menu ของ LINE OA (ขนาด · พื้นที่กด · JSON) | `graphic-design:line-richmenu` (ถ้าติดตั้ง) |
| ภาพจาก AI | `image-generation` · `graphic-design:brief-to-image` (ถ้าติดตั้ง) |

**ติดตั้ง plugin `graphic-design` อยู่:** งานออกแบบลึก ๆ (ชุดแบรนด์ · ชุดแคมเปญ · ภาพ AI · วิดีโอ · ตรวจงานออกแบบ) ใช้ `graphic-design:brand-kit` · `graphic-design:campaign-set` · `graphic-design:design-review` และขนาดแต่ละแพลตฟอร์มจาก `graphic-design:social-formats` · ไม่มี plugin นั้น → ทำตาม skill นี้ต่อไป

---

## 1 · ลำดับการทำงาน

0. **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `logo` · `social` · `illustration` ตามงาน แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
1. **เขียนทิศทางลงไฟล์** — คัดลอก `assets/brand-direction.md` ไปกรอก
2. **เลือกตำแหน่งบน 4 แกน** (ข้อ 2) แล้วเขียนเหตุผลแกนละ 1 บรรทัด
3. **เขียนรายการสิ่งที่ไม่เอา** — ส่วนที่มีประโยชน์ที่สุดในไฟล์ทั้งหมด
4. ทำงานจริง
5. **รอบสองต้องเป็นการตัดออก ไม่ใช่การเพิ่ม** (ข้อ 8)
6. เรนเดอร์ดูขนาดจริง (ข้อ 8)

**ข้อ 1–3 ใช้เวลาไม่เกิน 15 นาที** และเป็นสิ่งเดียวที่กันไม่ให้งานชิ้นที่ 2 ถึง 10
หลุดไปคนละทางกับชิ้นแรก

> ทำงานให้ SQT หรือโปรเจกต์ที่มีไฟล์ทิศทางอยู่แล้ว — **อ่านไฟล์นั้น ไม่ต้องเขียนใหม่**
> ถ้าเนื้องานขัดกับไฟล์ ให้ทักก่อน อย่าแก้ไฟล์เงียบ ๆ

---

## 2 · สี่แกน — เลือกตำแหน่ง ไม่ใช่บรรยายความรู้สึก

เลือกแกนละ 1 ตำแหน่ง **บอกผู้ใช้ก่อนเริ่มทำ เพื่อให้แย้งได้**

| แกน | ตำแหน่ง |
|---|---|
| **น้ำเสียง** | ทางการ · เป็นกันเอง · ขี้เล่น · ท้าทาย |
| **ความประณีต** | เรียบจัด · เนี้ยบมาตรฐาน · แน่นแบบคุมได้ · แน่นแบบปล่อย |
| **ความสัมพันธ์กับผู้ชม** | ผู้รู้ · เพื่อนร่วมทาง · เพื่อน · โค้ช |
| **ความทะเยอทะยาน** | ใช้งานได้ · ตั้งใจ · ต้องจำได้ |

**วิธีเลือก:** ดูว่าคู่แข่งในหมวดเดียวกันอยู่ตรงไหน แล้วเลือกให้ต่าง —
ถ้าทั้งหมวดดูน่าเบื่อ ความขี้เล่นคือความต่าง ส่วนถ้าทั้งหมวดตะโกนแข่งกัน ความเรียบคือความต่าง

**งานที่เป็นแอป** ให้เทียบตำแหน่งที่เลือกกับบุคลิกแอป 6 แบบใน `ui-craft` → `references/app-character.md` เช่น แอปการเงินไม่ควรอยู่ตำแหน่ง "ขี้เล่น"

**คู่ที่ขัดกันเอง** ให้ทักก่อนทำ: ใช้งานได้ + ท้าทาย · ผู้รู้ + ใช้งานได้ (มักออกมาเป็นน้ำเสียงสั่งสอน)

---

## 3 · ระบบสีและตัวอักษร

**สี 5–8 ค่าพอ** — แบรนด์หลัก 1 · รอง 1–3 · กลาง (เทา/ขาว/ดำ) · สีสถานะ

- **สีกลางกินพื้นที่ 80%** ของงาน ส่วนที่เหลือเป็นสีแบรนด์
- บันทึกทุกค่าเป็น **Hex · RGB · CMYK · Pantone** ถ้ามีงานพิมพ์
- ความต่างของสีข้อความกับพื้น (contrast) ต้องผ่าน **4.5:1** สำหรับข้อความปกติ และ **3:1** สำหรับตัวใหญ่หรือหนา
- ผู้ชายราว 8% ตาบอดสี — **ห้ามให้สีเป็นตัวบอกความหมายอย่างเดียว**

**ตัวอักษร 2 ตระกูลพอ** — ตระกูลเดียวที่มีหลายน้ำหนักยิ่งดี

ใช้สเกลขนาด 5–8 ขั้นที่อัตราส่วนคงที่ และน้ำหนัก 2–3 ค่า **ห้ามใช้ตัวหนาปลอม**
ที่โปรแกรมสร้างเอง เพราะไทยจะเบลอ (ข้อ 6)

---

## 4 · โลโก้

โลโก้มี 5 สถาปัตยกรรม (ตัวอักษรล้วน · สัญลักษณ์ + ตัวอักษร · สัญลักษณ์ล้วน · ตัวอักษรเป็นสัญลักษณ์ · อักษรย่อ) · **ชุดที่ใช้งานได้จริงต้องมี 3 แบบ** — ตัวหลักสำหรับพื้นที่กว้าง · อักษรย่อสำหรับช่องสี่เหลี่ยม · ตัวอักษรเป็นสัญลักษณ์สำหรับ favicon และงานปัก

ตารางห้าสถาปัตยกรรมพร้อมตัวอย่าง · ตารางทดสอบบริบท · วิธีทำโลโก้ให้ "ว้าว" · รัศมีมุมของรูปทรงแท่ง → [`references/logo-design.md`](references/logo-design.md) — เปิดเมื่อออกแบบหรือตรวจโลโก้

**เก็บไฟล์ที่ `assets/` ที่รากโปรเจกต์** ทั้งไฟล์ต้นทาง `.svg` ทุกตัวและไฟล์ export ทุกขนาด (`.png` · favicon `.ico`) แล้วตั้งชื่อแบบ `<ชื่อแบรนด์>-<แบบ>-<ขนาด>.<นามสกุล>` ส่วนงานที่ไม่ใช่โลโก้ (โปสเตอร์ rich menu) ให้ไปที่ `assets/<ชื่องาน>/` และไฟล์ร่างกับตัวเลือกที่ไม่ได้ใช้ให้ย้ายลง `_to_delete/`

### ทดสอบบริบท — ตกเกิน 2 ข้อ ตัดทิ้ง

โลโก้ต้องผ่านบริบทจริง **ตกเกิน 2 ข้อ ตัดทิ้ง** — favicon 16px · ไอคอนแอป 28px · ปักเสื้อ 1.5 นิ้ว · ขาวดำ · กลับสี · ป้ายหน้าร้าน · รูปโปรไฟล์ 60–80px (ตัวเลขข้อจำกัดของแต่ละบริบท → `references/logo-design.md`)

### สี่ข้อทดสอบความเรียบ

1. **หรี่ตา** — ตัดตัวอักษรออก เงาที่เหลือยังจำได้ไหม
2. **วาดจากความจำ** — ให้คนดู 30 วินาทีแล้ววาด ออกมาใกล้เคียงไหม
3. **หนึ่งสี** — พิมพ์ขาวดำขนาด 1 นิ้ว ยังอ่านออกไหม
4. **ซ้ำใคร** — ค้นภาพ "โลโก้ + ชื่อหมวดธุรกิจ" ถ้าเจอที่คล้ายกันตั้งแต่ 3 อันขึ้นไป ให้ถือว่าซ้ำ

**โลโก้สื่อได้ 1 ความคิด บางทีได้ 2 แต่ 3 ถือว่ามากไป**

**ทำโลโก้ให้ "ว้าว":** ให้อย่างน้อย 1 แนวมาจากสิ่งที่ผู้ใช้เห็นทุกวัน · ทำ 3 แนวพร้อมกันแล้วเลือกจากภาพจริง · ทำแผ่นตัวอย่าง (preview sheet) ทุกรอบ · แปลงชื่อเป็นเส้นจากฟอนต์เปิด (SIL Open Font License (OFL)) เท่านั้น · ส่งออกครบชุดเดียวกันทุกครั้ง (ชุดเดียวอยู่ใน `references/sizes-and-print.md` ข้อ 4) · รูปทรงแท่งใช้**เหลี่ยมขอบมนรัศมี 0.25–0.35 ของความหนาแท่ง** → ขั้นตอนเต็มและตารางรัศมีใน [`references/logo-design.md`](references/logo-design.md)

---

## 5 · ขนาดงานพิมพ์และโซเชียล

ตัวเลขทั้งหมดอยู่ใน **`references/sizes-and-print.md`** (ฉบับสำรอง — ติดตั้ง plugin `graphic-design` อยู่ → ต้นฉบับขนาดแพลตฟอร์มคือ `graphic-design:social-formats`) — LINE OA, TikTok, Facebook,
Instagram, งานพิมพ์ (ระยะตัดตก ความละเอียด ระบบสี)

**3 ข้อที่พลาดบ่อยสุด:**

- **ระยะตัดตก 3 มม. รอบด้าน** และของสำคัญห่างขอบตัดเข้ามาอีก 3–5 มม.
- **300 จุดต่อนิ้ว ที่ขนาดจริง** ไม่ใช่ 300 จุดต่อนิ้วที่ขนาดย่อแล้วขยาย
- **ดำสนิทในงานพิมพ์ไม่ใช่ K100** — พื้นดำใหญ่ ๆ ใช้ C60 M40 Y40 K100
  ส่วนตัวอักษรเล็กใช้ K100 ล้วน ไม่งั้นพิมพ์เหลื่อมแล้วขอบเบลอ

---

## 6 · ภาษาไทยในงานกราฟิก

**ส่วนนี้ไม่มีในคู่มือออกแบบสากลเล่มไหน** และเป็นจุดที่งานไทยพังบ่อยที่สุด

### สระและวรรณยุกต์ซ้อนสองชั้น

กฎที่ห้ามพลาด:

- **ความสูงบรรทัดอย่างน้อย 1.5** (เนื้อหา) · **1.4** (หัวใหญ่) · **ห้ามล็อกความสูงกล่องข้อความ** (หรือเผื่อ 25%) ไม่งั้นวรรณยุกต์โดนตัด · ตรวจด้วย **ที่ ปั๊ม ปุ่ม สื่อ ตื้น**
- ไทยไม่มีช่องว่างระหว่างคำ → **ตัดบรรทัดเองทุกครั้ง** ตรงจุดที่จบใจความ
- ไทยดูเล็กกว่าละตินที่ขนาดเท่ากัน → บรรทัดปนกันเพิ่มไทย 5–10%
- **ตระกูลเดียวที่มีทั้งไทยและละติน** · ต้องมีน้ำหนักหนาจริง (ห้ามตัวหนาปลอม) · **ตรวจลิขสิทธิ์ก่อนใช้เชิงพาณิชย์** (Anuphan · LINE Seed Sans TH · IBM Plex Sans Thai · Noto Sans Thai)

คำอธิบายเต็มของแต่ละหัวข้อ → [`references/thai-in-graphics.md`](references/thai-in-graphics.md)


---

## 7 · สิ่งที่ห้ามทำ — พร้อมของที่ใช้แทน

ห้ามเฉย ๆ ไม่ได้ผล ต้องบอกว่าใช้อะไรแทน

| ✗ อย่าทำ | ✓ ใช้แทน |
|---|---|
| ไล่สีม่วง-น้ำเงิน หรือไล่สีรุ้ง | สีแบรนด์ทึบ · ไล่สีเฉดเดียวที่ต่างกันไม่เกิน 10 องศา · พื้นผิวด้าน · ภาพถ่ายเต็มพื้น |
| วงกลมเรืองแสงลอย ๆ สื่อถึง "เทคโนโลยี" | ภาพของจริง หรือพื้นที่ว่าง |
| การ์ดมุมมนที่มีแถบสีคาดซ้าย | แผงเต็มความกว้าง · เลขลำดับ · กรอบตาราง · ทรงตั๋ว |
| วาดสินค้าเป็น SVG แทนภาพจริง | ภาพถ่ายจริง ถ้าไม่มี ให้บอกว่าไม่มีและใส่กล่องว่างไว้ |
| อีโมจิเป็นหัวข้อย่อย | จุด เลข หรือหัวข้อที่ใช้ตัวหนา |
| ฟอนต์ที่ใคร ๆ ก็ใช้ (Inter, Roboto, Montserrat) | เลือกจากข้อ 6 แล้วยืนยันว่าเลือกเพราะอะไร |
| ตัวเลขปลอมในกราฟเพื่อความสวย | ตัวเลขจริง ถ้ายังไม่มีให้เว้นว่างและระบุว่ารอข้อมูล |
| สามคอลัมน์ไอคอน-หัวข้อ-คำอธิบาย | เลือกโครงจากเนื้อหา ไม่ใช่จากความเคยชิน |
| ภาพสต๊อกคนจับมือ ลูกศรพุ่งขึ้น | ภาพงานจริง ของจริง คนจริง |

**บททดสอบสุดท้าย:** งานนี้ดูเหมือนมาจากนักออกแบบคนหนึ่งที่มีตัวตน
หรือดูเหมือนออกมาจากเครื่องไหนก็ได้

---

## 8 · ตรวจงาน

**รอบสองต้องตัดออก ไม่ใช่เพิ่มเข้า** — ถ้ามือกำลังจะวาดของใหม่ ให้หยุดแล้วถามว่า
ของที่มีอยู่แล้วทำให้ดีขึ้นได้ยังไง

- [ ] เปิดดูที่**ขนาดใช้จริง** ไม่ใช่ขนาดที่ทำงาน — โปสเตอร์ให้ดูที่ระยะ 2 เมตร ส่วนโพสต์ให้ดูบนจอมือถือ
- [ ] หรี่ตา — มีของเด้งมาก่อนอย่างเดียวไหม
- [ ] ข้อความไทยครบ ไม่มีวรรณยุกต์โดนตัด (ทดสอบด้วย ที่ ปั๊ม ปุ่ม สื่อ ตื้น)
- [ ] บรรทัดไทยตัดตรงจบใจความ ไม่ตัดกลางคำ
- [ ] contrast ผ่าน 4.5:1
- [ ] ไม่มีของหลุดขอบ ไม่มีของทับกัน
- [ ] งานพิมพ์ — ตัดตกครบ 3 มม. · 300 จุดต่อนิ้วที่ขนาดจริง · แปลงเป็น CMYK แล้ว
- [ ] เทียบกับไฟล์ทิศทาง — ขัดข้อไหนไหม
- [ ] อ่านรายการสิ่งที่ไม่เอา แล้วดูว่าเผลอใส่เข้าไปไหม

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ระยะห่าง ลำดับสายตา 5 สถานะ | `ui-craft` |
| เอาระบบสีไปใช้ในเอกสาร | `branded-document-design` |
| เอาไปใช้ในสไลด์ | `presentation-design` |
| เอาไปใช้บนหน้าจอแอป | `web-app-design` · `mobile-app-design` · `windows-app-design` |
| ตัดสิ่งที่ไม่จำเป็นออก | `simplicity-first` |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/designer-outputs.md`](references/designer-outputs.md) — รูปแบบงานส่งของนักออกแบบ


## reference: designer-outputs.md

# แม่แบบงานของ graphic-designer — ไฟล์ทิศทาง · ข้อเสนอโลโก้ · ข้อกำหนดชิ้นงาน · รีวิว

เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Outputs

### ไฟล์ทิศทาง
คัดลอก `assets/brand-direction.md` ของ skill นี้ไปไว้ที่รากโปรเจกต์ แล้วกรอก งานทุกชิ้นหลังจากนั้นให้อ้างอิงไฟล์นี้

### ข้อเสนอโลโก้
```markdown
## แบบที่ 01 — [ชื่อ เช่น "ตัวอักษรล้วน เรขาคณิต"]

**สถาปัตยกรรม:** ตัวอักษรล้วน / สัญลักษณ์+ตัวอักษร / สัญลักษณ์ล้วน / ตัวอักษรเป็นสัญลักษณ์ / อักษรย่อ
**ตัวอักษร:** [ตระกูล น้ำหนัก]
**สัญลักษณ์:** [อธิบาย หรือ ไม่มี]
**สื่อถึง:** [สิ่งที่อยากให้คนรู้สึก]
**ไม่ใช่:** [สิ่งที่ตั้งใจให้มันไม่เป็น]
**ทดสอบบริบท:** favicon ✓ · ปัก ✓ · ขาวดำ ✓ · กลับสี ✗ ช่องในตัว ก ตัน · ป้าย ✓ · โปรไฟล์ ✓
```

### ข้อกำหนดชิ้นงาน
```markdown
## [ชื่อชิ้นงาน]

**ไปอยู่ที่:** [LINE OA rich menu / โปสเตอร์ A3 / โพสต์ Facebook]
**ขนาด:** [px หรือ มม. · รวมตัดตกถ้าเป็นงานพิมพ์]
**ระยะมอง:** [30 ซม. บนมือถือ / 2 เมตร ที่หน้าร้าน]
**ข้อความที่ต้องอ่านออกแน่ ๆ:** [ประโยคเดียว]
**ไฟล์ส่งมอบ:** [รายการ]
**เก็บที่:** `assets/` (โลโก้ ไอคอน favicon) หรือ `assets/<ชื่องาน>/` (ชิ้นงานอื่น) — ต้นทาง `.svg` คู่กับไฟล์ export เสมอ
```

### รีวิวงาน
บอกเป็นข้อ ๆ ว่าอะไรผิด และ**ผิดเมื่อเทียบกับอะไร**: ทิศทางที่ตกลงไว้ · ตัวเลขมาตรฐาน · รายการสิ่งที่ไม่เอา

ความเห็นส่วนตัวให้บอกว่าเป็นความเห็น


## reference: logo-design.md

# Logos — details

Contents: five architectures → context tests → making a logo "wow" → bar shapes · the short rules and the four simplicity tests are in `SKILL.md`

## Five architectures

| Type | What it is | Example |
|---|---|---|
| Wordmark | The brand name as letters only | Stripe · Google |
| Symbol + wordmark | A picture paired with the name | Slack · Airbnb |
| Symbol only | A picture only | Apple · Target |
| Lettermark as symbol | A single letter designed until it becomes a picture | Beats · McDonald's |
| Monogram | 2–3 letters combined | Chanel · Gucci |

**A set that works in real use needs 3 types** — the main one for wide spaces · the monogram for square slots ·
the lettermark as symbol for favicons and embroidery

| Context | Real limit |
|---|---|
| favicon 16px | No more than **4–6 elements** · lines thinner than **2px disappear** · no more than 3–4 colors |
| App icon 28px | 4–8 elements · lines thinner than 3px disappear |
| Shirt embroidery 1.5 inches | **4–6 thread colors** · thinnest line ~1 mm · **text under 2 mm cannot be embroidered** |
| Black and white | Must read without relying on color |
| Inverted (white on black) | Counters inside letters must not fill in |
| Storefront sign | Read at 15–60 meters · specify the **Pantone color, not hex** |
| Social profile picture | Cropped to a circle · must read at **60–80px** in the notification feed |

## Making a logo "wow" — methods that have worked

A logo rejected as "not beautiful, not wow" is usually a commonly used symbol, such as the `>_` of a terminal program or a flat single-color wordmark. What works:

1. **Make at least 1 direction come from what users see every day in the work**, for example the underscore cursor of a terminal for a telnet/SSH app, because the work's owner often ties the brand to that picture (the real owner picked the cursor direction after 2 rounds)
2. **Make 3 directions at the same time**, each with a different idea, such as connection lines · letters as stacked layers · plain geometric shapes, then choose from real images placed side by side (`parallel-attempts-pick-best`)
3. **Have depth in a form that passes `SKILL.md` section 7** — stacked layers of shapes · different line weights · a gradient of one hue whose shades differ by no more than 10 degrees · **no glow and no multi-color gradients**, and at 16px a readable silhouette must remain
   - Glow or light layers are allowed only when the user asks for that direction (opt-in) and it must be written in the direction file
4. **Make a preview sheet every round** — sizes 16 · 24 · 32 · 48 · 64 · 128 · 256 on dark and white backgrounds · the logo + name lockup on both backgrounds · single-color version · in the Windows taskbar and the app window title bar, then look at it with your own eyes and revise at least 3 rounds (an example of a sheet that passed: `assets/logo-preview-sheet-example.webp`)
5. **Convert the brand name to outlines from an open font** (SIL Open Font License (OFL), such as Space Grotesk · Manrope · IBM Plex Sans — do not use Inter, because it is on the list of fonts everyone uses in `SKILL.md` section 7) with fontTools, and keep the license file too; never use operating system fonts such as Segoe, because their license does not cover making logos
6. **Export the same complete set every time** — use the one set in [`sizes-and-print.md` step 4](sizes-and-print.md#4--ไฟล์ที่ต้องส่งมอบ) (SVG · PDF · transparent PNG · ICO · 4 color versions); if the direction the user chose has a filter (opt-in), use a PNG file wherever the drawing program does not support filters, such as Word
7. **A logo with a moving part** (such as a cursor): in the sprite SVG, split `<g id="…-body">` from `<g id="…-cursor">` and have the main symbol use both parts, so the home page can blink only the cursor while elsewhere the original symbol is still used; blink only on the home page, and stop when the machine is set to reduce motion (`prefers-reduced-motion`)

## Bar shapes — rounded rectangles, not round ends

For letters or symbols built from bars (such as T · `_` · `>`), use **rounded-rectangle bars**. The real owner asked to change from round ends to this because it looks more modern.

| Corner radius relative to bar thickness | Result |
|---|---|
| Below 0.2 | Stiff, looks undesigned |
| **0.25–0.35** (default 0.3) | Clearly angular but soft-edged, fits geometric fonts and Windows 11 style icons |
| 0.4 and up | Starts turning back into half-circle round ends, looks soft like a pill or a toy |

- Use the same radius on every bar, including letters, the cursor, and the glow edge that surrounds the bars
- Joins between bars (such as the stem of a T meeting the top bar) are joined as straight angles, with no rounded inner corner, because that creates a bulge
- The rounded corners disappear at 16px, which is fine as long as it still reads as a letter; judge whether the radius looks good at 64px and up


## reference: sizes-and-print.md

# Social media sizes and print work

> Caution: **platform numbers can change** — recorded Sep 2569 (Buddhist Era)
> Before sending real work, open the platform's documents and confirm again
> The print numbers (section 3) are industry standards and rarely change
>
> Sections 1–2 are a backup version for when the plugin `graphic-design` is not installed — if it is installed → use `graphic-design:social-formats` (it searches the platform guides live for safe areas, links are in `social-formats/references/platform-sizes.md`), and if the numbers differ, treat the plugin's as correct

## Contents

| # | Heading |
|---|---|
| 1 | [LINE Official Account](#1--line-official-account-line-oa) |
| 2 | [Other social platforms](#2--other-social-platforms) |
| 3 | [Print work](#3--print-work) |
| 4 | [ไฟล์ที่ต้องส่งมอบ](#4--ไฟล์ที่ต้องส่งมอบ) (files to deliver) |

---

## 1 · LINE Official Account (LINE OA)

| Item | Size | Note |
|---|---|---|
| Large rich menu | 2500 × 1686 px | The template in LINE Official Account Manager splits into up to 6 cells · if set through the Messaging API, up to 20 tap areas can be defined |
| Small rich menu | 2500 × 843 px | The template splits into up to 3 cells · through the Messaging API also up to 20 tap areas |
| Rich message | 1040 × 1040 px | Square |
| Profile picture | 640 × 640 px | Cropped to a circle |
| Account page background image | 1080 × 878 px | The top part is covered by the account name |

> Checked 2026-10-14: the figure of 20 tap areas and the accepted image sizes (2500×1686, 2500×843, 1200×810, 1200×405, 800×540, 800×270 · file no more than 1 MB) come from secondary documents that cite the Messaging API reference (bottender.js.org, dev.classmethod.jp), because the page developers.line.biz/en/reference/messaging-api/#rich-menu-object loads its content with JavaScript and cannot be read automatically · (รอยืนยัน) (pending confirmation) against the official page before real use

**Cautions for rich menus** — users tap with a finger, so the smallest cell should be no narrower than
1/3 of the width, and the text in the cell must stay readable when scaled down to a real phone screen width
(about 1/3 of 2500 px)

---

## 2 · Other social platforms

| Platform | Item | Size |
|---|---|---|
| TikTok | Video · cover image | 1080 × 1920 px (9:16) |
| Facebook | Square post | 1080 × 1080 px |
| Facebook | Link image | 1200 × 630 px |
| Facebook | Page cover image | 1640 × 856 px |
| Instagram | Vertical feed | 1080 × 1350 px (4:5) |
| Instagram | Story · reel | 1080 × 1920 px |
| YouTube | Video thumbnail | 1280 × 720 px |

**Safe area of a vertical clip** — keep the top 15% and bottom 20% clear,
because the app's buttons and captions cover them

**Link image 1200 × 630** — text must be large enough to read when shown at a width of about 500 px

---

## 3 · Print work

| Topic | Value |
|---|---|
| Resolution | **300 dots per inch at actual size** |
| Bleed | **3 mm on all sides** |
| Safe distance from the trim edge | 3–5 mm |
| Color system | Use CMYK for offset and specify Pantone if the brand color matters |
| Rich black on large areas | C60 M40 Y40 K100 |
| Black for small text | **K100 only** |
| Thinnest line | 0.25 pt |
| Smallest text | 6 pt (Thai should be 7 pt and up, because the lower vowels fill in) |

**The 3 most common mistakes**

1. **Scaling up or down and still thinking it is 300 dots per inch** — an image at 300 dots per inch at 10 cm
   drops to 150 dots per inch when enlarged to 20 cm
2. **Forgetting bleed** — work made exactly to the edge shows a white edge when the cutter shifts by 1 mm
3. **Sending an RGB file to the printer** — many vivid colors on screen cannot be printed in CMYK,
   especially bright blue, neon green, vivid orange

**Standard Thai sizes**

| Item | Finished size | Size with bleed |
|---|---|---|
| Business card | 90 × 54 mm | 96 × 60 mm |
| A4 | 210 × 297 mm | 216 × 303 mm |
| A5 | 148 × 210 mm | 154 × 216 mm |
| A3 poster | 297 × 420 mm | 303 × 426 mm |

---

## 4 · ไฟล์ที่ต้องส่งมอบ

**Logo** — sending only a pixel-based image file is not enough

| File | What it is for |
|---|---|
| SVG | The original that scales without breaking, usable on the web |
| PDF | Sent to the printer |
| Transparent PNG | 64 · 256 · 512 · 1024 · 2048 px · the logo + name lockup also adds @2x |
| ICO | Made from raster images, with 16 · 32 · 48 · 256 px together in one file |

**This is the single export set** — `logo-design.md` step 6 links to this table; edit only here

**Each type must have 4 versions** — normal color · inverted (white) · solid black · solid white

**Accompanying document** — clear space around the logo · smallest size (px and mm) · what not to do

**Test for whether the delivery is complete** — if the recipient opens the folder and has to ask back
"Is there a white version?", it is not complete yet


## reference: thai-in-graphics.md

# Thai in graphic work — details

The short rules are in `SKILL.md`

Thai has upper vowels (ิ ี ึ ื ั), and tone marks (่ ้ ๊ ๋) stack on top of them as another layer, and it also has lower vowels (ุ ู)

- **Line height at least 1.5** for body text and **1.4** for large headings
  (Latin is fine at 1.2–1.4, but Thai is not)
- **A text box with a locked height will cut off tone marks** — always set automatic height,
  or add 25% to what you calculated with Latin
- Test with words that have all 3 layers: **ที่ ปั๊ม ปุ่ม สื่อ ตื้น**

## Thai has no spaces between words

Programs will break a line in the middle of a word — **always break lines yourself in graphic work**
Break where the meaning ends, not where it happens to fit the edge

## Sizes that the eye sees as unequal

At the same point size, **Thai looks smaller than Latin** — on mixed lines, enlarge the Thai by 5–10%
or use a single family designed to balance the 2 scripts

## Fonts

- **Use a single family that has both Thai and Latin** — pair different families and the letter heights do not match,
  and the line looks tilted
- **It must have a real bold weight**; a bold faked by the program makes vowels and tone marks blur together
- Families that suit plain geometric work: **Anuphan · LINE Seed Sans TH · IBM Plex Sans Thai · Noto Sans Thai**
- **Check the license before commercial use**; many free Thai fonts forbid use in work that is sold
