---
name: principle-replace-then-delete
description: Use when replacing an API, table or component
---

# principle · replace then delete — migrate everything, then delete the old thing in the same round

> An old thing "kept for now in case we need it" stays forever, and the next person cannot tell which one to use.

## Steps

1. **Delete before you add.** Remove dead code · duplicate validators · stubs · flags that are now permanently on. Then build on the smaller base.
2. **Count every user of the old thing** with a repeatable command (grep · find references). This number is the evidence.
3. **Build the new thing in the shape it should have.** Do not bend it to look like the old one.
4. **Migrate every user.** If there are more than 10 places, use a codemod (`ground-rules/principle-build-a-tool-not-handwork`).
5. **Delete the old thing in the same PR or batch**, then rerun the command from step 2. It must show 0 places.

## Do not

- A wrapper that calls the new thing through the old name "temporarily"
- A flag that switches between old and new and never gets removed
- Code that supports the halfway state between phases of an already planned migration. Go straight to the end state.

## Exceptions — a real compatibility layer is needed

| Case | Do this |
|---|---|
| A public API that outsiders call | Deprecate per `api-conventions` and set a removal date |
| A database table that is live | Expand-and-contract per `database-design` |
| Old mobile app versions still in use | Support down to the minimum version that is forced to update |

Record every exception in `decision-desk/decision-log` with the date it will be removed.

Upgrading a whole framework (.NET Framework → .NET 8 · Angular major · Python 2 → 3 · Node LTS) follows the same principle, one package at a time. The playbook per stack is at [`legacy-spec-recovery/references/framework-upgrade.md`](../legacy-spec-recovery/references/framework-upgrade.md)
