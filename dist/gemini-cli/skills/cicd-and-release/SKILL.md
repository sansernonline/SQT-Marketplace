---
name: cicd-and-release
description: Use when setting up or fixing a build and deploy pipeline, or deciding how a project ships. Covers pipeline stages and what each blocks on, build once and promote the same artifact, versions that trace back to a commit, branches, environments and gates, release patterns, feature flags and a rehearsed rollback. Ships starter pipelines.
---

# CI/CD และการปล่อยของ

> **กฎข้อเดียว:** build ครั้งเดียว แล้วเอา **artifact ตัวเดิม** ไปทุก environment
> ถ้า build ใหม่ตอนขึ้น production แปลว่าของที่ทดสอบผ่าน กับของที่ลูกค้าใช้ ไม่ใช่ตัวเดียวกัน

## เมื่อไหร่ใช้ skill นี้

- ตั้ง pipeline ให้โปรเจกต์ใหม่ หรือรื้อของเดิมที่ช้า/ไม่น่าเชื่อถือ
- ต้องตัดสินใจเรื่อง branch, เวอร์ชัน, environment, หรือวิธีปล่อยของ
- deploy แล้วพังบ่อย หรือ rollback ไม่ได้
- มีคนถามว่า "ตอนนี้ production รันเวอร์ชันอะไร commit ไหน"

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| ที่เก็บ secret และการหมุนเวียน | `config-and-secrets` |
| สัดส่วนและขอบเขตของ test | `testing-standards` |
| เขียน migration | `database-design` |
| ขั้นตอนตอนระบบล่ม | `incident-runbook-template` |
| เขียนบันทึกการปล่อยให้ผู้ใช้อ่าน | command `/release-notes` |

---

## 1 · ขั้นตอนใน pipeline

| ลำดับ | ขั้น | บล็อกเมื่อ | เวลาที่ยอมรับได้ |
|:--:|---|---|---|
| 1 | ตรวจรูปแบบโค้ด + lint | ผิดกฎ | < 1 นาที |
| 2 | build | คอมไพล์ไม่ผ่าน · มี warning ที่ตั้งเป็น error | < 3 นาที |
| 3 | unit test | มี test ตก · ความครอบคลุมต่ำกว่าเกณฑ์ | < 5 นาที |
| 4 | ตรวจ dependency + secret ที่หลุดเข้า git | พบช่องโหว่ระดับสูง · พบ secret | < 2 นาที |
| 5 | สร้าง artifact + ประทับเวอร์ชัน | — | < 2 นาที |
| 6 | deploy ลง staging | — | |
| 7 | integration + end-to-end test | test ตก | < 15 นาที |
| 8 | **ด่านคน** (เฉพาะ production) | ยังไม่มีคนกดอนุมัติ | |
| 9 | deploy ลง production | — | |
| 10 | ตรวจหลัง deploy | health check ไม่ผ่าน → rollback อัตโนมัติ | < 2 นาที |

**ขั้น 1–5 คือ CI ต้องวิ่งกับทุก pull request** ไม่ใช่เฉพาะตอน merge
**รวมขั้น 1–5 ควรจบใน 10 นาที** — เกินกว่านั้นคนจะเริ่มหาทางข้าม

---

## 2 · build ครั้งเดียว แล้วเลื่อนขั้น

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (ตัวนี้)
                                           ├→ uat      (ตัวเดิม)
                                           └→ production (ตัวเดิม)
```

- artifact คือไฟล์ที่ deploy ได้จริง — container image, ไฟล์ zip ที่ publish แล้ว, แพ็กเกจ
- **ความต่างระหว่าง environment ต้องมาจาก config ตอนรันเท่านั้น** ไม่ใช่จากการ build ใหม่
- เก็บ artifact ไว้ให้ย้อนกลับได้อย่างน้อย 30 วัน — rollback คือการ deploy artifact เก่า ไม่ใช่การ build ย้อน

> ❌ **`git pull` บนเครื่อง production แล้ว build ตรงนั้น** — ของที่รันอยู่ไม่มีใครรู้ว่าคือ commit ไหน
> และ dependency ที่ดึงตอนนั้นอาจไม่ใช่ชุดเดียวกับที่ทดสอบ

---

## 3 · เวอร์ชันต้องไล่กลับไปหา commit ได้

ใช้ SemVer — `MAJOR.MINOR.PATCH`

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| MAJOR | เปลี่ยนแล้วฝั่งที่เรียกใช้พัง (ดูตารางใน `api-conventions`) |
| MINOR | เพิ่มความสามารถ ของเดิมยังใช้ได้ |
| PATCH | แก้บั๊ก |

- **tag ใน git คือแหล่งความจริง** — `v1.4.0` ชี้ commit เดียวเท่านั้น
- artifact แปะ commit hash ไว้ด้วย — `1.4.0+abc1234`
- `/version` endpoint ต้องคืนค่าเดียวกันนี้ (ดู `web-service-essentials`)
- ก่อน 1.0.0 ให้ใช้ `0.x` และยอมรับว่ายังเปลี่ยนแรงได้

---

## 4 · branch

| แบบ | วิธี | เหมาะกับ |
|---|---|---|
| **trunk-based** (แนะนำ) | branch อายุสั้น 1–2 วัน merge เข้า `main` บ่อย · ของยังไม่เสร็จซ่อนด้วย feature flag | ทีมส่วนใหญ่ · ปล่อยของบ่อย |
| release branch | `main` + `release/1.4` สำหรับแก้ด่วน | ซอฟต์แวร์ที่ลูกค้าติดตั้งเอง · ต้องดูแลหลายเวอร์ชันพร้อมกัน |
| gitflow | `develop` + `feature` + `release` + `hotfix` | ปล่อยของเป็นรอบใหญ่ ๆ นาน ๆ ครั้ง · ส่วนใหญ่ซับซ้อนเกินจำเป็น |

**กฎที่ไม่ขึ้นกับแบบที่เลือก:**

- `main` ต้อง deploy ได้ตลอดเวลา
- ป้องกัน `main` ไว้ — ต้องผ่าน pull request และ CI เขียว ห้าม push ตรง
- branch ที่อายุเกินหนึ่งสัปดาห์ = merge conflict ที่รออยู่

---

## 5 · environment และด่าน

| environment | ข้อมูล | ใครกด deploy | ต้องผ่านอะไร |
|---|---|---|---|
| dev | ปลอม | อัตโนมัติทุก commit | build ผ่าน |
| staging | คล้ายจริง (ปิดบังแล้ว) | อัตโนมัติเมื่อ merge เข้า `main` | unit + integration |
| uat | คล้ายจริง | ทีมกด | ผู้ใช้ทดสอบผ่าน |
| production | จริง | **คนกดอนุมัติ** | ทุกอย่างข้างบน |

- staging ต้องใกล้เคียง production ให้มากที่สุด — เวอร์ชันฐานข้อมูล ระบบปฏิบัติการ ค่า config
- **ห้ามคัดลอกข้อมูลจริงลง staging โดยไม่ปิดบังข้อมูลส่วนบุคคล**
- ถ้ามี environment เดียวเพราะงบจำกัด ให้บอกตรง ๆ ในเอกสาร และเพิ่ม feature flag ทดแทน

---

## 6 · secret ใน pipeline

- เก็บใน secret store ของแพลตฟอร์ม ไม่ใช่ในไฟล์ pipeline
- ให้สิทธิ์เท่าที่ขั้นนั้นต้องใช้ — ขั้น build ไม่ต้องรู้รหัสฐานข้อมูล production
- pipeline ที่วิ่งจาก fork ของคนนอก **ห้ามเห็น secret**
- ตัวตรวจ secret ที่หลุดเข้า git ต้องอยู่ในขั้นที่ 4 ไม่ใช่ตรวจปีละครั้ง

รายละเอียดทั้งหมด → `config-and-secrets`

---

## 7 · migration ฐานข้อมูลใน pipeline

```
deploy schema (ขยาย) → deploy โค้ด → ตรวจ → deploy schema (บีบ) รอบถัดไป
```

- migration รันเป็น**ขั้นของตัวเอง** ก่อน deploy โค้ด ไม่ใช่รันตอนแอปบูต
  (แอปหลาย instance บูตพร้อมกันแล้วรัน migration ชนกันคือหายนะ)
- ใช้บัญชีที่มีสิทธิ์แก้ schema เฉพาะขั้นนี้ บัญชีที่แอปใช้รันต้องไม่มีสิทธิ์นั้น
- migration ต้องเข้ากันได้กับโค้ดเวอร์ชันก่อนหน้า — ไม่งั้น rollback โค้ดแล้วระบบพัง
- สำรองข้อมูลก่อนเสมอ และ**ทดสอบว่ากู้คืนได้จริง**

วิธี expand/contract → `database-design` ข้อ 9

---

## 8 · วิธีปล่อยของ

| วิธี | ทำงานยังไง | ต้องมี | เหมาะกับ |
|---|---|---|---|
| หยุดแล้วเปลี่ยน | ปิด → เปลี่ยน → เปิด | ไม่มี | ระบบภายใน · ปิดได้ตอนกลางคืน |
| **rolling** | ทยอยเปลี่ยนทีละเครื่อง | health check ที่เชื่อถือได้ · เข้ากันได้ทั้งสองเวอร์ชัน | ค่าเริ่มต้นของระบบที่รันหลาย instance |
| blue-green | ยกชุดใหม่ขึ้นครบ แล้วสลับ traffic | ทรัพยากรสองเท่าชั่วคราว | ต้อง rollback ได้ในไม่กี่วินาที |
| canary | ปล่อยให้ผู้ใช้ 5% ก่อน แล้วค่อยขยาย | ตัวชี้วัดที่แยกตามเวอร์ชันได้ | ระบบใหญ่ · ความเสี่ยงสูง |

> **rolling ต้องการสิ่งที่คนมักลืม** — ระหว่าง deploy เวอร์ชันเก่าและใหม่ให้บริการพร้อมกัน
> API และ schema จึงต้องเข้ากันได้ทั้งสองทาง ถ้าออกแบบไม่เผื่อไว้ ผู้ใช้บางคนจะเจอ error ทุกครั้งที่ deploy

**feature flag** — แยก "ปล่อยโค้ด" ออกจาก "เปิดใช้ฟีเจอร์"

- merge โค้ดที่ยังไม่เสร็จเข้า `main` ได้ โดยปิด flag ไว้
- เปิดให้คนบางกลุ่มก่อน ปิดได้ทันทีโดยไม่ต้อง deploy
- 🚨 **flag ต้องมีวันหมดอายุ** — flag ที่ค้างหนึ่งปีคือโค้ดสองเส้นทางที่ไม่มีใครกล้าลบ
  กำหนดให้ลบภายใน 2 sprint หลังเปิดใช้เต็มร้อย

---

## 9 · rollback

**เกณฑ์ที่ต้องกำหนดล่วงหน้า:** rollback เมื่ออัตรา error เกิน X% หรือเวลาตอบสนองเกิน Y วินาที
ไม่ใช่ตอนที่ทุกคนกำลังตกใจแล้วเถียงกันว่าควรรอดูอีกหน่อยไหม

| ต้องมี | เกณฑ์ |
|---|---|
| คำสั่ง rollback | ทำได้ด้วยคำสั่งเดียว |
| เวลาที่ใช้ | ต่ำกว่า 5 นาที |
| **ซ้อมจริง** | อย่างน้อยไตรมาสละครั้ง บน staging |
| ข้อมูล | migration ที่ทำไปแล้วต้องไม่ทำให้โค้ดเก่าพัง |

> **rollback ที่ไม่เคยซ้อม = ไม่มี rollback** — จะรู้ว่ามันใช้ไม่ได้ตอนที่ต้องใช้พอดี

---

## 10 · pipeline ต้องเร็วและน่าเชื่อถือ

| ปัญหา | วิธีแก้ |
|---|---|
| ช้า | แคช dependency · รัน test แบบขนาน · แยก test ที่ช้าไปวิ่งกลางคืน |
| test ที่ผลไม่คงที่ (flaky) | **แยกออกทันที** แล้วตั้งงานตามแก้ — test ที่ตกบ้างผ่านบ้างทำให้คนเลิกอ่านผล |
| ทุกคนรอคิว | เพิ่มตัวรันขนาน · ให้ pull request วิ่งเฉพาะที่เกี่ยวข้อง |
| build ไม่เหมือนเดิมทุกครั้ง | ล็อกเวอร์ชัน dependency (lock file) · ปักหมุดเวอร์ชัน image ด้วย digest |

**ตัวชี้วัดที่ควรดู:** ปล่อยของบ่อยแค่ไหน · จากคอมมิตถึงขึ้นจริงใช้เวลาเท่าไร ·
deploy แล้วพังกี่เปอร์เซ็นต์ · กู้คืนใช้เวลาเท่าไร

---

## 11 · Anti-patterns

- ❌ **build ใหม่ตอนขึ้น production** — ของที่ทดสอบไม่ใช่ของที่ปล่อย
- ❌ **deploy ด้วยมือตามขั้นตอนใน Word** — วันที่คนเขียนลาป่วยคือวันที่ deploy ไม่ได้
- ❌ **secret ในไฟล์ pipeline** — ใครอ่านโค้ดได้ก็อ่าน secret ได้
- ❌ **test ที่ตกแล้วปล่อยผ่าน** — ทำครั้งเดียวก็เลิกเชื่อผลไปตลอด
- ❌ **deploy วันศุกร์เย็น** ในทีมที่ยัง rollback ไม่ได้ด้วยคำสั่งเดียว
- ❌ **migration รันตอนแอปบูต** — หลาย instance ชนกัน
- ❌ **ไม่มี artifact เก็บไว้** — rollback กลายเป็นการ build ย้อนจาก commit เก่า
- ❌ **environment ที่ config ต่างกันจนคาดเดาไม่ได้** — "บน staging ผ่านนะ"
- ❌ **feature flag ที่ไม่มีวันลบ**
- ❌ **pipeline ใช้เวลา 45 นาที** — คนจะเริ่ม merge โดยไม่รอผล

---

## 12 · ตัวย่อ

- **CI** — Continuous Integration (รวมโค้ดเข้าด้วยกันบ่อย ๆ พร้อมตรวจอัตโนมัติทุกครั้ง)
- **CD** — Continuous Delivery/Deployment (พาโค้ดที่ผ่านการตรวจไปถึงผู้ใช้อัตโนมัติ)
- **SemVer** — Semantic Versioning (มาตรฐานเลขเวอร์ชัน MAJOR.MINOR.PATCH)
- **artifact** — ไฟล์ผลลัพธ์จากการ build ที่นำไป deploy ได้จริง
- **canary** — การปล่อยของใหม่ให้ผู้ใช้ส่วนน้อยก่อนเพื่อดูอาการ
- **UAT** — User Acceptance Testing (การทดสอบโดยผู้ใช้ก่อนรับมอบ)

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| secret และ config ต่อ environment | `config-and-secrets` |
| migration ที่ deploy ได้โดยไม่ปิดระบบ | `database-design` |
| สัดส่วน test แต่ละชั้นใน pipeline | `testing-standards` · `e2e-testing-patterns` |
| health check ที่ pipeline ใช้ตัดสิน | `web-service-essentials` |
| ขั้นตอนเมื่อ deploy แล้วล่ม | `incident-runbook-template` · `postmortem-template` |
| ข้อความ commit ที่สร้างบันทึกการปล่อยอัตโนมัติได้ | `commit-message-format` |

**ไฟล์ pipeline ที่ใช้ได้จริงของ GitHub Actions, Azure DevOps และ GitLab** → `references/per-platform.md`
