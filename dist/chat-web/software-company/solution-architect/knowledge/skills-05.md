# skill: web-service-essentials

Use when building or reviewing any HTTP service or backend. Four operational endpoints, RFC 9457 errors, request ids, graceful shutdown, security headers.

# Web Service Essentials

> **กฎข้อเดียว:** ก่อนเขียน endpoint ธุรกิจตัวแรก service ต้องตอบได้ว่า
> "ยังอยู่ไหม · พร้อมรับงานไหม · ตอนนี้รันเวอร์ชันอะไร" ถ้าตอบไม่ได้ วันที่ระบบล่มคุณจะต้องเดาล้วน ๆ

## เมื่อไหร่ใช้ skill นี้

- เริ่ม service / REST API / microservice ใหม่
- มีคนขอ health check, ping, readiness, liveness, version endpoint
- จะ deploy ขึ้น production ครั้งแรก หรือย้ายเข้า Docker/Kubernetes
- ต้องกำหนดรูปแบบ error ของ API ให้เหมือนกันทั้งระบบ

## เมื่อไหร่ **ไม่** ใช้

- ออกแบบ endpoint ทางธุรกิจ ให้ใช้ command `/api-design`
- รูปแบบ log ให้ใช้ `logging-standards`
- เลือกสถาปัตยกรรม ให้ใช้ `architecture-patterns`

---

## 1 · endpoint พื้นฐาน 4 ตัว

| Endpoint | ตอบอะไร | auth | เช็ค dependency | ใครเรียก |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | ไม่ | ไม่ | load balancer ทุกวินาที |
| `GET /health/live` | process ยังอยู่ | ไม่ | **ไม่** | orchestrator (restart ถ้าตาย) |
| `GET /health/ready` | พร้อมรับ traffic | ไม่ | ใช่ | orchestrator (ตัดออกจาก pool) |
| `GET /version` | รันอะไรอยู่ | ไม่* | ไม่ | คน ตอนไล่ปัญหา |

> 🚨 **live ห้ามเช็ค dependency** นี่คือความผิดพลาดที่เจอบ่อยที่สุด
> ถ้า `/health/live` เช็ค DB แล้ว DB ล่มชั่วคราว Kubernetes จะ**ฆ่า pod ทิ้งทั้งหมด**
> ทั้งที่แอปยังปกติดี พอ DB กลับมาก็ไม่มี pod เหลือรับ traffic แล้ว
> การเช็ค dependency ต้องอยู่ที่ `/health/ready` ซึ่งแค่ตัด pod ออกจาก pool ชั่วคราว

\* ถ้าไม่อยากให้คนทั่วไปเห็น commit hash ใน `/version` ให้จำกัดให้เรียกได้เฉพาะเครือข่ายภายใน

### รูปร่าง response (เหมือนกันทุกภาษา)

```jsonc
// GET /health/ready → 200 ปกติ · 503 เมื่อ dependency ที่ critical ล่ม
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 สถานะ ไม่ใช่ 2:**
- `up` — ทุกอย่างปกติ → 200
- `degraded` — dependency ที่**ไม่ critical** ล่ม (เช่น อีเมล) แต่ยังรับ traffic ได้ → 200
- `down` — dependency ที่ critical ล่ม (เช่น DB) → **503**

**ทุก check ต้องมี timeout** (ค่าเริ่มต้น 3 วินาที) ไม่งั้น dependency ที่ค้าง
จะทำให้ health endpoint ค้างตาม แล้ว orchestrator ตัดสินใจผิดทั้งระบบ

**ห้ามส่ง stack trace หรือ connection string ออกทาง endpoint นี้** เพราะ endpoint นี้ใครก็เรียกได้

---

## 2 · รูปแบบ error ที่เหมือนกันทั้งระบบ

ยึด **RFC 9457 (`application/problem+json`)** ซึ่งเป็นมาตรฐานจริง ไม่ต้องคิดเอง

```jsonc
// 400
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 400,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // ตรงกับ cid ใน log — ตามเรื่องได้ทันที
  "errors": { "quantity": ["ต้องมากกว่า 0"] }   // เฉพาะ validation
}
```

| สถานะ | ใช้เมื่อ |
|---|---|
| 400 | ข้อมูลผิดรูป |
| 401 | ยังไม่ได้ยืนยันตัวตน |
| 403 | ยืนยันแล้วแต่ไม่มีสิทธิ์ |
| 404 | ไม่มีสิ่งนี้ |
| 409 | ชนกับสถานะปัจจุบัน (ซ้ำ, แก้ทับ) |
| 422 | รูปแบบถูกแต่ผิดกฎธุรกิจ |
| 429 | เรียกถี่เกิน — ต้องมี `Retry-After` |
| 500 | ฝั่งเราพัง — **ห้ามส่งรายละเอียดภายในออกไป** ส่ง `requestId` แทน |

> **500 ต้องบอกแค่ "เกิดข้อผิดพลาด กรุณาแจ้ง requestId นี้"** รายละเอียดจริงอยู่ใน log
> การส่ง stack trace ออกไปก็เหมือนแจกแผนผังระบบให้คนที่กำลังหาช่องโจมตี

---

## 3 · Request id

- รับจาก header **`X-Request-Id`** ถ้าไม่มีให้สร้างเอง (uuid ตัด 8 ตัว)
- **ส่งกลับใน response header ทุกครั้ง** รวมทั้งตอน error
- ใส่ในทุกบรรทัด log (ดู `logging-standards`) และใน error body
- ส่งต่อไป service ปลายทางทุกครั้งที่เรียกข้ามระบบ

พอลูกค้าโทรมาบอกว่า "มันพัง" ก็ขอ requestId แล้ว `grep` ครั้งเดียวเจอทั้งเรื่อง

---

## 4 · Graceful shutdown

ตอน deploy ใหม่ orchestrator จะส่ง `SIGTERM` มา ถ้าแอปตายทันที request ที่ทำอยู่จะขาดกลางคัน

```
SIGTERM → 1. หยุดรับ request ใหม่ (ให้ /health/ready ตอบ down ทันที)
          2. รอ request ที่ค้างอยู่ทำงานจบ (timeout 15–30 วิ)
          3. ปิด DB pool / คิว / ไฟล์
          4. exit(0)
```

> ข้อ 1 สำคัญกว่าที่คิด ต้องให้ `/health/ready` ตอบ `down` **ก่อน** ปิดจริงสัก 5 วินาที
> เพื่อให้ load balancer ตัดเราออกจาก pool ทัน ไม่งั้นยังมี traffic วิ่งเข้ามาตอนกำลังปิด

---

## 5 · สิ่งที่ต้องมีก่อน deploy (ไม่ใช่ทางเลือก)

- **Timeout ทุกทาง** ทั้ง request เข้า การเรียกออก และ query DB ถ้าไม่มี timeout ปลายทางช้าเมื่อไร ทั้งระบบจะค้างตาม
- **จำกัดขนาด body** (เช่น 1MB) เพื่อกัน memory ระเบิดจาก payload ใหญ่
- **CORS ระบุ origin ชัดเจน** — `*` ใช้ได้เฉพาะ API สาธารณะที่ไม่มี cookie
- **Rate limit** อย่างน้อยที่ endpoint ล็อกอินและที่ที่ส่ง OTP/อีเมล
- **Security headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Strict-Transport-Security` (helmet / `UseHsts()` ทำให้ครบในบรรทัดเดียว)
- **ปิดหน้าโชว์ error เต็ม ๆ ใน production** (`app.UseDeveloperExceptionPage()` เฉพาะ dev)
- **ตั้งเวอร์ชันไว้ใน path**: `/api/v1/...` ตั้งแต่วันแรก เพราะย้ายทีหลังแพงกว่ามาก
- **OpenAPI** ที่ generate จากโค้ดจริง ไม่ใช่เขียนมือแล้วลืมอัปเดต

---

## 6 · โค้ดที่พร้อมใช้

| ไฟล์ | สแต็ก | สถานะ |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✅ รันทดสอบครบทั้ง 4 endpoint + เคส degraded/down/timeout |
| `assets/health_py.py` | Python / FastAPI | ✅ รันทดสอบครบเหมือนกัน ผลตรงกันทุก field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | ⚠️ ยังไม่ได้คอมไพล์ทดสอบ |

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```

---

## 7 · ตรวจงาน

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# ปิด DB แล้วยิงซ้ำ — ready ต้องเป็น 503 แต่ live ต้องยัง 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` **ไม่** แตะ DB — ปิด DB แล้วยังตอบ 200
- [ ] `/health/ready` ตอบ 503 เมื่อ dependency ที่ critical ล่ม
- [ ] dependency ที่ไม่ critical ล่มแล้วได้ `degraded` + 200 (ยังรับ traffic)
- [ ] ทุก check มี timeout — ลองทำให้ dependency ค้าง แล้ว endpoint ต้องตอบภายใน ~3 วิ
- [ ] `/version` ตรงกับ commit ที่ deploy จริง
- [ ] ทุก response มี `X-Request-Id` รวมทั้งตอน 500
- [ ] ยิง 500 แล้วไม่มี stack trace / connection string หลุดออกมา
- [ ] `SIGTERM` แล้ว request ที่ค้างอยู่ทำงานจบก่อนแอปปิด
- [ ] `/ping` ไม่ถูกเขียนลง log (ไม่งั้นไฟล์เต็มไปด้วย ping)

---

## 8 · Anti-patterns

- ❌ **`/health` ตัวเดียวเช็คทุกอย่าง** — orchestrator แยกไม่ออกว่าควร restart หรือแค่ตัด traffic
- ❌ **liveness เช็ค DB** — DB สะดุด 10 วินาที = pod ตายยกแถว
- ❌ **health check ไม่มี timeout** — dependency ค้าง แล้ว health ค้างตาม
- ❌ **ส่ง stack trace / connection string ใน health หรือ error 500**
- ❌ **health ต้อง login** — orchestrator ไม่มี token ให้
- ❌ **รูปแบบ error ต่างกันทุก endpoint** — client ต้องเขียนโค้ดแกะ 5 แบบ
- ❌ **`/ping` เขียนลง log** — ทุกวินาที × 86400 = ขยะเต็มไฟล์
- ❌ **ไม่มี graceful shutdown** — deploy ทีไรลูกค้าเจอ error ทุกที
- ❌ **`Access-Control-Allow-Origin: *` คู่กับ cookie** — เปิดช่องให้เว็บอื่นยิงแทนผู้ใช้

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| test ให้ endpoint พวกนี้ | `testing-standards` |
| ออกแบบ endpoint ธุรกิจ | command `/api-design` |
| runbook ตอน service ล่ม | `incident-runbook-template` |
| ตรวจความปลอดภัย | `security-engineer` + command `/security-scan` |


## reference: per-stack.md

# .NET และ Angular

> ⚠️ โค้ดในไฟล์นี้ **ยังไม่ได้คอมไพล์ทดสอบ** (ต่างจาก `assets/health.node.js` และ
> `assets/health_py.py` ที่รันจริงครบทุก endpoint แล้ว) โค้ดนี้เป็นการตั้งค่ามาตรฐานของ
> ASP.NET Core ตอนรันครั้งแรกให้เทียบ response กับรูปร่างใน SKILL.md ข้อ 1

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

ให้ response ตรงรูปแบบเดียวกับสแต็กอื่น:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core มี `ProblemDetails` มาให้อยู่แล้ว ให้ใช้ของที่มี อย่าประดิษฐ์รูปแบบเอง

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

```csharp
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));

// ให้ /health/ready ตอบ down ก่อนปิดจริงสักพัก
// เพื่อให้ load balancer ตัดเราออกจาก pool ทันก่อนที่ request จะยังวิ่งเข้ามา
app.Lifetime.ApplicationStopping.Register(() =>
{
    ReadinessState.IsShuttingDown = true;
    Thread.Sleep(TimeSpan.FromSeconds(5));
});
```

### สิ่งที่ต้องเปิดก่อน deploy

```csharp
app.UseHsts();
app.UseHttpsRedirection();
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(...);          // อย่างน้อยที่ /login และที่ส่ง OTP
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
```

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**แกะ problem+json ให้เป็นข้อความที่ผู้ใช้อ่านรู้เรื่อง**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**หน้าสถานะระบบ** ให้ทีมซัพพอร์ตเปิดดูเองได้โดยไม่ต้องเรียกนักพัฒนา:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `ApplicationStopping` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` | `helmet` | `secure` middleware |
| OpenAPI | Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |


---

# skill: spell-out-abbreviations

Use when writing anything for a person (docs, comments, commits, replies, UI text, labels). Spell out each abbreviation on first use, gloss jargon.

# Spell Out Abbreviations

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อ 1:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎข้อ 2:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายจะได้ไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็มแล้ววงเล็บตัวย่อ ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่มีที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) ถ้าไม่แน่ใจ **ให้ขยาย** เพราะขยายเกินไม่เสียหาย แต่คนอ่านไม่รู้เรื่องเสียหาย

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ขยายตัวย่อแล้วอาจยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่า 1 บรรทัด** ถ้ายาวกว่านั้นให้แยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม ถ้าเดาไม่ได้ก็ต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมพัฒนาแต่คนละส่วน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · คอมเมนต์ในโค้ด · ข้อความ commit · ข้อความบนหน้าจอ · คำอธิบายไดอะแกรม ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## Anti-patterns

- ❌ ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- ❌ วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ❌ ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ❌ ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่ามันวัดอะไร
- ❌ อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค


---

# skill: answer-shape

Use when an answer has structure (options, trade-offs, how parts connect, several numbers). Chooses prose, table, small diagram or short list.

# รูปทรงของคำตอบ

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

ไฟล์นี้เหมือนกันทุก plugin ใน SQT-Marketplace ต้นฉบับอยู่ที่ plugin `superuser` ถ้าจะแก้ให้แก้ที่นั่นแล้วรัน `node scripts/sync/sync-superuser.mjs`

> **กฎข้อเดียว:** เนื้อหามีโครงสร้างอะไร คำตอบใช้รูปทรงนั้น
> เปรียบเทียบ → ตาราง · เชื่อมโยง → รูป · เรื่องเดียว → ประโยค

---

## เลือกรูปทรงจากสัญญาณในคำถาม

| สัญญาณ | รูปทรง |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" | **ตารางเปรียบเทียบ** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" | **รูป** |
| "มีอะไรบ้าง" ที่ไม่ได้เทียบกัน | **รายการหัวข้อย่อย** |
| "ทำไม" · "แปลว่าอะไร" · เรื่องเดียวไม่มีแขนง | **ประโยคธรรมดา** |
| ตัวเลขหลายตัวที่ต้องดูพร้อมกัน | **ตาราง** |
| ขั้นตอนที่ต้องทำเรียงกัน | **รายการมีเลข** |

**สัญญาณสำคัญที่สุดคือมี "สิ่งที่ถูกเทียบ" ตั้งแต่ 2 ตัวขึ้นไป** แบบนี้ให้ใช้ตาราง
เพราะถ้าเขียนเป็นย่อหน้า ผู้อ่านต้องจำตัวแรกไว้ในหัวระหว่างอ่านตัวที่ 2

---

## ตารางที่อ่านง่าย

- **คอลัมน์แรกคือสิ่งที่ถูกเทียบ** คอลัมน์ถัดไปคือแง่มุมที่เทียบ
- **3–5 คอลัมน์** เกินนี้อ่านไม่ทัน ส่วนแถวไม่เกิน 8 แถวในคำตอบแชต
- **ทุกช่องต้องมีเนื้อ** — ช่องว่างแปลว่าคอลัมน์นั้นไม่ควรมี หรือข้อมูลยังไม่ครบ ถ้าไม่มีข้อมูลให้เขียนว่า "ไม่มี" ตรง ๆ
- **ช่องละไม่เกิน 1 บรรทัด** ถ้ายาวกว่านั้นให้ยกไปเขียนใต้ตาราง
- **เรียงแถวตามน้ำหนัก** ตัวที่แนะนำหรือตัวที่ใช้บ่อยที่สุดอยู่บนสุด ไม่ใช่เรียงตามตัวอักษร
- **หัวคอลัมน์เป็นคำถามที่ผู้อ่านมีในหัว** ไม่ใช่ชื่อสาขาวิชา

```
❌ | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
✅ | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

**ปิดท้ายตารางด้วยข้อสรุป 1 บรรทัดเสมอ** — ตารางบอกข้อมูล ไม่ได้บอกว่าควรเลือกอะไร

---

## เมื่อไหร่รูปชนะตาราง

ใช้รูปเมื่อ**ความสัมพันธ์คือคำตอบ** — ตารางบอกคุณสมบัติได้ แต่บอกไม่ได้ว่าอะไรต่อกับอะไร

| ใช้รูป | ใช้ตาราง |
|---|---|
| อะไรต่อกับอะไร · อะไรอยู่ในอะไร | ตัวไหนดีกว่าตัวไหนในแง่ใด |
| ลำดับที่มีทางแยกหรือวนกลับ | ขั้นตอนเรียงตรงไม่มีแขนง (ใช้รายการมีเลขพอ) |
| สิ่งเดียวกันในหลายสถานะ | สิ่งต่างกันในแง่มุมเดียวกัน |

ในแชต **รูปเล็ก ๆ แบบ ASCII หรือ Mermaid สั้น ๆ ก็พอ** — ไม่ต้องเปิดเครื่องมือวาด

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

รูปที่ต้องเป็นไฟล์จริงเพื่อใส่เอกสารหรือสไลด์ ให้ใช้ skill วาดรูปของ plugin นั้น (ถ้ามี)

---

## เมื่อไหร่ประโยคชนะทั้งคู่

- คำตอบสั้นกว่า 3 บรรทัด — ตาราง 2 แถวเป็นแค่การตกแต่ง ไม่ได้อธิบายอะไร
- คำถามที่ตอบว่า "ใช่" หรือ "ไม่ใช่" แล้วตามด้วยเหตุผล 1 ประโยค
- เรื่องที่**เหตุผลสำคัญกว่าตัวเลือก** — ตารางจะตัดเหตุผลทิ้งเพื่อให้พอดีช่อง

> ตารางที่มีแถวเดียวหรือ 2 แถวสั้น ๆ แปลว่าใช้ผิดรูปทรง

---

## Anti-patterns

- ❌ **ย่อหน้ายาวเปรียบเทียบ 3 ตัวเลือก** — ผู้อ่านต้องจำตัวแรกไว้จนจบ
- ❌ **ตารางที่มีช่องว่าง** หรือช่องที่เขียนว่า "ขึ้นอยู่กับ" ทุกช่อง
- ❌ **ตาราง 2 แถวเพื่อให้ดูเป็นระเบียบ**
- ❌ **รูปที่วาดสิ่งที่ประโยคเดียวบอกได้**
- ❌ **ตารางที่ไม่มีข้อสรุป** — ทิ้งให้ผู้อ่านตัดสินใจเอง ทั้งที่เขาถามเพราะอยากได้คำแนะนำ
- ❌ **เรียงแถวตามตัวอักษร** ทั้งที่มีตัวที่แนะนำชัดเจน
- ❌ **หัวคอลัมน์เป็นศัพท์วิชาการ** ทั้งที่เขียนเป็นคำถามธรรมดาได้

---

## เชื่อมกับ skill อื่น

- ถ้อยคำ ความยาว และการตัดกลิ่น AI ใช้ `human-writing`
- รูปที่ต้องเป็นไฟล์จริง หรือการเปิดเรื่องที่ต้องให้ผู้ใช้ตัดสินใจ ให้ใช้ skill เฉพาะของ plugin นั้นถ้ามี

---

## ตัวย่อ

- **ASCII** — American Standard Code for Information Interchange (การวาดรูปด้วยตัวอักษรธรรมดา)
- **Mermaid** — ภาษาเขียนไดอะแกรมเป็นข้อความ แล้วให้โปรแกรมวาดให้


---

# skill: temp-file-discipline

Use when a task writes files into a project folder. Sends temporary files (archives, extracts, previews, backups, one-off scripts) to _to_delete/.

# ระเบียบไฟล์ชั่วคราว

> **กฎข้อเดียว:** อะไรที่ไม่ใช่ผลงานจริง ต้องอยู่ใน `_to_delete/` เท่านั้น
> ห้ามวางไว้ที่รากโปรเจกต์ ห้ามวางปนกับไฟล์งาน

---

## เลือกที่วาง

| ไฟล์นั้นคืออะไร | วางที่ |
|---|---|
| ของชั่วคราวของงานในโปรเจกต์ผู้ใช้ (ภาพตรวจ · log · สคริปต์ครั้งเดียว · ผลรัน) | `_to_delete/` ที่รากโปรเจกต์ ผู้ใช้จะได้ตรวจย้อนได้ |
| ขั้นกลางที่ไม่ผูกกับโปรเจกต์ใด (ไม่ได้ทำงานในโฟลเดอร์ผู้ใช้) | พื้นที่ทำงานของเซสชัน |
| ผลงานที่ผู้ใช้จะเก็บไว้ | โฟลเดอร์ปลายทางของงานนั้น |

**รากโปรเจกต์ต้องไม่มีไฟล์ชั่วคราวเลย**
- ถ้า agent สร้างไฟล์ชั่วคราวแล้วไปตกที่ราก (log · ภาพ · สคริปต์ลอง) ให้ย้ายเข้า `_to_delete/` ทันที
- ถ้าไม่แน่ใจว่าผู้ใช้สร้างหรือใช้ไฟล์นั้นอยู่ ไม่ต้องย้ายเอง ให้บอกผู้ใช้
- คำสั่งที่รันจากในโฟลเดอร์โค้ด (`<project-name>/` ดู `project-bootstrap`) ให้เขียนของชั่วคราวไปที่ `_to_delete/` ของ**รากโปรเจกต์** ไม่สร้าง `_to_delete/` ซ้อนในโฟลเดอร์โค้ด

---

## อะไรคือไฟล์ชั่วคราว

- ไฟล์บีบอัดที่ส่งผ่านแชทเพื่อเอาไฟล์ลงเครื่อง และโฟลเดอร์ที่แตกออกมา
- ภาพที่เรนเดอร์ไว้ตรวจงาน · ภาพหน้าจอ · ไฟล์ตัวอย่างที่ทำไว้เทียบ
- สำเนาสำรองของไฟล์ที่กำลังแก้ · ไฟล์ `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx`
- สคริปต์ที่เขียนขึ้นใช้ครั้งเดียว · ไฟล์ log จากการรันครั้งเดียว
- ไฟล์รูปแบบกลางระหว่างแปลง เช่น `.svg` ที่แปลงต่อเป็น `.png` แล้ว
- **เอกสารที่แปลงรูปแบบมาเพื่อให้อ่านหรือประมวลผลง่าย** — `.docx` หรือ `.pdf` ที่แปลงเป็น `.md`
  ต้นฉบับคือของจริง ส่วนตัวที่แปลงคือของชั่วคราว **ห้ามวางปนกันในโฟลเดอร์เอกสาร**
  ไม่งั้นอีก 3 เดือนไม่มีใครรู้ว่าไฟล์ไหนคือฉบับที่ลูกค้าเซ็นรับ
- เวอร์ชันเก่าของไฟล์ที่เพิ่งแทนที่ไป

**ไฟล์ที่เลิกใช้แล้วก็คือไฟล์ชั่วคราว** — เมื่อแทนที่ไฟล์เก่าด้วยของใหม่แล้ว ให้ย้ายตัวเก่าเข้า `_to_delete/`
ไม่ทิ้งไว้ข้าง ๆ กัน

---

## อะไรไม่ใช่

- ผลงานที่ผู้ใช้ขอ
- ไฟล์ต้นทางของผลงาน เช่น `.py` ที่ผลิตรูป หรือ `.html` ที่เป็นแหล่งที่มาของภาพ —
  **ปีหน้าจะแก้ก็ต้องมีไฟล์ต้นทาง** จึงเก็บไว้ในโฟลเดอร์ย่อยข้างผลงาน ไม่ใช่ `_to_delete/`
- ไฟล์ที่ผู้ใช้วางไว้เอง แม้จะดูเหมือนขยะ — **ห้ามย้ายของผู้ใช้โดยไม่ถาม**
- output ของเครื่องมือ build (`build/` · `.dart_tool/` · `node_modules/` · `bin/` `obj/`) — ปล่อยไว้ที่เครื่องมือวาง แค่ตรวจว่าอยู่ใน `.gitignore` และห้ามย้ายเข้า `_to_delete/`

---

## วิธีใช้

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── transfer.zip
    └── render-check/
```

- มีโฟลเดอร์เดียวที่**รากของโปรเจกต์** ไม่ต้องแยกย่อยตามวันที่ ยกเว้นของเยอะจริง
- โฟลเดอร์ย่อยมาตรฐานที่ skill อื่นใช้ — ใช้ชื่อเดียวกันนี้เท่านั้น:

  | โฟลเดอร์ย่อย | ใส่อะไร | skill ที่ใช้ |
  |---|---|---|
  | `verify-runs/` | ภาพหน้าจอและผลรันของแอปจริงตอนตรวจ (หลักฐาน verify) | `app-verifier-setup` · `spec-to-code-loop` |
  | `screenshots/` | ภาพเรนเดอร์ของดีไซน์หรือ mockup | `mobile-app-design` · `web-app-design` · `windows-app-design` |
  | `security/` | ผลสแกนดิบ | `security-gate` |
  | `logs/` | log จากการรันครั้งเดียว | ทุกตัว |
  | `check/` | ชื่อเดิมของ `spec-to-code-loop` สำหรับภาพตรวจ ส่วนงานใหม่ใช้ `verify-runs/` แทน | `spec-to-code-loop` |
- ใส่ `_to_delete/` ลงใน `.gitignore` ทุกโปรเจกต์ที่ใช้ git — ตรวจก่อน ถ้ายังไม่มีให้เพิ่ม
- โปรเจกต์ที่มีชื่อโฟลเดอร์ชั่วคราวอยู่แล้ว (`tmp/` `scratch/` `.cache/`) ให้ใช้ของเดิม อย่าสร้างซ้ำ

---

## ตอนจบงาน

1. **บอกว่ามีอะไรค้างอยู่ใน `_to_delete/`** เป็นบรรทัดเดียว ไม่ต้องลงรายการยาว
2. **ห้ามลบเอง** — ลบเมื่อผู้ใช้สั่งเท่านั้น การลบในโฟลเดอร์ผู้ใช้กู้คืนไม่ได้
3. ถ้าลบไม่ได้เพราะไม่มีสิทธิ์ ให้ย้ายเข้า `_to_delete/` แล้วบอกผู้ใช้ อย่าทิ้งไว้ที่เดิม

---

## Anti-patterns

- ❌ **แตกไฟล์ zip ลงรากโปรเจกต์** แล้วค่อยเก็บกวาดทีหลัง — ทีหลังไม่เคยมาถึง
- ❌ **ตั้งชื่อ `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`** วางไว้ข้างของเดิม
- ❌ **ลบไฟล์ผู้ใช้เพราะคิดว่าไม่ใช้แล้ว**
- ❌ **ทิ้งไฟล์ชั่วคราวของงานในโปรเจกต์ไว้ในพื้นที่เซสชัน** — เซสชันจบแล้วผู้ใช้ตรวจย้อนไม่ได้
- ❌ **ตั้งโฟลเดอร์ย่อยชื่อใหม่ให้ของเดิม** (`shots/` `img-check/`) — ใช้ชื่อในตารางข้างบน
- ❌ **เก็บไฟล์ต้นทางของผลงานไว้ใน `_to_delete/`** — นั่นไม่ใช่ของชั่วคราว
- ❌ **ทิ้งไฟล์ค้างโดยไม่บอก** — ผู้ใช้จะมาเจอเองอีกหลายเดือนถัดไป

---

## ตัวย่อ

- **zip** — ไฟล์บีบอัดรูปแบบ ZIP
- **git** — ระบบควบคุมเวอร์ชัน Git
