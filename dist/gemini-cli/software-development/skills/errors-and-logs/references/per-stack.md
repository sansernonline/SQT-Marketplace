# Set up the logger to produce the same format — .NET and Angular

> Warning: the code in this file is **not yet compiled or tested** (unlike `assets/logger.node.js` and
> `assets/logger_py.py`, which have really been run). It uses the standard setup of each library.
> At the first build, compare the output lines with the format in `logging-standards.md` item 1.

---

## Contents

1. [.NET / C# — Serilog](#net--c--serilog)
2. [Angular / frontend](#angular--frontend)
3. [Comparison table](#comparison-table)

---

## .NET / C# — Serilog

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

`appsettings.json` — keeps the settings outside the code, so you can change the log level without a new build:

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
    "[{CorrelationId}] {SourceContext}  {Message:lj}  {Context:l}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("CorrelationId", "--------") // default when there is no request (8 characters)
    .Enrich.WithProperty("Context", "")              // empty when there is no context k=v
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

> `{Level:u5}` means upper case, 5 characters wide, which gives `INFO ` `WARN ` `ERROR` to match the other stacks.
> `{Message:lj}` and `{Context:l}` mean the string is not wrapped in an extra layer of `"`.

### Middleware correlation id

```csharp
using System.Text.RegularExpressions;

public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string Header = "X-Request-Id";
    // accept from the customer only letters, digits, and - up to 36 characters — blocks people stuffing long text or \n into the log
 into the log
    private static readonly Regex Valid = new("^[A-Za-z0-9-]{1,36}$", RegexOptions.Compiled);

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[Header].FirstOrDefault();
        if (cid is null || !Valid.IsMatch(cid))
            cid = Guid.NewGuid().ToString("N")[..8];   // missing or invalid → create a new one

        var logCid = cid.Length > 8 ? cid[..8] : cid;   // the log uses the first 8 characters to fit the cid column (same as Node/Python) — the header returns the full value

        ctx.Response.Headers[Header] = cid;          // return it so the customer can quote it

        // LogContext is tied only to this request's async flow — it does not mix with other requests
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", logCid))
            await next(ctx);
    }
}
```

### Writing logs

```csharp
// Right: fixed message + values go in {Context} as k=v, per the format in `logging-standards.md` item 1
//    Output: ... INFO   [a3f9c1b2] Orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 ms=134
using (Serilog.Context.LogContext.PushProperty("Context", $"orderId={orderId} ms={sw.ElapsedMilliseconds}"))
    _logger.LogInformation("สร้างคำสั่งซื้อสำเร็จ");

// Wrong: a variable embedded in the string — every line becomes a different message and cannot be grouped
_logger.LogInformation($"สร้างคำสั่งซื้อ {orderId} สำเร็จ");
```

### Redacting secrets

Serilog does not redact secrets automatically. The surest way is to **never pass a whole object into the log**.
Pick only the fields you need. If you must pass the whole object, write an `IDestructuringPolicy`
or add `[NotLogged]` through `Destructure.ByTransforming<T>()`.

---

## Angular / frontend

The principle differs from the backend: **a browser cannot write files**, so important logs must be sent up to the backend.

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
    // dev: print to the console for chasing problems — prod: silent, except WARN and above, which go to the server
    if (isDevMode()) console[level === 'ERROR' ? 'error' : 'log'](level, message, ctx);
    if (level === 'DEBUG' || (!isDevMode() && level === 'INFO')) return;   // prod sends only WARN and above

    this.buffer.push({ ts: new Date().toISOString(), level, message, ctx });
    if (this.buffer.length >= 10 || level === 'ERROR') this.flush();
  }

  /** Send in batches, not line by line — otherwise the network tab fills with the log's own requests */
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

Catch every uncaught error:

```ts
// core/global-error.handler.ts
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { LoggerService } from './logger.service';

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

Send a correlation id with every request so client-side and server-side logs connect:

```ts
// core/correlation.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const correlationInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID().slice(0, 8) } }));
```

**On the backend** you need an endpoint `POST /api/client-logs` that:
- Limits the body size and applies a rate limit. Otherwise it becomes a hole for people to flood you with logs.
- Writes to a separate file `logs/client-YYYYMMDD.log`
- **Treats the content as untrusted data**, so strip `\r\n` from every value just like a normal log

---

## Comparison table

| Topic | .NET | Node | Python | Angular |
|---|---|---|---|---|
| Library | Serilog | winston | stdlib `logging` | Hand-written (thin) |
| File rotation | `rollingInterval: Day` | `winston-daily-rotate-file` | `TimedRotatingFileHandler` | — (sent to the backend) |
| correlation | `LogContext.PushProperty` | `AsyncLocalStorage` + `child()` | `ContextVar` | header `X-Request-Id` |
| Level | `LogEventLevel` | `level` | `setLevel` | Its own enum |
| External configuration | `appsettings.json` | env `LOG_LEVEL` | env `LOG_LEVEL` | `isDevMode()` |
