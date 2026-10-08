# skill: status-report

Use when a task that produces or checks project work ends (document, mockup, review, code, fix, release). Writes the status table in docs/BUILD-PLAN.md.

# รายงานสถานะเมื่อจบงาน

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียว:** จบงานทุกครั้ง ต้องมีตารางสถานะใน `docs/BUILD-PLAN.md` และตารางเดียวกันในคำตอบ
> งานที่ไม่มีตารางสถานะ ถือว่ายังไม่จบ

---

## 1 · เขียนที่ไหน — `docs/BUILD-PLAN.md` เสมอ

ทุกงาน ทั้งเอกสาร โค้ด การตรวจ การส่งมอบ เขียนที่ไฟล์เดียวนี้ เพื่อให้มีที่ดูสถานะที่เดียว

| สถานการณ์ | ทำอย่างไร |
|---|---|
| มีไฟล์อยู่แล้ว | แก้เฉพาะ 2 หัวข้อด้านล่าง — **ห้ามแตะตารางงานหรือหัวข้ออื่น** |
| ยังไม่มีไฟล์ | สร้างไฟล์ที่มีแค่ชื่อโปรเจกต์กับ 2 หัวข้อด้านล่าง แล้วเมื่อเริ่มเขียนโค้ดค่อยเพิ่มตารางงาน (`spec-to-code-loop`) **ระหว่าง** 2 หัวข้อนี้ |
| มี subagent หลายตัวทำงานพร้อมกัน | subagent **รายงานกลับ** อย่างเดียว ให้ตัวหลักเขียนไฟล์คนเดียว ไม่งั้นไฟล์พัง |

ลำดับหัวข้อในไฟล์ (ต่อจากชื่อโปรเจกต์): `## สถานะล่าสุด` → ตารางงาน → `## ประวัติสถานะ` → `## ตัดสินใจเอง` (`decision-log`)

2 หัวข้อที่ skill นี้ดูแล:

- `## สถานะล่าสุด` — **เขียนทับทั้งหัวข้อ** ทุกครั้ง เป็นภาพปัจจุบันภาพเดียว ไม่ใช่ต่อท้าย
- `## ประวัติสถานะ` — **เพิ่ม 1 บรรทัดบนสุด** ต่อ 1 งาน ไม่ลบของเดิม

---

## 2 · ตาราง `## สถานะล่าสุด`

```markdown
## สถานะล่าสุด

อัปเดต: 2026-10-01 14:20 · งานล่าสุด: เขียน SRS

| รายการ | ประเภท | สถานะ | ผลตรวจ | ค้าง / หมายเหตุ |
|---|---|---|---|---|
| SRS (`docs/srs.md`) | เอกสาร | DRAFT | ผ่าน — 42 FR ตรวจได้ทุกข้อ | FR-031 รอยืนยันตัวเลข |
| mockup (`mockup/`) | เอกสาร | REVIEW | ไม่ผ่าน — ปุ่มหลอก 3 จุด | แก้ `order.html` |
| FSD | เอกสาร | ยังไม่เริ่ม | — | รอ architecture |
| FR-001 ถึง FR-012 | โค้ด | เสร็จ | ผ่าน — test 48/48 | — |

**ค้างอยู่ (ต้องมีคนตัดสิน):**
1. FR-031 เวลาตอบสนองกี่วินาที — ถามผู้ว่าจ้าง

**รออนุมัติ:**
1. push branch `feat/search` — `git push -u origin feat/search`

**ถัดไป:** แก้ปุ่มหลอกใน mockup → เขียน architecture

**ข้อเสนอ:**
1. ย้ายตัวตรวจ input ไปไว้จุดเดียวที่ขอบ API — ลด if ซ้ำ 14 จุด · แรงกลาง
```

### ค่าที่ใช้ในแต่ละคอลัมน์ — ใช้เฉพาะค่าเหล่านี้

| คอลัมน์ | ค่าที่ใช้ได้ |
|---|---|
| ประเภท | `เอกสาร` · `โค้ด` · `ตรวจ` · `build` · `ส่งมอบ` — `build` คือไฟล์ release ที่สร้างแล้ว (APK · AAB · installer) ส่วน `ส่งมอบ` คือถึงมือผู้ใช้หรือขึ้นร้านค้าแล้ว |
| สถานะ (เอกสาร) | `ยังไม่เริ่ม` · `DRAFT` · `REVIEW` · `APPROVED` |
| สถานะ (โค้ด · build) | `รอทำ` · `กำลังทำ` · `เสร็จ` · `ติด` — ตรงกับตารางงานของ `spec-to-code-loop` และรหัสงานใช้รหัส FR ของ SRS ถ้ามี |
| ผลตรวจ | `ผ่าน — <หลักฐาน>` · `ไม่ผ่าน — <สิ่งที่ไม่ผ่าน>` · `ยังไม่ตรวจ` · `—` (ยังไม่มีอะไรให้ตรวจ) |

- **ผลตรวจต้องมีหลักฐานเสมอ** — ตัวเลข test ที่รันจริง จำนวนข้อที่ตรวจ ชื่อไฟล์ที่ดู ถ้าไม่ได้รันหรือไม่ได้ตรวจให้เขียน `ยังไม่ตรวจ` ห้ามเขียน `ผ่าน`
- **แอปมือถือ** หลักฐานต้องบอกเครื่องที่รัน — `ผ่าน — emulator Pixel 6 API 34 · ค่าเซนเซอร์ฉีดเข้า` หรือ `ผ่าน — เครื่องจริง <รุ่น> Android 14` ถ้ายังไม่ได้ลองเครื่องจริงให้เขียนไว้ในช่อง ค้าง
- `APPROVED` มีแต่คนที่เปลี่ยนได้ ส่วน agent ตั้งได้สูงสุด `DRAFT` หรือ `REVIEW`
- ตารางมีทุกรายการของโปรเจกต์ ไม่ใช่แค่งานรอบนี้ รายการที่รอบนี้ไม่ได้แตะให้คัดลอกค่าเดิมมา
- เอกสาร 1 ฉบับใช้ 1 แถว โค้ดที่สถานะเท่ากันรวมเป็นช่วงรหัสได้ (`FR-001 ถึง FR-012`) และตารางไม่ควรยาวเกิน 25 แถว

### "ค้างอยู่" กับ "ถัดไป"

- **ค้างอยู่** คือสิ่งที่ agent ไปต่อเองไม่ได้ ต้องมีคนตอบหรือตัดสิน ให้เขียนเป็นคำถามที่ตอบได้ พร้อมบอกว่าถามใคร ถ้าไม่มีให้เขียน `ไม่มี`
- **รออนุมัติ** คืองานที่เตรียมพร้อมแล้วแต่ย้อนไม่ได้ (superuser หัวข้อ 6) ให้บอกคำสั่งหรือไฟล์ที่พร้อมใช้ ถ้าไม่มีก็ไม่ต้องใส่หัวข้อ
- **ถัดไป** คืองานลำดับถัดไปไม่เกิน 3 อย่าง
- **ข้อเสนอ** คือการปรับปรุงนอกขอบเขตไม่เกิน 3 ข้อ บอกว่าได้อะไรและใช้แรงแค่ไหน ถ้าไม่มีก็ไม่ต้องใส่หัวข้อ

---

## 3 · บรรทัดใน `## ประวัติสถานะ`

1 บรรทัดต่อ 1 งาน ใหม่สุดอยู่บน:

```markdown
## ประวัติสถานะ

- 2026-10-01 14:20 · เขียน SRS · DRAFT · ผ่าน 42/42 FR · ค้าง 1
- 2026-09-30 10:05 · ตรวจ mockup · ไม่ผ่าน · ปุ่มหลอก 3 จุด
```

รูปแบบ: `วันที่ เวลา · งาน · สถานะ · ผล · ค้างกี่ข้อ` — ไม่เกิน 1 บรรทัด ไม่ใส่รายละเอียดที่อยู่ในตารางแล้ว ถ้ารอบนั้นตัดสินใจเองให้ต่อท้าย `· ตัดสินใจเอง <จำนวน>`

หัวข้อ `## ตัดสินใจเอง` ที่อยู่ถัดลงไป เป็นของ skill `decision-log` ซึ่ง skill นี้ไม่แก้และไม่ลบ

---

## 4 · ในคำตอบ

แสดงตาราง `สถานะล่าสุด` เฉพาะ **แถวที่เปลี่ยนในรอบนี้** + "ค้างอยู่" + "รออนุมัติ" (ถ้ามี) + "ข้อเสนอ" (ถ้ามี) + "ถัดไป" แล้วบอกว่าตารางเต็มอยู่ใน `docs/BUILD-PLAN.md` — ไม่ต้องแปะทั้งไฟล์

---

## 5 · รายการตรวจก่อนบอกว่าจบ

- [ ] อ่าน `docs/BUILD-PLAN.md` จากดิสก์ก่อนแก้ (คนอื่นอาจแก้ไปแล้ว)
- [ ] `## สถานะล่าสุด` เขียนทับ ไม่ได้ต่อท้าย และมีวันที่เวลา
- [ ] ทุกแถวที่เขียนว่า `ผ่าน` มีหลักฐาน
- [ ] ไม่ได้ตั้ง `APPROVED` เอง
- [ ] เพิ่มบรรทัดใน `## ประวัติสถานะ` 1 บรรทัด
- [ ] ไม่แตะตารางงานหรือหัวข้ออื่นในไฟล์
- [ ] คำตอบมีตารางเฉพาะแถวที่เปลี่ยน + ค้าง + รออนุมัติ (ถ้ามี) + ข้อเสนอ (ถ้ามี) + ถัดไป

---

## 6 · สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนว่า `ผ่าน` โดยไม่ได้รัน test หรือไม่ได้ตรวจจริง | ตารางสถานะที่โกหกแย่กว่าไม่มีตาราง |
| ต่อท้าย `## สถานะล่าสุด` ทุกรอบ | ไฟล์ยาวขึ้นเรื่อย ๆ และไม่รู้ว่าแถวไหนคือปัจจุบัน |
| สร้างไฟล์สถานะใหม่ (`STATUS.md` `progress.md`) | สถานะกระจายหลายที่ ไม่มีใครรู้ว่าดูที่ไหน |
| ซ่อนรายการที่ไม่ผ่านไว้ในร้อยแก้ว | คนอ่านตารางแล้วเข้าใจว่าผ่านหมด |
| ให้ subagent เขียน `BUILD-PLAN.md` เอง | เขียนชนกันแล้วไฟล์พัง |

---

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ตารางงานและวงรอบเขียนโค้ด ในไฟล์เดียวกัน | `spec-to-code-loop` |
| ชุดเอกสารของโปรเจกต์และสถานะเอกสาร | `project-doc-set` |
| บันทึกบริบทเพื่อทำต่อในรอบสนทนาหน้า | `work-session-context` |
| ตารางการตัดสินใจเองในไฟล์เดียวกัน | `decision-log` |
| เลือก playbook และจบงานทุกชนิด | `superuser` |
| รูปแบบตารางและเอกสาร | `polished-document-style` |
| ชื่อและสถานะของไฟล์เอกสาร | `document-naming` |


---

# skill: docker-sandbox

Use when a project should run in its own Docker container, not on the host (installs, builds, tests, unattended agents), or the user says sandbox.

# docker-sandbox — ห้องทดลองต่อโปรเจกต์

> เครื่องเราเป็นคนสั่ง ห้องทดลองเป็นที่ลงมือ
> ข้างในติดตั้ง ลบ รันเซิร์ฟเวอร์ ทำฐานข้อมูลทดสอบได้เต็มที่ เพราะพังแล้วล้างทิ้งสร้างใหม่ได้ในคำสั่งเดียว
> ข้างนอก (เครื่องจริง · ระบบจริง · บัญชีจริง) แตะไม่ได้ เพราะไม่มีทางเข้าจากข้างใน

ใช้คู่กับ [`superuser`](../superuser/SKILL.md) — โปรเจกต์ที่มี `.sandbox/` งานติดตั้งและรันทุกอย่างทำในห้องนี้

---

## 1 · หนึ่งโปรเจกต์ = หนึ่งห้อง

- **ห้องเดียวต่อโปรเจกต์** ชื่อ `sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่สร้าง>` (เช่น `sandbox-agent-sample-app-20260125`)
  - ตั้งชื่อครั้งเดียวตอน `up` แรก แล้วเก็บในไฟล์ `.sandbox/.name-<ชื่อโฟลเดอร์>` คำสั่งทีหลังอ่านชื่อจากไฟล์นี้ ชื่อจึงไม่เปลี่ยนตามวัน
  - prefix `sandbox-agent-` บอกว่า agent สร้างห้องนี้ ไม่ใช่คนตั้ง ส่วนวันที่สร้างเก็บซ้ำไว้ใน label `sqt.created`
  - ถ้าโปรเจกต์ต้องมีฐานข้อมูล cache หรือเบราว์เซอร์ ให้เพิ่มเป็น service ใน**ห้องเดียวกัน** (stack เดียว) ไม่แยกห้องใหม่
- **image ฐานใช้ร่วมกันทั้งเครื่อง** — `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) build ครั้งเดียว ส่วน image ของแต่ละโปรเจกต์เพิ่มแค่ชั้นบาง ๆ ที่โปรเจกต์นั้นต้องใช้ จึงไม่กินดิสก์ซ้ำ
- **ห้องที่หยุดอยู่ไม่กิน CPU และหน่วยความจำ** กินแค่ดิสก์ จบงานแล้วให้ `stop` และเลิกงานทั้งวันให้ `stop-all`
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกัน แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — เพราะของที่ติดตั้งจะชนกัน โปรเจกต์หนึ่งพังแล้วลามไปอีกโปรเจกต์ และล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางพร้อมกัน (ห้องละทาง) |

เพิ่ม `-Locked` ได้ทั้งสองแบบ — ปิดอินเทอร์เน็ตขาออก เหลือเฉพาะโฮสต์ใน `allowlist.txt` เหมาะกับงานที่รันโค้ดที่ยังไม่ไว้ใจ

---

## 3 · ตั้งห้องให้โปรเจกต์ (ครั้งแรก)

1. ตรวจว่า Docker Desktop รันอยู่ — `docker version` ต้องเห็นทั้ง Client และ Server ถ้าไม่เห็น ให้บอกผู้ใช้ให้เปิด Docker Desktop แล้วหยุดเฉพาะงานนี้
2. คัดลอกทุกไฟล์ใน `assets/` ของ skill นี้ไปที่ `<โปรเจกต์>/.sandbox/`
3. ปรับ `Dockerfile` (ชั้นของโปรเจกต์)
   - ถ้าเป็น .NET ให้ตั้ง `INSTALL_DOTNET=1` แล้วเพิ่ม `apt-get install` ของที่โปรเจกต์ต้องใช้
   - **อย่าแก้ `base.Dockerfile`** ถ้าไม่จำเป็น เพราะทุกโปรเจกต์ใช้ร่วมกัน
   - ถ้าต้องมีฐานข้อมูลทดสอบ ให้เพิ่มเป็น service ใหม่ใน `compose.yaml` (ไม่เปิด port ออกนอก)
4. เพิ่ม `.sandbox/.mode-*` และ `.sandbox/.name-*` ใน `.gitignore`
5. เปิดห้อง — `.\.sandbox\sandbox.ps1 up` (หรือ `up -Isolated` · `up -Browser`) โปรเจกต์แรกของเครื่องต้อง build image ฐานก่อน ใช้เวลาราว 5–15 นาที ส่วนโปรเจกต์ถัดไปจะเร็วขึ้นมาก
6. **พิสูจน์ว่าใช้ได้** — `sandbox.ps1 exec "node -v && python3 --version && git status"` ถ้าโปรเจกต์มีคำสั่ง test ให้รันผ่าน `exec` 1 ครั้ง ส่วนโหมด `-Locked` ต้องเห็นบรรทัด `check passed`
7. ลงใน `docs/README.md` ของโปรเจกต์ — ชื่อห้อง (`sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่>`) · โหมด · port · คำสั่ง test ในห้อง

**ทดสอบจริงแล้ว** บน Windows + Docker Desktop 4.46 (2026-10-05, โปรเจกต์ `sample-app`) — build ห้องได้ · unit test ผ่าน 15/15 · e2e บน Chromium ผ่าน 14/14 ในห้อง

บั๊กที่เจอระหว่างทดสอบแก้ในสคริปต์แล้ว: PowerShell 5.1 กับ stderr · Playwright คนละรุ่นกับ image ฐาน · พอร์ตชน

ถ้าสคริปต์พังบนเครื่องอื่น ให้ใช้ playbook `bug-fix` กับตัวสคริปต์

**พอร์ต** — `up` หาพอร์ตว่างเอง เริ่มที่ 3000 แล้วบอกว่าได้พอร์ตไหน
- ในห้องตั้งตัวแปร `APP_PORT` และ `PORT` เป็นพอร์ตนั้น และ `HOST=0.0.0.0`
- แอปต้องฟังที่ `HOST` เพราะถ้าฟังแค่ `127.0.0.1` ในห้อง เครื่องจะเข้าไม่ถึง
- ฝั่งเครื่องยังเปิดแค่ `127.0.0.1` เหมือนเดิม จึงเข้าจากเครื่องที่ `http://127.0.0.1:<พอร์ต>`

**Playwright คนละรุ่น** — image ฐานมี Chromium รุ่นล่าสุด ถ้าโปรเจกต์ล็อก Playwright รุ่นอื่นไว้ ให้รัน `npx playwright install chromium` ในห้อง 1 ครั้งหลัง `npm ci` (ไม่ต้อง `--with-deps` เพราะ image มีให้แล้ว)

---

## 4 · ใช้ทุกวัน

| ต้องการ | คำสั่ง (รันที่รากโปรเจกต์บนเครื่อง) |
|---|---|
| รันคำสั่งในห้อง (agent ใช้อันนี้) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| เปิด shell ในห้อง | `.\.sandbox\sandbox.ps1 shell` |
| ให้ Claude Code ทำงานในห้องเต็มที่ | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้) |
| เอางานจากห้อง isolated ออกมา | `.\.sandbox\sandbox.ps1 sync` แล้วอ่าน patch ก่อน `git apply` |
| ห้องทั้งหมดในเครื่อง | `.\.sandbox\sandbox.ps1 list` |
| ล้างห้องให้สะอาด เริ่มใหม่ | `reset` แล้ว `up` |
| หยุดทุกห้องในเครื่อง คืนหน่วยความจำ | `.\.sandbox\sandbox.ps1 stop-all` |
| ห้องหลายห้องของโปรเจกต์เดียว | ใส่ `-Name <โปรเจกต์>-a1` ทุกคำสั่ง |

**กฎของ agent เมื่อโปรเจกต์มี `.sandbox/`**
- install · build · test · dev server · migration และสคริปต์ใด ๆ ให้รันผ่าน `sandbox.ps1 exec` ไม่รันบนเครื่อง
- skill ตรวจแอปของโปรเจกต์ (`app-verifier-setup`) รัน Playwright ในห้องแบบไม่มีหน้าจอ แล้วคัดภาพออกด้วย `docker compose cp` มาไว้ `_to_delete/`
- ถ้าห้องหยุดอยู่ ให้ `up` เองได้เลย (ย้อนได้) ถ้าห้องพังจนแก้ไม่ได้ ก็ `reset` เองได้ เพราะของในห้องไม่ใช่ของผู้ใช้ — **ยกเว้น** ห้อง isolated ที่ยังไม่ได้ `sync` ต้อง sync ก่อนแล้วค่อย reset

---

## 5 · เบราว์เซอร์เสมือนสำหรับทดสอบ

| แบบ | ใช้เมื่อ | วิธี |
|---|---|---|
| headless ในห้อง (ค่าเริ่ม) | test อัตโนมัติ · verify skill · ไม่ต้องมีใครดู | Playwright Chromium มากับ image ฐานแล้ว |
| **มองเห็นได้** (`up -Browser`) | อยากดู agent กดจริงทีละขั้น · ตรวจหน้าจอด้วยตา · อัดภาพ | เบราว์เซอร์จริงในคอนเทนเนอร์แยก ดูสดที่ `http://127.0.0.1:7900` และ Playwright ในห้องจะขับผ่าน `SELENIUM_REMOTE_URL` ให้เอง (Playwright เรียกความสามารถนี้ว่ายังทดลอง) |
| ให้ Claude Code ในห้องคุมเบราว์เซอร์เอง | งานสำรวจหน้าเว็บที่ยังไม่มีสคริปต์ | ติดตั้ง Playwright MCP server ในห้อง (`.mcp.json` ของโปรเจกต์) ให้ทำงานแบบ headless |

- เบราว์เซอร์ในห้องไม่มีบัญชี ไม่มีคุกกี้ ไม่มีรหัสผ่านของผู้ใช้ — ล็อกอินด้วยบัญชีทดสอบของโปรเจกต์เท่านั้น
- ภาพและวิดีโอจากการทดสอบ คัดออกมาที่ `_to_delete/` ด้วย `docker compose cp`
- เบราว์เซอร์ของผู้ใช้บนเครื่อง (Chrome ที่ล็อกอินอยู่) ใช้กับเว็บจริงที่ต้องใช้บัญชีจริงเท่านั้น และทำตามกติกาของเครื่องมือนั้น ไม่ใช่ที่ทดสอบ

## 6 · CAPTCHA

- **ระบบของเราเอง** — CAPTCHA ไม่ควรขวางการทดสอบตั้งแต่ต้น
  - ใช้ค่าทดสอบ (test site key) ที่ผู้ให้บริการแจกไว้ ซึ่งผ่านทุกครั้ง reCAPTCHA · hCaptcha · Cloudflare Turnstile มีให้ทุกเจ้า ดูค่าได้จากเอกสารผู้ให้บริการ
  - หรือปิดด้วยค่าตั้งเฉพาะ environment ทดสอบ (`CAPTCHA_ENABLED=false`)
  - **ค่าทดสอบต้องไม่หลุดไปถึงระบบจริง** — ใส่ตัวตรวจตอนเริ่มระบบว่า production ห้ามใช้ test key (`config-and-secrets`)
- **เว็บของคนอื่น** — agent **ไม่แก้ CAPTCHA และไม่หาทางหลบ** (ไม่ใช้บริการรับแก้ ไม่ปลอมตัวเป็นคน) ถ้าเจอ CAPTCHA ให้หยุดขั้นนั้น บอกผู้ใช้ให้ทำเอง แล้วทำส่วนอื่นต่อ ถ้าต้องดึงข้อมูลจากเว็บนั้นบ่อย ให้หา API ทางการแทน
- เหตุผล — CAPTCHA คือเจ้าของเว็บบอกว่า "ห้ามบอท" การหลบจึงเท่ากับฝ่าข้อตกลงของเขา และทำให้ IP หรือบัญชีถูกแบน

## 7 · ในห้องทำได้เต็มที่

ติดตั้งโปรแกรม (`sudo apt-get` · `npm -g` · `pip`) · ลบไฟล์ในห้อง · รันเซิร์ฟเวอร์และฐานข้อมูลทดสอบ · ดาวน์โหลด dependency · commit ในสำเนาของโหมด isolated · ทดลองทำลายแล้วสร้างใหม่

เรื่องที่ยังอยู่ใน "รออนุมัติ" แม้อยู่ในห้อง (เตรียมไว้ ไม่ทำเอง) — เพราะผลออกไปนอกห้อง:
- ส่งข้อมูล อีเมล ข้อความ หรือเรียก API ที่มีผลจริงกับคนหรือระบบภายนอก
- ใช้บัญชีจริง ค่าลับจริง ฐานข้อมูลจริง
- push ขึ้น remote · deploy
- ในโหมด mount — ลบหรือเขียนทับไฟล์ของผู้ใช้ใน `/work` ที่ไม่ใช่ผลงานของรอบนี้ (มันคือโฟลเดอร์จริง)

---

## 8 · ห้ามแก้ compose ให้มีสิ่งเหล่านี้

| ห้าม | เพราะ |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | ห้องจะมองเห็นและแตะเครื่องจริงได้ |
| mount `/var/run/docker.sock` หรือ `//./pipe/docker_engine` | คุม Docker ได้ = คุมเครื่องได้ |
| mount โฟลเดอร์ home · `.ssh` · `.aws` · `.azure` · `.claude` ของเครื่อง · โปรไฟล์เบราว์เซอร์ · ไดรฟ์ทั้งลูก | ค่าลับหลุดได้ทันทีที่โค้ดในห้องอ่าน |
| เปิด port แบบ `"3000:3000"` (ทุกการ์ดแลน) | คนในเครือข่ายเดียวกันเข้าถึงได้ — ใช้ `127.0.0.1:` เสมอ |
| ใส่ค่าลับจริงใน `Dockerfile` หรือ image | ค่าลับติดไปกับ image ตลอด |
| ปิดหรือเพิ่ม limit `cpus` `mem_limit` `pids_limit` จนเครื่องค้าง | ห้องที่วนไม่จบจะกินเครื่องทั้งเครื่อง |

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปจึงช้ากว่าไฟล์ใน volume ถ้า build หรือ test ช้ามาก ให้ใช้ `-Isolated` (วัดจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ จึงควรใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- ถ้ารัน `sandbox.ps1` ไม่ได้ ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) — ผู้แข่งแต่ละตัวได้ห้อง isolated ของตัวเอง (`-Name <โปรเจกต์>-a1` …)
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `superuser` — เก็บกวาดห้องและ image เก่า


---

# skill: cicd-and-release

Use when setting up or fixing a build and deploy pipeline or deciding how a project ships. Stages, gates, build once and promote, flags, rehearsed rollback.

# CI/CD และการปล่อยของ

> **กฎข้อเดียว:** build ครั้งเดียว แล้วเอา **artifact ตัวเดิม** ไปทุก environment
> ถ้า build ใหม่ตอนขึ้น production ของที่ทดสอบผ่านกับของที่ลูกค้าใช้จะไม่ใช่ตัวเดียวกัน

## เมื่อไหร่ใช้ skill นี้

- ตั้ง pipeline ให้โปรเจกต์ใหม่ หรือรื้อของเดิมที่ช้าหรือผลไม่น่าเชื่อ
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
| 10 | ตรวจหลัง deploy | health check ไม่ผ่านจะ rollback อัตโนมัติ | < 2 นาที |

**ขั้น 1–5 คือ CI ต้องรันกับทุก pull request** ไม่ใช่เฉพาะตอน merge
**ขั้น 1–5 รวมกันควรจบใน 10 นาที** ถ้านานกว่านั้นคนจะเริ่มหาทางข้าม

---

## 2 · build ครั้งเดียว แล้วเลื่อนขั้น

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (ตัวนี้)
                                           ├→ uat      (ตัวเดิม)
                                           └→ production (ตัวเดิม)
```

- artifact คือไฟล์ที่ deploy ได้จริง: container image · ไฟล์ zip ที่ publish แล้ว · แพ็กเกจ
- **environment ต่างกันได้แค่ที่ config ตอนรัน** ไม่ใช่ build ใหม่
- เก็บ artifact ไว้ให้ย้อนกลับได้อย่างน้อย 30 วัน เพราะ rollback คือ deploy artifact เก่า ไม่ใช่ build ย้อนจาก commit เก่า

> ❌ **`git pull` บนเครื่อง production แล้ว build ตรงนั้น** ทำให้ไม่มีใครรู้ว่าของที่รันอยู่คือ commit ไหน
> และ dependency ที่ดึงตอนนั้นอาจไม่ใช่ชุดเดียวกับที่ทดสอบ

---

## 3 · เวอร์ชันต้องไล่กลับไปหา commit ได้

ใช้ SemVer: `MAJOR.MINOR.PATCH`

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| MAJOR | เปลี่ยนแล้วฝั่งที่เรียกใช้พัง (ดูตารางใน `api-conventions`) |
| MINOR | เพิ่มความสามารถ ของเดิมยังใช้ได้ |
| PATCH | แก้บั๊ก |

- **ยึด tag ใน git เป็นหลัก** · `v1.4.0` ชี้ commit เดียวเท่านั้น
- artifact แปะ commit hash ไว้ด้วย เช่น `1.4.0+abc1234`
- `/version` endpoint ต้องคืนค่าเดียวกันนี้ (ดู `web-service-essentials`) ส่วนแอปมือถือที่ไม่มี endpoint ให้แสดงในหน้า "เกี่ยวกับ" แทน
- **ยกเว้น Flutter / Android** ตัวเลขหลัง `+` ใน `pubspec.yaml` คือ versionCode ซึ่งต้องเป็นจำนวนเต็ม จึงใส่ hash ไม่ได้ (ดูหัวข้อ "แอป Android / Flutter")
- ก่อน 1.0.0 ใช้ `0.x` และถือว่ายังเปลี่ยนใหญ่ได้

---

## 4 · branch

| แบบ | วิธี | เหมาะกับ |
|---|---|---|
| **trunk-based** (แนะนำ) | branch อายุสั้น 1–2 วัน merge เข้า `main` บ่อย · งานที่ยังไม่เสร็จซ่อนไว้ด้วย feature flag | ทีมส่วนใหญ่ · ปล่อยของบ่อย |
| release branch | `main` + `release/1.4` สำหรับแก้ด่วน | ซอฟต์แวร์ที่ลูกค้าติดตั้งเอง · ต้องดูแลหลายเวอร์ชันพร้อมกัน |
| gitflow | `develop` + `feature` + `release` + `hotfix` | ปล่อยของเป็นรอบใหญ่ นาน ๆ ครั้ง · ส่วนใหญ่ซับซ้อนเกินจำเป็น |

**กฎที่ไม่ขึ้นกับแบบที่เลือก:**

- `main` ต้อง deploy ได้ตลอดเวลา
- ป้องกัน `main` ไว้ ให้ต้องผ่าน pull request และ CI เขียว ห้าม push ตรง
- branch ที่อายุเกิน 1 สัปดาห์ให้เตรียมเจอ merge conflict

---

## 5 · environment และด่าน

| environment | ข้อมูล | ใครกด deploy | ต้องผ่านอะไร |
|---|---|---|---|
| dev | ปลอม | อัตโนมัติทุก commit | build ผ่าน |
| staging | คล้ายจริง (ปิดบังแล้ว) | อัตโนมัติเมื่อ merge เข้า `main` | unit + integration |
| uat | คล้ายจริง | ทีมกด | ผู้ใช้ทดสอบผ่าน |
| production | จริง | **คนกดอนุมัติ** | ทุกอย่างข้างบน |

- staging ต้องใกล้เคียง production ให้มากที่สุด: เวอร์ชันฐานข้อมูล ระบบปฏิบัติการ ค่า config
- **ห้ามคัดลอกข้อมูลจริงลง staging โดยไม่ปิดบังข้อมูลส่วนบุคคล**
- ถ้ามี environment เดียวเพราะงบจำกัด ให้บอกตรง ๆ ในเอกสาร และใช้ feature flag ช่วยแทน

---

## 6 · secret ใน pipeline

- เก็บใน secret store ของแพลตฟอร์ม ไม่ใช่ในไฟล์ pipeline
- ให้สิทธิ์เท่าที่ขั้นนั้นต้องใช้ เช่น ขั้น build ไม่ต้องรู้รหัสฐานข้อมูล production
- pipeline ที่รันจาก fork ของคนนอก **ห้ามเห็น secret**
- ตัวตรวจ secret ที่หลุดเข้า git ต้องอยู่ในขั้นที่ 4 ไม่ใช่ตรวจปีละครั้ง

รายละเอียดทั้งหมดอยู่ใน `config-and-secrets`

---

## 7 · migration ฐานข้อมูลใน pipeline

```
deploy schema (ขยาย) → deploy โค้ด → ตรวจ → deploy schema (บีบ) รอบถัดไป
```

- migration รันเป็น**ขั้นของตัวเอง** ก่อน deploy โค้ด ไม่ใช่รันตอนแอปบูต
  (ถ้าแอปหลาย instance บูตพร้อมกัน migration จะรันชนกันจนข้อมูลพังได้)
- ใช้บัญชีที่แก้ schema ได้เฉพาะขั้นนี้ ส่วนบัญชีที่แอปใช้รันต้องแก้ schema ไม่ได้
- migration ต้องใช้ได้กับโค้ดเวอร์ชันก่อนหน้าด้วย ไม่งั้น rollback โค้ดแล้วระบบจะพัง
- สำรองข้อมูลก่อนเสมอ และ**ทดสอบว่ากู้คืนได้จริง**
- **ข้อยกเว้น: ฐานข้อมูลในเครื่องผู้ใช้** (SQLite · sqflite · drift บนมือถือ) ต้อง migrate ตอนแอปเปิด เพราะไม่มีทางอื่น
  กฎข้างบนใช้กับฐานข้อมูลบนเซิร์ฟเวอร์ที่หลาย instance ใช้ร่วมกัน ส่วน migration ในเครื่องต้องมี test ไล่จากทุกเวอร์ชัน schema ที่เคยปล่อย

วิธี expand/contract ดูที่ `database-design` ข้อ 9

---

## 8 · วิธีปล่อยของ

| วิธี | ทำงานยังไง | ต้องมี | เหมาะกับ |
|---|---|---|---|
| หยุดแล้วเปลี่ยน | ปิด → เปลี่ยน → เปิด | ไม่มี | ระบบภายใน · ปิดได้ตอนกลางคืน |
| **rolling** | ทยอยเปลี่ยนทีละเครื่อง | health check ที่เชื่อถือได้ · ใช้ร่วมกันได้ทั้ง 2 เวอร์ชัน | ค่าเริ่มต้นของระบบที่รันหลาย instance |
| blue-green | ยกชุดใหม่ขึ้นครบ แล้วสลับ traffic | ทรัพยากร 2 เท่าชั่วคราว | ต้อง rollback ได้ในไม่กี่วินาที |
| canary | ปล่อยให้ผู้ใช้ 5% ก่อน แล้วค่อยขยาย | ตัวชี้วัดที่แยกตามเวอร์ชันได้ | ระบบใหญ่ · ความเสี่ยงสูง |

> **rolling มีเรื่องที่คนมักลืม** คือระหว่าง deploy เวอร์ชันเก่าและใหม่ให้บริการพร้อมกัน
> API และ schema จึงต้องใช้ได้กับทั้ง 2 เวอร์ชัน ถ้าไม่ได้ออกแบบเผื่อไว้ ผู้ใช้บางคนจะเจอ error ทุกครั้งที่ deploy

**feature flag** (สวิตช์เปิดปิดฟีเจอร์) ช่วยแยก "ปล่อยโค้ด" ออกจาก "เปิดใช้ฟีเจอร์"

- merge โค้ดที่ยังไม่เสร็จเข้า `main` ได้ โดยปิด flag ไว้
- เปิดให้คนบางกลุ่มก่อน ปิดได้ทันทีโดยไม่ต้อง deploy
- 🚨 **flag ต้องมีวันหมดอายุ** เพราะ flag ที่ค้าง 1 ปีจะกลายเป็นโค้ด 2 เส้นทางที่ไม่มีใครกล้าลบ
  กำหนดให้ลบภายใน 2 sprint หลังเปิดใช้ 100%

---

## 9 · rollback

**เกณฑ์ที่ต้องกำหนดล่วงหน้า:** rollback เมื่ออัตรา error เกิน X% หรือเวลาตอบสนองเกิน Y วินาที
ไม่ใช่มาตัดสินตอนทุกคนกำลังตกใจ แล้วเถียงกันว่าควรรอดูอีกหน่อยไหม

| ต้องมี | เกณฑ์ |
|---|---|
| คำสั่ง rollback | ทำได้ด้วยคำสั่งเดียว |
| เวลาที่ใช้ | ต่ำกว่า 5 นาที |
| **ซ้อมจริง** | อย่างน้อยไตรมาสละ 1 ครั้ง บน staging |
| ข้อมูล | migration ที่ทำไปแล้วต้องไม่ทำให้โค้ดเก่าพัง |

> **rollback ที่ไม่เคยซ้อม เท่ากับไม่มี rollback** เพราะจะรู้ว่าใช้ไม่ได้ก็ตอนที่ต้องใช้พอดี

---

## 10 · pipeline ต้องเร็วและน่าเชื่อถือ

| ปัญหา | วิธีแก้ |
|---|---|
| ช้า | แคช dependency · รัน test พร้อมกันหลายชุด · แยก test ที่ช้าไปรันกลางคืน |
| test ที่ผลไม่คงที่ (flaky) | **แยกออกทันที** แล้วเปิดงานตามแก้ เพราะ test ที่ตกบ้างผ่านบ้างทำให้คนเลิกอ่านผล |
| ทุกคนรอคิว | เพิ่มตัวรัน · ให้ pull request รันเฉพาะส่วนที่เกี่ยวข้อง |
| build ไม่เหมือนเดิมทุกครั้ง | ล็อกเวอร์ชัน dependency (lock file) · ปักหมุดเวอร์ชัน image ด้วย digest |

**ตัวชี้วัดที่ควรดู:** ปล่อยของบ่อยแค่ไหน · จาก commit ถึงขึ้นจริงใช้เวลาเท่าไร ·
deploy แล้วพังกี่เปอร์เซ็นต์ · กู้คืนใช้เวลาเท่าไร

---

## แอป Android / Flutter — ข้อที่ต่างจากเซิร์ฟเวอร์

| เรื่อง | กฎ |
|---|---|
| เลขเวอร์ชัน | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` ตาม SemVer · **`N` คือ versionCode เป็นจำนวนเต็มที่ขึ้นอย่างเดียว** (เช่นเลขรอบของ CI) · commit hash ส่งผ่าน `--dart-define=GIT_SHA=<hash>` แล้วแสดงในหน้า "เกี่ยวกับ" |
| build ครั้งเดียว | `flutter build appbundle --release` ได้ AAB ไฟล์เดียว แล้วเลื่อนไฟล์เดิมผ่าน track ของ Play: internal → closed → production · ไม่ build ใหม่ต่อ track |
| ปล่อยทีละส่วน | production ใช้ staged rollout เป็น % (เช่น 5 → 20 → 50 → 100) แทน canary ของเซิร์ฟเวอร์ · track ของ Play แทน environment ในข้อ 5 |
| rollback | **ย้อนเวอร์ชันบน Play ไม่ได้** เพราะ versionCode ลดไม่ได้ และเครื่องที่ติดตั้งแล้วไม่ถอยกลับ ให้หยุด rollout (halt) แล้วปล่อยตัวแก้ที่ versionCode สูงกว่า และซ้อมขั้นตอนนี้แทนข้อ 9 |
| กุญแจเซ็น | upload key เก็บใน secret store ของ CI เป็น base64 + รหัสผ่านแยกเป็น secret · `android/key.properties` และ `*.jks` อยู่ใน `.gitignore` · **สำรองกุญแจไว้นอก CI อย่างน้อย 1 ที่** ถ้าทำหายจะอัปเดตแอปไม่ได้จนกว่าจะขอ Play support รีเซ็ต (ใช้ Play App Signing ให้ Google ถือกุญแจจริง) |

---

## 11 · Anti-patterns

- ❌ **build ใหม่ตอนขึ้น production** ทำให้ของที่ทดสอบไม่ใช่ของที่ปล่อย
- ❌ **deploy ด้วยมือตามขั้นตอนใน Word** · วันไหนคนเขียนลาป่วย วันนั้น deploy ไม่ได้
- ❌ **secret ในไฟล์ pipeline** · ใครอ่านโค้ดได้ก็อ่าน secret ได้
- ❌ **test ตกแล้วปล่อยผ่าน** ทำครั้งเดียว คนก็เลิกเชื่อผลไปตลอด
- ❌ **deploy วันศุกร์เย็น** ในทีมที่ยัง rollback ไม่ได้ด้วยคำสั่งเดียว
- ❌ **migration ของฐานข้อมูลบนเซิร์ฟเวอร์รันตอนแอปบูต** · หลาย instance ชนกัน (ฐานข้อมูลในเครื่องมือถือยกเว้น ดูข้อ 7)
- ❌ **ไม่มี artifact เก็บไว้** ทำให้ rollback กลายเป็นการ build ย้อนจาก commit เก่า
- ❌ **environment ที่ config ต่างกันจนคาดเดาไม่ได้** · "บน staging ผ่านนะ"
- ❌ **feature flag ที่ไม่มีวันลบ**
- ❌ **pipeline ใช้เวลา 45 นาที** คนจะเริ่ม merge โดยไม่รอผล

---

## 12 · ตัวย่อ

- **CI** — Continuous Integration (รวมโค้ดเข้าด้วยกันบ่อย ๆ พร้อมตรวจอัตโนมัติทุกครั้ง)
- **CD** — Continuous Delivery/Deployment (พาโค้ดที่ผ่านการตรวจไปถึงผู้ใช้อัตโนมัติ)
- **SemVer** — Semantic Versioning (มาตรฐานเลขเวอร์ชัน MAJOR.MINOR.PATCH)
- **artifact** — ไฟล์ผลลัพธ์จากการ build ที่นำไป deploy ได้จริง
- **canary** — การปล่อยของใหม่ให้ผู้ใช้ส่วนน้อยก่อนเพื่อดูอาการ
- **UAT** — User Acceptance Testing (การทดสอบโดยผู้ใช้ก่อนรับมอบ)
- **AAB** — Android App Bundle (ไฟล์ที่อัปโหลดขึ้น Google Play แล้ว Play แตกเป็น APK ตามเครื่อง)
- **versionCode** — เลขจำนวนเต็มที่ Android ใช้ตัดสินว่าเวอร์ชันไหนใหม่กว่า

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| secret และ config ต่อ environment | `config-and-secrets` |
| migration ที่ deploy ได้โดยไม่ปิดระบบ | `database-design` |
| สัดส่วน test แต่ละชั้นใน pipeline | `testing-standards` · `e2e-testing-patterns` |
| health check ที่ pipeline ใช้ตัดสิน | `web-service-essentials` |
| ขั้นตอนเมื่อ deploy แล้วล่ม | `incident-runbook-template` · `postmortem-template` |
| ข้อความ commit ที่สร้างบันทึกการปล่อยอัตโนมัติได้ | `commit-message-format` |

**ไฟล์ pipeline ที่ใช้ได้จริงของ GitHub Actions, Azure DevOps และ GitLab** อยู่ใน `references/per-platform.md`


## reference: per-platform.md

# ไฟล์ pipeline ตั้งต้น แยกตามแพลตฟอร์ม

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Dockerfile หลายขั้น](#4--dockerfile-หลายขั้น)
5. [ตารางเทียบความสามารถ](#5--ตารางเทียบความสามารถ)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` รันทุก pull request

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:                       # ยกเลิกรอบเก่าเมื่อ push ซ้ำ
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }   # ต้องมีประวัติครบเพื่อคำนวณเวอร์ชัน

      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --coverage

      - name: ตรวจ dependency
        run: npm audit --audit-level=high

      - uses: actions/upload-artifact@v4
        with:
          name: app-${{ github.sha }}
          path: dist/
          retention-days: 30
```

`.github/workflows/deploy.yml` เอา artifact ตัวเดิมจาก ci ไป deploy ต่อทีละ environment

```yaml
name: deploy
on:
  workflow_run:
    workflows: [ci]
    types: [completed]
    branches: [main]

jobs:
  staging:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production        # ← ตั้ง required reviewers ที่นี่ = ด่านคน
    steps:
      - run: ./scripts/deploy.sh production
      - name: ตรวจหลัง deploy
        run: |
          for i in $(seq 1 10); do
            curl -fsS https://api.example.co/health/ready && exit 0
            sleep 6
          done
          ./scripts/rollback.sh && exit 1
```

**ข้อควรระวัง:**

- `pull_request_target` เห็น secret และรันโค้ดจาก fork จึง**อย่าใช้** เว้นแต่รู้จริงว่ากำลังทำอะไร
- ตั้ง `permissions` ให้แคบที่สุดในทุก workflow เพราะบางองค์กรตั้งค่าเริ่มต้นให้เขียนได้ทั้ง repo
- ปักหมุด action อย่างน้อยด้วย tag เวอร์ชัน (`@v4`) ถ้าต้องการเข้มงวดให้ปักด้วย commit hash
- `environment:` คือที่ตั้งผู้อนุมัติ (required reviewers) และ secret เฉพาะ environment

---

## 2 · Azure DevOps

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [main] }

variables:
  buildConfiguration: Release

stages:
- stage: build
  jobs:
  - job: build
    pool: { vmImage: ubuntu-latest }
    steps:
    - task: UseDotNet@2
      inputs: { version: '8.x' }
    - script: dotnet restore
    - script: dotnet build -c $(buildConfiguration) --no-restore
    - script: dotnet test -c $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
    - script: dotnet publish -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory) --no-build
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: app

- stage: staging
  dependsOn: build
  jobs:
  - deployment: staging
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app
          - script: ./scripts/deploy.sh staging

- stage: production
  dependsOn: staging
  jobs:
  - deployment: production
    environment: production        # ← ตั้ง approval ที่หน้า Environments
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app          # artifact ตัวเดิมจาก stage build
          - script: ./scripts/deploy.sh production
```

- `deployment` job ต่างจาก `job` ธรรมดาตรงที่ผูกกับ environment จึงได้ประวัติการ deploy และขั้นอนุมัติมาด้วย
- ตัวแปรลับเก็บใน variable group ที่ผูกกับ Azure Key Vault อย่าพิมพ์ลงไฟล์
- ตัวแปรลับ**ไม่ถูกส่งเข้า script เอง** ต้อง map ผ่าน `env:` ทีละตัว

---

## 3 · GitLab CI

`.gitlab-ci.yml`

```yaml
stages: [test, build, deploy]

default:
  interruptible: true

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  key: { files: [requirements.txt] }
  paths: [.cache/pip]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - ruff check .
    - pytest --cov --cov-fail-under=70
  coverage: '/TOTAL.*\s+(\d+%)$/'

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:staging:
  stage: deploy
  environment: { name: staging, url: https://staging.example.co }
  script: ./scripts/deploy.sh staging $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  environment: { name: production, url: https://example.co }
  when: manual                     # ← ด่านคน
  script: ./scripts/deploy.sh production $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

- ตั้งตัวแปรลับเป็น `Masked` และ `Protected` ที่หน้า Settings → CI/CD
- `when: manual` ใช้คู่กับ protected environment จึงจะเป็นด่านอนุมัติที่กันได้จริง

---

## 4 · Dockerfile หลายขั้น

```dockerfile
# ---- ขั้น build ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci                      # ชั้นนี้ถูกแคชตราบใดที่ lock file ไม่เปลี่ยน
COPY . .
RUN npm run build

# ---- ขั้นรัน ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
USER node                       # ❌ อย่ารันเป็น root
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js
CMD ["node", "dist/main.js"]
```

**กฎ:**

- คัดลอกไฟล์ที่เปลี่ยนน้อยก่อน ชั้นแรก ๆ จะได้ใช้แคชซ้ำ
- อย่าคัดลอก `.env`, `.git`, `node_modules` เข้า image ให้กันไว้ด้วย `.dockerignore`
- ถ้าต้องการให้ build ได้ผลเดิมทุกครั้ง ให้ปักหมุด base image ด้วย digest
- ตั้งชื่อ tag ด้วย commit hash เสมอ ส่วน `latest` ใช้เป็นชื่อเล่นได้ แต่ห้าม deploy ด้วย `latest`

---

## 5 · ตารางเทียบความสามารถ

| สิ่งที่ต้องการ | GitHub Actions | Azure DevOps | GitLab CI |
|---|---|---|---|
| ด่านอนุมัติโดยคน | Environment + required reviewers | Environment approvals | `when: manual` + protected env |
| เก็บ artifact | `upload/download-artifact` | `publish` / `download` | `artifacts:` |
| แคช dependency | `actions/cache` หรือ `cache:` ใน setup | `Cache@2` | `cache:` |
| secret ต่อ environment | Environment secrets | Variable group + Key Vault | ตัวแปร Protected ต่อ environment |
| ยกเลิกรอบเก่า | `concurrency` | `batch: true` | `interruptible: true` |
| วิ่งขนาน | `strategy.matrix` | `strategy.matrix` | `parallel:` |
| รันเอง (self-hosted) | ได้ | ได้ | ได้ |

> **ทุกแพลตฟอร์มทำสิ่งเดียวกันได้** จึงอย่าเลือกจากรายการความสามารถ
> เลือกตัวที่อยู่ที่เดียวกับ repo แล้วลงแรงกับเนื้อหาของ pipeline แทน
