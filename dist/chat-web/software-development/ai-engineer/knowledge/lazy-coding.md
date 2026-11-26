# skill: lazy-coding

Use when writing or reviewing code, for the simplest that works

# lazy-coding — the least code that works, still easy to find and to read

> **One rule:** a tired teammate must understand it in 6 months, with no context. If they can't, simplify until they can. The best code is the code you never had to write.

## Use when

- Writing or reviewing any code. On by default at **full** in every response; switch with `lazy lite | full | ultra`; off only on "stop lazy" / "normal mode".

Not for: names, function shape and file layout → `readable-code` (**always load together**: lazy decides how much code, readable-code decides how it looks) · the repo skeleton → `project-bootstrap` · docs, plans, architecture → `superuser:ground-rules`

## Steps

1. **Climb the ladder and stop at the first rung that holds** (a reflex, not a research project; if two rungs work, take the higher one):
   1. Does this need to exist? Speculative need → skip it, say so in one line (YAGNI).
   2. Does the stdlib do it? Use it.
   3. Does a native platform feature cover it? (`<input type="date">` over a picker lib, CSS over JS, a DB constraint over app code.) On mobile (Flutter, React Native) "native" means a platform channel in Kotlin/Swift, the costly rung: a maintained plugin or framework widget comes first.
   4. Does an already-installed dependency solve it? Use it. Never add a dependency for what a few lines can do.
   5. Can it be one line? One line.
   6. Only then: the smallest code that works.
2. **Apply the rules:**
   - No unrequested abstractions (no interface with one implementation, no factory for one product, no config for a value that never changes). No scaffolding "for later".
   - Delete before you add. Boring before clever.
   - Deletion test: remove the piece, run the tests; still green → it stays deleted.
   - Shortest working diff wins, but never by merging concerns into one file: fewest files **that still keep one concern per file**.
   - Match the repo: read 2–3 nearby files and copy their style.
   - Two stdlib options the same size → take the one correct on edge cases.
3. **Keep it simple, not scattered.** Lazy cuts how much code exists, never where it lives: one concern per file · feature folders, not type folders (no `utils/`) · names carry meaning · signatures and data shapes between layers written out · config and secrets outside code (but domain constant tables stay in code) · tests beside the code · new project → `project-bootstrap` first. Details and the cold-open test → [`references/structure.md`](references/structure.md).
4. **Mark a deliberate shortcut** with a comment naming the ceiling and the upgrade path (`# simple: in-memory dict cache — swap for Redis if we run more than one process`). Examples → [`references/examples.md`](references/examples.md).
5. **Never be lazy about:** input validation at trust boundaries, error handling that prevents data loss, security, accessibility basics, or anything explicitly requested. If the user insists on the full version, build it; no re-arguing.
6. **Non-trivial logic** (a branch, loop, parser, or money/security path) leaves ONE runnable check: an `assert`-based self-check or one small `test_*`. No frameworks or fixtures unless asked. Trivial one-liners need no test.
7. **Output:** code first, then at most three short lines on what you skipped and when to add it: `[code] → skipped: [X] — add when [Y].` If the explanation is longer than the code, delete the explanation.

## Intensity

| Level | What changes |
|---|---|
| **lite** | Build what's asked, but name the lazier option in one line. The user picks. |
| **full** | The ladder enforced. Stdlib and native first. Shortest diff, shortest explanation. Default. |
| **ultra** | YAGNI extremist. Ship the one-liner and challenge the rest of the requirement in the same breath. |

## Check before done

- Each rung of the ladder was considered; nothing added that was not asked
- One concern per file; config outside code; one runnable check for non-trivial logic
- Output is code plus at most three short lines

## References

- [`references/structure.md`](references/structure.md) — open when deciding where code, config, constants and tests live
- [`references/examples.md`](references/examples.md) — open for shortcut-marking examples and the 3 intensity levels answering the same request

Pairs with: `ground-rules/simplify` · `readable-code` · `project-bootstrap` · `code-review-checklist` (a lazy diff still gets reviewed)


## reference: examples.md

# Examples · lazy-coding

Open when you need to see how a simplification is marked, or how the 3 intensity levels answer the same request.

## Mark your simplifications

A deliberate shortcut reads as intent, not ignorance, when you label it. Name the ceiling and the upgrade path:

```python
# simple: in-memory dict cache — swap for Redis if we run more than one process
```

```ts
// simple: O(n) scan, fine under ~1k items — index it if the list grows
```

## Intensity example — "Add a cache for these API responses."

- **lite:** "Done. FYI `functools.lru_cache` does this in one line if you'd rather not own a cache class."
- **full:** "`@lru_cache(maxsize=1000)` on the fetch function. Skipped a custom cache class — add when lru_cache measurably falls short."
- **ultra:** "`@lru_cache` on the fetch function — done, since you asked. Do you have a profile showing these calls are slow? If not, this line can go. A hand-rolled TTL cache is a bug farm with a hit rate."


## reference: structure.md

# Simple is not scattered · lazy-coding

Open when deciding where code, config, constants and tests live. Lazy cuts how much code exists, never where it lives.

- One concern per file: entry point, logic, config and I/O each have their own place.
- Feature folders, not type folders; no `utils/` dumping ground (`readable-code`).
- Names carry meaning (not `tmp`, `data`, `handle()`).
- Boundaries stay explicit: signatures, module exports and the data shape between layers are written out.
- Config and secrets outside code: even one environment variable goes in `.env.example`. A project that reads none (an offline mobile app) has no `.env.example`; do not invent one.
- Domain constant tables (thresholds, unit tables, lux ranges) change only with a code release: one named constants file next to the feature, not env vars. "Config outside code" means values that differ per environment or deployment.
- Tests sit next to the code they test; where the toolchain fixes the test folder (Flutter `test/` mirroring `lib/`), follow it.
- New project → `project-bootstrap` first; never scatter files at the root to save a minute.
- Test: can a tired teammate opening the repo cold guess which file holds a behaviour in 30 seconds? If not, the structure is missing, not too complex.
