<!-- merged from skill `logging-standards` on 2026-11-27 · description was: Use when writing or reviewing code that logs -->
# Logging Standards

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Line format — the same in every language](#1--line-format--the-same-in-every-language)
- [2 · Log levels — write them to match their meaning](#2--log-levels--write-them-to-match-their-meaning)
- [3 · Correlation id — what makes logs usable](#3--correlation-id--what-makes-logs-usable)
- [4 · Log files](#4--log-files)
- [5 · What must never go into a log](#5--what-must-never-go-into-a-log)
- [6 · Ready-to-use code](#6--ready-to-use-code)
- [7 · Checking the work](#7--checking-the-work)
- [8 · Anti-patterns not covered above](#8--anti-patterns-not-covered-above)
- [9 · Links to other skills](#9--links-to-other-skills)

> **The one rule:** Logs exist for a person to read at 3 a.m. when the system is down, not while writing the code.
> If a line does not help answer "what happened, to whom, and when", do not write it.

## When to use this skill

- Starting any new project (service, API, worker, batch, desktop, frontend)
- Someone asks for "a log file", or asks about log format and levels
- You are chasing a production problem and find that the existing logs are unusable

## When **not** to use it

- You need metrics or tracing (Prometheus, OpenTelemetry). That is a different topic from logs, so use `incidents-and-monitoring`.
- You are building a service health endpoint. Use `web-service-essentials`.

---

## 1 · Line format — the same in every language

```
2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1b2] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 userId=57 ms=134
└───────── time + timezone ─────────┘ └level┘  └ cid ┘ └source┘ └─ message ─┘  └──── context k=v ────┘
```

| Part | Rule |
|---|---|
| time | `YYYY-MM-DD HH:mm:ss.SSS ±HH:MM` — **the timezone is required**, or you cannot compare logs across machines |
| level | Left-aligned, 5 characters wide (`INFO ` `WARN ` `ERROR` `DEBUG` `FATAL`), so the columns line up |
| cid | An 8-character correlation id in square brackets. If there is none, use `[--------]` (also 8 characters, so the columns line up) |
| source | The module or class that writes the log, not the file name |
| message | One sentence, with no variables embedded in the string |
| context | `key=value` separated by spaces. If a value contains a space, wrap it in `"` |

**Why not JSON:** This file is mainly for people to open and `grep`. This format still works with `grep "\[a3f9c1b2\]"` or `awk`, but the eye reads it at once without any tool.
When you must ship logs to a central system such as Grafana Loki or Elasticsearch, Logstash, Kibana (ELK), add one more JSON sink (the destination logs are sent to). But **do not drop the text file**.

**1 event = 1 line**, except a stack trace, which follows indented by 4 spaces.

---

## 2 · Log levels — write them to match their meaning

| Level | Use when | Example |
|---|---|---|
| `FATAL` | The app is about to die and cannot continue | Cannot connect to the DB at start |
| `ERROR` | This job failed **and someone must look** | Saving an order failed |
| `WARN` | Abnormal, but the system can continue | Retry number 2, disk down to 10% |
| `INFO` | An important business event | Order created, user logged in, job started/finished |
| `DEBUG` | Details for chasing problems — **off in production** | Values computed along the way |
| `TRACE` | Step-by-step detail — turn on only when really chasing | Raw payload |

> Warning: **an `ERROR` that nobody needs to act on is a `WARN`.** If ERROR fires every minute until people stop looking,
> you have just destroyed your own alarm system.

The default is `DEBUG` in dev and `INFO` in production, adjustable with the env var `LOG_LEVEL`. **No new build is needed; just restart (or reload the config).** .NET reads it from `appsettings.json` instead (see `per-stack.md`).

---

## 3 · Correlation id — what makes logs usable

One request uses one id from start to finish, so every line that comes from that request has the same id.

```
Client ──X-Request-Id?── API Gateway ──┬── Service A ──┐
                        (create if none)└── Service B ──┴─→ every line has the same cid
```

- Take it from the header **`X-Request-Id`** only when it matches `^[A-Za-z0-9-]{1,64}$`. If it is missing or does not match, create a new one (`uuid v4`, first 8 characters). For the reason, see `web-service-essentials` item 3.
- **Always return it in the response header**, so the customer can send the id when reporting a problem and we can trace it at once.
- Pass it to the downstream service on every cross-system call.
- Store it with a mechanism that is separate per request: `AsyncLocalStorage` (Node) · `ContextVar` (Python)
  · `IHttpContextAccessor`/`LogContext` (.NET). **Never use a global variable**, because ids mix as soon as several requests run at once.

---

## 4 · Log files

```
logs/
  app-20260831.log        all levels · rotate at midnight · keep 30 days · max 100MB per file
  error-20260831.log      ERROR/FATAL only · keep 90 days
  fatal.log               uncaught exceptions (app died)
```

- Set the folder with the env var `LOG_DIR`. **Never hardcode the path.**
- Compress old files (`.gz`) and **retention is required**. Otherwise the disk fills and the system goes down from its own logs.
- In a container, also log to stdout (besides the file) so `docker logs` works.
- `logs/` must be in `.gitignore`.

---

## 5 · What must never go into a log

Passwords · tokens/API keys · cookies/Authorization headers · OTP/PIN · credit card numbers/CVV ·
**national ID numbers** · health data · full payloads that contain personal data

Helper already provided: the redaction function (which hides secret values) checks **whether the key name contains a forbidden word** (`userPassword`, `pwd`,
`accessToken` are all caught) and replaces the value with `***`. It checks up to 4 levels deep inside an object.

> **Log injection** — A value from a user may contain `\n`. If you let it through, the user can "forge" a fake log line,
> which misleads readers and breaks parsers. So the provided code strips `\r\n\t` from every value and from the main message.

---

## 6 · Ready-to-use code

| File | Stack | Status |
|---|---|---|
| `assets/logger.node.js` | Node/TS — winston + winston-daily-rotate-file | ✓ Run and tested 2026-10-25 (Node 22.23.2 · winston 3.19.0 · winston-daily-rotate-file 5.0.0 · password redaction · correlation id · strips line breaks in the main message and values) |
| `assets/logger_py.py` | Python — stdlib only, nothing to install | ✓ Run and tested 2026-10-25 (Python 3.13.5 · same test set) |
| `per-stack.md` | .NET (Serilog) + Angular | Caution: not yet compiled or tested |

```js
// Node
const { withCorrelation } = require('./logger.node');
const log = withCorrelation(req.id).child({ source: 'orders' });
log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
log.error('บันทึกไม่สำเร็จ', err);          // pass an Error directly; the stack is added for you
```

```python
# Python
from logger_py import setup_logging, get_logger, set_correlation_id
setup_logging(app_name="myapi")             # once, when the app starts
log = get_logger("orders")
log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
log.exception("บันทึกไม่สำเร็จ")             # inside except — the stack is added for you
```

---

## 7 · Checking the work

```bash
# no leftover print/console.log in production code
grep -rnE "console\.(log|error)|Console\.WriteLine|^\s*print\(" src/ --include="*.ts" \
  --include="*.js" --include="*.cs" --include="*.py" | grep -v test | head -30

# the output logs are readable and greppable
tail -n 50 logs/app-*.log
grep "a3f9c1b2" logs/app-*.log          # does one request show every line?
```

- [ ] Every line has all of: time+timezone · level · cid · source
- [ ] `grep` with one cid shows the story of that request from start to finish
- [ ] No secrets leak: log an object with `password` and `token`, and you must see `***`
- [ ] Feeding in a value that contains `\n` produces no fake line
- [ ] With `LOG_LEVEL=INFO`, DEBUG really disappears
- [ ] Files rotate daily and have retention (left for 1 month, the disk must not fill)
- [ ] `logs/` is in `.gitignore`
- [ ] The response sends `X-Request-Id` back to the customer

---

## 8 · Anti-patterns not covered above

- **A silent `try { } catch (e) { }`** — log at least 1 line
- **Log, then rethrow** — one problem shows up 3 times in the file. Log at the top layer that really handles the error instead.
- **Logging inside a loop that runs thousands of times** — log one summary when the loop ends
- **Logging everything** — the file grows so large you cannot find anything, and it is expensive and slow

---

## 9 · Links to other skills

`test-automation` (tests with full coverage) · `incidents-and-monitoring`
