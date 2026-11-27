# skill: stack-dotnet

Use when writing or fixing C# and .NET code

# stack-dotnet — write C# that builds clean, passes tests, and avoids the usual traps

Use whenever the work touches C# code of any kind: ASP.NET Core (Web API · Model-View-Controller (MVC) · minimal API) · Entity Framework (EF) Core · ASP.NET MVC 5 on .NET Framework 4.x that is still maintained.

---

## 1 · Start: read the version first, then run the same commands every time

- Find the Software Development Kit (SDK) version in `global.json`, and the target version in `<TargetFramework>` in `*.csproj` or `Directory.Build.props`.
- Versions (last checked 2026-10-14 · source: https://dotnet.microsoft.com/platform/support/policy/dotnet-core): `net10.0` is the latest Long Term Support (LTS) release, supported until 2028-11-14 · `net8.0` (LTS) and `net9.0` (Standard Term Support, STS) are near the end, supported until 2026-11-10 · if you meet these 2, tell the owner and do not upgrade on your own mid-task · recheck this page before relying on it.
- If you find `net48` or `v4.x` in `<TargetFrameworkVersion>`, it is .NET Framework, so use the legacy commands below.

| Step | .NET (Core) 8+ | .NET Framework 4.x (Windows) |
|---|---|---|
| Restore packages | `dotnet restore` | `msbuild App.sln -t:restore` or `nuget restore App.sln` |
| build | `dotnet build -warnaserror` (or per the repo's policy) | `msbuild App.sln -p:Configuration=Release` |
| Run all tests | `dotnet test` | `vstest.console.exe Tests/bin/Release/App.Tests.dll` |
| Format | `dotnet format --verify-no-changes` | Per `.editorconfig` in Visual Studio |

Run a single test:

```bash
dotnet test --filter "FullyQualifiedName~OrderServiceTests.Cancel"   # VSTest (default)
dotnet test --filter-method "*Cancel_*"                               # xUnit v3 on Microsoft Testing Platform (MTP)
vstest.console.exe App.Tests.dll /TestCaseFilter:"FullyQualifiedName~Cancel"   # .NET Framework
```

- A full test run prints a long log. Append `2>&1 | tail -40` to see only the summary and the failed tests.
- If the repo sets MTP in `global.json` (`"test": { "runner": "Microsoft.Testing.Platform" }`), use the `--filter-*` form on the 2nd line.
- `msbuild` and `vstest.console.exe` live in Visual Studio or Build Tools. Open them through Developer PowerShell. A Linux machine cannot build a .NET Framework web project, so say plainly that it has not been built.

## 2 · Structure and patterns

Set this once in `Directory.Build.props` for every project in the solution:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

- If an old repo has hundreds of warnings, do not switch on `TreatWarningsAsErrors` for the whole solution in one task. Turn it on only for new projects, and add no new warnings.
- Organise folders by feature (`Features/Orders/...`) per `code-craft`, but if the repo already uses `Controllers/ Services/`, follow the existing layout.
- Use file-scoped namespaces (`namespace App.Orders;`), make Data Transfer Objects (DTO) a `record`, and never return an EF entity straight out of an API.
- Async all the way: a method that waits on I/O takes `CancellationToken ct` and passes it down every layer to EF and `HttpClient`.
- Choose minimal API or controllers to match what the repo uses. Do not mix them within one feature.

Service lifetimes in Dependency Injection (DI):

| Lifetime | Use for | Never |
|---|---|---|
| Singleton | Stateless things · caches · `TimeProvider` | Take a Scoped service in the constructor (`DbContext` would live across requests) |
| Scoped | `DbContext` · services that use per-request data | Call it from a `BackgroundService` directly (use `IServiceScopeFactory.CreateScope()` instead) |
| Transient | Light, stateless things | Hold a resource that needs disposing and hand it to a singleton |

Use the options pattern for config values, and validate them at app start:

```csharp
builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration("Smtp")
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

An outcome that is "unsuccessful but expected" (not found · duplicate · out of stock) is returned as a value (a `Result<T>` record with `IsSuccess`, `Value`, `Error`, `Code`), not thrown. Keep exceptions for what the code does not expect. Use one code → status mapping for the whole system, then emit `ProblemDetails`. If the repo already has `FluentResults` or `ErrorOr`, use that one and do not add a second record on top. Code: [`references/patterns.md`](references/patterns.md).

**4 checks for a new type**: (1) hide the internals: use a `record` whose constructor is `private` and give it a `Create` factory (2) the rules live in the type, so an invalid value cannot be built (3) validate once, in the constructor or factory (4) expose no setter: use `init` or a `readonly record struct`

## 3 · EF Core

| Topic | Do this |
|---|---|
| Read-only | `AsNoTracking()` · fetch only the columns you use with `Select(o => new OrderDto(...))` |
| N+1 | Never loop and query inside the loop. Use `Include` or a projection. If you `Include` several collections, add `AsSplitQuery()` |
| Update or delete many rows | Use `ExecuteUpdateAsync` / `ExecuteDeleteAsync`, do not load and edit one by one, but note these commands bypass the change tracker |
| migration | Read the SQL every time: `dotnet ef migrations script --idempotent -o migrate.sql` |
| production | Never `EnsureCreated()`, and never `Database.Migrate()` at app start when several instances start together. Run the script at deploy time instead |
| Concurrent edits | Use `[Timestamp] byte[] RowVersion` (SQL Server) or `IsConcurrencyToken()`, then catch `DbUpdateConcurrencyException` to tell the user |
| Time | Always store UTC, and PostgreSQL (Npgsql) requires `DateTimeKind.Utc` for `timestamptz` |

Look at the SQL EF really generates before handing over:

```csharp
var sql = db.Orders.Where(o => o.Status == Status.Open).ToQueryString();
// or in Development
options.LogTo(Console.WriteLine, LogLevel.Information).EnableSensitiveDataLogging();
```

Use `EnableSensitiveDataLogging` on dev machines only. For schema and indexes, follow `database-design`.

## 4 · Common traps

| Trap | What happens | Do this instead |
|---|---|---|
| `async void` | An exception crashes the process and cannot be caught | Use `async Task`, except for UI event handlers |
| `.Result` · `.Wait()` · `GetAwaiter().GetResult()` | MVC 5 deadlocks · Core eats threads until the app slows | Use `async Task<ActionResult>` all the way, and `ConfigureAwait(false)` in libraries |
| `new HttpClient()` every time | Sockets run out and DNS never refreshes | Use `IHttpClientFactory` or a typed client; on .NET Framework use `static readonly HttpClient` |
| Forgetting to dispose | Connections and files stay open | `using var` · `await using` for `IAsyncDisposable` |
| Building SQL by string concatenation | SQL injection | LINQ · `FromSql($"...{id}")` (it parameterises for you) · Dapper with `new { id }` · never `FromSqlRaw` with a string you built |
| Parsing or formatting with the machine's culture | A `th-TH` machine uses the Buddhist calendar, so the year comes out as 2569 and parsing "2026-01-05" gives a year wrong by 543 | Store and parse with `CultureInfo.InvariantCulture` · show Buddhist Era years only when displaying, per `i18n-and-locale` |
| Money as `double` | 0.1 + 0.2 ≠ 0.3 | Use `decimal` and state the column as `decimal(18,2)` explicitly |
| `DateTime.Now` | Cannot be tested, and time drifts with the server | Use `TimeProvider` through DI and `FakeTimeProvider` in tests |
| Thai time | The server runs in UTC | `TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok")`; on .NET Framework on Windows use `"SE Asia Standard Time"` |
| An array or string ≥ 85,000 bytes | Lands on the Large Object Heap (LOH) and burdens the memory garbage collector (GC) | Stream the data · `ArrayPool<T>` · `IAsyncEnumerable<T>` for long lists |
| `$"..."` in a log call | Cannot search by field, and builds the string even when the log level is off | Message template: `log.LogInformation("Order {OrderId} paid", id)`; for other formats see `errors-and-logs` |

For where to catch exceptions and how to retry, see `errors-and-logs`. In ASP.NET Core, use `IExceptionHandler` + `AddProblemDetails()` in one place.

## 5 · Tests

- Use the framework the repo already has. For a new project use xUnit (v3 for .NET 8+), per `test-automation`.
- FluentAssertions from v8 onward needs a paid licence for commercial use, while v7 is still free (Apache 2.0). In a new project use xUnit's asserts or AwesomeAssertions (a free fork). If the repo already uses v8, ask the owner about the licence.
- Test names: `Method_Condition_Result`, for example `Cancel_WhenAlreadyShipped_Throws`
- For new logic or a bug, write a failing test first, then fix it until green, and a bug needs a test that reproduces the real symptom.
- Test a whole API path with `WebApplicationFactory<Program>`. If the test cannot see `Program`, add `public partial class Program;`.
- For a real database use Testcontainers (`Testcontainers.MsSql` · `Testcontainers.PostgreSql`). Never use EF InMemory in place of a real database, because it does not check constraints and translates SQL differently.

For the full xUnit setup and a `WebApplicationFactory` example, see [`test-automation/references/per-stack.md`](../test-automation/references/per-stack.md#net--xunit)

## 6 · .NET-specific security

| Topic | ASP.NET Core | MVC 5 (.NET Framework) |
|---|---|---|
| Cross-Site Request Forgery (CSRF) | For MVC add `AutoValidateAntiforgeryToken` as a global filter; Razor Pages check it themselves | `@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]` on every POST |
| Login required by default | Set `FallbackPolicy` to `RequireAuthenticatedUser()`, then add `[AllowAnonymous]` one place at a time on pages open to everyone | `GlobalFilters.Filters.Add(new AuthorizeAttribute())` |
| Extra fields posted (over-posting) | Bind into a DTO that holds only the editable fields | Use a separate view model, never bind the entity directly |
| Output | Razor encodes for you, but never use `Html.Raw` on user data | The same, and beware `MvcHtmlString` |
| Data Protection keys | With several instances or containers, keep the keys in one shared place (`PersistKeysToDbContext` or a file share), or cookies break on every restart | The same `machineKey` in `web.config` on every machine |
| secret | dev: `dotnet user-secrets set "Db:Password" "..."` · prod: environment variable or secret store | Keep a separate `web.config` transform and never commit real values |

- A committed `appsettings.json` or `web.config` must not hold passwords, real connection strings or API keys. For storing secrets, see `web-service-essentials`.
- For input validation · uploads · encryption, see `security-gate`.

## 7 · Check before sending

- [ ] `dotnet build -warnaserror` gives 0 warnings (or, in an old repo, adds no warnings over before)
- [ ] `dotnet test` all pass, and the report says how many passed out of how many (long output → `> _to_delete/test.txt 2>&1`, then `tail -20`)
- [ ] `dotnet format --verify-no-changes` finds nothing to fix
- [ ] New behaviour has a test that was red before the fix
- [ ] No new `.Result` · `.Wait()` · `async void`: `grep -rnE "\.Result\b|\.Wait\(\)|async void" --include=*.cs`
- [ ] For any query you changed, you looked at the real SQL and there is no N+1
- [ ] The migration has an `--idempotent` script, you read it, and it has no unintended `DROP`
- [ ] If you cannot build .NET Framework on this machine, write in the report that it was not built. Do not say it passed.

## References

- [`references/patterns.md`](references/patterns.md) — open when writing a `Result<T>` or a validated value type (Thai national ID example, not compiled)


## reference: patterns.md

# C# patterns · stack-dotnet

## Result<T> for expected failures

```csharp
public sealed record Result<T>(bool IsSuccess, T? Value, string? Error, string? Code)
{
    public static Result<T> Ok(T value) => new(true, value, null, null);
    public static Result<T> Fail(string error, string? code = null) => new(false, default, error, code);
}

// service
return stock < qty ? Result<Order>.Fail("สต็อกไม่พอ", "OUT_OF_STOCK") : Result<Order>.Ok(order);

// endpoint — one code → status mapping for the whole system, then emit ProblemDetails
return r.IsSuccess ? Results.Ok(r.Value) : Results.Problem(r.Error, statusCode: r.Code switch { "NOT_FOUND" => 404, "OUT_OF_STOCK" => 409, _ => 400 });
```

## Value type with private constructor (Thai national ID)

```csharp
// Thai national ID: 13 digits + check digit · money in satang (long), never double
public readonly record struct ThaiNationalId
{
    public string Value { get; }
    private ThaiNationalId(string v) => Value = v;
    public static ThaiNationalId? Create(string s)
    {
        if (s.Length != 13 || !s.All(char.IsAsciiDigit)) return null;
        var sum = s.Take(12).Select((c, i) => (c - '0') * (13 - i)).Sum();
        return (11 - sum % 11) % 10 == s[12] - '0' ? new ThaiNationalId(s) : null;
    }
}
```
(This C# example has not been compiled · the check-digit formula is the same as in the TypeScript example that has been run)


---

# skill: stack-typescript

Use when writing or reviewing TypeScript code

# stack-typescript — TypeScript the team can read easily and that is hard to break

> **One rule:** let the compiler catch bugs instead of people. `tsc` passing with 0 errors does not mean done, but failing means not started.

## Use when
- Writing or reviewing TypeScript in a Node backend (Express · Fastify · NestJS), Angular, or React/Vite code.

Not for: least code → `code-craft` · names and layout → `code-craft` · types and data shape before writing → `code-craft` · browser tests → `test-automation` · screens and tokens → `web-app-design`

## Steps
1. Look at the repo before the first command. Use the package manager its lockfile shows (`package-lock.json` · `pnpm-lock.yaml` · `yarn.lock`), never 2 lockfiles. Follow `.nvmrc` or `engines` for Node; if absent use the latest Long Term Support (LTS), re-checking https://nodejs.org/en/about/previous-releases first (dated notes: `references/sources.md`). Follow the existing module system (`"type"` · `tsconfig` `module`), never mix ESM and CJS. Use an existing `package.json` script before guessing a command.
2. Install and verify with the repo's commands: `npm ci` (pnpm `install --frozen-lockfile` · yarn `install --immutable`) · `npx tsc --noEmit` · `npm run lint && npm test && npm run build 2>&1 | tail -40` · one test: `npx vitest run <file> -t "<name>"`. Angular: `ng test --include=...` and check the bundle size at the end of `ng build`. `npm install <pkg>` changes the lockfile, so commit it in the same round.
3. Write strict TypeScript. Instead of `any` use `unknown` then narrow (`typeof` · `in` · a type guard). Instead of `value!` to silence an error, check `if (!value) throw …` or fix the source type. Instead of `as Order` on outside data, parse with zod (or the repo's library). Instead of several booleans for a state, use a discriminated union. Instead of `const x: Config = {...}` that loses the literal, use `satisfies Config`.
4. Set `tsconfig` `"strict": true` · `noUncheckedIndexedAccess` · `noImplicitOverride`. If an old repo has strict off, turn it on one folder at a time, not for the whole repo in one task. For `enum` vs string union follow the repo; a new repo uses `as const` + union. Keep API types shared by frontend and backend in one place.
5. For types standing for a national ID number, an amount of money or a document number, apply 4 checks: hide the internals (one `parse` function creates values) · put the rules in the type (a rule-breaking value cannot be created) · validate once at the entrance · expose nothing mutable (`readonly` fields, never return an internal array). Examples: `references/examples.md`.
6. Node backend: turn on `@typescript-eslint/no-floating-promises` and `no-misused-promises`; every `async` is `await`ed or has a `.catch` that does something real. Express 4 does not forward `async` handler errors: use Express 5 or wrap (Fastify and NestJS handle it). Parse `process.env` with a schema once at startup and refuse to start on a bad value (`web-service-essentials`). Shut down cleanly: on `SIGTERM` stop accepting requests → wait for pending → close the DB pool, with a force-exit timer (code in `references/examples.md`). Use `stream.pipeline` for large files, never `readFile` them whole. No `fs.*Sync` · heavy `crypto.*Sync` · big loops in a request path. Use parameterized queries (`$1` · `?`) or an ORM, never string-concatenated SQL. Use structured logs per `errors-and-logs`, no `console.log` in a server.
7. Angular: standalone components · `inject()` · `signal`/`computed`/`input()`/`output()` · `OnPush` · `@if`/`@for (x of xs; track x.id)` · lazy routes · `async` pipe/`toSignal`/`takeUntilDestroyed()`. No new NgModule, no `*ngIf`/`*ngFor`, no `BehaviorSubject` state inside a component, no `subscribe` without unsubscribing. Keep logic in `computed`, never call a heavy function in a binding. Never use `DomSanitizer.bypassSecurityTrust*` on user data (if truly needed, comment why it is safe). In an old repo (v14–19) follow its style and do not migrate inside a feature task; propose migration separately. Full table, React/Vite notes and v22 facts: `references/angular.md`. For speed work on a React or Next.js repo read Vercel `react-best-practices` live (link in `references/angular.md`); on a conflict with step 3, follow this skill.
8. Avoid the common traps (time zone: store ISO 8601 UTC · money: integer satang · `===` · no shared-object mutation · cancel subscriptions · narrow imports · `Intl.Collator('th')` for Thai sorting · schema-parse `JSON.parse` at the edge): `references/traps.md`.
9. Test with the framework the repo has (Vitest and Angular examples: [`test-automation/references/per-stack.md`](../test-automation/references/per-stack.md#node--typescript--vitest)). HTTP API: `supertest` (Express · NestJS) or `fastify.inject()`, no real port. Angular v21+ CLI uses Vitest, not Karma. For new logic or a bug fix, write a red test first, then fix to green. A snapshot alone is not a test; assert the values that matter. Read a signal directly (`component.unpaid()`); skip `fakeAsync` if nothing is really async.
10. Security: before installing a new package check spelling (typosquat) · download count · maintainer · latest release date, and for an internal scope set the registry in `.npmrc`. Run `npm audit --omit=dev`; commit the lockfile and use `npm ci` in CI. Never use `innerHTML` · `[innerHTML]` · `dangerouslySetInnerHTML` with user data. Cookie login sets `HttpOnly` · `Secure` · `SameSite` and guards against Cross-Site Request Forgery (CSRF: token or `withXsrfConfiguration`). Cross-Origin Resource Sharing (CORS): list origins one by one, never `*` with `credentials`. No secrets in the frontend (`environment.ts` and `VITE_*` are readable by everyone). Security headers: `helmet` · `@fastify/helmet`.

## Check before done
- `tsc --noEmit` 0 errors · lint 0 warnings in the changed files
- The whole test suite passes, and new behaviour has a test that was red before the fix
- No `any` · `as` on external data · new `!` in the diff
- No floating promise and no subscription left uncancelled
- Frontend: bundle size compared before and after; if it grew more than 20 KB (gzip), give the reason in the report
- If the lockfile changed, the new packages were checked per step 10

## References
- [`references/examples.md`](references/examples.md) — open for zod/union code, the branded ID type and the shutdown handler
- [`references/angular.md`](references/angular.md) — open for an Angular or React/Vite task (full do/do-not table, v22 facts)
- [`references/traps.md`](references/traps.md) — open when touching dates, money, equality, shared state, imports or sorting
- [`references/sources.md`](references/sources.md) — dated sources (Node LTS status to re-check)
- Also: `security-gate` · `errors-and-logs` · `i18n-and-locale` (Thai dates, Buddhist Era)


## reference: angular.md

# Angular and React notes · stack-typescript

Open when the repo is Angular (or React/Vite/Next.js) and you write or review components, state, forms, HTTP or routes.

The latest is v22 (released 3 Jun 2026 · source: https://angular.dev/reference/releases · checked 22 Oct 2026): new apps are zoneless and `OnPush` is the default, and Signal Forms are production-ready (these last 3 points (รอยืนยัน) — the source page does not state them; check the v22 release notes before citing).

| Topic | Do this | Do not |
|---|---|---|
| component | standalone · `inject()` | create a new NgModule |
| state | `signal` · `computed` · `input()` · `output()` | `BehaviorSubject` for state inside a component |
| change detection | `OnPush` (default in v22) | `Default`/`Eager` without a reason |
| template | `@if` · `@for (x of xs; track x.id)` · `@switch` | `*ngIf` · `*ngFor` (deprecated since v20) |
| form | Signal Forms (v22); an existing repo uses typed reactive forms | `UntypedFormGroup` |
| HTTP | `HttpClient` + functional interceptor (`withInterceptors`) | add the token header one place at a time |
| subscription | `async` pipe · `toSignal` · `takeUntilDestroyed()` | `subscribe` and never unsubscribe |
| route | lazy `loadComponent` · `loadChildren` | import every page in the root route |

- Move logic out of templates into `computed` so a template only displays, and never call a heavy function in a binding.
- Never use `DomSanitizer.bypassSecurityTrust*` on data sent by users. If it is truly needed, comment why it is safe.
- **Old repo (v14–19)**: write in the style the repo already uses, use new features only where that version supports them, and do not migrate the whole repo inside a feature task. If you want to migrate, propose it as a separate task, then use `ng generate @angular/core:control-flow` and Angular's other schematics.
- React or Vite: keep state in the component first · `useEffect` needs a cleanup · list keys are ids, not indexes · client-side env may use only `VITE_*`, and treat it as visible to everyone.
- For a React or Next.js repo where speed must be chased (repeated renders · bundle · waterfall data fetching), pull the rules from Vercel `react-best-practices` and read them live while working: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices — a link only, no rules copied here, because that repo's licence has not been checked (checked 23 Oct 2026) · a rule that conflicts with item 2 of this skill (strict TS): follow ours.

```ts
export class OrderList {
  private orders = toSignal(inject(OrderApi).list(), { initialValue: [] });
  readonly unpaid = computed(() => this.orders().filter(o => o.status === 'unpaid'));
}
// <ul>@for (o of unpaid(); track o.id) { <li>{{ o.id }}</li> } @empty { <li>ไม่มีรายการค้างจ่าย</li> }</ul>
```


## reference: examples.md

# Code examples and new-type checks · stack-typescript

Open when writing a zod parse, a discriminated union, a branded type for IDs or money, or the graceful-shutdown handler.

## Parse and union

```ts
const Order = z.object({ id: z.uuid(), totalSatang: z.number().int().nonnegative() });
type Order = z.infer<typeof Order>;

type PayResult =
  | { status: 'paid'; receiptId: string }
  | { status: 'failed'; reason: 'declined' | 'timeout' };
// switch (r.status) ครบทุกกรณี · default: const _never: never = r;
```

**4 new-type checks** (idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10). Apply them to types that stand for a national ID number, an amount of money, a document number:

1. **Hide the internals** — users of the type create a value in only one way (a `parse` function) and never edit fields directly.
2. **The rules live in the type** — a value that breaks the rules cannot be created; the rules are not written only in a document.
3. **Check at the entrance** — validate once at creation, and then the whole system can trust the type.
4. **Expose nothing mutable** — `readonly` on every field, and never return an internal array for others to change.

```ts
type ThaiNationalId = string & { readonly __brand: 'ThaiNationalId' };  // 13 หลัก + ตรวจเลขท้าย
const checkDigit = (d: string) => (11 - (d.slice(0, 12).split('').reduce((s, c, i) => s + Number(c) * (13 - i), 0) % 11)) % 10;
const parseNationalId = (s: string): ThaiNationalId | null =>
  /^\d{13}$/.test(s) && checkDigit(s) === Number(s[12]) ? (s as ThaiNationalId) : null;
// จำนวนเงินเก็บเป็นสตางค์ (number เต็ม) ไม่ใช้ float · ตัวอย่างเลข 1234567890121 สร้างขึ้นเอง ไม่ใช่เลขของใคร
```

## Graceful shutdown

```ts
const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(async () => { await db.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
});
```


## reference: sources.md

# Sources · stack-typescript

- Node LTS · https://nodejs.org/en/about/previous-releases · last checked 2026-10-14: LTS is 24 and 22 · 26 is still Current, so do not use it in production until this page lists it as LTS · the next one to expire is 22 (2027-04-30 (รอยืนยัน)) · re-check this page before use · Node 26 will probably become LTS in late Oct 2026 (รอยืนยัน); re-check this line right after that date
- Angular releases · https://angular.dev/reference/releases · checked 22 Oct 2026 (v22 released 3 Jun 2026)
- 4 new-type checks · idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10
- Vercel react-best-practices · https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices · licence not checked (checked 23 Oct 2026) · link only, no rules copied


## reference: traps.md

# Common traps · stack-typescript

Open when the code touches dates and time zones, money, equality, shared objects, subscriptions, large imports, sorting Thai names or JSON parsing.

| Trap | Symptom | Do this |
|---|---|---|
| time and time zone | the date goes back 1 day between 00:00–06:59 Thai time | store and send ISO 8601 in UTC, then display with `Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok' })`; for the Buddhist Era year see `i18n-and-locale` |
| money | `0.1 + 0.2 !== 0.3` | store as satang (integer); for tax or currency conversion use the decimal library the repo uses |
| `==` | `'0' == false` is true | always use `===` and turn on eslint `eqeqeq` |
| mutating a shared object | values change by themselves across pages | create a new one with spread · `structuredClone` · `readonly` in the type |
| memory leak | RAM keeps growing | cancel subscriptions · `removeEventListener` · `clearInterval`, and caches need a cap |
| big imports | bundle bloats by hundreds of KB | `import { debounce } from 'lodash-es'`, not all of lodash, and check the bundle after the build |
| sorting Thai names | leading vowels sort wrong | use `new Intl.Collator('th').compare`, not bare `localeCompare` |
| `JSON.parse` without checks | crash deep in the code | parse with a schema at the system edge (item 2) |
