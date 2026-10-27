---
name: jenkins-pipeline
description: Use when writing or fixing a Jenkinsfile or Jenkins pipeline (CI/CD) that builds a Docker image, tests, and deploys with Helm.
---

# jenkins-pipeline — Jenkinsfile ที่ build image, ทดสอบ และ deploy ด้วย Helm โดยค่าลับไม่รั่ว

อยู่ใน plugin `software-company` · ถ้อยคำเขียนตาม `human-writing` · ตรวจแหล่งทุกค่าเมื่อ 2026-10-27 (ลิงก์อยู่หัวข้อ "ที่มา")

> **กฎข้อเดียว:** ค่าลับอยู่ใน Jenkins credentials แล้วให้ shell อ่านเองจาก environment (`sh '...'` ใช้ single quote) · ห้ามให้ Groovy ต่อสตริงค่าลับเข้าคำสั่ง
> เพราะ Groovy ขยายค่าก่อนส่งให้ agent ค่าลับจะไปอยู่ในอาร์กิวเมนต์ของโปรเซสที่ `ps` เห็นได้ ([Jenkins: Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/))

## ใช้เมื่อ

- เขียน Jenkinsfile ใหม่ หรือแก้ของเดิมที่ build image · ทดสอบ · deploy ลง Kubernetes ด้วย Helm
- มี service หลายตัวและอยากแชร์ pipeline (shared library)
- ค่าลับโผล่ใน console log หรือ pipeline ใช้ tag `latest`

ไม่ใช้เมื่อ: ใช้ GitHub Actions · GitLab CI · Azure DevOps → `cicd-and-release` (`references/per-platform.md`) · ยังไม่มี chart ให้ deploy → `kubernetes-helm` ก่อน

## ใช้ตัวอื่นแทนหรือคู่กัน

| งาน | skill | ใช้แบบ |
|---|---|---|
| หลักการ pipeline ทั่วไป: ขั้นตอน · build ครั้งเดียว · branch · environment · migration · rollback | `cicd-and-release` | **คู่ (อ่านก่อน)** skill นี้รับเฉพาะส่วนที่เป็นของ Jenkins |
| ที่เก็บ หมุน และแยกค่าลับตาม environment | `config-and-secrets` | คู่ |
| ตรวจ dependency · secret ในโค้ด · image ก่อนปล่อย | `security-gate` | คู่ |
| เขียน chart · values · probe · resource limit · Dockerfile | [`kubernetes-helm`](../kubernetes-helm/SKILL.md) | คู่ (เจ้าของเรื่อง chart) |
| service ที่ส่งข้อความผ่าน Kafka | [`kafka-streaming`](../kafka-streaming/SKILL.md) | คู่ |
| ให้ agent สั่ง Jenkins ผ่าน MCP | `mcp-server` | แทน |
| container สำหรับรันโค้ดไม่น่าไว้ใจ · sandbox | `docker-sandbox` | แทน |
| ช่องโหว่ทั้งระบบ | `security-audit` | แทน |

## 1 · โครง Declarative Pipeline

- ใช้ Declarative ไม่ใช่ Scripted · `agent none` ที่ระดับบน แล้วให้แต่ละ stage ประกาศ `agent` เอง · Jenkins บังคับให้ทุก stage มี `agent` เมื่อใช้ `agent none` ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- ลำดับ stage ตาม `cicd-and-release` หัวข้อ 1: lint → test → build + สแกน → staging → ทดสอบบน staging → อนุมัติ → production → ตรวจหลัง deploy
- ใช้ Multibranch Pipeline เพราะ `when { branch 'main' }` ใช้ได้เฉพาะ multibranch · stage deploy ขึ้นเฉพาะ `main` · PR รันได้แค่ lint · test · build
- **`when` ใส่ `beforeAgent true`** (ค่าเริ่มต้นประเมินหลังจัดสรร agent จึงเปลือง pod ให้ branch ที่ไม่ deploy) · **stage ที่มี `input` ใส่ `beforeOptions true`** เพราะค่าเริ่มต้น `when` ไม่ถูกประเมินก่อน `input` คำถามอนุมัติจะเด้งแม้ branch ไม่ใช่ `main` · `beforeOptions true` ทับ `beforeInput` และ `beforeAgent` ([Pipeline Syntax หัวข้อ when](https://www.jenkins.io/doc/book/pipeline/syntax/#when))
- `options` ที่ต้องมีเสมอ

| option | ตัวอย่าง | เหตุผล |
|---|---|---|
| `timeout` | `timeout(time: 45, unit: 'MINUTES')` | ไม่ให้ build ค้างกินตัวรัน (ที่ระดับบนไม่นับเวลารอ agent แต่นับเวลารอ `input` ด้วย pipeline ที่มีด่านอนุมัติจึงต้องตั้งยาวกว่าเวลารออนุมัติ) |
| `disableConcurrentBuilds` | `disableConcurrentBuilds()` | 2 build deploy release เดียวกันพร้อมกันไม่ได้ · แบบธรรมดาให้ build ใหม่เข้าคิว · `abortPrevious: true` ยกเลิกตัวที่รันอยู่ ซึ่งอาจกำลัง deploy จึงไม่ใช้กับ pipeline ที่ deploy |
| `buildDiscarder` | `buildDiscarder(logRotator(numToKeepStr: '30'))` | log และ artifact ไม่โตไม่จำกัด · เลข 30 เราตั้งเอง ไม่ใช่ค่าทางการ |

## 2 · agent: Kubernetes หรือ Docker

| แบบ | ใช้เมื่อ | ข้อควรระวัง |
|---|---|---|
| `agent { kubernetes { yaml '''...''' defaultContainer 'x' } }` | Jenkins รันบน Kubernetes · ต้องการ pod สะอาดทุก build | ต้อง Multibranch หรือ Pipeline from SCM · template แบบ declarative ไม่สืบทอดจาก template แม่เว้นแต่ใส่ `inheritFrom` ([Kubernetes plugin](https://plugins.jenkins.io/kubernetes/)) |
| `agent { docker { image '...' } }` | stage เดียวต้องใช้เครื่องมือเฉพาะ (helm · node) | ปักรุ่น image เป็นเลขรุ่นหรือ digest ไม่ใช้ `latest` |
| `agent { label 'docker-build' }` | build image ด้วย Docker บนเครื่องที่ติดตั้งไว้ | daemon ของ Docker ใช้สิทธิ์ root ให้เครื่องนี้รันเฉพาะ pipeline ของทีมเรา ไม่รัน PR จาก fork ([Docker security](https://docs.docker.com/engine/security/)) |

- **ไม่ mount `/var/run/docker.sock` ของ node เข้า pod** เพื่อ build image `(ยังไม่ได้ตรวจ: หน้าปลั๊กอิน Kubernetes ไม่มีคำเตือนเรื่อง docker.sock และไม่พูดถึงเครื่องมือ build ใน pod · เหตุผลที่เราใช้คือ daemon ใช้ root)` · ถ้าต้อง build ใน pod ให้ตรวจเครื่องมือที่ build โดยไม่ต้องมี daemon ของ node จากแหล่งทางการก่อนเลือก
- stage deploy ใช้ pod ที่มี `helm` และ `kubectl` ปักรุ่น ไม่ใช่ agent เดียวกับที่ build image

## 3 · ค่าลับ

| ก่อน → หลัง | เหตุผล |
|---|---|
| `sh "helm ... --password ${TOKEN}"` → `sh 'helm ... --password "$TOKEN"'` | Groovy ไม่แตะค่า · shell อ่านจาก environment |
| `credentials()` ใน `environment` ระดับบน → `withCredentials` ครอบเฉพาะ stage ที่ใช้ | ค่าไม่อยู่ใน environment ของทุก stage |
| `echo` ค่าลับ หรือ `set -x` ในบล็อกที่มีค่าลับ → ไม่ echo · ใส่ `set +x` | Jenkins ปิดค่าด้วย `****` ใน log ให้ แต่เป็นแค่กันพลาด ไม่กันคนที่ตั้งใจดึงค่า |
| ส่งพารามิเตอร์ของผู้ใช้เข้า `sh "..."` → single quote แล้วให้ shell อ่านตัวแปร | อักขระพิเศษในพารามิเตอร์ใช้แทรกคำสั่งได้ |
| kubeconfig เป็นข้อความ → credential ชนิด Secret file (`file(credentialsId: '...', variable: 'KUBECONFIG')`) | ตัวแปรเก็บ path ของไฟล์ชั่วคราว ไม่ใช่เนื้อไฟล์ |

- ชนิด credential ที่ `credentials()` รับ: secret text · username/password (ได้ `X`, `X_USR`, `X_PSW`) · secret file · SSH private key · ชนิดอื่นทำให้ pipeline ล้ม ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- บน Windows ค่าที่มี `%` เพี้ยนเมื่อผ่านเครื่องหมายคำพูดคู่ ใช้ `bat 'echo %KEY%'` ([Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/))
- สร้างบล็อก `withCredentials` ด้วย Snippet Generator ของ Jenkins แทนการพิมพ์เอง
- PR จาก fork ห้ามเห็น credential · ตั้ง Multibranch ให้ใช้ Jenkinsfile จาก branch ที่เชื่อถือเท่านั้น `(ยังไม่ได้ตรวจ: ชื่อการตั้งค่าในปลั๊กอิน)`
- หลักการเก็บ หมุน และแยกต่อ environment → `config-and-secrets` · ตรวจ secret ที่หลุดเข้า git → `security-gate`

## 4 · build image

1. tag ด้วย commit SHA (`GIT_COMMIT` ย่อ 12 ตัว) ไม่ใช้ `latest` · tag ชี้ commit เดียว ไล่กลับได้ (`cicd-and-release` หัวข้อ 3)
2. build ครั้งเดียว push ครั้งเดียว แล้วอ่าน **digest** จาก `docker buildx build --push --metadata-file meta.json` คีย์ `containerimage.digest` ([buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/))
3. staging และ production ใช้ digest ตัวเดียวกัน ส่งต่อด้วย `env.IMAGE_DIGEST` ไม่ build ใหม่
4. สแกนช่องโหว่ก่อน deploy: `trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 <image>@<digest>` · `--exit-code` คือรหัสออกเมื่อพบปัญหา ทำให้ stage ล้ม ([Trivy CLI](https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/) · [filtering](https://trivy.dev/latest/docs/configuration/filtering/)) `(ยังไม่ได้ตรวจ: ค่าเริ่มต้นของ --exit-code ในเอกสาร)`
5. login registry ด้วย `--password-stdin` ไม่ส่งรหัสเป็นอาร์กิวเมนต์ `(ยังไม่ได้ตรวจ: หน้า docker login)`
6. เก็บ digest และผลสแกนเป็น artifact ของ build (`archiveArtifacts`) ไว้ไล่ย้อน

## 5 · deploy ด้วย Helm

```
helm upgrade --install clinic deploy/chart/clinic-voice -n clinic-production \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-production.yaml \
  --atomic --timeout 20m
```

- `--install` ติดตั้งให้ถ้ายังไม่มี release ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))
- Helm 3: `--atomic` ถอยกลับเองเมื่ออัปเกรดล้ม และเปิด `--wait` ให้ ([Helm 3](https://helm.sh/docs/v3/helm/helm_upgrade/)) · Helm 4: ธง `--atomic` ถูกทำเครื่องหมาย deprecated ให้ใช้ `--rollback-on-failure` แทน (ตามที่ `kubernetes-helm` ตรวจไว้ใน `references/helm-chart.md` · [Helm 4 upgrade](https://helm.sh/docs/helm/helm_upgrade/)) → รัน `helm version` บนเครื่อง build แล้วเลือกธงให้ตรง
- `--timeout` นับต่อการกระทำย่อยแต่ละอย่าง ไม่ใช่ทั้งการอัปเกรด (ค่าเริ่มต้น 5m0s) · workload ที่โหลดโมเดล (stt · tts) ต้องยาวกว่านั้น ค่าจริง `(ยังไม่ได้วัด)` ตามที่ `kubernetes-helm` ข้อ 5 · `--history-max` ค่าเริ่มต้น 10
- **digest อยู่ใน `values-<env>.yaml`** ตามที่ chart ของ `kubernetes-helm` กำหนด (`api.image.digest` ฯลฯ · chart ใช้ `required` บังคับให้มี) ไม่ส่งด้วย `--set` · pipeline เขียน digest ที่ build ได้ลงไฟล์ values ของ environment แล้วส่งต่อไฟล์เดียวกันให้ staging และ production
- **staging อัตโนมัติ** เมื่อ merge เข้า `main` แล้วรันทดสอบบน staging (smoke · integration) ให้ผ่านก่อนถึงด่านคน
- **production ต้องมี `input`**
  - `input message: '...', ok: 'Deploy', submitter: 'release-managers'` · `submitter` คือรายชื่อผู้ใช้หรือกลุ่มที่กดได้ คั่นด้วยจุลภาค ไม่ใส่คือใครก็กดได้ ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
  - `input` ที่ระดับ stage ทำงานก่อนจัดสรร agent จึงไม่ถือ executor ระหว่างรอ · ใส่ `timeout` ที่ stage นั้นด้วย ไม่ให้ค้างข้ามคืน
  - ผู้อนุมัติไม่ควรเป็นคนที่ push commit นั้น `(เกณฑ์ของเรา ไม่ใช่ค่าทางการ)` · บันทึกว่าใครกดด้วย `submitterParameter` `(ยังไม่ได้ตรวจ: คำอธิบายในหน้า step)`
- **rollback:** `helm rollback <release> [REVISION]` ไม่ใส่เลขรุ่นคือย้อนไปรุ่นก่อนหน้า ดูเลขด้วย `helm history <release>` ([helm rollback](https://helm.sh/docs/helm/helm_rollback/)) · ใส่ใน `post { failure { ... } }` ของ stage ตรวจหลัง deploy · หลักการและการซ้อม → `cicd-and-release` หัวข้อ 9
- migration ฐานข้อมูลเป็น stage ของตัวเองก่อน deploy โค้ด → `cicd-and-release` หัวข้อ 7

## 6 · หลาย service

- build หลาย service พร้อมกันด้วย `matrix` (axis `SERVICE`) หรือ `parallel` · ใส่ `failFast true` เมื่อ service ใดล้มแล้วที่เหลือไม่มีความหมาย ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- แต่ละ service มี tag และ digest ของตัวเอง · deploy ทีละ release ตามลำดับที่พึ่งพากัน ไม่ใช่ทุกตัวพร้อมกัน
- `disableConcurrentBuilds` ทำให้ service ที่ไม่เกี่ยวกันรอกัน → แยก job ต่อ service เมื่อทีมแยกกัน

## 7 · shared library

- **มีเมื่อ** บล็อก build/scan/deploy เดียวกันถูกคัดลอกเกิน 3 Jenkinsfile `(เกณฑ์ของเรา)` · น้อยกว่านั้นคัดลอกต่อง่ายกว่า (`simplicity-first`)
- ล็อกรุ่นเสมอ: `@Library('clinic-pipeline@v1.2.0') _` · รุ่นเป็น branch · tag · commit hash ได้ ([Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)) · ไม่ปล่อยให้ใช้ default เพราะ push เดียวเปลี่ยนทุก pipeline
- โครง: `vars/` ฟังก์ชันที่ Jenkinsfile เรียก · `src/` คลาส Groovy · `resources/` ไฟล์ที่โหลดด้วย `libraryResource`
- library แบบ trusted เรียกเมธอดภายในของ Jenkins ได้ทั้งหมด **ใครผลัก commit เข้า repo ของ library ได้ ควบคุม Jenkins ได้** → ป้องกัน branch และ tag เท่า production · global variable ต้องไม่เก็บสถานะ (หายเมื่อ controller รีสตาร์ต)

## 8 · ปลั๊กอินและการตรวจ Jenkinsfile

- ล็อกรุ่นปลั๊กอินใน `plugins.txt` รูปแบบ `ชื่อ:รุ่น` แล้วติดตั้งด้วย `jenkins-plugin-cli --latest=false` (ไม่ใส่จะถูก dependency ดึงรุ่นใหม่กว่ามาทับ) ([plugin-installation-manager-tool](https://github.com/jenkinsci/plugin-installation-manager-tool))
- ตามประกาศความปลอดภัยทาง [RSS](https://www.jenkins.io/security/advisories/) · อัปเดตปลั๊กอินที่ถูกประกาศให้เร็ว · ปลั๊กอินที่ไม่ใช้ถอดออก
- ปลั๊กอิน MCP Server ทำให้ controller เป็น MCP server (endpoint `/mcp-server/mcp`) · ใช้ API token ของผู้ใช้สิทธิ์น้อย และ `allowUnauthenticatedMcp` ต้องเป็น `false` ([plugins.jenkins.io/mcp-server](https://plugins.jenkins.io/mcp-server/)) · ติดตั้งและต่อ agent → `mcp-server`
- **ตรวจก่อน commit**
  - `ssh -p $JENKINS_PORT $JENKINS_HOST declarative-linter < Jenkinsfile`
  - `curl -X POST --user "$JENKINS_AUTH" -F "jenkinsfile=<Jenkinsfile" "$JENKINS_URL/pipeline-model-converter/validate"` (`JENKINS_AUTH` = `user:api_token`) ([Pipeline Development Tools](https://www.jenkins.io/doc/book/pipeline/development/))
  - linter ตรวจแค่ไวยากรณ์ Declarative ไม่รัน pipeline และไม่จับเรื่อง string interpolation → ตรวจข้อ 3 เอง หรือ `grep -nE 'sh +"|sh +\x27{3}' Jenkinsfile` แล้วไล่ดูทุกบรรทัดที่เจอ

## ตัวอย่างจริง — voice agent คลินิกทันตกรรม

**โจทย์:** ระบบ voice agent คลินิกทันตกรรม 5 service (`web` · `api` · `voice-gateway` · `stt` · `tts`) ใน chart เดียว `clinic-voice` · build เป็น Docker image · staging ทดสอบอัตโนมัติ · production ให้ผู้จัดการปล่อยกดอนุมัติ · ชื่อ service namespace และ probe ตรงกับ `kubernetes-helm`

**ที่ทำ:** Jenkinsfile เต็มอยู่ที่ [`references/jenkinsfile-voice-clinic.md`](references/jenkinsfile-voice-clinic.md) · สรุปการตัดสินใจ

| เรื่อง | เลือก | เหตุผล |
|---|---|---|
| ค่าลับของคลินิก (คีย์ STT/TTS · Kafka · ฐานข้อมูล) | อยู่ใน `ExternalSecret` ของ chart ไม่ผ่าน Jenkins | Jenkins รู้แค่ kubeconfig กับ registry · ข้อมูลผู้ป่วยไม่เข้า log ของ build (`pdpa-compliance` · `logging-standards`) |
| image | `registry.example.com/clinic/<service>:<sha12>` + digest | ทุก service มีรุ่นของตัวเอง |
| digest | เขียนลง `values-staging.yaml` และ `values-production.yaml` ในขั้น build | production ใช้ digest ตัวเดียวกับที่ผ่าน staging |
| ทดสอบ staging | ต่อ `/health/live` และ `/health/ready` ของ `web` `api` `voice-gateway` + สายทดสอบ 1 สาย | ก่อนด่านคน |
| ด่านคน | `input` `submitter: 'clinic-release-managers'` timeout 2 ชั่วโมง | ช่วงเวลาปล่อยที่ไม่ชนสายที่กำลังคุย `(รอยืนยัน)` |
| ล้ม | release `clinic` ใน `clinic-production` · `--atomic --timeout 20m` ย้อนเอง · smoke หลัง deploy ล้ม → `helm rollback clinic` | stt/tts โหลดโมเดลนาน จึงตั้ง timeout ยาว `(ยังไม่ได้วัด)` · ซ้อมบน staging ทุกไตรมาส |

**ผล:** ค่าลับไม่อยู่ใน Jenkinsfile · production ได้ image ตัวเดียวกับที่ผ่าน staging ไล่ได้ด้วย digest `(ยังไม่ได้ตรวจ: ยังไม่ได้รันกับ Jenkins จริง)`

## ตรวจก่อนส่ง

- [ ] ไม่มี `sh "..."` หรือ `"""` ที่มี `$` ของค่าลับ · ไม่มี `echo` ค่าลับ
- [ ] `withCredentials` ครอบเฉพาะ stage ที่ใช้
- [ ] image tag เป็น SHA ไม่มี `latest` · staging กับ production ใช้ digest เดียวกัน
- [ ] มีสแกน image ที่ทำให้ stage ล้ม
- [ ] production มี `input` + `submitter` + `timeout` · deploy ใช้ `--atomic` หรือแฟล็กเทียบเท่าของ Helm รุ่นที่ใช้
- [ ] `@Library` และปลั๊กอินล็อกรุ่น
- [ ] ผ่าน `declarative-linter` หรือ endpoint validate
- [ ] ข้อที่ยังไม่ได้ตรวจบอกผู้ใช้ตรง ๆ

## ที่มา (ตรวจ 2026-10-27)

- Jenkins: [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/) · [Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/) · [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/) · [Pipeline Development Tools](https://www.jenkins.io/doc/book/pipeline/development/) · [Security advisories](https://www.jenkins.io/security/advisories/) · [input step](https://www.jenkins.io/doc/pipeline/steps/pipeline-input-step/)
- ปลั๊กอิน: [Credentials Binding](https://plugins.jenkins.io/credentials-binding/) · [Kubernetes](https://plugins.jenkins.io/kubernetes/) · [MCP Server](https://plugins.jenkins.io/mcp-server/) · [plugin-installation-manager-tool](https://github.com/jenkinsci/plugin-installation-manager-tool)
- Helm: [upgrade 4.3.1](https://helm.sh/docs/helm/helm_upgrade/) · [upgrade 3.x](https://helm.sh/docs/v3/helm/helm_upgrade/) · [rollback](https://helm.sh/docs/helm/helm_rollback/)
- Docker · Trivy: [buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/) · [Docker security](https://docs.docker.com/engine/security/) · [Trivy image CLI](https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/)
- หน้า Credentials Binding บอกวิธี `withCredentials` เฉพาะ `usernamePassword` และเตือนให้ใช้ single quote · ชนิด `file` และ `sshUserPrivateKey` อ้างจากหน้า Using a Jenkinsfile
