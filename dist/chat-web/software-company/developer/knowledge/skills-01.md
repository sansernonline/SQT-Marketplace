# skill: code-orientation

Use when about to change code not yet read this session. Maps how it runs, why, and repo conventions.

# code-orientation — อ่านโค้ดเดิมให้เข้าใจก่อนแตะ

> โค้ดที่ agent เขียนพังส่วนใหญ่ไม่ใช่เพราะเขียนไม่เป็น แต่เพราะไม่รู้ว่าโค้ดเดิมทำงานยังไง และทำไมถึงเขียนแบบนี้
> 10 นาทีที่อ่าน ประหยัดรอบแก้ได้หลายรอบ

แนวคิดมาจาก `/how` · `/why` ของ pstack ให้ใช้ก่อน playbook `feature` · `bug-fix` · `refactor` · `review` ทุกครั้งที่ยังไม่ได้อ่านส่วนนั้นใน session นี้

ข้ามได้เมื่อแก้ข้อความหรือค่าคงที่จุดเดียว หรือเขียนไฟล์ใหม่ที่ไม่มีใครเรียก

---

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ระบบเดิมทั้งระบบไม่มีเอกสาร ต้องกู้ spec ก่อนรับงานแก้ | `legacy-spec-recovery` |
| ไม่มีซอร์สโค้ด มีแต่ไฟล์ที่ compile แล้ว | `reverse-engineering` |
| คนใหม่ต้องรู้จักทั้ง repo (ติดตั้ง รัน โครงทั้งหมด) ไม่ใช่แค่ส่วนที่จะแก้ | `/onboard` |

## 1 · How — โค้ดทำงานยังไง

1. **หาทางเข้า** — route · controller · command · job · event handler ที่รับงานนี้ โดยค้นจากข้อความบนหน้าจอ URL หรือชื่อ API ที่ผู้ใช้พูดถึง (`rg -n "ข้อความ" --glob '!**/node_modules/**'`)
2. **ไล่เส้นทางจริง** — จากทางเข้า → กฎธุรกิจ → ที่เก็บข้อมูล แล้วจดชื่อไฟล์และฟังก์ชันตามลำดับที่เรียก ไม่เดาจากชื่อ แต่เปิดอ่านจริง
3. **หาจุดที่ใช้ร่วม** — ฟังก์ชันหรือ type ที่จะแตะ ถูกเรียกจากที่ไหนอีก (`rg -n "ชื่อฟังก์ชัน\("`) ถ้ามีหลายจุดต้องใช้ `blast-radius` ตอนแก้
4. **รันดูจริงถ้าทำได้** — ใส่ log ชั่วคราวหรือ breakpoint 1–2 จุด แล้วทำตามขั้นตอนของผู้ใช้ เพราะเห็นค่าจริงดีกว่าอ่านอย่างเดียว และลบ log ชั่วคราวก่อนส่ง

ถ้าโค้ดยาว ให้ส่ง subagent ระดับเล็กหรือกลางไปไล่ แล้วรับแค่แผนที่กลับมา (`context-budget`)

## 2 · Why — ทำไมถึงเขียนแบบนี้

ก่อนเปลี่ยนสิ่งที่ดูแปลก ให้หาเหตุผลก่อน เพราะโค้ดแปลก ๆ มักกันบั๊กที่เคยเกิด

| ดูที่ | คำสั่ง |
|---|---|
| ใครแก้บรรทัดนี้ เพราะอะไร | `git log -L <เริ่ม>,<จบ>:<ไฟล์>` · `git blame -w <ไฟล์>` แล้ว `git show <commit>` |
| commit ที่พูดถึงเรื่องนี้ | `git log --oneline -S "ชื่อฟังก์ชัน"` · `git log --grep "คำค้น"` |
| เอกสาร | `docs/` · ADR · `CONTEXT.md` · comment ที่บอก "ทำไม" |
| test ที่ล็อกพฤติกรรมไว้ | ค้นชื่อฟังก์ชันในโฟลเดอร์ test เพราะ test บอกเจตนาได้ดีกว่า comment |

ถ้าหาเหตุผลไม่เจอ อย่าเพิ่งลบทิ้ง ให้จดเป็น `(รอยืนยัน)` ในแผนที่ แล้วเขียน test ล็อกพฤติกรรมเดิมก่อนเปลี่ยน

## 3 · แบบแผนของ repo

อ่านไฟล์ที่คล้ายกับที่จะเขียน 2–3 ไฟล์ แล้วจด:
- **คำสั่ง** — install · build · test · lint · format · รัน test ตัวเดียว (จาก README · `package.json` · `*.csproj` · `pyproject.toml` · CI config)
- **โครง** — วางไฟล์แบบไหน · ตั้งชื่อแบบไหน · จัดการ error และ log แบบไหน · test เขียนแบบไหน
- **stack** — เปิด skill ตามภาษา: `stack-dotnet` · `stack-typescript` · `stack-python` · `stack-sql`

ทำตามแบบของ repo แม้ไม่ใช่แบบที่ชอบ ถ้าอยากเปลี่ยนแบบแผนให้เสนอในรายงาน ไม่เปลี่ยนเงียบ ๆ กลางงาน

## 4 · แผนที่ 10 บรรทัด

เขียนลง todo หรือคำตอบก่อนเริ่มแก้ แล้วส่งให้ subagent ที่จะเขียนโค้ดด้วย

```text
งาน: <1 บรรทัด>
ทางเข้า: <ไฟล์:บรรทัด>
เส้นทาง: <A.fn> → <B.fn> → <C.fn> → <ตาราง/ไฟล์>
จุดที่จะแก้: <ไฟล์:ฟังก์ชัน>
ใช้ร่วมกับ: <จุดอื่นที่เรียก> (blast-radius: ใช่/ไม่)
ทำไมเขียนแบบนี้: <เหตุผลจาก commit หรือ docs> · ไม่รู้ → (รอยืนยัน)
แบบแผน: <ชื่อ · error · test ที่ต้องตาม>
คำสั่ง: build <...> · test <...> · test ตัวเดียว <...>
test ที่ล็อกพฤติกรรมอยู่: <ไฟล์> · ไม่มี → เขียนก่อนแก้
เสี่ยง: <อะไรพังได้>
```

## 5 · กับดัก

- อ่านแค่ไฟล์ที่ชื่อตรงกับงาน แล้วพลาด wrapper หรือ middleware ที่แปลงข้อมูลก่อนถึง
- เชื่อ comment เก่าที่ไม่ตรงกับโค้ดแล้ว ทั้งที่โค้ดและ test คือความจริง
- ไล่โค้ดทั้ง repo จน context เต็ม ทั้งที่ควรอ่านเฉพาะเส้นทางของงานนี้
- "ปรับให้สะอาด" ระหว่างทางโดยไม่มี test ซึ่งควรแยกเป็นงาน refactor

## 6 · เชื่อมกับ skill อื่น

`context-budget` (อ่านเยอะ) · `blast-radius` (แก้ของใช้ร่วม) · `principle-fix-root-cause` (bug) · `readable-code` · `lazy-coding` · `testing-standards` · skill ตาม stack


---

# skill: readable-code

Use when writing or reviewing code for readability (names, function shape, comments, file location).

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
> บั๊กเรื่องหน่วยไม่มีใครเห็นตอนรีวิว แต่จะเห็นตอนลูกค้าโทรมา

---

## 2 · คำนำหน้าฟังก์ชัน — หนึ่งคำ หนึ่งความหมาย

**เลือกคำแล้วใช้ให้ตรงทั้งโปรเจกต์** ถ้า `get` บางตัวยิงเน็ต คนอ่านจะเลิกเชื่อชื่อทั้งหมด

ตารางคำนำหน้าทั้ง 10 กลุ่ม (สัญญาว่าอะไร · ล้มเหลวได้ไหม · มีผลข้างเคียงไหม) อยู่ที่ [`assets/naming-reference.md`](assets/naming-reference.md) ข้อ 2 — เช่น `get` ไม่ยิงเน็ต · `validate` โยน error · `ensure` เรียกซ้ำได้

**กฎประกอบ:**

- **boolean ห้ามตั้งชื่อเชิงปฏิเสธ** — `isNotReady` ทำให้เกิด `if (!isNotReady)` ที่ไม่มีใครอ่านออก
- **collection เป็นพหูพจน์ และบอกชนิดข้างใน** — `userIds` ไม่ใช่ `users` ถ้าข้างในเป็นเลข
- **ชื่อฟังก์ชันที่มีคำว่า `and` คือฟังก์ชัน 2 ตัว** — `saveAndNotify()` ควรแยกเป็น 2 ตัว
- **ค่าคงที่ใช้ตัวพิมพ์ใหญ่เฉพาะค่าที่ตั้งครั้งเดียวจริง ๆ** ส่วนค่าที่อ่านจาก config ไม่ใช่ค่าคงที่

---

## 3 · ชื่อยาวแค่ไหน ขึ้นกับว่ามันมีชีวิตอยู่กี่บรรทัด

| ระยะจากที่ประกาศถึงที่ใช้ครั้งสุดท้าย | ความยาวชื่อที่เหมาะ | ตัวอย่าง |
|---|---|---|
| ≤ 5 บรรทัด (ตัวนับใน loop) | 1 ตัวอักษร พอ | `i` · `r` · `x` |
| ในฟังก์ชันเดียว | 1–2 คำ | `total` · `rawRows` |
| ทั้งคลาสหรือทั้งไฟล์ | 2–3 คำ | `pendingApprovals` |
| export ออกนอกไฟล์ | เต็ม ไม่ย่อ | `calculateWithholdingTax` |

> **ชื่อยาวขึ้นตามระยะห่างระหว่างที่ประกาศกับที่ใช้** — `i` ใน loop 3 บรรทัดชัดเจนกว่า `currentIndex`
> แต่ `i` ที่เป็น field ของคลาสคือชื่อที่ไม่มีใครตามได้

---

## 4 · คำต้องห้าม — ใส่แล้วไม่ได้ตัดความหมายอะไรออกเลย

**ห้าม `data` `info` `manager` `helper` `util` `do` `temp` และตัวย่อที่คิดเอง** — ทุกอย่างในโปรแกรมคือข้อมูล ชื่อที่ทำอะไรก็ได้คือชื่อที่ไม่บอกอะไร · ตารางเต็มพร้อมคำแทนอยู่ที่ [`assets/naming-reference.md`](assets/naming-reference.md) ข้อ 4

**ข้อยกเว้น:** ตัวย่อที่คนทั้งวงการใช้ — `id` · `url` · `http` · `db` · `api` · `ui` — ใช้ได้เลย ไม่ต้องกาง
ส่วนชื่อที่ platform หรือ framework ตั้งมาแล้ว (`SensorManager` · Android `Service` · `ChangeNotifier`) ก็ใช้ตามนั้น
เพราะคำต้องห้ามใช้กับชื่อที่**เราตั้งเอง**เท่านั้น

---

## 5 · รูปร่างของฟังก์ชัน

- **หนึ่งฟังก์ชัน หนึ่งระดับนามธรรม** — ฟังก์ชันที่มีทั้ง "ส่งอีเมล" และ "ต่อสตริง SQL" อ่านยากเพราะสมองต้องสลับระดับ
- **พารามิเตอร์ไม่เกิน 3 ตัว** ถ้าเกินนั้นให้รับเป็น object ที่มีชื่อฟิลด์
- **ห้ามรับ boolean เป็นพารามิเตอร์** — `render(true)` ที่จุดเรียกอ่านไม่ออกว่า `true` คืออะไร
  ให้แยกเป็น `renderDraft()` กับ `renderFinal()` หรือรับ `{ mode: "draft" }`
  **ยกเว้น named parameter** ที่จุดเรียกเห็นชื่อ เช่น `TextField(obscureText: true)` ใน Dart หรือ `enabled: true` ซึ่งอ่านออกอยู่แล้ว
- **คืนค่าก่อนดีกว่าซ้อน `else`** — เงื่อนไขที่ตัดจบได้ ให้ `return` ทันที ทางหลักจะได้ไม่เยื้อง
- **ถ้าเยื้องเกิน 3 ชั้น ต้องแตกฟังก์ชัน** ไม่ใช่เพราะกฎ แต่เพราะสมองตามเงื่อนไขซ้อน 4 ชั้นไม่ไหว

---

## 6 · คอมเมนต์ — เขียน "ทำไม" ไม่ใช่ "ทำอะไร"

```ts
// ❌ เพิ่มค่า i ทีละ 1
// ❌ ฟังก์ชันคำนวณภาษี

// ✅ กรมสรรพากรกำหนดให้ปัดเศษสตางค์ลงเสมอ ไม่ใช่ปัดใกล้สุด (ประกาศ ป.161/2566)
// ✅ ผู้ให้บริการ SMS จำกัด 3 ข้อความ/วินาที เกินแล้วบล็อกไอพี 5 นาที
// ✅ ต้องเรียงลำดับนี้เท่านั้น — เรียก validate ก่อน normalize จะได้เบอร์ที่ผิดรูปแบบ
```

**คอมเมนต์ที่อธิบายว่าโค้ดทำอะไร คือสัญญาณว่าชื่อตั้งผิด** ให้แก้ชื่อแล้วลบคอมเมนต์

**4 แบบที่ควรมีคอมเมนต์:**

| แบบ | ตัวอย่าง |
|---|---|
| ข้อจำกัดจากภายนอก | ข้อกำหนดของ API ที่เรียก · กฎหมาย · ข้อจำกัดของฮาร์ดแวร์ |
| การตัดสินใจที่ดูแปลกแต่ตั้งใจ | "ไม่ใช้ index ที่นี่เพราะตารางเขียนบ่อยกว่าอ่าน" |
| สูตรหรือกฎธุรกิจที่มีที่มา | อ้างเลขข้อในเอกสาร ไม่ใช่เล่าสูตรซ้ำ |
| `TODO` ที่มีเจ้าของและเงื่อนไข | `TODO(somchai): ย้ายไป Redis เมื่อรันเกิน 1 process` |

> **คอมเมนต์ที่โกหกอันตรายกว่าไม่มีคอมเมนต์** ถ้าแก้โค้ดต้องแก้คอมเมนต์ในรอบเดียวกัน

### รอบคัดคอมเมนต์ก่อนรีวิว

ก่อนส่งรีวิว ไล่ทุกคอมเมนต์ที่ diff เพิ่มหรือแก้ แล้วจัดเข้า 1 ใน 4 ทางในตารางนี้ ถ้า diff ใหญ่ให้ subagent ระดับกลางอ่านอย่างเดียวแล้วทำรายการ ส่วน agent หลักเป็นคนตัดสิน

| คอมเมนต์ | ทำ |
|---|---|
| แปลโค้ดเป็นภาษาคน · ล้าสมัย · โค้ดที่ถูกคอมเมนต์ทิ้ง | ลบ |
| อธิบายว่าตัวแปรหรือฟังก์ชันคืออะไร | เปลี่ยนชื่อให้บอกเอง แล้วลบ |
| อ้างข้อจำกัด ("ห้าม null" · "ต้องเรียกหลัง init" · "ค่าไม่เกิน 100") | เปลี่ยนเป็นของที่ตรวจได้ เช่น type · assert · test · lint (`repeated-mistakes-to-checks`) แล้วลบ |
| 4 แบบในตารางข้างบน | เก็บ |

รายงานผลเป็นตัวเลข: ลบกี่อัน · เปลี่ยนชื่อกี่อัน · กลายเป็นการตรวจกี่อัน · เก็บกี่อัน

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
  รูปแบบตัวพิมพ์ตามธรรมเนียมของภาษา: Dart/Python ใช้ snake_case (`invoice_renderer.dart`) ส่วน .NET ใช้ `InvoiceRenderer.cs`
- **ไฟล์ทดสอบอยู่ข้างไฟล์ที่มันทดสอบ** ไม่ใช่ใน `tests/` ที่ต้องไล่หาคู่
  **ยกเว้น stack ที่เครื่องมือบังคับโฟลเดอร์ทดสอบ** เช่น Flutter (`flutter test` หาใน `test/` และ test ใน `lib/` จะลาก `flutter_test` เข้าแอป) · .NET (โปรเจกต์ทดสอบแยกใน `tests/`) — ตาราง `project-bootstrap` ข้อ 1
  ให้ใช้โครงโฟลเดอร์ใน `test/` เหมือน `lib/` เป๊ะ เช่น `lib/invoice/renderer.dart` ↔ `test/invoice/renderer_test.dart`
- **ไม่มี `utils/` ก้อนเดียว** เพราะถ้าของ 2 ชิ้นไม่เกี่ยวกัน ก็ไม่ควรอยู่ไฟล์เดียวกัน
  `shared/` ยอมได้ แต่ข้างในต้องแตกตามเรื่อง ไม่ใช่กองรวม
- **`index` ที่ re-export ทั้งโฟลเดอร์ ทำให้ "ไปที่นิยาม" ในเครื่องมือแก้โค้ดพัง** จึงใช้เท่าที่จำเป็นจริง
- **โฟลเดอร์ที่มีไฟล์เดียวคือโฟลเดอร์ที่ยังไม่ควรมี**

---

## 8 · ขนาดและลำดับข้างในไฟล์

- **ไฟล์เกิน ~300 บรรทัด เป็นสัญญาณ ไม่ใช่กฎ** ถ้าเลื่อนหาของเจอง่ายก็ปล่อยไว้
- **ลำดับในไฟล์: import → ค่าคงที่ → type → สิ่งที่ export → helper ส่วนตัว**
- **ฟังก์ชันที่ถูกเรียก อยู่ใต้ฟังก์ชันที่เรียกมัน** จะได้อ่านจากบนลงล่างได้เหมือนบทความ
  ของสำคัญอยู่บน รายละเอียดอยู่ล่าง คนอ่านหยุดตรงไหนก็เข้าใจภาพรวมแล้ว

---

## 9 · ภาษาไทยกับอังกฤษในโค้ด

| อะไร | ภาษา |
|---|---|
| ชื่อตัวแปร ฟังก์ชัน คลาส ไฟล์ โฟลเดอร์ ตาราง คอลัมน์ | **อังกฤษเสมอ** |
| คอมเมนต์ | ไทยได้ ถ้าทีมอ่านไทย |
| ข้อความที่ผู้ใช้เห็น | ไทย แต่ไม่ฝังในโค้ด (`i18n-and-locale`) |
| commit message · ชื่อ branch | ตามที่ทีมตกลง เลือกแล้วใช้ให้ตรงกันทั้งทีม |

- **ห้ามปนครึ่งคำ** — `checkบัตร` · `userชื่อ` อ่านยากและพังใน terminal บางตัว
- **คำเฉพาะทางไทยที่ไม่มีคำอังกฤษตรง ๆ** ให้หาคำอังกฤษที่ใกล้ที่สุดก่อน
  (`เลขประจำตัวผู้เสียภาษี` → `taxId` · `ภาษีหัก ณ ที่จ่าย` → `withholdingTax`)
  ถ้าไม่มีจริง ๆ ให้ใช้ทับศัพท์เต็มคำ แล้วอธิบายไว้ที่ `DATA-DICTIONARY.md`

---

## 10 · รายการตรวจก่อนส่งโค้ด

ใช้รายการตรวจ 12 ข้อใน [`assets/naming-reference.md`](assets/naming-reference.md) ข้อ 5 — ไล่ทุกข้อก่อนส่ง ข้อไหนไม่ผ่านกลับไปแก้ตามข้อของ skill นี้

---

## 11 · Anti-patterns

- ❌ **แก้ชื่อทั้งไฟล์ในคอมมิตเดียวกับที่แก้ตรรกะ** — รีวิวไม่ได้ว่าอะไรเปลี่ยนจริง ให้แยกคอมมิต
- ❌ **`utils.ts` ที่มี 40 ฟังก์ชันไม่เกี่ยวกัน**
- ❌ **คอมเมนต์หัวไฟล์ที่ generate มาแล้วไม่มีใครอัปเดต** — `@author` `@version` ที่ git บอกได้ดีกว่า
- ❌ **โค้ดที่ถูกคอมเมนต์ทิ้งไว้ "เผื่อได้ใช้"** — git เก็บให้แล้ว ให้ลบทิ้ง
- ❌ **ตั้งชื่อตาม pattern แทนตามหน้าที่** — `InvoiceFactoryStrategyImpl` บอกว่าใช้ pattern อะไร ไม่ได้บอกว่าทำอะไร
- ❌ **เปลี่ยนแบบการตั้งชื่อกลางโปรเจกต์** — ความไม่สม่ำเสมอแย่กว่าแบบที่ไม่สวย
- ❌ **ย่อชื่อเพราะบรรทัดยาวเกิน** — ให้ขึ้นบรรทัดใหม่ อย่าตัดชื่อ

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

# skill: lazy-coding

Use when writing, fixing, refactoring or reviewing code, or on bloat complaints. Simplest that works.

# Lazy Coding

You write code like a senior dev who has been paged at 3 AM for someone else's
clever abstraction. Lazy means efficient, not careless. The best code is the
code you never had to write.

**Team rule:** a tired teammate must understand it in 6 months, with no
context. If they can't, simplify until they can.

## Active every response

On by default at **full**. Don't drift back to over-building — still on even
when you're unsure. Switch with `lazy lite | full | ultra`. Off only on
"stop lazy" / "normal mode".

## The ladder — stop at the first rung that holds

1. **Does this need to exist?** Speculative need → skip it, say so in one line. (YAGNI)
2. **Stdlib does it?** Use it.
3. **Native platform feature covers it?** `<input type="date">` over a picker lib, CSS over JS, a DB constraint over app code. On mobile (Flutter, React Native) "native" means writing a platform channel in Kotlin/Swift — the costly rung; a maintained plugin or a framework widget comes first.
4. **An already-installed dependency solves it?** Use it. Never add a new dependency for what a few lines can do.
5. **Can it be one line?** One line.
6. **Only then:** the smallest code that works.

Two rungs both work → take the higher one and move on. The ladder is a reflex,
not a research project. The first lazy solution that works is the right one.

## Rules

- No unrequested abstractions — no interface with one implementation, no factory for one product, no config for a value that never changes.
- No scaffolding "for later." Later can scaffold for itself.
- Delete before you add. Boring before clever — clever is what someone decodes at 3 AM.
- Shortest working diff wins — but never by merging concerns into one file. Fewest files **that still keep one concern per file**.
- Match the repo — read 2-3 nearby files first and copy their style.
- Two stdlib options the same size? Take the one that's correct on edge cases. Lazy means less code, not a flimsier algorithm.

## Simple is not scattered

Lazy cuts *how much* code exists. It never cuts *where code lives*. A 40-line
project still looks like software engineering, not a scratchpad:

- **One concern per file.** Entry point, logic, config and I/O each have their own place. A `main.py` that also parses, validates, talks to the database and prints is not lazy — it is a god-file nobody can test.
- **Feature folders, not type folders.** `invoice/` holds everything about invoices (`readable-code` §7). No `utils/` dumping ground.
- **Names carry meaning.** Lazy is not `tmp`, `data`, `handle()`. Follow `readable-code` §1–4.
- **Boundaries stay explicit.** Function signatures, module exports and the data shape between layers are written out, not implied — fewer lines inside each box, never fewer boxes.
- **Config and secrets outside code.** Even one environment variable goes in `.env.example`, not inline. A project that reads no environment variables (an offline mobile app) has no `.env.example` — do not invent one.
- **Domain constant tables are code, not config.** Values that change only with a code release (thresholds, unit tables, lux ranges) go in one named constants file next to the feature, not in env vars or a settings screen. "Config outside code" means values that differ per environment or per deployment.
- **Tests sit next to the code they test** — one small check per non-trivial path (see "When NOT to be lazy"). Where the toolchain fixes the test folder (Flutter `test/` mirroring `lib/`), follow it — "next to" then means the same relative path.
- **New project → `project-bootstrap` first.** Lazy code lands in a repo that already has its skeleton (README, folder layout, lint, test command). Never scatter files at the root to save a minute.

Test: a tired teammate opens the repo cold. Can they guess which file holds a
given behaviour in 30 seconds? If not, the structure is not too complex — it
is *missing*.

## Mark your simplifications

A deliberate shortcut reads as intent, not ignorance, when you label it. Name
the ceiling and the upgrade path:

```python
# simple: in-memory dict cache — swap for Redis if we run more than one process
```

```ts
// simple: O(n) scan, fine under ~1k items — index it if the list grows
```

## Output

Code first. Then at most three short lines: what you skipped and when to add
it. If the explanation is longer than the code, delete the explanation.

Pattern: `[code] → skipped: [X] — add when [Y].`

## Intensity

| Level | What changes |
|-------|------------|
| **lite** | Build what's asked, but name the lazier option in one line. The user picks. |
| **full** | The ladder enforced. Stdlib and native first. Shortest diff, shortest explanation. Default. |
| **ultra** | YAGNI extremist. Ship the one-liner and challenge the rest of the requirement in the same breath. |

Example — "Add a cache for these API responses."

- **lite:** "Done. FYI `functools.lru_cache` does this in one line if you'd rather not own a cache class."
- **full:** "`@lru_cache(maxsize=1000)` on the fetch function. Skipped a custom cache class — add when lru_cache measurably falls short."
- **ultra:** "No cache until a profiler asks for one. When it does: `@lru_cache`. A hand-rolled TTL cache is a bug farm with a hit rate."

## When NOT to be lazy

Never simplify away: input validation at trust boundaries, error handling that
prevents data loss, security, accessibility basics, or anything explicitly
requested. If the user insists on the full version, build it — no re-arguing.

Non-trivial logic (a branch, loop, parser, or money/security path) leaves ONE
runnable check behind — the smallest thing that fails if the logic breaks: an
`assert`-based self-check or one small `test_*`. No frameworks or fixtures
unless asked. Trivial one-liners need no test.

## Pairs with

- `simplify` — the suite-wide rule for every kind of work; this skill is its detail for code.
- `readable-code` — **always load together**. Lazy decides how much code; readable-code decides names, function shape and file layout. One without the other gives either bloat or a scratchpad.
- `project-bootstrap` — the repo skeleton lazy code lands in.
- `simplicity-first` — same spirit, for docs, plans, and architecture.
- `code-review-checklist` — the lazy diff still gets reviewed.


---

# skill: testing-standards

Use when adding or setting up automated tests (.NET, Node, Python, Angular, Flutter) or a suite is flaky.

# Testing Standards

> **กฎข้อเดียว:** test ที่ไม่มีใครเชื่อถือ แย่กว่าไม่มี test
> test ที่แดงสลับเขียวเองจะถูก `skip` ภายใน 2 สัปดาห์ แล้วทั้งชุดจะตายตามกันไป

## เมื่อไหร่ใช้ skill นี้

- เริ่มวาง test ในโปรเจกต์ใหม่ หรือเพิ่ม test ให้โค้ดที่มีอยู่
- มีคนขอ "ให้มี unit test / automate test"
- ชุด test เดิมช้า แดง ๆ เขียว ๆ หรือไม่มีใครดูแล้ว

## เมื่อไหร่ **ไม่** ใช้

- E2E ผ่านเบราว์เซอร์ (Playwright/Cypress) ให้ใช้ `e2e-testing-patterns`
- ขับแอปมือถือจริงบน emulator ให้ใช้ `app-verifier-setup` (`references/android-native.md`)
- ออกแบบ test case เชิงธุรกิจก่อนลงมือเขียน ให้ใช้ `test-case-template`

---

## 1 · ขั้นแรก: ใช้ของที่มี ถามเฉพาะตอนต้องเพิ่มตัวใหม่

- **ถ้าโปรเจกต์มี framework อยู่แล้ว หรือสแต็กมี test library มากับ SDK** (Flutter `flutter_test` · Angular CLI) ให้ใช้เลย ไม่ต้องถาม
- **ถ้าต้องลงแพ็กเกจ test ตัวใหม่** ให้ใส่คำถามนี้ไว้ในการถามครั้งเดียวก่อนเริ่มงาน (ถ้าเครื่องมือมีหน้าต่างให้เลือกคำตอบ เช่น `AskUserQuestion` ก็ใช้ตัวนั้น) เพราะถ้าเลือกผิดแล้วย้ายทีหลังจะแพงมาก
- ถ้าเริ่มงานไปแล้วเพิ่งรู้ว่าต้องเลือก ให้เลือกตัว**แนะนำ**ในตารางแล้วทำต่อ จากนั้นบันทึกไว้ในหัวข้อ "ตัดสินใจเอง" ของรายงาน ไม่ต้องหยุดถามกลางทาง

2 เรื่องที่ต้องตกลง:

**ข้อ 1 — framework**

| สแต็ก | ตัวเลือกที่ควรเสนอ |
|---|---|
| .NET | **xUnit** (แนะนำ · เป็นมาตรฐานของ .NET ยุคใหม่) · NUnit (ทีมมาจาก NUnit เดิม) · MSTest (องค์กรที่ผูกกับ VS) |
| Node/TS | **Vitest** (แนะนำ · เร็ว ตั้งค่าน้อย ใช้ ESM/TS ได้เลย) · Jest (ระบบนิเวศใหญ่ที่สุด) · `node:test` (ไม่อยากลงอะไรเลย) |
| Python | **pytest** (แนะนำ) · `unittest` (stdlib ล้วน ห้ามลงแพ็กเกจเพิ่ม) |
| Angular | **Vitest + Testing Library** (แนะนำสำหรับโปรเจกต์ใหม่) · Jasmine + Karma (ค่าเริ่มต้นเดิมของ Angular) |
| Flutter · Dart | **`flutter_test`** (มากับ SDK ไม่ต้องถาม) · fake ด้วยคลาสที่ `implements` ของจริง ก่อนจะลง `mocktail` |

**ข้อ 2 — ขอบเขตที่ต้องการตอนนี้**

- unit อย่างเดียว (เร็ว ไม่แตะ DB/network)
- unit + integration (แตะ DB จริงผ่าน Testcontainers / SQLite in-memory)
- ครบชุดรวม E2E (ต่อยอดไป `e2e-testing-patterns`)

> ถ้าโปรเจกต์**มี framework อยู่แล้ว** ก็ไม่ต้องถาม ใช้ของเดิมไป เพราะการมี 2 ระบบในโปรเจกต์เดียว
> แย่กว่าใช้ของที่ไม่ถูกใจนัก

---

## 2 · พีระมิด — สัดส่วนที่ยั่งยืน

```
        ▲  E2E  5%      ช้า เปราะ แพง — เอาไว้ทดสอบ "เส้นทางที่ทำเงิน" เท่านั้น
       ╱ ╲
      ╱   ╲ Integration 20%   ต่อ DB/API จริง ทดสอบว่าชิ้นส่วนคุยกันรู้เรื่อง
     ╱     ╲
    ╱       ╲ Unit 75%        ไม่แตะอะไรข้างนอก รันจบใน < 100ms ต่อตัว
   ╱_________╲
```

**แอปมือถือมีชั้น widget test (Flutter) หรือ component test (React Native)** อยู่ระหว่าง unit กับ E2E ชั้นนี้สร้างหน้าจอจริงในหน่วยความจำ แล้วกดและอ่านได้โดยไม่ต้องมี emulator แอปมือถือส่วนใหญ่ไม่มี integration ที่ต่อ DB จึงใช้ชั้นนี้เป็นชั้นกลางหลักแทน

**ชุด unit ทั้งหมดต้องรันจบใน 10 วินาที** (Flutter: นับหลังคอมไพล์เสร็จ เพราะแค่เริ่ม `flutter test` ก็กินหลายวินาที · ตัวเลขนี้รอยืนยันบนเครื่องจริง)
ถ้าเกินนี้ คนจะเลิกรันก่อน commit แล้ว test ที่พังจะไปเจอที่ CI เท่านั้น ซึ่งช้าเกินไป

---

## 3 · อะไรควรมี test / อะไรไม่ต้อง

**ต้องมี**
- ตรรกะทางธุรกิจ: การคำนวณ, เงื่อนไขสิทธิ์, การเปลี่ยนสถานะ
- ทุกกรณีขอบ: ค่าว่าง, ศูนย์, ติดลบ, ขอบเขตล่าง/บน, ค่าซ้ำ
- **ทุกบั๊กที่เคยเกิด** — เขียน test ที่แดงก่อน แล้วค่อยแก้ (regression test)
- สัญญาที่คนอื่นพึ่งพา: รูปแบบ response ของ API, schema ของ event

**ไม่ต้องมี**
- getter/setter, DTO, mapping ตรง ๆ
- โค้ดของเฟรมเวิร์ก (ไม่ต้อง test ว่า EF Core บันทึกได้ไหม)
- ไลบรารีของคนอื่น
- UI ที่แค่แสดงผลโดยไม่มีตรรกะ

> **Coverage ที่ซื่อสัตย์: 70–80% ของ business logic** ไม่ใช่ 100% ของทั้งโปรเจกต์
> ไล่ตาม 100% จะได้ test ปลอม ๆ ที่เขียนเพื่อให้ตัวเลขสวยเต็มไปหมด
> ตั้ง gate ที่ "ห้ามลดลงจากเดิม" มีประโยชน์กว่าตั้งเลขเป้า

---

## 4 · เขียนยังไง

**ตั้งชื่อ** — อ่านชื่อแล้วต้องรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด

```
MethodName_Scenario_ExpectedResult

CalculateDiscount_WhenMemberIsGold_Returns15Percent
CreateOrder_WhenStockIsZero_ThrowsOutOfStock
ParseDate_WhenInputIsEmpty_ReturnsNull
```

ภาษาที่ชื่อ test เป็นข้อความ (Dart · Vitest · Jest) ใช้ `group('<สิ่งที่ทดสอบ>')` + `test('<สถานการณ์> → <ผลที่ต้องได้>')` เป็นประโยค เช่น `group('verdict')` · `test('below 50 lux is too dark for reading')`

**โครง AAA** — เว้นบรรทัดคั่น 3 ส่วนให้เห็นชัด

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**1 test = 1 เหตุผลที่จะพัง** ถ้ามี assert 5 อันที่ไม่เกี่ยวกัน ให้แยกเป็น 5 test

**ห้ามมี logic ใน test** — ไม่มี `if`, ไม่มีลูปที่คำนวณค่าคาดหวัง
ถ้าอยากรันหลายเคส ใช้ parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`)

**ทำให้ผลเหมือนเดิมทุกครั้ง**
- เวลา: inject `IClock`/`now()` ไม่เรียก `DateTime.Now` ตรง ๆ ในโค้ดที่ทดสอบ
- สุ่ม: fix seed
- ลำดับ: test ต้องรันสลับลำดับได้ ห้ามพึ่งสถานะที่ test ก่อนหน้าทิ้งไว้
- **ห้าม `sleep`** เพื่อรอ async — ใช้ fake timer หรือรอ signal จริง

**Mock เท่าที่จำเป็น** — mock ขอบเขตนอกระบบ (HTTP, คิว, เวลา, ไฟล์)
ไม่ mock คลาสของตัวเองที่คำนวณล้วน ๆ ถ้า mock เยอะเกินไป แปลว่า test ผูกกับวิธีเขียนโค้ด
พอ refactor ทีเดียว test แดงทั้งชุด ทั้งที่พฤติกรรมไม่เปลี่ยน

---

## 5 · Integration test

- ใช้ **DB จริงชนิดเดียวกับ production** (Testcontainers) ไม่ใช่ SQLite แทน PostgreSQL
  เพราะ SQL ที่ผ่านบน SQLite อาจพังบนของจริง
- แต่ละ test เริ่มจากสถานะที่รู้แน่ — transaction rollback หรือ truncate ทุกครั้ง
- แยก command ออกจาก unit เพื่อให้รันแยกกันได้ (`npm run test:unit` / `test:integration`)
- ทดสอบ **สัญญา** ของ API: status code, รูปร่าง JSON, header สำคัญ — ไม่ใช่แค่ "ไม่ error"

---

## 6 · CI

```
push / PR → lint → unit (< 10 วินาที) → integration → build
```

- **test แดง = merge ไม่ได้** ไม่มีข้อยกเว้น
- ห้ามมี `skip`/`ignore` ค้างในสาขาหลัก — ถ้าจะ skip ต้องมีลิงก์ issue กำกับ
- test ที่ flaky (แดงสลับเขียวเอง) ต้อง**แก้หรือลบ** ห้าม retry จนกว่าจะเขียว เพราะนั่นคือการซ่อนบั๊ก
- รายงาน coverage ในหน้า PR ให้เห็นว่าเพิ่มหรือลด

รายละเอียดคำสั่งและไฟล์ config ของแต่ละ framework อยู่ใน `references/per-stack.md`

---

## 7 · ตรวจงาน

- [ ] ใช้ framework ของเดิมหรือที่มากับสแต็ก ถ้าลงตัวใหม่ ต้องถามแล้วหรือบันทึกไว้ใน "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` รันผ่านจากเครื่องเปล่าโดยไม่ต้องตั้งค่าอะไรเพิ่ม
- [ ] ชุด unit รันจบใน 10 วินาที
- [ ] ลองสลับลำดับ test แล้วยังเขียวหมด (`pytest -p no:randomly --lf` / `--shuffle`)
- [ ] รันซ้ำ 3 รอบได้ผลเหมือนเดิม (ไม่ flaky)
- [ ] แก้โค้ดให้พังโดยตั้งใจ 1 จุด แล้ว test **ต้องแดง** — ถ้ายังเขียว แปลว่า test ไม่ได้ทดสอบอะไร
- [ ] ชื่อ test อ่านแล้วรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด
- [ ] ไม่มี `sleep` / `Thread.Sleep` ในชุด test
- [ ] ไม่มี test ที่ถูก skip ค้างโดยไม่มีเหตุผลกำกับ

---

## 8 · Anti-patterns

- ❌ **เขียน test หลังจบงานเพื่อให้ผ่าน gate** — ได้ test ที่ยืนยันว่าโค้ดทำสิ่งที่มันทำ
  ไม่ใช่สิ่งที่มันควรทำ
- ❌ **assert ว่า "ไม่ throw"** เฉย ๆ — ไม่ได้ทดสอบอะไรเลย
- ❌ **test ที่พึ่ง test ก่อนหน้า** — พอรันเดี่ยว ๆ แดงทันที
- ❌ **mock ทุกอย่างจน test ทดสอบแค่ mock**
- ❌ **`sleep(1000)` รอ async** — ช้าและยังเปราะอยู่ดี
- ❌ **retry flaky test จนเขียว** — คุณเพิ่งซ่อนบั๊กที่เกิดจริงใน production
- ❌ **ไล่ coverage 100%** — เขียน test ให้ getter เพื่อตัวเลข
- ❌ **ข้อมูลทดสอบเป็นข้อมูลลูกค้าจริง** — ผิดกฎหมายและหลุดง่าย ใช้ตัวสร้างข้อมูลปลอม

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| E2E ผ่านเบราว์เซอร์ | `e2e-testing-patterns` |
| E2E แอปมือถือ (`integration_test` · `adb`) | `app-verifier-setup` |
| ออกแบบ test case ก่อนเขียนโค้ด | `test-case-template` |
| ทดสอบ endpoint health/ping | `web-service-essentials` |
| log ที่ช่วยไล่ปัญหาตอน test แดง | `logging-standards` |
| review โค้ด test | `code-review-checklist` |


## reference: per-stack.md

# ตั้งค่าและตัวอย่างต่อสแต็ก

> ตัวอย่างในไฟล์นี้ **ยังไม่ได้รันทดสอบ** (ยกเว้นหัวข้อ Flutter ที่มาจากแอปจริง Lumio) ส่วนที่เหลือเป็นการตั้งค่ามาตรฐานของแต่ละ framework
> ตอนรันครั้งแรกให้ดูว่าคำสั่งและ path ตรงกับโครงโปรเจกต์จริงไหม

---

## สารบัญ

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [ตารางเทียบ](#ตารางเทียบ)

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package FluentAssertions      # assert ที่อ่านเป็นประโยค
dotnet add tests/MyApp.Tests package NSubstitute           # mock ที่ syntax สั้นกว่า Moq
dotnet add tests/MyApp.Tests package Microsoft.AspNetCore.Mvc.Testing   # integration
dotnet add tests/MyApp.Tests package Testcontainers.PostgreSql
```

```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void CalculateDiscount_WhenMemberIsGold_Returns15Percent()
    {
        // Arrange
        var sut = new DiscountCalculator();

        // Act
        var result = sut.Calculate(new Order { Total = 1000m }, MemberTier.Gold);

        // Assert
        result.Should().Be(150m);
    }

    // Theory = ทดสอบหลายเคสด้วยโค้ดชุดเดียว — ห้ามเขียนลูปเอง
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration ผ่าน `WebApplicationFactory` — ยิง HTTP จริงเข้า pipeline จริงโดยไม่ต้องเปิดพอร์ต:

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetOrders_WhenNotAuthenticated_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/v1/orders");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

```bash
dotnet test                                        # ทั้งหมด
dotnet test --filter "FullyQualifiedName!~Integration"   # เฉพาะ unit
dotnet test --collect:"XPlat Code Coverage"
```

---

## Node / TypeScript — Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // ไฟล์ setup ใช้ตั้ง fake timer / ล้าง mock ให้ทุกไฟล์เหมือนกัน
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.dto.ts', 'src/**/index.ts'],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountCalculator } from '../src/discount';

describe('DiscountCalculator', () => {
  beforeEach(() => vi.restoreAllMocks());   // กันสถานะรั่วข้าม test

  it('calculateDiscount_whenMemberIsGold_returns15Percent', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('calculateDiscount_byTier_%s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

คุมเวลาแทนการ `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // เดินเวลา 5 วิ ทันที
vi.useRealTimers();
```

```json
{ "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
} }
```

> **Jest แทน Vitest:** API เกือบเหมือนกัน (`jest.fn` ↔ `vi.fn`) แต่ต้องตั้ง `ts-jest`
> หรือ babel เพิ่มสำหรับ TypeScript เลือก Jest เมื่อทีมคุ้นอยู่แล้วหรือมี preset ที่ต้องใช้

---

## Python — pytest

```bash
pip install pytest pytest-cov pytest-randomly
```

`pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q --strict-markers --cov=src --cov-report=term-missing"
markers = ["integration: ต้องมี DB/network — รันแยกจาก unit"]
```

```python
import pytest
from src.discount import calculate_discount

def test_calculate_discount_when_member_is_gold_returns_15_percent():
    assert calculate_discount(total=1000, tier="gold") == 150

@pytest.mark.parametrize("tier,expected", [("none", 0), ("silver", 50), ("gold", 150)])
def test_calculate_discount_by_tier(tier, expected):
    assert calculate_discount(total=1000, tier=tier) == expected

@pytest.mark.integration
def test_create_order_persists_to_db(db_session):
    ...
```

`conftest.py` — fixture ที่ใช้ร่วมกัน (คืนสถานะเดิมทุก test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # ทุก test เริ่มจากฐานสะอาดเสมอ
    conn.close()
```

```bash
pytest                        # ทั้งหมด (pytest-randomly สลับลำดับให้เอง = จับ test ที่พึ่งกัน)
pytest -m "not integration"   # เฉพาะ unit
pytest --lf                   # เฉพาะที่แดงรอบก่อน
```

---

## Angular

**Vitest + Testing Library** (โปรเจกต์ใหม่ — เร็วกว่า Karma มาก ไม่ต้องเปิดเบราว์เซอร์จริง)

```bash
npm i -D vitest @analogjs/vite-plugin-angular jsdom \
         @testing-library/angular @testing-library/user-event
```

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('orderForm_whenSubmitWithEmptyName_showsRequiredError', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> ทดสอบจาก**มุมผู้ใช้** — หาปุ่มด้วยข้อความที่คนเห็น (`getByRole`, `getByText`)
> ไม่ใช่ `By.css('.btn-primary')` เพราะพอเปลี่ยนคลาส CSS test จะแดงทั้งที่ UI ยังทำงานถูก

**Jasmine + Karma** (ค่าเริ่มต้นเดิมของ Angular — ใช้ต่อได้ถ้าโปรเจกต์มีอยู่แล้ว):

```ts
describe('DiscountService', () => {
  let service: DiscountService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DiscountService] });
    service = TestBed.inject(DiscountService);
  });

  it('calculate_whenMemberIsGold_returns15Percent', () => {
    expect(service.calculate(1000, 'gold')).toBe(150);
  });
});
```

```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # สำหรับ CI
```

---

## Flutter / Dart — flutter_test

มากับ SDK ไม่ต้องลงอะไร ไฟล์ test อยู่ใน `test/` และล้อโครง `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`) ส่วนชื่อไฟล์ใช้ snake_case ตามธรรมเนียม Dart

```dart
// fake ของสะพานไปฝั่ง native: implements คลาสจริงได้เลย ไม่ต้องสร้าง interface ใหม่
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...override ที่เหลือคืนค่าที่ test เลือก (มี sensor ไหม · สิทธิ์กล้อง)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // จอทดสอบเริ่มต้น 800×600 — ตั้งเป็นขนาดมือถือ ไม่งั้นปุ่มอยู่นอกจอแล้วกดพลาด
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // ไม่ใช้ pumpAndSettle เมื่อมี Timer วนอยู่

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // ปิด Timer ในตัว test เอง ไม่งั้นล้มด้วย "A Timer is still pending"
    });
  });
}
```

| เรื่อง | ทำอย่างนี้ |
|---|---|
| ชั้น test | unit (`test`) ใช้กับตรรกะล้วน ส่วน widget (`testWidgets`) ใช้กับหน้าจอและเป็นชั้นกลางหลัก ถ้าเป็น E2E บนเครื่อง ใช้ `integration_test` (`flutter test integration_test/`) หรือสคริปต์ `adb` ตาม `app-verifier-setup` |
| platform channel | fake ด้วยคลาสที่ `implements` คลาสสะพานของจริง แล้วค่อยลง `mocktail` เมื่อ fake ด้วยมือเริ่มยาวเท่านั้น |
| `pumpAndSettle` | ใช้ได้เมื่อหน้าจอหยุดนิ่งจริง ถ้ามี Timer หรือ animation วนตลอด จอจะไม่มีวันนิ่งจนหมดเวลา ให้ใช้ `pump(duration)` แทน |
| Timer ค้าง | dispose controller ที่ถือ Timer ในตัว test เองก่อนบรรทัดสุดท้าย เพราะ Timer ที่ยังวิ่งอยู่ตอนจบจะทำให้ test ล้ม |
| จอเล็ก | test แยก 1 ชุดที่ 360×800 dp ภาษาไทย + `textScaler` ใหญ่ เพื่อจับข้อความล้น (Flutter ฟ้อง overflow เป็น exception ใน test) |
| SnackBar บังปุ่ม | widget test จับได้ โดยกดปุ่มล่างหลัง SnackBar ขึ้น แล้ว assert **ผลของการกด** (`tester.tap` ที่โดนของบังแค่พิมพ์คำเตือน ไม่ทำให้ล้ม) |
| golden test | ไม่บังคับ เพราะภาพต่างกันตามเครื่องและฟอนต์ ใช้เมื่อทีมมีเครื่อง CI ตายตัว |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| พิสูจน์ว่า test ใช้ได้ | แก้โค้ดให้ผิด 1 จุด รันแล้วต้องแดง แล้วแก้กลับ |

```bash
flutter test                              # ทั้งหมด
flutter test test/features/measure        # โฟลเดอร์เดียว
flutter test --coverage
flutter test integration_test/            # ต้องมี emulator หรือเครื่องจริงต่ออยู่
```

---

## ตารางเทียบ

| เรื่อง | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| หลายเคส | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | วน `for` สร้าง `test(...)` ใน `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | คลาส `implements` · `mocktail` |
| ก่อน/หลังแต่ละ test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| คุมเวลา | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| DB จริง | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| สลับลำดับ | ไม่มีในตัว | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |


---

# skill: code-review-checklist

Use when reviewing a pull request, self-reviewing before submitting, or auditing code quality.

> **ใน SuperUser:** รีวิวเริ่มจาก playbook [`review`](../superuser/references/playbook-review.md) แล้วใช้ checklist นี้กับรีวิวทั่วไป ส่วนงานเสี่ยงสูงหรือ diff ใหญ่ใช้ [`adversarial-review-panel`](../adversarial-review-panel/SKILL.md)

# Code Review Checklist

## When to use this skill

- Reviewing a pull request
- Self-review before submitting code
- Onboarding new code reviewers
- Auditing code quality of existing modules

## When NOT to use

| Task | Use instead |
|---|---|
| Second look at a finished piece inside a team | a new `reviewer` agent (it applies this checklist to code) |
| Contested design, large or high-risk diff, "stress test" / "find blind spots" | `adversarial-review-panel` (several `reviewer` agents) |
| Reviewing a visual (image, poster, screen look) | (if plugin `graphic-design` is installed) `graphic-design:design-review`, else `ui-craft` checks |
| Writing or updating the PR description itself | `pr-description-template` |
| Hunting misleading patterns across the codebase, not one diff | `code-gardener` |
| Scanners, secrets or dependency check before ship or after adding a dependency | `security-gate` (run both before merge) |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
4. **Run the code** if non-trivial — don't just read
5. **Leave actionable comments** — suggest fixes, not just point out problems

## Checklist

House checks first. Each skill holds the full rules, so link to it in the comment:

- [ ] Security: run [`security-gate`](../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
- [ ] Simple enough: [`lazy-coding`](../lazy-coding/SKILL.md) (no unused layers, standard library first, one concern per file)
- [ ] Readable: [`readable-code`](../readable-code/SKILL.md) (names, file and folder layout, config outside code)
- [ ] Tests sit next to the code and prove the change: [`testing-standards`](../testing-standards/SKILL.md)
- [ ] Shared code touched → [`blast-radius`](../blast-radius/SKILL.md) list is in the PR
- [ ] Commit message follows [`commit-message-format`](../commit-message-format/SKILL.md)

The generic list (correctness, design, performance, documentation, maintainability) is in [`references/full-checklist.md`](references/full-checklist.md).

## Comment Templates

### Suggestion (non-blocking)
```
nit: Consider X for readability
```

### Question
```
q: Why did you choose X over Y here?
```

### Blocking issue
```
blocking: This will cause Y in production because Z.
Suggest: <concrete fix>
```

### Praise
```
✨ Nice approach with X — much cleaner than the previous version.
```

## Review Severity Levels

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must fix before merge |
| `important:` | Should fix, can be follow-up if urgent |
| `nit:` | Minor improvement, optional |
| `q:` | Question, not necessarily a change |
| `praise:` | Acknowledge good work |

These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน

## Anti-patterns to Avoid

As a reviewer:
- ❌ Bikeshedding — don't fight over trivial style if there's no convention
- ❌ "Why didn't you do it MY way?" — there are often multiple valid approaches
- ❌ Only criticism — acknowledge good things too
- ❌ Vague comments like "this is wrong" — explain WHY and suggest fix
- ❌ Reviewing too much at once — request smaller PRs (under 400 lines)


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](../SKILL.md). Open it for a large or unfamiliar change. The house-specific checks stay in SKILL.md.

### 🎯 Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### 🏗️ Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### 🧪 Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

### 🔒 Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### 🚀 Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### 📖 Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### 📚 Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### 🔄 Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?


---

# skill: commit-message-format

Use when writing a git commit message (Conventional Commits — type, scope, body, footer).

# Conventional Commit Message Format

## When to use this skill

- Writing any git commit message
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Language follows the repo** — check `git log -10` first. A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit

| ❌ Hard to read | ✅ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable

## Anti-patterns

- ❌ `update code`
- ❌ `fix bug`
- ❌ `WIP`
- ❌ `final commit` / `final final`
- ❌ Past tense: `added feature` (use `add feature`)
- ❌ Vague scope: `fix(misc): ...` (be specific)
