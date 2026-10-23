# ความลึกและลูกเล่นพื้นผิว (depth and flourish)

เงาที่ดูจริง ผิวกระดาษ ดินปั้น และขอบฉีก สำหรับหน้าจอและ mockup · ใช้คู่กับ `SKILL.md` ข้อ 4 (เงาเฉพาะของที่ลอยจริง · ความลึก 3 ระดับ · การ์ดนิ่งไม่มีเงา) ไม่ใช่แทน
token เงาของเว็บแอป (`--shadow-color` · `--elev-1` ถึง `--elev-3` · สูตรมุมซ้อน) อยู่ใน `web-app-design` → `references/tokens.md` · look ที่ใช้แต่ละภาษาอยู่ใน [`web-looks.md`](web-looks.md)

## สารบัญ

1. [หลัก 6 ข้อ](#หลัก-6-ข้อ)
2. [ภาษาความลึก เลือกภาษาเดียว](#ภาษาความลึก-เลือกภาษาเดียว)
3. [สูตร 10 ข้อ](#สูตร-10-ข้อ)
4. [รองรับเบราว์เซอร์](#รองรับเบราว์เซอร์)
5. [ที่มา](#ที่มา)

## หลัก 6 ข้อ

| # | หลัก | ทำอย่างไร | ที่มา |
|---|---|---|---|
| 1 | แสงมาจากทิศเดียว | ทุกเงาในหน้าเยื้องไปทางเดียวกัน ปกติแสงจากบน เงาตกลงล่าง · ทุกชั้นใช้อัตราส่วนระยะเยื้องแนวนอนต่อแนวตั้งเท่ากัน | CM |
| 2 | เงามี 2 ส่วน | ชั้นกว้าง นุ่ม จาง แทนแสงรอบตัว + ชั้นแคบ เข้ม ชิดวัตถุ แทนมุมที่แสงเข้าไม่ถึง · ของยิ่งลอยสูง ชั้นกว้างยิ่งเยื้องไกล เบลอขึ้น และจางลง | RU · CM · VC |
| 3 | ย้อมเงาเข้าหาสีพื้น | เงาบนพื้นสีใช้เฉดเข้มของ hue เดียวกับพื้น · ดำโปร่งทำให้พื้นสีดูหม่นเทา | CM · VC |
| 4 | ออกแบบด้วยสีเทาก่อน | วางลำดับด้วยระยะ ขนาด น้ำหนัก และความเข้มของเทาให้ครบ แล้วค่อยเติมสี · เทาล้วนยังอ่านลำดับไม่ออก เติมสีก็ไม่ช่วย | RU |
| 5 | ลำดับด้วยอย่างใดอย่างหนึ่ง | 1 ระดับใช้ขนาด หรือ น้ำหนัก หรือ สี อย่างเดียว · ใส่ทั้ง 3 ที่จุดเดียวคือตะโกน ระดับอื่นไม่เหลือทางให้เด่น | RU |
| 6 | ผิวที่นูนมีขอบบนสว่าง | แสงจากบนกระทบขอบบนของปุ่มหรือแผ่นที่นูน จึงมีเส้นสว่าง 1px ด้านบน · ผิวที่ยุบลง (ช่องกรอก) กลับกัน เงาอยู่ด้านบนในช่อง | RU |

## ภาษาความลึก เลือกภาษาเดียว

ทั้งโปรเจกต์ใช้ 1 ใน 4 ภาษานี้ และจดไว้บรรทัดเดียวกับบุคลิกแอปในคอมเมนต์บรรทัดแรกของไฟล์ token (`/* app-character: 3 lifestyle · look: paper/print · depth: กระดาษ */`) · ผสมหลายภาษาในหน้าเดียว เช่น การ์ดดินปั้นข้างแผงกระจกข้างกระดาษฉีก คือร่องรอยว่า AI วาด (`no-ai-look` catalog ข้อ 6 ภาษาภาพเดียว)

| ภาษา | หน้าตา | สูตร | look |
|---|---|---|---|
| เงาซ้อน | ของลอยมีเงาหลายชั้นทิศเดียว ขอบบนรับแสง | 1 · 2 · 3 · 5 · 8 · 10 | skeuomorphic · glass/tech |
| ดินปั้น | ก้อนพองนุ่มมีปริมาตร | 4 · 8 | claymorphism |
| กระดาษ | แผ่นซ้อน เกรน ขอบฉีก รูปตัดวางบนพื้น | 6 · 7 · 8 · 9 | paper/print · Thai craft |
| เรียบมีเส้น | ไม่มีเงาเบลอ แยกด้วยเส้น 1px และพื้นต่างเฉด · แบบหนาใช้ขอบ 2–3px กับเงาทึบไม่เบลอ | 3 (เฉพาะขอบโปร่ง) · 9 | quiet utility · editorial · bento · luxury · neobrutalism · playful |

สูตร 10 ส่วนตัวอักษร (2 บรรทัดล่าง) ใช้ได้ทุกภาษา

**กฎ**

- เงาซ้อนห้าม animate (`transition` หรือ `@keyframes` บน `box-shadow` หลายชั้น) เพราะเบราว์เซอร์ต้องวาดเบลอใหม่ทุกเฟรม · อยากให้เงาเปลี่ยนตอน hover ให้วางเงาชุดที่ 2 ไว้ใน `::after` แล้วเปลี่ยน `opacity` ของมันแทน
- สูตร 7 เป็นฟิลเตอร์ SVG ที่คำนวณทุกครั้งที่วาด ใช้กับชิ้นเล็กที่นิ่ง ห้ามใส่กับพื้นที่ใหญ่หรือของที่ขยับ · สูตร 6 เป็นภาพพื้นหลังเล็กที่ซ้ำเป็นลาย เบากว่ามาก ใช้กับพื้นใหญ่ได้
- ทุกอย่างที่ขยับ (ยุบตอนกด · เงาเปลี่ยน · เส้นวาดเข้า) ปิดใน `@media (prefers-reduced-motion: reduce)` ตาม `SKILL.md` ข้อ 7
- ธีมมืดแทบมองไม่เห็นเงา ยกระดับด้วยพื้นที่สว่างขึ้นทีละขั้นแทน · ภาษากระดาษและดินปั้นต้องลองทั้ง 2 ธีมก่อนเลือก
- การ์ดในรายการยังแบนทุกภาษา · ดินปั้นและกระดาษให้ความลึกกับชิ้นเด่นของหน้าเท่านั้น และไม่เกิน 3 ระดับตาม `SKILL.md` ข้อ 4

## สูตร 10 ข้อ

โค้ดเขียนเองทั้งหมด สั้นพอวางในไฟล์ css ของโปรเจกต์ · ค่าสีเป็นตัวอย่าง ให้ใช้ token ของโปรเจกต์แทน · `--shadow-color` นิยามในสูตร 1 · ทุกสูตรใช้แสงจากบน

### 1 · เงาซ้อนหลายชั้น

ของลอยที่ต้องดูนุ่มและจริง (เมนูหลัก แผงลอย) · ทุกชั้นเยื้องลงล่างอย่างเดียว ระยะเยื้องคูณ 2 ทุกชั้น เบลอเป็น 2 เท่าของระยะเยื้อง ความเข้มลดลงทีละชั้น

```css
:root { --shadow-color: 223 47% 15%; }  /* hue เดียวกับพื้น · พื้นเปลี่ยน hue เปลี่ยนตาม */
.lifted {
  box-shadow: 0 1px 2px hsl(var(--shadow-color) / .09),
              0 2px 4px hsl(var(--shadow-color) / .07),
              0 4px 8px hsl(var(--shadow-color) / .06),
              0 8px 16px hsl(var(--shadow-color) / .05);
}
```

### 2 · เงา 2 ส่วน

แบบประหยัดของสูตร 1 สำหรับ dropdown · tooltip · toast · ค่าเดียวกับ `--elev-2` ใน `tokens.md`

```css
.menu {
  box-shadow: 0 1px 3px hsl(var(--shadow-color) / .14),   /* แคบ เข้ม: ใต้ชิ้น */
              0 8px 20px hsl(var(--shadow-color) / .08);  /* กว้าง จาง: แสงรอบตัว */
}
```

### 3 · ขอบคม + มุมร่วมศูนย์

ขอบโปร่งเข้ากับทุกสีพื้น (ธีมมืดเปลี่ยนเป็น `hsl(0 0% 100% / .1)`) · ของข้างในโค้งเท่ากับมุมนอกลบระยะห่างจากขอบ เส้นโค้ง 2 ชั้นจึงขนานกัน

```css
.popover {
  --r: 14px; --pad: 6px;
  border-radius: var(--r); padding: var(--pad);
  border: 1px solid hsl(var(--shadow-color) / .12);
  box-shadow: 0 4px 12px hsl(var(--shadow-color) / .10);  /* เบลอต่ำกว่า 24px ไม่ชนกฎ hairline-shadow */
}
.popover > * { border-radius: calc(var(--r) - var(--pad)); }      /* 14 − 6 = 8 */
```

### 4 · ปริมาตรดินปั้น

ก้อนพอง ท้องมืด หลังรับแสง เงาตกบนพื้นทิศเดียวกับแสง · ใช้กับชิ้นเด่นไม่กี่ชิ้นต่อหน้า

```css
.clay {
  border-radius: 24px;                                   /* ตั้งแต่ 28px สคริปต์ no-ai-look ฟ้อง huge-radius */
  background: hsl(24 85% 62%); color: hsl(24 60% 18%);   /* ตัวอักษรเข้ม 5.4:1 */
  box-shadow: inset 0 -6px 12px hsl(24 60% 35% / .35),   /* ท้องมืด */
              inset 0 6px 10px hsl(0 0% 100% / .45),     /* หลังรับแสง */
              0 12px 20px hsl(24 50% 30% / .20);         /* เงาตกบนพื้น */
}
```

### 5 · ขอบบนรับแสง + ตัวอักษรกดลง

ปุ่มนูนแบบ skeuomorphic และป้ายที่ดูกดลงในเนื้อวัสดุ (letterpress)

```css
.key {
  background: linear-gradient(hsl(220 14% 97%), hsl(220 12% 91%));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / .7),          /* ขอบบนรับแสง */
              0 1px 2px hsl(var(--shadow-color) / .18);
}
.stamped { color: hsl(220 10% 38%);                        /* 5.3:1 บนพื้นด้านบน */
           text-shadow: 0 1px 0 hsl(0 0% 100% / .8); }      /* ขอบล่างของร่องรับแสง */
```

### 6 · เกรนกระดาษ

ไฟล์ SVG เล็ก ๆ ที่ซ้ำเป็นลายพื้น · กรอบฟิลเตอร์เท่ากับรูปพอดี (`x` `y` `width` `height`) รอยต่อของลายจึงไม่เห็น · งานส่งมอบไฟล์เดียวให้ฝังเป็น data URI

```html
<!-- grain.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#g)" opacity=".08"/>
</svg>
```
```css
.paper { background: var(--paper) url(grain.svg); }   /* --paper = สีกระดาษของแบรนด์ */
```

### 7 · ขอบฉีก

แผ่นกระดาษที่ขอบไม่เรียบ · บิดเฉพาะแผ่นพื้นใน `::before` ตัวหนังสือไม่บิดตาม

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="torn"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter>
</svg>
```
```css
.note { position: relative; isolation: isolate; }
.note::before { content: ""; position: absolute; inset: 0; z-index: -1;
                background: var(--paper); filter: url(#torn); }
```

### 8 · เงาของรูปทรงอิสระ

รูปตัดพื้นโปร่ง (PNG · SVG) เช่น เครื่องหมายคำถามกระดาษตัดจากแม่แบบใน `brief-to-image` ของ plugin `graphic-design` · `box-shadow` ได้แค่กรอบสี่เหลี่ยม `drop-shadow()` ตามรูปทรงจริง · ภาพที่มีเงาในตัวแล้วไม่ต้องใส่ซ้ำ

```css
.cutout {
  filter: drop-shadow(0 1px 1px hsl(var(--shadow-color) / .30))    /* ชิดขอบ */
          drop-shadow(0 6px 8px hsl(var(--shadow-color) / .16));   /* ตกบนพื้น */
}
```

### 9 · duotone

รวมภาพถ่ายหลายแหล่งให้เป็นชุดเดียวด้วย 2 สีของแบรนด์ (ส่วนมืดเป็น `--duo-dark` ส่วนสว่างเป็น `--duo-light`) · ห้ามใช้กับภาพที่ต้องเห็นสีจริง เช่น ภาพสินค้า

```css
.duotone { position: relative; isolation: isolate; background: var(--duo-light); }
.duotone img { display: block; width: 100%; filter: grayscale(1) contrast(1.1); mix-blend-mode: multiply; }
.duotone::after { content: ""; position: absolute; inset: 0; pointer-events: none;
                  background: var(--duo-dark); mix-blend-mode: lighten; }
```

### 10 · วัตถุนูนนุ่มด้วย gradient + ตัวอักษรเรียบร้อย

ลูกบิดหรือปุ่มหมุนที่มีหน้าที่จริง (วงกลมลอยประดับคือสัญญาณ AI ใน `no-ai-look` ข้อ 6) · 2 บรรทัดล่างใช้ได้ทุกภาษาความลึก

```css
.knob {
  border-radius: 50%;
  background: radial-gradient(circle at 50% 28%, hsl(220 10% 96%), hsl(220 8% 78%) 60%, hsl(220 8% 62%));
  box-shadow: 0 2px 3px hsl(var(--shadow-color) / .25), 0 8px 16px hsl(var(--shadow-color) / .12);
}
h1, h2, h3 { text-wrap: balance; }                       /* หัวข้อแตกบรรทัดยาวพอกัน */
.num, td.amount { font-variant-numeric: tabular-nums; }  /* ตัวเลขกว้างเท่ากัน คอลัมน์ตรง */
```

## รองรับเบราว์เซอร์

ตรวจบน MDN เมื่อ 2026-10-23 ทุกตัวในรายการนี้เป็น Baseline widely available: `text-wrap` ใช้ได้ทุกเบราว์เซอร์หลักตั้งแต่ มี.ค. 2024 (`balance` จัดเฉพาะข้อความไม่เกิน 6 บรรทัดใน Chromium และไม่เกิน 10 บรรทัดใน Firefox จึงใช้กับหัวข้อ ไม่ใช้กับย่อหน้า) · `font-variant-numeric` และ `mix-blend-mode` ตั้งแต่ ม.ค. 2020 · `drop-shadow()` ตั้งแต่ ก.ย. 2016 (ไม่รับ spread และ `inset`) · `<feTurbulence>` และ `<feDisplacementMap>` ตั้งแต่ ก.ค. 2015

## ที่มา

| รหัส | แหล่ง |
|---|---|
| CM | Josh W. Comeau "Designing Beautiful Shadows in CSS" https://www.joshwcomeau.com/css/designing-shadows/ (เผยแพร่ 2021-09-13 · ปรับล่าสุด 2026-04-27 · เปิดตรวจ 2026-10-23) · ใช้หลักเท่านั้น ไม่คัดโค้ด |
| RU | หนังสือ Refactoring UI ของ Adam Wathan และ Steve Schoger (หนังสือขาย · สรุปหลักด้วยคำของเรา ไม่ยกข้อความ · ไม่ได้เปิดเล่มตรวจรอบนี้) |
| VC | vercel-labs/web-interface-guidelines `README.md` หัวข้อ layered shadows · crisp borders · nested radii · hue consistency (MIT · ตรวจ 2026-10-23) |
| อื่น | ดินปั้น: Smashing Magazine "Claymorphism: Will It Stick Around?" ของ Adrian Bece 2022-03-16 · เกรน: CSS-Tricks "Grainy Gradients" ของ Jimmy Chion 2021-09-13 (เปิดตรวจทั้งคู่ 2026-10-23) · โค้ดทั้ง 10 สูตรเขียนเอง |
