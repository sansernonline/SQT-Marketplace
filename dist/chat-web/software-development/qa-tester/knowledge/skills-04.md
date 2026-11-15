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

# skill: api-conventions

Use when adding API endpoints or checking API consistency

# ข้อตกลงของ Application Programming Interface (API)

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกัน แม้ "ไม่ค่อยถูกตามทฤษฎี" ใช้ง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ เพราะแบบหลังฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ใน API เดิม และอยากให้เข้ากับของเดิม
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "เปลี่ยนแบบนี้แล้ว client พังไหม"

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` | แทน |
| health check, error envelope, graceful shutdown | `web-service-essentials` | แทน |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` | แทน |
| token, scope, สิทธิ์ | `auth-implementation-patterns` | แทน |
| correlation id ที่โผล่ใน error | `logging-standards` | คู่ |
| test สัญญาระหว่างระบบ | `testing-standards` | คู่ |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `docs/API-CONVENTIONS.md` (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
ทุกข้อในหน้านี้ที่ตัดสินใจแล้ว ให้เขียนลงไฟล์นั้น พร้อมวันที่และเหตุผลสั้น ๆ

> ข้อตกลงที่อยู่ในหัวคนใดคนหนึ่ง ไม่ใช่ข้อตกลง — คนที่เข้าทีมเดือนหน้าจะทำอีกแบบ

---

## 2 · ตั้งชื่อ URL

```
GET    /v1/orders                 รายการ
POST   /v1/orders                 สร้าง
GET    /v1/orders/{id}            รายตัว
PATCH  /v1/orders/{id}            แก้บางส่วน
PUT    /v1/orders/{id}            แทนที่ทั้งตัว
DELETE /v1/orders/{id}            ลบ
GET    /v1/orders/{id}/items      ทรัพยากรลูก
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD (Create, Read, Update, Delete)
```

| กฎ | ✓ | ✗ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่แก้ `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์ทั่วไป

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ โดยแนะนำให้ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`)
และต้องกำหนดให้ชัดว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**เปลี่ยนแบบไหนแล้วฝั่งเรียกพัง:**

| การเปลี่ยน | พังไหม |
|---|:--:|
| เพิ่ม endpoint ใหม่ | ไม่ |
| เพิ่มฟิลด์ **ที่ไม่บังคับ** ใน request | ไม่ |
| เพิ่มฟิลด์ใน response | ไม่* |
| เพิ่มค่า enum ใหม่ | **พัง** — client ที่ `switch` ครบทุกค่าจะเจอค่าที่ไม่รู้จัก |
| ลบ/เปลี่ยนชื่อฟิลด์ | **พัง** |
| เปลี่ยนชนิดข้อมูล (`"12"` → `12`) | **พัง** |
| ทำให้ฟิลด์ที่เคยไม่บังคับกลายเป็นบังคับ | **พัง** |
| เปลี่ยน HTTP status ที่คืนในกรณีเดิม | **พัง** |
| ทำให้กฎ validation เข้มขึ้น | **พัง** |

\* ต่อเมื่อบอกฝั่งเรียกไว้แต่แรกว่า "ฟิลด์ที่ไม่รู้จักให้ข้ามไป"
ข้อนี้ต้องเขียนไว้ใน `API-CONVENTIONS.md` ไม่ใช่หวังเอาเอง

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** เพราะทุกเวอร์ชันที่ยังเปิดอยู่คือโค้ดอีกชุดที่ต้องดูแล

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" อีก 2 ปีจะมี 10,000 รายการ

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีข้อมูลเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ยิ่งหน้าลึกยิ่งช้า · ถ้ามีแถวแทรกระหว่างเปิดดู ข้อมูลจะซ้ำหรือหาย |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null เมื่อหมดแล้ว
    "hasMore": true
  }
}
```

- ห่อรายการไว้ใน `data` เสมอ เพราะถ้าตอบเป็นอาเรย์เปล่า ๆ วันหลังจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` นับแพง จึงให้ขอเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** (ฝั่งเรียกห้ามแกะหรือประกอบเอง)

---

## 5 · filtering · sorting · ฟิลด์ที่ขอ

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| เรื่อง | ข้อตกลง |
|---|---|
| กรองค่าเท่ากับ | `?status=confirmed` |
| หลายค่า | `?status=confirmed,shipped` |
| ช่วง | `?createdAt[gte]=...&createdAt[lt]=...` |
| เรียง | `?sort=-createdAt,orderNo` — `-` คือมากไปน้อย |
| ค้นหาข้อความ | `?q=สมชาย` แยกจากการกรอง |
| เลือกฟิลด์ | `?fields=id,orderNo` |

- **รับเฉพาะฟิลด์ที่กำหนดไว้** ถ้ารับชื่อฟิลด์อะไรก็ได้ จะเกิดช่องโหว่ และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ตอบ `400` ดีกว่าข้ามเงียบ ๆ ไม่งั้นฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

---

## 6 · รูปแบบข้อมูล

| ข้อมูล | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ชื่อฟิลด์ | `camelCase` ทั้งระบบ | `createdAt` |
| เวลา | RFC 3339 · UTC · ลงท้าย `Z` | `"2026-09-25T09:42:13.482Z"` |
| วันที่ล้วน | `YYYY-MM-DD` | `"2026-09-25"` |
| เงิน | ตัวเลขเป็น**สตริง** + สกุลเงินแยก | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **สตริงเสมอ** | `"1042"` ไม่ใช่ `1042` |
| enum | `SCREAMING_SNAKE` หรือ `lower_snake` เลือกแบบเดียว | `"CONFIRMED"` |
| ระยะเวลา | วินาทีเป็นตัวเลข ตั้งชื่อให้รู้หน่วย | `"timeoutSeconds": 30` |
| ประเทศ / สกุลเงิน / ภาษา | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> **id เป็นตัวเลขใน JSON คือระเบิดเวลา** — JavaScript เก็บจำนวนเต็มได้ปลอดภัยถึง 9,007,199,254,740,991
> `bigint` ที่เกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และถ้าจะเปลี่ยนเป็นสตริงทีหลังก็เป็น breaking change
>
> **เงินเป็น float ใน JSON** — `1250.10` ที่ผ่าน 2 ภาษาโปรแกรมอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องหมายถึงคนละอย่าง:**

- ใน response ฟิลด์ที่มีแต่ไม่มีค่าให้ส่ง `null` ไม่ตัดทิ้ง ฝั่งเรียกจะได้ไม่ต้องเช็ค 2 แบบ
- ใน `PATCH` ถ้าส่ง `{"note": null}` แปลว่าล้างค่า ถ้าไม่ส่งคีย์ `note` เลยแปลว่าไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** ฝั่งเรียกจะวนลูปได้เลย

---

## 7 · error

รูปแบบ error (RFC 9457 · `requestId` · `errors` แบบ array `{field, code, message}`) และตัวอย่างอยู่ที่ `web-service-essentials` ข้อ 2 ที่เดียว ใช้ตามนั้น
ที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

- **`code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน** อย่าให้ฝั่งเรียกต้องเอาข้อความไปเขียนเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่ง 5 รอบ
- ถ้ารองรับหลายภาษา ให้เลือกข้อความไทยหรืออังกฤษจาก `Accept-Language`

**เลือก status ให้ตรง:** `400` รูปแบบคำขอผิด · `401` ยังไม่ได้ยืนยันตัวตน · `403` ยืนยันแล้วแต่ไม่มีสิทธิ์ ·
`404` ไม่มีหรือไม่ให้รู้ว่ามี · `409` ชนกับสถานะปัจจุบัน · `422` รูปแบบถูกแต่ข้อมูลไม่ผ่านกฎ · `429` เรียกถี่เกิน

---

## 8 · เรียกซ้ำไม่เกิดผลซ้ำ และการแก้ชนกัน

### idempotency key (รหัสกำกับคำขอ — ส่งซ้ำแล้วไม่ทำงานซ้ำ)

**บังคับกับทุก `POST` ที่มีผลทางการเงินหรือส่งของออกไปข้างนอก**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← ฝั่งเรียกสร้าง เก็บไว้ใช้ตอน retry
```

- เซิร์ฟเวอร์เก็บ key คู่กับผลลัพธ์ไว้อย่างน้อย 24 ชั่วโมง
- key เดิมกับเนื้อหาเดิม ให้คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิมแต่เนื้อหา**ต่าง** ให้ตอบ `422` ไม่ทำงานใหม่
- เครือข่ายขาดระหว่างรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ ฝั่งเรียกจึง retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มี คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

ถ้า `429` ไม่มี `Retry-After` ฝั่งเรียกต้องเดาเอง และส่วนใหญ่เดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: @1790812800
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
   `Deprecation` ตามมาตรฐาน Request for Comments (RFC) 9745 (มี.ค. 2025) ต้องเป็นวันที่แบบ `@<วินาที unix>` (ตัวอย่างนี้คือ 1 ต.ค. 2026 00:00 UTC) ไม่ใช่ `true` · ตรวจ 22 ต.ค. 2569
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** แล้วติดต่อเขาตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่พอดี: API ภายในให้ 1 รอบ release ส่วน API ที่คนนอกใช้ให้อย่างน้อย 6 เดือน

---

## 11 · ตรวจก่อนปล่อย endpoint ใหม่

ไล่ทุกข้อกับ endpoint ที่เพิ่ม ตกข้อเดียวยังไม่ merge (แนวคิดจาก ECC api-design)

- [ ] URL เป็นคำนามพหูพจน์ตามข้อ 2 · อยู่ใต้เวอร์ชันตามข้อ 3 · ไม่มี `GET` ที่เปลี่ยนข้อมูล
- [ ] รายการทุกตัวมี pagination และเพดานขนาดหน้า (ข้อ 4) · filter และ sort ใช้ชื่อพารามิเตอร์เดียวกับ endpoint เดิม (ข้อ 5)
- [ ] วันที่ · id · เงิน อยู่ในรูปแบบของข้อ 6 · response ไม่ใช่ entity ของฐานข้อมูลตรง ๆ
- [ ] error ทุกตัวตาม `web-service-essentials` §2 และมี `code` คงที่ (ข้อ 7) · คำขอที่สร้างหรือจ่ายเงินรับ idempotency key · การแก้รับ `If-Match` (ข้อ 8)
- [ ] ระบุ auth และ rate limit (ข้อ 9) · อยู่ใน OpenAPI แล้ว และตัวอย่าง cURL ในเอกสารรันผ่านจริง
- [ ] มี contract test หรือ test ระดับ endpoint อย่างน้อย 1 กรณีสำเร็จ 1 กรณี error — ตรวจ response กับ OpenAPI ใน CI · Pact เมื่อผู้เรียกแยกทีม · `oasdiff breaking` ทุก PR: [`references/contract-testing.md`](references/contract-testing.md)

## 12 · Anti-patterns

- **`200 OK` พร้อม `{"success": false}`** — ตัวเฝ้าระบบและ log ทั้งหมดจะมองไม่เห็นว่าพัง
- **กริยาใน URL** — `/createOrder`, `/getOrderById`
- **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูล 50,000 แถวในครั้งเดียว
- **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — เช่น `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงข้อมูลภายในหลุด
- **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงเองโดยไม่มีใครกด
- **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง


## reference: contract-testing.md

# Contract testing — OpenAPI is the contract, and CI checks that the real thing matches

The document `docs/API-CONVENTIONS.md` states the rules · the OpenAPI file states the shape of each endpoint · contract tests are what keep these 2 from being just documents

## 1 · OpenAPI as the contract

- Generate it from the real code (annotations · decorators · the framework's generator) and commit the resulting file — do not hand-write it separately · when the 2 sides differ, the code side is the truth, and the diff in the file is what the reviewer sees
- Every response has a schema, including errors (`web-service-essentials` §2) · every field has a `format` for dates · ids · money, per §6 of the main SKILL.md

## 2 · Check responses against the spec in CI (provider side)

| Tool | What it does | licence | Note (checked 2026-10-23) |
|---|---|---|---|
| Schemathesis | reads OpenAPI, builds requests from the schema, fires them at the real service, and checks that responses match the spec and are not 500 · `schemathesis run <url of openapi.json>` | MIT | really fires, creates and deletes data → point it only at dev or staging · Python |
| Prism (Stoplight) | `prism mock <spec>` lets the frontend work before the backend is done · `prism proxy <spec> <upstream>` checks real traffic against the spec | Apache-2.0 | Node ≥ 18.20 · proxy mode can sit in front of the service in a test environment |
| Dredd | checks an API against API Blueprint / OpenAPI 2 (OpenAPI 3 experimental) | MIT | **no longer maintained** (archived 2024-11-08) — do not start using it |

Our default: Schemathesis in a CI job after the service is up with test data (the reset endpoint from `app-verifier-setup`) · failure = no merge

## 3 · Consumer-driven contract — when the frontend team or callers are separate from the backend

- Pact (pact-foundation · MIT): the caller side writes tests of which request/response pairs it uses → produces a pact file → the provider side runs a check against that file in its own CI · the provider can change parts nobody uses without breaking tests
- Use when: the teams are different, release separately, or there is more than 1 caller (mobile + web + partner) · one team does both sides → item 2 is enough
- Pact files are exchanged through a Pact Broker or committed to the provider's repo — agree on one way in `API-CONVENTIONS.md`

## 4 · Check for breaking changes on every PR

- `oasdiff breaking <old spec> <new spec>` (Apache-2.0 · Go · has a Docker image) reports only changes that break existing callers: removing an endpoint or field · a field becoming required · a type change · an enum value removed
- In CI: old spec = the main branch's · new spec = the PR's · on a breaking change → bump to a new version per §3, or deprecate per §10 of the main SKILL.md — do not turn off the check
- Adding an optional field · adding an endpoint · adding an enum value that callers do not crash on in a switch = not breaking

## Check before handing over

- [ ] OpenAPI is in the repo and generated from code · CI fails if the file does not match the code
- [ ] Schemathesis (or equivalent) runs against a service brought up with test data · `oasdiff breaking` runs on every PR
- [ ] Callers in a separate team → at least 1 pact file per caller, and the provider checks it in CI


---

# skill: data-import-export

Use when a system imports or exports Excel or CSV

# นำเข้าและส่งออกข้อมูล

> **กฎข้อเดียว:** ตรวจให้จบก่อน แล้วค่อยเขียน
> ถ้าเขียนไปครึ่งทางแล้วเจอแถวผิด ข้อมูลจะค้างอยู่ครึ่ง ๆ และไม่มีใครรู้ว่าต้องแก้ตรงไหน

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้อัปโหลด Excel หรือ CSV เพื่อนำข้อมูลเข้าระบบ
- มีปุ่มส่งออกเป็น Excel หรือ CSV
- ย้ายข้อมูลจากระบบเก่าเข้าระบบใหม่
- ผู้ใช้อัปโหลดแล้วได้ข้อความว่า "ไฟล์ไม่ถูกต้อง" แล้วไม่รู้ว่าผิดตรงไหน

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| รับไฟล์อัปโหลดทั่วไป (รูป เอกสาร) | `file-upload-and-storage` | แทน |
| สร้างไฟล์ Excel ที่จัดรูปแบบสวยงาม | `anthropic-skills:xlsx` | แทน |
| กลไกคิวและความคืบหน้า | `background-jobs` | แทน |
| ปี พ.ศ. และการเรียงลำดับไทย | `i18n-and-locale` | แทน |
| ส่งเอกสารเข้าโปรแกรมบัญชีไทย (PEAK · FlowAccount) ผ่าน API แทนไฟล์ | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | แทน |
| บันทึกว่าใครนำเข้าหรือส่งออกอะไร | `audit-trail` | คู่ |
| ปิดบังข้อมูลส่วนบุคคลในไฟล์ส่งออก | `pdpa-compliance` | คู่ |
| แจ้งผู้ใช้เมื่อนำเข้าเสร็จ | `notifications` | คู่ |
| ข้อจำกัดและ constraint ของตารางปลายทาง | `database-design` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · ให้แม่แบบ อย่าให้เดา

**ทุกหน้าจอนำเข้าต้องมีปุ่มดาวน์โหลดแม่แบบ** ในแม่แบบมี

- หัวคอลัมน์ตรงกับที่ระบบต้องการเป๊ะ
- **แถวตัวอย่าง 1–2 แถวที่ถูกต้อง**
- แถวคำอธิบายว่าคอลัมน์ไหนบังคับ รูปแบบอะไร ค่าที่รับได้มีอะไรบ้าง
- ชีตแยกสำหรับรายการค่าที่เลือกได้ (สถานะ ประเภท หน่วย)

| ไฟล์ต่างจากแม่แบบแบบไหน | ทำ |
|---|---|
| ลำดับคอลัมน์สลับ | ✓ อ่านจากชื่อหัวคอลัมน์ ไม่ใช่ตำแหน่ง |
| หัวคอลัมน์มีเว้นวรรคเกิน ตัวพิมพ์ต่าง | ✓ ตัดช่องว่างและเทียบแบบไม่สนตัวพิมพ์ |
| มีคอลัมน์เกินที่ไม่รู้จัก | ✓ ข้ามไป แต่**บอกให้รู้ว่าข้ามอะไร** |
| ขาดคอลัมน์บังคับ | ✗ หยุดทันที บอกว่าขาดคอลัมน์ไหน |

---

## 2 · ตรวจสามชั้น ก่อนเขียนอะไรทั้งนั้น

| ชั้น | ตรวจอะไร | ตัวอย่างข้อความ |
|:--:|---|---|
| 1 · ไฟล์ | เปิดได้ · มีชีตที่ต้องการ · คอลัมน์บังคับครบ · ไม่เกินจำนวนแถวสูงสุด | "ไม่พบคอลัมน์ 'รหัสสินค้า'" |
| 2 · รายแถว | ชนิดข้อมูล · ค่าบังคับ · อยู่ในรายการที่กำหนด · ช่วงตัวเลข | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" |
| 3 · ความสัมพันธ์ | รหัสมีอยู่จริงในระบบ · ไม่ซ้ำกันเองในไฟล์ · กฎทางธุรกิจ | "แถว 88 ไม่พบลูกค้ารหัส C-1042" |

**รายงานความผิดพลาดต้องระบุ: แถว · คอลัมน์ · ค่าที่พบ · ค่าที่ควรเป็น**

```
ผิด: "ไฟล์ไม่ถูกต้อง"
ผิด: "พบข้อผิดพลาด 37 รายการ"
ถูก: ตารางผลตรวจ พร้อมปุ่มดาวน์โหลดไฟล์เดิมที่มีคอลัมน์ "ข้อผิดพลาด" ต่อท้าย
```

> **รายงานข้อผิดพลาดทั้งหมดในครั้งเดียว ไม่หยุดที่แถวแรกที่ผิด**
> ผู้ใช้จะได้แก้รอบเดียวจบ ไม่ใช่อัปโหลดใหม่ 37 รอบ

---

## 3 · เขียนลงระบบ

| แบบ | ใช้เมื่อ |
|---|---|
| **ทั้งหมดหรือไม่ทำเลย** | ค่าเริ่มต้น ไฟล์ต้องถูกหมดถึงจะนำเข้า |
| ทำเท่าที่ผ่าน ข้ามแถวที่ผิด | ไฟล์ใหญ่มากและแต่ละแถวไม่เกี่ยวกัน โดย**ผู้ใช้ต้องเลือกเอง ระบบไม่ตัดสินใจแทน** |

- **ทุกครั้งต้องมีหน้าสรุปก่อนยืนยัน** เช่น "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" แล้วให้กดยืนยัน
- ถ้าเจอแถวซ้ำในไฟล์ ให้หยุดและบอก ไม่ใช่ใช้แถวสุดท้ายเงียบ ๆ
- ถ้าข้อมูลมีอยู่แล้วในระบบ ให้ผู้ใช้เลือก: ข้าม · เขียนทับ · หยุด
- **นำเข้าทุกครั้งต้องบันทึกใน audit** ว่าใครนำเข้า ไฟล์อะไร กระทบกี่แถว (ดู `audit-trail`)
- **เก็บไฟล์ต้นฉบับไว้** พอมีปัญหาจะได้ย้อนดูว่าไฟล์ที่ส่งมาหน้าตาอย่างไรจริง ๆ
- ทำให้ย้อนกลับได้: บันทึก batch id (รหัสรอบนำเข้า) ไว้กับทุกแถวที่นำเข้า

**ไฟล์ใหญ่ทำเป็นงานเบื้องหลัง**: ถ้าเกินประมาณ 1,000 แถวให้เข้าคิว
แบ่งเป็นชุดละ 500 แถว แสดงความคืบหน้า และยกเลิกได้ (ดู `background-jobs`)

---

## 4 · กับดักของ Excel และ CSV

| กับดัก | ผลที่เกิด | ทางแก้ |
|---|---|---|
| **ภาษาไทยใน CSV เพี้ยน** | เปิดใน Excel แล้วตัวอักษรอ่านไม่ออก | บันทึกเป็น UTF-8 **พร้อม BOM** หรือแนะให้ใช้ .xlsx |
| **รหัสที่ขึ้นต้นด้วย 0 หาย** | `0812345678` กลายเป็น `812345678` | อ่านเป็นข้อความเสมอ ส่วนตอนส่งออกให้ตั้งรูปแบบเซลล์เป็นข้อความ |
| **เลขยาวกลายเป็นเลขยกกำลัง** | เลขบัตร 13 หลัก → `1.23457E+12` | เหมือนข้างบน |
| **วันที่ถูกตีความเอง** | `03/04/2026` เป็นมีนาคมหรือเมษายน | บังคับ `YYYY-MM-DD` ในแม่แบบ |
| **ปี พ.ศ. กับ ค.ศ. ปนกัน** | เพี้ยน 543 ปีเงียบ ๆ | **ถามในหน้าจอนำเข้าว่าไฟล์ใช้ปีแบบไหน** |
| ช่องว่างท้ายค่า | จับคู่รหัสไม่เจอ | ตัดช่องว่างหัวท้ายทุกค่า |
| เซลล์ที่เป็นสูตร | ได้สูตรแทนค่า | อ่านค่าที่คำนวณแล้ว |
| **สูตรที่ขึ้นต้นด้วย `=` `+` `-` `@` ในไฟล์ส่งออก** | ผู้ใช้เปิดแล้ว Excel รันคำสั่ง | เติม `'` นำหน้าค่าที่ขึ้นต้นด้วยอักขระเหล่านี้ |

> **ช่องโหว่ที่คนไม่ค่อยรู้**: ชื่อลูกค้าที่เป็น `=cmd|'/c calc'!A1` ถ้าส่งออกดิบ ๆ
> แล้วมีคนเปิดใน Excel มันจะพยายามรันคำสั่งจริง ตอนส่งออกจึงต้อง escape เสมอ

---

## 5 · ส่งออก

| เรื่อง | กฎ |
|---|---|
| ขนาด | ถ้าเกินประมาณ 50,000 แถว ให้ทำเป็นงานเบื้องหลัง แล้วส่งลิงก์ให้ดาวน์โหลด |
| สิทธิ์ | **ส่งออกได้เฉพาะข้อมูลที่ผู้ใช้คนนั้นมีสิทธิ์เห็นอยู่แล้ว** เพราะนี่คือจุดรั่วที่พบบ่อยที่สุด |
| audit | บันทึกทุกครั้งว่าใครส่งออกข้อมูลอะไร ช่วงไหน กี่แถว |
| ข้อมูลส่วนบุคคล | ปิดบังคอลัมน์ที่ไม่จำเป็น (ดู `pdpa-compliance`) |
| ชื่อไฟล์ | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| ส่วนหัวของไฟล์ | ใส่เงื่อนไขกรองที่ใช้ และเวลาที่ส่งออก ไม่งั้นอีก 3 เดือนไม่มีใครรู้ว่าไฟล์นี้คือข้อมูลอะไร |
| ลิงก์ดาวน์โหลด | ต้องหมดอายุ (ดู `file-upload-and-storage`) |
| รูปแบบ | `.xlsx` สำหรับคนอ่าน · CSV สำหรับเครื่องอ่าน |

---

## 6 · Anti-patterns

- **"ไฟล์ไม่ถูกต้อง"** ผู้ใช้ทำอะไรต่อไม่ได้
- **หยุดที่แถวแรกที่ผิด** ผู้ใช้ต้องอัปโหลดใหม่ 30 รอบ
- **เขียนไปตรวจไป** พอล้มกลางทาง ข้อมูลก็ค้างครึ่ง ๆ
- **ไม่มีหน้าสรุปก่อนยืนยัน** เขียนทับข้อมูลจริงโดยไม่มีใครทันได้ดู
- **ไม่มีแม่แบบให้ดาวน์โหลด** ผู้ใช้ต้องเดาหัวคอลัมน์
- **อ่านคอลัมน์ตามตำแหน่ง** ผู้ใช้แทรกคอลัมน์เดียวก็พังทั้งไฟล์
- **อ่านรหัสเป็นตัวเลข** เลข 0 นำหน้าหายทุกครั้ง
- **ไม่ถามว่าปีเป็น พ.ศ. หรือ ค.ศ.** ปีเพี้ยน 543 ปีโดยไม่มีใครรู้
- **ส่งออกโดยไม่ escape สูตร** เปิดไฟล์แล้วรันคำสั่ง
- **ส่งออกได้เกินสิทธิ์ที่มี** ข้อมูลรั่วผ่านปุ่มที่เราทำเอง
- **ไม่เก็บไฟล์ต้นฉบับ** มีปัญหาแล้วย้อนดูไม่ได้


## reference: thai-accounting-apis.md

# Connecting to Thai SME accounting software through API

Use when our system must push sales or purchase documents into the customer's accounting software, instead of exporting Excel for them to re-key. The rules of `SKILL.md` still apply: validate everything before writing · summary page before confirming · batch id · audit.
Every fact comes from the vendors' documents, opened 2026-10-23. Prices and API fees were rechecked 2026-10-26 (table "Sources"). Prices and terms change often: confirm with the vendor before quoting a customer.
Abbreviations: small and medium enterprises (SME) · Application Programming Interface (API) · User Acceptance Testing (UAT) is the test system · Hash-based Message Authentication Code (HMAC) is a signature made from a secret key · Software Development Kit (SDK).

## 1 · Choose a route

| Route | Use when |
|---|---|
| Send a file using the accounting software's import template (file format of each vendor not yet checked) | Few documents · the customer's package has no API |
| Connect to the API directly (sections 2–3) | Hundreds of documents per month · need status back, such as paid |
| Through a partner app the accounting software certifies (PEAK: menu ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก, i.e. Settings > External application connections) | Online shop that already uses a back-office system → `ecommerce-patterns` `references/thai-marketplace-apis.md` |

## 2 · PEAK

| Topic | Information |
|---|---|
| Docs | developers.peakaccount.com (API Integration Guide · file `llms.txt` links every page) · has a Postman collection |
| Package | PEAK PRO Plus (12,000 baht/year) or higher · PEAK PRO Plus price per the developers page on 2026-10-26 · API fee is paid before go-live under the agreed package terms; the docs state no amount (`รอยืนยัน`, pending confirmation · per the go-live document, confirm the API fee, the number of items, and the trial terms with the PEAK team before putting them in a quotation) |
| Get access | Fill in the form, the team replies within 3 working days · you get Connect ID + Application Code · UAT and production credentials are separate |
| Authentication | Client Token valid 24 hours (`POST /api/v1/ClientToken`) · User Token per business, the customer creates it in the menu เชื่อมต่อแอปพลิเคชันภายนอก (External application connections) with the Application Code · header `Time-Stamp` (yyyyMMddHHmmss, UTC) · `Time-Signature` = HMAC-SHA1 of the Time-Stamp, with connectId as the key |
| What it can do | contacts · products (has adjust) · services · quotations · invoices · billing notes · receipts · credit notes · purchase orders · expenses · daily journals · receive payment · void · approve · attach files |
| e-Tax | Has an endpoint to send e-Tax Invoice for invoice and receipt · sends e-Receipt |
| UAT | `http://peakengineapidev.azurewebsites.net/api/v1` (http, not https) · free for 3 months · open Mon–Fri 08:00–22:00 |
| Production | `https://api.peakaccount.com/api/v1` · before go-live must pass the Final UAT Review (test case · error case · duplicate case · accounting result) |
| rate limit | ClientToken request 10 times/minute/IP · trial balance report (`GET /api/v1/FinancialReports/trialbalance`) 10 times/minute and 1 concurrent · per User Token: GET 20 concurrent · POST 10 concurrent · file attach 10 concurrent · over the limit → HTTP 429 `RATE_LIMITED` with `retryAfterSeconds` |
| Billed by | Only successful POST Create (invoice · receipt · quotation · billing note · purchase order · expense · daily journal) |
| webhook | Events Create · Edit · Void · PaidPayment · VoidPayment of the main documents (contact · product only Create · Edit) · can set a custom header per endpoint, such as `x-api-key` · the docs say nothing about signatures or redelivery |

## 3 · FlowAccount

| Topic | Information |
|---|---|
| Docs | developers.flowaccount.com · the spec actually in use `https://developers.flowaccount.com/swagger.yml` (OpenAPI 3.0.2 · 130 paths) · SDKs in several languages at github.com/flowaccount |
| Package | Only Pro Business has Open API (price page 2026-10-26: ฿457/month · ฿5,490/year) · Free · Standard (฿1,990/year) · Pro (฿2,990/year) have no API · the price page lists no separate API fee · import up to 5,000 items/month, beyond that special pricing · the API page says "Pay when you go live" and gives no amount (`รอยืนยัน`, pending confirmation) |
| Get access | Form request-openapi · team replies within 1–2 working days · sandbox usable for 30 days · real credentials are emailed to the business owner within 3 working days after the package is confirmed |
| Authentication | OAuth 2.0 · Client Credentials = 1 client per business · OpenID = partner with 1 client for many businesses (scope `flowaccount-api offline_access` · refresh token about 30 days from the last use) · token at `https://openapi.flowaccount.com/{test or v1}/token` valid 86,400 seconds · sent in header `Authorization: Bearer` |
| base URL | sandbox `https://openapi.flowaccount.com/test` · production `https://openapi.flowaccount.com/v1` |
| What it can do | contacts · products · quotations · billing-notes · tax-invoices · receipts · cash-invoices · purchases · purchases-orders · expenses · withholding-taxes · journal-entries · chart-of-accounts · change status · receive payment · attach files · export PDF · send email |
| Cross-system reference | Field `externalDocumentId` "รหัสเอกสารอ้างอิงจากระบบภายนอก" (document id referenced from an external system) |
| e-Tax · rate limit · webhook | Not found in swagger.yml (searching webhook · etax · rate limit · 429 gave 0 hits) nor on the pages developers.flowaccount.com · flowaccount.com/en/developers on 2026-10-26 (not yet checked with the vendor · contact developer_support@flowaccount.com) |

## 4 · Other vendors

| Software | What was found |
|---|---|
| TRCLOUD | The vendor's API page says it has a RESTful API · create an API Key from the settings menu · has Custom API & Webhook · no public developer docs found, ask the sales team for the manual |
| AccRevo | No public API found · the website has a launch article about AccRevoX × MCP (works with Claude) |
| Express | Searched twice, found no vendor website and no public API |

## 5 · e-Tax Invoice

- Pick one system to issue the tax invoice number · our system and the accounting software must not both issue numbers
- Send into the accounting software as the source document, then let the accounting software issue the e-Tax · PEAK has an endpoint to send e-Tax · FlowAccount not found in the spec, ask the vendor
- Tax invoice rules (section 86/4 · e-Tax Invoice & e-Receipt vs by Email) → `e-commerce:e-tax-invoice` (if installed)

## 6 · Prevent duplicates and reconcile

- Keep a mapping table: our id ↔ the accounting software's id · PEAK recommends keeping External Reference and a mapping to prevent duplicate documents · FlowAccount uses `externalDocumentId` to hold our id
- Neither vendor's docs have an idempotency key → look up the mapping before every POST create (`principle-safe-to-rerun`)
- A timeout does not mean failure · pull the list by date range and compare before resending
- On 429 → wait per `retryAfterSeconds` or back off exponentially (1 · 2 · 4 · 8 seconds, as PEAK recommends)
- Reconcile every day: the document count and total of the 2 systems must match → `fintech-payments` (`references/agent-payment-integration.md`, section Settlement Reconciliation)
- Log every send to audit: who sent · which document · destination id · result → `audit-trail`
- Client Token · client secret · connectId stay outside the code → `config-and-secrets` · PEAK UAT is http, so use test data only

## Sources

| Topic | URL (opened 2026-10-23) |
|---|---|
| PEAK packages · UAT free 3 months · guide | https://www.peakaccount.com/developers · https://developers.peakaccount.com/reference/api-integration-guide |
| PEAK list of all API pages | https://developers.peakaccount.com/llms.txt |
| PEAK token · signature | https://developers.peakaccount.com/reference/peak-api-client-token-guide.md |
| PEAK rate limit · billing count · go-live | https://developers.peakaccount.com/reference/copy-of-api-rate-limiting-concurrency-control.md · .../peak-api-transaction-counting.md · .../peak-api-implementation-go-live-guide.md |
| PEAK webhook · API access rights | https://developers.peakaccount.com/reference/webhook.md · .../api-access-rights.md |
| PEAK help center (packages · User Token) | https://intercom.help/peak/en/articles/13176287 · https://intercom.help/peak/en/articles/10078711 |
| FlowAccount API page · price (rechecked 2026-10-26) | https://flowaccount.com/en/developers · https://flowaccount.com/en/pricing |
| FlowAccount connection · token | https://developers.flowaccount.com/tutorial/connect-open-api · .../tutorial/connect/client-credentials-flow · .../tutorial/connect/open-id-flow |
| FlowAccount spec · SDK | https://developers.flowaccount.com/swagger.yml · https://github.com/flowaccount/open-api (README says swagger.yml is the spec in actual use) |
| TRCLOUD · AccRevo | https://www.trcloud.co/api.php · https://www.accrevo.com/ |


---

# skill: error-handling-patterns

Use when writing code that can fail, with retry and timeout

# จัดการข้อผิดพลาด

> **กฎข้อเดียว:** จับ error เฉพาะตอนที่**ทำอะไรกับมันได้จริง**
> จับแล้วไม่ทำอะไร แย่กว่าไม่จับ เพราะระบบจะเดินต่อทั้งที่ข้างในพังไปแล้ว

## เมื่อไหร่ใช้ skill นี้

- เขียนโค้ดที่เรียกเครือข่าย ฐานข้อมูล ไฟล์ หรือระบบของทีมอื่น
- ต้องตัดสินใจว่าจะ retry ไหม กี่ครั้ง รอเท่าไหร่
- ผู้ใช้เจอข้อความว่า "เกิดข้อผิดพลาด" แล้วไม่รู้ต้องทำอะไรต่อ
- ไล่ปัญหาแล้วพบว่า log ไม่มีอะไรให้ดูเลย เพราะมีคน catch ทิ้ง

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| รูปร่าง JSON ของ error ที่ API ส่งออก | `web-service-essentials` · `api-conventions` | แทน |
| รูปแบบบรรทัด log และการปิดบังข้อมูล | `logging-standards` | แทน |
| แก้บั๊กเฉพาะจุดที่มีคนแจ้งมา | `targeted-fix` | แทน |
| ขั้นตอนตอนระบบล่มจริง | `incident-runbook-template` | แทน |
| ตัวชี้วัดอัตรา error และการแจ้งเตือน | `observability-basics` | คู่ |
| งานเบื้องหลังที่ล้มแล้วต้องไปไหนต่อ | `background-jobs` | คู่ |
| ข้อความ error ที่ต้องแปลหลายภาษา | `i18n-and-locale` | คู่ |
| test กรณีล้มเหลว | `testing-standards` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · จับที่ไหน ปล่อยที่ไหน

| ชั้น | ทำอะไร |
|---|---|
| ชั้นในสุด (เรียก DB, HTTP, ไฟล์) | **ปล่อยผ่าน** หรือแปลงเป็น error ของโดเมนที่มีความหมาย |
| ชั้นตรรกะธุรกิจ | จับเฉพาะที่มีทางเลือกสำรองจริง ๆ (มีค่าเริ่มต้น มีแหล่งข้อมูลสำรอง) |
| **ชั้นนอกสุด** (controller, handler, main) | **จับทุกอย่าง** · log 1 ครั้ง · แปลงเป็นคำตอบที่ผู้ใช้เข้าใจ |

> **log ที่เดียว คือชั้นนอกสุด** — ถ้าทุกชั้น catch แล้ว log แล้ว throw ต่อ
> error 1 ตัวจะกลายเป็น 10 บรรทัดใน log และไม่มีใครรู้ว่าเป็นเรื่องเดียวกัน

**3 อย่างที่ห้ามทำเด็ดขาด:**

```csharp
try { ... } catch { }                      // ผิด: กลืนเงียบ
try { ... } catch (Exception) { return null; }   // ผิด: ผู้เรียกเจอ null โดยไม่รู้ว่าเกิดอะไร
catch (Exception ex) { log.Error(ex); throw; }   // ผิด: log ซ้ำทุกชั้น
```

**ถ้าตั้งใจจะกลืนจริง ๆ ต้องเขียนเหตุผลไว้:**

```csharp
catch (SmtpException ex)
{
    // ตั้งใจกลืน — ส่งอีเมลแจ้งไม่สำเร็จไม่ควรทำให้การสั่งซื้อล้ม
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · ข้อความถึงผู้ใช้ ≠ ข้อความใน log

| | ผู้ใช้เห็น | log เก็บ |
|---|---|---|
| เนื้อหา | เกิดอะไร · ต้องทำอะไรต่อ | stack trace · ค่าตัวแปร · id ของคำขอ |
| ภาษา | ภาษาของผู้ใช้ | อังกฤษก็ได้ |
| รายละเอียดภายใน | **ไม่มีเลย** | มีได้ |
| ตัวเชื่อม 2 ฝั่ง | **รหัสอ้างอิง** | รหัสเดียวกัน |

```
ผิด: "เกิดข้อผิดพลาด"                    ผู้ใช้ทำอะไรต่อไม่ได้
ผิด: "SqlException: timeout expired"      หลุดรายละเอียดภายใน และเขาก็อ่านไม่ออก
ถูก: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
```

**ข้อความที่ดีมี 3 ส่วน** — เกิดอะไร · เพราะอะไร (ถ้าบอกได้) · ต้องทำอะไรต่อ
รหัสอ้างอิงคือ correlation id ตัวเดียวกับใน `logging-standards`

---

## 3 · แยกประเภทก่อนตัดสินใจ

| ประเภท | ตัวอย่าง | ทำยังไง | log ระดับ |
|---|---|---|---|
| **ผู้ใช้ทำผิด** | กรอกไม่ครบ ค่าผิดรูปแบบ | บอกให้แก้ · **ห้าม retry** | ไม่ต้อง log |
| **ชั่วคราว** | timeout · 503 · deadlock · เชื่อมต่อหลุด | **retry ได้** | warning |
| **ถูกจำกัดอัตรา** | 429 Too Many Requests | retry ได้ **หลังเวลาที่ `Retry-After` บอก** (ไม่มีค่านี้ → ใช้สูตร §4) · ห้ามยิงถี่กว่านั้น | warning |
| **ถาวร** | 404 · 401 · ข้อมูลไม่ตรงเงื่อนไข | ไม่ retry · บอกให้ชัด | warning |
| **บั๊กของเรา** | null reference · แปลงชนิดไม่ได้ | ไม่ retry · **ต้องมีคนแก้** | error |
| **ข้อมูลไม่สอดคล้อง** | ยอดไม่ตรง สถานะเป็นไปไม่ได้ | หยุด · **เรียกคน** | error + แจ้งเตือน |

> **การ retry error ที่ลองกี่ครั้งก็ไม่หาย คือการยิงซ้ำใส่ระบบที่ล้มอยู่ให้ล้มหนักขึ้น**
> `400` กับ `401` ยิงอีก 100 ครั้งก็ได้คำตอบเดิม

---

## 4 · timeout และการลองใหม่

**ทุกการเรียกออกนอก process ต้องมี timeout** — ค่าเริ่มต้นของไลบรารีส่วนใหญ่คือ "รอตลอดไป"

| การเรียก | timeout ที่ใช้ได้ทั่วไป |
|---|---|
| ฐานข้อมูล query ปกติ | 5–10 วินาที |
| HTTP ภายใน | 3–5 วินาที |
| HTTP ภายนอก | 10–30 วินาที |
| งานเบื้องหลังที่หนัก | ตั้งตามของจริง แล้วต้องตัดจบได้ |

**สูตรการลองใหม่** (service เรียก service · งานในคิวใช้ตัวเลขของ [`background-jobs`](../background-jobs/SKILL.md) §4 · มีคนนั่งรอหน้าจอ → ดูข้อสุดท้ายด้านล่าง):

```
ลองไม่เกิน 3 ครั้ง · หน่วงแบบทวีคูณ + สุ่ม
ครั้งที่ 1 รอ 1 วินาที · ครั้งที่ 2 รอ 2 · ครั้งที่ 3 รอ 4  (แต่ละครั้ง ±20% แบบสุ่ม)
```

- **ต้องมีตัวสุ่ม** — ไม่งั้นทุก instance จะลองใหม่พร้อมกันเป๊ะ แล้วทับระบบปลายทางซ้ำ
- **เวลารวมของการลองใหม่ต้องน้อยกว่า timeout ของผู้เรียก** ไม่งั้นเขาเลิกรอไปแล้วแต่เรายังลองอยู่
- **retry การเขียนต้องมี idempotency key** ไม่งั้นลูกค้าถูกตัดเงิน 2 รอบ (ดู `api-conventions`)
- **มีคนนั่งรออยู่หน้าจอ** → ลองใหม่อัตโนมัติไม่เกิน 1 ครั้ง แล้วแสดงปุ่ม "ลองอีกครั้ง" ให้เขากดเอง (ไม่ใช้ 3 ครั้งของสูตรด้านบน)

---

## 5 · ตัดวงจร (circuit breaker)

เมื่อปลายทางล้ม การยิงต่อไม่ได้ช่วยอะไร แค่ทำให้เราค้างตามไปด้วย

```
ปิด (ปกติ) → ล้มติดกัน N ครั้ง → เปิด (ไม่ยิงเลย ตอบ error ทันที)
           → รอ X วินาที → ครึ่งเปิด (half-open): ปล่อยให้ลอง 1 คำขอ → สำเร็จก็กลับไปปิด · ล้มก็เปิดต่อ
```

ค่าเริ่มต้นที่ใช้ได้: ถ้าล้ม 5 ครั้งติดกันภายใน 30 วินาที ให้เปิดวงจรไว้ 60 วินาที

**ควรใส่เมื่อ** — เรียกระบบภายนอกที่เคยล่ม · เรียกข้ามหลาย service · ปลายทางช้าแล้วลามมาถึงเรา
**ไม่ต้องใส่เมื่อ** — เรียกฐานข้อมูลของตัวเอง · งานที่วิ่งครั้งเดียวต่อวัน

---

## 6 · ล้มบางส่วน

งานที่ทำหลายรายการ ต้องตอบให้ได้ว่า **"ทำได้ 8 จาก 10 แล้วอีก 2 ไปไหน"**

| แบบ | เหมาะกับ |
|---|---|
| ทั้งหมดหรือไม่ทำเลย (transaction) | เงิน · สต็อก · อะไรที่ครึ่ง ๆ แล้วพัง |
| ทำเท่าที่ได้ แล้วรายงานรายการที่ไม่ผ่าน | นำเข้าข้อมูล · ส่งแจ้งเตือนหลายคน |

แบบที่สองต้อง**คืนรายการที่ล้มพร้อมเหตุผลรายตัว** ไม่ใช่บอกว่า "บางรายการไม่สำเร็จ"

**งานเก็บกวาดต้องรันเสมอ** ไม่ว่างานหลักจะสำเร็จหรือไม่ เช่น ปิดไฟล์ คืน connection ลบไฟล์ชั่วคราว
ให้ใช้ `finally` / `using` / `with` / `defer` แทนการเขียนซ้ำในทุกทางออก

---

## 7 · ตรวจก่อนส่ง

ไล่กับ diff ทุกครั้งที่แตะโค้ดที่เรียกออกนอก process (แนวคิดจาก ECC error-handling)

- [ ] ทุก `catch` ทำอย่างใดอย่างหนึ่งชัด ๆ: จัดการแล้วไปต่อ · แปลงเป็น error ของชั้นตัวเองแล้วโยนต่อ · ปล่อยไปให้ชั้นนอกสุด log (ข้อ 1) — ไม่มี `catch` ที่ log แล้วโยนต่อ
- [ ] ทุกการเรียกออกนอก (HTTP · DB · คิว · ไฟล์) มี timeout ที่ตั้งใจ และ retry เฉพาะประเภทชั่วคราวในข้อ 3 · การเขียนที่ retry มี idempotency key (ข้อ 4)
- [ ] ข้อความถึงผู้ใช้บอกว่าทำอะไรต่อ · ไม่มี stack trace หรือชื่อตารางออกไป (ข้อ 2) · log ของ error เดียวกันมี correlation id และข้อมูลพอให้ทำซ้ำ
- [ ] ผลที่ธุรกิจคาดไว้ (ไม่พบ · ยอดไม่พอ · ซ้ำ) เป็นค่าคืนหรือ type ที่ผู้เรียกต้องจัดการ ไม่ใช่ exception
- [ ] dependency ภายนอกแต่ละตัวมี test เส้นทางล้มอย่างน้อย 1 กรณี (timeout · 5xx · payload ผิด) และ test ยืนยันว่าระบบล้มบางส่วนตามข้อ 6 ไม่ล้มทั้งหน้า
- [ ] ไม่มีการกลืนความล้มเหลวเงียบ ๆ 4 แบบนี้ (เรียบเรียงจาก silent-failure-hunter ของ pr-review-toolkit · claude-plugins-official · Apache-2.0 · ดู 2026-11-10):
  - **optional chaining หรือ `?? ค่าเริ่มต้น`** ที่ทำให้ค่าที่หายไปผ่านไปโดยไม่มีใครรู้ (`order?.total ?? 0` ทำให้ออเดอร์ที่โหลดไม่ขึ้นกลายเป็นยอดศูนย์)
  - **fallback ไปใช้ mock หรือข้อมูลตัวอย่างนอก test** — ระบบจริงโชว์ข้อมูลปลอมแล้วดูเหมือนปกติ
  - **retry หมดแล้วเงียบ** — ครบรอบแล้วคืนค่าว่างหรือสำเร็จ ไม่โยน error และไม่แจ้งผู้เรียก
  - **catch ที่ log แล้วไปต่อใน UI** — ผู้ใช้เห็นหน้าจอปกติทั้งที่ข้อมูลไม่มา ต้องแสดงสถานะผิดพลาดให้เห็น

## 8 · Anti-patterns

- **`catch` ว่างเปล่า** — ปัญหาที่หายากที่สุดคือปัญหาที่ไม่มีร่องรอย
- **คืน `null` แทนการโยน error** — ผู้เรียกไม่รู้ว่าไม่มีข้อมูล หรือระบบพัง
- **`catch (Exception)` ที่ชั้นในสุด** — กลืนบั๊กของตัวเองไปด้วย
- **log แล้ว throw ต่อทุกชั้น** — error 1 ตัวได้ 10 บรรทัด
- **"เกิดข้อผิดพลาด"** — ไม่บอกว่าต้องทำอะไรต่อ
- **ส่ง stack trace ให้ผู้ใช้** — เปิดโครงสร้างภายในให้คนที่กำลังหาช่องโหว่เห็น
- **retry แบบไม่หน่วง** — ยิงรัวใส่ระบบที่ล้มอยู่
- **retry การเขียนโดยไม่มี idempotency key** — ได้รายการซ้ำ
- **ไม่มี timeout** — thread ค้างสะสมจนระบบตาย
- **ใช้ error เป็นตัวควบคุมการทำงานปกติ** — เช่นโยน exception เมื่อ "ไม่พบข้อมูล" ซึ่งเป็นเรื่องปกติ
