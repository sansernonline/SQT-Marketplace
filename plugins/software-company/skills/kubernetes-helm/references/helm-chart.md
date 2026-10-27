# Helm chart — โครง values ต่อ environment ค่าลับ และคำสั่ง

ใช้กับขั้น 4 6 7 8 9 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · Helm 4 เป็นรุ่นที่หน้า [helm.sh/docs](https://helm.sh/docs/overview/) ระบุว่าใหม่สุด (4.3.1) · Helm 3 ยังมีเอกสาร (3.22.1)

สารบัญ: [โครง chart](#โครง-chart) · [values ต่อ environment](#values-ต่อ-environment) · [ค่าลับ](#ค่าลับไม่อยู่ใน-values) · [ตรวจ](#ตรวจแบบไม่แตะ-cluster) · [ล็อกรุ่น](#ล็อกรุ่น-chart) · [deploy](#deploy) · [rollback](#rollback)

## โครง chart

```
deploy/chart/clinic-voice/
├─ Chart.yaml            # version = รุ่นของ chart · appVersion = รุ่นของระบบ
├─ values.yaml           # ค่าเริ่มต้นที่ปลอดภัย ไม่มีค่าลับ ไม่มีรุ่น image จริง
├─ values.schema.json    # JSON Schema ให้ helm lint ตรวจชนิดของค่า
├─ values-staging.yaml   # เฉพาะที่ต่างจาก values.yaml
├─ values-production.yaml
└─ templates/            # deployment · service · pdb · hpa หรือ scaledobject · networkpolicy · externalsecret
```

- แยก 1 chart ต่อระบบที่ปล่อยพร้อมกัน แล้วใช้ค่า `services.<ชื่อ>` ต่อ service · หรือ 1 chart ต่อ service ถ้าปล่อยแยกรุ่น · เลือกอย่างเดียวทั้งโปรเจกต์
- เขียนค่าเป็น camelCase เริ่มด้วยตัวเล็ก · ใช้ map ตามชื่อแทน list (override ด้วย `--set` ได้) · ใส่คำอธิบายทุกค่า ([Values best practices](https://helm.sh/docs/chart_best_practices/values/))

## values ต่อ environment

```yaml
# values.yaml  (ค่าเริ่มต้น)
api:
  image: { repository: registry.example.com/clinic/api, digest: "" }   # ว่างไว้ ต้องใส่ตอน deploy
  replicas: 2
  resources:
    requests: { cpu: 250m, memory: 256Mi }
    limits: { memory: 512Mi }
```

```yaml
# values-production.yaml  (เฉพาะที่ต่าง)
api:
  image: { digest: "sha256:<digest-เดียวกับที่ผ่าน-staging>" }
  replicas: 3
```

template ประกอบ image แบบนี้ เพื่อบังคับว่ามี digest: `{{ .repository }}@{{ required "api.image.digest is required" .digest }}`

| environment | ต่างจากค่าเริ่มต้นเรื่อง | ห้ามต่าง |
|---|---|---|
| staging | replica น้อย · ทรัพยากรน้อย · โดเมนทดสอบ · GPU 1 ตัว | digest ของ image ต้องเป็นตัวที่จะขึ้น production |
| production | replica มาก · PDB เข้ม · HPA/KEDA เพดานสูงกว่า | โครง template · ชนิด probe · securityContext |

ลำดับ `-f` มีผล: ไฟล์ขวาสุดชนะ (`-f values.yaml -f values-production.yaml`) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))

## ค่าลับไม่อยู่ใน values

- ห้ามใส่รหัสผ่าน token key ใน `values*.yaml` `--set` หรือ `Chart.yaml` · Secret ของ Kubernetes แค่เข้ารหัส base64 ซึ่ง "provides no additional confidentiality" และเก็บใน etcd แบบไม่เข้ารหัสโดยปริยาย ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/))
- ทางเลือก (เลือกอย่างเดียวต่อโปรเจกต์ และดู [`config-and-secrets`](../../config-and-secrets/SKILL.md) หัวข้อ 6):

| ทาง | เหมาะเมื่อ | ข้อควรรู้ (ตรวจ 2026-10-27) |
|---|---|---|
| External Secrets Operator | มี vault หรือ secret manager ของ cloud อยู่แล้ว | `SecretStore` เก็บการเชื่อมต่อ · `ExternalSecret` บอกว่าดึงค่าไหน แล้วสร้าง Secret ให้และอัปเดตเมื่อต้นทางเปลี่ยน ([ESO](https://external-secrets.io/latest/introduction/overview/)) |
| Sealed Secrets | ไม่มี vault ทีมเล็ก อยากเก็บค่าที่เข้ารหัสใน git | `kubeseal` เข้ารหัส เฉพาะ controller ใน cluster นั้นถอดได้ · ต้องสำรอง key ของ controller ไม่งั้นกู้ไม่ได้ · key หมุนทุก 30 วันโดยปริยาย แต่ไม่แทนการเปลี่ยนรหัสจริง ([sealed-secrets](https://github.com/bitnami-labs/sealed-secrets)) |
| Secrets Store CSI Driver | ไม่อยากให้ค่าลับเป็น Secret ใน cluster | mount จาก store ภายนอกเป็น volume เฉพาะ pod ที่อนุญาต ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)) |

- chart ของเราสร้างแค่ `ExternalSecret` หรือ `SealedSecret` และให้ pod อ้างชื่อ Secret ผ่าน `secretKeyRef` · ค่าจริงไม่ผ่านมือ agent
- ให้ RBAC อ่าน Secret เฉพาะชื่อที่ต้องใช้ (`resourceNames`) · สิทธิ์ `list` Secret เท่ากับอ่านค่าได้ทั้งหมด

## ตรวจแบบไม่แตะ cluster

```bash
helm lint deploy/chart/clinic-voice --strict -f deploy/chart/clinic-voice/values-production.yaml
helm template clinic deploy/chart/clinic-voice \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-production.yaml \
  | kubeconform -strict -summary -kubernetes-version <รุ่น-k8s-ของ-cluster> \
      -schema-location default \
      -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
```

- `helm lint --strict` ทำให้ warning ล้มด้วย · ERROR คือ chart ติดตั้งไม่ได้ ([helm lint](https://helm.sh/docs/helm/helm_lint/))
- `kubeconform`: `-strict` ปฏิเสธ field ที่ไม่มีใน schema · `-kubernetes-version` ค่าเริ่มต้นคือ `master` จึงต้องระบุให้ตรง cluster · `-schema-location default` ต้องใส่คู่กับ catalog ของ CRD ไม่งั้นชนิดในตัวหาไม่เจอ · CRD ที่ไม่มีใน catalog (เช่น ScaledObject) ใช้ `-ignore-missing-schemas` แล้วจดไว้ ([kubeconform](https://github.com/yannh/kubeconform))
- รัน lint+template ทั้ง 2 ไฟล์ values (staging และ production) ไม่ใช่แค่ไฟล์เดียว
- ตรวจ policy เพิ่มด้วยเครื่องมือของทีมถ้ามี (ยังไม่ได้ตรวจ ว่าทีมเลือกตัวไหน)

## ล็อกรุ่น chart

- chart ที่ติดตั้งจาก registry ระบุ `--version` เสมอ (ถ้าไม่ระบุใช้รุ่นล่าสุด) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))
- chart แบบ OCI: `helm upgrade --install <release> oci://<registry>/<repo>/<chart> --version <x.y.z>` · ล็อกด้วย digest ได้โดยต่อ `@sha256:<digest>` ท้าย URL และเอกสารว่า "more secure than a tag because digests are immutable" ([Registries](https://helm.sh/docs/topics/registries/) · หน้านั้นบอกว่ายังไม่ปรับให้ตรง Helm 4)
- chart ภายนอก (ingress controller · KEDA · GPU Operator) ล็อก `--version` ใน pipeline และอัปเดตผ่าน PR
- ลงลายเซ็นได้ด้วย provenance: เทียบ chart กับไฟล์ provenance เพื่อยืนยันว่าไม่ถูกแก้และรู้ว่าใครเซ็น ([Provenance](https://helm.sh/docs/topics/provenance/)) · ใช้เมื่อ chart มาจากภายนอกทีม

## deploy

Helm 3 (`--atomic` = rollback เมื่อพลาด และเปิด `--wait` ให้เอง ([Helm 3 upgrade](https://helm.sh/docs/v3/helm/helm_upgrade/))):

```bash
helm upgrade --install clinic deploy/chart/clinic-voice \
  --namespace clinic-staging --create-namespace \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-staging.yaml \
  --atomic --timeout 10m
```

Helm 4: ใน source ของ `helm upgrade` ธง `--atomic` ถูกทำเครื่องหมาย deprecated ให้ใช้ `--rollback-on-failure` แทน และธงนี้ตั้ง `--wait` เป็นโหมด `watcher` ([upgrade.go](https://raw.githubusercontent.com/helm/helm/main/pkg/cmd/upgrade.go) · [Helm 4 upgrade](https://helm.sh/docs/helm/helm_upgrade/)) · ใช้ `helm version` ดูรุ่นของเครื่อง build แล้วเลือกธงให้ตรง

- `--timeout` ค่าเริ่มต้น 5 นาที ต่อ 1 การทำงาน (เช่น hook job) · workload GPU ที่ต้องดึง image ใหญ่และโหลดโมเดลต้องตั้งยาวกว่านั้น ค่าจริง `(ยังไม่ได้วัด)`
- `--cleanup-on-fail` ลบ resource ใหม่ที่เกิดจาก upgrade ที่ล้มเหลว
- `--install` สร้าง release ถ้ายังไม่มี มิฉะนั้น upgrade

## rollback

```bash
helm history clinic -n clinic-production
helm rollback clinic <revision> -n clinic-production --wait
```

ไม่ระบุ revision (หรือ 0) = กลับรุ่นก่อนหน้า · `--wait` รอจน resource พร้อม ([helm rollback](https://helm.sh/docs/helm/helm_rollback/)) · rollback ย้อนได้เฉพาะสิ่งที่ chart คุม: migration ฐานข้อมูลและข้อความที่เข้า Kafka แล้วไม่ย้อนตาม ดู [`cicd-and-release`](../../cicd-and-release/SKILL.md) หัวข้อ 7 และ 9
