# skill: web-service-essentials

Use when building or reviewing any HTTP service, REST API or backend — the baseline every service needs before feature work starts. Defines the four operational endpoints with exact response shapes, an error envelope based on RFC 9457, request-id propagation, graceful shutdown, timeouts and the security headers that are not optional.

# Web Service Essentials

> **กฎข้อเดียว:** ก่อนเขียน endpoint ธุรกิจตัวแรก service ต้องตอบได้ว่า
> "ยังอยู่ไหม · พร้อมรับงานไหม · ตอนนี้รันเวอร์ชันอะไร" ถ้าตอบไม่ได้ วันที่ระบบล่มคุณจะเดาล้วน ๆ

## เมื่อไหร่ใช้ skill นี้

- เริ่ม service / REST API / microservice ใหม่
- มีคนขอ health check, ping, readiness, liveness, version endpoint
- จะ deploy ขึ้น production ครั้งแรก หรือย้ายเข้า Docker/Kubernetes
- ต้องกำหนดรูปแบบ error ของ API ให้เหมือนกันทั้งระบบ

## เมื่อไหร่ **ไม่** ใช้

- ออกแบบ endpoint ทางธุรกิจ → command `/api-design`
- รูปแบบ log → `logging-standards`
- เลือกสถาปัตยกรรม → `architecture-patterns`

---

## 1 · endpoint พื้นฐาน 4 ตัว

| Endpoint | ตอบอะไร | auth | เช็ค dependency | ใครเรียก |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | ไม่ | ไม่ | load balancer ทุกวินาที |
| `GET /health/live` | process ยังอยู่ | ไม่ | **ไม่** | orchestrator (restart ถ้าตาย) |
| `GET /health/ready` | พร้อมรับ traffic | ไม่ | ใช่ | orchestrator (ตัดออกจาก pool) |
| `GET /version` | รันอะไรอยู่ | ไม่* | ไม่ | คน ตอนไล่ปัญหา |

> 🚨 **live ห้ามเช็ค dependency** — นี่คือความผิดพลาดที่เจอบ่อยที่สุด
> ถ้า `/health/live` เช็ค DB แล้ว DB ล่มชั่วคราว Kubernetes จะ **ฆ่า pod ทิ้งทั้งหมด**
> ทั้งที่แอปยังปกติดี พอ DB กลับมา ก็ไม่มี pod เหลือให้รับ traffic แล้ว
> ของพวกนี้ต้องอยู่ที่ `/health/ready` ซึ่งแค่ตัดออกจาก pool ชั่วคราว

\* `/version` ถ้าไม่อยากเปิด commit hash สาธารณะ ให้จำกัดเฉพาะเครือข่ายภายใน

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

**สามสถานะ ไม่ใช่สอง:**
- `up` — ทุกอย่างปกติ → 200
- `degraded` — dependency ที่**ไม่ critical** ล่ม (เช่น อีเมล) ยังรับ traffic ได้ → 200
- `down` — dependency ที่ critical ล่ม (เช่น DB) → **503**

**ทุก check ต้องมี timeout** (ค่าเริ่มต้น 3 วินาที) ไม่งั้น dependency ที่ค้าง
จะทำให้ health endpoint ค้างตาม แล้ว orchestrator จะตัดสินใจผิดทั้งกระดาน

**ห้ามส่ง stack trace หรือ connection string ออกทาง endpoint นี้** — เปิดสาธารณะ

---

## 2 · รูปแบบ error ที่เหมือนกันทั้งระบบ

ยึด **RFC 9457 (`application/problem+json`)** — เป็นมาตรฐานจริง ไม่ต้องคิดเอง

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
> การส่ง stack trace ออกไปคือการแจกแผนผังระบบให้คนที่กำลังหาช่องโจมตี

---

## 3 · Request id

- รับจาก header **`X-Request-Id`** ไม่มีก็สร้าง (uuid ตัด 8 ตัว)
- **ส่งกลับใน response header ทุกครั้ง** รวมทั้งตอน error
- ใส่ในทุกบรรทัด log (ดู `logging-standards`) และใน error body
- ส่งต่อไป service ปลายทางทุกครั้งที่เรียกข้ามระบบ

ลูกค้าโทรมาบอก "มันพัง" → ขอ requestId → `grep` ครั้งเดียวเจอทั้งเรื่อง

---

## 4 · Graceful shutdown

ตอน deploy ใหม่ orchestrator ส่ง `SIGTERM` มา ถ้าแอปตายทันที request ที่ทำอยู่จะขาดกลางคัน

```
SIGTERM → 1. หยุดรับ request ใหม่ (ให้ /health/ready ตอบ down ทันที)
          2. รอ request ที่ค้างอยู่ทำงานจบ (timeout 15–30 วิ)
          3. ปิด DB pool / คิว / ไฟล์
          4. exit(0)
```

> ข้อ 1 สำคัญกว่าที่คิด — ต้องให้ `/health/ready` ตอบ `down` **ก่อน** ปิดจริงสัก 5 วินาที
> เพื่อให้ load balancer ตัดเราออกจาก pool ทัน ไม่งั้นยังมี traffic วิ่งเข้ามาตอนกำลังปิด

---

## 5 · สิ่งที่ต้องมีก่อน deploy (ไม่ใช่ทางเลือก)

- **Timeout ทุกทาง** — request เข้า, การเรียกออก, query DB · ไม่มี timeout = แขวนทั้งระบบเมื่อปลายทางช้า
- **จำกัดขนาด body** (เช่น 1MB) — กัน memory ระเบิดจาก payload ใหญ่
- **CORS ระบุ origin ชัดเจน** — `*` ใช้ได้เฉพาะ API สาธารณะที่ไม่มี cookie
- **Rate limit** อย่างน้อยที่ endpoint ล็อกอินและที่ที่ส่ง OTP/อีเมล
- **Security headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Strict-Transport-Security` (helmet / `UseHsts()` ทำให้ครบในบรรทัดเดียว)
- **ปิดหน้าโชว์ error เต็ม ๆ ใน production** (`app.UseDeveloperExceptionPage()` เฉพาะ dev)
- **ตั้งเวอร์ชันไว้ใน path**: `/api/v1/...` ตั้งแต่วันแรก ย้ายทีหลังแพงกว่ามาก
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
- [ ] dependency ที่ไม่ critical ล่ม → `degraded` + 200 (ยังรับ traffic)
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
> `assets/health_py.py` ที่รันจริงครบทุก endpoint แล้ว) เป็นการตั้งค่ามาตรฐานของ
> ASP.NET Core — ให้รันครั้งแรกแล้วเทียบ response กับรูปร่างใน SKILL.md ข้อ 1

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

ASP.NET Core มี `ProblemDetails` มาให้อยู่แล้ว — ใช้ของที่มี อย่าประดิษฐ์รูปแบบเอง

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

**หน้าสถานะระบบ** — ให้ทีมซัพพอร์ตเปิดดูเองได้โดยไม่ต้องเรียกนักพัฒนา:

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

# skill: auth-implementation-patterns

Use when implementing authentication, designing login flows, choosing between session vs JWT, implementing OAuth/SSO, adding MFA, password reset, or any identity & access management feature. Covers patterns, security pitfalls, and concrete implementation guidance.

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Implementing MFA (TOTP, SMS, WebAuthn)
- Choosing session vs token authentication
- Integrating OAuth/OIDC (Google, GitHub, etc.)
- Implementing SSO (SAML, OIDC)
- Designing API authentication (API keys, JWT, OAuth)
- Reviewing existing auth code for security issues

---

## Choose the Right Pattern

### Decision tree

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

---

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** Server-rendered apps, monoliths, single domain

**Flow:**
```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

**Implementation requirements:**
- ✅ Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- ✅ Session ID: cryptographically random, ≥ 128 bits
- ✅ Session storage: Redis with TTL (NOT in-memory for multi-instance)
- ✅ Idle timeout: 30 min default
- ✅ Absolute timeout: 8-12 hours
- ✅ Regenerate on privilege change (login, role change)
- ✅ Invalidate on logout (delete from store)

**Pitfalls:**
- ❌ Storing session in JWT (can't revoke)
- ❌ Using `localStorage` for session token (XSS-vulnerable)
- ❌ Not rotating ID on login (session fixation)

---

## Pattern 2: JWT (Stateless Token)

**When to use:** Microservices, mobile, SPA with backend API

> ⚠️ **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Flow:**
```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

**Implementation requirements:**
- ✅ Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- ✅ Short-lived access token: 5-15 min
- ✅ Refresh token: longer-lived (days), stored separately, revocable
- ✅ Refresh token rotation on use
- ✅ Claims: `sub`, `iat`, `exp`, `iss`, `aud` mandatory
- ✅ Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- ✅ Have a revocation strategy (blocklist, short expiry, etc.)

**Pitfalls:**
- ❌ `alg: none` attacks (validate algorithm explicitly)
- ❌ Storing JWT in `localStorage` (XSS-stealable)
- ❌ Long-lived access tokens (no revocation possible)
- ❌ Putting sensitive data in JWT (it's base64, not encrypted)
- ❌ Skipping signature verification

---

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", delegating auth to identity provider

### Authorization Code Flow with PKCE (recommended)

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

**Implementation requirements:**
- ✅ **Always use PKCE** (even for confidential clients)
- ✅ Validate `id_token` signature (use IdP's JWKS)
- ✅ Validate `aud`, `iss`, `exp`, `nonce`
- ✅ Use `state` parameter to prevent CSRF
- ✅ Match `code_verifier` to `code_challenge`
- ✅ Use library: don't roll your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ❌ Implicit flow (deprecated, insecure)
- ❌ Resource Owner Password Credentials flow (deprecated)
- ❌ Skipping `state` validation (CSRF risk)
- ❌ Trusting `id_token` without verifying signature

---

## Pattern 4: Multi-Factor Authentication (MFA)

### TOTP (Google Authenticator, Authy)
**When:** Standard 2FA, user-friendly

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

### WebAuthn (Passkeys) — Future-proof
**When:** Want phishing-resistant, no SMS, hardware tokens

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret = no phishing
- Default for new apps in 2026+

### SMS / Email codes
**When:** No other option (users without smartphone apps)

- ⚠️ SMS is **NOT secure** (SIM swap attacks)
- Use only as last resort, not primary
- Rate limit aggressively
- Codes: 6 digits, 5 min expiry

---

## Pattern 5: Password Management

### Storage
- ✅ **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ❌ Never: MD5, SHA-1, SHA-256 raw, plain text

```typescript
// ✅ Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// ❌ Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

### Password policy (2026 NIST guidelines)
- ✅ Minimum 12 characters
- ✅ Check against breached password list (HIBP API)
- ✅ Allow long passphrases (NO max < 64 chars)
- ✅ Allow special chars (don't restrict)
- ❌ Don't force composition rules (uppercase + digit + symbol)
- ❌ Don't force periodic rotation (only if breach suspected)

### Password reset flow
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

---

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

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

---

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show secret ONCE on creation
- Store hashed (like password)
- Allow scopes/permissions per key
- Allow expiration + rotation
- Last-used timestamp visible
- Revocable instantly

---

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

### Implementation tip
- Check authorization at every endpoint
- Don't trust client-sent role
- Server-side check based on user from session/token

---

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration (consistent error messages)
- [ ] Timing attacks (constant-time comparison)
- [ ] Token in URL (use header or cookie)
- [ ] Missing logout (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

---

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, `lucia-auth` | Lucia simpler, modern |
| Python | `authlib`, `python-jose` | authlib for OAuth |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |

---

## Anti-patterns

- ❌ Rolling your own crypto/auth (use libraries)
- ❌ Storing passwords reversibly
- ❌ JWT for sessions when you have one backend
- ❌ Long-lived JWT without rotation
- ❌ Authentication without authorization checks
- ❌ Trusting JWT claims as authorization source
- ❌ Logout that doesn't invalidate token server-side
- ❌ Allowing weak passwords for compliance "convenience"


---

# skill: spell-out-abbreviations

Use in every piece of writing produced for a person — documents, code comments, commit messages, chat replies, interface text, diagram labels. Each abbreviation is written out in full the first time with the short form in brackets, for example Model Context Protocol (MCP), and a specialist term gets a short plain-language gloss.

# Spell Out Abbreviations

> **กฎที่หนึ่ง:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎที่สอง:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายต้องไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็ม + วงเล็บ · ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่ที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) · ถ้าไม่แน่ใจ **ให้ขยาย** เสียเปล่าดีกว่าคนอ่านไม่รู้เรื่อง

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ตัวย่อขยายแล้วยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่าหนึ่งบรรทัด** ยาวกว่านั้นแปลว่าควรแยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม เดาไม่ได้คือต้องอธิบาย

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

Use when answering a question and the content has structure — comparing options, listing trade-offs, explaining how parts connect, or reporting several numbers side by side. Decides whether the answer should be prose, a comparison table, a small diagram or a short list, and keeps the chosen shape readable.

# รูปทรงของคำตอบ

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

**สัญญาณสำคัญที่สุดคือมี "สิ่งที่ถูกเทียบ" ตั้งแต่สองตัวขึ้นไป** — มีเมื่อไหร่ใช้ตาราง
เขียนเป็นย่อหน้าแล้วผู้อ่านต้องจำของตัวแรกไว้ในหัวระหว่างอ่านตัวที่สอง

---

## ตารางที่อ่านง่าย

- **คอลัมน์แรกคือสิ่งที่ถูกเทียบ** คอลัมน์ถัดไปคือแง่มุมที่เทียบ
- **3–5 คอลัมน์** เกินนี้อ่านไม่ทัน · แถวไม่เกิน 8 แถวในคำตอบแชต
- **ทุกช่องต้องมีเนื้อ** — ช่องว่างแปลว่าคอลัมน์นั้นไม่ควรมี หรือข้อมูลยังไม่ครบ ให้เขียนว่า "ไม่มี" ตรง ๆ
- **ช่องละไม่เกินหนึ่งบรรทัด** ยาวกว่านั้นยกออกไปเป็นข้อความใต้ตาราง
- **เรียงแถวตามน้ำหนัก** ตัวที่แนะนำหรือตัวที่ใช้บ่อยที่สุดอยู่บนสุด ไม่ใช่เรียงตามตัวอักษร
- **หัวคอลัมน์เป็นคำถามที่ผู้อ่านมีในหัว** ไม่ใช่ชื่อสาขาวิชา

```
❌ | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
✅ | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

**ปิดท้ายตารางด้วยข้อสรุปหนึ่งบรรทัดเสมอ** — ตารางบอกข้อมูล ไม่ได้บอกว่าควรเลือกอะไร

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

รูปที่ต้องเป็นไฟล์จริงเพื่อใส่เอกสารหรือสไลด์ ไปที่ `software-diagrams` หรือ `svg-diagram-system`

---

## เมื่อไหร่ประโยคชนะทั้งคู่

- คำตอบสั้นกว่าสามบรรทัด — ตารางสองแถวคือการตกแต่ง ไม่ใช่การอธิบาย
- คำถามที่ตอบว่า "ใช่" หรือ "ไม่ใช่" แล้วตามด้วยเหตุผลหนึ่งประโยค
- เรื่องที่**เหตุผลสำคัญกว่าตัวเลือก** — ตารางจะตัดเหตุผลทิ้งเพื่อให้พอดีช่อง

> ตารางที่มีแถวเดียวหรือสองแถวสั้น ๆ แปลว่าใช้ผิดรูปทรง

---

## ความยาวของคำตอบ

- **คำตอบอยู่บรรทัดแรก** เหตุผลตามหลัง — ไม่ใช่ไล่เหตุผลมาก่อนแล้วค่อยเฉลย
- ไม่ต้องทวนคำถาม ไม่ต้องเกริ่น ไม่ต้องสรุปซ้ำตอนจบ
- **สิ่งที่ยังไม่ได้ทำหรือยังไม่แน่ใจ ต้องบอก** แม้จะทำให้คำตอบยาวขึ้น
- คำตอบยาวเกินหน้าจอ ให้ถามก่อนว่าต้องการละเอียดแค่ไหน แทนที่จะเทให้หมด

---

## Anti-patterns

- ❌ **ย่อหน้ายาวเปรียบเทียบสามตัวเลือก** — ผู้อ่านต้องจำตัวแรกไว้จนจบ
- ❌ **ตารางที่มีช่องว่าง** หรือช่องที่เขียนว่า "ขึ้นอยู่กับ" ทุกช่อง
- ❌ **ตารางสองแถวเพื่อให้ดูเป็นระเบียบ**
- ❌ **รูปที่วาดสิ่งที่ประโยคเดียวบอกได้**
- ❌ **ตารางที่ไม่มีข้อสรุป** — ทิ้งให้ผู้อ่านตัดสินใจเองทั้งที่เขาถามเพราะอยากได้คำแนะนำ
- ❌ **เรียงแถวตามตัวอักษร** ทั้งที่มีตัวที่แนะนำชัดเจน
- ❌ **หัวคอลัมน์เป็นศัพท์วิชาการ** ทั้งที่เขียนเป็นคำถามธรรมดาได้

---

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ถ้อยคำในคำตอบ — ตัวย่อและศัพท์เฉพาะ | `spell-out-abbreviations` |
| รูปที่ต้องเป็นไฟล์จริง | `software-diagrams` · `svg-diagram-system` |
| ภาพในเอกสาร markdown | `markdown-visuals` |
| ตัดเนื้อหาให้เหลือเท่าที่จำเป็น | `simplicity-first` |

---

## ตัวย่อ

- **ASCII** — American Standard Code for Information Interchange (การวาดรูปด้วยตัวอักษรธรรมดา)
- **Mermaid** — ภาษาเขียนไดอะแกรมเป็นข้อความ แล้วให้โปรแกรมวาดให้

---

**ถ้าสิ่งที่จะพูดคือของที่เจอระหว่างทำงาน แล้วต้องให้ผู้ใช้ตัดสินใจก่อนไปต่อ** →
`flag-and-propose` (เปิดด้วยผลกระทบ · ตารางเทียบ · ข้อเสนอ · ปิดด้วยคำถามเดียว)
