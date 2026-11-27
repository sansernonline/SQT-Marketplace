# Kubernetes manifest: parts a workload must have

Used with step 3 of [`SKILL.md`](kubernetes-helm.md) · checked 2026-10-27 · the numbers in the examples (CPU · memory · replica count) are starting points and must be adjusted by real measurement

Contents

- [Deployment](#deployment-of-a-web-service-short)
- [PodDisruptionBudget](#poddisruptionbudget-pdb)
- [HorizontalPodAutoscaler](#horizontalpodautoscaler-hpa)
- [NetworkPolicy](#networkpolicy)
- [rollout and rollback](#rollout-and-rollback)

## Deployment of a web service (short)

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

`maxUnavailable: 0` is our choice, not the default (the default of both `maxSurge` and `maxUnavailable` is 25% · [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) checked 2026-10-27) · set to 0 so the new pod is ready before the old pod is removed; spare capacity is required

## Why each part is there

| Part | Fact from the docs (checked 2026-10-27) |
|---|---|
| requests/limits | A request is the guaranteed amount the scheduler uses to choose a node · a limit is the ceiling · CPU over the ceiling is throttled, while memory over it may get the container killed (OOM) ([Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)) · we set a memory limit but no CPU limit; this is team practice, not a requirement of the docs. If the cluster enforces a CPU limit, set it as required |
| `startupProbe` | Gives startup time = `failureThreshold × periodSeconds` (30 × 10 = 300 seconds), after which liveness starts working · if startup does not pass before the time runs out, the container is killed ([Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)) |
| `readinessProbe` | A pod that is not ready gets no traffic from the Service, and it runs for the whole life of the container (Probes) |
| liveness and readiness use different paths | Never let liveness check the database or an external service; see [`web-service-essentials`](../../web-service-essentials/SKILL.md) item 1 |
| securityContext | The Restricted level of Pod Security Standards requires: `runAsNonRoot: true` · `allowPrivilegeEscalation: false` · drop capability `ALL` (only `NET_BIND_SERVICE` may be added back) · `seccompProfile` set to `RuntimeDefault` or `Localhost` ([Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)) · we add `readOnlyRootFilesystem` ourselves, `(ยังไม่ได้ตรวจในหน้า)` (not yet checked on that page) that the standard does not require it · an app that writes files needs an `emptyDir` (for example `/tmp`) |
| `terminationGracePeriodSeconds` | Default is 30 seconds `(ยังไม่ได้ตรวจในหน้า)` (not yet checked on that page) · set it higher than the time the app needs to shut down |

Enforce for a whole namespace: `kubectl label namespace <ns> pod-security.kubernetes.io/enforce=restricted` · for a GPU workload that hits Restricted limits, use a separate namespace and explain the exception; do not lower the whole system

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

- A PDB protects only against voluntary removal such as `kubectl drain`; it does not protect against a sudden node failure ([PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/))
- The docs recommend `maxUnavailable` because it adjusts with the replica count by itself · set it to 0, or `minAvailable` equal to the replica count, and the drain will never finish
- Never let 2 PDBs cover the same pod (eviction is rejected)
- A service running a single replica should not have a fake PDB: the docs say to have no PDB, or to use `maxUnavailable: 0` and coordinate the downtime outside Kubernetes

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

- Every container must have a CPU request, otherwise HPA does nothing for that metric ([HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/))
- When using HPA, remove `spec.replicas` from the Deployment, otherwise every `kubectl apply` sets the count back (the docs have a migration procedure that keeps pods from disappearing temporarily)
- 300 seconds is already the default for scale down; it is written so people can see it
- A workload that scales by queue depth (a Kafka consumer) uses another metric, for example KEDA `(ยังไม่ได้ตรวจ)` (not yet checked) · see [`async-messaging`](../../async-messaging/SKILL.md) and [`keda-queue-scaling.md`](keda-queue-scaling.md)

## NetworkPolicy

Start by closing every way in to the namespace, then open the needed paths one at a time:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes: [Ingress]
```

- A policy has no effect at all if the cluster has no network plugin (CNI) that enforces it ([Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)) · check with the cluster operator first; do not write one and believe it protects
- If you also close egress, you must explicitly open DNS (port 53) `(ยังไม่ได้ตรวจในหน้า)` (not yet checked on that page) · and open egress to Kafka · the database · the STT/TTS service one path at a time
- Example paths to open: ingress controller → web · web → api · api → Kafka · api → stt/tts

## rollout and rollback

```bash
kubectl rollout status deployment/api --timeout=300s
kubectl rollout history deployment/api
kubectl rollout undo deployment/api                    # กลับรุ่นก่อนหน้า
kubectl rollout undo deployment/api --to-revision=3    # กลับรุ่นที่ระบุ
```

- `undo` without a revision = go back to the latest previous version ([kubectl rollout undo](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/))
- A Deployment keeps old ReplicaSets according to `revisionHistoryLimit` (default 10) · a rollout that makes no progress beyond `progressDeadlineSeconds` (default 600) is treated as failed ([Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
- For a release installed with Helm, roll back with `helm rollback`, not `kubectl rollout undo`, because Helm will not know the state changed
