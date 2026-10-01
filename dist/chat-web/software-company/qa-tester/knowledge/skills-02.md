# skill: readable-code

Use when writing or reviewing code and the question is whether a person can read it — names, function shape, comments, and where a file lives. Gives verb prefixes that each mean one thing, the words to ban, name length by lifespan, feature-based file layout and the newcomer test. For writing less code use lazy-coding.

# โค้ดที่คนอ่านรู้เรื่อง

> **กฎข้อเดียว:** ชื่อที่ต้องเปิดดูข้างในถึงจะเข้าใจ คือชื่อที่ตั้งผิด

---

## เมื่อไหร่ใช้ skill นี้

- เขียนโค้ดใหม่ · ตั้งชื่อตัวแปร ฟังก์ชัน ไฟล์ หรือโฟลเดอร์
- รีวิวโค้ดแล้วรู้สึกว่า "ทำงานถูกแต่อ่านยาก"
- คนใหม่เข้าโปรเจกต์แล้วหาไฟล์ไม่เจอ
- โฟลเดอร์ `utils/` เริ่มกลายเป็นถังขยะ

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้แทน |
|---|---|
| ต้องการเขียนโค้ด**น้อยลง** | `lazy-coding` |
| โครงโฟลเดอร์**ระดับ repo** · README · linter | `project-bootstrap` |
| รีวิวเรื่องความถูกต้อง ความปลอดภัย การทดสอบ | `code-review-checklist` |
| ตั้งชื่อ**ไฟล์เอกสาร** | `document-naming` |
| ตั้งชื่อ**ผลิตภัณฑ์หรือแบรนด์** | `product-naming` |

---

## 1 · ชื่อต้องตอบสามคำถามโดยไม่ต้องเปิดดูข้างใน

**มันคืออะไร · หน่วยอะไร · ใช้ได้ตอนไหน**

| ❌ | ✅ | ที่ต่างคือ |
|---|---|---|
| `d` | `daysSinceLastLogin` | มีหน่วย มีจุดอ้างอิง |
| `list` | `overdueInvoices` | บอกว่าข้างในคืออะไร |
| `data` | `csvRows` | `data` ไม่ได้ตัดอะไรออกเลย |
| `temp` | `swapBuffer` | บอกหน้าที่ ไม่ใช่บอกว่าชั่วคราว |
| `flag` | `hasUnpaidBalance` | อ่านแล้วรู้ว่า `true` แปลว่าอะไร |
| `timeout` | `timeoutMs` | 30 คือวินาทีหรือมิลลิวินาที |
| `price` | `priceSatang` | เลขเงินที่ไม่มีหน่วยคือบั๊กรอเกิด |
| `checkUser()` | `isUserActive()` | `check` ไม่บอกว่าคืน boolean หรือโยน error |
| `process()` | `normalizePhoneNumber()` | `process` แปลว่าอะไรก็ได้ |
| `getUser()` ที่ยิง API | `fetchUser()` | `get` แปลว่าเร็วและไม่ล้มเหลว |

> **เลขที่มีหน่วยต้องมีหน่วยในชื่อ เสมอ** — `Ms` · `Seconds` · `Bytes` · `Satang` · `Percent` · `Ratio`
> บั๊กเรื่องหน่วยไม่มีใครเห็นตอนรีวิว เห็นตอนลูกค้าโทรมา

---

## 2 · คำนำหน้าฟังก์ชัน — หนึ่งคำ หนึ่งความหมาย

**เลือกคำแล้วใช้ให้ตรงทั้งโปรเจกต์** ถ้า `get` บางตัวยิงเน็ต คนอ่านจะเลิกเชื่อชื่อทั้งหมด

| คำนำหน้า | สัญญาว่า |
|---|---|
| `get` | คืนของที่มีอยู่แล้ว เร็ว ไม่มีผลข้างเคียง ไม่ล้มเหลว |
| `fetch` · `load` | ไปเอาจากที่อื่น — ช้าได้ ล้มเหลวได้ ต้อง `await` |
| `compute` · `calculate` | คำนวณใหม่ทุกครั้ง ไม่เก็บผล |
| `build` · `create` | สร้างของใหม่คืนออกมา |
| `save` · `update` · `delete` | เขียนทับของเดิม มีผลข้างเคียงแน่นอน |
| `ensure` | ทำให้เป็นจริง ถ้าเป็นอยู่แล้วไม่ทำอะไร เรียกซ้ำได้ |
| `validate` · `assert` | **โยน error** ถ้าไม่ผ่าน |
| `is` · `has` · `can` | คืน `true`/`false` ไม่เปลี่ยนอะไร |
| `try...` | คืน `null`/`false` แทนการโยน |
| `on...` · `handle...` | ตัวรับเหตุการณ์ ไม่มีใครเรียกตรง ๆ |

**กฎประกอบ:**

- **boolean ห้ามตั้งชื่อเชิงปฏิเสธ** — `isNotReady` ทำให้เกิด `if (!isNotReady)` ที่ไม่มีใครอ่านออก
- **collection เป็นพหูพจน์ และบอกชนิดข้างใน** — `userIds` ไม่ใช่ `users` ถ้าข้างในเป็นเลข
- **ชื่อฟังก์ชันที่มีคำว่า `and` คือฟังก์ชันสองตัว** — `saveAndNotify()` แยกเป็นสองตัว
- **ค่าคงที่ใช้ตัวพิมพ์ใหญ่เฉพาะค่าที่ตั้งครั้งเดียวจริง ๆ** — ค่าที่อ่านจาก config ไม่ใช่ค่าคงที่

---

## 3 · ชื่อยาวแค่ไหน ขึ้นกับว่ามันมีชีวิตอยู่กี่บรรทัด

| ระยะจากที่ประกาศถึงที่ใช้ครั้งสุดท้าย | ความยาวชื่อที่เหมาะ | ตัวอย่าง |
|---|---|---|
| ≤ 5 บรรทัด (ตัวนับใน loop) | 1 ตัวอักษร พอ | `i` · `r` · `x` |
| ในฟังก์ชันเดียว | 1–2 คำ | `total` · `rawRows` |
| ทั้งคลาสหรือทั้งไฟล์ | 2–3 คำ | `pendingApprovals` |
| export ออกนอกไฟล์ | เต็ม ไม่ย่อ | `calculateWithholdingTax` |

> **ชื่อยาวขึ้นตามระยะห่างระหว่างที่ประกาศกับที่ใช้** — `i` ใน loop สามบรรทัดชัดเจนกว่า `currentIndex`
> แต่ `i` ที่เป็น field ของคลาสคือชื่อที่ไม่มีใครตามได้

---

## 4 · คำต้องห้าม — ใส่แล้วไม่ได้ตัดความหมายอะไรออกเลย

| ห้ามใช้ | ทำไม | แทนด้วย |
|---|---|---|
| `data` · `info` · `item` · `obj` · `value` | ทุกอย่างในโปรแกรมคือข้อมูล | ชื่อของสิ่งนั้นจริง ๆ |
| `manager` · `handler` · `processor` · `service` | ทำอะไรก็ได้ = ไม่ได้บอกอะไร | กริยาที่มันทำ — `InvoiceRenderer` |
| `helper` · `util` · `common` · `misc` | คือที่ที่โค้ดไปตายเมื่อไม่รู้จะวางไหน | แยกตามเรื่อง — `money.ts` · `thai-date.ts` |
| `do` · `perform` · `execute` · `run` | กริยาว่างเปล่า | กริยาจริง — `sendInvoice` |
| `temp` · `tmp` · `foo` · `test2` | อยู่ในโค้ดอีกสามปี | หน้าที่ของมัน |
| ตัวย่อที่คิดขึ้นเอง (`usrMgr` · `calcAmt`) | ประหยัดตัวอักษร แลกกับเวลาคนอ่าน | เขียนเต็ม |

**ข้อยกเว้น:** ตัวย่อที่คนทั้งวงการใช้ — `id` · `url` · `http` · `db` · `api` · `ui` — ใช้ได้เลย ไม่ต้องกาง

---

## 5 · รูปร่างของฟังก์ชัน

- **หนึ่งฟังก์ชัน หนึ่งระดับนามธรรม** — ฟังก์ชันที่มีทั้ง "ส่งอีเมล" และ "ต่อสตริง SQL" อ่านยากเพราะสมองต้องสลับระดับ
- **พารามิเตอร์ไม่เกิน 3 ตัว** เกินนั้นรับเป็น object ที่มีชื่อฟิลด์
- **ห้ามรับ boolean เป็นพารามิเตอร์** — `render(true)` ที่จุดเรียกอ่านไม่ออกว่า `true` คืออะไร
  แยกเป็น `renderDraft()` กับ `renderFinal()` หรือรับ `{ mode: "draft" }`
- **คืนค่าก่อนดีกว่าซ้อน `else`** — เงื่อนไขที่ตัดจบได้ ให้ `return` ทันที เหลือทางหลักไม่เยื้อง
- **เยื้องเกิน 3 ชั้น = ต้องแตกฟังก์ชัน** ไม่ใช่เพราะกฎ แต่เพราะสมองตามเงื่อนไขซ้อนสี่ชั้นไม่ไหว

---

## 6 · คอมเมนต์ — เขียน "ทำไม" ไม่ใช่ "ทำอะไร"

```ts
// ❌ เพิ่มค่า i ทีละ 1
// ❌ ฟังก์ชันคำนวณภาษี

// ✅ กรมสรรพากรกำหนดให้ปัดเศษสตางค์ลงเสมอ ไม่ใช่ปัดใกล้สุด (ประกาศ ป.161/2566)
// ✅ ผู้ให้บริการ SMS จำกัด 3 ข้อความ/วินาที เกินแล้วบล็อกไอพี 5 นาที
// ✅ ต้องเรียงลำดับนี้เท่านั้น — เรียก validate ก่อน normalize จะได้เบอร์ที่ผิดรูปแบบ
```

**คอมเมนต์ที่อธิบายว่าโค้ดทำอะไร คือสัญญาณว่าชื่อตั้งผิด** — แก้ชื่อแล้วลบคอมเมนต์

**สี่แบบที่ควรมีคอมเมนต์:**

| แบบ | ตัวอย่าง |
|---|---|
| ข้อจำกัดจากภายนอก | ข้อกำหนดของ API ที่เรียก · กฎหมาย · ข้อจำกัดของฮาร์ดแวร์ |
| การตัดสินใจที่ดูแปลกแต่ตั้งใจ | "ไม่ใช้ index ที่นี่เพราะตารางเขียนบ่อยกว่าอ่าน" |
| สูตรหรือกฎธุรกิจที่มีที่มา | อ้างเลขข้อในเอกสาร ไม่ใช่เล่าสูตรซ้ำ |
| `TODO` ที่มีเจ้าของและเงื่อนไข | `TODO(jk): ย้ายไป Redis เมื่อรันเกิน 1 process` |

> **คอมเมนต์ที่โกหกอันตรายกว่าไม่มีคอมเมนต์** — แก้โค้ดแล้วต้องแก้คอมเมนต์ในรอบเดียวกัน

---

## 7 · โครงสร้างไฟล์ที่คนใหม่หาเจอ

**บททดสอบ:** คนที่เพิ่งเข้าโปรเจกต์ ได้ bug report ว่า *"ปุ่มบันทึกใบแจ้งหนี้ไม่ทำงาน"*
ต้องเดาโฟลเดอร์ถูก**ภายใน 30 วินาที** โดยไม่ต้องถามใคร

### จัดตามฟีเจอร์ ไม่ใช่ตามชนิดไฟล์

```
❌ จัดตามชนิด — แก้ฟีเจอร์เดียวต้องเปิด 5 โฟลเดอร์
src/
  controllers/   invoice.ts  customer.ts  report.ts
  services/      invoice.ts  customer.ts  report.ts
  models/        invoice.ts  customer.ts  report.ts
  validators/    invoice.ts  customer.ts  report.ts

✅ จัดตามฟีเจอร์ — ทุกอย่างของใบแจ้งหนี้อยู่ที่เดียว
src/
  invoice/       routes.ts  service.ts  model.ts  validation.ts  invoice.test.ts
  customer/      ...
  report/        ...
  shared/        money.ts  thai-date.ts  http-client.ts
```

**กฎ:**

- **ชื่อไฟล์คือชื่อของสิ่งที่มัน export เป็นหลัก** — `InvoiceRenderer` อยู่ใน `invoice-renderer.ts`
- **ไฟล์ทดสอบอยู่ข้างไฟล์ที่มันทดสอบ** ไม่ใช่ใน `tests/` ที่ต้องไล่หาคู่
- **ไม่มี `utils/` ก้อนเดียว** — ถ้าของสองชิ้นไม่เกี่ยวกัน มันไม่ควรอยู่ไฟล์เดียวกัน
  `shared/` ยอมได้ แต่ข้างในต้องแตกตามเรื่อง ไม่ใช่กองรวม
- **`index` ที่ re-export ทั้งโฟลเดอร์ ทำให้ "ไปที่นิยาม" ในเครื่องมือแก้โค้ดพัง** — ใช้เท่าที่จำเป็นจริง
- **โฟลเดอร์ที่มีไฟล์เดียวคือโฟลเดอร์ที่ยังไม่ควรมี**

---

## 8 · ขนาดและลำดับข้างในไฟล์

- **ไฟล์เกิน ~300 บรรทัด เป็นสัญญาณ ไม่ใช่กฎ** — ถ้าเลื่อนหาของเจอง่ายก็ปล่อยไว้
- **ลำดับในไฟล์: import → ค่าคงที่ → type → สิ่งที่ export → helper ส่วนตัว**
- **ฟังก์ชันที่ถูกเรียก อยู่ใต้ฟังก์ชันที่เรียกมัน** — อ่านจากบนลงล่างได้เหมือนบทความ
  ของสำคัญอยู่บน รายละเอียดอยู่ล่าง คนอ่านหยุดตรงไหนก็เข้าใจภาพรวมแล้ว

---

## 9 · ภาษาไทยกับอังกฤษในโค้ด

| อะไร | ภาษา |
|---|---|
| ชื่อตัวแปร ฟังก์ชัน คลาส ไฟล์ โฟลเดอร์ ตาราง คอลัมน์ | **อังกฤษเสมอ** |
| คอมเมนต์ | ไทยได้ ถ้าทีมอ่านไทย |
| ข้อความที่ผู้ใช้เห็น | ไทย — แต่ไม่ฝังในโค้ด (`i18n-and-locale`) |
| commit message · ชื่อ branch | ตามที่ทีมตกลง เลือกแล้วใช้ให้ตรงกัน |

- **ห้ามปนครึ่งคำ** — `checkบัตร` · `userชื่อ` อ่านยากและพังใน terminal บางตัว
- **คำเฉพาะทางไทยที่ไม่มีคำอังกฤษตรง ๆ** ให้หาคำอังกฤษที่ใกล้ที่สุดก่อน
  (`เลขประจำตัวผู้เสียภาษี` → `taxId` · `ภาษีหัก ณ ที่จ่าย` → `withholdingTax`)
  ถ้าไม่มีจริง ๆ ใช้ทับศัพท์เต็มคำ แล้วอธิบายไว้ที่ `DATA-DICTIONARY.md`

---

## 10 · รายการตรวจก่อนส่งโค้ด

- [ ] ไม่มีชื่อจากตารางคำต้องห้ามในข้อ 4
- [ ] ตัวเลขที่มีหน่วยทุกตัว มีหน่วยอยู่ในชื่อ
- [ ] คำนำหน้าฟังก์ชันตรงกับที่มันทำจริง — `get` ไม่ยิงเน็ต · `validate` โยน error จริง
- [ ] boolean ทุกตัวเป็นประโยคบอกเล่า อ่านแล้วรู้ว่า `true` แปลว่าอะไร
- [ ] ไม่มีฟังก์ชันที่รับ boolean เป็นพารามิเตอร์
- [ ] ไม่มีคอมเมนต์ที่แค่แปลโค้ดเป็นภาษาคน
- [ ] คอมเมนต์ทุกอันยังตรงกับโค้ดปัจจุบัน
- [ ] คนใหม่ที่ได้ bug report หนึ่งข้อ เดาโฟลเดอร์ถูกใน 30 วินาที
- [ ] ไม่มีตัวระบุภาษาไทย ไม่มีชื่อปนครึ่งคำ

---

## 11 · Anti-patterns

- ❌ **แก้ชื่อทั้งไฟล์ในคอมมิตเดียวกับที่แก้ตรรกะ** — รีวิวไม่ได้ว่าอะไรเปลี่ยนจริง แยกคอมมิต
- ❌ **`utils.ts` ที่มี 40 ฟังก์ชันไม่เกี่ยวกัน**
- ❌ **คอมเมนต์หัวไฟล์ที่ generate มาแล้วไม่มีใครอัปเดต** — `@author` `@version` ที่ git บอกได้ดีกว่า
- ❌ **โค้ดที่ถูกคอมเมนต์ทิ้งไว้ "เผื่อได้ใช้"** — git เก็บให้แล้ว ลบทิ้ง
- ❌ **ตั้งชื่อตาม pattern แทนตามหน้าที่** — `InvoiceFactoryStrategyImpl` บอกว่าใช้ pattern อะไร ไม่ได้บอกว่าทำอะไร
- ❌ **เปลี่ยนแบบการตั้งชื่อกลางโปรเจกต์** — ไม่สม่ำเสมอแย่กว่าแบบที่ไม่สวย
- ❌ **ย่อชื่อเพราะบรรทัดยาวเกิน** — ขึ้นบรรทัดใหม่ อย่าตัดชื่อ

---

## 12 · ตัวย่อ

- **API** — Application Programming Interface
- **SQL** — Structured Query Language
- **SMS** — Short Message Service
- **TODO** — สิ่งที่ยังไม่ได้ทำและตั้งใจจะทำ
- **YAGNI** — You Aren't Gonna Need It

---

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เขียนโค้ดให้น้อยลง | `lazy-coding` |
| โครง repo · README · linter | `project-bootstrap` |
| รีวิวความถูกต้องและความปลอดภัย | `code-review-checklist` |
| รูปแบบ log และชื่อ field ใน log | `logging-standards` |
| ชื่อตารางและคอลัมน์ในฐานข้อมูล | `database-design` |
| ชื่อ endpoint และ field ใน API | `api-conventions` |
| ข้อความที่ผู้ใช้เห็น ไทย-อังกฤษ | `i18n-and-locale` |
| ตารางอ้างอิงแบบหน้าเดียว | `assets/naming-reference.md` |


---

# skill: bug-report-template

Use when reporting a bug, documenting a defect found during testing, or converting a user complaint into a trackable bug report. Ensures all reproducible steps, environment details, and evidence are captured.

# Bug Report Template

## Where bug reports live

One file per bug in `qa/bugs/BUG-<NNN>-<slug>.md` at the project root. Attach screenshots and logs under `qa/bugs/BUG-<NNN>/` — redact personal data first.

## When to use this skill

- Filing a new bug during testing
- Converting user complaints into bug tickets
- Reproducing an issue and documenting findings

## Severity vs Priority

These are **different**:

| | Severity | Priority |
|---|----------|----------|
| What it measures | Technical impact | Business urgency |
| Set by | QA / Engineering | PM / PO |

| Severity | Definition |
|----------|------------|
| **S1 Critical** | System unusable, data loss, no workaround |
| **S2 High** | Major feature broken, workaround exists |
| **S3 Medium** | Feature partially broken |
| **S4 Low** | Cosmetic, minor inconvenience |

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately, block release |
| **P2** | Fix in current sprint |
| **P3** | Fix in next sprint |
| **P4** | Fix when convenient / backlog |

## Output Template

```markdown
# Bug: <concise, descriptive title>

**ID:** BUG-XXXX
**Severity:** S1 | S2 | S3 | S4
**Priority:** P1 | P2 | P3 | P4
**Reporter:** <name>
**Date:** YYYY-MM-DD
**Affected Component:** <module/feature>
**Affected Version:** <build/release>

## Environment
- OS: ...
- Browser: ... (version)
- Device: Desktop | Mobile | Tablet
- Screen size: ...
- Network: WiFi | Mobile data | VPN
- User role: ...

## Steps to Reproduce
1. Navigate to ...
2. Click ...
3. Enter ...
4. Observe ...

## Expected Result
<what should happen>

## Actual Result
<what actually happens>

## Frequency
Always (100%) | Often (>50%) | Sometimes (<50%) | Rare (<10%)

## Evidence
- Screenshot: [link]
- Video: [link]
- Console errors: \`\`\`<paste>\`\`\`
- Network trace: ...
- Log excerpt: ...

## Impact
- Users affected: All | Specific role | Edge case
- Business impact: ...
- Data integrity: Compromised | At risk | Not affected

## Workaround
<temporary fix users can do, or "None">

## Possible Root Cause (optional)
<if you have a hypothesis>

## Related
- Related bugs: BUG-XXXX
- User story: US-XXX
- Test case: TC-XXX-NNN
```

## Title Writing Guide

❌ Bad titles:
- "Login broken"
- "Bug in checkout"
- "It doesn't work"

✅ Good titles (action + condition + result):
- "Login fails with 500 error when email contains apostrophe"
- "Checkout total shows NaN when quantity is decimal"
- "Search returns no results for queries longer than 100 chars"

**Formula:** `<Action> + <Condition> + <Unexpected result>`

## Steps to Reproduce Rules

- [ ] Start from a known state (logged out, fresh browser, etc.)
- [ ] Each step is one action
- [ ] Anyone can follow without prior knowledge
- [ ] Include exact data used (not "some user")
- [ ] No skipped steps (even "obvious" ones)
- [ ] Numbered sequentially

## Quality Checklist

Before submitting:

- [ ] Title clearly summarizes the issue
- [ ] Severity AND priority both set
- [ ] Steps are reproducible by someone else
- [ ] Expected vs actual is clearly different
- [ ] At least one piece of evidence attached
- [ ] Environment info complete
- [ ] Searched for duplicates first

## Anti-patterns

- ❌ "Same as last week's bug" — describe it fully
- ❌ Multiple bugs in one report — split them
- ❌ "Bug" without steps — provide reproduction
- ❌ Including fix proposal in title — that's for the dev
- ❌ Marking everything as P1 — be honest about priority

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.
