# skill: logging-standards

Use when writing or reviewing code that logs (format, levels, correlation ids, redaction).

# Logging Standards

> **กฎข้อเดียว:** log มีไว้ให้คนอ่านตอนตี 3 ที่ระบบล่ม ไม่ใช่ตอนเขียนโค้ด
> ถ้าบรรทัดไหนไม่ช่วยตอบว่า "เกิดอะไรขึ้น กับใคร เมื่อไหร่" ก็อย่าเขียนลงไป

## เมื่อไหร่ใช้ skill นี้

- เริ่มโปรเจกต์ใหม่ทุกชนิด (service, API, worker, batch, desktop, frontend)
- มีคนขอ "ให้มี log file" หรือถามเรื่องรูปแบบและระดับของ log
- ไล่ปัญหา production แล้วพบว่า log ที่มีอยู่ใช้ไม่ได้

## เมื่อไหร่ **ไม่** ใช้

- ต้องการ metrics หรือ tracing (Prometheus, OpenTelemetry) เพราะเป็นคนละเรื่องกับ log
- ทำ endpoint สุขภาพของ service ให้ไปใช้ `web-service-essentials`

---

## 1 · รูปแบบบรรทัด — เหมือนกันทุกภาษา

```
2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1b2] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 userId=57 ms=134
└────────── เวลา + timezone ──────────┘ └level┘  └ cid ┘ └source┘ └── ข้อความ ──┘ └──── context k=v ────┘
```

| ส่วน | กฎ |
|---|---|
| เวลา | `YYYY-MM-DD HH:mm:ss.SSS ±HH:MM` — **ต้องมี timezone** ไม่งั้นเทียบ log ข้ามเครื่องไม่ได้ |
| level | ชิดซ้าย กว้าง 5 ตัวอักษร (`INFO ` `WARN ` `ERROR` `DEBUG` `FATAL`) — คอลัมน์จะได้ตรงกัน |
| cid | correlation id 8 ตัวในวงเล็บเหลี่ยม ถ้าไม่มีให้ใส่ `[------]` |
| source | โมดูลหรือคลาสที่เขียน log ไม่ใช่ชื่อไฟล์ |
| ข้อความ | ประโยคเดียว ไม่ฝังตัวแปรใน string |
| context | `key=value` คั่นด้วยช่องว่าง ถ้าค่ามีช่องว่างให้ครอบด้วย `"` |

**ทำไมไม่ใช่ JSON:** ไฟล์นี้มีไว้ให้คนเปิดอ่านและ `grep` เป็นหลัก รูปแบบนี้ยัง
`grep "cid=a3f9c1b2"` หรือ `awk` ได้อยู่ แต่ตาอ่านออกทันทีโดยไม่ต้องพึ่งเครื่องมือ
วันที่ต้องส่งเข้า Loki/ELK ให้เพิ่ม sink (ปลายทางที่ส่ง log ไป) แบบ JSON อีก 1 ตัว แต่**อย่าทิ้งไฟล์ข้อความ**

**1 event = 1 บรรทัด** ยกเว้น stack trace ที่ต่อท้ายโดยเยื้อง 4 ช่อง

---

## 2 · ระดับ log — เขียนให้ตรงความหมาย

| ระดับ | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `FATAL` | แอปกำลังจะตาย ทำงานต่อไม่ได้ | ต่อ DB ตอน start ไม่ได้ |
| `ERROR` | งานนี้ล้มเหลว **และต้องมีคนมาดู** | บันทึกคำสั่งซื้อไม่สำเร็จ |
| `WARN` | ผิดปกติแต่ระบบยังไปต่อได้ | retry ครั้งที่ 2, disk เหลือ 10% |
| `INFO` | เหตุการณ์สำคัญทางธุรกิจ | สร้างคำสั่งซื้อ, ผู้ใช้ล็อกอิน, job เริ่ม/จบ |
| `DEBUG` | รายละเอียดสำหรับไล่ปัญหา — **ปิดใน production** | ค่าที่คำนวณได้ระหว่างทาง |
| `TRACE` | ละเอียดระดับทุก step — เปิดเฉพาะตอนไล่จริง ๆ | payload ดิบ |

> ⚠️ **`ERROR` ที่ไม่มีใครต้องทำอะไร คือ `WARN`** — ถ้า ERROR ขึ้นทุกนาทีจนคนเลิกดู
> คุณเพิ่งทำลายระบบเตือนภัยของตัวเอง

ค่าเริ่มต้นของ dev คือ `DEBUG` ส่วน production คือ `INFO` และปรับได้ด้วย env `LOG_LEVEL` **โดยไม่ต้อง deploy ใหม่**

---

## 3 · Correlation id — สิ่งที่ทำให้ log ใช้งานได้จริง

1 request ใช้ id เดียวตั้งแต่ต้นจนจบ ทุกบรรทัดที่เกิดจาก request นั้นจึงมี id เดียวกัน

```
Client ──X-Request-Id?── API Gateway ──┬── Service A ──┐
                        (ไม่มีก็สร้าง)   └── Service B ──┴─→ ทุกบรรทัดมี cid เดียวกัน
```

- รับจาก header **`X-Request-Id`** ถ้าไม่มีให้สร้าง (`uuid v4` ตัด 8 ตัวแรก)
- **ส่งกลับใน response header เสมอ** เพื่อให้ลูกค้าส่ง id มาตอนแจ้งปัญหา แล้วเราตามได้ทันที
- ส่งต่อไปยัง service ปลายทางทุกครั้งที่เรียกข้ามระบบ
- เก็บด้วยกลไกที่แยกตาม request: `AsyncLocalStorage` (Node) · `ContextVar` (Python)
  · `IHttpContextAccessor`/`LogContext` (.NET) — **ห้ามใช้ตัวแปร global** เพราะจะปนกันทันทีที่มีหลาย request พร้อมกัน

---

## 4 · ไฟล์ log

```
logs/
  app-20260831.log        ทุกระดับ · หมุนเที่ยงคืน · เก็บ 30 วัน · ไฟล์ละไม่เกิน 100MB
  error-20260831.log      เฉพาะ ERROR/FATAL · เก็บ 90 วัน
  fatal.log               exception ที่ไม่ถูกจับ (แอปตาย)
```

- โฟลเดอร์กำหนดด้วย env `LOG_DIR` — **ห้าม hardcode path**
- บีบไฟล์เก่า (`.gz`) และ**ต้องมี retention** ไม่อย่างนั้นดิสก์จะเต็มจนระบบล่มเพราะ log ของตัวเอง
- ใน container ให้ log ออก stdout ด้วย (นอกเหนือจากไฟล์) เพื่อให้ `docker logs` ใช้ได้
- `logs/` ต้องอยู่ใน `.gitignore`

---

## 5 · สิ่งที่ห้ามลง log เด็ดขาด

รหัสผ่าน · token/API key · cookie/Authorization header · OTP/PIN · เลขบัตรเครดิต/CVV ·
**เลขบัตรประชาชน** · ข้อมูลสุขภาพ · payload เต็มที่มีข้อมูลส่วนบุคคล

ตัวช่วยที่มีให้แล้ว: ฟังก์ชัน redaction (ปิดค่าลับ) ดู**ว่าชื่อคีย์มีคำต้องห้ามอยู่ข้างในไหม** (`userPassword`, `pwd`,
`accessToken` โดนหมด) แล้วแทนค่าด้วย `***` โดยตรวจลึกลงไปได้ 4 ชั้นของ object

> 🚨 **Log injection** — ค่าที่มาจากผู้ใช้อาจมี `\n` ถ้าปล่อยผ่าน ผู้ใช้จะ "แต่ง" บรรทัด log
> ปลอมขึ้นมาเองได้ ทำให้คนอ่านเข้าใจผิดและ parser พัง โค้ดที่ให้มาจึงตัด `\r\n\t` ทิ้งจากทุกค่า

---

## 6 · โค้ดที่พร้อมใช้

| ไฟล์ | สแต็ก | สถานะ |
|---|---|---|
| `assets/logger.node.js` | Node/TS — winston + winston-daily-rotate-file | ✅ รันทดสอบแล้ว |
| `assets/logger_py.py` | Python — stdlib ล้วน ไม่ต้องลงอะไร | ✅ รันทดสอบแล้ว |
| `references/per-stack.md` | .NET (Serilog) + Angular | ⚠️ ยังไม่ได้คอมไพล์ทดสอบ |

```js
// Node
const { withCorrelation } = require('./logger.node');
const log = withCorrelation(req.id).child({ source: 'orders' });
log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
log.error('บันทึกไม่สำเร็จ', err);          // ส่ง Error ตรง ๆ ได้ stack ให้เอง
```

```python
# Python
from logger_py import setup_logging, get_logger, set_correlation_id
setup_logging(app_name="myapi")             # ครั้งเดียวตอนแอปเริ่ม
log = get_logger("orders")
log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
log.exception("บันทึกไม่สำเร็จ")             # ใน except — ได้ stack ให้เอง
```

---

## 7 · ตรวจงาน

```bash
# ไม่มี print/console.log หลงเหลือในโค้ด production
grep -rnE "console\.(log|error)|Console\.WriteLine|^\s*print\(" src/ --include="*.ts" \
  --include="*.js" --include="*.cs" --include="*.py" | grep -v test

# log ที่ออกมาอ่านได้จริงและ grep ได้
tail -f logs/app-*.log
grep "a3f9c1b2" logs/app-*.log          # ตาม request เดียวได้ครบทุกบรรทัดไหม
```

- [ ] ทุกบรรทัดมีครบ: เวลา+timezone · level · cid · source
- [ ] `grep` ด้วย cid เดียวแล้วเห็นเรื่องราวของ request นั้นตั้งแต่ต้นจนจบ
- [ ] ไม่มีความลับหลุด: ลอง log object ที่มี `password`, `token` แล้วต้องเห็น `***`
- [ ] ยิงค่าที่มี `\n` เข้าไปแล้วไม่เกิดบรรทัดปลอม
- [ ] ตั้ง `LOG_LEVEL=INFO` แล้ว DEBUG หายไปจริง
- [ ] ไฟล์หมุนตามวันและมี retention (ปล่อยไว้ 1 เดือนดิสก์ต้องไม่เต็ม)
- [ ] `logs/` อยู่ใน `.gitignore`
- [ ] response ส่ง `X-Request-Id` กลับมาให้ลูกค้า

---

## 8 · Anti-patterns

- ❌ **`console.log` / `print()` ในโค้ดจริง** — ไม่มี level ไม่มีเวลา ไม่มี cid ไม่ลงไฟล์
- ❌ **log ทุกอย่าง** — ไฟล์ใหญ่จนหาอะไรไม่เจอ ราคาแพง และช้า
- ❌ **`try { } catch (e) { }` เงียบ ๆ** — ต้อง log อย่างน้อย 1 บรรทัด
- ❌ **log แล้ว throw ต่อ** — ปัญหาเดียวจะโผล่ 3 ครั้งในไฟล์ ให้ log ที่ชั้นบนสุดซึ่งจัดการ error จริงแทน
- ❌ **ตัวแปรฝังในข้อความ** (`` `บันทึก order ${id} ไม่สำเร็จ` ``) — ทำให้ group log ไม่ได้
  ใช้ข้อความคงที่ + context แทน
- ❌ **log ในลูปที่วนหลายพันรอบ** — ให้สรุปทีเดียวตอนจบลูป
- ❌ **timestamp ไม่มี timezone** — server ใช้ UTC แต่คนไทยอ่านเป็น +07:00 จึงเทียบเวลาผิดไป 7 ชั่วโมง
- ❌ **ไม่มี retention** — วันหนึ่งดิสก์เต็มแล้วระบบล่มเพราะ log ของตัวเอง

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| endpoint health/ping/version | `web-service-essentials` |
| เขียน test ให้ครอบคลุม | `testing-standards` |
| runbook ตอน incident | `incident-runbook-template` |
| postmortem หลังเหตุ | `postmortem-template` |


## reference: per-stack.md

# ตั้งค่า logger ให้ได้รูปแบบเดียวกัน — .NET และ Angular

> ⚠️ โค้ดในไฟล์นี้ **ยังไม่ได้คอมไพล์ทดสอบ** (ต่างจาก `assets/logger.node.js` และ
> `assets/logger_py.py` ที่รันจริงแล้ว) โค้ดนี้ใช้การตั้งค่ามาตรฐานของแต่ละไลบรารี
> ตอน build ครั้งแรกให้เทียบบรรทัดที่ออกมากับรูปแบบใน SKILL.md ข้อ 1

---

## สารบัญ

1. [.NET / C# — Serilog](#net--c--serilog)
2. [Angular / frontend](#angular--frontend)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## .NET / C# — Serilog

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

`appsettings.json` — เก็บการตั้งค่าไว้นอกโค้ด เปลี่ยนระดับ log ได้โดยไม่ต้อง build ใหม่:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
      }
    }
  }
}
```

`Program.cs`:

```csharp
using Serilog;
using Serilog.Events;

const string LineTemplate =
    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}  {Level:u5}  " +
    "[{CorrelationId}] {SourceContext}  {Message:lj}  {Context}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("CorrelationId", "------")   // ค่าตั้งต้นเมื่อไม่มี request
    .WriteTo.Console(outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "app-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 100 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "error-.log"),
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90,
        outputTemplate: LineTemplate)
    .CreateLogger();

builder.Host.UseSerilog();
```

> `{Level:u5}` คือตัวพิมพ์ใหญ่กว้าง 5 ตัวอักษร จึงได้ `INFO ` `WARN ` `ERROR` ตรงกับสแต็กอื่น
> `{Message:lj}` คือไม่ครอบ string ด้วย `"` ซ้ำอีกชั้น

### Middleware correlation id

```csharp
public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string Header = "X-Request-Id";

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[Header].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(cid))
            cid = Guid.NewGuid().ToString("N")[..8];

        ctx.Response.Headers[Header] = cid;          // ส่งกลับให้ลูกค้าอ้างอิงได้

        // LogContext ผูกกับ async flow ของ request นี้เท่านั้น — ไม่ปนกับ request อื่น
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", cid))
            await next(ctx);
    }
}
```

### เขียน log

```csharp
// ✅ ข้อความคงที่ + ตัวแปรเป็น property — group log ได้ ค้นหาได้
_logger.LogInformation("สร้างคำสั่งซื้อสำเร็จ {OrderId} {Ms}", orderId, sw.ElapsedMilliseconds);

// ❌ ตัวแปรฝังใน string — ทุกบรรทัดกลายเป็นข้อความคนละอัน group ไม่ได้
_logger.LogInformation($"สร้างคำสั่งซื้อ {orderId} สำเร็จ");
```

### ปิดข้อมูลลับ

Serilog ไม่ปิดค่าลับให้อัตโนมัติ ทางที่ชัวร์ที่สุดคือ**อย่าส่ง object ทั้งก้อนเข้า log**
ให้เลือกเฉพาะ field ที่ต้องการ ถ้าจำเป็นต้องส่งทั้งก้อนให้เขียน `IDestructuringPolicy`
หรือใส่ `[NotLogged]` ผ่าน `Destructure.ByTransforming<T>()`

---

## Angular / frontend

หลักการต่างจาก backend: **เบราว์เซอร์เขียนไฟล์ไม่ได้** log ที่สำคัญจึงต้องส่งขึ้น backend

```ts
// core/logger.service.ts
import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private http = inject(HttpClient);
  private buffer: unknown[] = [];

  private write(level: Level, message: string, ctx: Record<string, unknown> = {}) {
    // dev: ออก console เพื่อไล่ปัญหา — prod: เงียบ ยกเว้น WARN ขึ้นไปที่ส่งขึ้น server
    if (isDevMode()) console[level === 'ERROR' ? 'error' : 'log'](level, message, ctx);
    if (level === 'DEBUG' || (isDevMode() && level === 'INFO')) return;

    this.buffer.push({ ts: new Date().toISOString(), level, message, ctx });
    if (this.buffer.length >= 10 || level === 'ERROR') this.flush();
  }

  /** ส่งเป็นชุด ไม่ยิงทีละบรรทัด — ไม่งั้น network tab เต็มไปด้วย request ของ log เอง */
  flush() {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);
    this.http.post('/api/client-logs', { entries: batch }).subscribe({ error: () => {} });
  }

  debug = (m: string, c?: Record<string, unknown>) => this.write('DEBUG', m, c);
  info  = (m: string, c?: Record<string, unknown>) => this.write('INFO', m, c);
  warn  = (m: string, c?: Record<string, unknown>) => this.write('WARN', m, c);
  error = (m: string, c?: Record<string, unknown>) => this.write('ERROR', m, c);
}
```

จับ error ที่หลุดทุกตัว:

```ts
// core/global-error.handler.ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private log = inject(LoggerService);
  handleError(err: unknown) {
    const e = err as Error;
    this.log.error(e?.message ?? 'unknown error', { stack: e?.stack?.slice(0, 2000) });
    if (isDevMode()) console.error(err);
  }
}
// app.config.ts → providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```

ส่ง correlation id ในทุก request เพื่อให้ log ฝั่ง client กับ server ต่อกันติด:

```ts
export const correlationInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID().slice(0, 8) } }));
```

**ฝั่ง backend** ต้องมี endpoint `POST /api/client-logs` ที่:
- จำกัดขนาด body และทำ rate limit ไม่อย่างนั้นจะกลายเป็นช่องให้คนยิง log ถล่ม
- เขียนลงไฟล์แยก `logs/client-YYYYMMDD.log`
- **ถือว่าเนื้อหาเป็นข้อมูลที่เชื่อไม่ได้** จึงต้องตัด `\r\n` ออกจากทุกค่าเหมือน log ปกติ

---

## ตารางเทียบ

| เรื่อง | .NET | Node | Python | Angular |
|---|---|---|---|---|
| ไลบรารี | Serilog | winston | stdlib `logging` | เขียนเอง (บาง) |
| หมุนไฟล์ | `rollingInterval: Day` | `winston-daily-rotate-file` | `TimedRotatingFileHandler` | — (ส่งขึ้น backend) |
| correlation | `LogContext.PushProperty` | `AsyncLocalStorage` + `child()` | `ContextVar` | header `X-Request-Id` |
| ระดับ | `LogEventLevel` | `level` | `setLevel` | enum ของตัวเอง |
| ตั้งค่าจากภายนอก | `appsettings.json` | env `LOG_LEVEL` | env `LOG_LEVEL` | `isDevMode()` |


---

# skill: auth-implementation-patterns

Use when implementing login or identity (session vs JWT, OAuth, SSO, MFA, password reset).

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn
- Choosing session vs token authentication
- Integrating OAuth or OpenID Connect (OIDC) logins (Google, GitHub, etc.)
- Implementing single sign-on (SSO) with SAML or OIDC
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth)
- Reviewing existing auth code for security issues

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/auth-flows.md](references/auth-flows.md) | ถ้าจะลงมือเขียน session · JWT · OAuth กับ PKCE หรือการรีเซ็ตรหัสผ่าน ให้เปิดดูลำดับขั้นทีละข้อ |
| [references/mfa.md](references/mfa.md) | ตอนเลือกหรือลงมือทำ MFA และต้องการขั้นตั้งค่า TOTP · การใช้ WebAuthn · ข้อจำกัดของ SMS |
| [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md) | ถ้าออกแบบการยืนยันตัวตนของ API หรือ API key หรือต้องการตัวอย่าง RBAC กับ ABAC ให้เปิดไฟล์นี้ |
| [references/libraries-and-code.md](references/libraries-and-code.md) | ตอนเลือกไลบรารีตามภาษา หรือต้องการโค้ดตัวอย่างการ hash รหัสผ่านและเครื่องมือจำกัดจำนวนครั้ง |

## Choose the Right Pattern

```
What's authenticating?
│
├─ Browser user
│  ├─ First-party app → Session cookies (HttpOnly, Secure, SameSite)
│  └─ Need cross-domain → JWT with httpOnly cookie (NOT localStorage)
│
├─ Mobile app
│  └─ Token-based: OAuth 2.0 PKCE flow
│
├─ Service-to-service
│  ├─ Same org → mTLS or service mesh
│  └─ External → OAuth 2.0 Client Credentials
│
└─ Third-party developer
   └─ API keys (with rotation) OR OAuth
```

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** server-rendered apps, monoliths, one domain

**Implementation requirements:**
- ✅ Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- ✅ Session ID: cryptographically random, ≥ 128 bits
- ✅ Session storage: Redis with a time-to-live (TTL). Not in app memory if you run more than one instance
- ✅ Idle timeout: 30 min default
- ✅ Absolute timeout: 8-12 hours
- ✅ Issue a new session ID when privileges change (login, role change)
- ✅ On logout, delete the session from the store

**Pitfalls:**
- ❌ Storing session in JWT (can't revoke)
- ❌ Using `localStorage` for the session token (cross-site scripting (XSS) can steal it)
- ❌ Keeping the same ID after login (session fixation)

## Pattern 2: JWT (Stateless Token)

**When to use:** microservices, mobile, single-page app (SPA) with a backend API

> ⚠️ **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Implementation requirements:**
- ✅ Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- ✅ Short-lived access token: 5-15 min
- ✅ Refresh token: longer-lived (days), stored separately, revocable
- ✅ Issue a new refresh token each time one is used
- ✅ Required claims: `sub`, `iat`, `exp`, `iss`, `aud`
- ✅ Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- ✅ Have a way to cancel tokens (blocklist, short expiry, etc.)

**Pitfalls:**
- ❌ `alg: none` attacks (check the algorithm explicitly)
- ❌ Storing JWT in `localStorage` (XSS-stealable)
- ❌ Long-lived access tokens (you can't cancel them)
- ❌ Putting sensitive data in JWT (it's base64, not encrypted)
- ❌ Skipping signature verification

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", or handing login to an identity provider (IdP)

ใช้ Authorization Code Flow with PKCE (Proof Key for Code Exchange) เสมอ เพราะกันไม่ให้ code ที่ถูกขโมยไปแลกเป็น token ได้ ลำดับขั้นอยู่ใน [references/auth-flows.md](references/auth-flows.md)

**Implementation requirements:**
- ✅ **Always use PKCE** (even for confidential clients)
- ✅ Validate `id_token` signature (use IdP's JWKS)
- ✅ Validate `aud`, `iss`, `exp`, `nonce`
- ✅ Use the `state` parameter to prevent cross-site request forgery (CSRF)
- ✅ Match `code_verifier` to `code_challenge`
- ✅ Use a library, don't write your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ❌ Implicit flow (deprecated, insecure)
- ❌ Resource Owner Password Credentials flow (deprecated)
- ❌ Skipping `state` validation (CSRF risk)
- ❌ Trusting `id_token` without verifying signature

## Pattern 4: Multi-Factor Authentication (MFA)

มี 3 แบบ ถ้าเป็นแอปใหม่ให้ใช้ WebAuthn (passkeys) เป็นค่าเริ่มต้น เพราะไม่มีความลับร่วมให้ถูกหลอกเอาไป ถ้าต้องการ 2FA มาตรฐานที่ผู้ใช้ตั้งเองได้ง่ายให้ใช้ TOTP ส่วน SMS หรือ email ให้ใช้เป็นทางสุดท้ายเท่านั้น เพราะ SMS ไม่ปลอดภัยจากการสลับซิม (SIM swap) รายละเอียดทั้ง 3 แบบอยู่ใน [references/mfa.md](references/mfa.md)

## Pattern 5: Password Management

### Storage
- ✅ **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ❌ Never: MD5, SHA-1, SHA-256 raw, plain text

### Password policy (NIST SP 800-63B-4 §3.1.1.2, checked 2026-10-14 at pages.nist.gov/800-63-4/sp800-63b.html)
- ✅ Minimum **15 characters** when the password is the only factor · minimum **8** when it is used only inside multi-factor authentication (MFA)
- ✅ Check against a list of breached passwords (Have I Been Pwned (HIBP) API)
- ✅ Allow long passphrases (any maximum must be at least 64 chars)
- ✅ Allow special characters (don't restrict them)
- ❌ Don't force composition rules (uppercase + digit + symbol)
- ❌ Don't force regular password changes (only when you suspect a breach)

### Password reset flow

ข้อที่ห้ามพลาดในการรีเซ็ตรหัสผ่าน: ข้อความตอบต้องเหมือนกันไม่ว่าอีเมลจะมีในระบบหรือไม่ token ต้องสุ่มอย่างน้อย 256 bits เก็บแบบ hash และหมดอายุใน 15 นาที และเมื่อตั้งรหัสใหม่แล้วต้องยกเลิกทุก session เดิมและส่งอีเมลยืนยัน ลำดับขั้นครบทั้ง 9 ข้ออยู่ใน [references/auth-flows.md](references/auth-flows.md)

## Pattern 6: Account Lockout & Rate Limiting

```
Login attempts:
- 5 failed attempts in 15 min → lock account 15 min
- 10 failed attempts in 1 hour → lock 1 hour
- Use IP + email combo, not just one

Lockout messaging:
✅ "Too many failed attempts. Try again in 15 minutes."
❌ "Account locked." (reveals account exists)
```

ให้ใช้เครื่องมือที่มีอยู่แล้วแทนการเขียนเอง รายชื่อเครื่องมืออยู่ใน [references/libraries-and-code.md](references/libraries-and-code.md)

## Pattern 7: API Authentication

เลือกตามผู้เรียก: API key สำหรับ server-to-server แบบง่าย · OAuth 2.0 Client Credentials สำหรับ service-to-service · mTLS สำหรับระบบภายในที่ต้องการความปลอดภัยสูง · HMAC signing สำหรับตรวจ webhook ส่วน API key ต้องแสดง secret ครั้งเดียวตอนสร้าง เก็บแบบ hash และให้ผู้ใช้ยกเลิกได้ทันที ตารางเทียบและหลักการครบอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

## Authorization Patterns (after authentication)

ใช้ RBAC (Role-Based Access Control) เป็นหลัก และใช้ ABAC (Attribute-Based Access Control) เมื่อต้องการสิทธิ์ละเอียดตามคุณสมบัติของข้อมูล ตัวอย่างอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

### Implementation tip
- Check authorization at every endpoint
- Don't trust a role sent by the client
- Check on the server, using the user from the session or token

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing, i.e. logins with leaked passwords (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration, i.e. finding which accounts exist (same error message every time)
- [ ] Timing attacks (compare in constant time)
- [ ] Token in URL (use header or cookie)
- [ ] Logout that does nothing on the server (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

## Anti-patterns

- ❌ Writing your own crypto or auth (use libraries)
- ❌ Storing passwords reversibly
- ❌ JWT for sessions when you have one backend
- ❌ Long-lived JWT without rotation
- ❌ Authentication without authorization checks
- ❌ Trusting JWT claims as authorization source
- ❌ Logout that doesn't invalidate token server-side
- ❌ Allowing weak passwords for compliance "convenience"


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

วิธียืนยันตัวตนของ API แต่ละแบบ หลักการจัดการ API key และตัวอย่าง RBAC กับ ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

ลำดับขั้นทีละข้อของ session · JWT · OAuth กับ PKCE และการรีเซ็ตรหัสผ่าน ใช้ตอนลงมือเขียนโค้ดหรือรีวิวว่าโค้ดทำครบทุกขั้นไหม ส่วนข้อกำหนดและข้อผิดพลาดที่ต้องเลี่ยงอยู่ใน `SKILL.md`

## Pattern 1: Session-Based Auth — Flow

```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

## Pattern 2: JWT — Flow

```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

## Pattern 3: OAuth 2.0 / OIDC — Authorization Code Flow with PKCE

PKCE = Proof Key for Code Exchange. It stops a stolen code from being swapped for a token.

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

## Pattern 5: Password reset flow

```
1. User requests reset (enter email)
2. Server: always show "if email exists, link sent" (don't leak)
3. Generate random token (≥ 256 bits), hash it, store with expiry (15 min)
4. Email link with raw token
5. User clicks → /reset?token=...
6. Server hashes input, compares, verifies expiry
7. User sets new password (apply policy)
8. Invalidate all existing sessions
9. Send confirmation email
```


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

โค้ดตัวอย่างการเก็บรหัสผ่าน เครื่องมือจำกัดจำนวนครั้ง และไลบรารีที่แนะนำแยกตามภาษา

## Password storage — code

```typescript
// ✅ Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// ❌ Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, `lucia-auth` | Lucia is simpler and newer |
| Python | `authlib`, `python-jose` | authlib for OAuth |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

รายละเอียดของการยืนยันตัวตนหลายขั้นทั้ง 3 แบบ ใช้ตอนเลือกหรือลงมือทำ MFA

## TOTP (Google Authenticator, Authy)
**When:** standard two-factor login (2FA), easy for users. TOTP = time-based one-time password.

```
Setup:
1. Server generates random secret (160 bits)
2. Server shows QR code: otpauth://totp/...?secret=...
3. User scans with authenticator app
4. User confirms with first code
5. Server stores secret encrypted

Verify:
1. User enters 6-digit code
2. Server computes expected code(s) (±1 window for clock drift)
3. Match → grant access
```

## WebAuthn (Passkeys) — Future-proof
**When:** you want login that phishing can't beat, no SMS, hardware keys

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret, so nothing to phish
- Default for new apps in 2026+

## SMS / Email codes
**When:** there's no other option (users without smartphone apps)

- ⚠️ SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry


---

# skill: database-design

Use when designing or changing a database schema (tables, columns, indexes, relations, migrations).

# ออกแบบฐานข้อมูล

> **กฎข้อเดียว:** schema คือของที่แก้ยากที่สุดในระบบ
> โค้ดผิดแก้วันนี้จบวันนี้ แต่ schema ผิดต้องอยู่กับมัน 3 ปี พร้อมข้อมูลจริงอีก 10 ล้านแถวที่ต้องย้ายตาม

## เมื่อไหร่ใช้ skill นี้

- ออกแบบฐานข้อมูลของระบบใหม่ หรือ module ใหม่
- จะเพิ่ม/แก้ตาราง คอลัมน์ ความสัมพันธ์ หรือ index
- จะเขียน migration โดยเฉพาะตอนที่ระบบมีข้อมูลจริงแล้ว
- query ช้าแล้วสงสัยว่าเป็นที่ schema หรือที่ index

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` | แทน |
| ออกแบบ endpoint และรูปร่าง JSON | `api-conventions` | แทน |
| เก็บรหัสผ่าน token สิทธิ์ผู้ใช้ | `auth-implementation-patterns` | แทน |
| ที่เก็บ connection string | `config-and-secrets` | แทน |
| รัน migration ใน pipeline | `cicd-and-release` | แทน |
| วาดผัง ER | `diagram-figures` หรือ `markdown-visuals` | คู่ |
| บันทึกเหตุผลที่เลือกฐานข้อมูลตัวนี้ | `adr-writer` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**ไวยากรณ์เฉพาะแต่ละฐานข้อมูล ชนิดข้อมูลเทียบกัน และคำสั่ง migration ของแต่ละ ORM** อยู่ใน `references/per-stack.md`

---

## 1 · เลือกชนิดฐานข้อมูลก่อน

| เกณฑ์ | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| ข้อมูลมีความสัมพันธ์ชัด ต้อง join | ✅ | ❌ ต้องทำมือ |
| รูปร่างข้อมูลไม่แน่นอน ต่างกันรายตัว | ⚠️ ใช้คอลัมน์ JSON | ✅ |
| ต้องการ transaction ข้ามหลายตาราง | ✅ | ⚠️ ได้แต่แพงกว่า |
| รายงาน ผลรวม การวิเคราะห์ | ✅ | ❌ |
| เขียนหนักมาก log/telemetry | ⚠️ | ✅ หรือใช้ time-series |

> **ค่าเริ่มต้นคือ relational** ให้เลือก document เมื่อ**ตอบได้ว่าทำไม**
> "ยืดหยุ่นกว่า" ไม่ใช่เหตุผล แต่แปลว่ายังไม่ได้ออกแบบ
> ระบบส่วนใหญ่ที่เลือก document เพราะยืดหยุ่น สุดท้ายเขียนโค้ด join เองในแอป

**ผสมกันได้**: ใช้ relational เป็นหลัก แล้วเก็บข้อมูลที่รูปร่างไม่แน่นอนเป็นคอลัมน์ `jsonb`
เกือบทุกกรณี ทางนี้ดีกว่าแยกฐานข้อมูล 2 ตัว

---

## 2 · กฎตั้งชื่อ — เลือกครั้งเดียว ใช้ทั้งระบบ

| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ตาราง | `snake_case` **พหูพจน์** | `orders`, `order_items` |
| คอลัมน์ | `snake_case` เอกพจน์ | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<ตารางเอกพจน์>_id` | `customer_id` |
| ตารางเชื่อม | `<a>_<b>` เรียงตามตัวอักษร | `role_users` → `user_roles` |
| index | `ix_<ตาราง>_<คอลัมน์>` | `ix_orders_customer_id` |
| unique | `ux_<ตาราง>_<คอลัมน์>` | `ux_users_email` |
| foreign key constraint | `fk_<ตาราง>_<ตารางปลายทาง>` | `fk_orders_customers` |
| check constraint | `ck_<ตาราง>_<เรื่อง>` | `ck_orders_total_non_negative` |

**สิ่งที่ห้ามทำ:**

- ❌ ใส่ชนิดข้อมูลในชื่อ เช่น `name_varchar`, `is_active_bit`
- ❌ ใส่ชื่อตารางนำหน้าคอลัมน์ เช่น `order_order_date` (มันอยู่ในตาราง `orders` อยู่แล้ว)
- ❌ ใช้คำสงวน เช่น `user`, `order`, `group`, `key` ซึ่งต้องใส่เครื่องหมายคำพูดทุกครั้ง ให้ใช้ `users`, `orders` แทน
- ❌ ตัวย่อที่คนอ่านไม่ออก เช่น `cst_nm` ประหยัดได้ 8 ตัวอักษร แต่แลกกับความสับสน 3 ปี

> SQL Server ใช้ `PascalCase` ก็ได้ ถ้าโปรเจกต์เดิมใช้อยู่แล้ว
> **ใช้แบบเดียวกันทั้งระบบสำคัญกว่าว่าแบบไหนถูก** อย่าเปลี่ยนกลางทาง

---

## 3 · คอลัมน์ที่ทุกตารางต้องมี

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

เพิ่มตามความจำเป็น:

| คอลัมน์ | ใส่เมื่อ | หมายเหตุ |
|---|---|---|
| `deleted_at timestamptz` | ต้องกู้ข้อมูลคืนได้ หรือกฎหมายบังคับให้เก็บ | **ทุก query ต้องกรอง** ไม่งั้นข้อมูลที่ลบแล้วโผล่ |
| `created_by` / `updated_by` | ต้องตอบได้ว่าใครแก้ | เก็บ id ผู้ใช้ ไม่ใช่ชื่อ |
| `row_version` / `xmin` | มีคนแก้พร้อมกันได้ | ใช้คู่กับ ETag ใน `api-conventions` |
| `tenant_id` | ระบบหลายผู้เช่า | ดูข้อ 10 |

> 🚨 **soft delete (ลบโดยแค่ติดป้าย) มีต้นทุน** คือทุก unique constraint ต้องคิดใหม่
> `ux_users_email` จะกันไม่ให้สมัครอีเมลเดิมซ้ำ แม้บัญชีเก่าถูกลบไปแล้ว
> แก้ด้วย partial index: `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · เลือกชนิด identifier

| ชนิด | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| `bigint` เรียงเพิ่ม | เล็ก เร็ว index ไม่แตก อ่านง่ายตอนไล่ปัญหา | เดา id ถัดไปได้ · รวมข้อมูลหลายที่แล้วชนกัน | ค่าเริ่มต้น ระบบเดียว ฐานข้อมูลเดียว |
| **UUIDv7 / ULID** | เรียงตามเวลา · สร้างจากฝั่งแอปได้ · ไม่ชนกัน | 16 ไบต์ · อ่านด้วยตายาก | ระบบกระจาย · ต้องสร้าง id ก่อนบันทึก · id โผล่ใน URL |
| `UUIDv4` สุ่มล้วน | ไม่ชนกัน เดาไม่ได้ | **index แตกกระจาย เขียนช้าลงชัดเจนเมื่อข้อมูลเยอะ** | เลี่ยงถ้าเลือกได้ |

> 🚨 **UUIDv4 เป็น primary key คือกับดักที่เจอบ่อยที่สุด**
> ค่าสุ่มล้วนทำให้ทุก insert ไปแทรกกลางโครงสร้าง index
> ข้อมูลหลักหมื่นยังไม่รู้สึก แต่พอถึงหลักสิบล้านจะช้าจนต้องรื้อ
> ถ้าต้องใช้ UUID ให้ใช้ **v7** ซึ่งขึ้นต้นด้วยเวลา จึงเรียงเพิ่มเหมือน bigint

**เลขที่คนเห็นไม่ใช่ primary key**: เลขใบสั่งซื้อ `SO-2026-00042` ที่ลูกค้าอ้างถึง
ให้เก็บเป็นคอลัมน์ต่างหากที่มี unique constraint และไม่เอา primary key ไปโชว์

---

## 5 · normalisation แค่ไหนพอ

**เริ่มที่ 3NF เสมอ**: ข้อเท็จจริง 1 อย่างเก็บที่เดียว

denormalise (ยอมเก็บข้อมูลซ้ำ) ได้เมื่อครบ 3 ข้อนี้เท่านั้น:

1. วัดแล้วว่าช้าจริง (มีตัวเลข ไม่ใช่ความรู้สึก)
2. รู้ว่าข้อมูลซ้ำจะถูกอัปเดตยังไงให้ตรงกัน
3. เขียนเหตุผลไว้ในคอมเมนต์ของตาราง

**ข้อยกเว้นที่ยอมรับกันทั่วไป**: ข้อมูลที่ต้อง "แช่แข็ง" ณ เวลาหนึ่ง
ราคาสินค้าในใบสั่งซื้อต้องคัดลอกลง `order_items.unit_price`
ไม่ join ไปหา `products.price` เพราะราคาวันนี้ไม่ใช่ราคาวันที่ลูกค้าซื้อ

---

## 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

รายละเอียด 4 ชนิดข้อมูลที่พลาดกันประจำ (เงิน · เวลา · enum หรือสถานะ · boolean) พร้อมตัวอย่าง อยู่ใน [`data-types`](references/data-types.md)

## 7 · index — วางตรงไหนถึงได้ผล

**ต้องมี:**

- ทุก foreign key (ฐานข้อมูลส่วนใหญ่ **ไม่สร้างให้อัตโนมัติ**)
- คอลัมน์ที่อยู่ใน `WHERE` ของ query ที่รันบ่อย
- คอลัมน์ที่ใช้ `ORDER BY` คู่กับ pagination

**composite index (index หลายคอลัมน์): ลำดับคอลัมน์สำคัญ**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

เรียงคอลัมน์ตามเงื่อนไข: **เท่ากับ → ช่วง → เรียงลำดับ**
index `(a, b)` ใช้กับ query ที่กรองด้วย `a` อย่างเดียวได้ แต่กรองด้วย `b` อย่างเดียว**ไม่ได้**

**อย่าใส่ index เมื่อ:**

- ตารางเล็กกว่าไม่กี่พันแถว เพราะฐานข้อมูลอ่านทั้งตารางเร็วกว่า
- คอลัมน์มีค่าซ้ำเยอะ เช่น `is_active` ที่ 95% เป็น true
- ตารางเขียนบ่อยกว่าอ่านมาก เพราะทุก index เพิ่มต้นทุนทุกครั้งที่เขียน

> **วัดก่อนเดา**: `EXPLAIN ANALYZE` (PostgreSQL) หรือ execution plan (SQL Server)
> บอกได้ว่า index ถูกใช้จริงไหม ส่วนการเดาว่า "น่าจะช่วย" ผิดบ่อยกว่าถูก

---

## 8 · constraint อยู่ที่ฐานข้อมูล ไม่ใช่แค่ที่แอป

| กฎ | ที่ควรอยู่ |
|---|---|
| อีเมลห้ามซ้ำ | `UNIQUE` ที่ฐานข้อมูล **และ** ตรวจในแอปเพื่อให้ข้อความ error สวย |
| ยอดเงินห้ามติดลบ | `CHECK (total_amount >= 0)` |
| ใบสั่งซื้อต้องมีลูกค้าจริง | `FOREIGN KEY` |
| สถานะต้องเป็นค่าที่กำหนด | `CHECK` หรือ lookup table |

> **เหตุผล:** แอปไม่ใช่ทางเดียวที่แตะข้อมูล ยังมี script แก้ข้อมูลด่วน
> งาน import ตอนตี 3 และ service ตัวที่ 2 ที่เขียนทีหลัง
> constraint ที่ฐานข้อมูลคือด่านสุดท้ายที่ไม่มีใครข้ามได้

**`ON DELETE` ต้องเลือกอย่างตั้งใจ:**

| ตัวเลือก | ความหมาย | ใช้กับ |
|---|---|---|
| `RESTRICT` (ค่าเริ่มต้นที่ควรใช้) | ลบไม่ได้ถ้ายังมีลูก | เกือบทุกกรณี |
| `CASCADE` | ลบลูกตามทั้งหมด | ของที่เป็นส่วนประกอบจริง ๆ เช่น `order_items` |
| `SET NULL` | ลูกกลายเป็นไม่มีพ่อ | ความสัมพันธ์ที่ไม่บังคับ |

ถ้าใส่ `CASCADE` ผิดที่เดียว ลบลูกค้า 1 คน แล้วประวัติการซื้อ 10 ปีจะหายตาม

---

## 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

ขั้นตอน expand-and-contract และตัวอย่าง migration ที่ deploy ได้โดยไม่ปิดระบบ อยู่ใน [`migrations`](references/migrations.md)

คลังข้อมูลเพื่อวิเคราะห์ (star schema · SCD · ELT) อยู่ใน [`warehouse-modeling`](references/warehouse-modeling.md) · pipeline ที่รันซ้ำได้ (incremental · backfill · ทดสอบคุณภาพข้อมูล · checklist ก่อนขึ้น production) อยู่ใน [`data-pipeline-patterns`](references/data-pipeline-patterns.md)

## 10 · ระบบหลายผู้เช่า (multi-tenant)

| แบบ | แยกกันแค่ไหน | ต้นทุน | เหมาะกับ |
|---|---|---|---|
| คอลัมน์ `tenant_id` ในทุกตาราง | ต่ำ พลาดที่เดียวข้อมูลก็รั่วข้ามผู้เช่า | ถูกสุด | ผู้เช่าเยอะ ข้อมูลต่อรายไม่ใหญ่ |
| schema แยกต่อผู้เช่า | กลาง | migration ต้องวนทุก schema | ผู้เช่าหลักสิบถึงหลักร้อย |
| ฐานข้อมูลแยกต่อผู้เช่า | สูงสุด | แพงสุด | ลูกค้าองค์กรที่บังคับให้แยก |

> 🚨 ถ้าเลือกแบบ `tenant_id` ให้**บังคับที่ชั้นล่างสุด ไม่ใช่ใส่ใน query ทีละตัว**
> ใช้ row-level security ของฐานข้อมูล หรือ global filter ของ ORM
> query ที่ลืมใส่ `WHERE tenant_id = ?` แค่ตัวเดียว ก็ทำให้ข้อมูลลูกค้ารายหนึ่งโผล่ให้อีกรายเห็น
> และไม่มี error ให้เห็นเลย

---

## 11 · ข้อมูลส่วนบุคคล

- ทำรายการว่า **คอลัมน์ไหนเป็นข้อมูลส่วนบุคคล** ถ้าไม่มีรายการนี้จะตอบคำถาม "ข้อมูลฉันอยู่ที่ไหนบ้าง" ไม่ได้
- เลขบัตรประชาชน หมายเลขบัตรเครดิต และข้อมูลสุขภาพ ให้เข้ารหัสระดับคอลัมน์ หรือไม่เก็บเลยถ้าไม่จำเป็น
- กำหนด **อายุการเก็บ** ต่อตาราง และมีงานลบจริงตามนั้น
- ต้องลบได้เมื่อเจ้าของขอ และ soft delete อย่างเดียวไม่นับว่าลบ
- ห้ามคัดลอกข้อมูลจริงลงเครื่อง developer โดยไม่ปิดบัง

---

## 12 · Anti-patterns

- ❌ **ตารางเดียวเก็บทุกอย่าง** (`entity` / `attribute` / `value`) query อะไรก็ยากไปหมด
- ❌ **`varchar(255)` ทุกคอลัมน์** ตัวเลขนี้ไม่มีความหมายอะไร ให้กำหนดจากข้อมูลจริง
- ❌ **เก็บหลายค่าในคอลัมน์เดียว** เช่น `"1,4,7"` ค้นไม่ได้ ใส่ constraint ไม่ได้ ให้ใช้ตารางเชื่อม
- ❌ **ไม่มี foreign key เพราะ "แอปดูแลเอง"** สักวันจะมีแถวกำพร้า
- ❌ **index ทุกคอลัมน์เผื่อไว้** เขียนช้าลง พื้นที่บาน โดยไม่มีใครได้ประโยชน์
- ❌ **`SELECT *` ในโค้ดจริง** เพิ่มคอลัมน์ทีไรโค้ดพังทุกที
- ❌ **ตรรกะธุรกิจใน trigger** ไล่ปัญหาไม่เจอ เพราะไม่มีใครเห็นว่ามันทำงาน
- ❌ **migration ที่เขียนข้อมูลด้วย** ปนกับที่เปลี่ยนโครงสร้าง พอ rollback ข้อมูลก็หาย
- ❌ **แก้ schema บน production ด้วยมือ** deploy รอบหน้า schema จะไม่ตรงกัน


## reference: data-pipeline-patterns.md

# Data pipeline patterns — incremental, backfill, quality, catalog

ย้ายมาจาก agent `data-engineer` (2026-10-14) · ทุก pipeline ต้องรันซ้ำได้ผลเท่าเดิม (`principle-safe-to-rerun`) และส่งค่าเข้า SQL เป็น parameter เสมอ

**สารบัญ:**

- [Pipeline Patterns](#pipeline-patterns)
- [Data Catalog Pattern](#data-catalog-pattern)
- [Production Pipeline Checklist](#production-pipeline-checklist)

## Pipeline Patterns

### Pattern 1: Incremental Loading

```sql
-- dbt incremental model
{{ config(materialized='incremental', unique_key='id') }}

SELECT
    id,
    user_id,
    event_type,
    created_at
FROM {{ source('raw', 'events') }}
WHERE 1=1
{% if is_incremental() %}
    -- Only new since last run
    AND created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}
```

### Pattern 2: Late-arriving Data

```sql
-- Don't just look at last 1 hour, look back further for late events
WHERE created_at > NOW() - INTERVAL '7 days'  -- buffer
  AND created_at > (SELECT MAX(created_at) - INTERVAL '1 day' FROM target)
```

### Pattern 3: Data Quality Tests (dbt)

```yaml
# models/marts/orders.yml
version: 2

models:
  - name: orders
    description: One row per order
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
      - name: amount
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

### Pattern 4: Idempotent Backfills

```python
# Backfill should be safe to re-run
async def backfill(start_date: date, end_date: date):
    for d in date_range(start_date, end_date):
        # DELETE then INSERT in one transaction (idempotent); value passed as a parameter, never in the SQL string
        async with db.transaction():
            await db.execute("DELETE FROM target WHERE date = $1", d)
            await load_for_date(d)
```

### Pattern 5: Real-time Pipeline

```python
# Kafka consumer pattern
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'events',
    bootstrap_servers='kafka:9092',
    enable_auto_commit=False,  # ← manual commit for exactly-once
    isolation_level='read_committed',
)

batch = []
for message in consumer:
    batch.append(parse(message))

    if len(batch) >= 1000:
        # Atomic write + commit
        with db.transaction():
            db.bulk_insert('events', batch)
            consumer.commit()  # only after DB write succeeds
        batch = []
```

## Data Catalog Pattern

For every table, document:

```yaml
- table: dim_customer
  description: Slowly-changing customer master
  owner: data-team
  freshness: hourly
  source: postgres.app.users (CDC)
  pii: yes
  retention: 7 years
  columns:
    - name: customer_key
      description: Surrogate key
    - name: customer_id
      description: Natural key from source system
    - name: email
      pii: yes
```

## Production Pipeline Checklist

- [ ] Schema validation at ingestion
- [ ] Schema evolution handled (additive only)
- [ ] Tests on critical columns (uniqueness, not-null, ranges)
- [ ] Monitoring on row counts, freshness, error rates
- [ ] Alerting (PagerDuty / Slack) on failures
- [ ] Backfill procedure documented + tested
- [ ] Idempotency verified
- [ ] Lineage visible (dbt docs, OpenLineage)
- [ ] PII tagged
- [ ] Access controls per dataset
- [ ] Cost monitored (query / storage)


## reference: data-types.md

# 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

ย้ายมาจาก `database-design` SKILL.md หัวข้อเดียวกัน

### เงิน

```sql
total_amount   numeric(19,4)   NOT NULL      -- ✅
currency       char(3)         NOT NULL      -- ✅ ISO 4217 เช่น THB
total_amount   float / double                -- ❌ 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> ❌ **float กับเงินคือบั๊กที่หาไม่เจอ** ยอดรวมเพี้ยนรายการละ 1 สตางค์
> ปิดงบสิ้นเดือนถึงรู้ แล้วไล่ย้อนไม่ได้ว่าเพี้ยนตรงไหน

### เวลา

| เก็บ | ใช้ | เหตุผล |
|---|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` (SQL Server ใช้ `datetimeoffset`) เก็บเป็น UTC | ประเทศไทยไม่มี daylight saving แต่ระบบที่ขายต่างประเทศมี |
| วันเกิด วันครบกำหนด | `date` | ไม่มีเวลา ไม่มีโซนเวลา |
| ช่วงเวลาเปิดร้าน | `time` + คอลัมน์โซนเวลาแยก | |

**กฎ:** เก็บ UTC แล้วแปลงเป็น `+07:00` ตอนแสดงผลเท่านั้น ห้ามเก็บเวลาไทยดิบ ๆ ใน `timestamp` ที่ไม่มีโซน

**พุทธศักราช**: เก็บเป็น ค.ศ. เสมอ แล้วแปลงเป็น พ.ศ. ตอนแสดงผล
ถ้าเก็บปี 2569 ลงฐานข้อมูล ทุกฟังก์ชันจะคำนวณช่วงเวลาผิด

### enum / สถานะ

| วิธี | ดีเมื่อ | เสียเมื่อ |
|---|---|---|
| ตาราง lookup + foreign key | ค่าเพิ่มได้โดยไม่ deploy มีชื่อไทย/อังกฤษ และมีลำดับการแสดง | ต้อง join |
| `check constraint` เป็นข้อความ | ค่าคงที่ ไม่ค่อยเปลี่ยน | เพิ่มค่าต้อง migration |
| ชนิด `enum` ของ PostgreSQL | เร็ว เล็ก | **ลบค่าออกไม่ได้** เปลี่ยนลำดับไม่ได้ |
| `int` ดิบ ๆ | — | ❌ อ่าน `status = 3` แล้วไม่มีใครรู้ว่าอะไร |

### boolean

- ตั้งชื่อเป็นประโยคบอกเล่าเชิงบวก: `is_active` ✅ · `is_not_disabled` ❌
- **ถ้าอาจมีสถานะที่ 3 ในอนาคต อย่าใช้ boolean** เพราะ `is_approved` จะกลายเป็น `approval_status`
  ภายใน 6 เดือน เมื่อมี "รออนุมัติ" เพิ่มมา

---


## reference: migrations.md

# 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

ย้ายมาจาก `database-design` SKILL.md หัวข้อเดียวกัน

**กฎ 3 ข้อ:**

1. **เดินหน้าอย่างเดียว**: migration ที่ merge แล้วห้ามแก้ ถ้าผิดให้เขียนตัวใหม่ทับ
2. **1 migration ทำเรื่องเดียว**: ไล่ปัญหาง่าย และ rollback ได้ตรงจุด
3. **โค้ดเวอร์ชันเก่ากับ schema เวอร์ชันใหม่ต้องทำงานด้วยกันได้** เพราะระหว่าง deploy มีโค้ดทั้ง 2 เวอร์ชันรันพร้อมกันเสมอ

### expand / contract — ขั้นตอนมาตรฐานสำหรับการเปลี่ยนที่ทำลายของเดิม

ตัวอย่าง: เปลี่ยนชื่อคอลัมน์ `name` → `full_name`

| รอบ deploy | ฐานข้อมูล | โค้ด |
|:--:|---|---|
| **1 · ขยาย** | เพิ่ม `full_name` (nullable) | เขียนลงทั้ง 2 คอลัมน์ · อ่านจาก `name` |
| **2 · ย้าย** | คัดลอกข้อมูลเก่าเป็นชุด ๆ | อ่านจาก `full_name` ถ้าไม่มีค่อยดู `name` |
| **3 · บีบ** | ตั้ง `NOT NULL` · ลบ `name` | อ่านและเขียน `full_name` อย่างเดียว |

ทำ 3 รอบดูเสียเวลา แต่ทุกรอบ rollback ได้โดยไม่เสียข้อมูล
ถ้าทำรอบเดียว ก็ต้องยอมรับว่าต้องปิดระบบ

**คำสั่งที่ล็อกตารางจนระบบค้าง** (ระวังเป็นพิเศษบนตารางใหญ่):

- เพิ่มคอลัมน์ที่มี `DEFAULT` และ `NOT NULL` พร้อมกัน ซึ่ง PostgreSQL รุ่นใหม่ทำได้เร็ว แต่ MySQL ยังเขียนใหม่ทั้งตาราง
- เปลี่ยนชนิดข้อมูล
- สร้าง index ธรรมดา ให้ใช้ `CREATE INDEX CONCURRENTLY` แทน (PostgreSQL) หรือ `ONLINE = ON` (SQL Server)

**ทดสอบ migration กับสำเนาข้อมูลจริงเสมอ** เพราะ migration ที่รัน 0.2 วินาทีบนเครื่องตัวเอง
อาจใช้ 40 นาทีบน production และล็อกตารางไว้ตลอด

---


## reference: per-stack.md

# ไวยากรณ์และเครื่องมือแยกตามฐานข้อมูล/ORM

1. [ชนิดข้อมูลเทียบกัน](#1--ชนิดข้อมูลเทียบกัน)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [คำสั่งตรวจ query ช้า](#9--คำสั่งตรวจ-query-ช้า)

---

## 1 · ชนิดข้อมูลเทียบกัน

| ต้องการเก็บ | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| id เรียงเพิ่ม | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` หรือ `CHAR(36)` |
| เงิน | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| เวลา + โซนเวลา | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (เก็บ UTC) |
| วันที่ล้วน | `date` | `date` | `DATE` |
| ข้อความยาวไม่จำกัด | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| ข้อความไทย | `text` (UTF-8 อยู่แล้ว) | **`nvarchar` เท่านั้น** | `utf8mb4` |
| จริง/เท็จ | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (มี index ได้) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| ไฟล์ไบนารี | `bytea` (หรือเก็บนอกฐานข้อมูล) | `varbinary(max)` | `BLOB` |

> 🚨 **SQL Server + ภาษาไทย**: `varchar` ทำให้ตัวอักษรไทยกลายเป็น `?`
> ต้องใช้ `nvarchar` และเขียนค่าคงที่เป็น `N'ข้อความ'` เสมอ
>
> 🚨 **MySQL ต้องเป็น `utf8mb4`** เพราะชุดอักขระชื่อ `utf8` เฉย ๆ ของ MySQL
> เก็บได้แค่ 3 ไบต์ต่อตัว อีโมจิและอักขระบางตัวจึงหาย

---

## 2 · PostgreSQL

```sql
CREATE TABLE orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no      varchar(20)  NOT NULL,
  customer_id   bigint       NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status        varchar(20)  NOT NULL DEFAULT 'draft',
  total_amount  numeric(19,4) NOT NULL DEFAULT 0,
  currency      char(3)      NOT NULL DEFAULT 'THB',
  meta          jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0),
  CONSTRAINT ck_orders_status CHECK (status IN ('draft','confirmed','shipped','cancelled'))
);

CREATE UNIQUE INDEX ux_orders_order_no ON orders (order_no) WHERE deleted_at IS NULL;
CREATE INDEX ix_orders_customer_id ON orders (customer_id);
CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC);
```

**สร้าง index โดยไม่ล็อกตาราง:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- ห้ามอยู่ใน transaction · ถ้าล้มจะเหลือ index สถานะ invalid ต้อง DROP แล้วทำใหม่
```

**อัปเดต `updated_at` อัตโนมัติ:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**row-level security สำหรับระบบหลายผู้เช่า:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- แอปตั้งค่าต่อ connection: SET app.tenant_id = '42';
```

---

## 3 · SQL Server

```sql
CREATE TABLE orders (
  id            bigint IDENTITY(1,1) PRIMARY KEY,
  order_no      nvarchar(20)   NOT NULL,
  customer_id   bigint         NOT NULL,
  status        nvarchar(20)   NOT NULL CONSTRAINT df_orders_status DEFAULT N'draft',
  total_amount  decimal(19,4)  NOT NULL CONSTRAINT df_orders_total DEFAULT 0,
  created_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_created DEFAULT sysdatetimeoffset(),
  updated_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_updated DEFAULT sysdatetimeoffset(),
  row_version   rowversion,
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0)
);

CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC)
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL เท่านั้น
```

- `rowversion` ใช้เป็น ETag ตรวจว่ามีคนแก้ชนกันได้ตรง ๆ
- ถ้าต้องเรียงลำดับภาษาไทย ให้ตั้ง collation `Thai_100_CI_AS` ที่ระดับคอลัมน์หรือฐานข้อมูล
- `datetime` แบบเก่าละเอียดแค่ 3.33 มิลลิวินาที ให้ใช้ `datetime2` / `datetimeoffset` แทน

---

## 4 · MySQL / MariaDB

```sql
CREATE TABLE orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(20)   NOT NULL,
  customer_id  BIGINT        NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_orders_order_no (order_no),
  KEY ix_orders_customer_id (customer_id),
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- `ALTER TABLE` ส่วนใหญ่เขียนตารางใหม่ทั้งตาราง ตารางใหญ่จึงควรใช้ `pt-online-schema-change` หรือ `gh-ost`
- ตั้งเวลาเซิร์ฟเวอร์เป็น UTC (`default_time_zone = '+00:00'`)

---

## 5 · MongoDB

```js
db.createCollection("orders", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["orderNo", "customerId", "totalAmount", "createdAt"],
    properties: {
      orderNo:     { bsonType: "string" },
      customerId:  { bsonType: "objectId" },
      totalAmount: { bsonType: "decimal" },   // ❌ อย่าใช้ double กับเงิน
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอ และไม่โตไม่จำกัด** นอกนั้นใช้การอ้างอิง
- เอกสาร 1 ใบมีเพดาน 16 MB อาเรย์ที่โตเรื่อย ๆ จึงชนเพดานสักวัน
- เงินใช้ `Decimal128` เท่านั้น

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ✅ ตรวจ SQL ก่อนรันจริง
dotnet ef database update                                # dev เท่านั้น
```

> **บน production รัน script ที่ตรวจแล้ว ไม่ใช่ `database update`**
> คำสั่งนั้นต้องให้ connection ของแอปมีสิทธิ์แก้ schema ซึ่งไม่ควรมีตั้งแต่แรก

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete ทั้งระบบ
    e.Property(x => x.RowVersion).IsRowVersion();        // ตรวจการแก้ชนกัน
});
```

---

## 7 · Prisma / Drizzle (Node)

```prisma
model Order {
  id          BigInt   @id @default(autoincrement())
  orderNo     String   @unique @map("order_no") @db.VarChar(20)
  totalAmount Decimal  @map("total_amount") @db.Decimal(19, 4)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(3)
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  BigInt   @map("customer_id")

  @@index([status, createdAt], name: "ix_orders_status_created")
  @@map("orders")
}
```

```bash
npx prisma migrate dev --name add_order_status   # dev — สร้างไฟล์ migration
npx prisma migrate deploy                        # production — รันเฉพาะที่มีอยู่แล้ว
```

- `Decimal` ของ Prisma คืนค่าเป็น object ไม่ใช่ number ให้คำนวณด้วย `decimal.js` อย่าแปลงเป็น float
- `BigInt` แปลงเป็น JSON ตรง ๆ ไม่ได้ ต้องแปลงเป็น string ที่ชั้น API

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

```python
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")
    op.alter_column("orders", "status", nullable=False)
    op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                    postgresql_concurrently=True)
```

> `--autogenerate` **ไม่เห็น** การเปลี่ยนชื่อ (มองเป็นลบแล้วเพิ่มใหม่ ข้อมูลจึงหาย)
> อ่านไฟล์ที่มันสร้างก่อน commit ทุกครั้ง

---

## 9 · คำสั่งตรวจ query ช้า

| ฐานข้อมูล | คำสั่ง |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · ส่วนขยาย `pg_stat_statements` |
| SQL Server | เปิด "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**สัญญาณอันตรายที่ต้องแก้:** `Seq Scan` / `Table Scan` บนตารางใหญ่ ·
จำนวนแถวที่ประมาณไว้ต่างจากที่ได้จริงเกิน 10 เท่า · `Nested Loop` ที่วนหลักแสนรอบ


## reference: warehouse-modeling.md

# Warehouse modeling — ELT, stack, star schema, SCD

สำหรับคลังข้อมูลเพื่อวิเคราะห์ (analytics warehouse) ไม่ใช่ฐานข้อมูลของแอป — ย้ายมาจาก agent `data-engineer` (2026-10-14)

**สารบัญ:**

- [ELT vs ETL (Modern Default: ELT)](#elt-vs-etl-modern-default-elt)
- [Tech Stack (2026 Recommendations)](#tech-stack-2026-recommendations)
- [Schema Design: Star/Snowflake](#schema-design-starsnowflake)
- [SCD (Slowly Changing Dimensions)](#scd-slowly-changing-dimensions)

## ELT vs ETL (Modern Default: ELT)

```
ETL (old way):
Source → Transform → Warehouse
        ↑
        Limited compute, slow

ELT (modern):
Source → Load raw → Transform in warehouse
                    ↑
                    Snowflake/BigQuery scale
```

> 💡 **2026 default: ELT with dbt** — load raw to warehouse, transform with SQL via dbt

## Tech Stack (2026 Recommendations)

> รายชื่อเครื่องมือจากความรู้ของโมเดล ยังไม่ได้ตรวจกับเว็บทางการ (รอยืนยัน) — ตรวจก่อนแนะนำ

### Warehouse / Lake
| Tool | Best for | Cost |
|------|----------|------|
| **Snowflake** | Pure warehouse, separation of compute/storage | 💰💰 |
| **BigQuery** | Serverless, ad-hoc, GCP shops | 💰💰 |
| **Databricks** | Unified lake + warehouse, ML-heavy | 💰💰💰 |
| **DuckDB** | Local dev, embedded analytics | 💰 free |
| **Redshift** | AWS-native, legacy | 💰💰 |
| **Postgres** | Small data (<1TB), simplicity | 💰 |

### Transformation
- **dbt** — SQL-based, version controlled, tested (industry default)
- **SQLMesh** — newer alternative to dbt, stronger features

### Orchestration
- **Airflow** — most popular, mature
- **Prefect** — modern Python-native
- **Dagster** — software-engineering approach to pipelines

### Stream Processing
- **Kafka + Flink** — high throughput, exactly-once
- **Kinesis Streams + Flink** — AWS-native
- **Pub/Sub + Dataflow** — GCP-native
- **Materialized views** (Snowflake, BigQuery) — for simple cases

### Ingestion
- **Airbyte** — open source, many connectors
- **Fivetran** — managed, expensive but reliable
- **Estuary** — modern, streaming-first
- **Custom** — for sources not covered

## Schema Design: Star/Snowflake

```sql
-- Fact table (events / measurements)
CREATE TABLE fact_orders (
    order_key BIGINT PRIMARY KEY,
    customer_key BIGINT,
    product_key BIGINT,
    date_key INT,
    quantity INT,
    amount DECIMAL(12,2),
    -- foreign keys to dimensions
);

-- Dimension tables (descriptive context)
CREATE TABLE dim_customer (
    customer_key BIGINT PRIMARY KEY,
    customer_id VARCHAR,        -- natural key
    name VARCHAR,
    email VARCHAR,
    country VARCHAR,
    -- SCD Type 2 tracking:
    valid_from DATE,
    valid_to DATE,
    is_current BOOLEAN
);
```

> 💡 **Star = denormalized, query-fast**
> **Snowflake = normalized dims, save storage**
> **Wide tables / OBT (One Big Table) = even faster for analytics**

## SCD (Slowly Changing Dimensions)

### Type 1: Overwrite
```
Customer Bob lived in Bangkok. Moved to Phuket.
→ Update row, lose Bangkok history
```

### Type 2: New row per change (most common)
```
| customer_key | id | name | city    | valid_from | valid_to   | is_current |
| 1            | 42 | Bob  | Bangkok | 2024-01-01 | 2025-06-30 | false      |
| 2            | 42 | Bob  | Phuket  | 2025-07-01 | 9999-12-31 | true       |
```

### Type 3: Add column
```
Customer table: current_city, previous_city
→ Only most recent change preserved
```


---

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

# skill: background-jobs

Use when work runs outside the user request (mail, reports, imports, schedules). Queues, retries.

# งานเบื้องหลัง

> **กฎข้อเดียว:** งานเบื้องหลังทุกตัวต้อง**รันซ้ำได้โดยไม่เกิดผลซ้ำ**
> เพราะมันจะถูกรันซ้ำแน่นอน: เครื่องดับกลางทาง · คนกดใหม่ · ระบบ retry ให้เอง

## เมื่อไหร่ใช้ skill นี้

- งานที่ผู้ใช้ไม่ควรต้องนั่งรอ: ส่งอีเมล สร้างรายงาน นำเข้าไฟล์
- งานตามเวลา: สรุปรายวัน ปิดยอดสิ้นเดือน ลบข้อมูลที่หมดอายุ
- เรียกระบบภายนอกที่ช้าหรือล่มบ่อย
- คิวตันหรือมีงานหายแล้วไม่มีใครรู้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| timeout และการ retry ของคำขอปกติ | `error-handling-patterns` | แทน |
| ตัวชี้วัดและการแจ้งเตือน | `observability-basics` | แทน |
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` | แทน |
| นำเข้าไฟล์ Excel/CSV เป็นเนื้องาน | `data-import-export` | แทน |
| ส่งอีเมล/SMS เป็นเนื้องาน | `notifications` | แทน |
| ตารางงานและ index | `database-design` | คู่ |
| log ของ worker และ correlation id | `logging-standards` | คู่ |
| งานลบข้อมูลที่หมดอายุ | `pdpa-compliance` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · อะไรควรไปอยู่เบื้องหลัง

| เอาไปเบื้องหลัง | ทำในคำขอเลย |
|---|---|
| ใช้เวลาเกิน 1–2 วินาที | เร็วและผู้ใช้ต้องเห็นผลทันที |
| เรียกระบบภายนอกที่ล้มได้ | ตรวจสิทธิ์ · ตรวจข้อมูล |
| ผู้ใช้ไม่ต้องรอผล (อีเมล แจ้งเตือน) | ผลลัพธ์คือสิ่งที่เขากดมาดู |
| งานหลายรายการเป็นชุด | |

> **อย่าเอาไปเบื้องหลังเพียงเพราะมันช้า** ถ้าผู้ใช้ต้องเห็นผลก่อนไปต่อ
> การย้ายไปเบื้องหลังจะต้องเพิ่มหน้าจอรอ การแจ้งเตือน และที่เก็บผลลัพธ์
> บางครั้งแก้ให้เร็วขึ้นถูกกว่ามาก (ดู `lazy-coding`)

---

## 2 · เลือกกลไก

| กลไก | เหมาะกับ | ระวัง |
|---|---|---|
| **ตารางงานในฐานข้อมูล** | ระบบเล็ก–กลาง · งานไม่เกินหลักพันต่อวัน | ต้องเขียนตัวหยิบงานเอง · ระวัง worker แย่งงานกัน |
| **คิวจริง** (Redis · RabbitMQ · SQS) | งานเยอะ · ต้องการ retry และ dead letter ในตัว | เพิ่มของที่ต้องดูแล |
| ตัวตั้งเวลาในแอป (cron ในโค้ด) | งานตามเวลาที่มี instance เดียว | **หลาย instance จะรันพร้อมกัน** · ดูข้อ 5 |
| ตัวตั้งเวลาของแพลตฟอร์ม | งานตามเวลาบนคลาวด์ | |

**ถ้าระบบยังเล็ก ให้เริ่มจากตารางในฐานข้อมูลก่อนเสมอ** เพราะ `SELECT ... FOR UPDATE SKIP LOCKED`
ของ PostgreSQL ให้หลาย worker หยิบงานพร้อมกันได้อย่างปลอดภัย โดยไม่ต้องเพิ่มระบบใหม่

**ทุกงานต้องมีอย่างน้อย:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · รันซ้ำแล้วต้องไม่เกิดผลซ้ำ

ระบบคิวเกือบทั้งหมดรับประกันแค่ว่า "ส่งถึงอย่างน้อย 1 ครั้ง" **ไม่ใช่ 1 ครั้งพอดี**

| วิธี | ใช้ยังไง |
|---|---|
| **กุญแจกันซ้ำ** | unique constraint บน `(job_type, business_key)` ทำให้งานซ้ำ insert ไม่ผ่าน |
| **ตรวจสถานะก่อนทำ** | "ถ้าใบสั่งซื้อนี้ส่งอีเมลไปแล้ว ให้จบเลย" |
| **ส่งต่อ idempotency key** | เวลาเรียก API ภายนอก (ดู `api-conventions`) |
| **ตั้งค่าให้เป็นค่าใหม่ ไม่บวกเพิ่มจากค่าเดิม** | `set status = 'paid'` ปลอดภัยกว่า `balance = balance + 100` |

> 🚨 **งานที่บวกค่าหรือส่งของออกไปข้างนอก ถ้ารันซ้ำจะเสียเงินจริง**
> อีเมล 2 ฉบับแค่น่ารำคาญ แต่โอนเงิน 2 ครั้งเป็นเรื่องใหญ่

---

## 4 · retry และงานที่ตายแล้ว

ตัวเลขนี้สำหรับงานในคิว · ลองใหม่ระหว่างที่ผู้ใช้รอคำตอบใช้ของ [`error-handling-patterns`](../error-handling-patterns/SKILL.md) (3 ครั้ง 1/2/4 วินาที)

```
ล้ม → รอ 1 นาที → ล้ม → รอ 5 นาที → ล้ม → รอ 15 นาที → ล้มครั้งที่ 4 → dead letter
```

| กฎ | รายละเอียด |
|---|---|
| **มีเพดานเสมอ** | 3–5 ครั้ง ถ้า retry ไม่จำกัด งานเดียวก็ทำให้คิวตัน |
| เว้นเวลาเพิ่มเป็นทวีคูณ + สุ่มเล็กน้อย | เหมือน `error-handling-patterns` |
| ข้อมูลผิดไม่ต้อง retry | payload ผิดรูปแบบ ลองอีกกี่ครั้งก็เหมือนเดิม |
| **งานที่หมดสิทธิ์ต้องไปที่เดียว** | dead letter (ที่เก็บงานที่ล้มจนหมดสิทธิ์) โดยเก็บ payload เต็มและ error ล่าสุด |
| ต้องมีคนดู dead letter | **แจ้งเตือนเมื่อมีงานเข้าไปใหม่** ไม่ใช่รอให้ลูกค้าทัก |
| เอากลับมารันใหม่ได้ | แก้ต้นเหตุแล้วสั่งรันใหม่จาก dead letter ได้ โดยไม่ต้องเขียนสคริปต์ |

**งานที่ค้างเพราะ worker ตาย** ต้องมีตัวปลดล็อก
งานที่ `locked_at` เก่ากว่า N นาที ให้ถือว่าไม่มีใครทำอยู่แล้ว แล้วปลดล็อกให้ worker อื่นหยิบไปทำต่อ

---

## 5 · งานตามเวลา

> 🚨 **ถ้ามีหลาย instance งานตามเวลาจะรันหลายรอบพร้อมกัน**
> รายงานสรุปยอดถูกส่ง 3 ฉบับ หรือหักเงิน 3 ครั้ง ก็เพราะข้อนี้

| วิธี | ใช้เมื่อ |
|---|---|
| ล็อกที่ฐานข้อมูล (advisory lock) | ทำได้ทันที ไม่ต้องเพิ่มของ |
| ตัวตั้งเวลาของแพลตฟอร์มยิงเข้ามาที่ endpoint | บนคลาวด์ · Kubernetes CronJob |
| ตัวตั้งเวลาที่รองรับหลาย instance โดยตรง | Quartz · Hangfire |

**กฎของงานตามเวลา:**

- **รับช่วงเวลาเป็นพารามิเตอร์** จะได้รันย้อนหลังวันที่พลาดได้โดยไม่ต้องแก้โค้ด
- ถ้าตกไป 1 รอบ ต้องตามเก็บได้ ไม่ข้ามไปเลย
- ระบุเขตเวลาให้ชัดว่า "ทุกเที่ยงคืน" ของเขตเวลาไหน (ดู `i18n-and-locale`)
- **บันทึกว่ารันรอบไหนสำเร็จแล้ว** ไม่ใช่ดูจาก log

---

## 6 · งานยาวที่ผู้ใช้รออยู่

| ต้องมี | รายละเอียด |
|---|---|
| id ของงาน | คืนให้ทันทีที่รับงาน ผู้ใช้เอาไว้ถามความคืบหน้า |
| สถานะ | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| ความคืบหน้า | "ทำแล้ว 340 จาก 1,200 รายการ" ไม่ใช่หมุนเปล่า ๆ |
| ยกเลิกได้ | งานต้องเช็คสัญญาณยกเลิกเป็นระยะ |
| ผลลัพธ์ | เก็บไว้ให้ดาวน์โหลดได้ พร้อมวันหมดอายุ |
| แจ้งเมื่อเสร็จ | อีเมลหรือแจ้งเตือนในระบบ (ดู `notifications`) |

**แบ่งงานใหญ่เป็นชิ้นเล็ก** เช่น นำเข้า 50,000 แถว ให้แบ่งเป็นงานย่อยละ 500 แถว
เพราะงานเดียวที่ใช้เวลา 40 นาที ถ้าล้มที่นาทีที่ 39 ต้องเริ่มใหม่ทั้งหมด

---

## 7 · วัดอะไร

| ตัวชี้วัด | เตือนเมื่อ |
|---|---|
| จำนวนงานค้างในคิว | โตขึ้นเรื่อย ๆ ไม่ลดลง |
| เวลารอในคิว (p95 · 95% ของงานรอไม่เกินค่านี้) | เกินที่สัญญาไว้ |
| อัตราความล้มเหลว | เกินเกณฑ์ |
| **จำนวนใน dead letter** | **เพิ่มขึ้นแม้แค่ตัวเดียว** |
| รอบของงานตามเวลาที่ไม่ได้รัน | ข้ามรอบ |
| งานที่ค้างอยู่ในสถานะ running นานผิดปกติ | เกิน N เท่าของค่าปกติ |

> **คิวที่ตันจะเงียบสนิท** API ยังตอบ 200 ทุกคำขอ health check เขียวหมด
> แต่ไม่มีอีเมลออกไป 3 ชั่วโมงแล้ว ต้องวัดถึงจะเห็น

---

## 8 · Anti-patterns

- ❌ **งานที่รันซ้ำแล้วเกิดผลซ้ำ** — คิวจะรันซ้ำแน่นอน ไม่ใช่อาจจะ
- ❌ **retry ไม่จำกัด** — งานเดียวที่พังทำให้ทั้งคิวตัน
- ❌ **ไม่มี dead letter** — งานหายเงียบ ๆ ไม่มีใครรู้
- ❌ **มี dead letter แต่ไม่มีใครดู** — เท่ากับไม่มี
- ❌ **งานตามเวลาบนหลาย instance โดยไม่มีล็อก** — รันซ้อนกัน
- ❌ **ส่งข้อมูลทั้งก้อนใน payload** — ควรส่ง id แล้วให้งานไปอ่านเอง จะได้ข้อมูลล่าสุดด้วย
- ❌ **งานยาวที่ยกเลิกไม่ได้** — ผู้ใช้กดผิดแล้วต้องรอ 40 นาที
- ❌ **หน้าจอที่หมุนเปล่าโดยไม่บอกความคืบหน้า** — ผู้ใช้จะกดซ้ำ แล้วได้งานซ้ำ
- ❌ **ไม่วัดคิว** — ตันแล้วรู้ตอนลูกค้าโทรมา


---

# skill: audit-trail

Use when a system must show who did what and when (approvals, money, permissions, personal data).

# ร่องรอยการใช้งาน (audit trail)

> **กฎข้อเดียว:** ร่องรอยย้อนหลังสร้างไม่ได้
> วันที่ลูกค้าถามว่า "ใครเปลี่ยนราคาอันนี้" ถ้าไม่ได้เก็บไว้ก่อน ก็ตอบไม่ได้ตลอดไป

## เมื่อไหร่ใช้ skill นี้

- ระบบมีงานอนุมัติ การเงิน สิทธิ์ผู้ใช้ หรือข้อมูลส่วนบุคคล
- ลูกค้าหรือผู้ตรวจสอบถามได้ว่า "ใครทำ เมื่อไหร่ เปลี่ยนจากอะไรเป็นอะไร"
- มีข้อพิพาทเรื่องข้อมูลที่ถูกแก้ แล้วไม่มีใครตอบได้
- ระบบอยู่ภายใต้ PDPA หรือมาตรฐานที่ต้องตรวจย้อนหลังได้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| log สำหรับไล่ปัญหาทางเทคนิค | `logging-standards` | แทน |
| ตัวชี้วัดและการแจ้งเตือน | `observability-basics` | แทน |
| คอลัมน์ `created_by` `updated_at` ในตารางงาน | `database-design` | แทน |
| สิทธิ์และการยืนยันตัวตน | `auth-implementation-patterns` | แทน |
| ความยินยอมและสิทธิเจ้าของข้อมูล | `pdpa-compliance` | แทน |
| ข้อกำหนดว่าต้องเก็บอะไรกี่ปี | `srs-writing` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| มีไว้ให้ใครอ่าน | developer ตอนไล่ปัญหา | ผู้ตรวจสอบ · ลูกค้า · ฝ่ายกฎหมาย |
| เขียนอะไร | อะไรก็ได้ที่ช่วยไล่ปัญหา | **เฉพาะเหตุการณ์ที่มีความหมายทางธุรกิจ** |
| เก็บที่ไหน | ไฟล์ · ระบบรวบรวม log | **ตารางในฐานข้อมูล** หรือที่เก็บที่เขียนทับไม่ได้ |
| อายุ | 7–90 วัน | **เป็นปี ตามที่กฎหมายหรือสัญญากำหนด** |
| แก้ได้ไหม | ไม่สำคัญ | **ห้ามแก้ ห้ามลบ** |
| หายได้ไหม | หายบ้างรับได้ | **หายไม่ได้** ถ้าเขียนไม่สำเร็จ ธุรกรรมต้องล้มตาม |

> 🚨 **2 อย่างนี้แยกกันเสมอ** เพราะ audit log ที่ปนอยู่ในไฟล์ log ทั่วไป
> จะถูกลบตามอายุการเก็บ (retention) ของ log ภายในเดือนเดียว และไม่มีใครค้นเจอตอนที่ต้องใช้

---

## 2 · ฟิลด์ที่ทุกรายการต้องมี

| ฟิลด์ | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| `id` | UUIDv7 | เรียงตามเวลาได้ |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC** และเป็นเวลาที่เกิด ไม่ใช่เวลาที่บันทึก |
| `actor_id` | `1042` | id ผู้ใช้ ไม่ใช่ชื่อ เพราะชื่อเปลี่ยนได้ |
| `actor_type` | `user` · `system` · `api_client` | งานอัตโนมัติก็ต้องมีตัวตน |
| `actor_ip` · `user_agent` | | เก็บเมื่อจำเป็นต่อการตรวจสอบเท่านั้น |
| `action` | `order.cancelled` | **คำกริยารูปอดีต** แบบเดียวกันทั้งระบบ |
| `entity_type` · `entity_id` | `order` · `1042` | ของที่ถูกกระทำ |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | เฉพาะฟิลด์ที่เปลี่ยน |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" | บังคับกับการกระทำที่ต้องมีเหตุผล |
| `correlation_id` | `01J9Z8…` | เชื่อมกลับไปที่ application log |
| `result` | `success` · `denied` | **ต้องบันทึกครั้งที่ถูกปฏิเสธด้วย** |

> **การกระทำที่ถูกปฏิเสธมีค่ามากกว่าที่สำเร็จ** เพราะคนที่พยายามเข้าถึงสิ่งที่ไม่มีสิทธิ์
> คือสิ่งที่ผู้ตรวจสอบอยากเห็นที่สุด และเป็นสัญญาณเตือนที่ดีที่สุดที่มี

---

## 3 · เก็บเหตุการณ์ไหน

**เก็บ:**

| กลุ่ม | ตัวอย่าง |
|---|---|
| เงินและสัญญา | สร้าง/ยกเลิก/คืนเงิน · เปลี่ยนราคา · เปลี่ยนส่วนลด |
| การอนุมัติ | อนุมัติ · ปฏิเสธ · ส่งกลับแก้ |
| สิทธิ์และตัวตน | ให้/เพิกถอนสิทธิ์ · สร้าง/ปิดบัญชี · เปลี่ยนรหัสผ่าน · เข้าสู่ระบบล้มเหลวติดกัน |
| ข้อมูลส่วนบุคคล | ดู · แก้ · ส่งออก · ลบ |
| ค่าตั้งของระบบ | เปลี่ยนค่าที่กระทบทั้งระบบ |
| การเข้าถึงข้อมูลจำนวนมาก | ส่งออกรายงาน · ดาวน์โหลดรายชื่อ |

**ไม่เก็บ:** เปิดดูหน้าจอทั่วไป · ค้นหา · เรียงลำดับ · กดปุ่มที่ไม่เปลี่ยนอะไร
audit log ที่เก็บทุกอย่าง มีค่าเท่ากับไม่มีเลย เพราะค้นไม่เจอ

**ตั้งชื่อ action แบบเดียวทั้งระบบ:** `<entity>.<กริยาอดีต>` เช่น `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · เก็บ "เปลี่ยนอะไร" ยังไง

| วิธี | ดี | เสีย |
|---|---|---|
| **เก็บเฉพาะฟิลด์ที่เปลี่ยน (from/to)** ✅ | เล็ก อ่านรู้เรื่องทันที | อยากเห็นภาพรวมต้องไล่ย้อน |
| เก็บทั้งแถวก่อนและหลัง | ได้ภาพเต็ม | โตเร็วมาก และเสี่ยงเก็บข้อมูลอ่อนไหวเกินจำเป็น |
| เก็บเฉพาะว่า "แก้แล้ว" | เล็กสุด | **ตอบคำถามไม่ได้** ไม่ควรใช้ |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**ฟิลด์อ่อนไหวเก็บแค่ว่าเปลี่ยน ไม่เก็บค่า:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · เขียนแล้วห้ามแก้

- ตาราง audit ให้สิทธิ์แค่ **INSERT และ SELECT** · บัญชีที่แอปใช้ต้องไม่มีสิทธิ์ UPDATE หรือ DELETE
- เขียนใน transaction เดียวกับการเปลี่ยนข้อมูลจริง **ถ้าเขียน audit ไม่สำเร็จ ธุรกรรมต้องล้มตาม**
- ห้ามแก้ประวัติเพื่อ "จัดระเบียบ" ถ้าบันทึกผิด ให้เพิ่มรายการแก้ไข ไม่เขียนทับ
- ระบบที่ต้องเข้มกว่านั้นให้ทำ hash ต่อกันเป็นสาย เพื่อพิสูจน์ว่าไม่มีใครแทรกหรือลบ

**อายุการเก็บ** ตั้งตามกฎหมายหรือสัญญา เอกสารทางบัญชีในไทยมักต้องเก็บ 5 ปี
เมื่อครบอายุให้ย้ายไปที่เก็บราคาถูก ไม่ลบทิ้งโดยไม่มีใครอนุมัติ

---

## 6 · ใครดูได้ และห้ามเก็บอะไร

| เรื่อง | กฎ |
|---|---|
| สิทธิ์อ่าน | เฉพาะบทบาทที่มีหน้าที่ตรวจสอบ และ**การอ่าน audit log ก็ต้องบันทึกลง audit ด้วย** |
| การส่งออก | บันทึกทุกครั้งว่าใครส่งออกช่วงไหน |
| **ห้ามเก็บ** | รหัสผ่าน · token · เลขบัตร · ข้อมูลสุขภาพ · เนื้อหาของข้อมูลส่วนบุคคล |
| เก็บได้แทน | ชี้ว่า**ของชิ้นไหน**ถูกดูหรือถูกแก้ ไม่ใช่เนื้อหาข้างใน |

> `patient_record.viewed` กับ `entity_id` ก็พอแล้ว **ห้ามคัดลอกผลตรวจลงไปใน audit log**
> ไม่งั้น audit log จะกลายเป็นที่รวมข้อมูลอ่อนไหวที่สุดในระบบ โดยไม่มีใครตั้งใจ

---

## 7 · แสดงให้คนอ่าน

หน้าจอประวัติต้องกรองได้อย่างน้อย 4 อย่าง: **ช่วงเวลา · ผู้ทำ · ประเภทการกระทำ · ของชิ้นไหน**

แสดงเป็นประโยคที่คนอ่านรู้เรื่อง ไม่ใช่ JSON ดิบ:

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

แสดงเวลาตามเขตเวลาของผู้ดู แต่เก็บเป็น UTC (ดู `i18n-and-locale`)

---

## 8 · Anti-patterns

- ❌ **เก็บ audit ในไฟล์ log ทั่วไป** — ถูกลบตาม retention ภายในเดือนเดียว
- ❌ **เก็บชื่อผู้ทำแทน id** — พอเขาเปลี่ยนนามสกุล ประวัติเก่าก็กลายเป็นคนละคน
- ❌ **บันทึกเฉพาะที่สำเร็จ** — ครั้งที่ถูกปฏิเสธคือสิ่งที่ผู้ตรวจสอบตามหา
- ❌ **บันทึกแค่ "แก้ไขข้อมูล"** โดยไม่บอกว่าจากอะไรเป็นอะไร
- ❌ **แอปมีสิทธิ์ UPDATE ตาราง audit** — ร่องรอยที่แก้ได้ ไม่ใช่ร่องรอย
- ❌ **เขียน audit นอก transaction** — ธุรกรรมสำเร็จแต่ไม่มีบันทึก
- ❌ **บันทึกทุกการคลิก** — ของสำคัญจมอยู่ในกองข้อมูลที่ไม่มีใครใช้
- ❌ **คัดลอกข้อมูลอ่อนไหวลง audit** — เกิดช่องรั่วใหม่โดยไม่ตั้งใจ
- ❌ **ไม่มีหน้าจอให้ดู** — มีข้อมูลแต่ต้องให้ developer query ทุกครั้งที่ลูกค้าถาม
