# NFR categories and vague-word conversion

Open this when writing section 5 (non-functional requirements) or when a customer's wording is vague.

## How to convert vague words

| Customer says | Ask back | Write down |
|---|---|---|
| "ต้องเร็ว" (must be fast) | How fast, measured where, with how many users | Return results within 2 seconds at the 95th percentile with 200 concurrent users |
| "ใช้ง่าย" (easy to use) | What must a new user be able to do, in how long, without training | A new user creates their first order within 5 minutes without opening the manual |
| "ปลอดภัย" (secure) | Against whom, what must they be unable to do | A user with the "viewer" role must be unable to call an API that changes data, and gets code 403 |
| "รองรับคนเยอะ" (supports many people) | How many at once, which period is heaviest | Supports 500 concurrent users during month-end closing |
| "รายงานครบ" (complete reports) | Which reports, who views them, how often | List them item by item, one report per item |

## NFR categories to ask about every time

The categories that hurt most when forgotten are **maintainability** and **backup**: nobody asks at contract signing, but everyone asks when the system goes down.

| Category | Must ask | Example that can be written |
|---|---|---|
| Performance | What is the slowest acceptable, at which percentile | หน้ารายการโหลดภายใน 1.5 วิ ที่ p95 |
| Capacity | How much data grows per year, how many years it will be used | รองรับ 2 ล้านรายการใน 3 ปี |
| Concurrent users | Which period is heaviest, how many people | 500 คน ช่วงปิดยอดสิ้นเดือน |
| Availability | Can it be shut down for maintenance, when | 99.5% ต่อเดือน · ปิดได้คืนวันอาทิตย์ 01:00–03:00 |
| Backup | How far back can it restore, how long does recovery take | สำรองทุกวัน · เก็บ 90 วัน · กู้คืนภายใน 4 ชม. |
| Security | How many permission levels, which data is sensitive · for web apps and APIs, put in NFR-SEC per `security-gate/references/owasp-contract-clause.md` | 4 บทบาท · เลขบัตรประชาชนเข้ารหัสตอนพัก |
| Audit trail | Must we know who changed what, when | บันทึกทุกการเปลี่ยนสถานะ เก็บ 2 ปี |
| Compatibility | Which browsers, mobile or not | Chrome/Edge 2 รุ่นล่าสุด · จอ ≥ 360px |
| Language | 2 languages, currency, time zone | ไทย/อังกฤษ · Asia/Bangkok · พ.ศ. ในรายงาน |
| Maintenance | Who takes over, what is handed over | ส่งมอบซอร์สโค้ด · คู่มือติดตั้ง · อบรม 2 วัน |
| Legal | Which regulations apply | พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) |

NFR testability from the requirements stage (reported from a training exercise, not measured for effect): the AI part uses fixed rules (same question, same answer) · a button to reset test data · the system's "today" date can be locked · every button has a label so tools can find it.
