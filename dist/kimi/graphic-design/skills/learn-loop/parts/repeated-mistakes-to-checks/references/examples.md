# Examples · repeated-mistakes-to-checks

Rules in this set that became checks:

| Rule | Used to be | Now it is |
|---|---|---|
| A skill's description must not contain `": "` without quotation marks | A warning in a document | `scripts/check/validate-marketplace.mjs` + `--self-test` |
| Numbers in the README must match reality | Edited by hand | `scripts/sync/sync-docs.mjs --check` |
| SuperUser shared files must be identical in every plugin | A text line "edit every copy" | `scripts/sync/sync-superuser.mjs --check` |
