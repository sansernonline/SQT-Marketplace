# Dockerfile สำหรับใช้งานจริง — แม่แบบและเหตุผล

ใช้กับขั้น 2 ของ [`SKILL.md`](../SKILL.md) · ตรวจ 2026-10-27 กับ [Docker build best practices](https://docs.docker.com/build/building/best-practices/) และ [Build secrets](https://docs.docker.com/build/building/secrets/)

## แม่แบบ web service (Node) แบบ multi-stage

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

- ตัวอย่างข้างบนใช้ `node:22-slim` เป็นแค่ตัวอย่างรูปร่าง · รุ่นจริงของ base image ดูจาก registry วันที่ build แล้วลง digest (`(ยังไม่ได้ตรวจ)` ว่า 22 ยังเป็นรุ่นที่ใช้ได้ ณ วันที่ใช้ skill นี้)
- `CMD` ใช้รูปแบบ exec (`["node", ...]`) เพื่อให้ process ได้รับสัญญาณ SIGTERM ตรง ๆ และปิดตัวเรียบร้อยตาม `web-service-essentials` หัวข้อ 4

## ทำไมทำแบบนี้ (ตรวจ 2026-10-27)

| ข้อ | เหตุผลจากเอกสาร |
|---|---|
| multi-stage | แยก stage สร้างกับ stage รัน เพื่อลดขนาด image สุดท้าย ([best practices](https://docs.docker.com/build/building/best-practices/)) |
| ล็อก digest | "By pinning your images to a digest, you're guaranteed to always use the same image version" · ข้อแลก: ไม่ได้รับ patch ความปลอดภัยอัตโนมัติ เอกสารแนะนำให้ Dependabot (`package-ecosystem: "docker"`) ดันรุ่นตามรอบ |
| `USER` ไม่ใช่ root | "If a service can run without privileges, use `USER`" · ระบุ UID/GID เองเพื่อให้ซ้ำได้ |
| `.dockerignore` | ใช้รูปแบบเดียวกับ `.gitignore` ตัดไฟล์ออกจาก build context |
| ลดขนาด | ใช้ base เล็ก · ไม่ลง package เกินจำเป็น · `apt-get install --no-install-recommends` แล้ว `rm -rf /var/lib/apt/lists/*` ใน `RUN` เดียวกัน |

## `.dockerignore` ขั้นต่ำ

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

`.env` และกุญแจต้องอยู่ในรายการนี้ทุกโปรเจกต์ ไม่งั้น `COPY . .` พาค่าลับเข้า layer

## ค่าลับตอน build

- ห้าม `ARG` หรือ `ENV` สำหรับค่าลับ เพราะ "they persist in the final image" ([Build secrets](https://docs.docker.com/build/building/secrets/))
- ถ้า build ต้องใช้ token (เช่น private package) ใช้ secret mount ซึ่งมีอยู่เฉพาะ `RUN` นั้น:

```dockerfile
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN="$(cat /run/secrets/npm_token)" npm ci
```

```bash
docker build --secret id=npm_token,src=./npm_token.txt .
```

- unset ตัวแปรใน layer ถัดไปไม่ช่วย: ค่ายังอยู่ใน layer ที่ตั้งไว้ (Docker best practices)
- ค่าลับตอนรัน ไม่อยู่ใน image เลย → ส่งผ่าน Secret ของ Kubernetes ตาม [`helm-chart.md`](helm-chart.md)

## image ของ workload GPU (STT/TTS)

- ใช้ base ที่ผู้ทำ framework หรือ NVIDIA ให้มา (ชื่อ tag ต้องตรงกับ CUDA รุ่นที่ driver บน node รองรับ · ดู [`gpu-node-pool.md`](gpu-node-pool.md)) · ล็อก digest เหมือนกัน
- ไม่ฝังไฟล์โมเดลขนาดหลาย GB ใน layer ที่เปลี่ยนบ่อย: เก็บโมเดลไว้ที่ object storage หรือ volume แล้วโหลดตอนเริ่ม (มี `startupProbe` คุมเวลา) หรือแยก layer โมเดลไว้ล่างสุดให้ cache ได้ · เลือกแบบไหน `(ยังไม่ได้วัด)` ต้องวัดเวลา pull ของ cluster จริง
- ยังรัน non-root ได้ ตรวจว่า user มีสิทธิ์อ่านโฟลเดอร์โมเดลและ cache

## สแกนก่อนส่ง

`docker build` → สแกน image ด้วยเครื่องมือของทีม (เช่น Trivy ใน `security-gate`) → push → จด digest จากผล push (ไม่ใช่ tag) ลงผล build ให้ขั้น deploy ใช้ · ที่ pipeline ทำให้ดู [`cicd-and-release`](../../cicd-and-release/SKILL.md) หัวข้อ 2
