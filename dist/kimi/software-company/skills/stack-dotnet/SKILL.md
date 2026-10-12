---
name: stack-dotnet
description: Use when writing, reviewing or fixing C# and .NET (ASP.NET Core, MVC 5, EF Core). Build and test commands, EF queries, async traps, Thai culture.
---

# stack-dotnet — เขียน C# ให้ build สะอาด test ผ่าน ไม่มีกับดักเดิม

ใช้เมื่องานแตะโค้ด C# ทุกแบบ: ASP.NET Core (Web API · MVC · minimal API) · Entity Framework (EF) Core · ASP.NET MVC 5 บน .NET Framework 4.x ที่ยังดูแลอยู่

ไฟล์นี้มีแค่เรื่องเฉพาะ .NET ส่วนหลักทั่วไปอยู่ที่ `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns` · `database-design` · `principle-secure-by-default`

---

## 1 · เริ่มงาน: อ่านเวอร์ชันก่อน แล้วรันคำสั่งชุดเดียวกันทุกครั้ง

- เวอร์ชัน SDK ดูที่ `global.json` ส่วนเวอร์ชันที่ target ดูที่ `<TargetFramework>` ใน `*.csproj` หรือ `Directory.Build.props`
- `net10.0` คือ Long Term Support (LTS) ล่าสุด รองรับถึง พ.ย. 2028 ส่วน `net8.0` และ `net9.0` หมดอายุ 10 พ.ย. 2026 ถ้าเจอในงานใหม่ให้แจ้งเจ้าของ ไม่อัปเกรดเองกลางงาน
- ถ้าเจอ `net48` หรือ `v4.x` ใน `<TargetFrameworkVersion>` แปลว่าเป็น .NET Framework ให้ใช้ชุดคำสั่ง legacy ด้านล่าง

| ขั้น | .NET (Core) 8+ | .NET Framework 4.x (Windows) |
|---|---|---|
| ดึงแพ็กเกจ | `dotnet restore` | `msbuild App.sln -t:restore` หรือ `nuget restore App.sln` |
| build | `dotnet build -warnaserror` (หรือตามนโยบาย repo) | `msbuild App.sln -p:Configuration=Release` |
| test ทั้งหมด | `dotnet test` | `vstest.console.exe Tests\bin\Release\App.Tests.dll` |
| จัดรูปแบบ | `dotnet format --verify-no-changes` | ตาม `.editorconfig` ใน Visual Studio |

รัน test ตัวเดียว:

```bash
dotnet test --filter "FullyQualifiedName~OrderServiceTests.Cancel"   # VSTest (ค่าเริ่ม)
dotnet test --filter-method "*Cancel_*"                               # xUnit v3 บน Microsoft Testing Platform (MTP)
vstest.console.exe App.Tests.dll /TestCaseFilter:"FullyQualifiedName~Cancel"   # .NET Framework
```

- ถ้า repo ตั้ง MTP ไว้ใน `global.json` (`"test": { "runner": "Microsoft.Testing.Platform" }`) ให้ใช้ `--filter-*` แบบบรรทัดที่ 2
- `msbuild` และ `vstest.console.exe` อยู่ใน Visual Studio หรือ Build Tools ให้เปิดผ่าน Developer PowerShell ส่วนเครื่อง Linux build .NET Framework web project ไม่ได้ จึงต้องบอกตรง ๆ ว่ายังไม่ได้ build

## 2 · โครงและแบบแผน

ตั้งค่าครั้งเดียวที่ `Directory.Build.props` ให้ทุกโปรเจกต์ใน solution:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

- ถ้า repo เก่ามี warning เป็นร้อย อย่าเปิด `TreatWarningsAsErrors` ทั้ง solution ในงานเดียว ให้เปิดเฉพาะโปรเจกต์ใหม่ และไม่เพิ่ม warning ใหม่
- จัดโฟลเดอร์ตาม feature (`Features/Orders/...`) ตาม `readable-code` แต่ถ้า repo ใช้ `Controllers/ Services/` อยู่แล้ว ให้ตามของเดิม
- ใช้ file-scoped namespace (`namespace App.Orders;`) ให้ Data Transfer Object (DTO) เป็น `record` และห้ามคืน entity ของ EF ออก API ตรง ๆ
- async ตลอดสาย: method ที่รอ I/O รับ `CancellationToken ct` แล้วส่งต่อทุกชั้นจนถึง EF และ `HttpClient`
- จะใช้ minimal API หรือ controller ให้ตามแบบที่ repo ใช้อยู่ ไม่ผสมใน feature เดียวกัน

อายุของ service ใน Dependency Injection (DI):

| lifetime | ใช้กับ | ห้าม |
|---|---|---|
| Singleton | ของไม่มี state · cache · `TimeProvider` | รับ Scoped ใน constructor (`DbContext` จะค้างข้าม request) |
| Scoped | `DbContext` · service ที่ใช้ข้อมูลของ request | เรียกจาก `BackgroundService` ตรง ๆ (ให้ใช้ `IServiceScopeFactory.CreateScope()` แทน) |
| Transient | ของเบา ไม่มี state | ถือ resource ที่ต้อง dispose แล้วฝากไว้ใน singleton |

ค่า config ใช้ options pattern และตรวจตอนเริ่มแอป:

```csharp
builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration("Smtp")
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

## 3 · EF Core

| เรื่อง | ทำแบบนี้ |
|---|---|
| อ่านอย่างเดียว | `AsNoTracking()` · ดึงเฉพาะคอลัมน์ที่ใช้ด้วย `Select(o => new OrderDto(...))` |
| N+1 | ห้ามวนลูปแล้ว query ในลูป ให้ใช้ `Include` หรือ projection ถ้า `Include` หลาย collection ให้เติม `AsSplitQuery()` |
| แก้หรือลบหลายแถว | ใช้ `ExecuteUpdateAsync` / `ExecuteDeleteAsync` ไม่โหลดมาแก้ทีละตัว แต่คำสั่งนี้ข้าม change tracker |
| migration | อ่าน SQL ทุกครั้ง: `dotnet ef migrations script --idempotent -o migrate.sql` |
| production | ห้าม `EnsureCreated()` และห้าม `Database.Migrate()` ตอนแอปเริ่มหลาย instance พร้อมกัน ให้รันสคริปต์ตอน deploy แทน |
| แก้พร้อมกัน | ใช้ `[Timestamp] byte[] RowVersion` (SQL Server) หรือ `IsConcurrencyToken()` แล้วจับ `DbUpdateConcurrencyException` เพื่อบอกผู้ใช้ |
| เวลา | เก็บ UTC เสมอ และ PostgreSQL (Npgsql) บังคับ `DateTimeKind.Utc` สำหรับ `timestamptz` |

ดู SQL ที่ EF สร้างจริงก่อนส่งงาน:

```csharp
var sql = db.Orders.Where(o => o.Status == Status.Open).ToQueryString();
// หรือใน Development
options.LogTo(Console.WriteLine, LogLevel.Information).EnableSensitiveDataLogging();
```

`EnableSensitiveDataLogging` ใช้ในเครื่อง dev เท่านั้น ส่วน schema และ index ให้ทำตาม `database-design`

## 4 · กับดักที่เจอบ่อย

| กับดัก | ผลที่เกิด | ทำแบบนี้แทน |
|---|---|---|
| `async void` | exception ทำ process ล่ม จับไม่ได้ | ใช้ `async Task` ยกเว้น event handler ของ UI |
| `.Result` · `.Wait()` · `GetAwaiter().GetResult()` | MVC 5 ค้างตาย (deadlock) · Core กิน thread จนแอปช้า | ใช้ `async Task<ActionResult>` ตลอดสาย ส่วน library ใช้ `ConfigureAwait(false)` |
| `new HttpClient()` ทุกครั้ง | socket หมด และ DNS ไม่อัปเดต | ใช้ `IHttpClientFactory` หรือ typed client ส่วน .NET Framework ใช้ `static readonly HttpClient` |
| ลืม dispose | connection และไฟล์ค้าง | `using var` · `await using` สำหรับ `IAsyncDisposable` |
| ต่อ string เป็น SQL | SQL injection | LINQ · `FromSql($"...{id}")` (ใส่พารามิเตอร์ให้) · Dapper ส่ง `new { id }` · ห้าม `FromSqlRaw` กับข้อความที่ต่อเอง |
| parse หรือ format ด้วย culture ของเครื่อง | เครื่อง `th-TH` ใช้ปฏิทินพุทธ ปีจึงออกมาเป็น 2569 และ parse "2026-01-05" แล้วได้ปีผิด 543 ปี | เก็บและ parse ด้วย `CultureInfo.InvariantCulture` · แสดงผลพุทธศักราชเฉพาะตอนแสดงผล ตาม `i18n-and-locale` |
| เงินเป็น `double` | 0.1 + 0.2 ≠ 0.3 | ใช้ `decimal` และระบุคอลัมน์เป็น `decimal(18,2)` ให้ชัด |
| `DateTime.Now` | test ไม่ได้ และเวลาเพี้ยนตาม server | ใช้ `TimeProvider` ผ่าน DI และ `FakeTimeProvider` ใน test |
| เวลาไทย | server อยู่ UTC | `TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok")` ส่วน .NET Framework บน Windows ใช้ `"SE Asia Standard Time"` |
| array หรือ string ใหญ่ ≥ 85,000 bytes | ลง Large Object Heap (LOH) ทำให้ GC หนัก | stream ข้อมูล · `ArrayPool<T>` · `IAsyncEnumerable<T>` สำหรับรายการยาว |
| `$"..."` ใน log | ค้นตาม field ไม่ได้ และสร้าง string แม้ระดับ log ปิด | message template: `log.LogInformation("Order {OrderId} paid", id)` ส่วน format อื่นดู `logging-standards` |

จะจับ exception ที่ไหนและ retry อย่างไร ดู `error-handling-patterns` ส่วน ASP.NET Core ใช้ `IExceptionHandler` + `AddProblemDetails()` ที่จุดเดียว

## 5 · test

- ใช้ framework ที่ repo มีอยู่ ถ้าเป็นโปรเจกต์ใหม่ให้ใช้ xUnit (v3 สำหรับ .NET 8+) ตาม `testing-standards`
- FluentAssertions ตั้งแต่ v8 ต้องซื้อ license ถ้าใช้เชิงพาณิชย์ ส่วน v7 ยังฟรี (Apache 2.0) โปรเจกต์ใหม่ให้ใช้ assert ของ xUnit หรือ AwesomeAssertions (fork ฟรี) ถ้า repo ใช้ v8 อยู่แล้วให้ถามเจ้าของเรื่อง license
- ชื่อ test: `Method_Condition_Result` เช่น `Cancel_WhenAlreadyShipped_Throws`
- ถ้าเป็น logic ใหม่หรือ bug ให้เขียน test ที่แดงก่อน แล้วค่อยแก้ให้เขียว และ bug ต้องมี test ที่จำลองอาการจริง
- test API ทั้งเส้นใช้ `WebApplicationFactory<Program>` ถ้า test มองไม่เห็น `Program` ให้เพิ่ม `public partial class Program;`
- ฐานข้อมูลจริงใช้ Testcontainers (`Testcontainers.MsSql` · `Testcontainers.PostgreSql`) ห้ามใช้ EF InMemory แทนฐานจริง เพราะไม่ตรวจ constraint และแปล SQL ต่างกัน

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Get_WhenNotLoggedIn_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/orders", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }
}
```

## 6 · ความปลอดภัยเฉพาะ .NET

| เรื่อง | ASP.NET Core | MVC 5 (.NET Framework) |
|---|---|---|
| Cross-Site Request Forgery (CSRF) | MVC ใส่ `AutoValidateAntiforgeryToken` เป็น global filter ส่วน Razor Pages ตรวจให้เอง | `@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]` ทุก POST |
| ต้อง login เป็นค่าเริ่ม | ตั้ง `FallbackPolicy` เป็น `RequireAuthenticatedUser()` แล้วใส่ `[AllowAnonymous]` ทีละจุดในหน้าที่เปิดให้ทุกคน | `GlobalFilters.Filters.Add(new AuthorizeAttribute())` |
| ส่งฟิลด์เกิน (over-posting) | bind เข้า DTO ที่มีเฉพาะฟิลด์ที่แก้ได้ | ใช้ view model แยก ไม่ bind entity ตรง ๆ |
| แสดงผล | Razor encode ให้ แต่ห้ามใช้ `Html.Raw` กับข้อมูลผู้ใช้ | เหมือนกัน และระวัง `MvcHtmlString` |
| Data Protection keys | ถ้ามีหลาย instance หรือ container ให้เก็บ key ไว้ที่เดียวกัน (`PersistKeysToDbContext` หรือ file share) ไม่งั้น cookie หลุดทุกครั้งที่ restart | `machineKey` ใน `web.config` เหมือนกันทุกเครื่อง |
| secret | dev: `dotnet user-secrets set "Db:Password" "..."` · prod: environment variable หรือ secret store | แยก transform ของ `web.config` และไม่ commit ค่าจริง |

- `appsettings.json` และ `web.config` ที่ commit ห้ามมีรหัสผ่าน connection string จริง หรือ API key ส่วนเรื่องการเก็บ secret ดู `config-and-secrets`
- เรื่องตรวจ input · upload · การเข้ารหัส ดู `principle-secure-by-default`

## 7 · ตรวจก่อนส่ง

- [ ] `dotnet build -warnaserror` ได้ 0 warning (หรือไม่เพิ่ม warning จากเดิมใน repo เก่า)
- [ ] `dotnet test` ผ่านหมด และรายงานว่าผ่านกี่ตัวจากกี่ตัว
- [ ] `dotnet format --verify-no-changes` ไม่มีอะไรต้องแก้
- [ ] พฤติกรรมใหม่มี test ที่เคยแดงก่อนแก้
- [ ] ไม่มี `.Result` · `.Wait()` · `async void` ใหม่: `grep -rnE "\.Result\b|\.Wait\(\)|async void" --include=*.cs`
- [ ] query ที่แก้ ดู SQL จริงแล้ว ไม่มี N+1
- [ ] migration มีสคริปต์ `--idempotent` และอ่านแล้ว ไม่มี `DROP` ที่ไม่ได้ตั้งใจ
- [ ] ถ้า build .NET Framework บนเครื่องไม่ได้ ให้เขียนในรายงานว่ายังไม่ได้ build ไม่บอกว่าผ่าน

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| ทำให้น้อยที่สุดที่ยังใช้ได้ | `lazy-coding` |
| ชื่อ · โครงไฟล์ · comment | `readable-code` |
| ระดับ test · coverage · test ที่แดงสลับเขียว | `testing-standards` |
| รูปแบบ log · Serilog | `logging-standards` |
| จับ exception · retry · timeout | `error-handling-patterns` |
| ตาราง · index · migration แบบ expand-and-contract | `database-design` |
| ค่าเริ่มที่ปลอดภัย | `principle-secure-by-default` |
| connection string · secret store | `config-and-secrets` |
| วันที่ไทย · พุทธศักราช · เรียงภาษาไทย | `i18n-and-locale` |
| URL · error format ของ API | `api-conventions` |
| พิสูจน์ว่าใช้ได้จริงก่อนบอกว่าเสร็จ | `principle-prove-it-works` |
