---
name: code-craft
description: Use when writing, changing or reviewing code, simple and readable
---

# code-craft — the simplest code that works, and names a newcomer can read

> **One rule:** write the least code that works, and name each piece so a teammate understands it six months later with no other context.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make it simpler", any new code, "do we need this?" | [`references/lazy-coding.md`](references/lazy-coding.md) |
| Naming a variable, function or file, "hard to read", "where does this go?" | [`references/readable-code.md`](references/readable-code.md) |
| Changing code you have not read yet | [`references/code-orientation.md`](references/code-orientation.md) |
| A small edit to shared code, "what else does this touch?" | [`references/blast-radius.md`](references/blast-radius.md) |
| "Clean up duplicates or dead code" | [`references/code-gardener.md`](references/code-gardener.md) |
| Logic that crosses functions or modules, many `if`s | [`references/principle-data-shape-first.md`](references/principle-data-shape-first.md) |
| Replacing an API, table or component | [`references/principle-replace-then-delete.md`](references/principle-replace-then-delete.md) |
| Code that may run twice or stop halfway, retries | [`references/principle-safe-to-rerun.md`](references/principle-safe-to-rerun.md) |

## Steps every part shares

1. **Climb the ladder and stop at the first rung that holds.** Does it need to exist? Does the standard library do it? Does a native platform feature do it? Does a dependency already in the project do it? Can it be one line? If none of these, write the smallest code that works.
2. **Add no abstraction nobody asked for.** No interface with one implementation, no factory for one product, no code "for later". Delete before you add.
3. **Mark a deliberate shortcut in a comment** that names the limit and the upgrade path, for example `// simple: in-memory cache, swap for Redis when we run two processes`.
4. **Keep one concern per file.** Group by feature, not by type: no `utils/` folder. Config and secrets live outside the code, but fixed domain tables stay in code. Tests sit beside the code they test.
5. **Name by meaning.** A number carries its unit (`timeoutMs`, `priceSatang`). A boolean starts with `is`, `has`, `should` or `can`, never a negative like `isNotReady`. Avoid `data`, `info`, `manager`, `helper`, `util` and `temp`.
6. **Shape each function.** One level of detail per function. At most 3 parameters; beyond that, pass an object with named fields. No boolean parameter (`render(true)`). Return early instead of nesting `else`. Split a function that indents past 3 levels.
7. **Write comments only for why.** A comment that says what the code does means the name is wrong: rename, then delete the comment. Keep a comment only for an outside constraint, an odd but deliberate decision, a business rule with its source clause, or a `TODO(owner)` with a condition.

## Check before done

- Every rung of the ladder was considered, and nothing was added that the user did not ask for.
- Non-trivial logic (a branch, loop, parser, money or security path) has one runnable check.
- **Never be lazy about** input validation at trust boundaries, error handling that prevents data loss, security, or anything the user explicitly asked for. If the user insists on the full version, build it.
- Before a shared change, find every caller and run one real check on the riskiest one. Never answer "it probably affects nothing."
- Code-gardener writes its findings to `docs/GARDEN.md` and does not delete code itself.
- A rename never lands in the same commit as a logic change.

## References

- [`references/structure.md`](references/structure.md) — where code, config, constants and tests live
- [`references/examples.md`](references/examples.md) — shortcut marks and the 3 intensity levels (lite · full · ultra) on one request
- [`references/readable-code/examples.md`](references/readable-code/examples.md) — name, comment and folder-layout examples
- [`assets/naming-reference.md`](assets/naming-reference.md) — function-name prefixes, forbidden-word replacements and the 12-item checklist

Pairs with: `ground-rules/simplify` · `project-bootstrap` · `git-and-review` (a lazy diff still gets reviewed)
