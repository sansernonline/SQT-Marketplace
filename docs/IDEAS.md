# ไอเดียปรับปรุง marketplace

> บันทึกการสำรวจสองรอบ (22–23 ก.ย. 2569) ตัวเลข plugin/skill ในไฟล์นี้เป็นของวันที่สำรวจ ไม่ใช่ของปัจจุบัน — ของจริงดูที่ [PLUGINS.md](PLUGINS.md)

## อัปเกรด marketplace — สิ่งที่คนอื่นทำแล้วเราน่าเอามาใช้

_สำรวจเมื่อ 22 ก.ย. 2569 · เทียบกับ 73 skills / 67 agents ที่เรามีอยู่_
_ตัดของที่ซ้ำกับที่มีแล้วออกหมด เหลือเฉพาะช่องว่างจริง_

---

### สารบัญ

| # | หัวข้อ | สถานะ |
|---|---|---|
| 0 | [เจอบั๊กระหว่างสำรวจ](#0--เจอบั๊กระหว่างสำรวจ-แก้แล้ว) | ✅ แก้แล้ว |
| 1 | [ตัววัดว่า skill ถูกเรียกจริงไหม](#1--ตัววัดว่า-skill-ถูกเรียกจริงไหม) | คุ้มที่สุด |
| 2 | [กฎ "พิสูจน์ก่อนเคลม"](#2--กฎ-พิสูจน์ก่อนเคลม) | ช่องว่างใหญ่สุด |
| 3 | [เขียน skill ให้ตรงกับความผิดพลาด](#3--เขียน-skill-ให้ตรงกับรูปแบบความผิดพลาด) | ปรับของเดิม |
| 4 | [บันไดตัดสินใจและประตูกั้น](#4--บันไดตัดสินใจและประตูกั้น) | ปรับของเดิม |
| 5 | [ตรวจแบบปฏิปักษ์](#5--ตรวจแบบปฏิปักษ์-adversarial-verification) | ของใหม่ |
| 6 | [ต้นทุน token ที่จ่ายอยู่ทุก session](#6--ต้นทุน-token-ที่จ่ายอยู่ทุก-session) | ตัวเลขจริง |
| 7 | [ความสามารถที่ขาดไปเลย](#7--ความสามารถที่ขาดไปเลย) | ของใหม่ |
| 8 | [ของที่ดูแล้วไม่เอา](#8--ของที่ดูแล้วไม่เอา) | — |

---

### 0 · เจอบั๊กระหว่างสำรวจ (แก้แล้ว)

**skill 3 ตัวไม่เคยถูกเรียกใช้ได้เลย** — `web-app-design`, `mobile-app-design`, `presentation-design`

สาเหตุ: `description:` มี `": "` อยู่ข้างในโดยไม่ได้ครอบด้วยเครื่องหมายคำพูด

```yaml
description: ... as a working system: a token contract ...
                                    ^^ ตรงนี้
```

YAML อ่านว่าเป็นคีย์ซ้อนคีย์ → **parse ทั้งบล็อกไม่ผ่าน → loader ทิ้ง field ทุกตัว →
skill ไม่มี name ไม่มี description → ไม่เคยถูกเรียก** และ**ไม่มี error ให้เห็นเลย**

แก้แล้วโดยเปลี่ยน `: ` เป็น ` — ` · ตรวจซ้ำทั้ง 73 ตัวผ่านหมด
(อ้างอิง: [trailofbits/skills AGENTS.md](https://github.com/trailofbits/skills/blob/main/AGENTS.md))

**ของที่ทำเพิ่ม: `scripts/check/validate-marketplace.mjs`**

```bash
node scripts/check/validate-marketplace.mjs              # ตรวจทั้ง marketplace
node scripts/check/validate-marketplace.mjs --self-test  # พิสูจน์ว่าตัวตรวจยังจับบั๊กได้จริง
```

ตรวจ: frontmatter พัง · `name` ไม่ตรงชื่อโฟลเดอร์ · description ยาวเกิน 1024 ·
เนื้อหาเกิน 500 บรรทัด · agent ใช้คีย์ `allowed-tools:` แทน `tools:` ·
plugin ที่มีจริงแต่ไม่ได้ประกาศใน `marketplace.json` · README ไม่พูดถึง plugin บางตัว

สองกฎที่ยืมมาจาก Trail of Bits และสำคัญกว่าที่คิด:

- **ตัวตรวจที่ตรวจไป 0 รายการ ต้องถือว่าพัง ไม่ใช่ผ่าน** · เขียน path ผิดแล้วผลขึ้นเขียว
  เป็นบั๊กที่ซ่อนอยู่ได้เป็นเดือน · สคริปต์นี้จบด้วย exit 1 ถ้าไม่เจออะไรให้ตรวจเลย
- **ต้องมี fixture (ไฟล์ตัวอย่างสำหรับทดสอบ) พิสูจน์ว่ากฎยังจับของผิดได้จริง** · `--self-test` ป้อนไฟล์ที่พังจริง 4 แบบ
  แล้วยืนยันว่าจับได้ทุกแบบ

---

### 1 · ตัววัดว่า skill ถูกเรียกจริงไหม

**ปัญหาที่เรามีแต่ยังมองไม่เห็น:** มี 73 skill แต่ไม่มีทางรู้เลยว่าตัวไหนถูกเรียกจริง
ตัวไหนเขียนไปแล้วนอนอยู่เฉย ๆ

Claude Code มีคำสั่งมาตรฐานให้แล้ว: **`claude plugin eval`** (ต้อง v2.1.269 ขึ้นไป)
([เอกสาร](https://code.claude.com/docs/en/plugin-evals))

สิ่งที่ทำให้มันมีค่ากว่าการลองเองคือ **มันรันทั้งแบบมี plugin และแบบไม่มี แล้วโชว์ส่วนต่าง**

> ถ้าเคสหนึ่งได้ 1.0 ทั้งตอนมี plugin และตอนไม่มี — แปลว่า plugin ไม่ได้ช่วยอะไร

อาการที่เอกสารยกเป็นข้อแรกเพราะเจอบ่อยที่สุด คือ**ส่วนต่างเกือบเป็น 0 และ
grader `tool_used: Skill` ไม่ผ่าน** · แปลว่า Claude ไม่เลือก skill ของเราเมื่อผู้ใช้พิมพ์แบบธรรมชาติ
ต้องแก้ที่ `description` ไม่ใช่ที่เนื้อหา

**เริ่มยังไง** — อย่าทำทั้ง 73 ตัว เลือก 5 ตัวที่ใช้บ่อยสุดก่อน (`lazy-coding`,
`simplicity-first`, `web-app-design`, `testing-standards`, `srs-writing`)

```bash
claude plugin eval init      # สัมภาษณ์แล้วสร้างชุดทดสอบให้
claude plugin eval
```

**วิธีเขียนคำถามทดสอบให้ได้ผล** (จาก `skill-creator` ของ Anthropic):
skill 1 ตัวใช้ 20 คำถาม — 8-10 คำถามที่**ควรเรียก** และ 8-10 ที่**ไม่ควรเรียก**
คำถามต้องยาว เฉพาะเจาะจง เขียนแบบคนจริง มี path ไฟล์ มีคำพิมพ์ผิด
และ**คำถามฝั่งไม่ควรเรียกต้องเฉียด ๆ** ("เขียนฟังก์ชัน fibonacci" ไม่ใช่ตัวอย่างที่ดี
เพราะง่ายเกินไปจนไม่ได้ทดสอบอะไร) แบ่ง 60% ไว้ปรับถ้อยคำ อีก 40% กันไว้วัดผล
แล้ว**เลือกผู้ชนะจากชุดที่กันไว้วัด ไม่ใช่ชุดที่ใช้ปรับ**

---

### 2 · กฎ "พิสูจน์ก่อนเคลม"

**ช่องว่างที่ใหญ่ที่สุดของเรา** — เรามี `simplicity-first`, `lazy-coding`, `targeted-fix`,
`short-answers`, `spell-out-abbreviations` แต่**ไม่มีตัวไหนห้ามเคลมว่าอะไรผ่านโดยไม่ได้รัน**

ตัวอย่างที่ดีที่สุดคือ [`verification-before-completion`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md)
ยาวแค่ราว 3.6 KB · สิ่งที่ควรลอกมา:

**กฎเหล็กประโยคเดียว**

> ถ้ายังไม่ได้รันคำสั่งตรวจ**ในข้อความนี้** ห้ามบอกว่ามันผ่าน

**ด่านตรวจ 5 ขั้น (gate function)** — ระบุคำสั่ง → รันเต็ม → อ่าน output **และ exit code** →
ยืนยัน → ค่อยเคลม · "ข้ามขั้นไหนก็ตาม = โกหก ไม่ใช่ตรวจสอบ"

**ตาราง เคลม / ต้องมีอะไรรองรับ / อะไรไม่พอ**

| เคลมว่า | ต้องมี | ไม่พอ |
|---|---|---|
| เทสต์ผ่าน | output จากการรันเทสต์ในข้อความนี้ | รันไปเมื่อกี้ก่อนแก้ |
| subagent ทำเสร็จ | diff จาก version control | รายงานของ subagent เอง |
| build ผ่าน | exit code 0 | ไม่มี error ขึ้นบนจอ |

**สัญญาณอันตรายที่ชัดมาก:** การแสดงความพอใจก่อนตรวจ — "เยี่ยม!" "เรียบร้อย!" —
ถือเป็นสัญญาณว่ากำลังจะเคลมโดยไม่พิสูจน์

**ทำไมเหมาะกับเราเป็นพิเศษ:** design skills ของเราบังคับ "เรนเดอร์แล้วดูด้วยตา" อยู่แล้ว
แต่กฎนี้กระจายอยู่ในแต่ละไฟล์ · ดึงออกมาเป็น skill กลาง 1 ตัวแล้วให้ตัวอื่นอ้างถึง
→ ไม่ต้องเขียนซ้ำ 4 รอบ และไม่ลืมใส่ใน skill ตัวใหม่

---

### 3 · เขียน skill ให้ตรงกับรูปแบบความผิดพลาด

จาก [`obra/superpowers` — `writing-skills`](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md)
เอกสารสอนเขียน skill ที่ดีที่สุดที่เจอ

**แนวคิดหลัก: ดูก่อนว่าพลาดแบบไหน แล้วค่อยเลือกรูปแบบการเขียน**

| อาการที่เกิดตอนไม่มี skill | รูปแบบที่ได้ผล |
|---|---|
| ทำผิดเพราะไม่มีวินัย | ข้อห้าม + ตารางข้ออ้าง + รายการสัญญาณอันตราย |
| ผลลัพธ์ออกมาผิดรูป | **สูตร/สัญญาเชิงบวก — ห้ามใช้ข้อห้าม** |
| ลืมใส่บางส่วน | ช่อง REQUIRED ในเทมเพลต |
| ควรทำเฉพาะบางกรณี | เงื่อนไขที่ผูกกับสิ่งที่**สังเกตเห็นได้** |

เขาทดสอบเทียบกันตรง ๆ แล้วพบว่า **การเขียนเป็นข้อห้ามสำหรับปัญหา "ผลลัพธ์ผิดรูป"
ทำให้ได้ของที่ไม่ต้องการ*มากกว่า*ตอนไม่ใส่อะไรเลย**

**"ห้ามมีประโยคผ่อนปรน"** — เติม "เว้นแต่จำเป็น" ประโยคเดียว สูตรที่เคยได้ผลสม่ำเสมอ
ก็ได้ผลมั่ว · และข้อยกเว้นไม่ได้จำกัดขอบเขตตามที่เขียน เช่น "ข้อจำกัดนี้ไม่ใช้กับบล็อกโค้ด"
ยังทำให้มันเลี่ยงบล็อกโค้ดอยู่ดี

**`description` ไม่ใช่บทสรุปของขั้นตอน** — ข้อนี้ตรงกับของเราหลายตัว
description ที่สรุปว่าต้องทำอะไรบ้าง จะกลายเป็นทางลัดให้ agent ใช้**แทนการอ่านเนื้อหา**
เคสที่เขาบันทึกไว้: description เขียนว่า "รีวิวโค้ดระหว่างงาน" → agent รีวิวรอบเดียว
ทั้งที่เนื้อหาบังคับสองรอบ · **description ควรมีแต่เงื่อนไขว่าเมื่อไหร่ควรเรียก**

**ทดสอบถ้อยคำก่อนใช้จริง** — รันสำนวนละ 5 ครั้ง · มีกลุ่มควบคุมที่ไม่ใส่ถ้อยคำอะไรเลยทุกครั้ง
และ**ใช้ความแปรปรวนเป็นตัวชี้วัด**: รัน 5 ครั้งได้การตีความ 5 แบบ → ถ้อยคำยังไม่ชัดพอ

**ข้อที่ขัดกับที่เราทำอยู่และควรคิด:** `skill-creator` ของ Anthropic เขียนว่า
"ถ้าพบว่าตัวเองกำลังเขียน ALWAYS หรือ NEVER ตัวใหญ่ — นั่นคือธงเหลือง
ให้เรียบเรียงใหม่แล้วอธิบายเหตุผลแทน" · skill ของเราหลายตัวใช้ ❌ รัว ๆ
บางตัวอาจได้ผลดีกว่าถ้าเปลี่ยนเป็นสูตรเชิงบวก — แต่**ต้องวัด ไม่ใช่เดา** (ข้อ 1)

---

### 4 · บันไดตัดสินใจและประตูกั้น

จาก [`superpowers` — `brainstorming`](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)

- **จัดระดับงานก่อนถามคำถามแรก แล้วบอกระดับนั้นออกมาให้คนแย้งได้**
- **บันไดขึ้นได้อย่างเดียว** — "ลังเลระหว่างสองระดับให้เลือกหนักกว่า · เจอความซับซ้อน
  ระหว่างทางให้เลื่อนขึ้น · ไม่มีการเลื่อนลงกลางทาง"
- **เงื่อนไขต้องสังเกตเห็นได้ ไม่ใช่ความรู้สึก** — "วัดที่โค้ดที่มีอยู่ ไม่ใช่วัดที่ความคุ้นเคยของคุณ"
- **ประตูกั้นที่บอกชัดว่าอนุมัติอะไร** — "การตอบรับคืออนุมัติสิ่งที่เสนอไปจริง ๆ เท่านั้น
  อนุมัติไอเดียไม่ใช่อนุมัติสิ่งที่ยังไม่มี"
- **ตั้งชื่อ anti-pattern ตามข้ออ้างที่คนใช้** — "ง่ายเกินกว่าจะต้องขออนุมัติ"
- **ตารางสัญญาณอันตรายแบบ ความคิด → ความจริง** — "ขอเรียกว่างานเล็กแล้วข้าม spec" →
  "การไขว่คว้าหาป้ายเพื่อข้ามงาน *คือ* ความลังเลนั้นเอง ให้เลือกทางที่หนักกว่า"

**เอาไปใช้กับ:** `architecture-patterns`, `auth-implementation-patterns`, `testing-standards`
(ซึ่งถามเรื่อง framework อยู่แล้ว — เพิ่มการจัดระดับงานเข้าไป)

จาก [`claude-security`](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-security/README.md)
เพิ่มอีก 2 ข้อ: **2 แกนแยกกัน** (ขอบเขต = ดูแค่ไหน · ความลึก = ทำหนักแค่ไหน) ·
**ทุกคำถามมีตัวเลือก "ไม่รู้" ที่ตกลงเป็นค่าเริ่มต้นที่สมเหตุผล** ·
และข้อสำคัญ: **ลดความลึกได้ แต่เกณฑ์การพิสูจน์ไม่ลด — คุณภาพไม่ใช่ปุ่มหมุน**

---

### 5 · ตรวจแบบปฏิปักษ์ (adversarial verification)

เรามี `code-review-checklist` ที่เป็นรายการตรวจ แต่ไม่มีกลไกกัน false positive (รายงานว่าเจอปัญหา แต่จริง ๆ ไม่ใช่ปัญหา)

**งานวิจัยที่ควรรู้:** arXiv:2503.21934 — โมเดลที่ตรวจงานตัวเองบอกว่าถูก 85.7%
พอให้คนตรวจจริงเหลือต่ำกว่า 5% · **การตรวจงานตัวเองแทบไม่มีค่า**

สิ่งที่ใช้แก้:

- **ผู้ตรวจต้องแยกบริบท** — เห็นเฉพาะคำตอบสุดท้าย ไม่เห็นกระบวนการคิดที่นำมาสู่คำตอบ
- **หน้าที่ของผู้ตรวจคือ*หักล้าง* ไม่ใช่ยืนยัน** — ให้ถือเป็น false positive ไว้ก่อน
  จนกว่าจะพิสูจน์เส้นทางจริงได้
- **ความมั่นใจห้ามเกินสิ่งที่การตรวจพิสูจน์ได้** และ**ตัวเลขความเข้มงวดต้องคำนวณด้วยโค้ด
  ไม่ใช่ให้โมเดลบอกเอง** — "รายงานที่บอกว่าตัวเองเข้มงวดแค่ไหน ต้องเป็นตัวเลขที่ตรวจทานได้"
- **บัญชีความครอบคลุม** — ทุกโฟลเดอร์ต้องถูกตรวจ หรือถูกยกเว้นพร้อมเหตุผลที่เขียนไว้
  ตัดสินใจ*ก่อน*เริ่มค้น
- **ขั้นที่ 0: เล่าข้อกล่าวหาด้วยคำของตัวเองก่อน** — Trail of Bits บอกว่า
  false positive ครึ่งหนึ่งพังตรงขั้นนี้ เพราะพอเล่าให้ชัดแล้วมันไม่สมเหตุสมผล
  ([fp-check](https://github.com/trailofbits/skills/blob/main/plugins/fp-check/skills/fp-check/SKILL.md))
- **ความมั่นใจแบ่ง 3 ระดับ · ระดับต่ำสุดแปลว่า "ไม่ต้องรายงาน"**
  ([getsentry/security-review](https://github.com/getsentry/skills/blob/main/skills/security-review/SKILL.md))

**2 ข้อที่ขัดกับสัญชาตญาณและควรจำ** (Trail of Bits):

> **อย่าใส่ "ตรวจทานอีกครั้ง" ลงใน prompt** — กับโมเดลรุ่นปัจจุบันมันทำให้ผลแย่ลง
> ให้เอาการตรวจไปไว้ในตัวตรวจที่ทำงานแน่นอนแทน

> **อย่าสั่งให้ผู้ตรวจกรองเอง** — "รายงานเฉพาะเรื่องร้ายแรง" มันจะทำตามตรงตัว
> คือหาเจอแล้วไม่รายงาน · ให้รายงานทุกอย่างพร้อมระดับความรุนแรง แล้วกรองแยกอีกรอบ

---

### 6 · ต้นทุน token ที่จ่ายอยู่ทุก session

`description` ของทุก skill ถูกโหลดค้างไว้ตลอดทุก session ไม่ว่าจะเรียกใช้หรือไม่
ส่วนเนื้อหาโหลดเฉพาะตอนถูกเรียก

**ตัวเลขจริงของเรา** (นับจากไฟล์ วันที่ 22 ก.ย. 2569):

| | |
|---|---|
| skill ทั้งหมด | 73 |
| description รวม | 22,582 ตัวอักษร |
| **≈ token ที่จ่ายทุก session ถ้าลงครบทุก plugin** | **~5,700** |
| เฉพาะ `software-company` (34 ตัว) | ~3,800 |
| add-on ตัวละ | ~130-180 |

หนักสุด 5 ตัว: `web-app-design` 204 · `mobile-app-design` 202 · `ui-craft` 191 ·
`software-diagrams` 186 · `srs-writing` 186

**อ่านตัวเลขนี้ยังไง:** ~5,700 token ไม่ได้เยอะจนน่าตกใจ และ**การลง plugin แยกตามงาน
คือสิ่งที่คุมต้นทุนนี้อยู่แล้ว** — ลงเฉพาะ core ก็จ่าย ~3,800 ไม่ใช่ 5,700
ข้อสรุปคือโครงสร้างที่เราวางไว้ถูกแล้ว ไม่ต้องรีบตัดอะไร

แต่ควรรู้ว่า **ภาษาไทยกิน token ประมาณ 1.6 เท่าของอังกฤษต่อตัวอักษร** —
description ที่เขียนไทยล้วนจึงแพงกว่าที่เห็น (`user-story-writer` เป็นตัวเดียวที่เป็นไทยล้วน)

แนวคิดจาก [`skills-janitor`](https://github.com/khendzel/skills-janitor) ที่น่าทำต่อ:
**เทียบต้นทุน token กับจำนวนครั้งที่ถูกเรียกจริง** (อ่านจาก session transcript)
แล้วเอาตัวที่กิน token มากแต่ถูกเรียกน้อยไว้บนสุด — ตัวบนสุดคือตัวที่ควรตัดหรือรวม

---

### 7 · ความสามารถที่ขาดไปเลย

เรียงตามความคุ้มค่าต่อเรา

| อะไร | ทำไมถึงขาด | ที่มา |
|---|---|---|
| **`verification-before-completion`** | ดูข้อ 2 — ช่องว่างใหญ่สุด | superpowers |
| **eval สำหรับ skill** | ดูข้อ 1 — 73 skill แต่ไม่มีตัววัด | `claude plugin eval` |
| **สแกนความปลอดภัยของ skill เอง** | งานวิจัย Snyk พบ prompt injection ใน **36%** ของ skill ที่ตรวจ · ถ้าจะรับ contribution ต้องมี | [ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) |
| **`hookify`** | กฎที่ถูกฝ่าฝืนซ้ำ ๆ ควรกลายเป็น hook ไม่ใช่กฎที่ยาวขึ้น — "เอาการตรวจไปไว้ในที่ที่มันเถียงไม่ได้" · _อัปเดต 6 ต.ค.: มี hook แล้วแต่ใช้เขียน log และแจ้ง inbox ของ SuperUser ยังไม่ใช่ตัวบังคับกฎ_ | [hookify](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/hookify/README.md) |
| **ดูแล CLAUDE.md / AGENTS.md** | ~~ไม่มีอะไรดูแลความจำระดับโปรเจกต์เลย~~ · _อัปเดต 6 ต.ค.: ทำแล้ว — `work-session-context` ดูแล `CONTEXT.md` และป้าย `AGENTS.md` · `GEMINI.md` ที่ชี้ไปหามัน_ | getsentry `agents-md` |
| **ทดสอบเว็บด้วยเบราว์เซอร์จริง** | `e2e-testing-patterns` สอนออกแบบเทสต์ แต่ไม่มีตัวที่**เปิดแอปจริงแล้วตรวจ** | [anthropics `webapp-testing`](https://github.com/anthropics/skills) |
| **ตรวจว่าโค้ดตรงกับ spec ไหม** | เรามี `srs-writing` ที่เขียน spec แต่ไม่มีตัวที่ย้อนไปตรวจว่าโค้ดทำตามจริงไหม | trailofbits `spec-to-code-compliance` |
| **ตรวจหลังแพตช์** | หาบั๊กแบบเดียวกันที่ยังหลงเหลือ (variant) และ regression พร้อม**ระบุช่องว่างของการตรวจอย่างชัดเจน** | trailofbits `post-patch-validation` |
| **สร้าง MCP server** | ไม่มีเลย ทั้งที่เป็นงานที่เจอบ่อยขึ้นเรื่อย ๆ | anthropics `mcp-builder` |

---

### 8 · ของที่ดูแล้วไม่เอา

บันทึกไว้กันเสียเวลาดูซ้ำ

| อะไร | ทำไมไม่เอา |
|---|---|
| `superpowers` ทั้งชุด | ทับซ้อนกับของเราเยอะ และเป็นแนวคิดคนละแบบ — ดึงเฉพาะ `writing-skills` กับ `verification-before-completion` มาพอ |
| ccpm (PRD → Epic → GitHub Issue) | ผูกกับ GitHub Issues แน่นเกินไป ไม่ตรงกับวิธีทำงานเรา |
| `ralph-loop` | hook ที่ขวางไม่ให้ session จบแล้วป้อน prompt เดิมซ้ำ — แปลกดีแต่ยังนึกไม่ออกว่าจะใช้ตอนไหน |
| `naming` (ตั้งชื่อแบรนด์) | คนละโดเมน · แต่โครง "คัดตัวเลือกด้วยเกณฑ์ให้คะแนน" ยืมได้ |
| skill รวมกราฟ/ชาร์ต | `web-app-design` มี chart colors อยู่แล้ว |
| `theme-factory`, `brand-guidelines` | `web-app-design` มีระบบธีม 5 ชุดอยู่แล้ว ดีกว่า |

---

### ลำดับที่แนะนำให้ทำ

1. ~~แก้ YAML ที่พัง 3 ตัว~~ ✅ + ใส่ `validate-marketplace.mjs` เข้า CI
2. เขียน `verification-before-completion` แล้วให้ design skills ทั้ง 4 ตัวอ้างถึงแทนที่จะเขียนซ้ำ
3. ตั้ง `claude plugin eval` กับ skill 5 ตัวที่ใช้บ่อยสุด ดูว่าส่วนต่างเป็นบวกจริงไหม
4. เอาผลจากข้อ 3 มาปรับ `description` — โดยเฉพาะตัวที่ description เป็นบทสรุปขั้นตอน (ข้อ 3)
5. ค่อยพิจารณาของใหม่ในข้อ 7

> ข้อ 3 สำคัญกว่าที่คิด — ถ้าไม่วัด เราจะไม่มีทางรู้ว่า skill 73 ตัวมีกี่ตัวที่ทำงานจริง
> เพิ่งเจอมาแล้ว 3 ตัวที่ไม่เคยทำงานเลยและไม่มีใครรู้

---

### ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`

---

## Skill Recommendations & Changes

_Reviewed: all 14 plugins, 67 agents, 73 skills. Goal: each agent gets more capable with **less** prompting, by reusing simple, readable skills — not by adding bulk._

---

### 1. What I found

**The "universal" skill wasn't universal.** `simplicity-first` is described as
applying to every agent, but only the 12 core `software-company` agents
referenced it. The 55 specialist agents — including every engineer who writes
code — referenced it nowhere.

**Many engineers referenced *no* skills at all:** all 4 mobile agents, all 4 IoT
agents, `blockchain-engineer`, `fintech-engineer`, `healthcare-engineer`,
`revops-analyst`, `legaltech-engineer`, `legaltech-engineer`.

**`simplicity-first` was 372 lines** — ironically bloated for a skill about
simplicity, and it mixed code rules with doc/plan/architecture rules.

**The fix model: Ponytail.** The community [`ponytail`](https://github.com/DietrichGebert/ponytail)
skill does the "keep it simple" job for *code* in ~90 lines using a decision
**ladder**, **intensity levels**, a **comment convention**, and strict **output
discipline** (code first, ≤3 lines of explanation). Reported results: 80–94%
less code, 47–77% less cost, 3–6× faster. That's the pattern worth copying.

---

### 2. What I changed (done)

1. **Created `lazy-coding`** (`software-company/skills/lazy-coding/`) — a
   ponytail-adapted skill, 90 lines, **code only**. Keeps ponytail's ladder,
   `lite/full/ultra` intensity, and output discipline; adapted to the team's
   own rule ("a tired teammate understands it in 6 months") and uses a
   `// simple:` comment to mark deliberate shortcuts with their upgrade path.

2. **Slimmed `simplicity-first`** from 372 → 119 lines, **non-code only**
   (docs, plans, architecture, designs). Code now defers to `lazy-coding`. No
   more overlap.

3. **Wired `lazy-coding` into 30 code-writing agents** across all 14 plugins —
   including the ones that previously had no skills section at all.

4. **Created `spell-out-abbreviations` and `short-answers`**
   (`software-company/skills/`) — the two rules that apply to *everything*
   written for a person, not just code or docs.

5. **Appended the abbreviation rule to all 134 agent and skill files** across
   all 14 plugins — the same problem as §1: a rule that lives only in
   `simplicity-first` reaches only the 12 core agents. The rule is now also
   written into `simplicity-first` itself, so both paths carry it.

Split rule, going forward:

| Output | Skill |
|--------|-------|
| Code (write / fix / refactor / review) | `lazy-coding` |
| Docs, plans, architecture, UX/API design | `simplicity-first` |
| Anything a person reads — first mention of an abbreviation | `spell-out-abbreviations` |
| Anything a person reads — length and plainness | `short-answers` |
| Any interface, on any platform | `ui-craft` (**with** the platform skill, not instead of it) |
| Any picture of how software works | `software-diagrams` |

---

### 3. Recommended next: reuse skills you already have

The biggest remaining win needs **no new skills** — just point specialist
engineers at the core skills that already exist. Right now they're effectively
invisible outside the core plugin. Suggested additions per agent type:

| Agent type (across plugins) | Add these existing core skills | Why |
|---|---|---|
| Every `*-engineer` / `*-developer` that commits code | `commit-message-format`, `code-review-checklist`, `work-session-context` | Consistent commits, self-review, resumable sessions — zero extra prompting |
| Agents that open PRs | `pr-description-template` | Uniform PRs, faster review |
| Agents producing diagrams in docs/PRs | `markdown-visuals` | A diagram halves review time |
| Architect-type agents (`*-architect`, `solution-architect`, `iot-engineer`) | `adr-writer`, `architecture-patterns` | Already used by `solution-architect`; reuse, don't reinvent |
| Compliance / officer agents | `polished-document-style`, `office-document-handling` | They produce reports and audit docs |

Each is a one-line addition to the agent's **Skills You Use** section, in the
same `` `skill-name` (from software-company) — when to use `` format already in
use. Say the word and I'll wire these in too.

---

### 4. Optional new skills worth creating (small, high-leverage)

Only if a real need shows up — same lazy philosophy, each ~1 page:

- **`tech-stack-defaults`** — the team's boring-by-default choices (DB, queue,
  language per layer) so every engineer reaches for the same proven tools
  instead of re-deciding. Cuts "which library?" prompting to zero.
- **`pr-self-review`** — a 10-item pre-PR checklist (tests pass, diff < 400
  lines, no debug logs). Pairs with `lazy-coding` and `code-review-checklist`.
- **`incident-comms`** — a fill-in-the-blanks status-update template for the
  cybersecurity / SRE agents during an incident.

I'd hold off on these until the reuse in §3 is in place — that alone closes
most of the gap without adding anything to maintain.

---

### 5. How to use `lazy-coding`

It triggers automatically on any code task. To steer intensity in a prompt:
`lazy lite` (suggest the lazier option, you pick), `lazy full` (default,
enforce the ladder), `lazy ultra` (challenge whether the code should exist at
all). Turn off with `stop lazy`.

**Sources:** [ponytail SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) · [ponytail repo](https://github.com/DietrichGebert/ponytail)
