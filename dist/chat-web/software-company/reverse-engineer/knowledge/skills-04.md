# skill: lazy-coding

Use when writing, fixing, refactoring or reviewing code, or on complaints about bloat. Simplest thing that works (need it at all, standard library, native features) while keeping one concern per file and clear structure.

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

- `readable-code` — **always load together**. Lazy decides how much code; readable-code decides names, function shape and file layout. One without the other gives either bloat or a scratchpad.
- `project-bootstrap` — the repo skeleton lazy code lands in.
- `simplicity-first` — same spirit, for docs, plans, and architecture.
- `code-review-checklist` — the lazy diff still gets reviewed.


---

# skill: readable-code

Use when writing or reviewing code and the question is whether a person can read it (names, function shape, comments, file location). Verb prefixes, banned words, name length, feature folders, the newcomer test.

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

**ข้อยกเว้น:** ตัวย่อที่คนทั้งวงการใช้ — `id` · `url` · `http` · `db` · `api` · `ui` — ใช้ได้เลย ไม่ต้องกาง ·
ชื่อที่ platform หรือ framework ตั้งมาแล้ว (`SensorManager` · Android `Service` · `ChangeNotifier`) ใช้ตามนั้น —
คำต้องห้ามใช้กับชื่อที่**เราตั้งเอง**เท่านั้น

---

## 5 · รูปร่างของฟังก์ชัน

- **หนึ่งฟังก์ชัน หนึ่งระดับนามธรรม** — ฟังก์ชันที่มีทั้ง "ส่งอีเมล" และ "ต่อสตริง SQL" อ่านยากเพราะสมองต้องสลับระดับ
- **พารามิเตอร์ไม่เกิน 3 ตัว** เกินนั้นรับเป็น object ที่มีชื่อฟิลด์
- **ห้ามรับ boolean เป็นพารามิเตอร์** — `render(true)` ที่จุดเรียกอ่านไม่ออกว่า `true` คืออะไร
  แยกเป็น `renderDraft()` กับ `renderFinal()` หรือรับ `{ mode: "draft" }` ·
  **ยกเว้น named parameter** ที่จุดเรียกเห็นชื่อ — `TextField(obscureText: true)` ใน Dart หรือ `enabled: true` อ่านออกอยู่แล้ว
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
| `TODO` ที่มีเจ้าของและเงื่อนไข | `TODO(somchai): ย้ายไป Redis เมื่อรันเกิน 1 process` |

> **คอมเมนต์ที่โกหกอันตรายกว่าไม่มีคอมเมนต์** — แก้โค้ดแล้วต้องแก้คอมเมนต์ในรอบเดียวกัน

### รอบคัดคอมเมนต์ก่อนรีวิว

ก่อนส่งรีวิว ไล่ทุกคอมเมนต์ที่ diff เพิ่มหรือแก้ แล้วจัดเข้าหนึ่งในสี่ทาง · diff ใหญ่ส่ง subagent ระดับกลางแบบอ่านอย่างเดียวทำรายการ แล้วตัวหลักตัดสิน

| คอมเมนต์ | ทำ |
|---|---|
| แปลโค้ดเป็นภาษาคน · ล้าสมัย · โค้ดที่ถูกคอมเมนต์ทิ้ง | ลบ |
| อธิบายว่าตัวแปรหรือฟังก์ชันคืออะไร | เปลี่ยนชื่อให้บอกเอง แล้วลบ |
| อ้างข้อจำกัด ("ห้าม null" · "ต้องเรียกหลัง init" · "ค่าไม่เกิน 100") | เปลี่ยนเป็นของที่ตรวจได้ — type · assert · test · lint (`principle-rules-as-checks-not-text`) แล้วลบ |
| สี่แบบในตารางข้างบน | เก็บ |

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
  รูปแบบตัวพิมพ์ตามธรรมเนียมของภาษา: Dart/Python ใช้ snake_case (`invoice_renderer.dart`) · .NET ใช้ `InvoiceRenderer.cs`
- **ไฟล์ทดสอบอยู่ข้างไฟล์ที่มันทดสอบ** ไม่ใช่ใน `tests/` ที่ต้องไล่หาคู่ —
  **ยกเว้น stack ที่เครื่องมือบังคับโฟลเดอร์ทดสอบ** เช่น Flutter (`flutter test` หาใน `test/` และ test ใน `lib/` จะลาก `flutter_test` เข้าแอป)
  ให้ใช้โครงโฟลเดอร์ใน `test/` เหมือน `lib/` เป๊ะ — `lib/invoice/renderer.dart` ↔ `test/invoice/renderer_test.dart`
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
