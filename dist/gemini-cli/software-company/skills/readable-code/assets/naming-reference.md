# ตารางอ้างอิงการตั้งชื่อ — หน้าเดียว

## 1 · รูปแบบตัวพิมพ์ตามภาษา

| สิ่งที่ตั้งชื่อ | C# / .NET | TypeScript · JavaScript | Python | SQL |
|---|---|---|---|---|
| คลาส · type | `InvoiceRenderer` | `InvoiceRenderer` | `InvoiceRenderer` | — |
| ฟังก์ชัน · method | `CalculateTax` | `calculateTax` | `calculate_tax` | — |
| ตัวแปรในเครื่อง | `totalAmount` | `totalAmount` | `total_amount` | — |
| field ส่วนตัว | `_cache` | `#cache` หรือ `cache` | `_cache` | — |
| ค่าคงที่จริง | `MaxRetries` | `MAX_RETRIES` | `MAX_RETRIES` | — |
| ไฟล์ | `InvoiceRenderer.cs` | `invoice-renderer.ts` | `invoice_renderer.py` | — |
| โฟลเดอร์ | `Invoices/` | `invoice/` | `invoice/` | — |
| ตาราง | — | — | — | `invoice` (เอกพจน์) |
| คอลัมน์ | — | — | — | `created_at` |
| ตัวแปรสภาพแวดล้อม | `DB_HOST` | `DB_HOST` | `DB_HOST` | — |

**เลือกแบบของภาษานั้น ไม่ใช่แบบที่ชอบ** เพราะโค้ดที่หน้าตาแปลกจากแบบของภาษาจะอ่านสะดุดทุกบรรทัด

---

## 2 · คำนำหน้าฟังก์ชัน

| คำ | สัญญาว่า | ล้มเหลวได้ | มีผลข้างเคียง |
|---|---|:-:|:-:|
| `get` | คืนของที่มีอยู่แล้ว | ✗ | ✗ |
| `fetch` · `load` | ไปเอาจากที่อื่น | ✓ | ✗ |
| `compute` · `calculate` | คำนวณใหม่ทุกครั้ง | ✗ | ✗ |
| `build` · `create` | สร้างของใหม่ | ✗ | ✗ |
| `save` · `update` · `delete` | เขียนทับของเดิม | ✓ | ✓ |
| `ensure` | ทำให้เป็นจริง เรียกซ้ำได้ | ✓ | ✓ |
| `validate` · `assert` | โยน error ถ้าไม่ผ่าน | ✓ | ✗ |
| `is` · `has` · `can` | คืน true/false | ✗ | ✗ |
| `try...` | คืน null/false แทนโยน | ✗ | แล้วแต่ |
| `on...` · `handle...` | ตัวรับเหตุการณ์ | ✓ | ✓ |

---

## 3 · หน่วยที่ต้องอยู่ในชื่อ

| ชนิด | ลงท้ายด้วย | ตัวอย่าง |
|---|---|---|
| เวลา | `Ms` · `Seconds` · `Days` | `timeoutMs` · `retentionDays` |
| เงิน | `Satang` · `THB` · `USD` | `priceSatang` · `feeTHB` |
| ขนาด | `Bytes` · `Kb` · `Mb` | `maxUploadBytes` |
| สัดส่วน | `Percent` · `Ratio` | `discountPercent` · `hitRatio` |
| จำนวน | `Count` | `retryCount` |
| ลำดับ | `Index` | `pageIndex` |
| เวลาจุดหนึ่ง | `At` | `createdAt` · `expiresAt` |
| ช่วงเวลา | `Duration` + หน่วย | `sessionDurationMs` |

---

## 4 · คำต้องห้ามและตัวแทน

| ห้าม | แทนด้วย |
|---|---|
| `data` · `info` · `item` · `obj` · `value` | ชื่อจริงของสิ่งนั้น |
| `manager` · `handler` · `processor` · `service` | กริยาที่มันทำ |
| `helper` · `util` · `common` · `misc` | แยกตามเรื่อง |
| `do` · `perform` · `execute` · `run` | กริยาจริง |
| `temp` · `tmp` · `foo` · `test2` | หน้าที่ของมัน |
| `usrMgr` · `calcAmt` · ตัวย่อที่คิดเอง | เขียนเต็ม |

**ตัวย่อที่ใช้ได้เลย:** `id` `url` `uri` `http` `db` `api` `ui` `io` `os` `json` `csv` `pdf` `sql` `ms`

---

## 5 · ตรวจเร็ว 9 ข้อ

- [ ] ไม่มีคำต้องห้ามในข้อ 4
- [ ] เลขที่มีหน่วยทุกตัวมีหน่วยในชื่อ
- [ ] คำนำหน้าตรงกับพฤติกรรมจริง
- [ ] boolean เป็นประโยคบอกเล่า ไม่ใช่ปฏิเสธ
- [ ] ไม่มีฟังก์ชันรับ boolean เป็นพารามิเตอร์
- [ ] ชื่อฟังก์ชันไม่มีคำว่า `and`
- [ ] collection เป็นพหูพจน์และบอกชนิดข้างใน
- [ ] ชื่อไฟล์ตรงกับสิ่งที่ export เป็นหลัก
- [ ] ไม่มีตัวระบุภาษาไทย ไม่มีชื่อปนครึ่งคำ
