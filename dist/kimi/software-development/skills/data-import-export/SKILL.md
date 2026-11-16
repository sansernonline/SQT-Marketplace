---
name: data-import-export
description: Use when a system imports or exports Excel or CSV
---

# Importing and exporting data

> **The one rule:** validate everything first, then write.
> If you write halfway and then find a bad row, the data is left half-done and nobody knows what to fix.

## When to use this skill

- A screen lets users upload Excel or CSV to bring data into the system
- A button exports to Excel or CSV
- Moving data from an old system into a new one
- A user uploads and gets the message "ไฟล์ไม่ถูกต้อง" (file is invalid) without knowing what is wrong

## When to use another skill instead, or together

| Job | skill | |
|---|---|---|
| Receiving general file uploads (images, documents) | `file-upload-and-storage` | Instead |
| Building a nicely formatted Excel file | `anthropic-skills:xlsx` | Instead |
| Queue mechanics and progress | `background-jobs` | Instead |
| Buddhist Era (B.E.) years and Thai sorting order | `i18n-and-locale` | Instead |
| Sending documents into Thai accounting software (PEAK · FlowAccount) through an API instead of a file | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | Instead |
| Recording who imported or exported what | `audit-trail` | Together |
| Masking personal data in export files | `pdpa-compliance` | Together |
| Telling the user when an import finishes | `notifications` | Together |
| Limits and constraints of the target table | `database-design` | Together |

---

## 1 · Give a template, do not make people guess

**Every import screen needs a button to download a template.** The template contains

- Column headers that match exactly what the system needs
- **1–2 correct sample rows**
- A row explaining which columns are required, what format, and which values are accepted
- A separate sheet for lists of selectable values (status, type, unit)

| How the file differs from the template | Do this |
|---|---|
| Column order swapped | ✓ Read by header name, not by position |
| Header has extra spaces or different letter case | ✓ Trim spaces and compare case-insensitively |
| Extra unknown columns | ✓ Skip them, but **tell the user what was skipped** |
| A required column is missing | ✗ Stop at once and say which column is missing |

---

## 2 · Three layers of validation before writing anything

| Layer | Checks | Example message |
|:--:|---|---|
| 1 · File | Opens · has the needed sheet · all required columns present · within the maximum row count | "ไม่พบคอลัมน์ 'รหัสสินค้า'" (column 'product code' not found) |
| 2 · Per row | Data type · required values · in the allowed list · number range | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" (row 42, column 'quantity' must be a number above 0, found '-5') |
| 3 · Relationships | The code exists in the system · no duplicates within the file · business rules | "แถว 88 ไม่พบลูกค้ารหัส C-1042" (row 88, customer code C-1042 not found) |

**An error report must state: row · column · value found · value expected**

```
Wrong: "ไฟล์ไม่ถูกต้อง"
Wrong: "พบข้อผิดพลาด 37 รายการ"
Right: a table of check results, with a button to download the original file with an "ข้อผิดพลาด" (error) column appended
```

> **Report all errors in one pass. Do not stop at the first bad row.**
> The user then fixes everything in one round, instead of uploading 37 times.

---

## 3 · Writing into the system

| Mode | Use when |
|---|---|
| **All or nothing** | The default. The file must be fully correct to be imported |
| Do what passes, skip the bad rows | The file is very large and the rows are unrelated, and **the user must choose this, the system does not decide for them** |

- **Always show a summary page before confirming**, such as "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" (will add 120 · update 45 · skip 3 · error 0), then have the user click confirm
- If the file has duplicate rows, stop and say so. Do not silently use the last row
- If the data already exists in the system, let the user choose: skip · overwrite · stop
- **Every import must be recorded in the audit log**: who imported, which file, how many rows affected (see `audit-trail`)
- **Keep the original file**, so when there is a problem you can look back at what the submitted file really looked like
- Make it reversible: store a batch id (the id of the import run) on every imported row

**Large files run as background jobs.** Above roughly 1,000 rows, put them in a queue,
split into batches of 500 rows, show progress, and allow cancel (see `background-jobs`).

---

## 4 · Excel and CSV traps

| Trap | What happens | Fix |
|---|---|---|
| **Thai in CSV garbled** | Opened in Excel, the characters are unreadable | Save as UTF-8 **with a BOM**, or recommend .xlsx |
| **Codes starting with 0 lose it** | `0812345678` becomes `812345678` | Always read as text, and on export set the cell format to text |
| **Long numbers turn into scientific notation** | A 13-digit ID card number → `1.23457E+12` | Same as above |
| **Dates interpreted automatically** | Is `03/04/2026` March or April | Force `YYYY-MM-DD` in the template |
| **B.E. and C.E. years mixed** | Silently off by 543 years | **Ask on the import screen which year style the file uses** |
| Trailing spaces in a value | Code matching fails | Trim leading and trailing spaces on every value |
| Cells that are formulas | You get the formula instead of the value | Read the calculated value |
| **Values starting with `=` `+` `-` `@` in an export file** | Excel runs a command when the user opens it | Prefix with `'` any value that starts with these characters |

> **A vulnerability people rarely know about:** a customer name of `=cmd|'/c calc'!A1`, if exported raw
> and someone opens it in Excel, will try to run the command for real. So always escape on export.

---

## 5 · Export

| Topic | Rule |
|---|---|
| Size | Above roughly 50,000 rows, run it as a background job and send a download link |
| Permission | **Export only data that this user already has permission to see**, because this is the most common leak |
| audit | Record every time who exported what data, which period, how many rows |
| Personal data | Mask columns that are not needed (see `pdpa-compliance`) |
| File name | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| File header | Put in the filter conditions used and the export time. Otherwise in 3 months nobody knows what data this file is |
| Download link | Must expire (see `file-upload-and-storage`) |
| Format | `.xlsx` for people to read · CSV for machines to read |
