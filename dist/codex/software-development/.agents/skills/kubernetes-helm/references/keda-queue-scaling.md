# ขยาย worker ตามงานค้างในคิวด้วย KEDA (Kafka consumer lag)

ใช้กับขั้น 3 ข้อย่อย "ขยายตามคิว" ของ [`SKILL.md`](../SKILL.md) · แหล่งทั้งหมดมาจาก keda.sh ตรวจ 2026-10-27 (KEDA 2.21 เป็นรุ่นล่าสุดที่หน้าเอกสารระบุ) · ฝั่ง Kafka เอง (partition · consumer group · commit offset) ดู [`kafka-streaming`](../../kafka-streaming/SKILL.md)

## KEDA ต่างจาก HPA อย่างไร

| เรื่อง | HPA ธรรมดา (`manifest-checklist.md`) | KEDA |
|---|---|---|
| ดูอะไร | CPU หรือ memory ของ pod | งานค้างจากแหล่งข้างนอก เช่น consumer lag ของ Kafka |
| ลงมาเหลือ 0 pod | ไม่ได้ | ได้ เมื่อไม่ใช้ trigger แบบ CPU หรือ memory |
| ใครตัดสินจำนวน pod | HPA controller | KEDA สร้างและดูแล HPA ให้ · KEDA คุมช่วง 0↔1 ส่วน HPA คุมช่วง 1↔N |

เหตุผลที่ต้องใช้: worker ที่ประมวลผลงานค้างอาจ CPU ต่ำ แต่คิวยาวเป็นหมื่น HPA แบบ CPU จะไม่ขยาย ([Concepts](https://keda.sh/docs/latest/concepts/) · [Scaling Deployments](https://keda.sh/docs/latest/concepts/scaling-deployments/))

ติดตั้ง (ผู้ดู cluster เป็นคนทำ ไม่ใช่ agent เอง) ([Deploy](https://keda.sh/docs/latest/deploy/)):

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace   # ล็อก --version ตามขั้น 4
```

หน้าเอกสารบอกว่า KEDA 2.21 ทดสอบกับ Kubernetes 1.34–1.36 · เทียบกับรุ่น cluster ของโปรเจกต์ก่อนติดตั้ง

## ตัวอย่าง: worker ของ Deep Research Agent

โจทย์: งานค้นข้อมูลเข้า topic `research-jobs` (12 partition) · worker อ่านด้วย consumer group `research-workers` · ไม่มีงาน = ไม่ต้องมี worker

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: research-worker
spec:
  scaleTargetRef:
    name: research-worker          # Deployment ใน namespace เดียวกัน
  pollingInterval: 30
  cooldownPeriod: 300
  minReplicaCount: 0
  maxReplicaCount: 12              # ไม่เกินจำนวน partition ของ topic
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: kafka.kafka.svc:9092   # ตัวอย่าง ใช้ค่าจริงของโปรเจกต์
        consumerGroup: research-workers
        topic: research-jobs
        lagThreshold: "5"
        activationLagThreshold: "0"
        limitToPartitionsWithLag: "true"
```

| ช่อง | ความหมายและค่าเริ่มต้น ([Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/) · [ScaledObject spec](https://keda.sh/docs/latest/reference/scaledobject-spec/)) |
|---|---|
| `lagThreshold` | lag รวมทุก partition ที่ต่อ 1 replica · ค่าเริ่มต้น 10 · ตัวอย่างตั้ง 5 เพราะ 1 งานค้นหนักและนาน (ค่าจริงต้องวัด `(ยังไม่ได้วัด)`) |
| `activationLagThreshold` | lag ที่ปลุกจาก 0 · ค่าเริ่มต้น 0 |
| `limitToPartitionsWithLag` | replica ไม่เกินจำนวน partition ที่ยังมี lag · ต้องระบุ `topic` และใช้คู่กับ `allowIdleConsumers: true` ไม่ได้ · ค่าเริ่มต้น false |
| `allowIdleConsumers` | true = replica เกินจำนวน partition ได้ · ค่าเริ่มต้น false · **ห้ามเปิด** เพราะ consumer ส่วนเกินนั่งว่าง |
| `minReplicaCount` / `maxReplicaCount` | ค่าเริ่มต้น 0 / 100 · ตั้ง max ให้ไม่เกินจำนวน partition (โดยปริยาย KEDA ก็ไม่ขยายเกินจำนวน partition อยู่แล้ว) |
| `cooldownPeriod` | รอ 300 วินาทีหลัง trigger เงียบก่อนลงเหลือ 0 · ใช้กับช่วงลงเหลือ 0 เท่านั้น |
| `pollingInterval` | ตรวจ trigger ทุก 30 วินาที (ค่าเริ่มต้น) |
| `fallback` | จำนวน replica สำรองเมื่อ scaler อ่านค่าไม่ได้ (เช่น Kafka ล่ม) · ถ้าใส่ต้องมี `failureThreshold` และ `replicas` |

ถ้าต้องการให้มี worker อย่างน้อย 1 ตัวเสมอ (ไม่รับ cold start) ตั้ง `minReplicaCount: 1`

## ข้อควรระวัง

- **จำนวน partition คือเพดานจริง.** เพิ่ม partition ภายหลังทำให้ลำดับ key เปลี่ยนและ rebalance · ตัดสินใจจำนวน partition ตั้งแต่ออกแบบ topic ([`kafka-streaming`](../../kafka-streaming/SKILL.md)) ก่อนตั้ง `maxReplicaCount`
- **ห้ามมี HPA ของเราเองคู่กับ ScaledObject บน Deployment เดียวกัน.** KEDA สร้าง HPA ให้แล้ว admission webhook ของ KEDA ตรวจกรณี ScaledObject 2 ตัวชี้ Deployment เดียวกัน ([Concepts](https://keda.sh/docs/latest/concepts/)) · จะย้าย HPA เดิมให้ KEDA ดู ให้ใช้ annotation `scaledobject.keda.sh/transfer-hpa-ownership: "true"` ตาม [Scaling Deployments](https://keda.sh/docs/latest/concepts/scaling-deployments/) · เอา `spec.replicas` ออกจาก Deployment เหมือนกรณี HPA
- **trigger CPU หรือ memory ลงเหลือ 0 ไม่ได้** · ใช้ Kafka trigger อย่างเดียวถ้าต้องการ scale-to-zero
- **worker ที่ทำงานนาน** ต้องตั้ง `terminationGracePeriodSeconds` ให้พอจบงานที่ถืออยู่ และ commit offset หลังทำเสร็จ ไม่ใช่ตอนรับ · ไม่งั้นตอนลดจำนวน pod งานหาย หรือถูกทำซ้ำ (ทำซ้ำได้ต้องออกแบบให้ idempotent ตาม `principle-safe-to-rerun`) · ลำดับที่ HPA เลือก pod ที่จะถอด `(ยังไม่ได้ตรวจ)`
- **Kafka มี SASL หรือ TLS** ต้องใส่ข้อมูลยืนยันตัวตนให้ scaler ผ่าน `TriggerAuthentication` ที่อ้าง Secret ของ cluster ไม่ใส่รหัสใน `metadata` · รูปแบบดูหัวข้อ SASL/TLS ในหน้า [Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/) (ยังไม่ได้ตรวจรายละเอียดช่องในหน้านั้น)
- **ใน Helm chart** เขียน ScaledObject เป็น template ที่เปิดด้วย `keda.enabled` และปิด HPA ตัวเดิมด้วยค่า `autoscaling.enabled` ตรงข้าม เพื่อไม่ให้ 2 ตัวชน · ตรวจด้วย `helm template` ว่าไม่มีทั้ง HPA และ ScaledObject ของ Deployment เดียวกัน
- **kubeconform** ไม่มี schema ของ ScaledObject ในตัว เพราะเป็น CRD · catalog ของ datreeio มี `keda.sh/scaledobject_v1alpha1.json` ([ไดเรกทอรี](https://github.com/datreeio/CRDs-catalog/tree/main/keda.sh) · ตรวจ 2026-10-27) จึงใส่ `-schema-location` ของ catalog ได้ · CRD ตัวอื่นที่ไม่มีใน catalog ใช้ `-ignore-missing-schemas` แล้วจดไว้ว่าข้ามตัวไหน (ดู [`helm-chart.md`](helm-chart.md))
