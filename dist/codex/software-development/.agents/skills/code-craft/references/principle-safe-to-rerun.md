<!-- merged from skill `principle-safe-to-rerun` on 2026-11-27 · description was: Use when code may run twice or stop halfway -->
# principle · safe to rerun — the same result however many times it runs

> Something that can run only once will break on the day it runs twice — a retry · someone clicking twice · a machine going down halfway.
> Write it so the final result is the same however many times it runs (idempotent).

## Patterns

| Instead of | Do this |
|---|---|
| A bare `INSERT` | Upsert on a natural key, or add a unique constraint to block duplicates |
| `CREATE TABLE` · `mkdir` | `IF NOT EXISTS` · `mkdir -p` |
| `balance = balance + 100` | Record entries with unique ids, then compute the balance from the entries |
| Receive a webhook and act at once | Store the event ids already handled, and skip a repeat |
| An API that creates things | Accept an `Idempotency-Key` from the client (`api-design`) |
| A script that edits a file | Check first whether it was already edited, and replace the old value instead of appending again |
| Do the whole batch in one go | Do it in chunks and record how far you got, so a rerun continues from that point |

## Trial mode

A script that changes real data has a `--dry-run` that prints what it would change without changing it.

## Prove it

- Run it twice in a row, and compare the result with a single run. The results must match.
- Stop it halfway (kill), then run again. The job must finish completely with no duplicates.
- Add these 2 checks as tests for migrations and for scripts that are reused.

## See also

Use `async-messaging` for background work, and `database-design` for database migrations.

## Not needed when

A read-only command, or a one-off script that is thrown away in `_to_delete/`.
