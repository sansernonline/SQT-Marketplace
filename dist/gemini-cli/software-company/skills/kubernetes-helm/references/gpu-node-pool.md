# GPU node pool สำหรับ STT/TTS — แยกจากเว็บ

ใช้กับขั้น 5 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 · GPU = Graphics Processing Unit · STT = Speech-to-Text · TTS = Text-to-Speech · node pool สร้างโดยผู้ดู cluster หรือ `infra-as-code` ไม่ใช่ agent นี้เอง (ราคาสูง)

## ภาพรวม 4 ชั้น

| ชั้น | ใครให้ | หมายเหตุ |
|---|---|---|
| 1 node ที่มี GPU และ driver | node pool ของ cloud | EKS: AMI แบบ accelerated มี driver ให้ แต่**ไม่มี** NVIDIA device plugin ใน AL2023 ต้องลงเอง ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · GKE: ใส่ `--accelerator type=...,count=...,gpu-driver-version=default\|latest\|disabled` ([GKE GPUs](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/gpus)) · AKS: แนะนำ AKS-managed GPU node pool ที่ลง driver, device plugin และ DCGM exporter ให้ ([AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu)) |
| 2 device plugin | NVIDIA device plugin หรือ GPU Operator | ทำให้ cluster เห็น resource `nvidia.com/gpu` ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GPU Operator ติดตั้ง driver · container toolkit · device plugin · DCGM exporter · GPU Feature Discovery ([overview](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html)) |
| 3 taint และ label | node pool | กันงานอื่นขึ้น GPU node |
| 4 pod ที่ขอ GPU | chart ของเรา | `nvidia.com/gpu` ใน `limits` · toleration · nodeSelector |

ใช้ GPU Operator กับ EKS AMI แล้ว ต้องปิดไม่ให้ Operator ลง driver และ toolkit ซ้ำ (AL2023) ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · ทำตามคู่มือของ cloud ที่ใช้ ไม่ผสมวิธี

## ขอ GPU ใน pod

```yaml
resources:
  requests: { cpu: "2", memory: 8Gi }
  limits:
    memory: 8Gi
    nvidia.com/gpu: 1
nodeSelector:
  accelerator: nvidia-gpu            # label ที่ node pool ติด · ชื่อและค่าเป็นของโปรเจกต์
tolerations:
  - key: nvidia.com/gpu              # ต้องตรงกับ taint จริงของ node pool
    operator: Exists
    effect: NoSchedule
```

- ระบุ GPU ใน `limits` เท่านั้นก็ได้ (request ถูกตั้งเท่า limit ให้) · ถ้าระบุทั้งสอง ต้องเท่ากัน · ระบุ `requests` อย่างเดียวไม่ได้ ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/))
- toleration แค่อนุญาตให้ขึ้น node ที่ติด taint ไม่ได้บังคับให้ไปที่นั่น ([Taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)) จึงต้องมี `nodeSelector` หรือ affinity คู่กันเสมอ
- เลือกชนิด GPU ด้วย label ของ node (ติดเอง หรือใช้ Node Feature Discovery) ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GKE ติด selector `cloud.google.com/gke-accelerator` ให้เอง

## taint ของแต่ละ cloud

| cloud | taint ที่เอกสารระบุ |
|---|---|
| GKE | ติด `nvidia.com/gpu=present:NoSchedule` ให้เฉพาะเมื่อ cluster มี node pool ที่ไม่ใช่ GPU อย่างน้อย 1 ชุด · ใส่ toleration ให้ pod ที่ขอ GPU อัตโนมัติ (ExtendedResourceToleration) |
| AKS | ตัวอย่างในเอกสารใช้ `--node-taints sku=gpu:NoSchedule` ตอนสร้าง node pool · taint และขนาด VM แก้ภายหลังไม่ได้ · pod ต้องมี toleration ตรงกัน |
| EKS | เอกสารหน้า AMI ไม่ระบุ taint · ตั้งเองตอนสร้าง node group `(ยังไม่ได้ตรวจ)` หน้าอื่น |

เขียน toleration ใน chart ให้เป็นค่าใน values (`gpu.tolerations`) เพราะชื่อ taint ต่างกันตาม cloud

## แยกงาน GPU ออกจากเว็บ

- web และ api ไม่มี toleration ของ GPU และไม่ขอ `nvidia.com/gpu` → ไม่มีวันขึ้น GPU node ที่แพง
- stt และ tts เป็น Deployment แยก มี `nodeSelector` + toleration + `limits.nvidia.com/gpu` · ตั้ง `startupProbe` ยาวสำหรับโหลดโมเดล · readiness บอกว่าโมเดลพร้อมแล้วจริง
- แยก namespace หรืออย่างน้อยแยก NetworkPolicy: เฉพาะ voice gateway เรียก stt/tts ได้
- PDB ของ stt/tts ตามจำนวน GPU node ที่มี: ถ้ามี node เดียว `maxUnavailable: 1` จะทำให้ drain ผ่านแล้วบริการหยุด ต้องตกลงเวลาหยุดกับผู้ใช้
- scale ด้วย HPA/KEDA ได้ แต่เพดานต้องไม่เกินจำนวน GPU ที่ node pool ขยายได้ และผู้ใช้ตั้งเพดานเงินไว้ก่อน (SKILL.md หัวข้อ "เงินและของนอกเครื่อง")
- `nvidia.com/gpu` ไม่ overcommit: pod 1 ตัวถือ GPU 1 ตัวทั้งตัว (การแบ่ง GPU เช่น time-slicing หรือ MIG `(ยังไม่ได้ตรวจ)` ต้องเปิดที่ device plugin และอ่านคู่มือ NVIDIA ก่อน)

## ตรวจว่า GPU ใช้ได้จริง

```bash
kubectl describe node <ชื่อ-gpu-node> | grep -A2 -i "nvidia.com/gpu"   # Capacity และ Allocatable ต้องเห็นเลข
kubectl get pods -n <ns> -o wide                                         # stt/tts ต้องอยู่บน GPU node
kubectl exec -n <ns> deploy/stt -- nvidia-smi                            # ต้องมี nvidia-smi ใน image
```

ถ้า pod ค้าง `Pending` ดู `kubectl describe pod` ช่อง Events: มักเป็น taint ไม่ตรง · label ไม่ตรง · GPU ถูกถือครบแล้ว · เวอร์ชัน CUDA ใน image ไม่ตรงกับ driver บน node (ดูตารางความเข้ากันของ NVIDIA ที่ AKS อ้างไว้ใน [AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu))
