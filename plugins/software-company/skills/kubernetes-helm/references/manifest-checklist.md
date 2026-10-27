# Manifest Kubernetes — ชิ้นส่วนที่ workload ต้องมี

ใช้กับขั้น 3 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · ค่าตัวเลขในตัวอย่าง (CPU · memory · จำนวน replica) เป็นจุดเริ่ม ต้องปรับตามการวัดจริง

สารบัญ

- [Deployment](#deployment-ของ-web-service-ย่อ)
- [PodDisruptionBudget](#poddisruptionbudget-pdb)
- [HorizontalPodAutoscaler](#horizontalpodautoscaler-hpa)
- [NetworkPolicy](#networkpolicy)
- [rollout และ rollback](#rollout-และ-rollback)

## Deployment ของ web service (ย่อ)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  # ไม่ใส่ replicas ถ้ามี HPA (ดูด้านล่าง)
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 25%, maxUnavailable: 0 }
  selector:
    matchLabels: { app.kubernetes.io/name: api }
  template:
    metadata:
      labels: { app.kubernetes.io/name: api }
    spec:
      terminationGracePeriodSeconds: 30
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: api
          image: registry.example.com/clinic/api@sha256:<digest-จริง>
          ports: [{ name: http, containerPort: 8080 }]
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          startupProbe:
            httpGet: { path: /health/live, port: http }
            failureThreshold: 30
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /health/live, port: http }
            periodSeconds: 10
          readinessProbe:
            httpGet: { path: /health/ready, port: http }
            periodSeconds: 5
          volumeMounts:
            - { name: tmp, mountPath: /tmp }
      volumes:
        - { name: tmp, emptyDir: {} }
```

`maxUnavailable: 0` เป็นตัวเลือกของเรา ไม่ใช่ค่าเริ่มต้น (ค่าเริ่มต้นของทั้ง `maxSurge` และ `maxUnavailable` คือ 25% · [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) ตรวจ 2026-10-27) · ตั้ง 0 เพื่อให้ pod ใหม่พร้อมก่อนถอด pod เก่า ต้องมี capacity เผื่อ

## ทำไมแต่ละส่วนอยู่ตรงนั้น

| ส่วน | ข้อเท็จจริงจากเอกสาร (ตรวจ 2026-10-27) |
|---|---|
| requests/limits | request คือยอดที่รับประกัน scheduler ใช้เลือก node · limit คือเพดาน · CPU เกินเพดานถูก throttle ส่วน memory เกินแล้วอาจถูกฆ่า (OOM) ([Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)) · เราตั้ง memory limit แต่ไม่ตั้ง CPU limit เป็นแนวปฏิบัติของทีม ไม่ใช่ข้อบังคับของเอกสาร ถ้า cluster บังคับ CPU limit ให้ตั้งตามนั้น |
| `startupProbe` | ให้เวลาเริ่มระบบ = `failureThreshold × periodSeconds` (30 × 10 = 300 วินาที) แล้ว liveness ค่อยทำงาน · ถ้า startup ไม่ผ่านจน หมดเวลา container ถูกฆ่า ([Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)) |
| `readinessProbe` | pod ที่ยังไม่ ready จะไม่ได้รับ traffic จาก Service และทำงานตลอดอายุ container (Probes) |
| liveness กับ readiness คนละ path | ห้ามให้ liveness เช็คฐานข้อมูลหรือบริการภายนอก ดู [`web-service-essentials`](../../web-service-essentials/SKILL.md) หัวข้อ 1 |
| securityContext | Pod Security Standards ระดับ Restricted ต้องการ: `runAsNonRoot: true` · `allowPrivilegeEscalation: false` · drop capability `ALL` (เติมได้เฉพาะ `NET_BIND_SERVICE`) · `seccompProfile` เป็น `RuntimeDefault` หรือ `Localhost` ([Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)) · `readOnlyRootFilesystem` เราเติมเอง `(ยังไม่ได้ตรวจในหน้า)` ว่ามาตรฐานไม่บังคับ · แอปที่เขียนไฟล์ต้องมี `emptyDir` (เช่น `/tmp`) |
| `terminationGracePeriodSeconds` | ค่าเริ่มต้น 30 วินาที `(ยังไม่ได้ตรวจในหน้า)` · ตั้งให้มากกว่าเวลาที่แอปใช้ปิดตัว |

บังคับทั้ง namespace: `kubectl label namespace <ns> pod-security.kubernetes.io/enforce=restricted` · workload GPU ที่ติดข้อจำกัดของ Restricted ให้แยก namespace และอธิบายข้อยกเว้น ไม่ลดทั้งระบบ

## PodDisruptionBudget (PDB)

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
spec:
  maxUnavailable: 1
  selector:
    matchLabels: { app.kubernetes.io/name: api }
```

- PDB กันได้เฉพาะการถอดแบบสมัครใจ เช่น `kubectl drain` ไม่กัน node พังกะทันหัน ([PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/))
- เอกสารแนะนำ `maxUnavailable` เพราะปรับตามจำนวน replica เอง · ตั้งเป็น 0 หรือ `minAvailable` เท่าจำนวน replica แล้ว drain จะไม่จบ
- ห้ามให้ 2 PDB ครอบ pod เดียวกัน (eviction ถูกปฏิเสธ)
- service ที่รัน replica เดียวไม่ต้องมี PDB หลอก ๆ: เอกสารบอกให้ไม่มี PDB หรือใช้ `maxUnavailable: 0` พร้อมประสานเวลาหยุดนอก Kubernetes

## HorizontalPodAutoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 60 }
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
```

- ต้องมี CPU request ในทุก container ไม่งั้น HPA ไม่ทำอะไรกับ metric นั้น ([HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/))
- เมื่อใช้ HPA ให้เอา `spec.replicas` ออกจาก Deployment ไม่งั้น `kubectl apply` ทุกครั้งตั้งจำนวนกลับ (เอกสารมีขั้นตอนย้ายแบบไม่ให้ pod หายชั่วคราว)
- 300 วินาทีคือค่าเริ่มต้นของ scale down อยู่แล้ว เขียนไว้ให้คนเห็น
- workload ที่ scale ตามความลึกคิว (Kafka consumer) ใช้ metric อื่น เช่น KEDA `(ยังไม่ได้ตรวจ)` · ดู [`kafka-streaming`](../../kafka-streaming/SKILL.md) และ [`keda-queue-scaling.md`](keda-queue-scaling.md)

## NetworkPolicy

เริ่มจากปิดทุกทางเข้าใน namespace แล้วเปิดทีละเส้นที่ต้องใช้:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes: [Ingress]
```

- policy ไม่มีผลเลยถ้า cluster ไม่มี network plugin (CNI) ที่บังคับใช้ ([Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)) · ตรวจกับผู้ดู cluster ก่อน อย่าเขียนแล้วเชื่อว่ากันได้
- ถ้าปิดขาออกด้วย ต้องเปิด DNS (พอร์ต 53) อย่างชัดเจน `(ยังไม่ได้ตรวจในหน้า)` · และเปิดขาออกไป Kafka · ฐานข้อมูล · บริการ STT/TTS เป็นรายเส้น
- ตัวอย่างเส้นที่เปิด: ingress controller → web · web → api · api → Kafka · api → stt/tts

## rollout และ rollback

```bash
kubectl rollout status deployment/api --timeout=300s
kubectl rollout history deployment/api
kubectl rollout undo deployment/api                    # กลับรุ่นก่อนหน้า
kubectl rollout undo deployment/api --to-revision=3    # กลับรุ่นที่ระบุ
```

- `undo` ไม่ระบุ revision = กลับรุ่นล่าสุดก่อนหน้า ([kubectl rollout undo](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/))
- Deployment เก็บ ReplicaSet เก่าตาม `revisionHistoryLimit` (ค่าเริ่มต้น 10) · rollout ที่ไม่คืบหน้าเกิน `progressDeadlineSeconds` (ค่าเริ่มต้น 600) ถูกมองว่าล้มเหลว ([Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
- release ที่ติดตั้งด้วย Helm ให้ rollback ด้วย `helm rollback` ไม่ใช่ `kubectl rollout undo` เพราะ Helm จะไม่รู้ว่า state เปลี่ยน
