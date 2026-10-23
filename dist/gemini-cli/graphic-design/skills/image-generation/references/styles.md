# คำ prompt ตามแนวภาพ

ประกอบ prompt ตามลำดับนี้ → **เรื่องในรูป** (สิ่งที่ต้องเห็น 1 จุดเด่น) + **บรรทัดแนวภาพ** (ตารางล่าง) + **บล็อกสไตล์** จาก `docs/design/image-style.md` (สี แสง มุม)
สิ่งที่ห้ามมีส่งทุกครั้ง: `text, letters, watermark, logo` + ของแต่ละแนว — ส่งตามที่เครื่องมือสร้างภาพของ session รับ (ช่อง negative prompt ถ้ามี · ไม่มี → ต่อท้าย prompt ว่า `Avoid: …`) · ตัวอย่างข้างล่างเขียนเป็น `--negative` เพื่อให้อ่านง่าย

| แนว | บรรทัดแนวภาพ (ภาษาอังกฤษ — โมเดลเข้าใจดีกว่า) | negative เพิ่ม |
|---|---|---|
| `photo` | `editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium` | `illustration, cartoon, 3d render, oversaturated, plastic skin` |
| `flat` | `flat vector illustration, simple geometric shapes, solid colour fills, no gradients, clean negative space` | `photo, realistic, 3d, texture, shadows` |
| `3d` | `tactile 3D object made of one named material (matte card stock with visible fibres, or polymer clay with faint fingerprints), one softbox from the upper left, dark contact shadow plus a soft cast shadow in the same direction, flat backdrop of the same material, one colour from the palette` · วัตถุชิ้นเดียว · แม่แบบ 8 บรรทัดพร้อมตัวอย่างอยู่ใน `brief-to-image` → `references/prompt-anatomy.md` หัวข้อ Tactile 3D hero object | `glossy plastic, smooth CGI surface, glow, floating particles, teal-orange grade, gradient backdrop, vignette, clutter` |
| `watercolor` | `hand-painted watercolor illustration, visible paper texture, soft edges, light washes` | `photo, 3d, hard vector edges, neon` |
| `line` | `single-colour line art, even stroke weight, minimal, lots of white space` | `photo, shading, colour fills, texture` |
| `isometric` | `isometric illustration, 30 degree angle, clean geometry, consistent light from top left` | `perspective distortion, photo, blur` |

## ตัวอย่าง — สปาไทย แนว `photo`

```
Thai traditional massage room with a low mattress, folded white towels and a bowl of
orchid petals, soft afternoon light through a wooden window.
editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium.
Palette: deep forest green, warm cream, natural teak wood, small gold accent.
Composition: eye-level, subject in left third, empty space on the right for the headline.
```
`--negative "text, letters, watermark, logo, illustration, cartoon, oversaturated, people's faces"` · `--aspect 16:9`

## สัดส่วนตามตำแหน่ง

| ตำแหน่ง | `--aspect` |
|---|---|
| hero เต็มกว้าง | `16:9` |
| การ์ดสินค้า / บริการ | `4:3` หรือ `1:1` |
| รูปคน / นักบำบัด / ทีม | `3:4` หรือ `1:1` |
| แบนเนอร์มือถือ / story | `9:16` |
| โพสต์โซเชียล | `4:5` (ดู `social-formats` ถ้ามี) |

## รูปคน

- เขียนบทบาทและท่าทาง ไม่เขียนชื่อคนจริง: `a Thai female therapist in a sage green uniform, smiling, mid-30s`
- รูปทีมทั้งชุด → ใช้ชุดแต่งกาย พื้นหลัง และแสงเดียวกันทุกรูป
- ตรวจมือและนิ้วทุกรูป · ถ้าไม่จำเป็นให้จัดมุมที่ไม่เห็นมือ
