# skill: config-and-secrets

Use when settings differ by environment or something must never be committed (keys, connection strings).

# Config และ Secret

> **กฎ 2 ข้อ:**
> 1. โค้ดชุดเดียวกันต้องรันได้ทุก environment ความต่างอยู่ที่ config เท่านั้น
> 2. secret ต้องไม่อยู่ใน git ไม่อยู่ใน log และไม่อยู่ในไฟล์ที่ส่งไปให้เบราว์เซอร์

## เมื่อไหร่ใช้ skill นี้

- เริ่มโปรเจกต์ หรือเพิ่ม environment ใหม่
- ต้องเก็บ connection string, API key, ใบรับรอง, กุญแจสำหรับเซ็น
- เจอค่าคงที่ฝังอยู่ในโค้ด (hardcode) แล้วต้องย้ายออก
- secret หลุดเข้า git หรือสงสัยว่าหลุด ให้ไปข้อ 8 ทันที

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| เก็บ secret ใน pipeline · ด่านอนุมัติ | `cicd-and-release` | แทน |
| ออกแบบ login, token, สิทธิ์ผู้ใช้ | `auth-implementation-patterns` | แทน |
| กันไม่ให้ค่าอ่อนไหวโผล่ใน log | `logging-standards` | แทน |
| connection string ของฐานข้อมูล | `database-design` | คู่ |
| บันทึกเหตุการณ์หลัง secret หลุด | `postmortem-template` | คู่ |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**วิธีทำจริงในแต่ละภาษาและเฟรมเวิร์ก** อยู่ใน `references/per-stack.md`

---

## 1 · แยก config กับ secret ให้ออกก่อน

| | config | secret |
|---|---|---|
| ตัวอย่าง | ที่อยู่ API, ระดับ log, จำนวนต่อหน้า, โซนเวลา, feature flag | รหัสผ่านฐานข้อมูล, API key, กุญแจเซ็น token, ใบรับรอง |
| อยู่ใน git ได้ | ✅ ได้ | ❌ ไม่ได้เด็ดขาด |
| ใครเห็นได้ | ทั้งทีม | เฉพาะที่จำเป็น |
| หลุดแล้วเป็นไร | ไม่เป็นไร | ต้องเพิกถอนและเปลี่ยนทันที |
| เปลี่ยนบ่อย | ตามงาน | ตามรอบหมุนเวียน |

> **ถ้าตัดสินใจไม่ได้ว่าเป็นแบบไหน ให้ถือว่าเป็น secret** เพราะระวังเกินไปเสียแค่ความรำคาญเล็กน้อย
> แต่ถ้าเดาผิด กุญแจจะอยู่ในประวัติ git ตลอดไป

---

## 2 · ลำดับความสำคัญ — ค่าหลังทับค่าก่อน

```
1. ค่าเริ่มต้นในโค้ด        (ปลอดภัย ใช้ได้จริงสำหรับ dev)
2. ไฟล์ config ตาม environment  (appsettings.Production.json, config/production.yaml)
3. ตัวแปรสภาพแวดล้อม        (environment variable)
4. secret store              (Key Vault, Secrets Manager, Kubernetes secret)
5. อาร์กิวเมนต์ตอนสั่งรัน     (ใช้ตอนไล่ปัญหาเท่านั้น)
```

**ค่าเริ่มต้นต้องปลอดภัย** ถ้าลืมตั้งค่า ระบบต้องทำงานแบบเข้มงวดที่สุด
เช่น `DEBUG=false` · `ALLOWED_ORIGINS=` ว่าง · เปิด TLS ไม่ใช่ตรงกันข้าม

---

## 3 · ตรวจตอนบูต — ขาดค่าไหนให้ตายทันที

> 🚨 ข้อนี้คุ้มที่สุดในหน้านี้
> ระบบที่บูตขึ้นมาได้ทั้งที่ config ผิด จะไปพังตอนตี 2 ในฟังก์ชันที่นาน ๆ ใช้ที
> ระบบที่ **ไม่ยอมบูต** เมื่อ config ผิด ทำให้รู้ตั้งแต่ตอน deploy ซึ่งยัง rollback ได้

```ts
// Node — zod
const Env = z.object({
  NODE_ENV:      z.enum(['development', 'staging', 'production']),
  PORT:          z.coerce.number().int().positive().default(3000),
  DATABASE_URL:  z.string().url(),
  JWT_SECRET:    z.string().min(32),
  LOG_LEVEL:     z.enum(['debug','info','warn','error']).default('info'),
});

export const env = Env.parse(process.env);   // ผิด = process ตายพร้อมบอกว่าตัวไหนผิด
```

**สิ่งที่ต้องตรวจ:** มีค่าครบ · ชนิดถูก · อยู่ในช่วงที่ยอมรับ ·
กุญแจยาวพอ · ค่าที่ห้ามใช้บน production (`JWT_SECRET=dev-secret` ต้องไม่ผ่าน)

**พิมพ์สรุป config ตอนบูต**: ชื่อค่า และค่าที่ไม่ใช่ secret
ส่วน secret พิมพ์แค่ "มีค่าแล้ว" หรือ 4 ตัวท้าย ไม่พิมพ์ค่าเต็ม

---

## 4 · ตั้งชื่อตัวแปรสภาพแวดล้อม

```
<ระบบ>_<กลุ่ม>_<ชื่อ>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| กฎ | เหตุผล |
|---|---|
| ตัวพิมพ์ใหญ่ ขีดล่าง | ข้อตกลงของทุกระบบปฏิบัติการ |
| มีคำนำหน้าของระบบ | กัน `PATH`, `HOME`, `USER` ของระบบชนกัน |
| ชื่อเดียวกันทุก environment | ค่าต่างได้ แต่ชื่อห้ามต่าง ไม่งั้นย้าย environment ทีไรต้องแก้โค้ด |
| ใส่หน่วยในชื่อ | `APP_TIMEOUT_SECONDS` ไม่ใช่ `APP_TIMEOUT` |
| อย่าใส่ชื่อ environment ในชื่อตัวแปร | ❌ `APP_PROD_DB_HOST` |

---

## 5 · `.env` และ `.env.example`

| ไฟล์ | อยู่ใน git | หน้าที่ |
|---|:--:|---|
| `.env.example` | ✅ | รายชื่อค่าที่ต้องมี **ทั้งหมด** พร้อมคำอธิบาย และค่าตัวอย่างที่ไม่ใช่ของจริง |
| `.env` | ❌ | ค่าจริงบนเครื่องนักพัฒนาแต่ละคน |
| `.env.production` | ❌ | **ไม่ควรมีไฟล์นี้เลย** เพราะ production ใช้ secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # ที่อยู่ฐานข้อมูล
APP_DB_PASSWORD=change-me          # ❗ ค่าจริงอยู่ใน 1Password ห้องทีม
APP_JWT_SECRET=                    # ❗ สร้างด้วย: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**`.env.example` ต้องอัปเดตในคอมมิตเดียวกับที่เพิ่มค่าใหม่**
ไม่งั้นคนถัดไปที่ clone จะเจอ error ที่ไม่มีใครอธิบายได้

> 🚨 **`.env` ที่ใส่ `.gitignore` ไม่ทัน**: ไฟล์ถูก track ไปแล้วแม้ครั้งเดียว
> การเพิ่มใน `.gitignore` ทีหลัง**ไม่ลบมันออกจากประวัติ** ต้อง `git rm --cached` และถือว่า secret หลุดแล้ว

---

## 6 · เก็บ secret ไว้ที่ไหน

| สถานการณ์ | ใช้ | หมายเหตุ |
|---|---|---|
| เครื่องนักพัฒนา | `.env` ที่ไม่เข้า git ส่วน .NET ใช้ `dotnet user-secrets` | ห้ามใช้ค่าของ production |
| ทีมเล็ก แชร์กัน | ตัวจัดการรหัสผ่านของทีม (1Password, Bitwarden) | ไม่ใช่แชต ไม่ใช่อีเมล ไม่ใช่ Google Sheet |
| production บนคลาวด์ | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | ให้สิทธิ์ด้วย managed identity ไม่ใช่ key อีกอัน |
| Kubernetes | External Secrets Operator ดึงจาก vault ข้างบน | secret ของ Kubernetes เองเป็นแค่ base64 **ไม่ใช่การเข้ารหัส** |
| ต้องเก็บใน git จริง ๆ | SOPS หรือ sealed-secrets (เข้ารหัสก่อน commit) | ทางเลือกสุดท้าย |

**สิทธิ์:** แต่ละ service อ่านได้เฉพาะ secret ของตัวเอง environment แยกกันสนิท และ
ไม่มีบัญชีไหนอ่านได้ทุกอัน ยกเว้นบัญชีดูแลระบบที่บันทึกการเข้าถึง

---

## 7 · การหมุนเวียน (rotation)

**ออกแบบให้รองรับตั้งแต่วันแรก** ไม่ใช่รอถึงตอนต้องหมุนจริง

| ต้องมี | รายละเอียด |
|---|---|
| ใช้ 2 ค่าพร้อมกันได้ | ระหว่างเปลี่ยน ทั้งค่าเก่าและใหม่ต้องใช้ได้ ไม่งั้นต้องปิดระบบ |
| โหลดใหม่โดยไม่ต้อง restart | หรือยอมรับว่าต้อง deploy 1 รอบ และจดไว้ว่าต้องทำ |
| รอบเวลา | กุญแจเซ็น token 90 วัน · รหัสฐานข้อมูล 180 วัน · ใบรับรองก่อนหมดอายุ 30 วัน |
| ทำอัตโนมัติ | เพราะงานที่ต้องจำทำเอง สุดท้ายไม่มีใครทำ |

**กุญแจสำหรับเซ็น token ต้องมี id กำกับ (key id)** เพื่อให้เซ็น token ใหม่ด้วยกุญแจใหม่แล้ว
ก็ยังตรวจ token เก่าที่ยังไม่หมดอายุได้

---

## 8 · เมื่อ secret หลุด — ลำดับสำคัญกว่าความเร็ว

1. **เพิกถอนค่าเดิมก่อน**: ปิด key นั้นที่ต้นทาง
2. ออกค่าใหม่ แล้ว deploy
3. ตรวจ log ย้อนหลังว่ามีใครใช้จากที่ที่ไม่ใช่ของเราไหม
4. ลบออกจากประวัติ git (`git filter-repo`) และแจ้งทุกคนให้ clone ใหม่
5. บันทึกเหตุการณ์ด้วย `postmortem-template`

> 🚨 **ข้อ 4 ไม่ใช่ข้อ 1** เพราะลบ commit แล้วกุญแจก็ไม่ปลอดภัยขึ้นเลย
> ใครที่ fork หรือ clone ไปแล้ว รวมถึงข้อมูลสำรองของผู้ให้บริการ ยังมีค่าเดิมอยู่
> **ถือว่าทุก secret ที่เคยเข้า git คือหลุดแล้ว** แม้ repo จะเป็น private

---

## 9 · อย่าให้ secret ไหลออกทางอื่น

| ทางรั่ว | วิธีปิด |
|---|---|
| log | รายการคำที่ต้องปิดบัง ดูที่ `logging-standards` |
| ข้อความ error ที่ส่งให้ client | คืนเฉพาะ `requestId` ไม่ใช่ stack trace หรือ connection string |
| รายงาน crash / ตัวติดตามข้อผิดพลาด | ตั้งตัวกรองข้อมูลอ่อนไหวก่อนส่งออก |
| ประวัติคำสั่งใน shell | ใช้ `read -s` หรืออ่านจากไฟล์ แทนการพิมพ์ค่าลงบรรทัดคำสั่ง |
| `docker history` | อย่าใส่ secret ใน `ARG`/`ENV` ตอน build ให้ใช้ mount ตอนรันแทน |
| ไฟล์สำรองข้อมูลและ dump | เข้ารหัส และเก็บที่ที่คุมสิทธิ์ได้ |
| ภาพหน้าจอในเอกสารและ issue | ปิดบังก่อนแนบเสมอ |

---

## 10 · config ของ frontend — ไม่มีอะไรลับ

> 🚨 ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด **คือข้อมูลสาธารณะ**
> ไม่ว่าจะชื่อว่า `VITE_SECRET_KEY` หรืออยู่ในไฟล์ที่ถูกย่อจนอ่านไม่ออกก็ตาม
> การย่อโค้ดไม่ใช่การเข้ารหัส เปิด DevTools ก็เห็น

| ใส่ใน frontend ได้ | ต้องอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น |
|---|---|
| ที่อยู่ API · ชื่อ environment | API key ของบริการภายนอกทุกชนิด |
| กุญแจสาธารณะ (publishable key) ของผู้ให้บริการชำระเงิน | กุญแจลับ (secret key) ของผู้ให้บริการเดียวกัน |
| feature flag ที่ไม่ลับ | กฎการคิดราคา · เกณฑ์อนุมัติ |
| รหัสเว็บของตัววัดสถิติ | token ที่เรียก API ของบุคคลที่สาม |

**ถ้าต้องการเปลี่ยนค่าโดยไม่ build ใหม่** ให้โหลด `/config.json` ตอนแอปเริ่มทำงาน
แทนการฝังค่าตอน build (`import.meta.env`) ที่ล็อกค่าติดไปกับไฟล์ที่ build ได้

---

## 11 · Anti-patterns

- ❌ **connection string ในโค้ด** แม้จะเป็นของ dev เพราะสักวันจะมีคนลอกแบบนี้ไปใช้กับ production
- ❌ **`.env` ของ production วางไว้บนเซิร์ฟเวอร์** ใครเข้าเครื่องได้ก็อ่านได้ และไม่มีบันทึกว่าใครอ่าน
- ❌ **secret เดียวกันทุก environment** พอ staging หลุด production ก็หลุดด้วย
- ❌ **ส่ง secret ทางแชตหรืออีเมล** ค่าจะอยู่ในนั้นตลอดไป และค้นเจอด้วย
- ❌ **ไม่มี `.env.example`** คนใหม่จะเสียเวลาครึ่งวันเดาว่าต้องมีค่าอะไรบ้าง
- ❌ **บูตผ่านทั้งที่ config ไม่ครบ** แล้วไปพังตอนใช้งานจริง
- ❌ **พิมพ์ config ทั้งก้อนลง log ตอนบูต** รวม secret
- ❌ **`ALLOWED_ORIGINS=*` บน production** เพราะ "ตอน dev มันติด CORS"
- ❌ **กุญแจที่ไม่เคยเปลี่ยนเลยตั้งแต่ปีแรก**


## reference: per-stack.md

# วิธีทำจริงแยกตามภาษาและเฟรมเวิร์ก

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular และ frontend ทั่วไป](#4--angular-และ-frontend-ทั่วไป)
5. [Docker และ Kubernetes](#5--docker-และ-kubernetes)
6. [เครื่องมือตรวจ secret ที่หลุดเข้า git](#6--เครื่องมือตรวจ-secret-ที่หลุดเข้า-git)
7. [คำสั่งสร้างค่าสุ่มที่ปลอดภัย](#7--คำสั่งสร้างค่าสุ่มที่ปลอดภัย)

---

## 1 · .NET / ASP.NET Core

**บนเครื่องนักพัฒนา เก็บนอกโฟลเดอร์โปรเจกต์ จึงไม่มีทางเข้า git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**ตรวจตอนบูต:**

```csharp
public sealed class AppOptions
{
    public const string Section = "App";

    [Required, Url]                       public string ApiBaseUrl { get; init; } = "";
    [Required, MinLength(32)]             public string JwtSecret  { get; init; } = "";
    [Range(1, 300)]                       public int TimeoutSeconds { get; init; } = 30;
}

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection(AppOptions.Section))
    .ValidateDataAnnotations()
    .ValidateOnStart();                   // ← ขาดค่า = แอปไม่ยอมบูต
```

**ลำดับที่ ASP.NET Core อ่าน (ค่าหลังทับค่าก่อน):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

ตัวแปรสภาพแวดล้อมใช้ `__` แทนลำดับชั้น เช่น `ConnectionStrings__Default`

**Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());        // ใช้ managed identity ไม่ต้องมี key อีกอัน
```

---

## 2 · Node.js

```ts
// config/env.ts — ไฟล์เดียวที่แตะ process.env ได้ทั้งโปรเจกต์
import { z } from 'zod';

const Env = z.object({
  NODE_ENV:     z.enum(['development','test','staging','production']),
  PORT:         z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  SMTP_PASSWORD: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.JWT_SECRET.startsWith('dev-'))
    ctx.addIssue({ code: 'custom', message: 'ห้ามใช้ JWT_SECRET ของ dev บน production' });
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('config ไม่ถูกต้อง:', z.treeifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;
```

> **ห้ามอ่าน `process.env` กระจายทั่วโค้ด** ให้รวมไว้ที่ไฟล์เดียว
> จะได้ตอบได้ว่าระบบใช้ค่าอะไรบ้าง โดยไม่ต้องไล่ grep ทั้งโปรเจกต์

Node 20 ขึ้นไปโหลด `.env` ได้เองด้วย `node --env-file=.env` ไม่ต้องพึ่ง `dotenv`

---

## 3 · Python

```python
# settings.py
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env")

    env: str = Field(pattern="^(development|staging|production)$")
    database_url: PostgresDsn
    jwt_secret: str = Field(min_length=32)
    timeout_seconds: int = Field(default=30, ge=1, le=300)

settings = Settings()      # ขาดค่า = ValidationError ตั้งแต่ import
```

- อ่าน `APP_DATABASE_URL`, `APP_JWT_SECRET` ตาม `env_prefix`
- import ที่ระดับบนสุดของแอป error จะได้เกิดตอนบูต ไม่ใช่ตอนเรียกใช้ครั้งแรก

---

## 4 · Angular และ frontend ทั่วไป

> 🚨 **ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด คือสาธารณะ** ไม่มีข้อยกเว้น

**แบบฝังตอน build** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`):
ค่าติดไปกับไฟล์ที่ build ได้ เปลี่ยนค่าทีไรต้อง build ใหม่ จึงขัดกับกฎ build ครั้งเดียวแล้วใช้ทุก environment

**แบบโหลดตอนรัน (แนะนำ):**

```ts
// main.ts — โหลดก่อนแอปเริ่ม
fetch('/config.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(cfg => {
    (window as any).__APP_CONFIG__ = cfg;
    return bootstrapApplication(AppComponent, appConfig);
  });
```

```json
// config.json — ไฟล์นี้วางแยกต่อ environment ไม่ต้อง build ใหม่
{ "apiBaseUrl": "https://api.example.co", "env": "production", "sentryDsn": "..." }
```

ตั้ง header `Cache-Control: no-store` ให้ `/config.json` ไม่งั้นเบราว์เซอร์จะใช้ค่าเก่า

---

## 5 · Docker และ Kubernetes

**Docker อย่าใส่ secret ตอน build:**

```dockerfile
# ❌ ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ✅ mount เฉพาะตอนใช้ ไม่ติดไปกับ image
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker run --env-file .env myapp        # ตอนรัน ส่งค่าเข้าไป
```

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> 🚨 **Secret ของ Kubernetes เป็นแค่ base64 ไม่ใช่การเข้ารหัส**
> ใครมีสิทธิ์ `get secret` ก็อ่านค่าได้ตรง ๆ
> ต้องเปิด encryption at rest ที่ etcd และคุมสิทธิ์ด้วย RBAC
> ทางที่ดีกว่า: ให้ External Secrets Operator ดึงค่าจาก Key Vault / Secrets Manager มาสร้าง Secret ให้

---

## 6 · เครื่องมือตรวจ secret ที่หลุดเข้า git

```bash
# ตรวจทั้งประวัติ
gitleaks detect --source . --redact

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks: [{ id: gitleaks }]
```

**ลบออกจากประวัติ** (ทำหลังเพิกถอนค่าเดิมแล้วเท่านั้น):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force --all      # ทุกคนต้อง clone ใหม่
```

---

## 7 · คำสั่งสร้างค่าสุ่มที่ปลอดภัย

```bash
openssl rand -base64 48                 # กุญแจทั่วไป
openssl rand -hex 32                    # กุญแจ 256 บิตเป็นเลขฐานสิบหก
uuidgen                                 # id ไม่ลับ

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

```powershell
# Windows
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
```

> ❌ **อย่าใช้ตัวสุ่มทั่วไป** (`Math.random`, `random.random`, `Random` ของ .NET)
> เพราะพวกนี้คาดเดาได้ ต้องใช้ตัวสุ่มสำหรับงานเข้ารหัสตามคำสั่งข้างบน


---

# skill: observability-basics

Use when a live system must be known healthy before users complain (metrics, logs, traces, alerts).

# วัดผลและเฝ้าระบบ

> **กฎข้อเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
> ไม่ใช่ว่าลูกค้าใจดี

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้จริงแล้ว
- มีคนถามว่า "ตอนนี้ระบบปกติดีไหม" แล้วต้องไปเปิด log ดูถึงจะตอบได้
- ถูกปลุกกลางดึกด้วยการแจ้งเตือนที่ไม่ต้องทำอะไร
- ระบบช้าแล้วไม่รู้ว่าช้าตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปแบบบรรทัด log และการปิดบัง | `logging-standards` |
| ร่องรอยว่าใครทำอะไร | `audit-trail` |
| endpoint health check | `web-service-essentials` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |

---

## 1 · สามอย่างนี้ตอบคนละคำถาม

| | ตอบคำถาม | ตัวอย่าง | ต้นทุน |
|---|---|---|---|
| **metric** (ตัวชี้วัด) | "ตอนนี้แย่ไหม แย่ขึ้นหรือลง" | error 2.3% · p95 = 840 ms | ถูกสุด เก็บได้นาน |
| **log** (บันทึก) | "คำขอนั้นเกิดอะไรขึ้น" | ข้อความ + stack trace + id | แพงปานกลาง |
| **trace** (การไล่รอย) | "ช้าที่ขั้นตอนไหน" | คำขอเดียว ผ่าน 5 service | แพงสุด สุ่มเก็บ |

**ลำดับการใช้เวลาเกิดเหตุ:** metric บอกว่า**มีปัญหา** → trace บอกว่า**ตรงไหน** → log บอกว่า**ทำไม**
ทั้ง 3 อย่างต้องเชื่อมกันด้วย correlation id ตัวเดียวกัน (ดู `logging-standards`)

---

## 2 · สี่สัญญาณที่ต้องวัด

| สัญญาณ | วัดอะไร | ตัวเลขที่ดู |
|---|---|---|
| **อัตราคำขอ** | มีงานเข้ามาเท่าไหร่ | ต่อวินาที แยกตาม endpoint |
| **อัตราความผิดพลาด** | ล้มกี่เปอร์เซ็นต์ | แยก 4xx (ผู้ใช้ผิด) กับ 5xx (เราผิด) |
| **เวลาตอบสนอง** | ช้าแค่ไหน | **p50 · p95 · p99** |
| **ทรัพยากร** | ใกล้เต็มไหม | CPU · หน่วยความจำ · พื้นที่ · connection pool |

> 🚨 **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง** — เฉลี่ย 200 ms ฟังดูดี
> ทั้งที่ผู้ใช้ 5% รอ 9 วินาที ค่าเฉลี่ยกลบคนที่เจอปัญหาเสมอ **ดู p95 และ p99**

**สำหรับคิวและงานเบื้องหลัง** เพิ่มอีก 3 ตัว — งานค้างในคิว · เวลารอในคิว · งานที่ล้มถาวร
(ดู `background-jobs`)

---

## 3 · ตั้งชื่อตัวชี้วัด

```
<โดเมน>_<สิ่งที่วัด>_<หน่วย>

http_requests_total              จำนวนสะสม
http_request_duration_seconds    ระยะเวลา
orders_created_total             เหตุการณ์ทางธุรกิจ
queue_depth                      ค่า ณ ขณะนั้น
```

| กฎ | เหตุผล |
|---|---|
| ลงท้ายด้วยหน่วยเสมอ | `_seconds` ไม่ใช่ `_time` ที่ไม่มีใครรู้ว่าวินาทีหรือมิลลิวินาที |
| ค่าสะสมลงท้าย `_total` | บอกว่าเป็นค่าที่เพิ่มขึ้นเรื่อย ๆ ไม่ใช่ค่าปัจจุบัน |
| ใช้ label แทนการสร้างชื่อใหม่ | `http_requests_total{route,status}` ไม่ใช่ชื่อแยกต่อ endpoint |
| **label ห้ามมีค่าที่ไม่จำกัด** | ถ้าใส่ user id หรือ order id เป็น label ระบบเก็บ metric จะรับไม่ไหว |

---

## 4 · การแจ้งเตือน

> **แจ้งเตือนทุกครั้งต้องมีอะไรให้ทำ** — ถ้าคนรับอ่านแล้วไม่ต้องทำอะไร
> อีก 3 สัปดาห์เขาจะปิดเสียงแจ้งเตือน แล้ววันที่ของจริงเกิดก็จะไม่มีใครเห็น

**แจ้งเตือนจากสิ่งที่ผู้ใช้รู้สึก ไม่ใช่จากตัวเลขของเครื่อง**

| ❌ เตือนแบบนี้ | ✅ เตือนแบบนี้ |
|---|---|
| CPU เกิน 80% | อัตรา error เกิน 2% นาน 5 นาที |
| หน่วยความจำเกิน 70% | p95 ของหน้าชำระเงินเกิน 3 วินาที นาน 10 นาที |
| pod restart | คำสั่งซื้อสำเร็จลดลงเกิน 50% เทียบกับสัปดาห์ก่อน |
| disk 60% | **disk จะเต็มใน 4 ชั่วโมงตามอัตราปัจจุบัน** |

| ระดับ | ตัวอย่าง | ส่งไปไหน |
|---|---|---|
| **ปลุกคน** | ผู้ใช้ใช้งานไม่ได้ · ข้อมูลกำลังเสียหาย | โทร · push |
| **ดูในเวลางาน** | disk จะเต็มใน 3 วัน · error เพิ่มแต่ยังไม่มาก | แชตของทีม |
| **แค่บันทึกไว้** | ทุกอย่างที่เหลือ | แดชบอร์ด |

**ทุกการแจ้งเตือนต้องมี:** อะไรพัง · กระทบใคร · **ลิงก์ไป runbook** · ลิงก์ไปแดชบอร์ด
**ตั้งช่วงเวลา (นาน N นาที) เสมอ** ไม่ใช่เตือนทันทีที่ค่าพุ่งครั้งเดียว

---

## 5 · แดชบอร์ด

ทำ 2 หน้าพอ

| หน้า | ตอบคำถาม | มีอะไร |
|---|---|---|
| **ภาพรวม** | "ตอนนี้ปกติไหม" | 4 สัญญาณของทั้งระบบ · สถานะ dependency · การปล่อยของล่าสุด |
| **เจาะลึกต่อ service** | "พังตรงไหน" | 4 สัญญาณแยกตาม endpoint · คิว · ฐานข้อมูล |

- **เส้นแนวตั้งบอกเวลาที่ deploy** — ปัญหาส่วนใหญ่เริ่มหลังเส้นนี้ และเห็นได้ในวินาทีเดียว
- หน้าภาพรวมต้องอ่านจบใน 10 วินาที จึงควรมีไม่เกิน 6 กราฟ
- ใส่เส้นเกณฑ์ที่ตั้งแจ้งเตือนไว้ในกราฟ จะได้รู้ว่าห่างจากเส้นแค่ไหน

---

## 6 · ตัวชี้วัดทางธุรกิจ

ตัวชี้วัดทางเทคนิคเขียวหมดแต่ธุรกิจหยุดเดิน เป็นเรื่องที่เกิดขึ้นจริงและตรวจไม่เจอถ้าไม่วัด

| ตัวอย่าง | จับอะไรได้ |
|---|---|
| คำสั่งซื้อสำเร็จต่อชั่วโมง | ปุ่มชำระเงินพังแม้ทุก endpoint คืน 200 |
| อัตราเข้าสู่ระบบสำเร็จ | ผู้ให้บริการยืนยันตัวตนภายนอกมีปัญหา |
| งานเบื้องหลังที่รอเกิน N นาที | คิวตัน แต่ API ยังตอบปกติ |
| อีเมลส่งไม่สำเร็จ | ลูกค้าไม่ได้รับใบเสร็จ โดยไม่มี error ที่ไหนเลย |

**เลือก 3–5 ตัวที่เป็นหัวใจของธุรกิจ** แล้วเตือนเมื่อมันตกผิดปกติเทียบกับช่วงเดียวกันของสัปดาห์ก่อน

---

## 7 · Anti-patterns

- ❌ **ดูค่าเฉลี่ยของเวลาตอบสนอง** — กลบคนที่เจอปัญหาทุกครั้ง
- ❌ **แจ้งเตือนที่ไม่ต้องทำอะไร** — สอนให้ทุกคนเลิกสนใจการแจ้งเตือน
- ❌ **เตือนจาก CPU และหน่วยความจำ** — ระบบที่ CPU 90% แต่ผู้ใช้ปกติ ไม่ใช่เหตุ
- ❌ **ใส่ id ที่ไม่จำกัดค่าเป็น label** — ระบบเก็บ metric ล่มเสียเอง
- ❌ **แดชบอร์ด 40 กราฟ** — ไม่มีใครรู้ว่าต้องดูอันไหน
- ❌ **วัดแต่เทคนิค ไม่วัดธุรกิจ** — ทุกอย่างเขียวแต่ไม่มีใครสั่งซื้อได้
- ❌ **เก็บ trace ทุกคำขอ** — แพงโดยไม่ได้อะไรเพิ่ม สุ่มเก็บก็พอ
- ❌ **ไม่มีเส้นบอกเวลา deploy** — เสียเวลาครึ่งชั่วโมงกว่าจะนึกได้ว่าเพิ่ง deploy ไป
- ❌ **แจ้งเตือนที่ไม่มีลิงก์ไป runbook** — คนรับต้องเริ่มค้นจากศูนย์ตอนตี 3

---

## 8 · ตัวย่อ

- **metric** — ตัวชี้วัด ตัวเลขที่เก็บตามเวลา
- **trace** — การไล่รอยคำขอหนึ่งตลอดเส้นทางที่มันวิ่งผ่าน
- **p95 / p99** — เปอร์เซ็นไทล์ที่ 95 และ 99 (ช้ากว่านี้มีแค่ 5% หรือ 1% ของคำขอ)
- **label / tag** — ป้ายกำกับที่แนบกับตัวชี้วัด ใช้แยกดูเป็นกลุ่ม
- **on-call** — เวรรับแจ้งเหตุนอกเวลาทำการ
- **SLO** — Service Level Objective (เป้าหมายระดับบริการที่ตั้งไว้เอง เช่น สำเร็จ 99.5%)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| health check ที่ระบบเฝ้าใช้ | `web-service-essentials` |
| ตัวชี้วัดของคิวและงานเบื้องหลัง | `background-jobs` |
| อัตรา error และการตัดวงจร | `error-handling-patterns` |
| ขั้นตอนเมื่อการแจ้งเตือนดัง | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |
| ตัวเลขเป้าหมายที่ตกลงกับลูกค้า | `srs-writing` |


---

# skill: project-bootstrap

Use when starting a repository or one is slow to run on a new machine (layout, README, one run command).

# ตั้งต้นโปรเจกต์

> **กฎข้อเดียว:** คนที่ไม่เคยเห็นโปรเจกต์นี้มาก่อน ต้องรันได้ภายใน **30 นาที**
> โดยอ่านแค่ `README.md` และไม่ต้องถามใคร

## เมื่อไหร่ใช้ skill นี้

เริ่ม repository ใหม่ · คนใหม่ใช้ครึ่งวันกว่าจะรันได้ · pull request diff ทั้งไฟล์เพราะตัวจัดรูปแบบไม่ตรงกัน · ไม่มีใครรู้ว่าเอกสารอยู่ไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ตั้ง pipeline build และ deploy | `cicd-and-release` |
| ค่าตั้งต่อ environment และ secret | `config-and-secrets` |
| เลือกสถาปัตยกรรม | `architecture-patterns` |
| ตั้ง test framework | `testing-standards` |
| ตั้งชื่อเอกสาร | `document-naming` |

---

## 1 · โครงโฟลเดอร์

**ราก (โฟลเดอร์ที่ผู้ใช้เปิด) จัดตาม `project-doc-set` ข้อ 1 แบบ B** — ผังราก แบบ ecosystem และที่อยู่ไฟล์ของ SuperUser (`.claude/superuser/`) อยู่ที่นั่นที่เดียว · โค้ดอยู่ใน `<project-name>/` โครงข้างในเป็นแบบนี้:

ใน `<project-name>/` (ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-`): `README.md` (ข้อ 2) · `CHANGELOG.md` · `.env.example` (เฉพาะเมื่ออ่าน environment variable จริง · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · ค่าลับ · `_to_delete/`) · `src/` (ไฟล์ทดสอบอยู่ข้างไฟล์โค้ด · `readable-code` ข้อ 7) · `scripts/` (setup · seed · migrate) — ผังพร้อมคำอธิบาย [`references/code-folder.md`](references/code-folder.md) · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ในโฟลเดอร์โค้ด (`project-doc-set` ข้อ 1)

**ชื่อโฟลเดอร์โค้ด** — เอาชื่อโฟลเดอร์โปรเจกต์มาทำเป็นตัวพิมพ์เล็ก เว้นวรรคและเครื่องหมายเปลี่ยนเป็น `-` ตัวเดียว:
`Lumio - Light Meter/` → `lumio-light-meter/`
คำสั่ง build test และ run ทุกตัวรันจากในโฟลเดอร์นี้ ส่วนชื่อแพ็กเกจในภาษาที่บังคับรูปแบบ (Dart `name:` ใน pubspec · Python package) ยังตั้งตามกฎของภาษา เพราะกฎนี้คุมแค่ชื่อโฟลเดอร์

**กฎของราก (ชั้นบนสุดของโฟลเดอร์โปรเจกต์):**
- มีแค่ของในผัง `project-doc-set` ข้อ 1 · ข้อยกเว้นประกาศใน README ของโปรเจกต์ · README, CHANGELOG และไฟล์ตั้งค่าอยู่ใน repo · `.docx`/`.xlsx` ที่ได้รับมาอยู่ `ref/` ที่เราเขียนอยู่ `docs/`
- **ของชั่วคราวไม่เคยอยู่ที่ราก** — ถ้าไฟล์ชั่วคราวที่ agent สร้างไปตกที่ราก ให้ย้ายเข้า `_to_delete/` ทันที
- ถ้า build แล้วมีโฟลเดอร์งอกที่ราก (เช่น `build/` `lib/` ว่างหลังย้ายโค้ด) แปลว่า cache ของเครื่องมือยังจำ path เก่า ให้ล้าง cache (`flutter clean` · ลบ `obj/`) แล้ว build ใหม่
- ชื่อโฟลเดอร์และไฟล์ใน repo เป็นตัวพิมพ์เล็กคั่นด้วยขีดกลาง ไม่มีเว้นวรรค **ยกเว้นภาษาที่มีธรรมเนียมของตัวเอง** ให้ตามภาษานั้น

**ข้อยกเว้นตาม stack** — ชื่อโฟลเดอร์โค้ด โฟลเดอร์ทดสอบ และชื่อไฟล์ใน repo ใช้ตามที่เครื่องมือของภาษาคาดไว้
ไม่ฝืนให้เป็น `src/` · ปกติไฟล์ทดสอบอยู่ข้างไฟล์โค้ด ใช้โฟลเดอร์ทดสอบแยกเฉพาะ stack ที่เครื่องมือบังคับ (ช่องที่เขียนว่า **บังคับ**):

| Stack | โค้ด | ทดสอบ | ชื่อไฟล์ |
|---|---|---|---|
| Node | `src/` | ข้างไฟล์โค้ด (`*.test.ts`) | `kebab-case` |
| .NET | `src/` | `tests/` **บังคับ** (โปรเจกต์ทดสอบแยก `.csproj`) | `PascalCase.cs` |
| Python | `src/<package>/` | ข้างไฟล์โค้ด (`test_*.py`) | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` **บังคับ** (โครงเหมือน `lib/`) | `snake_case.dart` (lint `file_names`) · `android/` `ios/` อยู่ใน repo |

skill อื่นที่เขียน `tests/` หรือ `test/` ให้อ่านว่า "โฟลเดอร์ทดสอบของ stack นั้น" แล้วเลือกชื่อเดียวใช้ทั้ง repo

**แบบ A** (ใช้เมื่อผู้ใช้ขอเท่านั้น · ข้อนี้คือเจ้าของผัง) — เพิ่ม `<project-name>/docs/` ในโฟลเดอร์โค้ด เป็น markdown ล้วน ผังข้างในเหมือน `docs/` ของแบบ B (`README.md` สารบัญ · `decisions/ADR-NNNN-<slug>.md` · `runbook-<เรื่อง>.md` · `research/`) ไม่มี `.docx` หรือ PNG ส่งมอบ · ส่วนที่เหลือของรากยังตามผัง `project-doc-set` ข้อ 1 โดยไม่มี `docs/` ที่ราก

**`docs/README.md` คือสารบัญ ไม่ใช่เนื้อหา:**

แม่แบบ → `assets/starter-files.md` (คอลัมน์ เอกสาร · อ่านเมื่อ · เจ้าของ · อัปเดตล่าสุด)

---

## 2 · README ต้องตอบ 5 คำถาม

| # | คำถาม | ยาวแค่ไหน |
|:--:|---|---|
| 1 | โปรเจกต์นี้คืออะไร ทำอะไรให้ใคร | 2–3 บรรทัด |
| 2 | ต้องมีอะไรบ้างบนเครื่อง (เวอร์ชันด้วย) | ตาราง |
| 3 | **ติดตั้งและรันยังไง** | คำสั่งที่คัดลอกไปวางแล้วใช้ได้จริง |
| 4 | รัน test ยังไง | 1 คำสั่ง |
| 5 | เอกสารและคนที่ต้องถาม อยู่ที่ไหน | ลิงก์ไป `docs/README.md` |

แม่แบบ README (Node · Flutter / Android) → `assets/starter-files.md` · แอปที่ไม่มี DB หรือ Docker ก็ต้องบอกของบนเครื่องให้ครบ

> **ทุกคำสั่งต้องเคยรันจริงบนเครื่องเปล่า** เพราะ README ส่วนใหญ่ผิดตรงที่คนเขียน
> มีของครบอยู่แล้วบนเครื่องตัวเอง จึงไม่เห็นว่ามีขั้นตอนที่หายไป
>
> **1 คำสั่งติดตั้ง 1 คำสั่งรัน** — ถ้ามี 12 ขั้นตอน ให้เขียนเป็น `scripts/setup.sh`

---

## 3 · CHANGELOG

รูปแบบ Keep a Changelog · หัวข้อ เพิ่ม · แก้ · เปลี่ยนที่ทำให้ของเดิมพัง · มี `[ยังไม่ปล่อย]` รอไว้เสมอ — ตัวอย่างเต็ม [`references/changelog-examples.md`](references/changelog-examples.md)

**ต้องมี CHANGELOG ไหม**

| สถานการณ์ | CHANGELOG |
|---|---|
| ส่งงานให้ลูกค้า มีรอบ UAT หรือมีเลขเวอร์ชัน | ต้องมี — ลูกค้าและผู้ตรวจรับดูว่ารอบนี้ได้อะไร |
| คนอื่นเรียกใช้ (API · library · แอปที่มีผู้ใช้) | ต้องมี — เขารู้ว่าต้องแก้อะไรฝั่งตัวเองไหม |
| ต้นแบบ · สคริปต์ส่วนตัว · ทำคนเดียวและไม่มีรอบปล่อย | ไม่ต้อง — `git log` พอ · เขียนเหตุผลไว้ใน README |

**เขียนให้คนใช้งานอ่าน** — 1 ข้อ 1 บรรทัด บอกผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit ชื่อไฟล์หรือเลข ticket · งานที่มองไม่เห็นไม่ใส่ เว้นแต่รู้สึกได้ · "เปลี่ยนที่ทำให้ของเดิมพัง" อยู่บนสุดเสมอ · กฎเต็มและตัวอย่าง ❌ → ✅ ใน [`references/changelog-examples.md`](references/changelog-examples.md)
- เลขเวอร์ชันและกฎการขึ้นเลข ดู `cicd-and-release`

---

## 4 · ตัวจัดรูปแบบและ linter — จบการเถียงเรื่องสไตล์

- `.editorconfig` (เว้นวรรค · ตัวขึ้นบรรทัด · encoding) ทุกภาษา · แม่แบบพร้อม `.gitattributes` → `assets/starter-files.md`
- ตัวจัดรูปแบบจัดสไตล์ตอนบันทึก (Prettier · dotnet format · black/ruff · `dart format`) · linter จับของที่ผิดจริงเท่านั้น (ESLint · analyzer ของ .NET · ruff · `flutter analyze`)
- 🚨 ตั้ง `end_of_line = lf` และ `.gitattributes` `* text=auto eol=lf` — ไม่งั้นทีมที่ใช้ Windows ปนระบบอื่นจะเจอ pull request ที่ diff ทั้งไฟล์
- **ตัวจัดรูปแบบตัดสินใจแทนคน** จะเลือกค่าไหนก็ได้ แต่ต้องเป็นค่าเดียวกันทั้งทีม
- ให้ CI ตรวจด้วย ไม่ใช่พึ่งว่าทุกคนตั้งเครื่องเหมือนกัน
- เวลาเปิดใช้กับโปรเจกต์เก่า ให้จัดรูปแบบทั้ง repo ใน **commit เดียวที่ไม่มีอย่างอื่นปน**
  แล้วใส่ commit นั้นใน `.git-blame-ignore-revs`

---

## 5 · Dependency

- **commit lock file เสมอ** และติดตั้งบน CI ด้วยคำสั่งที่ยึด lock (`npm ci` · `flutter pub get --enforce-lockfile`) ไม่งั้น build แต่ละวันได้คนละชุด
- ตรวจช่องโหว่ใน pipeline (`cicd-and-release`) · อัปเดตเป็นรอบ: patch เดือนละครั้ง minor ไตรมาสละครั้ง ไม่ใช่รอพัง
- dependency ใหม่ต้องมีเหตุผลใน pull request (`lazy-coding`)

**ก่อนเพิ่มไลบรารี ถาม 3 ข้อ** — มาตรฐานของภาษาทำได้ไหม โครงการยังมีชีวิตอยู่ไหม และ
สัญญาอนุญาตใช้ได้กับงานที่ขายไหม (ดู `prior-art-review`)

---

## 6 · รายการตรวจเมื่อเปิดโปรเจกต์ใหม่

ติ๊ก `[x]` เฉพาะข้อที่**รันหรือเปิดดูแล้วในรอบนี้** ข้อที่ยังไม่ได้สร้างหรือยังไม่ได้รัน ให้ใส่ `[ ]` พร้อมบอกว่าค้างอะไร ส่วนข้อที่ไม่เกี่ยวกับโปรเจกต์นี้ ให้ใส่ `N/A — <เหตุผล>`

- [ ] `README.md` ตอบครบ 5 คำถาม และคำสั่งเคยรันจริงบนเครื่องเปล่า
- [ ] รากตรงผังใน `project-doc-set` ข้อ 1 (repo ชื่อโปรเจกต์ตัวเล็กคั่น `-` · ecosystem ใช้ `ecosystem/`) และไม่มีไฟล์ชั่วคราวหรือ `.docx` ที่ราก
- [ ] `.env.example` มีค่าครบทุกตัวพร้อมคอมเมนต์ ถ้าโปรเจกต์ไม่อ่าน environment variable เลย (เช่นแอปมือถือออฟไลน์) ก็ไม่ต้องสร้าง แต่ให้เขียนใน README ว่า "ไม่มีค่าตั้งภายนอก"
- [ ] `.editorconfig` · `.gitattributes` · ตัวจัดรูปแบบ · linter ตั้งแล้ว และ CI ตรวจ
- [ ] `.gitignore` ครอบคลุม `.env` · โฟลเดอร์ build · `_to_delete/` · Android: `key.properties` · `*.jks` · `*.keystore`
- [ ] `docs/README.md` เป็นสารบัญ พร้อมเจ้าของแต่ละเอกสาร
- [ ] `CHANGELOG.md` มีหัวข้อ "ยังไม่ปล่อย" รออยู่
- [ ] test อย่างน้อย 1 ตัวที่รันผ่าน เพื่อพิสูจน์ว่าโครงใช้ได้
- [ ] `main` ถูกป้องกัน ต้องผ่าน pull request และ CI ส่วน repo ที่ยังไม่มี remote หรือทำคนเดียวข้ามข้อนี้ได้ แต่ต้องเขียนเหตุผลไว้ใน README และรัน test กับ linter ก่อน commit แทน
- [ ] **ให้คนที่ไม่ได้ตั้งโปรเจกต์ลองทำตาม README แล้วจับเวลา**

---

## 7 · Anti-patterns

❌ README มีแต่ชื่อ · คำสั่งที่ไม่เคยรันบนเครื่องเปล่า · "ขอ `.env` จากพี่คนนั้น" (ไม่มี `.env.example`) · ไม่ commit lock file · ไม่มี `.editorconfig` · linter เถียงเรื่องสไตล์ · ไฟล์ทดลองที่ราก (`test.js` `backup_final.zip`) · เอกสารกระจายในแชตและ Drive ไม่มีสารบัญ · CHANGELOG ที่ก๊อปรายการ commit


## 8 · ตัวย่อ

**lock file** ไฟล์ตรึงเวอร์ชัน dependency · **linter** ตัวตรวจโค้ดหาของที่น่าจะผิด · **formatter** ตัวจัดรูปแบบอัตโนมัติ · **LF** Line Feed ตัวขึ้นบรรทัดแบบ Unix (Windows ใช้ CRLF) · **CI** Continuous Integration การตรวจอัตโนมัติทุกครั้งที่รวมโค้ด

## 9 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: ของชั่วคราว → `temp-file-discipline` · commit ที่สร้าง CHANGELOG ได้ → `commit-message-format` · ก่อนเพิ่ม dependency → `lazy-coding` · `prior-art-review` · แม่แบบไฟล์ทั้งหมด → `assets/starter-files.md`


## reference: changelog-examples.md

# CHANGELOG — ตัวอย่าง

อ่านเมื่อเขียน CHANGELOG ครั้งแรกหรือรีวิว · กฎอยู่ใน `SKILL.md` ข้อ 3 · แม่แบบเปล่าอยู่ใน `assets/starter-files.md`

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เพิ่ม
- แจ้งเตือนทาง LINE
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
```

เขียนเป็นผลที่ผู้ใช้เห็น ไม่ใช่รายการ commit:

| ❌ | ✅ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## กฎการเขียน (ฉบับเต็ม)

- เขียนให้**คนใช้งาน**อ่าน ไม่ใช่คัดลอกรายการ commit มาวาง
- 1 ข้อ = 1 บรรทัด บอกว่าผู้ใช้ได้อะไรหรือเห็นอะไรเปลี่ยน ไม่ใช่ว่าแก้ไฟล์ไหน
- ไม่ใส่ชื่อไฟล์ ชื่อฟังก์ชัน หรือเลข ticket ยกเว้นผู้อ่านเป็นนักพัฒนาที่เรียก API นั้น
- ไม่ใส่งานที่ผู้ใช้มองไม่เห็น เช่น ปรับโครงโค้ด เพิ่ม test หรือแก้ CI · ยกเว้นทำให้เร็วขึ้นหรือเสถียรขึ้นจนรู้สึกได้ ให้เขียนเป็นผลที่ได้ ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที")
- ในแต่ละหัวข้อ เรียงข้อที่กระทบผู้ใช้มากที่สุดไว้บน · หัวข้อไหนไม่มีของให้ตัดหัวข้อนั้นทิ้ง
- หัวข้อ "เปลี่ยนที่ทำให้ของเดิมพัง" ต้องอยู่**บนสุด**ของเวอร์ชันนั้นเสมอ


## reference: code-folder.md

# โครงในโฟลเดอร์โค้ด — ผังเต็ม

กฎอยู่ใน `SKILL.md` ข้อ 1 · ผังรากอยู่ใน `project-doc-set` ข้อ 1 · ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ที่นี่

```
<project-name>/          ← ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่นด้วย `-`
  README.md              ← ข้อ 2 · ติดตั้ง · รัน · test
  CHANGELOG.md           ← สิ่งที่เปลี่ยนในแต่ละเวอร์ชัน
  .env.example           ← ค่าที่ต้องมีทั้งหมด (ดู config-and-secrets) · มีเฉพาะเมื่อโปรเจกต์อ่าน environment variable จริง
  .editorconfig          ← ข้อ 4
  .gitattributes
  .gitignore             ← build output · ค่าลับ · `_to_delete/`
  src/                   ← โค้ดจริง (หรือโครงตามธรรมเนียมของ stack ในตารางล่าง)
  tests/                 ← มีเฉพาะ stack ที่เครื่องมือบังคับ (.NET · Flutter `test/`) · ที่เหลือไฟล์ทดสอบอยู่ข้างไฟล์โค้ด
  scripts/               ← setup, seed, migrate — สคริปต์ที่คนต้องรัน
```
