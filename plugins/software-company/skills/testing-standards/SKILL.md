---
name: testing-standards
description: Use when adding, reviewing or setting up automated tests for any project — unit tests, integration tests, test structure, naming, coverage targets, mocking, test data, CI wiring — across .NET, Node/TypeScript, Python and Angular. Starts by ASKING which test framework to use rather than assuming one, then applies a shared set of rules on what deserves a test, how to name it, how to keep it deterministic, and what coverage number is honest. Load it before writing the first test in a project, when someone asks for unit tests or automated tests, or when a suite has become slow, flaky or ignored.
---

# Testing Standards

> **กฎข้อเดียว:** test ที่ไม่มีใครเชื่อถือ แย่กว่าไม่มี test
> test ที่แดงสลับเขียวเองจะถูก `skip` ภายในสองสัปดาห์ แล้วทั้งชุดจะตายตามกันไป

## เมื่อไหร่ใช้ skill นี้

- เริ่มวาง test ในโปรเจกต์ใหม่ หรือเพิ่ม test ให้โค้ดที่มีอยู่
- มีคนขอ "ให้มี unit test / automate test"
- ชุด test เดิมช้า แดง ๆ เขียว ๆ หรือไม่มีใครดูแล้ว

## เมื่อไหร่ **ไม่** ใช้

- E2E ผ่านเบราว์เซอร์ (Playwright/Cypress) → `e2e-testing-patterns`
- ออกแบบ test case เชิงธุรกิจก่อนลงมือเขียน → `test-case-template`

---

## 1 · ขั้นแรก: ถามก่อนว่าจะใช้ตัวไหน

**ห้ามเลือก framework ให้ผู้ใช้เอง** ถ้าโปรเจกต์ยังไม่มี test ให้ถามด้วย
`AskUserQuestion` ก่อนเขียนบรรทัดแรก — เพราะการเลือกผิดแล้วย้ายทีหลังแพงมาก

ถามสองข้อนี้:

**ข้อ 1 — framework**

| สแต็ก | ตัวเลือกที่ควรเสนอ |
|---|---|
| .NET | **xUnit** (แนะนำ · เป็นมาตรฐานของ .NET ยุคใหม่) · NUnit (ทีมมาจาก NUnit เดิม) · MSTest (องค์กรที่ผูกกับ VS) |
| Node/TS | **Vitest** (แนะนำ · เร็ว ตั้งค่าน้อย ใช้ ESM/TS ได้เลย) · Jest (ระบบนิเวศใหญ่ที่สุด) · `node:test` (ไม่อยากลงอะไรเลย) |
| Python | **pytest** (แนะนำ) · `unittest` (stdlib ล้วน ห้ามลงแพ็กเกจเพิ่ม) |
| Angular | **Vitest + Testing Library** (แนะนำสำหรับโปรเจกต์ใหม่) · Jasmine + Karma (ค่าเริ่มต้นเดิมของ Angular) |

**ข้อ 2 — ขอบเขตที่ต้องการตอนนี้**

- unit อย่างเดียว (เร็ว ไม่แตะ DB/network)
- unit + integration (แตะ DB จริงผ่าน Testcontainers / SQLite in-memory)
- ครบชุดรวม E2E (ต่อยอดไป `e2e-testing-patterns`)

> ถ้าโปรเจกต์**มี framework อยู่แล้ว** ไม่ต้องถาม — ใช้ของเดิม การมีสองระบบในโปรเจกต์เดียว
> แย่กว่าการใช้ของที่ไม่ถูกใจนัก

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

**ชุด unit ทั้งหมดต้องรันจบใน 10 วินาที** ถ้าเกินนี้คนจะเลิกรันก่อน commit
แล้ว test จะกลายเป็นด่านที่ CI เท่านั้นที่เจอ — ซึ่งช้าเกินไป

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

**โครง AAA** — เว้นบรรทัดคั่นสามส่วนให้เห็นชัด

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**หนึ่ง test = หนึ่งเหตุผลที่จะพัง** ถ้ามี assert 5 อันที่ไม่เกี่ยวกัน ให้แยกเป็น 5 test

**ห้ามมี logic ใน test** — ไม่มี `if`, ไม่มีลูปที่คำนวณค่าคาดหวัง
ถ้าอยากรันหลายเคส ใช้ parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`)

**ทำให้ผลเหมือนเดิมทุกครั้ง**
- เวลา: inject `IClock`/`now()` ไม่เรียก `DateTime.Now` ตรง ๆ ในโค้ดที่ทดสอบ
- สุ่ม: fix seed
- ลำดับ: test ต้องรันสลับลำดับได้ ห้ามพึ่งสถานะที่ test ก่อนหน้าทิ้งไว้
- **ห้าม `sleep`** เพื่อรอ async — ใช้ fake timer หรือรอ signal จริง

**Mock เท่าที่จำเป็น** — mock ขอบเขตนอกระบบ (HTTP, คิว, เวลา, ไฟล์)
ไม่ mock คลาสของตัวเองที่คำนวณล้วน ๆ mock เยอะเกินไปแปลว่า test ผูกกับวิธีเขียน
พอ refactor ทีเดียวแดงทั้งชุดทั้งที่พฤติกรรมไม่เปลี่ยน

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
- test ที่ flaky ให้ **แก้หรือลบ** ห้าม retry จนกว่าจะเขียว นั่นคือการซ่อนบั๊ก
- รายงาน coverage ในหน้า PR ให้เห็นว่าเพิ่มหรือลด

รายละเอียดคำสั่งและไฟล์ config ของแต่ละ framework อยู่ใน `references/per-stack.md`

---

## 7 · ตรวจงาน

- [ ] ถามผู้ใช้แล้วว่าจะใช้ framework ไหน (หรือใช้ของเดิมที่โปรเจกต์มี)
- [ ] `npm test` / `dotnet test` / `pytest` รันผ่านจากเครื่องเปล่าโดยไม่ต้องตั้งค่าอะไรเพิ่ม
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
| ออกแบบ test case ก่อนเขียนโค้ด | `test-case-template` |
| ทดสอบ endpoint health/ping | `web-service-essentials` |
| log ที่ช่วยไล่ปัญหาตอน test แดง | `logging-standards` |
| review โค้ด test | `code-review-checklist` |
