# Leave form, ledger and annual summary

## 1. ใบลา (leave form)

```
ใบลา                                                    เลขที่ {LV2610-0001}
                                                       วันที่เขียน {6 ต.ค. 2569}
เรียน {ชื่อผู้บังคับบัญชา}

ข้าพเจ้า {ชื่อ-นามสกุล} รหัสพนักงาน {…} ตำแหน่ง {…} แผนก {…}
ขอลา  [ ] ป่วย  [ ] กิจ  [ ] พักผ่อนประจำปี  [ ] คลอด  [ ] ช่วยภรรยาดูแลบุตร
      [ ] รับราชการทหาร  [ ] ฝึกอบรม  [ ] ทำหมัน  [ ] อื่น ๆ {…}
เนื่องจาก {เหตุผล}
ตั้งแต่วันที่ {…} [ ] เต็มวัน [ ] ครึ่งเช้า [ ] ครึ่งบ่าย  ถึงวันที่ {…}  รวม {…} วันทำการ
ระหว่างลาติดต่อได้ที่ {โทรศัพท์}   ผู้รับมอบงาน {ชื่อ} งานที่ส่งมอบ {…}
เอกสารแนบ [ ] ใบรับรองแพทย์ [ ] สูติบัตร [ ] หนังสือเรียกพล [ ] อื่น ๆ

ลงชื่อ ……………… ผู้ลา

— สำหรับฝ่ายบุคคล —
ประเภทนี้ ปีนี้: สิทธิ {…} วัน  ใช้แล้ว {…}  ครั้งนี้ {…}  คงเหลือ {…}
[ ] ได้รับค่าจ้าง  [ ] ไม่ได้รับค่าจ้าง {…} วัน (เกินสิทธิตามกฎหมาย/ระเบียบ)
ผู้ตรวจสอบ ……………… วันที่ ………

— ความเห็นผู้บังคับบัญชา —
[ ] อนุมัติ  [ ] ไม่อนุมัติ เพราะ {…}
ลงชื่อ ……………… วันที่ ………      (ผู้อนุมัติขั้นที่ 2 ถ้ามี) ……………… วันที่ ………
```

## 2. Leave ledger (one row per request)

| เลขที่ | รหัส | ชื่อ | ประเภท | ตั้งแต่ | ถึง | วันทำการ | ได้รับค่าจ้าง | ไม่รับค่าจ้าง | คงเหลือหลังลา | ผู้อนุมัติ | วันที่อนุมัติ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| LV2610-0001 | E012 | {…} | พักผ่อน | 2026-09-30 | 2026-10-02 | 3.0 | 3.0 | 0 | 3.5 | {…} | 2026-09-24 |

## 3. Annual summary per employee (for year-end and termination)

| ประเภท | ยกมา | สิทธิปีนี้ | ใช้ | คงเหลือ | ยกไปปีหน้า | จ่ายแทนเมื่อพ้นสภาพ |
|---|---|---|---|---|---|---|
| พักผ่อน | | | | | | |
| ป่วย (ได้รับค่าจ้าง) | — | | | — | — | — |
| กิจ | — | | | — | — | — |

## Worked example (company policy numbers, not the legal minimum)

Company policy: 10 days annual leave a year, carry forward up to 5 days, pro-rata in the year of joining, round down to 0.5.
Employee joined 1 Apr 2568. In 2569 she carried forward 3 days.

| Item | Days |
|---|---|
| Carried forward from 2568 | 3.0 |
| Entitlement 2569 (full year) | 10.0 |
| Taken Jan–Sep | 6.5 |
| This request: Wed 30 Sep – Fri 2 Oct (3 working days) | 3.0 |
| **Balance after** | **3.5** |

Check the legal floor separately: the company's 10 days must be at least the statutory annual leave in `labour-law-basics`, and unused leave is paid out on termination per that skill.
