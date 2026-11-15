# OWASP Top 10:2025 by the stacks the team uses

Open this file when writing code and when filling in the report. Each item says what to use and what to avoid. Where a framework default is already secure, use it and do not write your own.

- [.NET / ASP.NET Core](#net--aspnet-core)
- [TypeScript · Node · Angular](#typescript--node--angular)
- [Python (FastAPI · Django · Flask)](#python-fastapi--django--flask)
- [SQL (SQL Server · PostgreSQL · MySQL)](#sql-sql-server--postgresql--mysql)
- [Tools for proving each item](#tools-for-proving-each-item)

---

## .NET / ASP.NET Core

| Item | Use | Avoid |
|---|---|---|
| A01 | `FallbackPolicy` so every endpoint requires login, then open only the intended ones with `[AllowAnonymous]` · check record ownership with `IAuthorizationService` + a resource-based policy · old ASP.NET MVC: `[Authorize]` at controller level + a global filter · antiforgery token on every form (`[ValidateAntiForgeryToken]` or `AutoValidateAntiforgeryTokenAttribute` app-wide) · take input through a ViewModel or DTO, never bind an entity directly | Hiding a button in the view and calling that access control · looking up the DB by the id in the URL without filtering by user |
| A02 | `app.UseExceptionHandler` + `UseHsts` in production · `customErrors mode="RemoteOnly"` (old MVC) · remove the `Server` · `X-Powered-By` headers | Enabling `UseDeveloperExceptionPage` in production · keeping the connection string in a committed `appsettings.json` |
| A03 | `dotnet list package --vulnerable --include-transitive` · `Directory.Packages.props` to control versions in one place · SBOM: `dotnet CycloneDX` | Using packages nobody maintains any more (check the last release date) |
| A04 | ASP.NET Core Identity (PBKDF2) or `Rfc2898DeriveBytes.Pbkdf2` · Data Protection API for values that must be decrypted · secrets in User Secrets or Key Vault | `MD5` · `SHA1` · `DES` · writing your own crypto |
| A05 | EF Core LINQ · `FromSqlInterpolated` · Dapper with parameters · Razor encodes HTML itself | `FromSqlRaw` with string concatenation · `Html.Raw` with user data · `Process.Start` with input |
| A07 | Identity: `Lockout.MaxFailedAccessAttempts` + `PasswordSignInAsync(..., lockoutOnFailure: true)` (the scaffolded Login page sets it to false) · cookie `HttpOnly` `Secure` `SameSite` · JWT: set `ValidateIssuer` `ValidateAudience` `ValidateLifetime` `ValidateIssuerSigningKey` = true | `ValidateLifetime = false` · accepting algorithm `none` |
| A08 | `System.Text.Json` · verify webhook Hash-based Message Authentication Code (HMAC) signatures with `CryptographicOperations.FixedTimeEquals` | `BinaryFormatter` · Newtonsoft `TypeNameHandling.All` |
| A09 | structured `ILogger` (Serilog) · log login results and permission denials · strip secrets with a destructuring policy | Logging the whole request body when it holds passwords |
| A10 | A central `IExceptionHandler` (.NET 8 and later; register `AddExceptionHandler<T>()` + `AddProblemDetails()` **and** put `app.UseExceptionHandler()` in the pipeline, or the handler never runs) that returns `ProblemDetails` · older .NET: `UseExceptionHandler` with a lambda or path · wrap multi-step work in `TransactionScope` or `BeginTransaction` · `CancellationToken` + an `HttpClient` timeout | An empty `catch { }` · a `catch` that returns `true` from an authorization check |

## TypeScript · Node · Angular

| Item | Use | Avoid |
|---|---|---|
| A01 | One authorization middleware on the top-level router (deny by default) · filter every query by the session's `userId` · an Angular route guard only hides pages, so check real permissions at the API · SSRF: allowlist hosts before `fetch` on a user-supplied URL · CSRF token when using cookie sessions · validate the body with a schema (zod), then pick only the allowed fields | Trusting a `role` sent by the client · `Object.assign(entity, req.body)` · `cors({ origin: true, credentials: true })` |
| A02 | `helmet()` · `NODE_ENV=production` · turn off source maps in the production build · Express `app.disable("x-powered-by")` | Sending `err.stack` back to the client |
| A03 | `npm ci` + `package-lock.json` · `npm audit --omit=dev` · SBOM: `npx @cyclonedx/cyclonedx-npm` · check `postinstall` of new packages | Running `npm install` on a package whose name looks like a popular one (typosquat) without checking the maintainer |
| A04 | `argon2` or `bcrypt` · `crypto.randomBytes` · `crypto.timingSafeEqual` | `Math.random()` for tokens · `crypto.createHash("md5")` on passwords |
| A05 | An ORM (Prisma · TypeORM) or `$1` parameters · Angular escapes by itself · `execFile` with arguments as an array | `innerHTML` · `bypassSecurityTrustHtml` with user data · `eval` · `exec` with string concatenation · `new Function` |
| A07 | `express-rate-limit` on `/login` · cookie `httpOnly` `secure` `sameSite` · JWT: `jwt.verify(token, key, { algorithms: ["RS256"], issuer, audience })` (fix the algorithm you really use) | Keeping tokens in `localStorage` in a system with sensitive data · `jwt.decode` instead of `verify` |
| A08 | Verify the webhook signature before `JSON.parse` · Subresource Integrity (SRI) on scripts from a CDN | `node-serialize` · loading a CDN script without `integrity` |
| A09 | pino or winston in JSON · `redact: ["req.headers.authorization", "*.password"]` | `console.log(req.body)` |
| A10 | An Express error middleware as the last one · `process.on("unhandledRejection")` logs, then shuts down cleanly · ORM transactions · `AbortSignal.timeout()` with `fetch` | `.catch(() => {})` · a promise nobody awaits |

## Python (FastAPI · Django · Flask)

| Item | Use | Avoid |
|---|---|---|
| A01 | FastAPI `Depends(current_user)` at router level · Django `LoginRequiredMixin` + `get_object_or_404(Model, pk=..., owner=request.user)` · SSRF: allowlist hosts before `httpx.get` · keep the Django CSRF middleware on · take input with a Pydantic model or Django `ModelForm(fields=[...])` | `Model.objects.get(pk=id)` without filtering by owner · `fields = "__all__"` · `@csrf_exempt` on a whole view without a reason |
| A02 | Django `DEBUG=False` · `SECURE_*` settings · `python manage.py check --deploy` · turn off FastAPI `/docs` in production unless it is meant to be open | `DEBUG=True` · `ALLOWED_HOSTS=["*"]` |
| A03 | A lockfile (`uv.lock` · `poetry.lock` · `requirements.txt` with pinned versions + `--require-hashes`) · `pip-audit` · SBOM: `cyclonedx-py environment` (or `requirements` · `poetry`) | `pip install` from an unknown URL |
| A04 | `argon2-cffi` · the Django default password hasher · `secrets.token_urlsafe` · `hmac.compare_digest` | `hashlib.md5(password)` · `random` for tokens |
| A05 | An ORM or `cursor.execute(sql, params)` · Jinja2 `autoescape=True` · `subprocess.run([...])` as a list | An f-string in SQL · `shell=True` with input · `eval` |
| A07 | `slowapi` or django-axes against rapid login attempts · PyJWT: `jwt.decode(token, key, algorithms=["RS256"], audience=..., issuer=...)` (fix the algorithm you really use) | `jwt.decode(..., options={"verify_signature": False})` |
| A08 | Verify the webhook signature with `hmac.compare_digest` · `yaml.safe_load` · `json` | `pickle.loads` · `yaml.load` on external data |
| A09 | Structured `logging` (structlog) · a filter that strips secrets | Logging the whole of `request.headers` |
| A10 | FastAPI `@app.exception_handler(Exception)` · Django `handler500` · `with transaction.atomic():` · a timeout on every `httpx` call | `except Exception: pass` · an authorization check that does `except` then `return True` |

## SQL (SQL Server · PostgreSQL · MySQL)

| Item | Use | Avoid |
|---|---|---|
| A01 | The app's user has only the rights it needs (not `sa` · `postgres` · `root`) · a separate read-only user for reports · Row-Level Security (RLS) in PostgreSQL or SQL Server for multi-tenant systems | Letting the app use the database owner's user |
| A02 | Close the DB port to the outside · force TLS on connections · turn off `xp_cmdshell` | Exposing the DB to the internet |
| A04 | Transparent Data Encryption (TDE) or disk-level encryption · encrypt sensitive columns at app level or with Always Encrypted · encrypted backups | Storing national ID numbers or credit card numbers as plain text |
| A05 | Stored procedures or parameterized queries · if you must build dynamic SQL, use `sp_executesql` with parameters and `QUOTENAME` on object names | `EXEC('... ' + @input)` · building table names from input |
| A09 | Audit the money and permission tables (trigger or temporal table) · log failed DB logins | Turning off auditing for speed |
| A10 | `BEGIN TRY ... BEGIN CATCH ... ROLLBACK` · `SET XACT_ABORT ON` · migrations that can run again (`IF NOT EXISTS`) | A migration that fails halfway and leaves half-built tables |

## Tools for proving each item

| Purpose | Tool | Covers |
|---|---|---|
| Secrets · dependencies · risky code · Infrastructure as Code (IaC) config files | As in [`security-gate`](../../security-gate/SKILL.md) (gitleaks · npm audit · pip-audit · dotnet · osv-scanner · trivy · semgrep) | A02 · A03 · A04 · A05 · A08 |
| OWASP-specific semgrep rules | `semgrep scan --config p/owasp-top-ten --metrics=off` (needs internet) · offline, use the `security-gate` ruleset | A01 · A04 · A05 · A08 |
| Scan a running app (headers · cookies · error pages) | OWASP ZAP (Zed Attack Proxy) baseline, against the project's own test environment only: `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t <test URL>` | A02 · A05 · A07 |
| SBOM | CycloneDX per language (above), stored in `qa/security/sbom/` | A03 |
| Tests for permissions · login · errors · webhooks | The project's integration tests, with names starting with the item code (`A01_...`) | A01 · A06 · A07 · A08 · A09 · A10 |

- ZAP sends real attacks. Use it only on a test environment the team deployed itself. Never run it on production or on someone else's system without written permission.
- If a tool cannot run, write `ยังไม่ได้ตรวจ` (not yet checked) with the reason in the report. Never conclude "pass" from an empty result.
