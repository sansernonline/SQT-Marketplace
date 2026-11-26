# Code criteria and the principle index

## Code criteria — every diff must pass all 3

Moved from `SKILL.md` section 4

| Criterion | Passes when | skill |
|---|---|---|
| **Simple** | Nothing not yet needed · standard library before writing your own · no dependency added to save a few lines · no interface with only one implementation · the shortest diff that is still correct | `lazy-coding` |
| **Engineer-style structure** | Folders by feature · 1 file, 1 responsibility · code split into 3 layers: input → business rules → storage · config lives outside the code · tests sit next to the code · names carry meaning · a newcomer can follow it in 6 months | `readable-code` |
| **Secure from the start** | Check outside data the moment it enters · SQL uses parameters · check permissions on the server side · secrets live outside the code · logs hold no secrets · if an error occurs, deny by default | [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) |

Simple does not mean cramming everything into one file, having structure does not mean adding layers for the future, and secure does not mean adding wrapper layers. The 3 go together, because code that is small and orderly is the easiest to check for security · if the path with the shorter diff makes things harder for the user, let `ground-rules/principle-user-experience-first` win.

## Index

To use an item, open that item's SKILL.md and read the whole file first.

**Security**
- [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) — applies to every diff and gets stricter when touching input, login, files, money, personal data
- [`security-gate`](../../security-gate/SKILL.md) — scan secrets · dependencies · code before every delivery

**Design**
- [`principle-data-shape-first`](../../principle-data-shape-first/SKILL.md) — define types and data shapes first, check data when it enters the system, then the inside can be trusted
- [`principle-replace-then-delete`](../../principle-replace-then-delete/SKILL.md) — move every caller to the new thing, then delete the old thing in one round, leaving no layer that supports the old one
- `ground-rules/principle-user-experience-first` — do less but really finish, and the builder's convenience is not a reason to choose

**Proving**
- `ground-rules/principle-prove-it-works` — before saying done, check against the real thing, not "it compiles"
- `fix-at-source/principle-fix-root-cause` — when fixing a bug, reproduce it first, then fix the root cause · use together with `fix-at-source/targeted-fix`
- `ground-rules/principle-small-verifiable-steps` — cut into small pieces and pass each check before moving on
- [`principle-safe-to-rerun`](../../principle-safe-to-rerun/SKILL.md) — running again, or stopping midway and running again, gives the same result
- [`blast-radius`](../../blast-radius/SKILL.md) — if you change something shared, find every spot affected, then prove the riskiest spot

**Simplicity**
- `lazy-coding` — the least code that really works
- `ground-rules/simplify` — documents · designs · plans that are as simple as possible but usable
- `readable-code` — a newcomer can read and keep up

**Working**
- `ground-rules/principle-proceed-on-reversible-work` — do reversible work at once, and prepare irreversible work under "รออนุมัติ" (awaiting approval) while carrying on with other parts
- `ground-rules/principle-build-a-tool-not-handwork` — turn repetitive mechanical work into a script that can be re-run
- `learn-loop/repeated-mistakes-to-checks` — turn a rule you must keep repeating into an automatic check
- `context-budget` — send big work to subagents and keep only the summary in the main conversation
