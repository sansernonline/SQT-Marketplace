# OWASP Top 10:2025 ตาม stack ที่ทีมใช้

เปิดไฟล์นี้ตอนเขียนโค้ดและตอนกรอกรายงาน · แต่ละข้อบอก "ใช้อะไร" และ "อย่าทำ" · ค่าเริ่มของ framework ที่ปลอดภัยอยู่แล้ว ให้ใช้ตามนั้น ไม่เขียนเอง

- [.NET / ASP.NET Core](#net--aspnet-core)
- [TypeScript · Node · Angular](#typescript--node--angular)
- [Python (FastAPI · Django · Flask)](#python-fastapi--django--flask)
- [SQL (SQL Server · PostgreSQL · MySQL)](#sql-sql-server--postgresql--mysql)
- [เครื่องมือที่ใช้พิสูจน์](#เครื่องมือที่ใช้พิสูจน์)

---

## .NET / ASP.NET Core

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | `FallbackPolicy` = ต้อง login ทุก endpoint แล้วเปิดเฉพาะที่ตั้งใจด้วย `[AllowAnonymous]` · ตรวจเจ้าของ record ด้วย `IAuthorizationService` + resource-based policy · ASP.NET MVC แบบเก่าใช้ `[Authorize]` ระดับ controller + filter กลาง · antiforgery token ทุก form (`[ValidateAntiForgeryToken]` หรือ `AutoValidateAntiforgeryTokenAttribute` ทั้งแอป) · รับ input ผ่าน ViewModel หรือ DTO ไม่ bind entity ตรง | ซ่อนปุ่มใน view แล้วถือว่าคุมสิทธิ์แล้ว · ใช้ id จาก URL ค้น DB โดยไม่กรองด้วย user |
| A02 | `app.UseExceptionHandler` + `UseHsts` ใน production · `customErrors mode="RemoteOnly"` (MVC เก่า) · ลบ header `Server` · `X-Powered-By` | เปิด `UseDeveloperExceptionPage` บน production · เก็บ connection string ใน `appsettings.json` ที่ commit |
| A03 | `dotnet list package --vulnerable --include-transitive` · `Directory.Packages.props` คุมเวอร์ชันที่เดียว · SBOM: `dotnet CycloneDX` | ใช้แพ็กเกจที่ไม่มีคนดูแลแล้ว (ดูวันออกล่าสุด) |
| A04 | ASP.NET Core Identity (PBKDF2) หรือ `Rfc2898DeriveBytes.Pbkdf2` · Data Protection API สำหรับค่าที่ต้องถอดกลับ · ค่าลับใน User Secrets หรือ Key Vault | `MD5` · `SHA1` · `DES` · เขียน crypto เอง |
| A05 | EF Core LINQ · `FromSqlInterpolated` · Dapper พร้อม parameter · Razor encode HTML ให้เอง | `FromSqlRaw` ต่อสตริง · `Html.Raw` กับข้อมูลผู้ใช้ · `Process.Start` กับ input |
| A07 | Identity: `Lockout.MaxFailedAccessAttempts` + `PasswordSignInAsync(..., lockoutOnFailure: true)` (หน้า Login ที่ scaffold มาตั้งเป็น false) · cookie `HttpOnly` `Secure` `SameSite` · JWT: ตั้ง `ValidateIssuer` `ValidateAudience` `ValidateLifetime` `ValidateIssuerSigningKey` = true | `ValidateLifetime = false` · รับ algorithm `none` |
| A08 | `System.Text.Json` · webhook ตรวจลายเซ็น Hash-based Message Authentication Code (HMAC) ด้วย `CryptographicOperations.FixedTimeEquals` | `BinaryFormatter` · `TypeNameHandling.All` ของ Newtonsoft |
| A09 | `ILogger` แบบ structured (Serilog) · log ผล login · ถูกปฏิเสธสิทธิ์ · ตัดค่าลับด้วย destructuring policy | log ทั้ง request body ที่มีรหัสผ่าน |
| A10 | ตัวจับกลาง `IExceptionHandler` (.NET 8 ขึ้นไป · ลงทะเบียน `AddExceptionHandler<T>()` + `AddProblemDetails()` **และ** ต้องมี `app.UseExceptionHandler()` ใน pipeline ไม่งั้นตัวจับไม่ทำงาน) คืน `ProblemDetails` · .NET เก่ากว่าใช้ `UseExceptionHandler` กับ lambda หรือ path · `TransactionScope` หรือ `BeginTransaction` ครอบงานหลายขั้น · `CancellationToken` + timeout ของ `HttpClient` | `catch { }` ว่าง · `catch` แล้วคืน `true` จากตัวตรวจสิทธิ์ |

## TypeScript · Node · Angular

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | middleware ตรวจสิทธิ์ตัวเดียวที่ router ระดับบน (ปฏิเสธเป็นค่าเริ่ม) · query กรองด้วย `userId` ของ session ทุกครั้ง · Angular route guard ใช้แค่ซ่อนหน้า ส่วนสิทธิ์จริงตรวจที่ API · SSRF: allowlist host ก่อน `fetch` URL ที่ผู้ใช้ส่ง · CSRF token เมื่อใช้ cookie session · ตรวจ body ด้วย schema (zod) แล้วหยิบเฉพาะฟิลด์ที่อนุญาต | เชื่อ `role` ที่ client ส่งมา · `Object.assign(entity, req.body)` · `cors({ origin: true, credentials: true })` |
| A02 | `helmet()` · `NODE_ENV=production` · ปิด source map ใน production build · Express `app.disable("x-powered-by")` | ส่ง `err.stack` กลับ client |
| A03 | `npm ci` + `package-lock.json` · `npm audit --omit=dev` · SBOM: `npx @cyclonedx/cyclonedx-npm` · ตรวจ `postinstall` ของแพ็กเกจใหม่ | `npm install` แพ็กเกจที่ชื่อคล้ายของดัง (typosquat) โดยไม่ดูผู้ดูแล |
| A04 | `argon2` หรือ `bcrypt` · `crypto.randomBytes` · `crypto.timingSafeEqual` | `Math.random()` ทำ token · `crypto.createHash("md5")` กับรหัสผ่าน |
| A05 | ORM (Prisma · TypeORM) หรือ parameter `$1` · Angular escape ให้เอง · `execFile` พร้อม argument เป็น array | `innerHTML` · `bypassSecurityTrustHtml` กับข้อมูลผู้ใช้ · `eval` · `exec` ต่อสตริง · `new Function` |
| A07 | `express-rate-limit` ที่ `/login` · cookie `httpOnly` `secure` `sameSite` · JWT: `jwt.verify(token, key, { algorithms: ["RS256"], issuer, audience })` (ระบุ algorithm ที่ใช้จริงตายตัว) | เก็บ token ใน `localStorage` ของระบบที่มีข้อมูลอ่อนไหว · `jwt.decode` แทน `verify` |
| A08 | ตรวจลายเซ็น webhook ก่อน `JSON.parse` · Subresource Integrity (SRI) กับ script จาก CDN | `node-serialize` · โหลด script จาก CDN โดยไม่มี `integrity` |
| A09 | pino หรือ winston แบบ JSON · `redact: ["req.headers.authorization", "*.password"]` | `console.log(req.body)` |
| A10 | Express error middleware ตัวสุดท้าย · `process.on("unhandledRejection")` log แล้วปิดอย่างเป็นระเบียบ · transaction ของ ORM · `AbortSignal.timeout()` กับ `fetch` | `.catch(() => {})` · promise ที่ไม่มีใคร await |

## Python (FastAPI · Django · Flask)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | FastAPI `Depends(current_user)` ระดับ router · Django `LoginRequiredMixin` + `get_object_or_404(Model, pk=..., owner=request.user)` · SSRF: allowlist host ก่อน `httpx.get` · Django CSRF middleware เปิดไว้ · รับ input ด้วย Pydantic model หรือ Django `ModelForm(fields=[...])` | `Model.objects.get(pk=id)` โดยไม่กรองเจ้าของ · `fields = "__all__"` · `@csrf_exempt` ทั้ง view โดยไม่มีเหตุผล |
| A02 | Django `DEBUG=False` · `SECURE_*` settings · `python manage.py check --deploy` · FastAPI ปิด `/docs` บน production ถ้าไม่ได้ตั้งใจเปิด | `DEBUG=True` · `ALLOWED_HOSTS=["*"]` |
| A03 | lockfile (`uv.lock` · `poetry.lock` · `requirements.txt` ที่ pin เวอร์ชัน + `--require-hashes`) · `pip-audit` · SBOM: `cyclonedx-py environment` (หรือ `requirements` · `poetry`) | `pip install` จาก URL ที่ไม่รู้จัก |
| A04 | `argon2-cffi` · Django password hasher ค่าเริ่ม · `secrets.token_urlsafe` · `hmac.compare_digest` | `hashlib.md5(password)` · `random` ทำ token |
| A05 | ORM หรือ `cursor.execute(sql, params)` · Jinja2 `autoescape=True` · `subprocess.run([...])` แบบ list | f-string ใน SQL · `shell=True` กับ input · `eval` |
| A07 | `slowapi` หรือ django-axes กัน login รัว · PyJWT: `jwt.decode(token, key, algorithms=["RS256"], audience=..., issuer=...)` (ระบุ algorithm ที่ใช้จริงตายตัว) | `jwt.decode(..., options={"verify_signature": False})` |
| A08 | ตรวจลายเซ็น webhook ด้วย `hmac.compare_digest` · `yaml.safe_load` · `json` | `pickle.loads` · `yaml.load` กับข้อมูลภายนอก |
| A09 | `logging` แบบ structured (structlog) · filter ตัดค่าลับ | log `request.headers` ทั้งก้อน |
| A10 | FastAPI `@app.exception_handler(Exception)` · Django `handler500` · `with transaction.atomic():` · timeout ทุกการเรียก `httpx` | `except Exception: pass` · ตัวตรวจสิทธิ์ที่ `except` แล้ว `return True` |

## SQL (SQL Server · PostgreSQL · MySQL)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | user ของแอปมีสิทธิ์เท่าที่ใช้ (ไม่ใช่ `sa` · `postgres` · `root`) · แยก user อ่านอย่างเดียวสำหรับรายงาน · Row-Level Security (RLS) ของ PostgreSQL หรือ SQL Server สำหรับระบบหลายลูกค้า (multi-tenant) | ให้แอปใช้ user เจ้าของ database |
| A02 | ปิด port DB จากภายนอก · บังคับ TLS ของการเชื่อมต่อ · ปิด `xp_cmdshell` | เปิด DB ออก internet |
| A04 | Transparent Data Encryption (TDE) หรือเข้ารหัสระดับดิสก์ · คอลัมน์อ่อนไหวเข้ารหัสระดับแอป หรือ Always Encrypted · backup เข้ารหัส | เก็บเลขบัตรประชาชน · เลขบัตรเครดิตเป็นข้อความเปล่า |
| A05 | stored procedure หรือ query ที่รับ parameter · ถ้าต้องสร้าง SQL แบบ dynamic ใช้ `sp_executesql` พร้อม parameter และ `QUOTENAME` กับชื่อ object | `EXEC('... ' + @input)` · ต่อชื่อตารางจาก input |
| A09 | audit ตารางเงินและสิทธิ์ (trigger หรือ temporal table) · log login ล้มของ DB | ปิด audit เพื่อให้เร็ว |
| A10 | `BEGIN TRY ... BEGIN CATCH ... ROLLBACK` · `SET XACT_ABORT ON` · migration รันซ้ำได้ (`IF NOT EXISTS`) | migration ที่ล้มกลางทางแล้วทิ้งตารางครึ่ง ๆ |

## เครื่องมือที่ใช้พิสูจน์

| ใช้ทำอะไร | เครื่องมือ | ครอบข้อ |
|---|---|---|
| ค่าลับ · dependency · โค้ดเสี่ยง · ไฟล์ตั้งค่าโครงสร้างพื้นฐาน (Infrastructure as Code (IaC)) | ตาม [`security-gate`](../../security-gate/SKILL.md) (gitleaks · npm audit · pip-audit · dotnet · osv-scanner · trivy · semgrep) | A02 · A03 · A04 · A05 · A08 |
| semgrep ชุดเฉพาะ OWASP | `semgrep scan --config p/owasp-top-ten --metrics=off` (ต้องมีเน็ต) · ออฟไลน์ใช้ชุดของ `security-gate` | A01 · A04 · A05 · A08 |
| สแกนแอปที่รันอยู่ (header · cookie · error page) | OWASP ZAP (Zed Attack Proxy) baseline กับ environment ทดสอบของโปรเจกต์เท่านั้น: `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t <URL ทดสอบ>` | A02 · A05 · A07 |
| SBOM | CycloneDX ตามภาษา (ข้างบน) เก็บที่ `qa/security/sbom/` | A03 |
| test สิทธิ์ · login · error · webhook | integration test ของโปรเจกต์ ตั้งชื่อขึ้นต้นด้วยรหัสข้อ (`A01_...`) | A01 · A06 · A07 · A08 · A09 · A10 |

- ZAP ยิงจริง → ใช้กับ environment ทดสอบที่ทีม deploy เองเท่านั้น ห้ามยิง production หรือระบบของคนอื่นโดยไม่มีหนังสืออนุญาต
- เครื่องมือไหนรันไม่ได้ ให้เขียน `ยังไม่ได้ตรวจ` พร้อมเหตุผลในรายงาน ห้ามสรุปว่าผ่านจากผลว่าง
