# GPU node pool for STT/TTS: separate from the web

Used with step 5 of [`SKILL.md`](kubernetes-helm.md) · checked 2026-10-27 · GPU = Graphics Processing Unit · STT = Speech-to-Text · TTS = Text-to-Speech · the node pool is created by the cluster operator or `infra-as-code.md`, not by this agent itself (high cost)

## Overview: 4 layers

| Layer | Who provides it | Note |
|---|---|---|
| 1 A node with a GPU and driver | The cloud's node pool | EKS: the accelerated AMI includes the driver but **does not** include the NVIDIA device plugin in AL2023; install it yourself ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · GKE: add `--accelerator type=...,count=...,gpu-driver-version=default\|latest\|disabled` ([GKE GPUs](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/gpus)) · AKS: an AKS-managed GPU node pool is recommended; it installs the driver, device plugin and DCGM exporter for you ([AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu)) |
| 2 Device plugin | NVIDIA device plugin or GPU Operator | Lets the cluster see the `nvidia.com/gpu` resource ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GPU Operator installs the driver · container toolkit · device plugin · DCGM exporter · GPU Feature Discovery ([overview](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html)) |
| 3 Taint and label | The node pool | Keeps other workloads off GPU nodes |
| 4 A pod that asks for a GPU | Our chart | `nvidia.com/gpu` in `limits` · toleration · nodeSelector |

When you use the GPU Operator with the EKS AMI, you must stop the Operator from installing the driver and toolkit again (AL2023) ([EKS GPU AMI](https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)) · follow the guide of the cloud you use; do not mix methods

## Ask for a GPU in a pod

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

- You may specify the GPU in `limits` only (the request is set equal to the limit for you) · if you specify both, they must be equal · specifying `requests` alone is not allowed ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/))
- A toleration only allows scheduling onto a tainted node; it does not force the pod to go there ([Taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)), so always pair it with `nodeSelector` or affinity
- Choose the GPU type with node labels (add them yourself, or use Node Feature Discovery) ([Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)) · GKE adds the selector `cloud.google.com/gke-accelerator` for you

## Taint of each cloud

| Cloud | Taint named in the docs |
|---|---|
| GKE | Adds `nvidia.com/gpu=present:NoSchedule` only when the cluster has at least 1 non-GPU node pool · automatically adds a toleration to pods that ask for a GPU (ExtendedResourceToleration) |
| AKS | The example in the docs uses `--node-taints sku=gpu:NoSchedule` when creating the node pool · the taint and VM size cannot be changed later · pods must have a matching toleration |
| EKS | The AMI page names no taint · set it yourself when creating the node group `(ยังไม่ได้ตรวจ)` (not yet checked) on other pages |

Write the toleration in the chart as a value in values (`gpu.tolerations`), because taint names differ by cloud

## Keep GPU work apart from the web

- web and api have no GPU toleration and do not ask for `nvidia.com/gpu` → they can never land on the expensive GPU nodes
- stt and tts are separate Deployments with `nodeSelector` + toleration + `limits.nvidia.com/gpu` · set a long `startupProbe` for model loading · readiness says the model is really ready
- Separate namespaces, or at least separate NetworkPolicy: only the voice gateway may call stt/tts
- PDB of stt/tts per the number of GPU nodes available: with a single node, `maxUnavailable: 1` lets the drain pass and then the service stops; agree on the downtime with the user
- You may scale with HPA/KEDA, but the ceiling must not exceed the number of GPUs the node pool can grow to, and the user must have set a money ceiling first (`kubernetes-helm.md` section "เงินและของนอกเครื่อง" (money and things outside the machine))
- `nvidia.com/gpu` is not overcommitted: 1 pod holds 1 whole GPU (GPU sharing such as time-slicing or MIG `(ยังไม่ได้ตรวจ)` (not yet checked) must be enabled at the device plugin, and read the NVIDIA guide first)

## Check that the GPU is really usable

```bash
kubectl describe node <ชื่อ-gpu-node> | grep -A2 -i "nvidia.com/gpu"   # Capacity และ Allocatable ต้องเห็นเลข
kubectl get pods -n <ns> -o wide                                         # stt/tts ต้องอยู่บน GPU node
kubectl exec -n <ns> deploy/stt -- nvidia-smi                            # ต้องมี nvidia-smi ใน image
```

If a pod is stuck `Pending`, look at the Events field of `kubectl describe pod`: it is usually a taint mismatch · label mismatch · all GPUs already held · the CUDA version in the image not matching the driver on the node (see the NVIDIA compatibility table that AKS references in [AKS GPUs](https://learn.microsoft.com/en-us/azure/aks/use-nvidia-gpu))
