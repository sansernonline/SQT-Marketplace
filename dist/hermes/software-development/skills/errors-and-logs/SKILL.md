---
name: errors-and-logs
description: Use when code can fail, needs retry or timeout, or writes logs
---

# errors-and-logs — handle failures on purpose and write logs people can read

> **One rule:** catch an error only when you can really do something about it, and log each failure once, at the outermost layer.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Code calls a network, database, file or another system; "should I retry?"; "the user sees a blank error" | [`references/error-handling-patterns.md`](references/error-handling-patterns.md) |
| Writing or reviewing log lines, log levels, log files, "nothing in the log" | [`references/logging-standards.md`](references/logging-standards.md) |
| Code for a specific stack (.NET, Angular, Node, Python) | [`references/per-stack.md`](references/per-stack.md) |

## Steps every part shares

1. **Decide where the error is handled.** Inner layers (DB, HTTP, files) let it pass or turn it into a domain error. Business logic catches only where a real fallback exists. The outermost layer (controller, handler, main) catches everything, logs once, and returns an answer the user understands.
2. **Sort the failure before you act.** A user mistake, a transient failure, a rate limit, a permanent failure, or our own bug. Only a transient failure or a rate limit may retry, and only after the time the server asks for.
3. **Give every outside call a timeout.** Most libraries wait forever by default. The total retry time must be shorter than the caller's own timeout.
4. **Write the log line in the shared format.** Time with timezone, level 5 characters wide, an 8-character correlation id, the source module, one sentence, then `key=value` context. Read `references/logging-standards.md` section 1 for the full layout.
5. **Show the user a message they can act on, and log the detail.** Never send a stack trace or SQL text to the user.

## Check before done

- **Never log** passwords, tokens or API keys, cookies or Authorization headers, OTP or PIN, card numbers or CVV, national ID numbers, health data, or full payloads that hold personal data. Check that a test log with `password` and `token` prints `***`.
- Never write an empty `catch`, and never `return null` in place of an error. If you really swallow an error, write the reason in a comment next to it.
- A write that retries carries an idempotency key, or a customer may be charged twice.
- A person waiting on a screen gets at most 1 automatic retry, then a retry button they press themselves.
- Each outside dependency has at least one failure-path test (timeout, 5xx, bad payload).

## References

- [`references/sources.md`](references/sources.md) and [`references/error-handling-patterns.md`](references/error-handling-patterns.md) — error patterns and where the ideas came from
- [`assets/logger.node.js`](assets/logger.node.js) and [`assets/logger_py.py`](assets/logger_py.py) — tested logger starters with password masking
- Retry numbers for background jobs live in `async-messaging`; alarms and error-rate metrics live in `incidents-and-monitoring`
