---
name: test-evidence
description: Use when running test cases and keeping proof. Captioned GIF per case, Markdown pass/fail report, result and evidence columns in Excel.
---

# Test Evidence

ทุกเคสที่รัน → GIF 1 ไฟล์ที่บอกว่าเคสไหน ทำอะไร เห็นอะไร ผ่านไหม · รายงาน `.md` 1 ฉบับต่อรอบ · ผลลง Excel พร้อมลิงก์หลักฐาน

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เขียน test case ก่อนรัน | `test-case-template` |
| บั๊ก 1 เรื่องที่เจอแล้ว | `bug-report-template` (แนบ GIF จาก skill นี้ได้) |
| เขียนโค้ด E2E · เทสต์ใน CI ที่ล้ม | `e2e-testing-patterns` (trace · video ของ Playwright) |

## ไฟล์อยู่ที่ไหน

| ไฟล์ | ที่อยู่ |
|---|---|
| ภาพแต่ละขั้น + `run.json` (ของชั่วคราว) | `_to_delete/test-frames/<run-id>/` |
| GIF · ภาพเต็มของขั้นที่ล้ม · `results.csv` | `qa/evidence/<run-id>/` |
| รายงาน | `qa/reports/<run-id>-test-report.md` |
| Excel test case | `qa/<project-code>-test-cases.xlsx` |

`<run-id>` = `YYYY-MM-DD-r<n>` เช่น `2026-10-18-r1` · ลิงก์ใน Excel และรายงานเป็น path แบบสัมพัทธ์ ย้ายโฟลเดอร์ `qa/` ทั้งก้อนแล้วยังเปิดได้

## 1 · ถ่ายภาพระหว่างรัน

- 1 ขั้นใน test case = ภาพ 1 ใบ ถ่าย **หลัง** ทำขั้นนั้นเสร็จ (เห็นผลของขั้น) · ใบแรกคือสภาพก่อนเริ่ม
- เว็บ → Playwright ขนาดหน้าจอ 1280×720 ทุกเคส (`page.screenshot(path=...)`) · desktop · mobile → วิธีถ่ายจาก verify skill ของโปรเจกต์ (`app-verifier-setup`)
- ขั้นที่ผิด → ใส่ `box` = กรอบแดงรอบจุดที่ผิด (x, y, w, h ของภาพ) · Playwright หาได้จาก `locator.bounding_box()`
- ใช้ข้อมูลทดสอบเท่านั้น ห้ามมีข้อมูลคนจริง รหัสผ่าน token ในภาพ (`pdpa-compliance`) · ช่องรหัสผ่านต้องเป็นจุด

## 2 · เขียนคำบรรยาย

ต่อขั้น 1 ประโยค: **ทำอะไร → เห็นอะไร** เช่น `กดเข้าสู่ระบบ → ขึ้นว่า รหัสผ่านไม่ถูกต้อง แต่ที่คาดคือ อีเมลหรือรหัสผ่านไม่ถูกต้อง`

- ไม่เกิน 2 บรรทัด (ราว 70 ตัวอักษรต่อบรรทัด) · ยาวกว่านั้นจะถูกตัด
- เว้นวรรคระหว่างวลี สคริปต์ตัดบรรทัดตรงช่องว่าง
- ขั้นที่ล้มต้องบอกทั้ง "ที่เห็น" และ "ที่คาด" · ภาษาตาม `human-writing`

## 3 · สร้าง GIF + รายงาน

กรอก `run.json` (รูปแบบเต็มอยู่หัวไฟล์ [`scripts/make_evidence.py`](scripts/make_evidence.py)) · ต่อเคส: `id` · `title` · `result` (`Pass` `Fail` `Blocked` `Not run`) · `expected` · `actual` · `issue` · `bug` · `steps[]`

```bash
python scripts/make_evidence.py _to_delete/test-frames/2026-10-18-r1/run.json \
  --out qa/evidence/2026-10-18-r1 --report qa/reports/2026-10-18-r1-test-report.md
```

หน้าตา GIF (ตั้งไว้ในสคริปต์ ไม่ต้องปรับเอง):

| ส่วน | ค่า | เหตุผล |
|---|---|---|
| ความกว้าง | ปรับทุกภาพเป็น 1280 px | เคสต่างกันขนาดตัวอักษรยังเท่ากัน |
| แถบบน | รหัสเคส · ชื่อเคส · `ขั้น n/N` · ป้าย PASS เขียว / FAIL แดง / BLOCKED ส้ม · ตัวอักษร 24 px | รู้ทันทีว่าดูเคสไหน ผลอะไร |
| แถบคำบรรยาย | ใต้ภาพ ไม่ทับหน้าจอ · ตัวอักษร 28 px · พื้นดำ ตัวขาว | ย่อเหลือ 800 px ยังอ่านได้ (~17 px) |
| เวลาต่อขั้น | 2–6 วินาที ตามความยาวคำบรรยาย | อ่านทัน ไม่ต้องหยุดภาพ |
| ภาพปิด | ผลตัวใหญ่ + ปัญหา + คาดว่า / ที่เกิดจริง | ดูภาพสุดท้ายภาพเดียวก็รู้เรื่อง |
| ฟอนต์ | Sarabun (ไทย + อังกฤษ) และชุดลูกศร ✓ ✗ อยู่ใน `assets/fonts/` | ทุกเครื่องหน้าตาเหมือนกัน |

- เคส `Fail` · `Blocked` ได้ `<id>-fail.png` เพิ่ม = ขั้นที่ล้มแบบสีเต็ม (GIF มีแค่ 256 สี) ใช้แนบบั๊ก
- สคริปต์เตือน `no raqm` → สระ วรรณยุกต์ไทยจะซ้อนกัน · รันใน Docker sandbox ของโปรเจกต์ (`docker-sandbox`) แล้วหาย
- รายงานที่ได้มี: หัวรอบ · ตารางสรุปจำนวน · ผลรายเคสพร้อมลิงก์ GIF · เคสที่ไม่ผ่านหรือติดขัดแบบละเอียดพร้อมภาพ · เคสที่ยังไม่ได้รัน
- เปิดรายงานแล้วเขียน **ข้อสรุป** 1–2 ประโยคเอง (ปล่อยได้ไหม · ติดอะไร) แทนบรรทัด `(รอยืนยัน)` · ช่อง `ปัญหา` ที่ยังว่างต้องเติม

## 4 · ลงผลใน Excel

`results.csv` มีคอลัมน์ `id` · `result` · `test_result` (ที่เกิดจริงหรือปัญหา) · `evidence` (ชื่อไฟล์ GIF)

| มี Excel อยู่แล้วแบบไหน | คำสั่ง |
|---|---|
| ยังไม่มี หรือสร้างจาก `test-case-template` | `python ../test-case-template/scripts/build-test-workbook.py cases.csv qa/PRJ-test-cases.xlsx --results qa/evidence/<run-id>/results.csv` |
| ผู้ใช้ส่งไฟล์ของตัวเองมา (หน้าตาแบบไหนก็ได้) | `python scripts/record_results.py <ไฟล์ของผู้ใช้>.xlsx qa/evidence/<run-id>/results.csv -o qa/PRJ-test-cases.xlsx` |

`record_results.py` หาแถวหัวตารางที่มีคอลัมน์รหัสเคส (`ID` · `TC ID` · `Test Case ID` · `รหัส`) ทุก sheet · คอลัมน์ผลที่มีอยู่แล้ว (`Status` · `ผล`) ใช้ต่อ · ที่ไม่มีเพิ่มท้ายตาราง: **Result** · **Test result** · **Evidence** (ลิงก์กดเปิด GIF) · ไฟล์ต้นฉบับของผู้ใช้ไม่แก้ทับ ถ้าจะทับให้ย้ายตัวเดิมไป `_to_delete/` ก่อน

## เช็กก่อนส่ง

- [ ] เคสที่บอกว่า `Pass` รันจริงรอบนี้ (`principle-prove-it-works`) · ไม่ได้รันใส่ `Not run` พร้อมเหตุผล
- [ ] เปิด GIF ของเคสที่ล้มอย่างน้อย 1 ไฟล์ด้วยตา: อ่านคำบรรยายออก กรอบแดงตรงจุด
- [ ] จำนวนในตารางสรุปของรายงาน = จำนวนเคสใน `run.json` = ผลใน Excel
- [ ] ไม่มีข้อมูลจริงหรือรหัสผ่านในภาพ
- [ ] ภาพดิบอยู่ใน `_to_delete/` ไม่ค้างใน `qa/`
- [ ] รันสคริปต์ทดสอบตัวเองผ่าน: `python scripts/make_evidence.py --self-test` · `python scripts/record_results.py --self-test`
