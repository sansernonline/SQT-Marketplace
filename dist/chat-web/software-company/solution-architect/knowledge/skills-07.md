# skill: cicd-and-release

Use when setting up or fixing a build and deploy pipeline, or deciding how a project ships. Covers pipeline stages and what each blocks on, build once and promote the same artifact, versions that trace back to a commit, branches, environments and gates, release patterns, feature flags and a rehearsed rollback. Ships starter pipelines.

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

# skill: flag-and-propose

Use when reporting something found mid-task that changes what happens next — a stale file, a number that no longer matches, a blocked step, a risk — and a decision is needed before carrying on. Opens with the consequence, puts conflicting numbers in a recorded-versus-actual table, and closes with one short question.

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


---

# skill: error-handling-patterns

Use when writing or reviewing code that can fail — anything calling a network, a database or another service. Decides where to catch and where to let through, separates the user message from the log detail, classifies failures into retry and do-not-retry, and sets timeout, backoff and circuit-breaker numbers.

# จัดการข้อผิดพลาด

> **กฎข้อเดียว:** จับ error เฉพาะตอนที่**ทำอะไรกับมันได้จริง**
> จับแล้วไม่ทำอะไร แย่กว่าไม่จับ เพราะระบบจะเดินต่อทั้งที่ข้างในพังไปแล้ว

## เมื่อไหร่ใช้ skill นี้

- เขียนโค้ดที่เรียกเครือข่าย ฐานข้อมูล ไฟล์ หรือระบบของทีมอื่น
- ต้องตัดสินใจว่าจะ retry ไหม กี่ครั้ง รอเท่าไหร่
- ผู้ใช้เจอข้อความว่า "เกิดข้อผิดพลาด" แล้วไม่รู้ต้องทำอะไรต่อ
- ไล่ปัญหาแล้วพบว่า log ไม่มีอะไรให้ดูเลย เพราะมีคน catch ทิ้ง

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปร่าง JSON ของ error ที่ API ส่งออก | `web-service-essentials` · `api-conventions` |
| รูปแบบบรรทัด log และการปิดบังข้อมูล | `logging-standards` |
| แก้บั๊กเฉพาะจุดที่มีคนแจ้งมา | `targeted-fix` |
| ขั้นตอนตอนระบบล่มจริง | `incident-runbook-template` |

---

## 1 · จับที่ไหน ปล่อยที่ไหน

| ชั้น | ทำอะไร |
|---|---|
| ชั้นในสุด (เรียก DB, HTTP, ไฟล์) | **ปล่อยผ่าน** หรือแปลงเป็น error ของโดเมนที่มีความหมาย |
| ชั้นตรรกะธุรกิจ | จับเฉพาะที่มีทางเลือกสำรองจริง ๆ (มีค่าเริ่มต้น มีแหล่งข้อมูลสำรอง) |
| **ชั้นนอกสุด** (controller, handler, main) | **จับทุกอย่าง** · log หนึ่งครั้ง · แปลงเป็นคำตอบที่ผู้ใช้เข้าใจ |

> **log ที่เดียว ที่ชั้นนอกสุด** — catch แล้ว log แล้ว throw ต่อทุกชั้น
> ทำให้ error หนึ่งตัวกลายเป็นสิบบรรทัดใน log แล้วไม่มีใครรู้ว่ามันคือเรื่องเดียวกัน

**สามอย่างที่ห้ามทำเด็ดขาด:**

```csharp
try { ... } catch { }                      // ❌ กลืนเงียบ
try { ... } catch (Exception) { return null; }   // ❌ ผู้เรียกเจอ null โดยไม่รู้ว่าเกิดอะไร
catch (Exception ex) { log.Error(ex); throw; }   // ❌ log ซ้ำทุกชั้น
```

**ถ้าตั้งใจจะกลืนจริง ๆ ต้องเขียนเหตุผลไว้:**

```csharp
catch (SmtpException ex)
{
    // ตั้งใจกลืน — ส่งอีเมลแจ้งไม่สำเร็จไม่ควรทำให้การสั่งซื้อล้ม
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · ข้อความถึงผู้ใช้ ≠ ข้อความใน log

| | ผู้ใช้เห็น | log เก็บ |
|---|---|---|
| เนื้อหา | เกิดอะไร · ต้องทำอะไรต่อ | stack trace · ค่าตัวแปร · id ของคำขอ |
| ภาษา | ภาษาของผู้ใช้ | อังกฤษก็ได้ |
| รายละเอียดภายใน | **ไม่มีเลย** | มีได้ |
| ตัวเชื่อมสองฝั่ง | **รหัสอ้างอิง** | รหัสเดียวกัน |

```
❌ "เกิดข้อผิดพลาด"                    ผู้ใช้ทำอะไรต่อไม่ได้
❌ "SqlException: timeout expired"      หลุดรายละเอียดภายใน และเขาก็อ่านไม่ออก
✅ "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
```

**ข้อความที่ดีมีสามส่วน** — เกิดอะไร · เพราะอะไร (ถ้าบอกได้) · ต้องทำอะไรต่อ
รหัสอ้างอิงคือ correlation id ตัวเดียวกับใน `logging-standards`

---

## 3 · แยกประเภทก่อนตัดสินใจ

| ประเภท | ตัวอย่าง | ทำยังไง | log ระดับ |
|---|---|---|---|
| **ผู้ใช้ทำผิด** | กรอกไม่ครบ ค่าผิดรูปแบบ | บอกให้แก้ · **ห้าม retry** | ไม่ต้อง log |
| **ชั่วคราว** | timeout · 503 · deadlock · เชื่อมต่อหลุด | **retry ได้** | warning |
| **ถาวร** | 404 · 401 · ข้อมูลไม่ตรงเงื่อนไข | ไม่ retry · บอกให้ชัด | warning |
| **บั๊กของเรา** | null reference · แปลงชนิดไม่ได้ | ไม่ retry · **ต้องมีคนแก้** | error |
| **ข้อมูลไม่สอดคล้อง** | ยอดไม่ตรง สถานะเป็นไปไม่ได้ | หยุด · **เรียกคน** | error + แจ้งเตือน |

> 🚨 **retry กับสิ่งที่ retry ไปก็ไม่หาย คือการยิงซ้ำให้ระบบที่ล้มอยู่แล้วล้มหนักขึ้น**
> `400` กับ `401` ยิงอีกร้อยครั้งก็ได้คำตอบเดิม

---

## 4 · timeout และการลองใหม่

**ทุกการเรียกออกนอก process ต้องมี timeout** — ค่าเริ่มต้นของไลบรารีส่วนใหญ่คือ "รอตลอดไป"

| การเรียก | timeout ที่ใช้ได้ทั่วไป |
|---|---|
| ฐานข้อมูล query ปกติ | 5–10 วินาที |
| HTTP ภายใน | 3–5 วินาที |
| HTTP ภายนอก | 10–30 วินาที |
| งานเบื้องหลังที่หนัก | ตั้งตามของจริง แล้วต้องตัดจบได้ |

**สูตรการลองใหม่:**

```
ลองไม่เกิน 3 ครั้ง · หน่วงแบบทวีคูณ + สุ่ม
ครั้งที่ 1 รอ 1 วินาที · ครั้งที่ 2 รอ 2 · ครั้งที่ 3 รอ 4  (แต่ละครั้ง ±20% แบบสุ่ม)
```

- **ต้องมีตัวสุ่ม** — ไม่งั้นทุก instance จะลองใหม่พร้อมกันเป๊ะ แล้วทับระบบปลายทางซ้ำ
- **เวลารวมของการลองใหม่ต้องน้อยกว่า timeout ของผู้เรียก** ไม่งั้นเขาเลิกรอไปแล้วแต่เรายังลองอยู่
- **retry การเขียนต้องมี idempotency key** ไม่งั้นลูกค้าถูกตัดเงินสองรอบ (ดู `api-conventions`)
- งานที่ผู้ใช้นั่งรออยู่หน้าจอ ลองแค่ครั้งเดียวพอ แล้วให้เขากดเอง

---

## 5 · ตัดวงจร (circuit breaker)

เมื่อปลายทางล้ม การยิงต่อไม่ได้ช่วยอะไร แค่ทำให้เราค้างตามไปด้วย

```
ปิด (ปกติ) → ล้มติดกัน N ครั้ง → เปิด (ไม่ยิงเลย ตอบ error ทันที)
           → รอ X วินาที → ลองครึ่งเดียว → สำเร็จก็กลับไปปิด · ล้มก็เปิดต่อ
```

ค่าเริ่มต้นที่ใช้ได้: ล้ม 5 ครั้งติดใน 30 วินาที → เปิด 60 วินาที

**ใส่เมื่อ** — เรียกระบบภายนอกที่เคยล่ม · เรียกข้ามหลาย service · ปลายทางช้าแล้วลามมาถึงเรา
**ไม่ต้องใส่เมื่อ** — เรียกฐานข้อมูลของตัวเอง · งานที่วิ่งครั้งเดียวต่อวัน

---

## 6 · ล้มบางส่วน

งานที่ทำหลายรายการ ต้องตอบให้ได้ว่า **"ทำได้ 8 จาก 10 แล้วอีก 2 ไปไหน"**

| แบบ | เหมาะกับ |
|---|---|
| ทั้งหมดหรือไม่ทำเลย (transaction) | เงิน · สต็อก · อะไรที่ครึ่ง ๆ แล้วพัง |
| ทำเท่าที่ได้ แล้วรายงานรายการที่ไม่ผ่าน | นำเข้าข้อมูล · ส่งแจ้งเตือนหลายคน |

แบบที่สองต้อง**คืนรายการที่ล้มพร้อมเหตุผลรายตัว** ไม่ใช่บอกว่า "บางรายการไม่สำเร็จ"

**งานทำความสะอาดต้องรันเสมอ** ไม่ว่าจะสำเร็จหรือไม่ — ปิดไฟล์ คืน connection ลบไฟล์ชั่วคราว
ใช้ `finally` / `using` / `with` / `defer` ไม่ใช่เขียนซ้ำในทุกทางออก

---

## 7 · Anti-patterns

- ❌ **`catch` ว่างเปล่า** — ปัญหาที่หายากที่สุดคือปัญหาที่ไม่มีร่องรอย
- ❌ **คืน `null` แทนการโยน error** — ผู้เรียกไม่รู้ว่าไม่มีข้อมูล หรือระบบพัง
- ❌ **`catch (Exception)` ที่ชั้นในสุด** — กลืนบั๊กของตัวเองไปด้วย
- ❌ **log แล้ว throw ต่อทุกชั้น** — error หนึ่งตัวได้สิบบรรทัด
- ❌ **"เกิดข้อผิดพลาด"** — ไม่บอกว่าต้องทำอะไรต่อ
- ❌ **ส่ง stack trace ให้ผู้ใช้** — หลุดโครงสร้างภายในให้คนที่กำลังหาช่อง
- ❌ **retry แบบไม่หน่วง** — ยิงรัวใส่ระบบที่ล้มอยู่
- ❌ **retry การเขียนโดยไม่มี idempotency key** — รายการซ้ำ
- ❌ **ไม่มี timeout** — thread ค้างสะสมจนระบบตาย
- ❌ **ใช้ error เป็นตัวควบคุมการทำงานปกติ** — เช่นโยน exception เมื่อ "ไม่พบข้อมูล" ซึ่งเป็นเรื่องปกติ

---

## 8 · ตัวย่อ

- **retry** — การลองใหม่เมื่อครั้งแรกล้มเหลว
- **exponential backoff** — การหน่วงแบบทวีคูณ รอนานขึ้นทุกครั้งที่ลองใหม่
- **jitter** — ค่าสุ่มที่บวกเข้าไปในเวลาหน่วง เพื่อไม่ให้ทุกเครื่องลองใหม่พร้อมกัน
- **circuit breaker** — ตัวตัดวงจร หยุดเรียกปลายทางที่กำลังล้มชั่วคราว
- **idempotency key** — รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ
- **correlation id** — รหัสที่ติดไปกับคำขอหนึ่งตลอดทาง ใช้ไล่ log ข้ามระบบ

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปร่าง error ที่ API ส่งออก | `web-service-essentials` · `api-conventions` |
| รูปแบบ log และ correlation id | `logging-standards` |
| ตัวชี้วัดอัตรา error และการแจ้งเตือน | `observability-basics` |
| งานเบื้องหลังที่ล้มแล้วต้องไปไหนต่อ | `background-jobs` |
| ข้อความ error ที่ต้องแปลหลายภาษา | `i18n-and-locale` |
| test กรณีล้มเหลว | `testing-standards` |
| ขั้นตอนเมื่อระบบล่มจริง | `incident-runbook-template` |
