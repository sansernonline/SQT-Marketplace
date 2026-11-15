# Helm chart: values structure per environment, secrets, and commands

Used with steps 4 6 7 8 9 of [`SKILL.md`](../SKILL.md) · checked 2026-10-27 · Helm 4 is the version the [helm.sh/docs](https://helm.sh/docs/overview/) page names as newest (4.3.1) · Helm 3 still has docs (3.22.1)

Contents

- [Chart structure](#chart-structure)
- [values per environment](#values-per-environment)
- [Secrets stay out of values](#secrets-stay-out-of-values)
- [Check without touching the cluster](#check-without-touching-the-cluster)
- [Pin chart versions](#pin-chart-versions)
- [deploy](#deploy)
- [rollback](#rollback)

## Chart structure

```
deploy/chart/clinic-voice/
├─ Chart.yaml            # version = รุ่นของ chart · appVersion = รุ่นของระบบ
├─ values.yaml           # ค่าเริ่มต้นที่ปลอดภัย ไม่มีค่าลับ ไม่มีรุ่น image จริง
├─ values.schema.json    # JSON Schema ให้ helm lint ตรวจชนิดของค่า
├─ values-staging.yaml   # เฉพาะที่ต่างจาก values.yaml
├─ values-production.yaml
└─ templates/            # deployment · service · pdb · hpa หรือ scaledobject · networkpolicy · externalsecret
```

- Use 1 chart per system that is released together, with the value `services.<name>` per service · or 1 chart per service if they are released with separate versions · choose one approach for the whole project
- Write values in camelCase starting with a lowercase letter · use maps keyed by name instead of lists (so `--set` can override) · comment every value ([Values best practices](https://helm.sh/docs/chart_best_practices/values/))

## values per environment

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

The template builds the image like this to force a digest to be present: `{{ .repository }}@{{ required "api.image.digest is required" .digest }}`

| environment | Differs from default in | Must not differ |
|---|---|---|
| staging | Fewer replicas · fewer resources · test domain · 1 GPU | The image digest must be the one that goes to production |
| production | More replicas · strict PDB · higher HPA/KEDA ceiling | Template structure · probe types · securityContext |

The order of `-f` matters: the rightmost file wins (`-f values.yaml -f values-production.yaml`) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))

## Secrets stay out of values

- Never put passwords, tokens or keys in `values*.yaml`, `--set` or `Chart.yaml` · a Kubernetes Secret is only base64-encoded, which "provides no additional confidentiality", and is stored unencrypted in etcd by default ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/))
- Options (choose one per project, and see [`config-and-secrets`](../../config-and-secrets/SKILL.md) item 6):

| Way | Suits when | Good to know (checked 2026-10-27) |
|---|---|---|
| External Secrets Operator | You already have a vault or a cloud secret manager | `SecretStore` holds the connection · `ExternalSecret` says which value to pull, then creates the Secret and updates it when the source changes ([ESO](https://external-secrets.io/latest/introduction/overview/)) |
| Sealed Secrets | No vault, a small team, want encrypted values kept in git | `kubeseal` encrypts; only the controller in that cluster can decrypt · you must back up the controller's key or you cannot recover · the key rotates every 30 days by default, but that does not replace really changing the password ([sealed-secrets](https://github.com/bitnami-labs/sealed-secrets)) |
| Secrets Store CSI Driver | You do not want secrets to be Secrets in the cluster | Mounts from an external store as a volume only for allowed pods ([Secrets good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)) |

- Our chart creates only an `ExternalSecret` or `SealedSecret` and lets pods reference the Secret name through `secretKeyRef` · the real values never pass through the agent's hands
- Let RBAC read Secrets only by the names needed (`resourceNames`) · the `list` permission on Secrets is the same as being able to read all values

## Check without touching the cluster

```bash
helm lint deploy/chart/clinic-voice --strict -f deploy/chart/clinic-voice/values-production.yaml
helm template clinic deploy/chart/clinic-voice \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-production.yaml \
  | kubeconform -strict -summary -kubernetes-version <รุ่น-k8s-ของ-cluster> \
      -schema-location default \
      -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
```

- `helm lint --strict` makes warnings fail too · ERROR means the chart cannot be installed ([helm lint](https://helm.sh/docs/helm/helm_lint/))
- `kubeconform`: `-strict` rejects fields not in the schema · the default of `-kubernetes-version` is `master`, so set it to match the cluster · `-schema-location default` must be paired with the CRD catalog, otherwise built-in types are not found · for a CRD not in the catalog (ScaledObject is in the datreeio catalog, checked 2026-10-27) use `-ignore-missing-schemas` and note it ([kubeconform](https://github.com/yannh/kubeconform))
- Run lint+template on both values files (staging and production), not just one
- Also check policy with the team's tool if there is one (`ยังไม่ได้ตรวจ` (not yet checked) which one the team chose)

## Pin chart versions

- For a chart installed from a registry, always give `--version` (if omitted, the latest is used) ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))
- OCI chart: `helm upgrade --install <release> oci://<registry>/<repo>/<chart> --version <x.y.z>` · you can pin by digest by appending `@sha256:<digest>` to the URL, and the docs say "more secure than a tag because digests are immutable" ([Registries](https://helm.sh/docs/topics/registries/) · that page says it has not yet been updated for Helm 4)
- External charts (ingress controller · KEDA · GPU Operator): pin `--version` in the pipeline and update through a PR
- You can sign with provenance: compare the chart against the provenance file to confirm it was not altered and to know who signed ([Provenance](https://helm.sh/docs/topics/provenance/)) · use it when the chart comes from outside the team

## deploy

Helm 3 (`--atomic` = roll back on failure, and turns on `--wait` by itself ([Helm 3 upgrade](https://helm.sh/docs/v3/helm/helm_upgrade/))):

```bash
helm upgrade --install clinic deploy/chart/clinic-voice \
  --namespace clinic-staging --create-namespace \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-staging.yaml \
  --atomic --timeout 10m
```

Helm 4: the [Helm 4.3.1 upgrade](https://helm.sh/docs/helm/helm_upgrade/) page (checked 2026-10-27) does not show the `--atomic` flag; it shows only `--rollback-on-failure`, which the docs say sets `--wait` to `watcher` when used · the claim that `--atomic` is still accepted but deprecated comes from the source ([upgrade.go](https://raw.githubusercontent.com/helm/helm/main/pkg/cmd/upgrade.go) checked 2026-10-27), not from a docs page, so in Helm 4 use only `--rollback-on-failure` · use `helm version` to see the build machine's version and pick the matching flag

- `--timeout` defaults to 5 minutes per operation (for example a hook job) · a GPU workload that must pull a big image and load a model needs a longer value; the real value is `(ยังไม่ได้วัด)` (not yet measured)
- `--cleanup-on-fail` deletes new resources created by a failed upgrade
- `--install` creates the release if it does not exist, otherwise upgrades

## rollback

```bash
helm history clinic -n clinic-production
helm rollback clinic <revision> -n clinic-production --wait
```

No revision (or 0) = go back to the previous version · `--wait` waits until resources are ready ([helm rollback](https://helm.sh/docs/helm/helm_rollback/)) · rollback reverses only what the chart controls: database migrations and messages already in Kafka are not reversed; see [`cicd-and-release`](../../cicd-and-release/SKILL.md) items 7 and 9
