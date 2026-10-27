---
name: kubernetes-helm
description: Use when writing a Dockerfile, Kubernetes (k8s) manifest or Helm chart, deploying staging to production, or running STT/TTS on GPU nodes.
---

# kubernetes-helm — Dockerfile, manifest, Helm chart และ deploy staging → production

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้และรายงานเขียนตาม `human-writing` · ทุกรุ่นและคำสั่งตรวจกับเอกสารทางการเมื่อ 2026-10-27 ลิงก์อยู่ในไฟล์ `references/` · ตัวที่ยังไม่ได้ตรวจมีป้าย `(ยังไม่ได้ตรวจ)`

> **กฎข้อเดียว:** production รัน image ตัวเดียวกับที่ผ่าน staging มาแล้ว (ระบุด้วย digest ไม่ build ใหม่) และทุก manifest ผ่าน `helm lint` กับ `helm template | kubeconform` ก่อนแตะ cluster · ค่าลับไม่อยู่ใน image ไม่อยู่ใน values

## ใช้เมื่อ

- เขียนหรือแก้ Dockerfile ที่จะรันจริง (ไม่ใช่ห้องทดลอง)
- เขียน manifest ของ Kubernetes (Deployment · probe · securityContext · PodDisruptionBudget · HorizontalPodAutoscaler · NetworkPolicy)
- สร้างหรือแก้ Helm chart · ตั้งค่าแยก staging กับ production · ตั้งวิธีเก็บค่าลับ
- ปล่อยระบบขึ้น staging แล้วเลื่อนขึ้น production · ย้อนรุ่น
- ให้ workload ใช้ GPU (STT/TTS) หรือขยาย worker ตามงานค้างใน Kafka

ไม่ใช้เมื่อ: ยังไม่มี cluster และต้องสร้างเครื่องหรือ node pool → `infra-as-code` · ทีมเล็กที่ VM เครื่องเดียวกับ docker compose พอ → `infra-as-code` หัวข้อ 1 และ 8 ก่อนตัดสินใจใช้ Kubernetes · ห้องทดลองรันโค้ดไม่น่าไว้ใจ → `docker-sandbox` · แค่ขอคำอธิบายแนวคิดสั้น ๆ ตอบตรงโดยไม่ต้องเปิด 9 ขั้น

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| สร้าง cluster · node pool · เครือข่ายจากโค้ด | [`infra-as-code`](../infra-as-code/SKILL.md) | ที่นั่นสร้างของ ที่นี่ลงของบน cluster · คำถามว่าคุ้มใช้ Kubernetes ไหมอยู่ที่นั่น |
| ค่าลับ · config ต่อ environment | [`config-and-secrets`](../config-and-secrets/SKILL.md) | ที่นั่นกำหนดว่าอะไรเป็นลับและหมุนอย่างไร ที่นี่กำหนดว่าเข้า pod ทางไหน |
| pipeline build · ด่าน · rollback ระดับระบบ | [`cicd-and-release`](../cicd-and-release/SKILL.md) | build ครั้งเดียวแล้วเลื่อนขั้น (หัวข้อ 2) มาจากที่นั่น ที่นี่ลงรายละเอียดฝั่ง Kubernetes · เขียนไฟล์ Jenkins → [`jenkins-pipeline`](../jenkins-pipeline/SKILL.md) |
| endpoint `/health/live` กับ `/health/ready` · ปิดตัวเรียบร้อย | [`web-service-essentials`](../web-service-essentials/SKILL.md) | probe ในที่นี้ชี้ไปที่ endpoint เหล่านั้น |
| รันโค้ดทดลองใน container | [`docker-sandbox`](../docker-sandbox/SKILL.md) | ห้องทดลองไม่ใช่ image ที่ส่งขึ้น production |
| ตรวจ image และ manifest ก่อนส่ง | [`security-gate`](../security-gate/SKILL.md) | สแกน secret และช่องโหว่ใน image |
| metric · alert · แดชบอร์ด (Prometheus/Grafana) | [`observability-basics`](../observability-basics/SKILL.md) | ที่นี่แค่ให้ pod เปิด metric ได้ |
| Kafka เอง (topic · partition · consumer) | [`kafka-streaming`](../kafka-streaming/SKILL.md) | ที่นี่มีแค่การขยาย consumer ตามคิว (ขั้น 3.7) |

## 1 · ค้นก่อนถาม แล้วถามรวมครั้งเดียว

ค้นใน repo และเครื่อง: Dockerfile · `deploy/` · `Chart.yaml` · `kubectl config current-context` (อ่านอย่างเดียว) · `helm version` · pipeline ที่มีอยู่ · ถามรวมครั้งเดียวเฉพาะที่หาเองไม่ได้:

| คำถาม | ทำไมต้องรู้ |
|---|---|
| cluster ของ cloud ไหน และ network plugin รองรับ NetworkPolicy ไหม | กำหนดวิธีทำ GPU และ NetworkPolicy ถ้า plugin ไม่บังคับใช้ policy จะไม่มีผล |
| ค่าลับเก็บที่ไหน (vault · secret manager ของ cloud · ไม่มี) | เลือก External Secrets Operator หรือ Sealed Secrets |
| registry ที่ใช้และใครเซ็นหรือสแกน image | ที่ push ที่ดึง และด่านสแกน |
| เพดานเงินของ GPU node pool ต่อเดือน | หัวข้อ "เงินและของนอกเครื่อง" |
| ใครอนุมัติการขึ้น production | ขั้น 8 หยุดรอคนนั้น |

ไม่ได้คำตอบ → ใช้ค่าแนะนำ (ค่าลับ: External Secrets ถ้ามี vault ไม่งั้น Sealed Secrets) แล้วจดใน `decision-log` หรือหัวข้อ "ตัดสินใจเอง" ท้ายรายงาน · ตัวเลขเพดานเงินไม่มีค่าแนะนำ ใส่ `(รอยืนยัน)` และห้ามเพิ่ม GPU เกินที่มีอยู่

## 2 · Dockerfile

แม่แบบเต็มและเหตุผลใน [`references/dockerfile.md`](references/dockerfile.md) · ข้อบังคับ:

1. multi-stage: stage สร้างแยกจาก stage รัน · image สุดท้ายไม่มี compiler หรือ build tool
2. base image ล็อกด้วย digest (`FROM name:tag@sha256:...`) และตั้งตัวอัปเดตตามรอบ (Dependabot ชนิด docker) เพราะการล็อกทำให้ไม่ได้ patch เอง
3. `USER` เป็น UID ตัวเลขที่ไม่ใช่ root ระบุเอง และตรงกับ `runAsUser` ใน manifest
4. มี `.dockerignore` ตัด `.git` `.env` กุญแจ และไฟล์ที่ไม่ใช้
5. ไม่ใช้ `ARG` หรือ `ENV` กับค่าลับ ตอน build ใช้ `RUN --mount=type=secret`
6. `CMD` แบบ exec เพื่อรับสัญญาณปิดตัว · ไม่ใช้ tag `latest`

## 3 · manifest

ชิ้นส่วนและ YAML อยู่ใน [`references/manifest-checklist.md`](references/manifest-checklist.md) · ทุก workload ต้องมี:

1. `resources.requests` ครบ และ memory limit · HPA ต้องมี CPU request
2. `startupProbe` `livenessProbe` `readinessProbe` · liveness ไม่เช็คฐานข้อมูลหรือบริการภายนอก
3. `securityContext`: `runAsNonRoot` · `allowPrivilegeEscalation: false` · drop `ALL` · `seccompProfile: RuntimeDefault` · `readOnlyRootFilesystem: true` พร้อม `emptyDir` ที่เขียนได้
4. `image` เป็น digest · ไม่ใช้ `latest`
5. `PodDisruptionBudget` (`maxUnavailable` ไม่ใช่ 0 เมื่อมีหลาย replica) · `HorizontalPodAutoscaler` หรือ KEDA (อย่างใดอย่างหนึ่งต่อ Deployment)
6. `NetworkPolicy` เริ่มจากปิดทางเข้าทั้งหมดแล้วเปิดเป็นรายเส้น
7. **ขยาย worker ตามงานค้างใน Kafka** ใช้ KEDA ดู consumer lag แทน HPA ที่ดู CPU · `maxReplicaCount` ไม่เกินจำนวน partition · ห้ามมี HPA อีกตัวบน Deployment เดียวกัน · รายละเอียดและตัวอย่าง Deep Research Agent ใน [`references/keda-queue-scaling.md`](references/keda-queue-scaling.md)
8. rollout แบบ RollingUpdate ตั้ง `maxUnavailable` และ `progressDeadlineSeconds` ให้ตั้งใจ ไม่ปล่อยค่าเริ่มต้นโดยไม่รู้

## 4 · Helm chart

รายละเอียด คำสั่ง และตารางค่าลับใน [`references/helm-chart.md`](references/helm-chart.md):

1. 1 chart ต่อระบบที่ปล่อยพร้อมกัน · `values.yaml` เป็นค่าเริ่มต้นปลอดภัย · `values-staging.yaml` กับ `values-production.yaml` ใส่เฉพาะที่ต่าง
2. digest ของ image ไม่มีค่าเริ่มต้น (บังคับด้วย `required`) · ต้องส่งเข้าตอน deploy
3. ค่าลับไม่เข้า `values*.yaml` `--set` หรือ git · chart สร้างแค่ `ExternalSecret` หรือ `SealedSecret` และ pod อ้างด้วย `secretKeyRef`
4. `values.schema.json` ให้ `helm lint` จับค่าผิดชนิด
5. chart ภายนอกล็อก `--version` · chart ของเราเพิ่มเลข `version` ทุกครั้งที่ template เปลี่ยน

## 5 · GPU node pool (STT/TTS)

รายละเอียดแยกตาม cloud ใน [`references/gpu-node-pool.md`](references/gpu-node-pool.md):

1. ต้องมี 4 ชั้นครบ: node ที่มี GPU และ driver → device plugin (NVIDIA device plugin หรือ GPU Operator) → taint และ label → pod ที่ขอ `nvidia.com/gpu` ใน `limits`
2. toleration ไม่พอ ต้องมี `nodeSelector` หรือ affinity ด้วย
3. web และ api ไม่ขอ GPU และไม่มี toleration · stt และ tts เป็น Deployment แยก
4. `startupProbe` ยาวพอให้โหลดโมเดล · image ใหญ่ทำให้ `helm --timeout` ต้องยาวกว่าค่าเริ่มต้น

## 6 · ตรวจก่อนแตะ cluster

รันทั้ง staging และ production values:

```bash
helm lint <chart> --strict -f <chart>/values-<env>.yaml
helm template <release> <chart> -f <chart>/values.yaml -f <chart>/values-<env>.yaml \
  | kubeconform -strict -summary -kubernetes-version <รุ่น-cluster> -schema-location default
```

- `-kubernetes-version` ต้องตรงกับ cluster (ค่าเริ่มต้นคือ `master`) · CRD ที่ไม่มี schema ให้ใส่ catalog หรือ `-ignore-missing-schemas` แล้วจดว่าข้ามอะไร
- ค้น output ของ `helm template` หา: `image:` ทุกตัวมี `@sha256:` · ไม่มี `latest` · ไม่มีค่าลับตัวจริง
- ผลของเครื่องมือที่รันไม่ได้ ระบุใน "ไม่ได้รัน" ไม่เขียนว่าผ่าน

## 7 · deploy staging

1. ยืนยัน context: `kubectl config current-context` ต้องเป็น cluster staging · ไม่ตรง → หยุด
2. `helm upgrade --install ... --atomic --timeout <ยาวพอ>` สำหรับ Helm 3 · Helm 4 ใช้ `--rollback-on-failure` (ธง `--atomic` ถูกระบุว่า deprecated) · ดู `helm version` ก่อนเลือก
3. `kubectl rollout status` ทุก Deployment · ตรวจ pod `Ready` จริง ไม่ใช่แค่ Running
4. ทดสอบตามแผนของทีม (smoke · end-to-end · เสียงจริงสำหรับ voice agent) · ผล + digest ที่ทดสอบบันทึกไว้
5. ซ้อม rollback บน staging 1 ครั้งก่อนปล่อยครั้งแรกของระบบนี้ (`helm rollback`)

## 8 · เลื่อนขึ้น production

ตรวจก่อนเลื่อน (ผ่านครบทุกข้อ ไม่งั้นหยุด):

| ตรวจ | วิธี |
|---|---|
| digest เดียวกับที่ทดสอบบน staging | เทียบ `@sha256:` ใน `helm get values` หรือ `kubectl get deploy -o jsonpath` ของ staging กับค่าใน `values-production.yaml` |
| ไม่ build ใหม่ | log pipeline ไม่มีขั้น build ในงานนี้ |
| chart รุ่นเดียวกัน | `--version` ตรงกับที่ staging |
| ขั้น 6 ผ่านกับ `values-production.yaml` | ผลคำสั่งรอบนี้ |
| คนที่ตกลงไว้ในขั้น 1 อนุมัติ | บันทึกชื่อและเวลา |

**agent ไม่รัน `helm upgrade` กับ production เอง** เว้นแต่ผู้ใช้สั่งในรอบนั้น · ส่งคำสั่งเต็มที่ตรวจแล้วให้คนอนุมัติรัน (หรือให้ขั้นอนุมัติใน pipeline รัน) · หลังปล่อย: `rollout status` → ดูแดชบอร์ดและ alert (`observability-basics`) ตามช่วงที่ตกลง → บันทึกรุ่นที่ใช้

## 9 · rollback

- release ของ Helm: `helm history` แล้ว `helm rollback <release> <revision> --wait` · ไม่ใช้ `kubectl rollout undo` กับของที่ Helm ติดตั้ง
- rollback ไม่ย้อน migration ฐานข้อมูลหรือข้อความที่เข้า Kafka แล้ว · ต้องมีแผนย้อนข้อมูลแยก (`cicd-and-release` หัวข้อ 7 และ 9)
- rollback ด้วยรุ่น (digest) ที่เคยผ่าน ไม่ rebuild เพื่อ "แก้เร็ว"

## เงินและของนอกเครื่อง

GPU node pool และ load balancer คิดเงิน · ทำตามนี้:

1. เพดานเงินมาจากผู้ใช้ skill นี้ขึ้นเพดานเองไม่ได้ ชนเพดาน → ถาม
2. ไม่ลบ namespace · PersistentVolumeClaim · node pool · release ที่ผู้ใช้สร้างเองโดยไม่ถาม
3. ลบแล้วตรวจซ้ำด้วยคำสั่งดูรายการ (`kubectl get`, `helm list`, คำสั่ง list node pool ของ cloud) แล้วสรุปค่าใช้จ่ายที่เกิดจริง
4. scale เหลือ 0 ไม่เท่าลบ: ของที่แค่หยุดอาจยังคิดค่าพื้นที่ (ดิสก์ · load balancer) `(ยังไม่ได้ตรวจ)` กับ cloud ที่ใช้

## ตัวอย่างจริง — voice agent คลินิกทันตกรรม

โจทย์: เว็บแอป (หน้าลูกค้า + หลังบ้าน) · หลาย service คุยกันผ่าน Kafka · STT/TTS บน GPU · Jenkins build → staging → production

| ชิ้น | ทำอย่างไร |
|---|---|
| image | `web` `api` `voice-gateway` `stt` `tts` ทุกตัว multi-stage · non-root · digest · Jenkins build ครั้งเดียวแล้วจด digest |
| chart | `clinic-voice` 1 chart · `services.web` `api` `voiceGateway` `stt` `tts` · values แยกสิ่งแวดล้อม · ค่าลับ (Kafka · ฐานข้อมูล · คีย์ STT/TTS) ผ่าน `ExternalSecret` |
| web · api · gateway | probe ชี้ `/health/live` `/health/ready` · PDB `maxUnavailable: 1` · HPA ที่ CPU 60% |
| stt · tts | `nodeSelector` + toleration + `limits.nvidia.com/gpu: 1` · namespace หรือ NetworkPolicy แยก · `startupProbe` ยาวสำหรับโหลดโมเดล |
| consumer ที่ประมวลผลหลังการโทร | KEDA ดู lag ของ topic · max ไม่เกินจำนวน partition |
| NetworkPolicy | เปิดแค่ ingress → web · web → api · gateway → stt/tts · api → Kafka |
| metric | pod เปิด `/metrics` ให้ Prometheus (ตามแบบของ `observability-basics`) |
| staging → production | ทดสอบ voice จริงบน staging · จด digest · อนุมัติ · `helm upgrade` production ด้วย digest นั้น · ไม่ build ใหม่ |

ผล: คำสั่ง `helm lint` `helm template | kubeconform` ผ่านทั้ง 2 environment · image ใน production `@sha256` ตรงกับ staging · ไม่มีค่าลับใน repo หรือ values

## ตรวจก่อนส่ง

1. Dockerfile: multi-stage · digest · non-root · มี `.dockerignore` · ไม่มีค่าลับใน layer (`docker history` ดู)
2. ทุก workload มี requests · 3 probe · securityContext ครบ · image เป็น digest
3. `helm lint --strict` และ `helm template | kubeconform` ผ่านด้วย values ของทั้ง staging และ production (รันรอบนี้จริง)
4. ค้น `values*.yaml` และ `helm template` ไม่พบรหัสผ่านหรือ token
5. production ใช้ digest เดียวกับ staging และมีบันทึกผู้อนุมัติ · ไม่มีการรัน production โดย agent เอง
6. GPU: ไม่มี pod ของ web บน GPU node · stt/tts ขึ้น GPU node จริง (`-o wide`)
7. ข้อที่ยังไม่ได้ตรวจหรือรันไม่ได้ ระบุไว้ในรายงาน

## ที่มา

ตรวจ 2026-10-27 (รายละเอียดต่อข้ออยู่ใน references):

- Docker — [Build best practices](https://docs.docker.com/build/building/best-practices/) · [Build secrets](https://docs.docker.com/build/building/secrets/)
- Kubernetes — [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) · [Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) · [Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) · [PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) · [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/) · [Images](https://kubernetes.io/docs/concepts/containers/images/) · [Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) · [Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)
- Helm — [upgrade](https://helm.sh/docs/helm/helm_upgrade/) · [lint](https://helm.sh/docs/helm/helm_lint/) · [values](https://helm.sh/docs/chart_best_practices/values/) · [registries](https://helm.sh/docs/topics/registries/) · [rollback](https://helm.sh/docs/helm/helm_rollback/)
- เครื่องมือ — [kubeconform](https://github.com/yannh/kubeconform) · [External Secrets](https://external-secrets.io/latest/introduction/overview/) · [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) · [KEDA](https://keda.sh/docs/latest/concepts/) · [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html)
- cloud GPU — [GKE](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/gpus) · [AKS](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu) · [EKS](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)
