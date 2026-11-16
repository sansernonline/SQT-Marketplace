---
name: stack-dotnet
description: Use when writing or fixing C# and .NET code
---

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
- Organise folders by feature (`Features/Orders/...`) per `readable-code`, but if the repo already uses `Controllers/ Services/`, follow the existing layout.
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
| `$"..."` in a log call | Cannot search by field, and builds the string even when the log level is off | Message template: `log.LogInformation("Order {OrderId} paid", id)`; for other formats see `logging-standards` |

For where to catch exceptions and how to retry, see `error-handling-patterns`. In ASP.NET Core, use `IExceptionHandler` + `AddProblemDetails()` in one place.

## 5 · Tests

- Use the framework the repo already has. For a new project use xUnit (v3 for .NET 8+), per `testing-standards`.
- FluentAssertions from v8 onward needs a paid licence for commercial use, while v7 is still free (Apache 2.0). In a new project use xUnit's asserts or AwesomeAssertions (a free fork). If the repo already uses v8, ask the owner about the licence.
- Test names: `Method_Condition_Result`, for example `Cancel_WhenAlreadyShipped_Throws`
- For new logic or a bug, write a failing test first, then fix it until green, and a bug needs a test that reproduces the real symptom.
- Test a whole API path with `WebApplicationFactory<Program>`. If the test cannot see `Program`, add `public partial class Program;`.
- For a real database use Testcontainers (`Testcontainers.MsSql` · `Testcontainers.PostgreSql`). Never use EF InMemory in place of a real database, because it does not check constraints and translates SQL differently.

For the full xUnit setup and a `WebApplicationFactory` example, see [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#net--xunit)

## 6 · .NET-specific security

| Topic | ASP.NET Core | MVC 5 (.NET Framework) |
|---|---|---|
| Cross-Site Request Forgery (CSRF) | For MVC add `AutoValidateAntiforgeryToken` as a global filter; Razor Pages check it themselves | `@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]` on every POST |
| Login required by default | Set `FallbackPolicy` to `RequireAuthenticatedUser()`, then add `[AllowAnonymous]` one place at a time on pages open to everyone | `GlobalFilters.Filters.Add(new AuthorizeAttribute())` |
| Extra fields posted (over-posting) | Bind into a DTO that holds only the editable fields | Use a separate view model, never bind the entity directly |
| Output | Razor encodes for you, but never use `Html.Raw` on user data | The same, and beware `MvcHtmlString` |
| Data Protection keys | With several instances or containers, keep the keys in one shared place (`PersistKeysToDbContext` or a file share), or cookies break on every restart | The same `machineKey` in `web.config` on every machine |
| secret | dev: `dotnet user-secrets set "Db:Password" "..."` · prod: environment variable or secret store | Keep a separate `web.config` transform and never commit real values |

- A committed `appsettings.json` or `web.config` must not hold passwords, real connection strings or API keys. For storing secrets, see `config-and-secrets`.
- For input validation · uploads · encryption, see `principle-secure-by-default`.

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
