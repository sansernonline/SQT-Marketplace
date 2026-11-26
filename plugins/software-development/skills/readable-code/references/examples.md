# Examples · readable-code

Open when you need a worked example for a name, a comment, a folder layout, or the comment sorting pass.

## Names that answer what / unit / when

| ✗ | ✓ | The difference |
|---|---|---|
| `d` | `daysSinceLastLogin` | Has a unit and a reference point |
| `list` | `overdueInvoices` | Says what is inside |
| `data` | `csvRows` | `data` rules nothing out |
| `temp` | `swapBuffer` | Names the role, not that it is temporary |
| `flag` | `hasUnpaidBalance` | You can tell what `true` means |
| `timeout` | `timeoutMs` | Is 30 seconds or milliseconds? |
| `price` | `priceSatang` | A money number with no unit is a bug waiting to happen |
| `checkUser()` | `isUserActive()` | `check` does not say whether it returns a boolean or throws an error |
| `process()` | `normalizePhoneNumber()` | `process` can mean anything |
| `getUser()` that calls an API | `fetchUser()` | `get` means fast and never fails |

Nobody sees a unit bug at review, but they will see it when the customer calls. Units: `Ms` · `Seconds` · `Bytes` · `Satang` · `Percent` · `Ratio`.

## Name length by distance from declaration to last use

| Distance | Suitable name length | Example |
|---|---|---|
| ≤ 5 lines (a loop counter) | 1 character is enough | `i` · `r` · `x` |
| Within one function | 1–2 words | `total` · `rawRows` |
| Whole class or whole file | 2–3 words | `pendingApprovals` |
| Exported outside the file | Full, no abbreviations | `calculateWithholdingTax` |

`i` in a 3-line loop is clearer than `currentIndex`, but an `i` that is a class field is a name nobody can follow.

## Comments

```ts
// ผิด: เพิ่มค่า i ทีละ 1
// ผิด: ฟังก์ชันคำนวณภาษี

// ถูก: ปัดเศษสตางค์ลงเสมอ ไม่ใช่ปัดใกล้สุด — ตามที่ลูกค้ากำหนด (อ้างที่มาจริง: ชื่อประกาศ/สัญญา + ข้อ + ลิงก์)
// ถูก: ผู้ให้บริการ SMS จำกัด 3 ข้อความ/วินาที เกินแล้วบล็อกไอพี 5 นาที
// ถูก: ต้องเรียงลำดับนี้เท่านั้น — เรียก validate ก่อน normalize จะได้เบอร์ที่ผิดรูปแบบ
```

The 4 kinds that should have a comment:

| Kind | Example |
|---|---|
| An external constraint | Requirements of the API you call · law · hardware limits |
| A decision that looks odd but is deliberate | "ไม่ใช้ index ที่นี่เพราะตารางเขียนบ่อยกว่าอ่าน" (no index here because the table is written more often than read) |
| A formula or business rule with a source | Cite the clause number in the document; do not retell the formula |
| A `TODO` with an owner and a condition | `TODO(somchai): ย้ายไป Redis เมื่อรันเกิน 1 process` (move to Redis when running more than 1 process) |

## Comment sorting pass (before review)

Go through every comment the diff adds or edits, and put each into 1 of 4 ways. If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides.

| Comment | Do |
|---|---|
| Translates code into human language · outdated · commented-out code | Delete |
| Explains what a variable or function is | Rename so it says so itself, then delete |
| States a constraint ("no null" · "must be called after init" · "value at most 100") | Turn it into something checkable, such as a type · assert · test · lint (`learn-loop/repeated-mistakes-to-checks`), then delete |
| The 4 kinds in the table above | Keep |

Report the result as numbers: how many deleted · how many renamed · how many became checks · how many kept.

## Folder layout: by feature, not by file type

```
ผิด: จัดตามชนิด — แก้ฟีเจอร์เดียวต้องเปิด 5 โฟลเดอร์
src/
  controllers/   invoice.ts  customer.ts  report.ts
  services/      invoice.ts  customer.ts  report.ts
  models/        invoice.ts  customer.ts  report.ts
  validators/    invoice.ts  customer.ts  report.ts

ถูก: จัดตามฟีเจอร์ — ทุกอย่างของใบแจ้งหนี้อยู่ที่เดียว
src/
  invoice/       routes.ts  service.ts  model.ts  validation.ts  invoice.test.ts
  customer/      ...
  report/        ...
  shared/        money.ts  thai-date.ts  http-client.ts
```

Test-folder stacks: Flutter (`flutter test` looks in `test/`, and a test in `lib/` drags `flutter_test` into the app) · .NET (a separate test project in `tests/`) — table in `project-bootstrap` step 1. Mirror the layout exactly, e.g. `lib/invoice/renderer.dart` ↔ `test/invoice/renderer_test.dart`.

## Thai terms in code

`เลขประจำตัวผู้เสียภาษี` → `taxId` · `ภาษีหัก ณ ที่จ่าย` → `withholdingTax`. If there really is no English word, use a full-word transliteration and explain it in `DATA-DICTIONARY.md`.

## Related skills

| Need | Use together with |
|---|---|
| Log format and field names in logs | `logging-standards` |
| Table and column names in a database | `database-design` |
| Endpoint names and fields in an API | `api-conventions` |
| Text users see, Thai-English | `i18n-and-locale` |
| One-page reference table | `assets/naming-reference.md` |
