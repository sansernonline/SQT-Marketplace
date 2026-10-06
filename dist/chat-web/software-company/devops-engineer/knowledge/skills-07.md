# skill: cicd-and-release

Use when setting up or fixing a build and deploy pipeline or deciding how a project ships. Stages and gates, build once and promote, traceable versions, environments, release patterns, flags, rehearsed rollback.

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
- `/version` endpoint ต้องคืนค่าเดียวกันนี้ (ดู `web-service-essentials`) · แอปมือถือไม่มี endpoint ให้แสดงในหน้า "เกี่ยวกับ" แทน
- **ยกเว้น Flutter / Android** — `+` ใน `pubspec.yaml` คือ versionCode ต้องเป็นจำนวนเต็ม ใส่ hash ไม่ได้ ดูหัวข้อ "แอป Android / Flutter"
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
- **ข้อยกเว้น: ฐานข้อมูลในเครื่องผู้ใช้** (SQLite · sqflite · drift บนมือถือ) migrate ตอนแอปเปิดเป็นทางเดียวที่มี —
  กฎข้างบนใช้กับฐานข้อมูลบนเซิร์ฟเวอร์ที่หลาย instance ใช้ร่วมกัน · migration ในเครื่องต้องมี test ไล่จากทุกเวอร์ชัน schema ที่เคยปล่อย

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

## แอป Android / Flutter — ข้อที่ต่างจากเซิร์ฟเวอร์

| เรื่อง | กฎ |
|---|---|
| เลขเวอร์ชัน | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` ตาม SemVer · **`N` คือ versionCode เป็นจำนวนเต็มที่ขึ้นอย่างเดียว** (เช่นเลขรอบของ CI) · commit hash ส่งผ่าน `--dart-define=GIT_SHA=<hash>` แล้วแสดงในหน้า "เกี่ยวกับ" |
| build ครั้งเดียว | `flutter build appbundle --release` ได้ AAB ไฟล์เดียว แล้วเลื่อนไฟล์เดิมผ่าน track ของ Play: internal → closed → production · ไม่ build ใหม่ต่อ track |
| ปล่อยทีละส่วน | production ใช้ staged rollout เป็น % (เช่น 5 → 20 → 50 → 100) แทน canary ของเซิร์ฟเวอร์ · track ของ Play แทน environment ในข้อ 5 |
| rollback | **ย้อนเวอร์ชันบน Play ไม่ได้** — versionCode ลดไม่ได้และเครื่องที่ติดตั้งแล้วไม่ถอยกลับ · ให้หยุด rollout (halt) แล้วปล่อยตัวแก้ที่ versionCode สูงกว่า · ซ้อมขั้นตอนนี้แทนข้อ 9 |
| กุญแจเซ็น | upload key เก็บใน secret store ของ CI เป็น base64 + รหัสผ่านแยกเป็น secret · `android/key.properties` และ `*.jks` อยู่ใน `.gitignore` · **สำรองกุญแจไว้นอก CI อย่างน้อยหนึ่งที่** — ทำหาย = อัปเดตแอปไม่ได้จนกว่าจะขอ Play support รีเซ็ต (ใช้ Play App Signing ให้ Google ถือกุญแจจริง) |

---

## 11 · Anti-patterns

- ❌ **build ใหม่ตอนขึ้น production** — ของที่ทดสอบไม่ใช่ของที่ปล่อย
- ❌ **deploy ด้วยมือตามขั้นตอนใน Word** — วันที่คนเขียนลาป่วยคือวันที่ deploy ไม่ได้
- ❌ **secret ในไฟล์ pipeline** — ใครอ่านโค้ดได้ก็อ่าน secret ได้
- ❌ **test ที่ตกแล้วปล่อยผ่าน** — ทำครั้งเดียวก็เลิกเชื่อผลไปตลอด
- ❌ **deploy วันศุกร์เย็น** ในทีมที่ยัง rollback ไม่ได้ด้วยคำสั่งเดียว
- ❌ **migration ของฐานข้อมูลบนเซิร์ฟเวอร์รันตอนแอปบูต** — หลาย instance ชนกัน (ฐานข้อมูลในเครื่องมือถือยกเว้น ดูข้อ 7)
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

**ไฟล์ pipeline ที่ใช้ได้จริงของ GitHub Actions, Azure DevOps และ GitLab** → `references/per-platform.md`


## reference: per-platform.md

# ไฟล์ pipeline ตั้งต้น แยกตามแพลตฟอร์ม

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Dockerfile หลายขั้น](#4--dockerfile-หลายขั้น)
5. [ตารางเทียบความสามารถ](#5--ตารางเทียบความสามารถ)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` — วิ่งกับทุก pull request

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

`.github/workflows/deploy.yml` — เลื่อนขั้น artifact ตัวเดิม

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

- `pull_request_target` เห็น secret และรันโค้ดจาก fork — **อย่าใช้** เว้นแต่รู้จริงว่ากำลังทำอะไร
- ตั้ง `permissions` ให้แคบที่สุดในทุก workflow ค่าเริ่มต้นของบางองค์กรคือเขียนได้ทั้ง repo
- ปักหมุด action ด้วย tag เวอร์ชัน (`@v4`) อย่างน้อย · ถ้าเข้มงวดให้ปักด้วย commit hash
- `environment:` คือที่ตั้ง required reviewers และ secret เฉพาะ environment

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

- `deployment` job ต่างจาก `job` ธรรมดาตรงที่ผูกกับ environment จึงมีประวัติและ approval ให้
- ตัวแปรลับเก็บใน variable group ที่ผูกกับ Azure Key Vault อย่าพิมพ์ลงไฟล์
- ตัวแปรลับ**ไม่ถูกส่งเข้า script โดยอัตโนมัติ** ต้อง map ผ่าน `env:` ทีละตัว

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
- `when: manual` คู่กับ protected environment คือด่านอนุมัติที่ใช้ได้จริง

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

- คัดลอกไฟล์ที่เปลี่ยนน้อยก่อน เพื่อให้ชั้นแคชได้ผล
- อย่าคัดลอก `.env`, `.git`, `node_modules` เข้า image — ใช้ `.dockerignore`
- ปักหมุด base image ด้วย digest ถ้าต้องการให้ build ได้ผลเดิมทุกครั้ง
- ตั้งชื่อ tag ด้วย commit hash เสมอ · `latest` ใช้เป็นชื่อเล่นได้ แต่ห้าม deploy ด้วย `latest`

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

> **ทุกแพลตฟอร์มทำสิ่งเดียวกันได้** — อย่าเลือกด้วยรายการความสามารถ
> เลือกตัวที่อยู่ที่เดียวกับ repo แล้วลงแรงกับเนื้อหาของ pipeline แทน


---

# skill: config-and-secrets

Use when settings differ between environments or something must never be committed (connection strings, keys, certificates). Config vs secrets, start-up validation, naming, secret store, rotation, leaked-credential steps.

# Config และ Secret

> **กฎสองข้อ:**
> 1. โค้ดชุดเดียวกันต้องรันได้ทุก environment — ความต่างอยู่ที่ config เท่านั้น
> 2. secret ไม่เคยอยู่ใน git · ไม่เคยอยู่ใน log · ไม่เคยอยู่ในไฟล์ที่ส่งไปให้เบราว์เซอร์

## เมื่อไหร่ใช้ skill นี้

- เริ่มโปรเจกต์ หรือเพิ่ม environment ใหม่
- ต้องเก็บ connection string, API key, ใบรับรอง, กุญแจสำหรับเซ็น
- เจอค่าคงที่ฝังอยู่ในโค้ด (hardcode) แล้วต้องย้ายออก
- secret หลุดเข้า git หรือสงสัยว่าหลุด → ข้อ 8 ทันที

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| เก็บ secret ใน pipeline · ด่านอนุมัติ | `cicd-and-release` |
| ออกแบบ login, token, สิทธิ์ผู้ใช้ | `auth-implementation-patterns` |
| กันไม่ให้ค่าอ่อนไหวโผล่ใน log | `logging-standards` |

---

## 1 · แยก config กับ secret ให้ออกก่อน

| | config | secret |
|---|---|---|
| ตัวอย่าง | ที่อยู่ API, ระดับ log, จำนวนต่อหน้า, โซนเวลา, feature flag | รหัสผ่านฐานข้อมูล, API key, กุญแจเซ็น token, ใบรับรอง |
| อยู่ใน git ได้ | ✅ ได้ | ❌ ไม่ได้เด็ดขาด |
| ใครเห็นได้ | ทั้งทีม | เฉพาะที่จำเป็น |
| หลุดแล้วเป็นไร | ไม่เป็นไร | ต้องเพิกถอนและเปลี่ยนทันที |
| เปลี่ยนบ่อย | ตามงาน | ตามรอบหมุนเวียน |

> **ถ้าตัดสินใจไม่ได้ว่าอันไหน ให้ถือว่าเป็น secret** — ต้นทุนของการระวังเกินไปคือความรำคาญเล็กน้อย
> ต้นทุนของการเดาผิดคือการที่กุญแจอยู่ในประวัติ git ตลอดไป

---

## 2 · ลำดับความสำคัญ — ค่าหลังทับค่าก่อน

```
1. ค่าเริ่มต้นในโค้ด        (ปลอดภัย ใช้ได้จริงสำหรับ dev)
2. ไฟล์ config ตาม environment  (appsettings.Production.json, config/production.yaml)
3. ตัวแปรสภาพแวดล้อม        (environment variable)
4. secret store              (Key Vault, Secrets Manager, Kubernetes secret)
5. อาร์กิวเมนต์ตอนสั่งรัน     (ใช้ตอนไล่ปัญหาเท่านั้น)
```

**ค่าเริ่มต้นต้องปลอดภัย** — ถ้าลืมตั้งค่า ระบบต้องทำงานในแบบที่เข้มงวดที่สุด
`DEBUG=false` · `ALLOWED_ORIGINS=` ว่าง · เปิด TLS ไม่ใช่ตรงกันข้าม

---

## 3 · ตรวจตอนบูต — ขาดค่าไหนให้ตายทันที

> 🚨 นี่คือข้อที่ให้ผลตอบแทนสูงที่สุดในหน้านี้
> ระบบที่บูตขึ้นมาได้ทั้งที่ config ผิด จะไปพังตอนตีสองที่ฟังก์ชันซึ่งนาน ๆ ใช้ที
> ระบบที่ **ไม่ยอมบูต** เมื่อ config ผิด ทำให้รู้ตอน deploy ซึ่งยัง rollback ได้

```ts
// Node — zod
const Env = z.object({
  NODE_ENV:      z.enum(['development', 'staging', 'production']),
  PORT:          z.coerce.number().int().positive().default(3000),
  DATABASE_URL:  z.string().url(),
  JWT_SECRET:    z.string().min(32),
  LOG_LEVEL:     z.enum(['debug','info','warn','error']).default('info'),
});

export const env = Env.parse(process.env);   // ผิด = process ตายพร้อมบอกว่าตัวไหนผิด
```

**สิ่งที่ต้องตรวจ:** มีค่าครบ · ชนิดถูก · อยู่ในช่วงที่ยอมรับ ·
กุญแจยาวพอ · ค่าที่ห้ามใช้บน production (`JWT_SECRET=dev-secret` ต้องไม่ผ่าน)

**พิมพ์สรุป config ตอนบูต** — ชื่อค่าและค่าที่ไม่ใช่ secret
ส่วน secret ให้พิมพ์แค่ว่า "มีค่าแล้ว" หรือสี่ตัวท้าย ไม่ใช่ค่าเต็ม

---

## 4 · ตั้งชื่อตัวแปรสภาพแวดล้อม

```
<ระบบ>_<กลุ่ม>_<ชื่อ>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| กฎ | เหตุผล |
|---|---|
| ตัวพิมพ์ใหญ่ ขีดล่าง | ข้อตกลงของทุกระบบปฏิบัติการ |
| มีคำนำหน้าของระบบ | กัน `PATH`, `HOME`, `USER` ของระบบชนกัน |
| ชื่อเดียวกันทุก environment | ค่าต่างได้ ชื่อห้ามต่าง ไม่งั้นย้าย environment ทีต้องแก้โค้ด |
| ใส่หน่วยในชื่อ | `APP_TIMEOUT_SECONDS` ไม่ใช่ `APP_TIMEOUT` |
| อย่าใส่ชื่อ environment ในชื่อตัวแปร | ❌ `APP_PROD_DB_HOST` |

---

## 5 · `.env` และ `.env.example`

| ไฟล์ | อยู่ใน git | หน้าที่ |
|---|:--:|---|
| `.env.example` | ✅ | รายชื่อค่าที่ต้องมี **ทั้งหมด** พร้อมคำอธิบาย และค่าตัวอย่างที่ไม่ใช่ของจริง |
| `.env` | ❌ | ค่าจริงบนเครื่องนักพัฒนาแต่ละคน |
| `.env.production` | ❌ | **ไม่ควรมีไฟล์นี้เลย** — production ใช้ secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # ที่อยู่ฐานข้อมูล
APP_DB_PASSWORD=change-me          # ❗ ค่าจริงอยู่ใน 1Password ห้องทีม
APP_JWT_SECRET=                    # ❗ สร้างด้วย: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**`.env.example` ต้องอัปเดตในคอมมิตเดียวกับที่เพิ่มค่าใหม่**
ไม่งั้นคนถัดไปที่ clone จะเจอ error ที่ไม่มีใครอธิบายได้

> 🚨 **`.env` ที่ `.gitignore` ไม่ทัน** — ถ้าไฟล์ถูก track ไปแล้วครั้งหนึ่ง
> การเพิ่มใน `.gitignore` ทีหลัง**ไม่ลบมันออกจากประวัติ** ต้อง `git rm --cached` และถือว่า secret หลุดแล้ว

---

## 6 · เก็บ secret ไว้ที่ไหน

| สถานการณ์ | ใช้ | หมายเหตุ |
|---|---|---|
| เครื่องนักพัฒนา | `.env` ที่ไม่เข้า git · .NET ใช้ `dotnet user-secrets` | ห้ามใช้ค่าของ production |
| ทีมเล็ก แชร์กัน | ตัวจัดการรหัสผ่านของทีม (1Password, Bitwarden) | ไม่ใช่แชต ไม่ใช่อีเมล ไม่ใช่ Google Sheet |
| production บนคลาวด์ | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | ให้สิทธิ์ด้วย managed identity ไม่ใช่ key อีกอัน |
| Kubernetes | External Secrets Operator ดึงจาก vault ข้างบน | secret ของ Kubernetes เองเป็นแค่ base64 **ไม่ใช่การเข้ารหัส** |
| ต้องเก็บใน git จริง ๆ | SOPS หรือ sealed-secrets (เข้ารหัสก่อน commit) | ทางเลือกสุดท้าย |

**สิทธิ์:** แต่ละ service อ่านได้เฉพาะ secret ของตัวเอง · environment แยกกันสนิท ·
ไม่มีบัญชีไหนอ่านได้ทุกอัน นอกจากบัญชีดูแลระบบที่มีการบันทึกการเข้าถึง

---

## 7 · การหมุนเวียน (rotation)

**ออกแบบให้รองรับตั้งแต่วันแรก** — ไม่ใช่ตอนที่ต้องหมุนจริง

| ต้องมี | รายละเอียด |
|---|---|
| ใช้สองค่าพร้อมกันได้ | ระหว่างเปลี่ยน ทั้งค่าเก่าและใหม่ต้องใช้ได้ ไม่งั้นต้องปิดระบบ |
| โหลดใหม่โดยไม่ต้อง restart | หรือยอมรับว่าต้อง deploy รอบหนึ่ง และเขียนไว้ว่าต้องทำ |
| รอบเวลา | กุญแจเซ็น token 90 วัน · รหัสฐานข้อมูล 180 วัน · ใบรับรองก่อนหมดอายุ 30 วัน |
| ทำอัตโนมัติ | งานที่ต้องจำเองคืองานที่ไม่มีใครทำ |

**กุญแจสำหรับเซ็น token ต้องมี id กำกับ (key id)** เพื่อให้ตรวจ token เก่าที่ยังไม่หมดอายุได้
ระหว่างที่ token ใหม่เซ็นด้วยกุญแจใหม่แล้ว

---

## 8 · เมื่อ secret หลุด — ลำดับสำคัญกว่าความเร็ว

1. **เพิกถอนค่าเดิมก่อน** — ปิดการใช้งาน key นั้นที่ต้นทาง
2. ออกค่าใหม่ แล้ว deploy
3. ตรวจ log ย้อนหลังว่ามีการใช้จากที่ไหนที่ไม่ใช่ของเรา
4. ลบออกจากประวัติ git (`git filter-repo`) และแจ้งทุกคนให้ clone ใหม่
5. บันทึกเหตุการณ์ → `postmortem-template`

> 🚨 **ข้อ 4 ไม่ใช่ข้อ 1** — การลบ commit ไม่ได้ทำให้กุญแจปลอดภัยขึ้นเลย
> ใครก็ตามที่ fork หรือ clone ไปแล้ว รวมถึงตัวสำรองของผู้ให้บริการ ยังมีค่าเดิมอยู่
> **ถือว่าทุก secret ที่เคยเข้า git คือหลุดแล้ว** แม้ repo จะเป็น private

---

## 9 · อย่าให้ secret ไหลออกทางอื่น

| ทางรั่ว | วิธีปิด |
|---|---|
| log | รายการคำที่ต้องปิดบัง → `logging-standards` |
| ข้อความ error ที่ส่งให้ client | คืนเฉพาะ `traceId` ไม่ใช่ stack trace หรือ connection string |
| รายงาน crash / ตัวติดตามข้อผิดพลาด | ตั้งตัวกรองข้อมูลอ่อนไหวก่อนส่งออก |
| ประวัติคำสั่งใน shell | ใช้ `read -s` หรืออ่านจากไฟล์ แทนการพิมพ์ค่าลงบรรทัดคำสั่ง |
| `docker history` | อย่าใส่ secret ใน `ARG`/`ENV` ตอน build — ใช้ mount ตอนรัน |
| ไฟล์สำรองข้อมูลและ dump | เข้ารหัส และเก็บที่ที่คุมสิทธิ์ได้ |
| ภาพหน้าจอในเอกสารและ issue | ปิดบังก่อนแนบเสมอ |

---

## 10 · config ของ frontend — ไม่มีอะไรลับ

> 🚨 ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด **คือข้อมูลสาธารณะ**
> ไม่ว่าจะชื่อว่า `VITE_SECRET_KEY` หรืออยู่ในไฟล์ที่ถูกย่อจนอ่านไม่ออกก็ตาม
> การย่อโค้ดไม่ใช่การเข้ารหัส เปิด DevTools ก็เห็น

| ใส่ใน frontend ได้ | ต้องอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น |
|---|---|
| ที่อยู่ API · ชื่อ environment | API key ของบริการภายนอกทุกชนิด |
| กุญแจสาธารณะ (publishable key) ของผู้ให้บริการชำระเงิน | กุญแจลับ (secret key) ของผู้ให้บริการเดียวกัน |
| feature flag ที่ไม่ลับ | กฎการคิดราคา · เกณฑ์อนุมัติ |
| รหัสเว็บของตัววัดสถิติ | token ที่เรียก API ของบุคคลที่สาม |

**ต้องการเปลี่ยนค่าโดยไม่ build ใหม่** — ให้โหลด `/config.json` ตอนแอปเริ่มทำงาน
แทนการฝังค่าตอน build (`import.meta.env`) ซึ่งล็อกค่าติดไปกับไฟล์ที่ได้

---

## 11 · Anti-patterns

- ❌ **connection string ในโค้ด** แม้จะเป็นของ dev — วันหนึ่งจะมีคนคัดลอกแบบแผนนี้ไปใช้กับ production
- ❌ **`.env` ของ production วางไว้บนเซิร์ฟเวอร์** — ใครเข้าเครื่องได้ก็อ่านได้ ไม่มีบันทึกว่าใครอ่าน
- ❌ **secret เดียวกันทุก environment** — staging หลุดเท่ากับ production หลุด
- ❌ **ส่ง secret ทางแชตหรืออีเมล** — อยู่ในนั้นตลอดไป และค้นเจอด้วย
- ❌ **ไม่มี `.env.example`** — คนใหม่เสียเวลาครึ่งวันเดาว่าต้องมีค่าอะไรบ้าง
- ❌ **บูตผ่านทั้งที่ config ไม่ครบ** แล้วไปพังตอนใช้งานจริง
- ❌ **พิมพ์ config ทั้งก้อนลง log ตอนบูต** รวม secret
- ❌ **`ALLOWED_ORIGINS=*` บน production** เพราะ "ตอน dev มันติด CORS"
- ❌ **กุญแจที่ไม่เคยเปลี่ยนเลยตั้งแต่ปีแรก**

---

## 12 · ตัวย่อ

- **config** — configuration (ค่าตั้งที่ต่างกันได้ตามสภาพแวดล้อม)
- **secret** — ค่าอ่อนไหวที่ห้ามเปิดเผย เช่น รหัสผ่านหรือกุญแจ
- **environment variable** — ตัวแปรสภาพแวดล้อม ค่าที่ระบบปฏิบัติการส่งให้โปรแกรมตอนรัน
- **vault** — ที่เก็บ secret ที่เข้ารหัสและคุมสิทธิ์ได้
- **rotation** — การหมุนเวียนเปลี่ยนกุญแจตามรอบเวลา
- **TLS** — Transport Layer Security (การเข้ารหัสระหว่างทางของ HTTPS)
- **CORS** — Cross-Origin Resource Sharing (กฎที่เบราว์เซอร์ใช้ตัดสินว่าเว็บหนึ่งเรียก API ของอีกที่ได้ไหม)

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| secret ในขั้นตอน build และ deploy | `cicd-and-release` |
| ปิดบังค่าอ่อนไหวใน log | `logging-standards` |
| กุญแจเซ็น token · อายุ session | `auth-implementation-patterns` |
| connection string ของฐานข้อมูล | `database-design` |
| บันทึกเหตุการณ์หลัง secret หลุด | `postmortem-template` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |

**วิธีทำจริงในแต่ละภาษาและเฟรมเวิร์ก** → `references/per-stack.md`


## reference: per-stack.md

# วิธีทำจริงแยกตามภาษาและเฟรมเวิร์ก

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular และ frontend ทั่วไป](#4--angular-และ-frontend-ทั่วไป)
5. [Docker และ Kubernetes](#5--docker-และ-kubernetes)
6. [เครื่องมือตรวจ secret ที่หลุดเข้า git](#6--เครื่องมือตรวจ-secret-ที่หลุดเข้า-git)
7. [คำสั่งสร้างค่าสุ่มที่ปลอดภัย](#7--คำสั่งสร้างค่าสุ่มที่ปลอดภัย)

---

## 1 · .NET / ASP.NET Core

**บนเครื่องนักพัฒนา — เก็บนอกโฟลเดอร์โปรเจกต์ จึงไม่มีทางเข้า git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**ตรวจตอนบูต:**

```csharp
public sealed class AppOptions
{
    public const string Section = "App";

    [Required, Url]                       public string ApiBaseUrl { get; init; } = "";
    [Required, MinLength(32)]             public string JwtSecret  { get; init; } = "";
    [Range(1, 300)]                       public int TimeoutSeconds { get; init; } = 30;
}

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection(AppOptions.Section))
    .ValidateDataAnnotations()
    .ValidateOnStart();                   // ← ขาดค่า = แอปไม่ยอมบูต
```

**ลำดับที่ ASP.NET Core อ่าน (ค่าหลังทับค่าก่อน):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

ตัวแปรสภาพแวดล้อมใช้ `__` แทนลำดับชั้น — `ConnectionStrings__Default`

**Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());        // ใช้ managed identity ไม่ต้องมี key อีกอัน
```

---

## 2 · Node.js

```ts
// config/env.ts — ไฟล์เดียวที่แตะ process.env ได้ทั้งโปรเจกต์
import { z } from 'zod';

const Env = z.object({
  NODE_ENV:     z.enum(['development','test','staging','production']),
  PORT:         z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  SMTP_PASSWORD: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.JWT_SECRET.startsWith('dev-'))
    ctx.addIssue({ code: 'custom', message: 'ห้ามใช้ JWT_SECRET ของ dev บน production' });
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('config ไม่ถูกต้อง:', z.treeifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;
```

> **ห้ามอ่าน `process.env` กระจายทั่วโค้ด** — รวมไว้ที่ไฟล์เดียว
> ทำให้ตอบได้ว่าระบบใช้ค่าอะไรบ้าง โดยไม่ต้องไล่ grep ทั้งโปรเจกต์

Node 20 ขึ้นไปโหลด `.env` ได้เองด้วย `node --env-file=.env` ไม่ต้องพึ่ง `dotenv`

---

## 3 · Python

```python
# settings.py
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env")

    env: str = Field(pattern="^(development|staging|production)$")
    database_url: PostgresDsn
    jwt_secret: str = Field(min_length=32)
    timeout_seconds: int = Field(default=30, ge=1, le=300)

settings = Settings()      # ขาดค่า = ValidationError ตั้งแต่ import
```

- อ่าน `APP_DATABASE_URL`, `APP_JWT_SECRET` ตาม `env_prefix`
- import ที่ระดับบนสุดของแอป เพื่อให้ error เกิดตอนบูต ไม่ใช่ตอนเรียกใช้ครั้งแรก

---

## 4 · Angular และ frontend ทั่วไป

> 🚨 **ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด คือสาธารณะ** — ไม่มีข้อยกเว้น

**แบบฝังตอน build** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`) —
ค่าติดไปกับไฟล์ที่ได้ เปลี่ยนต้อง build ใหม่ จึงขัดกับกฎ build ครั้งเดียว

**แบบโหลดตอนรัน (แนะนำ):**

```ts
// main.ts — โหลดก่อนแอปเริ่ม
fetch('/config.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(cfg => {
    (window as any).__APP_CONFIG__ = cfg;
    return bootstrapApplication(AppComponent, appConfig);
  });
```

```json
// config.json — ไฟล์นี้วางแยกต่อ environment ไม่ต้อง build ใหม่
{ "apiBaseUrl": "https://api.example.co", "env": "production", "sentryDsn": "..." }
```

ตั้ง header `Cache-Control: no-store` ให้ `/config.json` ไม่งั้นเบราว์เซอร์จะใช้ค่าเก่า

---

## 5 · Docker และ Kubernetes

**Docker — อย่าใส่ secret ตอน build:**

```dockerfile
# ❌ ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ✅ mount เฉพาะตอนใช้ ไม่ติดไปกับ image
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker run --env-file .env myapp        # ตอนรัน ส่งค่าเข้าไป
```

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> 🚨 **Secret ของ Kubernetes เป็นแค่ base64 ไม่ใช่การเข้ารหัส**
> ใครมีสิทธิ์ `get secret` ก็อ่านค่าได้ตรง ๆ
> ต้องเปิด encryption at rest ที่ etcd และคุมสิทธิ์ด้วย RBAC
> ทางที่ดีกว่าคือให้ External Secrets Operator ดึงจาก Key Vault / Secrets Manager มาสร้างให้

---

## 6 · เครื่องมือตรวจ secret ที่หลุดเข้า git

```bash
# ตรวจทั้งประวัติ
gitleaks detect --source . --redact

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks: [{ id: gitleaks }]
```

**ลบออกจากประวัติ** (ทำหลังเพิกถอนค่าเดิมแล้วเท่านั้น):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force --all      # ทุกคนต้อง clone ใหม่
```

---

## 7 · คำสั่งสร้างค่าสุ่มที่ปลอดภัย

```bash
openssl rand -base64 48                 # กุญแจทั่วไป
openssl rand -hex 32                    # กุญแจ 256 บิตเป็นเลขฐานสิบหก
uuidgen                                 # id ไม่ลับ

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

```powershell
# Windows
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
```

> ❌ **อย่าใช้ตัวสุ่มทั่วไป** (`Math.random`, `random.random`, `Random` ของ .NET)
> มันคาดเดาได้ ต้องใช้ตัวสุ่มเชิงรหัสลับตามคำสั่งข้างบน


---

# skill: flag-and-propose

Use when something found mid-task changes what happens next (stale file, mismatched number, blocked step, risk) and a decision is needed. Lead with the consequence, show recorded vs actual, end with one short question.

# แจ้งสิ่งที่เจอ แล้วเสนอทางไป

> **กฎข้อเดียว:** เปิดด้วย**ผลกระทบ** ปิดด้วย**คำถามเดียว**
> ตรงกลางคือหลักฐานกับข้อเสนอ ไม่ใช่การเล่าว่าเจอมาได้ยังไง

## เมื่อไหร่ใช้ skill นี้

- เจอของที่ทำให้แผนเดิมใช้ไม่ได้ ระหว่างทำงานอย่างอื่นอยู่
- ตัวเลข ไฟล์ หรือเอกสารไม่ตรงกัน แล้วต้องรู้ว่าจะยึดอันไหน
- มีทางไปต่อหลายทาง และต้องให้ผู้ใช้เลือกก่อนถึงจะทำต่อได้
- เสนอให้เพิ่มหรือเปลี่ยนอะไรบางอย่าง ที่ผู้ใช้ยังไม่ได้ขอ

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้ตัวนี้แทน |
|---|---|
| ตอบคำถามที่ผู้ใช้ถามมา | `answer-shape` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| อธิบายเรื่องซับซ้อนให้เข้าใจ | `anthropic-skills:direct-answers` |
| เขียนเป็นเอกสารให้คนอื่นอ่าน | `polished-document-style` |
| งานพังจริงและต้องแก้ทันที | `targeted-fix` — แก้ก่อน แล้วค่อยรายงาน |

---

## 1 · โครงคำตอบ 4 บล็อก

| บล็อก | ความยาว | กฎ |
|---|---|---|
| 1 · สิ่งที่เจอ + ผลถ้าไม่แก้ | 1–2 บรรทัด | **ขึ้นก่อนเสมอ** ไม่มีคำเกริ่น ไม่ทวนคำถาม |
| 2 · หลักฐาน | ตาราง ≤ 5 แถว | ตัวเลขที่ขัดกันเท่านั้น ไม่ต้องเล่าวิธีตรวจ |
| 3 · ข้อเสนอ | ตาราง ≤ 5 แถว | ทำอะไร → **ได้อะไร** ไม่ใช่ทำอะไร → ทำยังไง |
| 4 · คำถามปิด | 1 บรรทัด | คำถามเดียว ตอบได้ด้วยไม่กี่คำ |

บล็อก 2 ตัดได้ถ้าไม่มีตัวเลข · บล็อก 3 ตัดได้ถ้ายังไม่มีข้อเสนอจริง ๆ
**บล็อก 1 กับ 4 ตัดไม่ได้**

**ทั้งคำตอบควรจบใน 1 หน้าจอ** — ยาวกว่านั้นแปลว่ากำลังอธิบายกระบวนการ ไม่ใช่ขอการตัดสินใจ

---

## 2 · บล็อกที่ 1 — สูตรประโยคเดียว

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| ❌ เขียนแบบเล่าเรื่อง | ✅ เขียนแบบขึ้นด้วยผลกระทบ |
|---|---|
| "ระหว่างตรวจผมพบว่าไฟล์ BUILD-PLAN.md ที่สร้างเมื่อเช้านี้นั้นได้อ่านข้อมูลมาจากโฟลเดอร์ extracted ซึ่งเป็นฉบับก่อนที่จะมีการแก้ไข…" | "**BUILD-PLAN.md ตัวเลขเก่า** เพราะอ่านจากไฟล์ฉบับก่อนแก้ ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันข้าม FR-14.x กับ PLT ทั้งชุด" |

- **"ไม่งั้น…" ต้องเป็นรูปธรรม** — "ข้าม FR-14.x ทั้งชุด" ไม่ใช่ "อาจมีปัญหาตามมา"
- ไม่ต้องบอกว่าเจอตอนไหนหรือเจอได้ยังไง เว้นแต่วิธีเจอจะเปลี่ยนสิ่งที่ต้องทำ
- ตัวหนาใช้กับ**คำที่เปลี่ยนการตัดสินใจ**เท่านั้น ไม่ใช่ทุกคำสำคัญ

---

## 3 · ตัวเลขที่ขัดกัน = ตารางเทียบเสมอ

สองค่าขึ้นไปที่ไม่ตรงกัน อ่านจากประโยคยากกว่าอ่านจากตารางทุกครั้ง

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| FR ถึง | 13.9 | **14.12** |
| Test case | 214 | **245** |
| PLT | ไม่มี | **มี** |
```

- หัวคอลัมน์บอกว่า**ค่าไหนเชื่อได้** — "ที่บันทึกไว้ / ของจริง" ไม่ใช่ "เก่า / ใหม่"
- ตัวหนาที่ฝั่งที่ถูกต้อง เพื่อให้กวาดตาแล้วรู้ทันทีว่าต้องยึดอะไร
- แถวที่ตรงกันอยู่แล้ว **ไม่ต้องใส่**

**คำถามหรือสมมติฐานเดิมที่ตกไปเพราะข้อมูลใหม่ ให้ตัดทิ้งในหนึ่งบรรทัด**
เช่น "คำถามข้อ 1 เรื่องเลขไม่ตรง — ตกไปเอง" แล้วไปต่อ อย่าอธิบายว่าทำไมถึงตก

---

## 4 · ข้อเสนอเป็นตาราง "ทำอะไร → ได้อะไร"

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
| ประวัติการแก้ไขในหน้าแรกของ docx | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- คอลัมน์ขวาคือ **ประโยชน์** ไม่ใช่ขั้นตอน — คนอ่านกำลังตัดสินใจว่าคุ้มไหม ไม่ได้กำลังลงมือทำ
- เรียงจากคุ้มที่สุดลงมา ไม่ใช่เรียงตามลำดับการทำ
- **ผูกข้อเสนอกับปัญหาที่เพิ่งเจอถ้าผูกได้** — เป็นเหตุผลที่หนักแน่นที่สุดที่มี
- เกิน 5 แถวเมื่อไหร่ แปลว่ากำลังเสนอหลายเรื่องปนกัน ให้แยกเป็นคนละรอบ

---

## 5 · บอกสิ่งที่**ไม่**ทำด้วย

หนึ่งบรรทัด พร้อมเหตุผลและเวลาที่ควรทำแทน

> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ

บรรทัดนี้กัน **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** ซึ่งเป็นคำถามที่ตามมาเกือบทุกครั้ง
และบอกกลาย ๆ ว่าคิดครบแล้ว ไม่ได้ลืม

---

## 6 · ปิดด้วยคำถามเดียว

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN
```

| กฎ | เหตุผล |
|---|---|
| **หนึ่งคำถาม** ต่อหนึ่งคำตอบ | สองคำถามขึ้นไป จะได้คำตอบแค่ข้อเดียว |
| ตอบได้ด้วยไม่กี่คำ | "ทั้ง 4" · "เริ่มข้อ 2" |
| มีตัวเลือก "เอาทั้งหมด" ให้ | ส่วนใหญ่ผู้ใช้เลือกอันนี้ ถ้าต้องพิมพ์เองจะเสียเวลา |
| ถ้ามีลำดับที่แนะนำ ใส่ไว้ในคำถามเลย | เขาจะได้ตอบว่า "ตามนั้น" คำเดียว |

**ห้ามปิดด้วยการถามว่า "มีอะไรให้ช่วยเพิ่มไหม"** — ไม่ใช่คำถามที่ขอการตัดสินใจ

---

## 7 · ตัวอย่างเต็ม

**❌ ก่อน — 1 ย่อหน้ายาว 3 ก้อน อ่านจบแล้วยังไม่รู้ว่าต้องตอบอะไร**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี PLT" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ PLT ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**✅ หลัง — โครงเดียวกัน 4 บล็อก**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ PLT ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | PLT | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/adr/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**สิ่งที่หายไป ทั้งที่ข้อมูลครบเท่าเดิม:** คำเกริ่น · การเล่าว่าตรวจเจอยังไง ·
ชื่อไฟล์เต็มที่ไม่ได้ช่วยตัดสินใจ · คำอธิบายว่าทำไมคำถามเดิมถึงตกไป ·
รายละเอียดวิธีทำของแต่ละข้อเสนอ

---

## 8 · Anti-patterns

- ❌ **เปิดด้วย "ระหว่างตรวจผมพบว่า…"** — ผู้อ่านต้องอ่านถึงท้ายย่อหน้าถึงจะรู้ว่าต้องทำอะไร
- ❌ **ตัวเลขที่ขัดกันเขียนเป็นประโยค** — "เดิม 214 ตอนนี้ 245" ตาต้องกระโดดไปมา
- ❌ **อธิบายว่าปัญหาเกิดได้ยังไง** ทั้งที่ไม่เปลี่ยนสิ่งที่ต้องทำ
- ❌ **ข้อเสนอที่บอกวิธีทำแทนที่จะบอกประโยชน์** — ยังตัดสินใจไม่ได้อยู่ดี
- ❌ **ถามสามคำถามในย่อหน้าเดียว** — จะได้คำตอบข้อเดียว แล้วต้องถามซ้ำ
- ❌ **ปิดด้วย "แจ้งได้เลยครับ"** — ไม่ได้ขอการตัดสินใจอะไร
- ❌ **ขอโทษยาว ๆ ที่พลาด** — บอกว่าอะไรผิดและแก้ยังไง พอแล้ว
- ❌ **รายงานอย่างเดียวโดยไม่เสนอ** — ผลักภาระคิดกลับไปให้ผู้ใช้ทั้งหมด

---

## 9 · ตัวย่อ

- **FR** — Functional Requirement (ข้อกำหนดเชิงหน้าที่)
- **TC** — Test Case (กรณีทดสอบ)
- **ADR** — Architecture Decision Record (บันทึกเหตุผลของการตัดสินใจเชิงสถาปัตยกรรม)

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกว่าจะตอบเป็นตาราง รูป หรือร้อยแก้ว | `answer-shape` |
| กางตัวย่อและศัพท์เฉพาะในคำตอบ | `spell-out-abbreviations` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| แก้ของที่พังทันทีแทนที่จะรายงาน | `targeted-fix` |
| สิ่งที่เจอใหญ่พอจะเป็นเอกสาร | `polished-document-style` |
| สิ่งที่เจอคือเหตุขัดข้องของระบบจริง | `incident-runbook-template` · `postmortem-template` |
