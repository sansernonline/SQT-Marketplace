# Lane: infrastructure · cloud · container

Open when the repo has Terraform · OpenTofu · Pulumi · docker-compose · Dockerfile · Kubernetes YAML · Helm charts · cloud config files, or when the user runs `/security-scan infra` · This list was moved from the old infrastructure checklist of the `/security-scan` command (before 2026-11-10 it lived in `security-scan/SKILL.md`)

## Lane rules

- Check from files in the repo only · never scan ports, never call a real cloud, never open a real bucket to prove it, unless the user allows it in writing and it is a test environment
- Results from `trivy config` · `checkov` · `tfsec` · `hadolint` are candidates for this lane, not findings yet (section 3 of SKILL.md)
- The real state on the cloud may differ from the files (edited in the console outside IaC), so these usually end at `needs_validation` if you have no permission to read the real state
- How to write and fix IaC is in [`infra-as-code`](../../infra-as-code/SKILL.md) · [`kubernetes-helm`](../../kubernetes-helm/SKILL.md) · this file only says what to hunt

## Hunt list

| Type (`class`) | What to hunt | Signals in files | How to prove | Often falsely reported when |
|---|---|---|---|---|
| `exposed-port` | A port or service open to the whole internet that should be internal (database · Redis · SSH · admin page) | security group `0.0.0.0/0` · `ports:` in compose that binds `0.0.0.0` · Kubernetes `Service` of type `LoadBalancer` · a database NodePort | Read the ingress rules, then trace whether a path from the internet to the service is really open or another firewall layer blocks it | Port 80 · 443 of a website that is meant to be open · machines in a private network with no public IP |
| `weak-iam` | Permissions of a role · service account · user broader than the job | `"Action": "*"` · `"Resource": "*"` · `AdministratorAccess` · `roles/owner` · `cluster-admin` bound to an app · write permission when the job only reads | Compare the permissions granted with what the code really calls; if it is more and the code can be breached, the result is access to other resources | A pipeline role that is meant to be broad and is guarded by conditions · an admin role not bound to the app |
| `public-storage` | A bucket · blob container · database that is public or reachable without authentication | ACL `public-read` · policy `"Principal": "*"` · block public access turned off · a database with no password or open on `0.0.0.0` | Read the policy to see whether objects can be listed and read without credentials, and what data the content is | The bucket of a public website that holds only public files (CSS · logo images) |
| `unencrypted-data` | Storage or transport that is not encrypted | `encrypted = false` · no `kms_key` · `ssl_enforcement` off · `HTTP` listener with no redirect · database connection without TLS | Read the values of resources that hold personal data or secrets, then see whether another layer encrypts instead | Test data · temporary volumes that hold no real data |
| `missing-security-headers` | A web app or API does not send the basic protective headers | No `Strict-Transport-Security` · `Content-Security-Policy` · `X-Content-Type-Options` · `X-Frame-Options` in the reverse proxy · CDN · app config | Read the proxy config and app code to see whether anywhere adds the headers | An API with no web pages (CSP is irrelevant) · headers the CDN adds outside the repo |
| `insecure-default` | An insecure default value carried into use | default password · debug on in production · CORS `*` with credentials · a cluster with anonymous auth on · a container running as `root` · `privileged: true` | See whether that value is used in the real production files, not only in dev files | A compose file for a dev machine that is never deployed |
| `container-image-risk` | An image with vulnerabilities or an untrustworthy source | `FROM xxx:latest` · an old base image whose `trivy image` result has high-level CVEs · not pinned by digest · build tools left in the final image · forgot to set `USER` | Run or read the `trivy image` result, then check whether that CVE reaches code the image really uses (like `vulnerable-dep-reachable` in [`classes-supply-chain`](classes-supply-chain.md)) | A CVE in a package the image never calls · the first stage of a multi-stage build that is not shipped |

## Relation to other lanes

- build and CI/CD (workflows · lockfiles · registries) are in [`classes-supply-chain`](classes-supply-chain.md)
- Secrets leaked in IaC go to section 4 of [`attack-classes`](attack-classes.md) · SSRF to cloud metadata is in section 9 of the same file
- Severity levels follow section 5 of SKILL.md, only for confirmed items
