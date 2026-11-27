<!-- merged from skill `error-handling-patterns` on 2026-11-27 · description was: Use when writing code that can fail, with retry and timeout -->
# Error handling

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill, or use it alongside](#when-to-use-another-skill-or-use-it-alongside)
- [1 · Where to catch, where to let it pass](#1--where-to-catch-where-to-let-it-pass)
- [2 · The message to the user ≠ the message in the log](#2--the-message-to-the-user--the-message-in-the-log)
- [3 · Classify before deciding](#3--classify-before-deciding)
- [4 · Timeout and retry](#4--timeout-and-retry)
- [5 · Circuit breaker](#5--circuit-breaker)
- [6 · Partial failure](#6--partial-failure)
- [7 · Check before sending](#7--check-before-sending)
- [References](#references)

> **The one rule:** catch an error only when you **can really do something about it.**
> Catching it and doing nothing is worse than not catching, because the system keeps going while it is already broken inside.

## When to use this skill

- Writing code that calls the network, a database, files, or another team's system
- Deciding whether to retry, how many times, and how long to wait
- The user sees "an error occurred" and does not know what to do next
- Tracing a problem and finding nothing in the log because someone caught and discarded the error

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| The JSON shape of errors the API sends out | `web-service-essentials` · `api-design` | instead |
| Log line format and data masking | `logging-standards.md` | instead |
| Fixing one specific bug someone reported | `fix-at-source/targeted-fix` | instead |
| Steps when the system is really down | `incidents-and-monitoring` | instead |
| Error-rate metrics and alerts | `incidents-and-monitoring` | alongside |
| Where a failed background job goes next | `async-messaging` | alongside |
| Error messages that must be translated into several languages | `i18n-and-locale` | alongside |
| Tests for failure cases | `test-automation` | alongside |

---

## 1 · Where to catch, where to let it pass

| Layer | What to do |
|---|---|
| Innermost layer (calls DB, HTTP, files) | **let it pass**, or convert it into a domain error that has meaning |
| Business logic layer | catch only where there is a real fallback (a default value, a backup data source) |
| **Outermost layer** (controller, handler, main) | **catch everything** · log once · convert to an answer the user understands |

> **Log in one place only, the outermost layer.** If every layer catches, logs, and rethrows,
> 1 error becomes 10 log lines and nobody knows they are the same event.

**3 things you must never do:**

```csharp
try { ... } catch { }                      // wrong: swallowed silently
try { ... } catch (Exception) { return null; }   // wrong: the caller gets null and never learns what happened
catch (Exception ex) { log.Error(ex); throw; }   // wrong: logs again at every layer
```

**If you really mean to swallow it, write the reason:**

```csharp
catch (SmtpException ex)
{
    // swallowed on purpose — a failed notification email should not make the order fail
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · The message to the user ≠ the message in the log

| | The user sees | The log keeps |
|---|---|---|
| Content | what happened · what to do next | stack trace · variable values · request id |
| Language | the user's language | English is fine |
| Internal detail | **none at all** | allowed |
| Link between the 2 sides | **a reference code** | the same code |

```
Wrong: "เกิดข้อผิดพลาด" (An error occurred)   the user cannot tell what to do
Wrong: "SqlException: timeout expired"      leaks internal detail, and they cannot read it anyway
Right: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
       (Save failed because the system was slow. Try again in 1 minute. Reference: 01J9Z8K)
```

**A good message has 3 parts**: what happened · why (if you can say) · what to do next.
The reference code is the same correlation id as in `logging-standards.md`.

---

## 3 · Classify before deciding

| Type | Example | What to do | Log level |
|---|---|---|---|
| **User mistake** | incomplete input, wrong format | tell them to fix it · **do not retry** | no log needed |
| **Transient** | timeout · 503 · deadlock · dropped connection | **may retry** | warning |
| **Rate limited** | 429 Too Many Requests | may retry **after the time `Retry-After` gives** (if absent, use the formula in §4) · never fire faster than that | warning |
| **Permanent** | 404 · 401 · data fails a condition | do not retry · say so clearly | warning |
| **Our bug** | null reference · cannot convert the type | do not retry · **someone must fix it** | error |
| **Inconsistent data** | totals do not match, an impossible state | stop · **call a person** | error + alert |

> **Retrying an error that no number of tries will cure means firing again at a system that is already down, so it falls harder.**
> Sending `400` or `401` another 100 times gets the same answer.

---

## 4 · Timeout and retry

**Every call that leaves the process needs a timeout** — the default in most libraries is "wait forever"

| Call | A timeout that works in general |
|---|---|
| Ordinary database query | 5–10 seconds |
| Internal HTTP | 3–5 seconds |
| External HTTP | 10–30 seconds |
| Heavy background job | set it from the real work, and it must be possible to cut it off |

**The retry formula** (service-to-service calls · jobs in a queue use the numbers in [`async-messaging`](../../async-messaging/SKILL.md) §4 · when a person sits waiting on the screen → see the last item below):

```
at most 3 tries · exponential delay + jitter
try 1 waits 1 second · try 2 waits 2 · try 3 waits 4  (each ±20% random)
```

- **You need the random part** — otherwise every instance retries at the exact same moment and hits the target system again together
- **The total retry time must be less than the caller's timeout**, or the caller has given up while we are still trying
- **Retrying a write needs an idempotency key**, or the customer is charged twice (see `api-design`)
- **A person sits waiting on the screen** → at most 1 automatic retry, then show a "ลองอีกครั้ง" (try again) button for them to press (do not use the 3 tries of the formula above)

---

## 5 · Circuit breaker

When the target is down, firing more does not help. It only makes us hang along with it.

```
closed (normal) → N failures in a row → open (do not call at all, answer with an error at once)
                → wait X seconds → half-open: let 1 request try → success: back to closed · failure: stay open
```

A default that works: if 5 calls fail in a row within 30 seconds, keep the circuit open for 60 seconds.

**Add one when** — calling an external system that has gone down before · calling across several services · a slow target spreads the slowness to us
**Not needed when** — calling your own database · a job that runs once a day

---

## 6 · Partial failure

Work that handles many items must be able to answer **"8 of 10 succeeded, where did the other 2 go?"**

| Style | Fits |
|---|---|
| All or nothing (transaction) | money · stock · anything that breaks when half done |
| Do what you can, then report the items that failed | data import · notifying many people |

The second style must **return the failed items with a reason for each**, not just say "some items failed".

**Cleanup must always run**, whether or not the main work succeeds: closing files, returning connections, deleting temp files.
Use `finally` / `using` / `with` / `defer` instead of repeating it on every exit path.

---

## 7 · Check before sending

Go through this against the diff every time you touch code that calls outside the process

- [ ] Every `catch` clearly does one of these: handles it and goes on · converts it to an error of its own layer and throws on · lets it pass to the outermost layer to log (section 1) — no `catch` that logs and rethrows
- [ ] Every outside call (HTTP · DB · queue · file) has a deliberate timeout and retries only the transient types in section 3 · a write that retries has an idempotency key (section 4)
- [ ] The message to the user says what to do next · no stack trace or table name goes out (section 2) · the log for the same error has a correlation id and enough data to reproduce it
- [ ] Outcomes the business expects (not found · insufficient balance · duplicate) are return values or types the caller must handle, not exceptions
- [ ] Each outside dependency has at least 1 failure-path test (timeout · 5xx · bad payload), and a test confirms that partial failure follows section 6 and does not fail the whole page
- [ ] None of these 4 kinds of silent failure swallowing:
  - **optional chaining or `?? default`** that lets a missing value pass with nobody knowing (`order?.total ?? 0` turns an order that failed to load into a zero total)
  - **falling back to a mock or sample data outside tests** — the live system shows fake data and looks normal
  - **retries run out, then silence** — after the last try it returns empty or success, throws no error, and tells the caller nothing
  - **a catch that logs and carries on in the UI** — the user sees a normal screen although the data never arrived; show an error state they can see

## References

- [`sources.md`](sources.md) — where the checklist ideas came from
