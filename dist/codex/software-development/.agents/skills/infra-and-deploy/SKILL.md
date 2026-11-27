---
name: infra-and-deploy
description: Use for Docker, Kubernetes, Terraform, Render or B2 and R2 storage
---

# infra-and-deploy — build, run and deploy infrastructure without surprise bills or data loss

> **One rule:** before anything costs money, becomes public, or deletes something that exists, the user sets the limit and approves it. Production runs the same image or plan that passed staging, and nothing is rebuilt on the way.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Dockerfile, Kubernetes manifest, Helm chart, staging to production | [`references/kubernetes-helm.md`](references/kubernetes-helm.md) · [`references/dockerfile.md`](references/dockerfile.md) · [`references/helm-chart.md`](references/helm-chart.md) · [`references/manifest-checklist.md`](references/manifest-checklist.md) |
| Terraform or OpenTofu: servers, databases, networks in code | [`references/infra-as-code.md`](references/infra-as-code.md) |
| A Docker sandbox for code you do not trust, or an isolated lab for an agent | [`references/docker-sandbox.md`](references/docker-sandbox.md) |
| Deploying to Render with `render.yaml` | [`references/render-deploy.md`](references/render-deploy.md) |
| Files or a static site on Backblaze B2 | [`references/backblaze-b2.md`](references/backblaze-b2.md) · [`references/deploy.md`](references/deploy.md) · [`references/costs.md`](references/costs.md) · [`references/versions-lifecycle.md`](references/versions-lifecycle.md) |
| Files or a static site on Cloudflare R2 | [`references/cloudflare-r2.md`](references/cloudflare-r2.md) |
| Presigned uploads and S3-style storage | [`references/s3-and-presign.md`](references/s3-and-presign.md) |

## Steps every part shares

1. **Search the repo before asking.** Read the existing config, scripts and variable names first, then ask the user once, with every question together.
2. **Pass the money gate before anything paid.** State the plan and monthly price from the current pricing page, with the date you checked it. If the user has not set a limit, create nothing paid.
3. **Show the plan before the change.** For Terraform, a person reads the `plan` in a pull request first. For a deletion, list the listing first, then ask.

## Check before done

- **Money:** the user sets the monthly ceiling before any paid resource is created. Stay in the free tier until then. Do not offer a yearly contract unless asked, because it is billed in full at the start.
- **Never delete or change what exists without asking:** buckets, files, file versions, application keys and lifecycle rules. After a delete, check the listing again, including hidden versions. Hiding a file keeps the data and keeps billing.
- **Private by default:** the bucket stays private until the user says to open it. The app holds a standard key or token limited to its own bucket, never a master key or an admin token.
- **Secrets never in code:** not in `render.yaml`, not in Dockerfile `ARG` or `ENV`, not in a Helm value file. Auto Sync on Render deploys a push by itself, so a push that adds a paid service passes the money gate again.
- **Sandbox limits:** never mount the Docker socket, the home folder, `.ssh`, `.aws` or browser profiles, and never open a port on every network card (use `127.0.0.1:`). Never solve a CAPTCHA on someone else's site.
- **Production:** a person approves the apply step. Never edit the cloud console by hand, because the next apply silently undoes it.

## References

- [`assets/`](assets/) — starter files: Dockerfiles, compose files, `render.yaml`, the B2 deploy workflow, the B2 and R2 presign scripts, and the sandbox script (`sandbox.ps1`)
- [`references/sources.md`](references/sources.md) — where the dated facts came from (checked 2026-11-05 for Render and B2)
