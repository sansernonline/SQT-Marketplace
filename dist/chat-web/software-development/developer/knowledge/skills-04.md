# skill: stack-python

Use when writing or testing Python code

# stack-python — Python that is easy to read, correctly typed, and safe to rerun

Use the same tools the repo already uses, and every diff must pass ruff · type check · pytest before sending. This file holds only Python-specific matters.
General matters are elsewhere: writing less → `lazy-coding` · naming → `readable-code` · logging → `logging-standards` · catching errors → `error-handling-patterns`

## 1 · Getting started: see what the repo uses, then use that

| File found | Install | Run a command |
|---|---|---|
| `uv.lock` | `uv sync` | `uv run <cmd>` |
| `poetry.lock` | `poetry install` | `poetry run <cmd>` |
| `pdm.lock` | `pdm install` | `pdm run <cmd>` |
| `requirements*.txt` only | `python -m venv .venv` then `pip install -r requirements.txt` | Activate `.venv` first |
| Nothing at all (new project) | `uv init` then `uv add` | `uv run <cmd>` |

- Always use a virtual environment; never `pip install` into the system Python
- Never mix tools; for example if the repo uses poetry, do not add a `uv.lock`
- Read `requires-python` in `pyproject.toml` and never use syntax newer than it
- Versions (last checked 2026-10-14 · source: https://devguide.python.org/versions/): the newest is 3.15 (released 2026-10-09) · 3.14 still gets bug fixes · 3.11–3.13 get security fixes only · 3.10 has reached end of life (2026-10-01) · the next to end is 3.11 (Oct 2027) · a new project starts at 3.14 or 3.15 if the libraries it uses already support it · check this page again before using

Routine commands (prefix with `uv run` or `poetry run` according to the repo's tool):

```bash
ruff check .                      # lint
ruff format --check .             # รูปแบบโค้ด · แก้ด้วย ruff format .
pyright                           # หรือ mypy . · ดูว่า repo ตั้งตัวไหนใน pyproject.toml
pytest -q 2>&1 | tail -40         # ทั้งชุด · ดูแค่ท้ายผล (สรุปและ test ที่ล้ม)
pytest -q tests/test_order.py::test_refund_over_limit   # test เดียวด้วย node id
pytest -q -k "refund and not slow"                      # เลือกตามชื่อ
```

- type checker: if the repo has `[tool.pyright]` or `pyrightconfig.json`, use pyright; if it has `[tool.mypy]` or `mypy.ini`, use mypy; if it has neither, ask once; Astral's ty is used only when the repo has already set it up
- If the repo still uses black · isort · flake8, use them as they are; do not move to ruff in the same task

## 2 · Standard patterns

| Topic | Do this | Do not |
|---|---|---|
| type hint | Add to every function and method called from outside the file, using `list[str]` · `X \| None` | `List` · `Optional` from `typing` in new code |
| Data shape | Inside, use `@dataclass(frozen=True)`; at the system edge use pydantic | A bare `dict` passed across modules |
| path | `pathlib.Path` | Joining strings with `+ "/"` |
| Text | f-string | `%` or `.format()` in new code |
| log | `log.info("ส่งแล้ว order_id=%s", oid)` letting the logger substitute the value | An f-string in a log call (builds the string every time even if the level is off) |
| File · lock · connection | `with ...:` | Opening and waiting to `close()` yourself |
| Default value | `None`, then create it new inside the function | `def f(items=[])` (one list shared across every call) |
| Thai text files | `open(p, encoding="utf-8")` · `p.read_text(encoding="utf-8")` | Not specifying (Windows reads as cp874 or cp1252) |
| Scripts | Logic in functions, with `if __name__ == "__main__":` calling `main()` | Code that runs at import |
| Command Line Interface (CLI) | Use what the repo uses; if none, start with `argparse` before typer | Parsing `sys.argv` yourself |

```python
@dataclass(frozen=True)
class Refund:
    order_id: int
    amount_satang: int

def main() -> int:
    args = parse_args()
    return run(args.input_path)

if __name__ == "__main__":
    raise SystemExit(main())
```

## 3 · Web: FastAPI and Django

- Data in and out goes through pydantic models at the edge, while inside you use domain types; never pass a raw `request.json()` into a service
- FastAPI: things that must change during tests (DB session · external client · clock) are taken through `Depends` and swapped with `app.dependency_overrides`
- `async def` only when the whole call chain is async (httpx `AsyncClient` · an async DB driver); if you use a blocking library (`requests` · `time.sleep` · a sync driver), use a plain `def` so FastAPI runs it in a threadpool, or wrap it with `asyncio.to_thread`
- 1 DB session per request through a dependency that `yield`s; never keep a session at module level
- Django Object-Relational Mapping (ORM): if you loop and touch a FK, use `select_related`; if you touch many-to-many or a reverse FK, use `prefetch_related`, then check the query count in tests with `assertNumQueries` or `django_assert_num_queries`
- migration: read the file `makemigrations` creates every time before commit; if you drop a column or change a type on a big table, split it into several steps per `database-design`
- For health endpoints · timeouts · the shape of errors sent out, see `web-service-essentials` and `api-conventions`

```python
def get_db() -> Iterator[Session]:
    with SessionLocal() as session:
        yield session

@app.post("/refunds", status_code=201)
def create_refund(body: RefundIn, db: Session = Depends(get_db)) -> RefundOut:
    return refund_service.create(db, body.to_domain())
```

## 4 · Data and AI

| Topic | Do this |
|---|---|
| Changing values in a DataFrame | Use `df.loc[mask, "col"] = x`, because pandas 3.x turns Copy-on-Write on by default, so `df["col"][mask] = x` does not change `df` at all |
| Speed | Use whole-column operations (`df["a"] * df["b"]` · `np.where`) before `apply`; use `iterrows` only when there is no other way |
| Money | Store as satang of type `int64` or `Decimal`; never use float, and round once at display time |
| Thai CSV | Try `utf-8-sig` first (Excel adds a BOM); if that fails, try `cp874` (TIS-620), and give the `dtype` of codes that start with 0 as `str` |
| Reproducible results | `rng = np.random.default_rng(42)` passed along as a parameter; also set the seeds of torch and `random`, and record the seed in the output |
| notebook | Fine for trying ideas, but move code you will reuse into a module with tests; leave the notebook only calling functions and drawing charts |
| Large files | Read in parts (`chunksize`) or use parquet instead of CSV when you control the format |

- For LLM calls · prompts · RAG · evaluation, see `llm-engineering`
- For importing or exporting Excel and Buddhist Era years, see `data-import-export`

## 5 · Common traps

| Trap | Symptom | Fix |
|---|---|---|
| datetime without timezone | Time is off by 7 hours, or comparing gives a `TypeError` | Create with `datetime.now(timezone.utc)` (3.11+ can use `datetime.UTC`), store as UTC, display with `ZoneInfo("Asia/Bangkok")`, and never use `utcnow()` |
| Money as float | `0.1 + 0.2 != 0.3` and the total is short by 1 satang | Use `int` satang, or `Decimal("0.10")` from a string |
| Closure in a loop | Every callback gets the last value of the loop | Bind the value at creation `lambda i=i: ...` or `functools.partial` |
| A broad `except Exception:` | Real errors are swallowed | Catch only known types, per `error-handling-patterns` |
| Circular imports | `ImportError` of the partially initialized kind | Move shared things into a third module, and put imports used only for types under `if TYPE_CHECKING:` |
| CPU-heavy work in threads | Using several threads does not speed it up, because of the Global Interpreter Lock (GIL) | Use `ProcessPoolExecutor`; threads are for I/O waiting |
| `subprocess(..., shell=True)` | User input becomes a shell command | Pass a list `["git", "log", ref]`, add `check=True` and set a `timeout` |
| `pickle.load` of outside data | Runs someone else's code the moment it loads | Use JSON or parquet; for models use `safetensors`; for torch add `weights_only=True` |
| `yaml.load` | Builds any object from the file | `yaml.safe_load` |
| The repo uses `uv` but packages are added with `uv pip install` or by hand-editing `pyproject.toml` | `uv.lock` is not updated, other machines run `uv sync` and lack the package | Only `uv add <pkg>` / `uv remove <pkg>` · dev things go in with `uv add --group dev` (`[dependency-groups]`) · run everything through `uv run`, do not activate the venv yourself (idea from trailofbits `modern-python` · CC-BY-SA, rewritten) |
| A single-file script with a separate `requirements.txt` | The runner forgets to install · versions do not match | Put the dependencies in the file header in PEP 723 form (`# /// script` … `# dependencies = ["httpx"]` … `# ///`), then `uv run script.py` builds the env itself |
| Blocking inside `async def` | The whole server stalls at the pace of the slowest request | See section 3 |

## 6 · Tests

For pytest setup · fixtures · `parametrize` and examples, see [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#python--pytest); this section keeps only Python-specific traps

- Temporary files use `tmp_path`; never write into the repo's folders · environment values use `monkeypatch.setenv`
- Time: pass the clock into the function as a parameter first; if you cannot change it, use `time-machine`, but if the repo already uses `freezegun`, keep using it
- External HTTP: httpx uses `respx` · requests uses `responses` · never hit the real network in a unit test
- For a real database, use `testcontainers` of the same kind as production; do not use SQLite in place of Postgres
- For new logic and bugs, write a test that fails (red) first, then fix until it passes (green)
- Look at coverage only for changed lines: `pytest --cov --cov-report=term-missing`, then go through the lines in the diff that did not run

## 7 · Python-specific security

The 10 principles are in `principle-secure-by-default`; this section is how to do them in Python

- Always lock dependencies (`uv.lock` · `poetry.lock` · `pip-compile --generate-hashes`) and commit the lock file
- Vulnerability scanning: `pip-audit` (works with every tool); uv has `uv audit` but it is still a preview (the version that first has it (รอยืนยัน) (pending confirmation) · source: https://github.com/astral-sh/uv/blob/main/CHANGELOG.md · checked 22 Oct 2569 BE), so it may be used, but Continuous Integration (CI) still relies on `pip-audit`
- Before `uv add` or `pip install` of a new package, spell the name exactly as on its PyPI page, check the maintainers and the latest release date, and beware of look-alike names (`reqeusts` · `python-dateutil` versus `dateutil`)
- SQL passes values through parameters: `cur.execute("... WHERE id = %s", (oid,))`; with SQLAlchemy use `text(...)` with `:name`, and never an f-string
- File names from users: `(base / name).resolve()` then check `.is_relative_to(base.resolve())`; for uploads see `file-upload-and-storage`
- Secrets are read from the environment (`os.environ["KEY"]` or pydantic-settings) and checked at startup; keep `.env` in `.gitignore` (see `config-and-secrets`)
- Django production: `DEBUG = False` · `ALLOWED_HOSTS` with real names · `SECRET_KEY` from the environment · run `python manage.py check --deploy` before release

## 8 · Check before sending

- [ ] `ruff check` has no errors
- [ ] `ruff format --check` passes (or the formatter the repo uses)
- [ ] The repo's type checker gives 0 errors in the files you changed
- [ ] `pytest -q` is green for the whole suite, not just the changed files (long output → `> _to_delete/test.txt 2>&1` then `tail -20`)
- [ ] Every new behavior has a test that was red before the fix
- [ ] No `requests` · `time.sleep` · sync driver or blocking I/O inside `async def`
- [ ] Every place that opens a text file gives `encoding="utf-8"` and stored datetimes have a timezone
- [ ] Added dependencies are in the lock file and pass `pip-audit`

## 9 · Connecting to other skills

| Task | Open |
|---|---|
| Write less, add nothing extra | `lazy-coding` |
| Names · function shape · where files live | `readable-code` |
| Choosing a test framework · proportions · test names | `testing-standards` |
| Log format · correlation id · ready-made Python logger | `logging-standards` |
| Catching errors · retry · timeout | `error-handling-patterns` |
| Security rules for every diff | `principle-secure-by-default`, and before sending use `security-gate` |
| LLM calls · RAG · evaluation | `llm-engineering` |
| schema · migration | `database-design` |
| Background jobs (Celery · RQ · cron) | `background-jobs` |
| Confirm it really works before saying it is done | `principle-prove-it-works` |


---

# skill: stack-sql

Use when writing or reviewing SQL queries

# stack · SQL — write queries that are correct, fast, and change data safely

> **The one rule:** a query that has never run against a realistic amount of data is not finished

Table design, naming, data types, and expand-and-contract migrations → `database-design`

## 1 · Getting started: know the database before writing the first line

- engine and version: `SELECT @@VERSION` (SQL Server) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL) · on SQL Server also check `SERVERPROPERTY('Edition')`, because many features exist only in Enterprise
- what the repo runs migrations with: `Migrations/` (EF Core) · `db/migration/V1__*.sql` (Flyway) · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · raw scripts in `sql/`
- the server's collation and time zone: `SERVERPROPERTY('Collation')` · `SHOW timezone`

- Use the migration tool the repo already uses; never add a second one and never change the schema by hand outside the tool
- Never run anything on production; prepare the commands for a person to approve instead (see `principle-proceed-on-reversible-work`)
- Use a local or sandbox database whose row count is close to real (a 100-row table hides every speed problem); if you have none, generate mock data with a script so the volume and value distribution are close to real

## 2 · Write queries that are correct

| Topic | Do this | Trap |
|---|---|---|
| Values from users | Always pass as a parameter | Concatenating strings → SQL injection |
| Columns | Write the full column names | `SELECT *` → pulls too much · a new column breaks code · cannot use a covering index |
| NULL | `IS NULL` · `NOT EXISTS` | `= NULL` is never true · `NOT IN (subquery)` with a single NULL → 0 rows |
| JOIN | Count rows before and after the join | Join on the 1-to-many side then `SUM` → doubled totals; fix by summing before the join |
| GROUP BY | Every non-aggregate column must be in `GROUP BY` | MySQL with `ONLY_FULL_GROUP_BY` off → silently picks a random value |
| Division | `CAST(a AS decimal(18,4)) / b` and guard against divide by 0 with `NULLIF(b, 0)` | SQL Server and PostgreSQL give `5/2 = 2`, while MySQL gives `5/2 = 2.5000` |
| Mismatched data types | A parameter of the same type as the column | SQL Server sends `nvarchar` to compare with a `varchar` column → `CONVERT_IMPLICIT` → scans the whole table |
| Date range | `>= start AND < end` (half-open) | `BETWEEN '2026-01-01' AND '2026-01-31'` → drops all of the 31st after midnight |
| time zone | Store UTC, convert to Asia/Bangkok when displaying | Storing Thai time with no offset → merging data across systems is off by 7 hours |
| Buddhist Era (พ.ศ.) year | Always store Common Era (ค.ศ.), convert when displaying | Storing 2569 → age calculation, sorting and export all break |
| Money | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 does not equal 0.3 |
| Sorting Thai names | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | A general collation → leading vowels (เ แ โ ใ ไ) sort wrong with no error |

Convert UTC to Thai time when displaying: SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` (a `timestamptz` column)

- A Thai collation is not on every server, so check before choosing (commands in [`references/snippets.md`](references/snippets.md)) · showing Thai dates and accepting Buddhist Era years from a form → `i18n-and-locale`

## 3 · Make it fast: read the real plan, do not guess

Commands to see the real plan by engine · what to look for in a plan · keyset example · deleting in batches · parameter sniffing fixes step by step → [`references/performance.md`](references/performance.md)

- Short rules: look at the real plan on data close to real volume, do not guess · conditions must be sargable (do not wrap an indexed column in a function) · every index must answer which query it serves · deep paging uses keyset · count N+1 from the Object-Relational Mapper (ORM) log · big UPDATE/DELETE goes in batches — details and examples are only in [`references/performance.md`](references/performance.md)

## 4 · Change data safely

A table of isolation levels · upsert · creating an index without locking the table, by engine, with examples that check row counts → [`references/safe-changes.md`](references/safe-changes.md)

- Short rules: scripts can be rerun · back up before changing a big batch of data · count rows first and check before `COMMIT` · upsert uses the engine's own form · touch tables in the same order to prevent deadlocks · `ALTER TABLE` on a big table needs `lock_timeout` set — details and examples are only in [`references/safe-changes.md`](references/safe-changes.md)

## 5 · Common traps

- `MERGE` (SQL Server) has several bugs, and without `HOLDLOCK` 2 sessions insert duplicates → separate `UPDATE` + `INSERT`, or `MERGE ... WITH (HOLDLOCK)` with a test
- A trigger hides business rules and breaks on multi-row inserts → keep rules in app code; use triggers only for audit · a cursor/row-by-row loop → a set-based statement
- `WITH (NOLOCK)` reads uncommitted data, rows go missing or repeat → turn on Read Committed Snapshot Isolation (RCSI) instead · building SQL by string concatenation → parameters (section 7)
- A collation mismatch in a join → set them equal on the column (putting `COLLATE` in the query stops it using the index)
- Ids are not always consecutive (identity jumps · a sequence does not go back on rollback) → document numbers that must have no gaps are issued by yourself in a counter table
- A timestamp with no time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` agreed to be UTC, or `datetimeoffset`
- A query that always filters a small share of rows (`WHERE status = 'pending'` · `deleted_at IS NULL`) but the index covers every row → the index is big and the planner does not pick it → put that condition into the index itself: PostgreSQL `CREATE INDEX ... WHERE status = 'pending'` · SQL Server filtered index `CREATE INDEX ... WHERE status = 'pending'` (the query must write the same condition for it to be used · idea from supabase/agent-skills · MIT)
- After deleting or updating many rows, queries get slower though the plan did not change → table and index bloat (dead tuples · split pages) → in PostgreSQL look at `pg_stat_user_tables.n_dead_tup` then `VACUUM (ANALYZE)` or `REINDEX CONCURRENTLY` · in SQL Server look at `sys.dm_db_index_physical_stats` then `ALTER INDEX ... REORGANIZE` (below 30%) or `REBUILD` · check this before blaming the query

Example commands for both of these → [`references/performance.md`](references/performance.md)

## 6 · Tests

- Test queries against a real database of the same kind as production; never use SQLite or in-memory in place of SQL Server/PostgreSQL, because NULL, collation and lock behavior differ
- Start a fresh database every run with Testcontainers and load seed data with a script · logic in stored procedures uses tSQLt (SQL Server) or pgTAP (PostgreSQL)
- Check both row counts and values: cases with NULL · date ranges right at the midnight edge · Thai names · money amounts with fractions
- Run a new migration on a copy of a production-like schema with data close to real volume, then time it and watch the locks
- To fix a bug, write a test that fails first, then fix it (`principle-fix-root-cause`); for the general test framework see `testing-standards`

## 7 · Database-specific security

- 1 app, 1 database user, with only the permissions it uses; the app must never use `sa` · `postgres` · `root`, and the user that runs migrations must be separate from the user the app uses at run time
- For dynamic SQL with values from users, pass the values as parameters, and choose table or column names from an allowlist and then quote them

Examples of `sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` → [`references/snippets.md`](references/snippets.md)

- If the data of several companies is in one table, consider row-level security: SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY` (the table owner bypasses the policy unless `FORCE ROW LEVEL SECURITY`)
- Personal data columns (national ID number · phone number · address) are not pulled unless used; SQL Server's Dynamic Data Masking helps hide values on display but is not access control; for details see `pdpa-compliance`
- Changes to important data must leave a trace of who did it (`audit-trail`)

## 8 · Check before sending

- [ ] Every outside value is a parameter · no `SELECT *`
- [ ] Checked NULL · half-open date ranges · division · parameter types match the columns
- [ ] Looked at the real plan on near-real data, noted logical reads or time before/after · every new index can say which query it serves
- [ ] Scripts can be rerun and big data goes in batches
- [ ] Transaction + check row counts before `COMMIT` · wrote the way back and confirmed a backup exists
- [ ] There is a test that runs against the same kind of database as production

## 9 · Connecting to other skills

Table design and expand-and-contract migrations → `database-design` · rerunnable scripts → `principle-safe-to-rerun` · Excel/CSV → `data-import-export` · who changed what → `audit-trail` · injection and permissions → `principle-secure-by-default` · Thai Buddhist Era dates, Thai sorting → `i18n-and-locale` · connection string → `config-and-secrets` · migrations in the pipeline → `cicd-and-release`


## reference: performance.md

# Making it fast — read the plan · indexes · paging · big jobs (full version)

Read this when a query is slow or you are adding an index · the short rules are in `SKILL.md` section 3

| engine | Command to see the real plan |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON;` + open the Actual Execution Plan (in SQL Server Management Studio (SSMS) press `Ctrl+M`), then look at logical reads |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` beware that `ANALYZE` really runs the statement; for UPDATE/DELETE wrap it in `BEGIN ... ROLLBACK` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE SELECT ...` |

What to look for in a plan: a scan of a whole big table · expected vs actual row counts far apart (stale statistics) · key lookups repeated thousands of times · a sort or hash that spills to disk

- **sargable** means a condition that can use an index; never wrap an indexed column in a function
  - Wrong: `WHERE YEAR(created_at) = 2026` → right: `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`
  - Wrong: `WHERE LOWER(email) = @e` → right: store email in lower case from the start, or make an index on an expression (PostgreSQL) or a computed column + index (SQL Server)
  - Wrong: `WHERE name LIKE '%สมชาย'` cannot use an index; if you must search the middle of a word, use full-text search
- **covering index**: put the columns the query reads in `INCLUDE (...)` (SQL Server · PostgreSQL 11+) so it need not go back to read the table; MySQL has no `INCLUDE`, so append them to the key instead
- Every index you add must answer which query it serves, because every index makes INSERT/UPDATE slower
- **For deep paging** use keyset instead of `OFFSET`, because `OFFSET 100000` must read and throw away 100,000 rows every time

```sql
-- keyset: ส่งค่าแถวสุดท้ายของหน้าก่อนมาเป็น parameter
SELECT id, created_at, total_amount
FROM orders
WHERE (created_at, id) < ($1, $2)   -- PostgreSQL ($1, $2) · MySQL (?, ?) · ส่งค่าแถวสุดท้ายของหน้าก่อน
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- SQL Server: WHERE created_at < @c OR (created_at = @c AND id < @id) · ใช้ TOP (50)
```

- **N+1 from an Object-Relational Mapper (ORM)**: a loop that loads children one row at a time → 1 screen fires 201 queries; turn on the ORM's SQL log and count, then fix with `Include` (EF Core) · `selectinload` (SQLAlchemy) · `include` (Prisma)
- **parameter sniffing (SQL Server)**: a plan is built from the first value passed and reused with values that are distributed very differently → some customers are fast, some are 100 times slower
  - Fixes from lightest to heaviest: SQL Server 2022+ compatibility level 160 has Parameter Sensitive Plan optimization · `OPTION (RECOMPILE)` for queries that run rarely · `OPTIMIZE FOR` · force a plan through Query Store
  - Never fix it by clearing the plan cache of the whole server
- **statistics**: after loading a big batch of data, run `UPDATE STATISTICS dbo.orders` or, in PostgreSQL, `ANALYZE orders`
- **Big UPDATE/DELETE** in batches, for example 5,000 rows, because doing a million rows in one batch locks the whole table, grows the log, and takes just as long to roll back

```sql
-- SQL Server: ลบทีละ 5,000 แถวจนหมด
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.audit_logs WHERE created_at < @cutoff;
    IF @@ROWCOUNT < 5000 BREAK;
END
-- PostgreSQL: DELETE FROM audit_logs WHERE id IN (SELECT id FROM audit_logs WHERE created_at < $1 LIMIT 5000); วนจากแอปหรือ procedure
```

## Indexes for a small share of rows, and bloated tables (SKILL.md section 5)

```sql
-- PostgreSQL · partial index: index เฉพาะแถวที่ query กรองเสมอ
CREATE INDEX CONCURRENTLY ix_orders_pending ON orders (created_at) WHERE status = 'pending';
-- SQL Server · filtered index แบบเดียวกัน (query ต้องมี WHERE status = 'pending' ตรงตัว)
CREATE INDEX ix_orders_pending ON dbo.orders (created_at) WHERE status = 'pending';

-- PostgreSQL · ตารางบวมหลังลบหรืออัปเดตก้อนใหญ่
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables WHERE n_dead_tup > 10000 ORDER BY n_dead_tup DESC;
VACUUM (VERBOSE, ANALYZE) orders;          -- ปกติ
REINDEX INDEX CONCURRENTLY ix_orders_pending; -- index บวม

-- SQL Server · index แตกเป็นชิ้น
SELECT i.name, s.avg_fragmentation_in_percent, s.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('dbo.orders'), NULL, NULL, 'LIMITED') s
JOIN sys.indexes i ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE s.page_count > 1000;
ALTER INDEX ix_orders_pending ON dbo.orders REORGANIZE; -- < 30%
ALTER INDEX ix_orders_pending ON dbo.orders REBUILD WITH (ONLINE = ON); -- >= 30% (Enterprise/Azure)
```


## reference: safe-changes.md

# เปลี่ยนข้อมูลอย่างปลอดภัย — ตารางเทียบ engine และตัวอย่าง (ฉบับเต็ม)

อ่านเมื่อเขียนสคริปต์แก้ข้อมูล upsert หรือ ALTER TABLE · กฎย่ออยู่ใน `SKILL.md` ข้อ 4

| เรื่อง | SQL Server | PostgreSQL | MySQL (InnoDB) |
|---|---|---|---|
| isolation เริ่มต้น | READ COMMITTED แบบ lock ส่วน Azure SQL Database เปิด Read Committed Snapshot Isolation (RCSI) ให้แล้ว | READ COMMITTED (อ่านจาก snapshot ไม่บล็อกคนเขียน) | REPEATABLE READ |
| upsert ที่รันซ้ำได้ | `UPDATE` แล้ว `INSERT ... WHERE NOT EXISTS` ใน transaction พร้อม `UPDLOCK, HOLDLOCK` | `INSERT ... ON CONFLICT (...) DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` |
| สร้าง index ไม่ล็อกตาราง | `WITH (ONLINE = ON)` ใช้ได้เฉพาะ Enterprise (รวม 2025) | `CREATE INDEX CONCURRENTLY` แต่รันใน transaction ไม่ได้ | `ALGORITHM=INPLACE, LOCK=NONE` |

- ถ้า SQL Server มีคนอ่านบล็อกคนเขียนบ่อย ให้พิจารณาเปิด `READ_COMMITTED_SNAPSHOT ON` แต่จะเพิ่มภาระ tempdb จึงต้องทดสอบก่อน
- ป้องกัน deadlock: ทุกโค้ดแตะตารางเรียงลำดับเดียวกัน ทำ transaction ให้สั้นที่สุด และไม่รอ API ภายนอกขณะถือ transaction
- สคริปต์ทุกตัวต้องรันซ้ำได้ (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- ก่อนคำสั่งที่ลบหรือแก้ข้อมูลจำนวนมาก: backup ตารางที่โดน หรือยืนยันว่า backup ล่าสุด restore ได้จริง แล้วเขียนวิธีย้อนกลับไว้ก่อนรัน
- นับแถวที่คาดไว้ก่อน แล้วตรวจก่อน `COMMIT`:

```sql
BEGIN TRAN;
UPDATE dbo.orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < @cutoff;
IF @@ROWCOUNT <> @expected
BEGIN ROLLBACK; THROW 50001, 'จำนวนแถวไม่ตรงกับที่นับไว้', 1; END
COMMIT;
-- PostgreSQL: ใน DO block ใช้ GET DIAGNOSTICS n = ROW_COUNT; ไม่ตรง → RAISE EXCEPTION
```

- `ALTER TABLE` บนตารางใหญ่:
  - PostgreSQL ขอ lock `ACCESS EXCLUSIVE` แล้วรอ query ยาวที่ค้างอยู่ ระหว่างรอ query ใหม่ทุกตัวก็ต่อคิวด้วย จึงต้องตั้ง `SET lock_timeout = '5s'` แล้ว retry
  - PostgreSQL 11+ เพิ่มคอลัมน์ที่มี default คงที่ได้ทันที แต่การเปลี่ยนชนิดคอลัมน์จะเขียนตารางใหม่ทั้งก้อน
  - SQL Server เพิ่มคอลัมน์ `NOT NULL` พร้อม default ทำได้ทันทีเฉพาะ Enterprise ส่วน edition อื่นต้องเขียนทุกแถว
  - ถ้าเปลี่ยนชนิดหรือย้ายข้อมูล ให้ทำแบบ expand-and-contract ตาม `database-design`


## reference: snippets.md

# ตัวอย่างโค้ดสั้น — เวลาไทย · dynamic SQL

กฎอยู่ใน `SKILL.md` ข้อ 2 และ 7

## แปลงเวลา UTC เป็นเวลาไทยตอนแสดง (ข้อ 2)

```sql
-- แปลงเวลา UTC เป็นเวลาไทยตอนแสดง
SELECT created_at AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'  -- SQL Server (ชื่อโซนแบบ Windows)
FROM dbo.orders;
SELECT created_at AT TIME ZONE 'Asia/Bangkok' FROM orders;                  -- PostgreSQL (คอลัมน์ timestamptz)
```

## dynamic SQL ที่ส่งค่าเป็น parameter (ข้อ 7)

```sql
-- SQL Server
EXEC sp_executesql N'SELECT id, name FROM dbo.customers WHERE email = @email',
                   N'@email nvarchar(320)', @email = @input;
-- ชื่อคอลัมน์: QUOTENAME(@column) หลังตรวจกับ allowlist
-- PostgreSQL ใน plpgsql
EXECUTE format('SELECT id, name FROM %I WHERE email = $1', tbl) USING p_email;
```

## ตรวจว่ามี collation ไทยหรือไม่ (ข้อ 2)

- PostgreSQL มี `th-TH-x-icu` เมื่อ server build ด้วย International Components for Unicode (ICU) ตรวจได้ด้วย `SELECT collname FROM pg_collation WHERE collname LIKE 'th%'`
- MySQL ตรวจ collation ไทยที่มีด้วย `SHOW COLLATION LIKE '%thai%'` ก่อนเลือก


---

# skill: stack-mql

Use when writing MQL4 or MQL5 code for MetaTrader

# stack · MQL — an Expert Advisor (EA) that sends orders correctly, on every broker, every time

> **One rule:** every order goes through the pre-send checker and every returned result is read · an EA that "works in the tester" but does not check is not done.

For EAs · indicators · scripts on MetaTrader 4 (MT4) and MetaTrader 5 (MT5) · strategy, risk and backtest criteria live in the project's trading spec (if using the repo's prompt set: `prompt/software-development/prompt-trading-system.md` — someone who installed only the plugin will not have this file; ask the owner for the spec) · general principles are in `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns`

## 1 · Start: know which platform you are writing for

- `.mq4` file = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = an include that can be shared if the differing parts are separated behind `#ifdef __MQL5__`
- In MQL4 put `#property strict` in every file (without it the compiler lets data-type bugs through)
- Compiling and testing need a terminal (Windows, or the Wine build MetaQuotes distributes for macOS / Linux) · on a machine without one → write in the report "ยังไม่ได้ compile" (not yet compiled); never say it passed

| Step | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| compile result | a `.log` file next to the source file · 0 errors 0 warnings | same |
| backtest from the command line | `terminal64.exe /config:"tester.ini"` (section `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + an MT4-style config file (fewer options) |

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/start_advanced/start · re-check this page before use

## 2 · Differences that break a port between MT4 and MT5

| Topic | MT4 | MT5 |
|---|---|---|
| order model | an order = a position (`OrderSend` · `OrderSelect` · `OrdersTotal`) | order · position · deal are separate · use `CTrade` (`Trade\Trade.mqh`) |
| account | always hedging | netting or hedging → read `ACCOUNT_MARGIN_MODE` · netting allows 1 position per symbol |
| order filling | no choice | FOK / IOC read from the flags in `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN works in every mode except Market Execution · pending orders use RETURN |
| indicator | returns the value at once (`iMA(...)`) | create the handle once in `OnInit`, then `CopyBuffer` · release it in `OnDeinit` |
| order send result | `GetLastError()` (130 invalid stops · 134 not enough money · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = success · 10004 requote · 10014 invalid volume · 10015 invalid price · 10016 invalid stops · 10018 market closed · 10019 not enough money · 10030 invalid filling) |
| order events | none; you must poll | `OnTradeTransaction` |

## 3 · The pre-send order checker (every order, every time)

| Check | Do this | What you hit if you skip it |
|---|---|---|
| volume | round down to `SYMBOL_VOLUME_STEP` · between `SYMBOL_VOLUME_MIN` and `SYMBOL_VOLUME_MAX` | 10014 · error 131 |
| price | `NormalizeDouble(price, _Digits)` | 10015 |
| Stop Loss (SL) / Take Profit (TP) | at least `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` away from the current price | 10016 · error 130 |
| modifying an order | do not modify when the price is within `SYMBOL_TRADE_FREEZE_LEVEL` · do not resend the same values | rejected · 10025 no changes |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) before sending | 10019 · error 134 |
| order count | less than `ACCOUNT_LIMIT_ORDERS` (0 = unlimited) | rejected |
| symbol | `SYMBOL_TRADE_MODE` is not disabled · market is open | 10018 |
| MT5 whole set | `OrderCheck()` before `OrderSend()` | an error that cannot tell which item is wrong |

- Read every returned result · requote / off quotes → retry at most 3 times, with a new price each time · not enough money / invalid stops → do not retry; log and stop that trade.
- pip and point are not equal: a 5-digit price (or 3-digit for JPY pairs) → 1 pip = 10 points · if the user enters input in pips, convert at a single place.
- **Traps where the code looks right but really breaks** (adapted from ThomasPraun/mql-developer · MIT): `double` cannot be compared with `==`; `NormalizeDouble` both sides or compare against a tolerance · in MT4, closing several orders must loop from `OrdersTotal()-1` down to 0 because the index shifts after a close · some ECN brokers do not accept SL/TP in `OrderSend`, so send first and then `OrderModify` · `WebRequest` blocks until it gets a reply and cannot be used in indicators and the tester · one MT4 terminal can trade with only one EA at a time (error 146); wait and retry, do not resend at once · a series array has index 0 = the latest bar; always mark with `ArraySetAsSeries`, never guess the direction.

Sample code for each checker item → https://www.mql5.com/en/articles/23204 (read it and write your own; do not copy the whole file)

## 4 · An EA structure that is easy to read and recoverable

- `OnInit` validates every input (wrong value → `INIT_PARAMETERS_INCORRECT`) · create handles · `OnDeinit` releases the handles.
- Do heavy logic once per new bar (compare `iTime(_Symbol, _Period, 0)` with a remembered value), not on every tick.
- A magic number per EA + symbol + strategy · count and manage only orders whose magic matches; never touch manual orders or another EA's.
- **Never keep important state only in a variable:** a terminal restart → state is lost · `OnInit` rebuilds state from the positions/orders with a matching magic · values that cannot be rebuilt (such as today's loss total) are stored with `GlobalVariableSet` or a file in `MQL5\Files` / `MQL4\Files`.
- Time: use server time (`TimeCurrent`) to decide bars and sessions · each broker's server time is not Thai time and shifts with daylight saving · in the tester `TimeGMT()` always equals the simulated server time (source: https://www.mql5.com/en/docs/dateandtime/timegmt) → news and session filters based on Greenwich Mean Time (GMT) must take the offset as an input.
- 1 function, 1 job: signal · lot size · sending the order · managing open orders are kept separate · the signal is a pure function that takes bar data and returns a result (testable in a script).
- Log every decision to send or not send an order: server time · symbol · reason · price · spread · returned result · do not log every tick.

## 5 · test

- **script test:** test the signal and lot-size functions with a script that feeds fixed data and compares the result (MQL has no standard test framework).
- **backtest:** MT5 uses the "Every tick based on real ticks" mode for results used to decide · MT4 reports modelling quality every time · spread · commission · swap are set to the real account, not 0.
- **Test under several conditions:** at least 3 symbols with different digits (such as EURUSD · USDJPY · XAUUSD) · at least 2 timeframes · netting and hedging accounts (MT5) · a capital so small the minimum lot cannot be sent.
- **Do not judge from optimized results:** use MT5's forward period or split in-sample / out-of-sample yourself · the reported numbers are the results of the period not used for optimizing.
- `OnTester()` returns the criterion the spec defines (such as profit factor with drawdown under the limit) so the optimizer picks by the real criterion, not maximum profit.

## 6 · Selling on the MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system (item 7) is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the item 3 checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## 7 · Security and self-sale

- Trading account passwords · API keys · license keys never go in the code or `.set` · for values that must be kept, use an input the user types on their own machine.
- `WebRequest` works only with URLs the user added to the terminal's own allow list · say in the manual which URLs must be added.
- Self-sale (not through the Market): lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit` · do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.

## 8 · Pre-submit checklist

- [ ] compiles with 0 errors 0 warnings (or the report says it was not compiled because there is no terminal)
- [ ] every order passes the item 3 checker · every returned result is read and logged
- [ ] magic number · state can be rebuilt after a restart · orders with a non-matching magic are untouched
- [ ] every input has a default and a range checked in `OnInit`
- [ ] backtest uses real spread · commission · swap · the reported result comes from a period not used for optimizing
- [ ] tested on at least 3 symbols · 2 timeframes (· netting and hedging for MT5)
- [ ] selling on the Market: no DLL · no account or symbol lock · the description promises no profit

## 9 · Link to other skills

Only a `.ex5` and no `.mq5` (the source is lost, or you want one that trades the same way) → `reverse-engineering`, file `references/mql5-ex5.md`: extract the behavior in the Strategy Tester and rewrite it under the rules of this file · do not decompile.

Backtest formulas and statistics → agent `quant-analyst` · general tests → `testing-standards` · logs → `logging-standards` · secrets → `config-and-secrets` · small checkable steps → `principle-small-verifiable-steps` · selling and pricing → the repo's `prompt/software-development/prompt-sell-product.md` (if using the prompt set)


---

# skill: e2e-testing-patterns

Use when writing end-to-end tests or fixing flaky ones

> **ใน SuperUser:** ถ้าอยากให้ agent รันแอปและพิสูจน์ผลเอง ให้ใช้ [`app-verifier-setup`](../app-verifier-setup/SKILL.md) ส่วน skill นี้คือหลักออกแบบชุดทดสอบ E2E (end-to-end) ที่ verifier นั้นเรียกใช้

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a continuous integration and continuous delivery (CI/CD) pipeline
- Migrating from one framework to another

## When NOT to use

| Task | Use instead |
|---|---|
| Writing manual test cases (steps, expected result) | `test-case-template` |
| Unit or integration tests, test ratio and scope | `testing-standards` |

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/page-object-model.md](references/page-object-model.md) | ถ้าจะตั้งโครงชุดทดสอบใหม่ หรือเจอเทสต์ที่ลอกขั้นตอนล็อกอินซ้ำกัน ให้เปิดดูโค้ดเทียบแบบไม่ดีกับแบบ Page Object |
| [references/test-data-strategies.md](references/test-data-strategies.md) | ตอนเลือกวิธีเตรียมข้อมูลทดสอบ และอยากเห็นข้อดีข้อเสียของทั้ง 4 แบบพร้อมโค้ดตัวอย่าง |
| [references/flaky-tests.md](references/flaky-tests.md) | ถ้าเทสต์ผ่านบ้างไม่ผ่านบ้าง ให้เปิดดูโค้ดเทียบการรอแบบ sleep กับการรอตามเหตุการณ์ |
| [references/auth-in-e2e.md](references/auth-in-e2e.md) | ตอนวางวิธีล็อกอินในชุดทดสอบ และต้องการโค้ด `storageState` หรือการฉีด cookie ผ่าน API |
| [references/ci-and-parallel.md](references/ci-and-parallel.md) | ตอนตั้งการรันขนานหรือแบ่งรอบการรัน E2E ใน CI และต้องรู้ว่าต้องเก็บไฟล์อะไรเมื่อเทสต์ล้ม |
| [references/coverage-and-libraries.md](references/coverage-and-libraries.md) | ตอนทำตารางความครอบคลุมของเส้นทางผู้ใช้ หรือย้ายคำสั่งระหว่าง Playwright กับ Cypress |
| [references/oracle-and-mutation.md](references/oracle-and-mutation.md) | ถ้ามีระบบเดิมให้เทียบ (differential) · จะเทียบโครงสร้างหน้าด้วย accessibility tree · อยากรู้ว่าชุดทดสอบจับบั๊กได้จริงไหม (mutation) · หรือต้องบันทึกแล้วเล่นซ้ำคำขอเครือข่ายให้นิ่ง |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: ~5% of tests (same pyramid as testing-standards)
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: ~20%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: ~75%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** (recommended) | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> **Default recommendation: Playwright** — best developer experience, fast, cross-browser, made by Microsoft

## Test Structure: Page Object Model (POM)

ถ้าทุกเทสต์เขียน `page.fill` และ `page.click` ของหน้าเดียวกันซ้ำ ๆ ให้ย้ายขั้นตอนเหล่านั้นไปไว้ในคลาสของหน้านั้น แล้วให้เทสต์เรียกเมธอดแทน โค้ดเทียบอยู่ใน [references/page-object-model.md](references/page-object-model.md)

> **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

ถูก: Role + accessible name      page.getByRole('button', { name: 'Submit' })
ถูก: Test IDs                     page.getByTestId('submit-btn')
กลาง: Visible text              page.getByText('Submit')
กลาง: Label                     page.getByLabel('Email')
ผิด: CSS classes               page.locator('.btn-primary')
ผิด: Tag + index               page.locator('button:nth-child(3)')
ผิด: XPath                        page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

มี 4 แบบ คือ shared test DB · per-test setup · API setup กับ UI verification · database snapshot กับ rollback
แบบที่แนะนำคือ **Option 3: API setup, UI verification (best)** — เตรียมข้อมูลผ่าน API ให้เร็วและแน่นอน แล้วค่อยทดสอบ UI จริง ส่วน shared test DB ทำให้เทสต์พึ่งลำดับกัน รันขนานยาก และข้อมูลปนกัน ส่วนข้อดีข้อเสียครบทุกแบบอยู่ใน [references/test-data-strategies.md](references/test-data-strategies.md)

## What to Test E2E (Not Everything!)

### ถูก: DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

ให้ทำตารางความครอบคลุมของเส้นทางผู้ใช้ (Critical Path Coverage Matrix) ที่บอกว่าแต่ละเส้นทางครอบคลุมแล้วหรือยัง และสำคัญระดับ P1 P2 หรือ P3 (scale เดียวกับ `test-case-template` และ tag ด้านล่าง · P1 สำคัญสุด) ตัวอย่างอยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)

## Expected Values and Failing Tests

ชุด E2E ที่แปลงมาจากแผนทดสอบ (`test-case-template`):

- ชื่อ test ขึ้นต้นด้วยรหัส TC · tag `@<module>` `@P1|@P2|@P3` · ใส่ผลที่คาดหวังและ oracle เป็น annotation
  `test.info().annotations.push({ type: 'expected', description: '฿760 · [D] BR-03' })`
- ค่าที่คาดหวังเป็นค่าคงที่จากแผน · ห้ามอ่านค่าจากหน้าจอแล้ว assert กลับ เช่น อ่านราคาจากการ์ดแล้วเทียบยอดรวม → ผิดทั้งคู่ก็ผ่าน
- reset ข้อมูลก่อนทุก TC (API reset หรือ seed) · ล็อก "วันนี้" ด้วย `page.clock.setFixedTime()` · `timezoneId` · `locale` ใน config
- TC ที่มี **Check when** `หลังรีโหลด` → `page.reload()` แล้ว assert อีกครั้ง
- รันทุกเบราว์เซอร์ที่แผนระบุ · เกณฑ์ผ่านคิดแยกทีละเบราว์เซอร์
- test ล้ม → ห้ามแก้ค่าที่คาดหวัง · จำแนก `app` / `plan` / `test` ตาม agent `qa-tester` ลง `triage.json` · ใน CI ห้าม retry จนผ่านแล้วถือว่าจบ

## Fighting Flaky Tests

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |
| Click times out "not visible/stable" but the site works | The tab may be in the background (`document.visibilityState === "hidden"`, common with Playwright MCP sharing one browser). Check with `browser_evaluate`, switch to the tab, then click. Do not retry blindly |

ห้ามใช้ `page.waitForTimeout` รอแบบกำหนดเวลา ให้รอเหตุการณ์จริง เช่น response ของ API แทน โค้ดเทียบอยู่ใน [references/flaky-tests.md](references/flaky-tests.md)

### Retry strategy
- **In CI:** retry at most 1 time, **only to collect a trace** (`retries: 1` + `trace: 'on-first-retry'`)
- **Pass on retry = flaky, not a pass** — report it as flaky and fail the run (`failOnFlakyTests: true` in `playwright.config.ts`, Playwright 1.52+) — the same rule as "Expected Values and Failing Tests" above and `testing-standards` (flaky test: fix or delete, never retry until green)
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Quarantine has an expiry date** (idea from ECC e2e-testing): tag the test `@flaky` with an issue link and a date (`test('checkout total @flaky', { annotation: { type: 'quarantine', description: 'until 2026-11-15 · issue #123' } }, ...)`), run the `@flaky` set as a separate non-blocking job so the signal is not lost, and have CI fail when today is past the date — the test is then fixed or deleted, never extended twice
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

อย่าล็อกอินผ่าน UI ในทุกเทสต์ เพราะช้า เปราะ และโค้ดซ้ำ ให้ล็อกอินครั้งเดียวแล้วแชร์สถานะ (`storageState`) หรือดีกว่านั้นคือล็อกอินผ่าน API แล้วฉีด cookie เข้า browser context โค้ดทั้งสามแบบอยู่ใน [references/auth-in-e2e.md](references/auth-in-e2e.md)

## Parallelization and CI

เงื่อนไขก่อนรันขนาน (Requirements for safe parallel) อยู่ใน [references/ci-and-parallel.md](references/ci-and-parallel.md)

แบ่ง E2E ใน CI เป็น 3 รอบ คือ smoke ทุก pull request (PR) บน Chromium ตัวเดียว ที่ล้มแล้วบล็อกการ merge → full ตอน merge เข้า main และทุกคืน บน Chromium + WebKit (จอ iPhone) → pre-prod ก่อน deploy ที่ต้องผ่าน P1 และ P2 บนครบ 3 browser (เพิ่ม Firefox) เมื่อเทสต์ล้มต้องเก็บ screenshot · video · trace · console log · network log ไว้เสมอ ส่วนระดับการรันขนานตาราง browser แต่ละรอบ และรายละเอียดของแต่ละรอบอยู่ใน [references/ci-and-parallel.md](references/ci-and-parallel.md)

## Anti-patterns

- **Testing implementation details** — selectors based on internal structure
- **Long monolithic tests** — one test with 50 steps is hard to debug
- **Coupled tests** — Test B depends on Test A having run
- **Hidden state** — tests behave differently depending on order or data
- **Manual cleanup** — relying on people to reset the environment
- **No quarantine** — failing tests get merged anyway because "it's flaky"
- **Mocking everything** — at this layer, use the real integrations, or it's not E2E
- **Expected value read from the page** — the bug becomes the expectation

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

ตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress (Library Quick Reference) อยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)


## reference: auth-in-e2e.md

# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

สามวิธีล็อกอินในชุดทดสอบ เรียงจากแย่ไปดี พร้อมโค้ดตัวอย่างของ Playwright

## Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## Better: API login (no UI)
```typescript
// page.request shares its cookie jar with the page's browser context,
// so the Set-Cookie from the login response is already in the browser — no addCookies needed.
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  expect(response.ok()).toBeTruthy();
}

// Or once for the whole run (global setup), saved for every test:
// const ctx = await request.newContext({ baseURL });
// await ctx.post('/api/login', { data: user });
// await ctx.storageState({ path: 'playwright/.auth/user.json' });
```

> **Security:** The saved state file holds a live session (cookies, tokens). Keep it out of git: add `playwright/.auth/` (or your `auth.json`) to `.gitignore`, and use a test account only.


## reference: ci-and-parallel.md

# Parallelization and CI Integration

Parallelism levels, the end-to-end (E2E) run tiers in continuous integration (CI), and the files to keep when a test fails.

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | Low (just enable) |
| Test-level within file | 10x+ | Med (isolation needed) |
| Sharded across CI workers | Nx | Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | High (cost) |

**Requirements for safe parallel:**
- Tests don't share state
- Unique test data per test
- Database/external services support concurrency

**Agree on rules before running many agents or workers at once** (example from an online-shop test job where a reset wipes the data of the whole server, run with 6 agents at once):

| Rule | Prevents |
|---|---|
| Reset once before the combined run starts; no agent resets during the run (set a variable such as `PP_SKIP_RESET=1`), and each agent keeps its results in its own folder | deleting each other's data and result files |
| Tests that buy things use different products, and never one that another test is checking stock on | stock collisions |
| New-account emails include `{run}` (project name + run start time) | a second run getting "อีเมลนี้ถูกใช้แล้ว" ("this email is already used") (one plan had 30 tests that could not be re-run; 0 after the fix) |
| Tests that hit the rate limit use their own account and run last | counters carrying over across tests |
| Tests that use shared central state and cannot be separated → `workers: 1` · `fullyParallel: false` | randomly wrong results |

## CI Integration

### Run E2E tier
```yaml
# Smoke (every pull request (PR), 2 min)
- 5-10 critical tests
- Chromium only → feedback เร็ว
- Fail = block merge

# Full (merge to main + nightly, 30 min)
- All E2E tests
- Chromium (desktop) + WebKit (iPhone viewport)
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P1 + P2 tests (test-case-template scale: P1 = most important)
- Chromium + WebKit + Firefox (ครั้งเดียวก่อน release)
- Must pass before prod deploy
```

### Browser matrix

Do not run all 3 browsers every round → CI time grows ~3x and flaky tests grow with the number of browsers.

| Browser | Covers | When to run |
|---------|----------|-----------|
| Chromium | Chrome · Edge (most users) | every round |
| WebKit | every browser on iPhone/iPad (including Chrome on iOS) | merge to main · nightly · pre-prod |
| Firefox | small share | pre-prod only · can be dropped if the customer does not use it |

Adjust to real users → look at analytics first; if an enterprise customer mandates Firefox, move it up to the nightly round.

Set them up as projects in Playwright and pick with `--project`.

```ts
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

```bash
npx playwright test --project=chromium                          # PR
npx playwright test --project=chromium --project=webkit-mobile  # main · nightly
npx playwright test                                             # pre-prod (ครบ 3)
```

**Tests that should run across browsers** (tag `@cross-browser`) → places that often break differently per browser:
- date/time input
- file upload · clipboard
- date/number formatting with `Intl`
- CSS layout · scroll · sticky
- video/audio autoplay

Pure-logic tests → Chromium alone is enough.

> Playwright's WebKit is not 100% the real Safari → for work where customers use iPhone a lot, try on a real device once more before release.

### Artifacts to capture
- Screenshots on failure
- Video on failure
- Trace files (Playwright)
- Console logs
- Network logs


## reference: coverage-and-libraries.md

# Critical Path Coverage Matrix และ Library Quick Reference

ตัวอย่างตารางความครอบคลุมของเส้นทางผู้ใช้ และตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✓ | P1 |
| Login → main task | ✓ | P1 |
| Add to cart → checkout → success | ✓ | P1 |
| Search → filter → result | ✓ | P2 |
| Settings → save | ✓ | P2 |
| Admin panel CRUD | ✓ | P2 |
| Password reset | ✓ | P3 |
| Profile edit | Sample | P3 |
```

Priority uses the `test-case-template` scale (P1 = most important, P3 = least), the same as the `@P1|@P2|@P3` test tags.

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


## reference: flaky-tests.md

# Fighting Flaky Tests — ตัวอย่างการรอที่ถูกวิธี

โค้ดเทียบการรอแบบกำหนดเวลากับการรอตามเหตุการณ์ ส่วนตารางสาเหตุและกลยุทธ์การรันซ้ำอยู่ใน `SKILL.md`

## Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```


## reference: oracle-and-mutation.md

# Oracle, structure comparison and mutation — use when an existing system is available to compare against

Source: lessons from a 6-chapter web-clone course (Week 03 of Teaching_CWN2026), measured on 5 app versions · the numbers are results of that job, used as examples, not as criteria · content specific to the cloned website (flight data, container ports) is not carried over.

## 1 · Use the existing system as the answer key (differential testing)

Run the same scenario on the existing system and on our app, then compare the results field by field, instead of writing expected values by hand.

- The result passes only if every compared field matches (example: count + price + name + time, position by position).
- Fetch expected values from the existing system at run time; do not hard-code numbers in the comparison code, except parameters that come from the task.
- For a scenario the existing system cannot answer itself, an **inferred answer key** (computed by yourself) may be used, but first prove the method on cases that have a real answer key · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker (real round: S2 passed even though it had 10 tickets).
- Report a difference as position, row, field, not just "failed" · in the real round, 4 scenarios had one cause, fixed in one place (310 lines of data, 7 lines of code), going from 4/8 → 8/8.
- Remove what is meant to differ before comparing (banners, brand names, links to other domains, mock-data labels).

### If you must record and replay (record-replay), keep the existing system stable

| Trap | Do |
|---|---|
| The URL does not match the recorded one character for character (`+` vs `%20`) | `routeFromHAR` matches URL + method + body exactly · you need your own route for the cases that do not match |
| Random values in the URL or body | match POST by body and pick stable keys |
| Results differ every round | freeze the clock (`context.clock.setFixedTime`) · turn off telemetry · cut the network with a last-layer abort |
| Counting rows while the filter box is still open | wait for the count to settle before counting |
| Route order | Playwright tries the one registered later first |
| No recording file | never open the real live site instead; stability is lost |

- Check that it is really stable by running 3 rounds and getting the same result.
- Limit: it can answer only what was recorded; for full coverage, record every scenario first.
- The recording file contains cookies and tokens: do not commit it and do not take it off the machine.

## 2 · Compare page structure with the accessibility tree (`ariaSnapshot`)

Pixel comparison is brittle and can mislead (matching white backgrounds). Structure comparison tells you "what is missing" as a list.

1. Capture the page in the same state.
2. Remove what is meant to differ before comparing (banners, links to other domains, brand names, mock-data labels).
3. Normalize names: strip symbols, turn numbers into `#`.
4. Make `role | name` tokens (button, combobox, textbox can count as one control kind).
5. Compute the Jaccard score of the tokens (intersection ÷ union).
6. Check a list of key elements chosen from the existing system (38 items in the real round) · the existing system must pass all of them first, otherwise the list itself is wrong.
7. Total score = average of the two · give the result as a list of what is still missing.

Caution: Thai has no spaces, so splitting by whitespace fails; use `Intl.Segmenter('th')` · half of the score depends on the list you chose yourself.

## 3 · Mutation testing — examine the test suite with deliberate bugs

Plant bugs one at a time in an app that already passes, then see whether the test suite catches them.

**Count "caught" as pass → fail against the baseline, not "at least 1 failure".** If the baseline already has a red test, the latter criterion passes automatically (real round: raw score 10/10 for both suites, but the strict criterion gave acceptance 8/10 and differential 4/10 · the survivors survived because the related test was already red) · make the baseline green first, then the score can be read.

Steps:

1. Copy the base code to `mutants/base` · write `manifest.json` holding the before and after text of every bug (file + line) · change 1 spot per bug, never combined.
2. Run the baseline first and record the set of failing tests.
3. Per bug: create a compose project with a separate name → wait for the health endpoint (loop with a limited count) → run every test suite → always `down -v --remove-orphans` in `finally`.
4. Do not edit tests to point at a new target; wrap them: load `endpoint.cjs` with `node --require` to change only the baseURL · or write an extra runner that calls the same scenarios.
5. Compute both the raw criterion and the pass → fail criterion · record the additionally failing tests one by one.
6. Check the SHA-256 of the test files before and after · generate the report from a script, not by hand.
7. Tell the user the duration in advance (real round: 11 rounds × 2 suites took 46 minutes because Docker is built every round).

Bugs worth having: reversed sorting · turning off filters one at a time · result count short by 1 · load-more ending at 299 · `<` instead of `≤` · time shifted by 1 hour · wrong code.

Observations:
- The surviving bug was `<` instead of `≤`, because the boundary value was not in the test data; a dedicated boundary-value test is needed.
- Different kinds of suites catch different groups of bugs (acceptance catches several data bugs that differential cannot newly catch, while differential tells the wrong row and field) · use them together.
- 80% and 40% are lower bounds; they do not mean that a bug with no newly failing test certainly slipped through.
- The real round has not yet re-run mutation against the version where differential is green, and had only 10 bugs.

## 4 · Reusable runner

- 1 test per item · a fresh context for every test · no retry · no lowering of criteria · never edit a test.
- Keep it inside the scope: a route cancels navigate requests across origins.
- Locators must be specific: in the real round, a test that passed because it saw only 10 rows broke at once when the data was complete and it found 2 rows.
- Set an evidence-mode switch (e.g. `EVIDENCE=1`): normally run fast with many workers and no video; evidence mode lowers workers, raises timeouts and records video.
- A neutral element finder (control/choice) that supports both `select` and a tap menu lets one test suite run against two apps written differently · the projects differ only in `baseURL`.
- A test must not add things it does not delete (creating a new booking on every run = not idempotent).
- A popup that blocks a click needs a step that closes the popup first · look at the screenshot and snapshot of the failed test, not only the error text (real round: "cannot click the button" was really a popup blocking; root cause: a re-render removed the Escape key listener).
- Measuring an empty page and waiting for the timeout at every step took 24 minutes; it should fail fast.


## reference: page-object-model.md

# Page Object Model (POM) — ตัวอย่างโค้ด

ตัวอย่างเทียบเทสต์ที่ไม่มี abstraction กับเทสต์ที่ใช้ Page Object ใช้ตอนตั้งโครงชุดทดสอบหรือรีวิวเทสต์ที่ลอกขั้นตอนซ้ำกัน

## Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

## Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> **One Page Object per page or major component.**


## reference: test-data-strategies.md

# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

ข้อดีข้อเสียของการเตรียมข้อมูลทดสอบแต่ละแบบ พร้อมโค้ดตัวอย่างของแบบที่แนะนำ

## Option 1: Shared test DB (popular, problematic)
```
Wrong: All tests share same data
Wrong: Order-dependent
Wrong: Hard to parallelize
Wrong: Pollution between tests
```

## Option 2: Per-test setup (slow)
```
Right: Clean slate every test
Mixed: Reliable but slow
Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// Right: Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
Right: Real production-like data
Right: Fast (uses snapshots)
Mixed: Requires DB tooling
```


---

# skill: spec-to-code-loop

Use when building test-first from a spec and mockups

> **In SuperUser:** this loop is the core of the playbooks [`feature`](../superuser/references/playbook-feature.md) and [`new-project`](../superuser/references/playbook-new-project.md). If superuser is open, follow the playbook and use this file as the detail of the loop.

# The loop from requirements to code

> **The one rule:** the loop needs a stop condition that **gives a result the moment you run it**.
> "Finish implementing the requirements" cannot be checked by a machine, while "all 47 tests are green" can.

---

## What you must have before starting

| What you need | If missing |
|---|---|
| Requirements that are each testable, with an ID such as `FR-AUTH-010` (FR = Functional Requirement) | Stop and use `srs-writing` to make them testable first |
| A 1-line test command that really runs | Stop and set up the test skeleton first, using `testing-standards` |
| A command to run the app and look at it (if there are screens) | Skip the image-comparison step for now, and tell the user it was skipped |
| Mockup images named to match the screens | Ask the user, otherwise the UI will never match |

**Starting without all of these amounts to writing code that nobody can tell is right or wrong**

---

## 1 · Round zero — plan, no code yet

Read the requirements and mockups in full, then break them into sub-tasks, **1 requirement per task**
and write them to `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | milestone | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | M2 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | ค้างอยู่ | |
| 2 | FR-AUTH-020 | M2 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | ค้างอยู่ | |
```

The `milestone` column takes an `M…` ID from the project plan or the timeline in `BUILD-PLAN.md` (playbook `new-project` step 1) · no timeline → may be empty

**Documents conflict → follow the order, do not guess** — write a 1-line priority order of the documents at the very top of `BUILD-PLAN.md` before splitting the work, for example `ลำดับเอกสาร: TEST-DATA.md > REQUIREMENTS.md > DESIGN.md > mockup` (document order: …)
- The user has already set an order → use it
- Not set → use the default: test data with expected values (the clearest numbers) > requirements (Software Requirements Specification — SRS) > design document > mockup, and log it in `decision-log` with `(รอยืนยัน)` (awaiting confirmation)
- A real conflict found → follow the higher-ranked document, and record the conflicting pair (file · section · both values) under "ค้างอยู่" (pending) for the owner to fix the source · never edit the source documents yourself

**If an item is so ambiguous that you cannot write a test, do not guess** — collect it into a list of questions at the end of the file, put it under the heading **"ค้างอยู่"** (pending) once, and carry on with the other items

> Questions to ask instead of guessing: what is the boundary value · what must happen on failure ·
> who may see this data · if the item already exists, overwrite or warn

**Check the plan yourself before sending — 5 items, do it yourself, no need to send an agent** (adapted from superpowers `writing-plans` · MIT)

| Item | Ask | If found, do |
|---|---|---|
| Complete | Going through every requirement in the SRS or FSD, can you point to a row in the table | Cannot point → add a row |
| Size | Each row gives a writer 1 sensible thing, not so wide they must guess, not so detailed it becomes code | Wide → split · detailed → leave the signature and the test name |
| Names match | The types · functions · columns that later rows reference are spelled as the first row set them | Different → fix to one name |
| Biting cases | Each kind of input and failure path the requirement implies: which row has a test for it | None → add a test name to the owning row |
| Proportion | A plan many times longer than the requirements = pre-written code, not a plan | Cut the code body to signatures and assertions |

Fix in place when found, no need to check again

At the end of round zero you **must stop** and let the user read the plan first — do not flow on to write code yourself

If building from a single build prompt: read the prompt through before pasting, fix anything that does not match the requirements first, then paste in a fresh session with empty memory to prove the prompt is really complete (reported from the training exercise, not measured against a baseline)

---

## 2 · The loop per requirement

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit (เมื่อได้รับอนุญาตเท่านั้น — ไม่ได้อนุญาต → ใส่ข้อความ commit ที่แนะนำในคอลัมน์ commit พร้อม `(รอ commit)`)
  →  วนข้อถัดไป
```

**Step 2 is the one people skip most, and the costliest to get wrong** — a test that has never been seen red
may pass forever whether the code is right or wrong

**If the user says TDD · test-driven · "write the test first"** — that is this very loop, no need to look for another way: red = steps 1–2 (a test named with the requirement ID, which must really be seen red) · green = step 3 (the least code that makes it green, per `lazy-coding`) · refactor = done during step 4 with the whole test set still green, adding no new behaviour in that round · the unit of 1 round is 1 requirement, not 1 function, so it is smaller than people think and larger than textbook TDD · for test skeleton · run command · ratio of unit to integration see `testing-standards` · no testable requirement → you cannot do TDD yet, go back to "What you must have before starting"

---

## 3 · Iron rules

1. **Never edit or delete a test to make it pass** — a red test means the code is wrong, not the test
   A test may be edited only when you can prove it was written wrongly against the requirement, and you must tell the user every time
2. **1 requirement per round** — never bundle several because "they are similar"
3. **A single requirement may be tried at most 3 rounds** — fails 2 rounds → split into sub-steps, do not retry the same way · 3 rounds reached → **mark it `ติด` (blocked) and follow "After stuck" below**, do not keep trying on and on
4. **Never mock the thing under test** — you may mock external things, you may not mock yourself
5. **Never skip to an easier requirement** before trying 3 rounds — the order in the plan is the real order, and only items already marked `ติด` (blocked) may be skipped

### After stuck — 5 steps

1. **Record why it is stuck** under "ค้างอยู่" (pending): what was tried across all 3 rounds · where you think the problem is · what you need to go on (an answer · data · permission)
2. **Go back to the last point where tests were green** — keep the pending work in a branch `stuck/<ID>` (if not permitted to commit → keep it as a patch at `_to_delete/patches/stuck-<ID>.patch` instead) and return the line of work to where the whole test set is green. The test of the stuck item stays in that branch or patch too, never delete it
3. **Items that wait on the stuck item** are marked `ติด` (blocked) with the reason `รอ <ID>` (waiting for <ID>) without trying, then go to the next item in plan order that does not wait on it
4. **Try 1 more round at the end** — once everything else is done, have a new agent on a larger model try 1 round from branch `stuck/<ID>` (or the kept patch) and record it in step 1 · if an answer is already in the inbox (`.claude/superuser/inbox/`) → start from that answer
5. **Still stuck** → keep `ติด` (blocked) in the closing report, stating what is needed from the user · if the user answers later → continue from that item per the playbook `pickup-and-pause`

---

## 4 · The status file — context will certainly run out

A loop is always longer than one conversation can remember. **State must live in a file, not in the head**

- `docs/BUILD-PLAN.md` — the plan and status. **Read this file before starting every round**
  This is the only file this loop adds to the main documents folder
- Status has only 5 values (the same set as `superuser`): `เสร็จ` (done) · `ทำอยู่` (in progress) · `ติด` (blocked) · `รออนุมัติ` (awaiting approval) · `ค้างอยู่` (pending) — work not yet started uses `ค้างอยู่`
- `ติด` must have a 1-line reason after it
- Every `เสร็จ` item must have a commit number — no number means not really done · except when not yet permitted to commit (commit only when permitted): put the recommended commit message + `(รอ commit)` (awaiting commit) and test evidence (test name + run result) in place of the number, and it may count as `เสร็จ`
- At the end of each round, update the headings `## สถานะล่าสุด` (latest status) and `## ประวัติสถานะ` (status history) at the top of the file per `status-report` — the task table and the status table are in the same file under different headings

**Starting a new round without reading this file first is the number 1 cause of rework**

### Files the loop creates along the way — all go to `_to_delete/`

Requirements documents are often `.docx` or `.pdf` and must be converted to text before they can be re-read correctly.
**A converted file is not a document**, it is a temporary working item of the loop

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| File | Goes where |
|---|---|
| Documents converted to a readable format | `_to_delete/extracted/` |
| Screenshots taken for checking | `_to_delete/check/` |
| Test run results · logs | `_to_delete/logs/` |
| The plan and status `BUILD-PLAN.md` | `docs/` — it is a real document |
| Code and tests | The project folder |

**Never write converted files into `docs/` mixed with the original documents** — in 3 months nobody will know
which file is the real one the customer signed and which a machine converted

Full detail is in `temp-file-discipline`

---

## 5 · Compare to the mockup with a real image

Reading the code and saying "it matches" does not work. You must really open it and look

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

Then open both images and compare by these 5 items:

- [ ] Do the order and grouping of elements match
- [ ] Are spacing and font size close (not pixel-exact)
- [ ] Are all the states the mockup shows present — empty · loading · error
- [ ] Does the text match the mockup, or was it made up
- [ ] Does Thai wrap badly or lose vowels

Wherever they differ, **say so as a list**; do not stay silent and claim done
Screenshots taken for checking are temporary files — they go to `_to_delete/` per `temp-file-discipline`

---

## 6 · Traceability

A test name must contain the requirement ID, for example `test_lockout_after_5_failures_FR_AUTH_020`
so one command can search which requirement has no test covering it

Close the job with a traceability table: every requirement → the test that covers it → the latest result

> **For any requirement with no test covering it, say plainly that there is none** — never write a shallow test to fill the table
> A table that is full because you filled it yourself is more dangerous than a table with gaps

---

## 7 · When to split into multiple agents

**One criterion: the files to be touched must not overlap at all** — see the "files to touch" column in the plan

| Can split | Cannot split |
|---|---|
| Different modules, different screens, files that do not overlap | Touching the same file, even just one — the work will overwrite each other |
| A **read-only** checking agent running alongside an agent that writes code | Work that already has to wait for the result of another task |
| Turning requirements into tests for several modules at once | When there is no plan yet — you need a plan first to know where you can split |

**Each agent that writes files must get its own worktree**, per the recipe in `superuser/references/code-extensions.md` section "parallel-split-and-merge" (including how to handle uncommitted work)

Every agent that is split off must receive: the IDs of the requirements it owns · the list of files it may touch ·
the test command · and all of rule 3

**Never let a split-off agent edit `BUILD-PLAN.md` itself** — have it report back, and the main agent writes the one file
otherwise the status file breaks before the code does

---

## 8 · Signs the loop is breaking

| Symptom | What it really means |
|---|---|
| All tests green from the first round without ever being red | The tests test nothing |
| The number of tests grows faster than the number of requirements closed | Writing tests to make itself pass |
| One commit touches 15 files | Several requirements bundled, cannot be reverted when it breaks |
| The same item loops past 3 rounds | The requirement is ambiguous, not the code hard, so go back and ask |
| Nobody has updated `BUILD-PLAN.md` for 2 rounds | State is in the head, the next round will redo work |
| Numbers improve but people cannot use it (text off-screen, pale colours, input fields cutting words) | The loop is chasing the metric, not solving the problem → item 10 on guards |
| The remaining items can be fixed only by adding fake data or hiding content | The ceiling of the data has been reached → item 10 on stop rules |

---

## 9 · Anti-patterns

- **Throwing the whole requirements document in one round** — the number 1 cause of messy code
- **Writing the code first and the tests after** — you get tests that confirm what was just written, not what is needed
- **Guessing when a requirement is ambiguous** — wrong from the start, but discovered at delivery
- **Editing a test to make it pass** and then reporting done
- **Splitting parallel agents on the same file**
- **Claiming the UI matches the mockup without ever opening it**
- **Closing the job with no traceability table** — nobody knows what is not yet done
- **Faking data, hiding content, or relaxing the criteria** to make numbers look good

---

## 10 · A loop that adjusts by numbers

Use it when the loop chases a metric (match the existing system · match the mockup · a measurable score) rather than closing requirement by requirement · the loop's contract, the guards against gaming the numbers, the stop rules, and a real measured example are in [`references/metric-loop.md`](references/metric-loop.md) · it must be opened and read before starting this kind of loop

---

## 11 · Connecting to other skills

| Need | Use together with |
|---|---|
| Make requirements testable first | `srs-writing` |
| Turn requirements into test cases | `test-case-template` |
| Test skeleton, test framework, names, coverage | `testing-standards` |
| Tests that open a real browser | `e2e-testing-patterns` |
| Write the simplest code that works | `lazy-coding` |
| Fix when a test is red or the result does not match | `targeted-fix` |
| Commit message format | `commit-message-format` |
| Screenshot files taken for checking | `temp-file-discipline` |
| Test sets and metrics for a number-chasing loop | `test-evidence` item 5 · `e2e-testing-patterns` (oracle-and-mutation) |
| Record state across conversation rounds | `handoff` |
| Status summary table at the end of a round | `status-report` |

---

## Abbreviations

- **test** — an automated test suite
- **mockup** — a prototype image of a screen
- **commit** — recording a change into the version control system
- **UI** — User Interface


## reference: metric-loop.md

# ลูปที่ปรับตามตัวเลข

ย้ายมาจาก SKILL.md หัวข้อ 10 (2026-11-10) · เปิดอ่านเมื่อลูปไล่ตัวชี้วัด ไม่ได้ปิดทีละข้อกำหนด


ใช้เมื่อลูปไม่ได้ปิดทีละข้อกำหนด แต่ไล่ตัวชี้วัด เช่น ตรงกับระบบเดิม ตรงกับ mockup หรือคะแนนที่วัดได้ · ที่มา: บทเรียนโคลนเว็บ 6 บท (Week 03 ของ Teaching_CWN2026) วัดจริงบนแอปที่ต่อเวอร์ชัน · ตัวเลขข้างล่างเป็นผลของงานนั้น ใช้เป็นตัวอย่าง ไม่ใช่เกณฑ์

**สัญญาของลูป เขียนไว้ก่อนเริ่ม และให้เครื่องตรวจได้ ไม่ใช่แค่ขอร้อง**

| ส่วน | เขียนว่า |
|---|---|
| สถานะเริ่ม | โฟลเดอร์ว่าง หรือ tag ของรอบก่อน |
| ขอบเขต | แก้ไฟล์ไหนได้ · ตรวจด้วยสคริปต์ที่อ่าน `git diff` |
| ตัววัด | คำสั่งเดียวที่ให้ผ่าน/ไม่ผ่านและตัวเลข · exit 2 = วัดไม่ได้ แยกจาก "ไม่ผ่าน" และไม่นับงบ |
| กฎเก็บ | เก็บเมื่อผ่านเกณฑ์รวม หรือจำนวนหน่วยย่อยที่ผ่านเพิ่มโดยตัววัดหลักไม่ลด · ไม่ตรง → `git revert` |
| กฎหยุด | ครบรอบที่ตั้งไว้ หรือถึงเพดาน (ดูด้านล่าง) |
| งบ | จำนวนรอบ และเวลาต่อรอบ |

**กฎที่เจอว่าต้องมี**

- **ห้ามถอย** — เพิ่มตัวหนึ่งได้ ตัวอื่นที่เคยผ่านต้องยังผ่าน
- **นับเป็นหน่วยย่อย** — ผ่าน 27 จาก 31 รายการ แล้วเป็น 30 วัดได้และเก็บงานได้ แม้ยังไม่ผ่านเกณฑ์รวม
- **เพดานของข้อมูล ไม่ใช่ล้มเหลว** — ข้อที่แก้ได้แค่เพิ่มข้อมูลปลอม แก้ข้อสอบ หรือซ่อนเนื้อหา ให้หยุดไล่ รายงานว่าเป็นเพดาน (รอบจริง: 74 จาก 82 ข้อ)
- **แยกที่มาของคะแนน** — คะแนนที่กระโดดอาจมาจากการใส่ข้อมูลเพิ่มก่อนวน ไม่ใช่จากการวน (รอบจริง: 51 → 73 จากข้อมูล วนจริงเพิ่ม 1 ข้อ)
- **คนสร้างไม่อ่านซอร์สของข้อสอบหรือเฉลย** ใช้ได้แค่รายงานผล และไม่ผูกกับตัวระบุที่ข้อสอบเป็นคนตั้ง (ไม่มีหลักฐานว่าใช้คนละโมเดลแล้วลดความผิดพลาดร่วมได้จริง จึงไม่ถือเป็นกฎ)
- **ข้อสอบของกรรมการต้องผ่านกับต้นฉบับก่อนถึงนับใน gate** — ข้อที่ล้มเพราะข้อสอบเขียนผิดแก้ได้รอบเดียว ข้อที่ล้มเพราะต้นฉบับเปลี่ยนหรือตรวจผ่านหน้าจอไม่ได้ ติดป้าย invalid พร้อมเหตุผลและไม่นับ (ตัวอย่างจากงานนั้น: กรรมการต่างค่ายเขียน 47 ข้อ invalid 25 ข้อ (53%) เหลือ valid 22 ข้อ) · สิ่งที่ช่วยคือ "คำตอบมาจากต้นฉบับ" ไม่ใช่ค่ายของโมเดล: ข้อมูลที่ผิดทั้งสองฝั่ง (ตรงกับจอสดแค่ 278 จาก 300 รายการ) ถูกจับได้เพราะรันซ้ำกับต้นฉบับสด · ไม่มีกลุ่มควบคุม จึงยังไม่รู้ว่าค่ายโมเดลมีผลแค่ไหน · ความน่าเชื่อของข้อสอบดู `test-evidence` ข้อ 5 (ไม่เขียนซ้ำ)
- **หัวหน้าวัดซ้ำเองทุกตัวเลขหลังรอบจบ** ไม่เชื่อรายงานของ agent ที่แก้

**ล็อกโครงสร้างก่อน แล้วค่อยจูนหน้าตา** (สีสัน ระยะ ขนาด)

1. ขั้น 1 ทำโครงสร้างและเนื้อหาให้ครบ โดยค่าหน้าตาทั้งหมดอ้างตัวแปรในไฟล์ค่าไฟล์เดียว ห้ามเขียนตัวเลขหรือสีตรง ๆ ในไฟล์อื่น
2. ล็อก: hash ของต้นไม้โครงสร้างที่ทำให้นิ่งแล้ว · สคริปต์ตรวจ `git diff` ว่าขั้น 2 แตะแต่ไฟล์ค่า · ห้ามเพิ่มหรือลบชื่อตัวแปร
3. ขั้น 2 จูนเฉพาะค่าในไฟล์นั้น · ตัววัดเร็วต้องตรงตัววัดเต็มทุกพิกเซลก่อนเริ่มและหลัง build ทุกรอบ (รอบจริงเคยเบี่ยง 51,960 กับ 53,255 เพราะน้ำหนักฟอนต์)

เหตุผล: โครงสร้างขยับตัวเลขได้ราว 18 จุด ส่วนหน้าตาราว 2–3 จุด · ข้อจำกัด: จูนได้แค่ค่าต่อเนื่อง ถ้าเลย์เอาต์ผิด (แถวแรกอยู่ y=602 ต้นฉบับอยู่ราว 399) ขั้น 2 ไปไม่ถึง ต้องตรวจเลย์เอาต์ก่อนล็อก

**ตัวกันไม่ให้เครื่องโกงตัวเลข (Goodhart)** — รอบทดลอง optimizer ลด visual diff ด้วยการดันเนื้อหาพ้นจอ เปลี่ยนสีข้อความให้กลืนภาพ และบีบช่องกรอกจนชื่อเมืองถูกตัด

| ตัวกัน | กันอะไร |
|---|---|
| ตัวอักษร ≥ 12 px · contrast ≥ 4.5:1 · ห้ามตัดกลางคำ | ย่อ ทำจาง ซ่อนข้อความ |
| แถวแรกอยู่ในจอแรก ห่างตำแหน่งตอนล็อกไม่เกิน 150 px | ดันเนื้อหาพ้นจอ |
| สีข้อความเป็นสีกลาง (saturation ≤ 20%) | เปลี่ยนสีให้กลืน |
| ข้อความในช่องกรอกไม่ล้น (`scrollWidth ≤ clientWidth`) | บีบช่องกรอก |
| ห้ามเปลี่ยนตระกูลฟอนต์เป็น monospace หรือฟอนต์ตัวโชว์เพื่อลด diff · คนดูภาพจริงก่อนรับ | ตัวกันเดิมผ่านครบแต่ optimizer เลือกฟอนต์ monospace เพราะ diff ต่ำสุด ผู้สร้างเองบอกว่าดูเหมือนเครื่องพิมพ์ดีด |
| ลำดับขนาดฟอนต์ต้องคงเดิม | ทำลำดับชั้นตัวอักษรแบน (รอบจริง md/lg/xl เป็น 17 เท่ากันหมด ตัวกันเดิมไม่เห็น) |

- เส้นฐานของตัวกันมาจากค่าตอนล็อก ไม่ใช่ตัวเลขตายตัว · องค์ประกอบที่หายจากเส้นฐานต้อง**ล้ม** ไม่ใช่ข้าม
- ชุดค่าสุดท้ายต้องผ่านจอหรือข้อมูลที่ไม่เคยใช้จูน (รอบจริงจูนกับจอ 1366×900 อย่างเดียว)
- ตัวกันที่เปลี่ยนหน้าตาแล้วคนต้องตัดสินใจเอง (ย้ายข้อความ ซ่อนช่วงราคา) ให้ถามผู้ใช้ว่ารับได้ไหม ไม่ตัดสินเอง

**คำสั่งในลูปใช้ `cd X && cmd` หรือพาธเต็มเสมอ** — ครั้งหนึ่ง `cd` ล้มแล้ว `sed` แก้ประมาณ 20 ไฟล์นอกขอบเขต (รวม 4 ไฟล์ในชุดเครื่องมือ) · เก็บ hash ของโฟลเดอร์ชุดเครื่องมือ (`kit/`) ไว้เป็น manifest แล้วเทียบหลังรันทุกรอบ

ข้อสอบและตัววัดของลูปแบบนี้ต้องน่าเชื่อก่อน → `test-evidence` ข้อ 5


---

# skill: app-verifier-setup

Use when an agent has no scripted way to run the app

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง ก็ปรับงานต่อเองไม่ได้ และคนต้องคอยส่งต่อสิ่งที่เห็นบนจอให้ agent
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** 2 ชิ้น คือสคริปต์ที่อยู่กับ test ของโปรเจกต์ และ skill ที่เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่เขียนขั้นตอนแยกเป็นไฟล์ข้อความ** เพราะลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก จึงเก็บข้อมูลไว้ในสคริปต์ที่เดียว แล้วให้ skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** จาก README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) ถ้ามีของเดิมให้ใช้ของเดิม ไม่สร้างใหม่
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (ถ้ามี Chromium ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ pywinauto (WinAppDriver รุ่นล่าสุดน่าจะออกปี 2020 และยังไม่ยืนยันว่า Microsoft ยังดูแลอยู่ (รอยืนยัน)) | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro · Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - ถ้าโปรเจกต์มี `.sandbox/` ให้ขับเบราว์เซอร์ใน container ซึ่งค่าเริ่มคือ headless (ไม่เปิดหน้าต่าง) ถ้าอยากให้คนดูได้ ให้เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) ส่วน Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) จึงให้รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA ให้ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) ให้ป้อนค่าที่รู้ล่วงหน้า ผ่าน emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build แล้วติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` เพราะความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ถ้ายังไม่ได้รันบนเครื่องจริง ให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** ให้เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) ใส่ข้อมูลทดสอบ (seed) และรอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ถ้าไม่ขึ้นใน 10 วินาทีถือว่าล้ม · มือถือ: ตั้งเวลาแยกสำหรับ build · boot emulator · เปิดแอป · แต่ละ check ดู reference) ปิดแอปเมื่อจบเสมอ และรันซ้ำต้องได้ผลเดิม (`principle-build-a-tool-not-handwork`)
   - **เว็บหรือ API ที่ต้องเปิดเซิร์ฟเวอร์ก่อน** ใช้ [`scripts/with_server.py`](scripts/with_server.py) เปิด รอพอร์ตพร้อม รันสคริปต์ แล้วปิดให้ครบ เช่น `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (เปิดหลายตัวได้โดยใส่ `--server` กับ `--port` ซ้ำ · log อยู่ใน `--log-dir` ค่าเริ่ม `_to_delete/with-server-logs` ซึ่งสร้างให้เองถ้ายังไม่มี) · ทดสอบบน Windows 2026-11-10 กับ `python -m http.server` แล้วพอร์ตปิดจริงหลังจบ · แอปไดนามิกให้รอ `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) หรือ `data-ready="true"` ก่อนอ่าน DOM ไม่เดา `sleep`

4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** ไล่จากเมนู · route · command list · SRS แล้วเขียน 1 กลุ่มต่อฟีเจอร์ 1 บรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาด 1 กรณีต่อฟีเจอร์ **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ และพิมพ์ผล `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** (ผ่านทั้งที่ไม่ได้ตรวจอะไรจริง) ถ้าชื่อฟีเจอร์ไม่มีจริงให้ exit 1 ถ้าแอปไม่ขึ้นให้ exit 1 และถ้าไม่มี check ไหนได้รันก็ให้ exit 1 (ตรวจ 0 รายการถือว่าพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นจะผ่านลอย ๆ และรอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **ต้องแน่ใจว่าอ่านหน้าจอล่าสุด** โดยลบไฟล์ผลเก่าก่อนอ่านใหม่ และกดเมื่อตำแหน่งเป้าหมายนิ่ง 2 รอบติด ถ้าอ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด ถือเป็นบั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** โดยแก้แอปให้ผิด 1 จุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** โดยส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล ติดตรงไหนให้แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** ทั้งภาพหน้าจอและ log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ผู้ใช้ลบเองได้เมื่อส่งงานแล้ว · agent ไม่ลบ)

## สัญญาสำหรับทดสอบ — ใส่ในแอปตั้งแต่หน้าจอแรก

verify ต้องพึ่งของที่แอปเตรียมไว้ให้ ไม่ใช่เดาจากข้อความหรือ CSS · เขียนสัญญานี้ลงแผนที่ฟีเจอร์ในสคริปต์ และให้ developer ทำตามตั้งแต่ฟีเจอร์แรก

| สิ่งที่แอปต้องมี | ใช้ทำอะไร | กฎ |
|---|---|---|
| `data-testid="<หน้า>-<สิ่งนั้น>"` แบบ kebab-case บนทุกปุ่ม ช่องกรอก ผลลัพธ์ และข้อความ error | หาองค์ประกอบโดยไม่ผูกกับข้อความหรือ CSS → เปลี่ยนภาษาหรือดีไซน์แล้ว check ไม่พัง | เช่น `book-submit` · `summary-total` · `book-error` · ห้ามซ้ำในหน้าเดียว · รายการ testid ทั้งหมดอยู่ในแผนที่ฟีเจอร์ |
| `<html data-ready="false">` → `"true"` เมื่อหน้าโหลดข้อมูลเสร็จ | รอแบบมีเงื่อนไขแทน `sleep` ค่าเดา (ข้อ 5) | ตั้ง `true` หลังข้อมูลชุดสุดท้ายมาถึง ไม่ใช่ตอน component mount |
| reset endpoint เช่น `POST /api/test/reset` → ล้างแล้วใส่ seed ใหม่ ภายใน 5 วินาที | ทุก check เริ่มจากสถานะสะอาด (ข้อ 4) | มีเฉพาะเมื่อตั้ง `ALLOW_TEST_RESET=1` · ไม่ตั้ง → ตอบ 404 · ห้ามเปิดใน production |
| ล็อกนาฬิกา: reset รับ `{"now":"<ISO + offset>"}` แล้วกฎทุกข้ออ่าน "วันนี้" จากโมดูลเดียว (`clock`) | ทดสอบกฎที่ขึ้นกับวันเวลา (หมดอายุ · ยกเลิกก่อน 24 ชั่วโมง) ให้ได้ผลเดิมทุกครั้ง | ไม่ส่ง `now` → ใช้วันเริ่มที่เขียนใน seed · ปิด flag → ใช้เวลาจริง · ห้ามเรียก `Date.now()` / `DateTime.Now` ตรง ๆ ในกฎ |

แอปที่ไม่ใช่เว็บใช้แนวเดียวกัน: Flutter → `Key` / Semantics label ชื่อเดียวกัน · Android → `resource-id` · command line → ตัวเลือก `--now` หรือตัวแปร `APP_NOW` · reset บนมือถือเปิดได้เฉพาะ debug build

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่มด้วย `with_server.py` (ถ้าแอปต้องเปิดเซิร์ฟเวอร์) และกฎรอ `networkidle` หรือ `data-ready` ก่อนอ่าน DOM
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม: ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง (production) | ตรวจไปตรวจมา กลายเป็นแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`references/builtin-verify.md`](references/builtin-verify.md) — Claude Code มี `/verify` ติดเครื่อง: โปรเจกต์ที่รันบน Claude Code ให้สร้าง skill ชื่อ `verify` ที่ `.claude/skills/verify/SKILL.md` ในรูปแบบนั้น แทน `verify-<โปรเจกต์>`
- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`superuser`](../superuser/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่


## reference: android-native.md

# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) · สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่เขียนว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม · ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** ว่ามีเครื่องต่ออยู่ (`adb devices`) และมี APK (`build/app/outputs/flutter-apk/app-debug.apk`) ถ้าไม่ครบ ให้ exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual และ exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อย 1 ข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` จึงใช้ตรวจได้ และช่วยผู้ใช้โปรแกรมอ่านจอด้วย |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) ทำให้เปลืองแบต และ TalkBack พูดซ้ำ ให้แก้โดยแจ้ง UI เฉพาะเมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่ค่าแกว่ง: เปลี่ยนเกิน 1 %) ส่วนค่ารองที่ค่อย ๆ ขยับ ให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่าน 2 ครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด ถ้ากดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุของ flake (ผลไม่คงที่) ที่เหลือ 1 ครั้ง แต่ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) ถ้าไม่ตรวจเงื่อนไขก่อน check จะผ่านทั้งที่ไม่ได้ตรวจอะไร |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` แล้วแอปได้ค่าผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ จึงตรวจได้แค่ว่า "มีค่าออกมา" ตรวจความแม่นไม่ได้ |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` แปลว่าทางเดินข้อมูลถูก ส่วน `เครื่องจริง` แปลว่าค่าถูก ถ้า check ไหนต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (ยังไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator กับ Gradle กินหน่วยความจำมาก จน Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว และหยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- ถ้า emulator ถูกปิดกลางทาง ให้รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี จึงให้รันบน host


## reference: builtin-verify.md

# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `app-verifier-setup` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `app-verifier-setup` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` maintains this one file only and does not create a nested `verify-<project>`
