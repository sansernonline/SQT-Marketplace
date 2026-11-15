# Production Dockerfile: template and reasons

Used with step 2 of [`SKILL.md`](../SKILL.md) · checked 2026-10-27 against [Docker build best practices](https://docs.docker.com/build/building/best-practices/) and [Build secrets](https://docs.docker.com/build/building/secrets/)

## Multi-stage web service template (Node)

```dockerfile
# syntax=docker/dockerfile:1
# ล็อกทั้ง tag และ digest · tag ไว้ให้คนอ่าน digest คือตัวที่ใช้จริง · เลข digest ด้านล่างเป็นตัวอย่าง ต้องแทนด้วยค่าจริงจาก registry
FROM node:22-slim@sha256:<digest-จริง> AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-slim@sha256:<digest-จริง> AS runtime
ENV NODE_ENV=production
WORKDIR /app
# UID/GID ระบุเอง ไม่ให้เปลี่ยนตามรอบ build · ต้องตรงกับ runAsUser ใน manifest
RUN groupadd --gid 10001 app && useradd --uid 10001 --gid 10001 --no-log-init --no-create-home app
COPY --from=build --chown=10001:10001 /app/dist ./dist
COPY --from=build --chown=10001:10001 /app/node_modules ./node_modules
USER 10001:10001
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

- The example above uses `node:22-slim` only to show the shape. Look up the real base image version in the registry on the build date, then pin the digest (`(ยังไม่ได้ตรวจ)` (not yet checked) whether 22 is still a usable version on the date you use this skill)
- `CMD` uses the exec form (`["node", ...]` ) so the process receives the SIGTERM signal directly and shuts down cleanly per `web-service-essentials` item 4

## Why do it this way (checked 2026-10-27)

| Item | Reason from the docs |
|---|---|
| multi-stage | Separate the build stage from the run stage to shrink the final image ([best practices](https://docs.docker.com/build/building/best-practices/)) |
| Pin the digest | "By pinning your images to a digest, you're guaranteed to always use the same image version" · trade-off: no automatic security patches; the docs recommend Dependabot (`package-ecosystem: "docker"`) to push versions forward on a schedule |
| `USER` not root | "If a service can run without privileges, use `USER`" · set the UID/GID yourself so it is repeatable |
| `.dockerignore` | Uses the same format as `.gitignore` to exclude files from the build context |
| Reduce size | Use a small base · install no more packages than needed · `apt-get install --no-install-recommends` then `rm -rf /var/lib/apt/lists/*` in the same `RUN` |

## Minimum `.dockerignore`

```
.git
.env
.env.*
*.pem
*.key
node_modules
dist
coverage
*.md
Dockerfile*
```

`.env` and keys must be on this list in every project, otherwise `COPY . .` carries secrets into a layer

## Secrets at build time

- Never use `ARG` or `ENV` for secrets, because "they persist in the final image" ([Build secrets](https://docs.docker.com/build/building/secrets/))
- If the build needs a token (for example a private package), use a secret mount, which exists only for that `RUN`:

```dockerfile
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN="$(cat /run/secrets/npm_token)" npm ci
```

```bash
docker build --secret id=npm_token,src=./npm_token.txt .
```

- Unsetting the variable in a later layer does not help: the value stays in the layer that set it (Docker best practices)
- Runtime secrets stay out of the image entirely → pass them through a Kubernetes Secret per [`helm-chart.md`](helm-chart.md)

## Images for GPU workloads (STT/TTS)

- Use a base provided by the framework maker or NVIDIA (the tag name must match the CUDA version the driver on the node supports · see [`gpu-node-pool.md`](gpu-node-pool.md)) · pin the digest the same way
- Do not embed multi-GB model files in a layer that changes often: keep the model in object storage or a volume and load it at start (with a `startupProbe` controlling the time), or put the model layer at the very bottom so it can be cached · which one to choose is `(ยังไม่ได้วัด)` (not yet measured); measure the pull time on the real cluster
- It still runs non-root; check that the user has permission to read the model and cache folders

## Scan before shipping

`docker build` → scan the image with the team's tool (for example Trivy in `security-gate`) → push → note the digest from the push result (not the tag) in the build result for the deploy step to use · for what the pipeline does, see [`cicd-and-release`](../../cicd-and-release/SKILL.md) item 2
