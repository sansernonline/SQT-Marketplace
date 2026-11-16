# skill: stack-python

Use when writing or testing Python code

# stack-python — Python that is easy to read, correctly typed, and safe to rerun

## Use when
- Writing, changing or testing Python (scripts · FastAPI · Django · pandas · pytest) in any repo.

Not for: writing less → `lazy-coding` · naming → `readable-code` · logging → `logging-standards` · catching errors → `error-handling-patterns` · test framework choice → `testing-standards` · LLM calls → `llm-engineering` · schema and migrations → `database-design` · background jobs → `background-jobs`.

## Steps
1. Find what the repo uses and use that; never mix tools (for example no `uv.lock` in a poetry repo).

   | File found | Install | Run a command |
   |---|---|---|
   | `uv.lock` | `uv sync` | `uv run <cmd>` |
   | `poetry.lock` | `poetry install` | `poetry run <cmd>` |
   | `pdm.lock` | `pdm install` | `pdm run <cmd>` |
   | `requirements*.txt` only | `python -m venv .venv` then `pip install -r requirements.txt` | Activate `.venv` first |
   | Nothing (new project) | `uv init` then `uv add` | `uv run <cmd>` |

   Always use a virtual environment, never `pip install` into the system Python. Read `requires-python` in `pyproject.toml` and use no newer syntax. Versions (checked 2026-10-14 · https://devguide.python.org/versions/): newest 3.15 · 3.14 bug fixes · 3.11–3.13 security only · 3.10 end of life · a new project starts at 3.14 or 3.15 if its libraries support it; check the page again before relying on this.
2. Write code with these patterns:
   - Type hints on every function and method called from outside the file, using `list[str]` · `X | None` (no `List` · `Optional` in new code).
   - Inside, `@dataclass(frozen=True)`; at the system edge, pydantic; never a bare `dict` across modules.
   - `pathlib.Path` (not `+ "/"`) · f-strings (no `%` or `.format()` in new code) · `with ...:` for files, locks, connections.
   - Logging: `log.info("ส่งแล้ว order_id=%s", oid)`, never an f-string in a log call.
   - Default value `None`, then build inside the function (never `def f(items=[])`).
   - Thai text files: `open(p, encoding="utf-8")` / `p.read_text(encoding="utf-8")`; Windows otherwise reads cp874 or cp1252.
   - Scripts: logic in functions, `if __name__ == "__main__": raise SystemExit(main())`; no code that runs at import.
   - CLI: what the repo uses; otherwise `argparse` before typer; never parse `sys.argv` yourself.
   - Money: `int` satang or `Decimal` from a string, never float; datetimes timezone-aware (`datetime.now(timezone.utc)`, show with `ZoneInfo("Asia/Bangkok")`, never `utcnow()`).
3. FastAPI or Django: pydantic at the edge (never a raw `request.json()` into a service) · `Depends` + `dependency_overrides` for DB session, clients, clock · `async def` only if the whole chain is async, otherwise plain `def` · 1 DB session per request via a `yield` dependency · Django: `select_related` / `prefetch_related` with a query-count test, and read each `makemigrations` file before commit. Details and code: [`references/web-and-data.md`](references/web-and-data.md).
4. pandas or numpy: `df.loc[mask, "col"] = x` (pandas 3.x Copy-on-Write), whole-column operations before `apply`, Thai CSV `utf-8-sig` then `cp874` with codes as `str`, seeded `np.random.default_rng(42)`. More: [`references/web-and-data.md`](references/web-and-data.md).
5. Run the routine commands (prefix with `uv run` / `poetry run` per the repo's tool):
   ```bash
   ruff check .                      # lint
   ruff format --check .             # รูปแบบโค้ด · แก้ด้วย ruff format .
   pyright                           # หรือ mypy . · ดูว่า repo ตั้งตัวไหนใน pyproject.toml
   pytest -q 2>&1 | tail -40         # ทั้งชุด · ดูแค่ท้ายผล (สรุปและ test ที่ล้ม)
   pytest -q tests/test_order.py::test_refund_over_limit   # test เดียวด้วย node id
   pytest -q -k "refund and not slow"                      # เลือกตามชื่อ
   ```
   Type checker: `[tool.pyright]` or `pyrightconfig.json` → pyright; `[tool.mypy]` or `mypy.ini` → mypy; neither → ask once; Astral's ty only if the repo already set it up. If the repo uses black · isort · flake8, keep them; do not move to ruff in the same task.
6. Tests: for new logic and bugs write the failing test first, then fix. `tmp_path` for files, `monkeypatch.setenv` for env, pass the clock in as a parameter (else `time-machine`; keep `freezegun` if the repo has it), `respx` / `responses` for HTTP (no real network), `testcontainers` of the production database type (not SQLite for Postgres). Setup and examples: [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#python--pytest).
7. Security (principles in `principle-secure-by-default`): lock and commit dependencies; scan with `pip-audit`; check a new package's exact PyPI name before adding; SQL by parameters, never an f-string; resolve user file names and check `.is_relative_to(base.resolve())`; secrets from the environment; `shell=True`, `pickle.load` of outside data and `yaml.load` are forbidden. Add dependencies only with `uv add` in a uv repo. Full list and the traps table: [`references/traps-and-security.md`](references/traps-and-security.md).

## Check before done
- [ ] `ruff check` and `ruff format --check` (or the repo's formatter) pass.
- [ ] The repo's type checker gives 0 errors in the files you changed.
- [ ] `pytest -q` is green for the whole suite (long output → `> _to_delete/test.txt 2>&1` then `tail -20`).
- [ ] Every new behavior has a test that was red before the fix.
- [ ] No blocking I/O (`requests` · `time.sleep` · sync driver) inside `async def`.
- [ ] Every text-file open gives `encoding="utf-8"`; stored datetimes have a timezone.
- [ ] Added dependencies are in the lock file and pass `pip-audit`.
- [ ] Confirm it really works before saying done → `principle-prove-it-works`; before sending, `security-gate`.

## References
- [`references/web-and-data.md`](references/web-and-data.md) — open for FastAPI, Django, pandas, numpy, torch, notebooks
- [`references/traps-and-security.md`](references/traps-and-security.md) — open when debugging a strange failure, writing tests, or reviewing security


## reference: traps-and-security.md

# Common traps, tests and security details · stack-python

Open when debugging a strange Python failure, writing tests, or reviewing a diff for security.

## Common traps

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
| Blocking inside `async def` | The whole server stalls at the pace of the slowest request | See [web-and-data.md](web-and-data.md), "Web" |

## Tests

For pytest setup · fixtures · `parametrize` and examples, see [`testing-standards/references/per-stack.md`](../../testing-standards/references/per-stack.md#python--pytest); this section keeps only Python-specific traps.

- Temporary files use `tmp_path`; never write into the repo's folders · environment values use `monkeypatch.setenv`
- Time: pass the clock into the function as a parameter first; if you cannot change it, use `time-machine`, but if the repo already uses `freezegun`, keep using it
- External HTTP: httpx uses `respx` · requests uses `responses` · never hit the real network in a unit test
- For a real database, use `testcontainers` of the same kind as production; do not use SQLite in place of Postgres
- For new logic and bugs, write a test that fails (red) first, then fix until it passes (green)
- Look at coverage only for changed lines: `pytest --cov --cov-report=term-missing`, then go through the lines in the diff that did not run

## Python-specific security

The 10 principles are in `principle-secure-by-default`; this is how to do them in Python.

- Always lock dependencies (`uv.lock` · `poetry.lock` · `pip-compile --generate-hashes`) and commit the lock file
- Vulnerability scanning: `pip-audit` (works with every tool); uv has `uv audit` but it is still a preview (the version that first has it (รอยืนยัน) (pending confirmation) · source: https://github.com/astral-sh/uv/blob/main/CHANGELOG.md · checked 22 Oct 2569 BE), so it may be used, but Continuous Integration (CI) still relies on `pip-audit`
- Before `uv add` or `pip install` of a new package, spell the name exactly as on its PyPI page, check the maintainers and the latest release date, and beware of look-alike names (`reqeusts` · `python-dateutil` versus `dateutil`)
- SQL passes values through parameters: `cur.execute("... WHERE id = %s", (oid,))`; with SQLAlchemy use `text(...)` with `:name`, and never an f-string
- File names from users: `(base / name).resolve()` then check `.is_relative_to(base.resolve())`; for uploads see `file-upload-and-storage`
- Secrets are read from the environment (`os.environ["KEY"]` or pydantic-settings) and checked at startup; keep `.env` in `.gitignore` (see `config-and-secrets`)
- Django production: `DEBUG = False` · `ALLOWED_HOSTS` with real names · `SECRET_KEY` from the environment · run `python manage.py check --deploy` before release


## reference: web-and-data.md

# Web (FastAPI, Django) and data/AI details · stack-python

Open when the task touches FastAPI · Django · pandas · numpy · torch · notebooks.

## Web: FastAPI and Django

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

## Data and AI

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


---

# skill: stack-sql

Use when writing or reviewing SQL queries

# stack · SQL — write queries that are correct, fast, and change data safely

> **The one rule:** a query that has never run against a realistic amount of data is not finished

## Use when
- Writing, reviewing or tuning SQL (SQL Server · PostgreSQL · MySQL), or changing data with a script.

Not for: table design, naming, data types, expand-and-contract migrations → `database-design` · Excel/CSV → `data-import-export` · Thai dates and sorting in the app → `i18n-and-locale`.

## Steps
1. **Know the database first.** Engine and version: `SELECT @@VERSION` (SQL Server; also `SERVERPROPERTY('Edition')`, many features are Enterprise-only) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL). Find what runs migrations (`Migrations/` EF Core · `db/migration/V1__*.sql` Flyway · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · `sql/`) and use that tool; never add a second one or change the schema by hand. Check server collation and time zone (`SERVERPROPERTY('Collation')` · `SHOW timezone`).
2. **Never run anything on production**; prepare the commands for a person to approve (`principle-proceed-on-reversible-work`). Use a local or sandbox database with row count close to real (100 rows hides every speed problem); if none, generate mock data so volume and value distribution are close to real.
3. **Write correct queries:**

   | Topic | Do this | Trap |
   |---|---|---|
   | Values from users | Always a parameter | String concatenation → SQL injection |
   | Columns | Full column names | `SELECT *` pulls too much, breaks on a new column, blocks covering index |
   | NULL | `IS NULL` · `NOT EXISTS` | `= NULL` never true · `NOT IN (subquery)` with one NULL → 0 rows |
   | JOIN | Count rows before and after | Join the 1-to-many side then `SUM` → doubled totals; sum before the join |
   | GROUP BY | Every non-aggregate column in it | MySQL with `ONLY_FULL_GROUP_BY` off → random value |
   | Division | `CAST(a AS decimal(18,4)) / b`, guard `NULLIF(b, 0)` | SQL Server and PostgreSQL: `5/2 = 2`; MySQL: `2.5000` |
   | Data types | Parameter of the same type as the column | SQL Server sends `nvarchar` against `varchar` → `CONVERT_IMPLICIT` → full scan |
   | Date range | `>= start AND < end` | `BETWEEN '2026-01-01' AND '2026-01-31'` drops the 31st after midnight |
   | Time zone | Store UTC, convert to Asia/Bangkok on display (SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` on `timestamptz`) | Thai time with no offset → 7 hours off when merging |
   | Buddhist Era year | Always store Common Era (ค.ศ.), convert on display | Storing 2569 breaks age, sorting, export |
   | Money | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 ≠ 0.3 |
   | Sorting Thai names | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | General collation → leading vowels (เ แ โ ใ ไ) sort wrong silently |

   A Thai collation is not on every server; check before choosing (commands in [`references/snippets.md`](references/snippets.md)).
4. **Make it fast by reading the real plan on near-real data, never guessing.** Conditions sargable (no function around an indexed column) · every index can say which query it serves · deep paging uses keyset · count N+1 from the ORM log · big UPDATE/DELETE in batches. Commands per engine, keyset example, batches, parameter sniffing: [`references/performance.md`](references/performance.md).
5. **Change data safely.** Scripts can be rerun · back up before a big change · count rows first and check before `COMMIT` · upsert in the engine's own form · touch tables in the same order (deadlocks) · `ALTER TABLE` on a big table needs `lock_timeout`. Isolation levels, upsert, non-locking index creation, row-count checks: [`references/safe-changes.md`](references/safe-changes.md).
6. **Avoid the usual traps** (`MERGE` without `HOLDLOCK` · triggers with business rules · cursors · `NOLOCK` → use RCSI · collation mismatch in joins · gaps in ids · partial-index candidates · bloat after big deletes): [`references/traps.md`](references/traps.md).
7. **Test** against a real database of the production kind, never SQLite or in-memory (NULL, collation, locks differ). Fresh database every run with Testcontainers and seed script; stored procedures use tSQLt (SQL Server) or pgTAP (PostgreSQL). Check row counts and values: NULL · midnight date edges · Thai names · fractional money. Run a new migration on a production-like copy with near-real volume, time it, watch the locks. For a bug, write the failing test first (`principle-fix-root-cause`); framework → `testing-standards`.
8. **Security.** 1 app, 1 database user with only needed permissions; never `sa` · `postgres` · `root`, and migrations run as a separate user. Dynamic SQL with user values: pass values as parameters, choose table or column names from an allowlist and quote them (`sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` in [`references/snippets.md`](references/snippets.md)). Several companies in one table → consider row-level security (SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY`; the table owner bypasses unless `FORCE ROW LEVEL SECURITY`). Do not pull personal data columns unless used; Dynamic Data Masking is not access control (`pdpa-compliance`). Changes to important data leave a trace of who (`audit-trail`). Injection and permissions → `principle-secure-by-default`.

## Check before done
- [ ] Every outside value is a parameter · no `SELECT *`.
- [ ] Checked NULL · half-open date ranges · division · parameter types match the columns.
- [ ] Looked at the real plan on near-real data, noted logical reads or time before/after.
- [ ] Scripts can be rerun and big data goes in batches (`principle-safe-to-rerun`).
- [ ] Transaction + row counts checked before `COMMIT` · the way back written and a backup confirmed.
- [ ] A test runs against the same kind of database as production.

## References
- [`references/performance.md`](references/performance.md) — open when reading a plan, paging, batching, parameter sniffing, bloat commands
- [`references/safe-changes.md`](references/safe-changes.md) — open when changing data, upsert, isolation, creating an index on a live table
- [`references/snippets.md`](references/snippets.md) — open for collation checks and dynamic-SQL examples
- [`references/traps.md`](references/traps.md) — open when a query behaves oddly or during review


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

# Changing data safely — engine comparison table and examples (full version)

Read this when writing a data-fix script, an upsert or an ALTER TABLE · the short rules are in `SKILL.md` item 4

| Topic | SQL Server | PostgreSQL | MySQL (InnoDB) |
|---|---|---|---|
| Default isolation | Lock-based READ COMMITTED. Azure SQL Database already has Read Committed Snapshot Isolation (RCSI) on | READ COMMITTED (reads from a snapshot, does not block writers) | REPEATABLE READ |
| A rerunnable upsert | `UPDATE`, then `INSERT ... WHERE NOT EXISTS` in a transaction with `UPDLOCK, HOLDLOCK` | `INSERT ... ON CONFLICT (...) DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` |
| Create an index without locking the table | `WITH (ONLINE = ON)`, Enterprise only (including 2025) | `CREATE INDEX CONCURRENTLY`, but it cannot run inside a transaction | `ALGORITHM=INPLACE, LOCK=NONE` |

- If readers often block writers in SQL Server, consider turning on `READ_COMMITTED_SNAPSHOT ON`. It adds load on tempdb, so test first.
- To prevent deadlocks: every piece of code touches tables in the same order, keep transactions as short as possible, and never wait on an external API while holding a transaction.
- Every script must be rerunnable (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- Before a command that deletes or edits a lot of data: back up the affected tables, or confirm that the latest backup can really be restored, and write down the way back before running.
- Count the expected rows first, then check before `COMMIT`:

```sql
BEGIN TRAN;
UPDATE dbo.orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < @cutoff;
IF @@ROWCOUNT <> @expected
BEGIN ROLLBACK; THROW 50001, 'จำนวนแถวไม่ตรงกับที่นับไว้', 1; END
COMMIT;
-- PostgreSQL: in a DO block use GET DIAGNOSTICS n = ROW_COUNT; if it does not match → RAISE EXCEPTION
```

- `ALTER TABLE` on a big table:
  - PostgreSQL asks for an `ACCESS EXCLUSIVE` lock and waits for long queries still running. While it waits, every new query queues behind it too, so set `SET lock_timeout = '5s'` and retry.
  - PostgreSQL 11+ can add a column with a constant default instantly, but changing a column type rewrites the whole table.
  - SQL Server can add a `NOT NULL` column with a default instantly only on Enterprise. Other editions must write every row.
  - To change a type or move data, use expand-and-contract per `database-design`.


## reference: snippets.md

# Short code examples — Thai time · dynamic SQL

The rules are in `SKILL.md` items 2 and 7

## Convert UTC to Thai time when displaying (item 2)

```sql
-- Convert UTC time to Thai time when displaying
SELECT created_at AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'  -- SQL Server (Windows-style zone name)
FROM dbo.orders;
SELECT created_at AT TIME ZONE 'Asia/Bangkok' FROM orders;                  -- PostgreSQL (timestamptz column)
```

## Dynamic SQL that passes values as parameters (item 7)

```sql
-- SQL Server
EXEC sp_executesql N'SELECT id, name FROM dbo.customers WHERE email = @email',
                   N'@email nvarchar(320)', @email = @input;
-- Column name: QUOTENAME(@column) after checking against an allowlist
-- PostgreSQL in plpgsql
EXECUTE format('SELECT id, name FROM %I WHERE email = $1', tbl) USING p_email;
```

## Check whether a Thai collation exists (item 2)

- PostgreSQL has `th-TH-x-icu` when the server is built with International Components for Unicode (ICU). Check with `SELECT collname FROM pg_collation WHERE collname LIKE 'th%'`
- For MySQL, check which Thai collations exist with `SHOW COLLATION LIKE '%thai%'` before choosing


## reference: traps.md

# Common SQL traps · stack-sql

Open when a query behaves oddly, or when reviewing SQL for the usual mistakes. Example commands for the last two traps are in [performance.md](performance.md).

- `MERGE` (SQL Server) has several bugs, and without `HOLDLOCK` 2 sessions insert duplicates → separate `UPDATE` + `INSERT`, or `MERGE ... WITH (HOLDLOCK)` with a test
- A trigger hides business rules and breaks on multi-row inserts → keep rules in app code; use triggers only for audit · a cursor/row-by-row loop → a set-based statement
- `WITH (NOLOCK)` reads uncommitted data, rows go missing or repeat → turn on Read Committed Snapshot Isolation (RCSI) instead · building SQL by string concatenation → parameters
- A collation mismatch in a join → set them equal on the column (putting `COLLATE` in the query stops it using the index)
- Ids are not always consecutive (identity jumps · a sequence does not go back on rollback) → document numbers that must have no gaps are issued by yourself in a counter table
- A timestamp with no time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` agreed to be UTC, or `datetimeoffset`
- A query that always filters a small share of rows (`WHERE status = 'pending'` · `deleted_at IS NULL`) but the index covers every row → the index is big and the planner does not pick it → put that condition into the index itself: PostgreSQL `CREATE INDEX ... WHERE status = 'pending'` · SQL Server filtered index `CREATE INDEX ... WHERE status = 'pending'` (the query must write the same condition for it to be used · idea from supabase/agent-skills · MIT)
- After deleting or updating many rows, queries get slower though the plan did not change → table and index bloat (dead tuples · split pages) → in PostgreSQL look at `pg_stat_user_tables.n_dead_tup` then `VACUUM (ANALYZE)` or `REINDEX CONCURRENTLY` · in SQL Server look at `sys.dm_db_index_physical_stats` then `ALTER INDEX ... REORGANIZE` (below 30%) or `REBUILD` · check this before blaming the query


---

# skill: api-conventions

Use when adding API endpoints or checking API consistency

# Application Programming Interface (API) conventions

> **The one rule:** decide once, apply to every endpoint.
> An API where every endpoint behaves the same, even if "not quite right in theory", is easier to use
> than an API where each endpoint is correct in its own way, because with the latter the caller must guess again every time.

## When to use this skill

- Starting to design the first API of a project
- Adding an endpoint to an existing API and wanting it to match what is there
- Reviewing an API and feeling that its parts are not alike
- Needing to answer "if we change it this way, will clients break?"

Not for: designing all the endpoints of one feature → command `/api-design` · health check, error envelope, graceful shutdown → `web-service-essentials` · tables and relations → `database-design`

**A template of the conventions document that you can copy and use** → `assets/API-CONVENTIONS.md`

---

## 1 · The conventions document must exist

Put the file `docs/API-CONVENTIONS.md` in place (the template is at `assets/API-CONVENTIONS.md`).
Write every decision made from this page into that file, with the date and a short reason.

---

## 2 · Naming URLs

```
GET    /v1/orders                 list
POST   /v1/orders                 create
GET    /v1/orders/{id}            single item
PATCH  /v1/orders/{id}            partial update
PUT    /v1/orders/{id}            replace the whole item
DELETE /v1/orders/{id}            delete
GET    /v1/orders/{id}/items      child resource
POST   /v1/orders/{id}/cancel     an action that is not CRUD (Create, Read, Update, Delete)
```

| Rule | ✓ | ✗ |
|---|---|---|
| Plural nouns | `/orders` | `/getOrders`, `/order` |
| Lowercase, hyphens | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| At most 2 levels deep | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| Use a verb only when it is truly not CRUD | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**An action that is not CRUD** (approve, cancel, resend) uses `POST /{resource}/{id}/{action}`.
Do not bend it into a `PATCH` that edits `status`, because a status change usually has more side effects than an ordinary field edit.

**How to use `PATCH`:** pick one style for the whole system. Sending only the changed fields (`merge patch`) is recommended,
and you must define clearly whether `null` means "clear the value" or "leave it alone" (see section 6).

---

## 3 · Versioning

| Method | Pros | Cons |
|---|---|---|
| **In the path** `/v1/orders` | Obvious, easy to test, easy to cache | The URL changes when the version goes up |
| In a header `Accept: application/vnd.acme.v1+json` | The URL stays fixed | Invisible when debugging, often forgotten |

> **Choose the path** unless there is a specific reason — everyone can see the version from a single line in the log.

**Which changes break callers:**

| Change | Breaks? |
|---|:--:|
| Add a new endpoint | No |
| Add an **optional** field to a request | No |
| Add a field to a response | No* |
| Add a new enum value | **Breaks** — a client whose `switch` covers every value will meet an unknown one |
| Remove/rename a field | **Breaks** |
| Change a data type (`"12"` → `12`) | **Breaks** |
| Make a formerly optional field required | **Breaks** |
| Change the HTTP status returned in an existing case | **Breaks** |
| Make a validation rule stricter | **Breaks** |

\* Only when callers were told from the start to "skip fields you do not recognize".
This must be written in `API-CONVENTIONS.md`, not left to hope.

**Raise the major version only when truly needed**, because every version still open is another body of code to maintain.

---

## 4 · Pagination

**Every endpoint that returns a list must have pagination from day one**, with no exceptions.
A list that "only has a few items" will have 10,000 in 2 years.

| Method | Use when | Limits |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | Default · lots of data · data is added while the user is browsing | Cannot jump to page 7 |
| offset `?limit=50&offset=100` | Page numbers must be clickable · little data | Slower the deeper the page · if a row is inserted while browsing, data repeats or goes missing |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null when there is no more
    "hasMore": true
  }
}
```

- Always wrap the list in `data`, because a bare array leaves no room to add page information later.
- `limit` has a default and a **ceiling enforced on the server** (for example default 20, maximum 100).
- `totalCount` is expensive to count, so make it optional with `?includeTotal=true`. Do not count every time.
- **The cursor must be opaque** (callers must never decode or build one themselves).

---

## 5 · Filtering · sorting · requested fields

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| Topic | Convention |
|---|---|
| Filter by equal value | `?status=confirmed` |
| Several values | `?status=confirmed,shipped` |
| Range | `?createdAt[gte]=...&createdAt[lt]=...` |
| Sort | `?sort=-createdAt,orderNo` — `-` means descending |
| Text search | `?q=สมชาย` kept separate from filtering |
| Select fields | `?fields=id,orderNo` |

- **Accept only the fields you have defined.** If any field name is accepted, you get security holes and queries with no index.
- For an unknown parameter, answering `400` is better than skipping it silently. Otherwise a caller who mistypes gets wrong data without knowing.

---

## 6 · Data formats

| Data | Format | Example |
|---|---|---|
| Field names | `camelCase` across the system | `createdAt` |
| Time | RFC 3339 · UTC · ends with `Z` | `"2026-09-25T09:42:13.482Z"` |
| Date only | `YYYY-MM-DD` | `"2026-09-25"` |
| Money | the number as a **string** + a separate currency | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **always a string** | `"1042"` not `1042` |
| enum | `SCREAMING_SNAKE` or `lower_snake`, pick one style | `"CONFIRMED"` |
| Duration | seconds as a number, named so the unit is clear | `"timeoutSeconds": 30` |
| Country / currency / language | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> **A numeric id in JSON is a time bomb** — JavaScript stores integers safely up to 9,007,199,254,740,991.
> A `bigint` above that is silently rounded at `JSON.parse`, and changing it to a string later is a breaking change.
>
> **Money as a float in JSON** — `1250.10` passed through 2 programming languages may become `1250.0999999999999`.

**`null` and "no field" must mean different things:**

- In a response, a field that exists but has no value is sent as `null`, not dropped, so callers do not have to check 2 cases.
- In a `PATCH`, sending `{"note": null}` means clear the value, and leaving out the `note` key entirely means leave it alone.

**An empty array is `[]`, not `null`**, so callers can loop over it directly.

---

## 7 · Errors

The error format (RFC 9457 · `requestId` · an `errors` array of `{field, code, message}`) and examples live in one place, `web-service-essentials` section 2. Follow that.
What still needs agreement is the **field-level error**:

- **`code` is for programs, `message` is for people.** Never make callers write conditions against the message text.
- Point to the field location with the full path, including array indexes.
- **Return the errors for all fields at once**, not one at a time, so users do not have to submit 5 times.
- If several languages are supported, choose Thai or English text from `Accept-Language`.

**Pick the status to match:** `400` malformed request · `401` not authenticated · `403` authenticated but not permitted ·
`404` does not exist, or you do not want to reveal that it exists · `409` conflicts with the current state · `422` well-formed but the data fails the rules · `429` too many calls

---

## 8 · Repeat calls without repeat effects, and edit conflicts

### idempotency key (a request code — sending it again does not do the work again)

**Required on every `POST` that has a financial effect or sends something out to the outside world.**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← created by the caller, kept for use when retrying
```

- The server stores the key together with the result for at least 24 hours.
- Same key with the same body: return the earlier result and do not repeat the work.
- Same key with a **different** body: answer `422` and do not do new work.
- A network drop while waiting for the answer is normal, not a special case, so callers always retry.

### Edit conflicts (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 normally · 412 if someone edited it first
```

Without this, whoever saves second overwrites the first person's work and nobody knows.

---

## 9 · Rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← must always accompany a 429
```

If a `429` has no `Retry-After`, the caller must guess, and most guess "try again at once".

---

## 10 · Retiring an endpoint

1. Announce in advance, and say what to use instead.
2. Send these headers in every response of that endpoint:
   ```
   Deprecation: @1790812800
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
   `Deprecation` follows the Request for Comments (RFC) 9745 standard (Mar 2025). It must be a date in the form `@<unix seconds>` (this example is 1 Oct 2026 00:00 UTC), not `true`. Checked 22 Oct 2026 (B.E. 2569).
3. **Check the logs for who still calls it**, then contact them directly. Do not wait for them to go quiet on their own.
4. Close it only after the announced date, not before.

A fitting period: for an internal API, 1 release cycle. For an API used by outsiders, at least 6 months.

---

## 11 · Check before releasing a new endpoint

Go through every item against the endpoint you added. Fail one and it is not merged yet.

- [ ] The URL is a plural noun per section 2 · sits under a version per section 3 · has no `GET` that changes data
- [ ] Every list has pagination and a page-size ceiling (section 4) · filter and sort use the same parameter names as existing endpoints (section 5)
- [ ] Dates · ids · money are in the formats of section 6 · the response is not a raw database entity
- [ ] Every error follows `web-service-essentials` §2 and has a fixed `code` (section 7) · a request that creates or pays accepts an idempotency key · an edit accepts `If-Match` (section 8)
- [ ] Auth and rate limit are stated (section 9) · it is in OpenAPI, and the cURL examples in the docs really run
- [ ] There is a contract test or an endpoint-level test with at least 1 success case and 1 error case — check the response against OpenAPI in CI · Pact when the caller is on another team · `oasdiff breaking` on every PR: [`references/contract-testing.md`](references/contract-testing.md)

## 12 · Anti-patterns

- **`200 OK` with `{"success": false}`** — monitors and logs will not see that it failed.
- **Verbs in the URL** — `/createOrder`, `/getOrderById`
- **A list with no pagination** — one day it will return 50,000 rows at once.
- **A different date format on each endpoint** — for example `"25/09/2026"`, where nobody knows whether day or month comes first.
- **Sending a database entity out as is** — every time a column is added, the API changes by accident, and internal data may leak.
- **Mixed field names** such as `created_at` and `updatedAt` in one response.
- **A `GET` that changes data** — a web page prefetcher will fire it by itself with nobody clicking.
- **Error messages that keep changing** with no fixed `code`.
- **No documentation** — an OpenAPI generated from the real code is better than hand-written docs that do not match.


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

# Importing and exporting data

> **The one rule:** validate everything first, then write.
> If you write halfway and then find a bad row, the data is left half-done and nobody knows what to fix.

## When to use this skill

- A screen lets users upload Excel or CSV to bring data into the system
- A button exports to Excel or CSV
- Moving data from an old system into a new one
- A user uploads and gets the message "ไฟล์ไม่ถูกต้อง" (file is invalid) without knowing what is wrong

## When to use another skill instead, or together

| Job | skill | |
|---|---|---|
| Receiving general file uploads (images, documents) | `file-upload-and-storage` | Instead |
| Building a nicely formatted Excel file | `anthropic-skills:xlsx` | Instead |
| Queue mechanics and progress | `background-jobs` | Instead |
| Buddhist Era (B.E.) years and Thai sorting order | `i18n-and-locale` | Instead |
| Sending documents into Thai accounting software (PEAK · FlowAccount) through an API instead of a file | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | Instead |
| Recording who imported or exported what | `audit-trail` | Together |
| Masking personal data in export files | `pdpa-compliance` | Together |
| Telling the user when an import finishes | `notifications` | Together |
| Limits and constraints of the target table | `database-design` | Together |

---

## 1 · Give a template, do not make people guess

**Every import screen needs a button to download a template.** The template contains

- Column headers that match exactly what the system needs
- **1–2 correct sample rows**
- A row explaining which columns are required, what format, and which values are accepted
- A separate sheet for lists of selectable values (status, type, unit)

| How the file differs from the template | Do this |
|---|---|
| Column order swapped | ✓ Read by header name, not by position |
| Header has extra spaces or different letter case | ✓ Trim spaces and compare case-insensitively |
| Extra unknown columns | ✓ Skip them, but **tell the user what was skipped** |
| A required column is missing | ✗ Stop at once and say which column is missing |

---

## 2 · Three layers of validation before writing anything

| Layer | Checks | Example message |
|:--:|---|---|
| 1 · File | Opens · has the needed sheet · all required columns present · within the maximum row count | "ไม่พบคอลัมน์ 'รหัสสินค้า'" (column 'product code' not found) |
| 2 · Per row | Data type · required values · in the allowed list · number range | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" (row 42, column 'quantity' must be a number above 0, found '-5') |
| 3 · Relationships | The code exists in the system · no duplicates within the file · business rules | "แถว 88 ไม่พบลูกค้ารหัส C-1042" (row 88, customer code C-1042 not found) |

**An error report must state: row · column · value found · value expected**

```
Wrong: "ไฟล์ไม่ถูกต้อง"
Wrong: "พบข้อผิดพลาด 37 รายการ"
Right: a table of check results, with a button to download the original file with an "ข้อผิดพลาด" (error) column appended
```

> **Report all errors in one pass. Do not stop at the first bad row.**
> The user then fixes everything in one round, instead of uploading 37 times.

---

## 3 · Writing into the system

| Mode | Use when |
|---|---|
| **All or nothing** | The default. The file must be fully correct to be imported |
| Do what passes, skip the bad rows | The file is very large and the rows are unrelated, and **the user must choose this, the system does not decide for them** |

- **Always show a summary page before confirming**, such as "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" (will add 120 · update 45 · skip 3 · error 0), then have the user click confirm
- If the file has duplicate rows, stop and say so. Do not silently use the last row
- If the data already exists in the system, let the user choose: skip · overwrite · stop
- **Every import must be recorded in the audit log**: who imported, which file, how many rows affected (see `audit-trail`)
- **Keep the original file**, so when there is a problem you can look back at what the submitted file really looked like
- Make it reversible: store a batch id (the id of the import run) on every imported row

**Large files run as background jobs.** Above roughly 1,000 rows, put them in a queue,
split into batches of 500 rows, show progress, and allow cancel (see `background-jobs`).

---

## 4 · Excel and CSV traps

| Trap | What happens | Fix |
|---|---|---|
| **Thai in CSV garbled** | Opened in Excel, the characters are unreadable | Save as UTF-8 **with a BOM**, or recommend .xlsx |
| **Codes starting with 0 lose it** | `0812345678` becomes `812345678` | Always read as text, and on export set the cell format to text |
| **Long numbers turn into scientific notation** | A 13-digit ID card number → `1.23457E+12` | Same as above |
| **Dates interpreted automatically** | Is `03/04/2026` March or April | Force `YYYY-MM-DD` in the template |
| **B.E. and C.E. years mixed** | Silently off by 543 years | **Ask on the import screen which year style the file uses** |
| Trailing spaces in a value | Code matching fails | Trim leading and trailing spaces on every value |
| Cells that are formulas | You get the formula instead of the value | Read the calculated value |
| **Values starting with `=` `+` `-` `@` in an export file** | Excel runs a command when the user opens it | Prefix with `'` any value that starts with these characters |

> **A vulnerability people rarely know about:** a customer name of `=cmd|'/c calc'!A1`, if exported raw
> and someone opens it in Excel, will try to run the command for real. So always escape on export.

---

## 5 · Export

| Topic | Rule |
|---|---|
| Size | Above roughly 50,000 rows, run it as a background job and send a download link |
| Permission | **Export only data that this user already has permission to see**, because this is the most common leak |
| audit | Record every time who exported what data, which period, how many rows |
| Personal data | Mask columns that are not needed (see `pdpa-compliance`) |
| File name | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| File header | Put in the filter conditions used and the export time. Otherwise in 3 months nobody knows what data this file is |
| Download link | Must expire (see `file-upload-and-storage`) |
| Format | `.xlsx` for people to read · CSV for machines to read |


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

# Error handling

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
| The JSON shape of errors the API sends out | `web-service-essentials` · `api-conventions` | instead |
| Log line format and data masking | `logging-standards` | instead |
| Fixing one specific bug someone reported | `targeted-fix` | instead |
| Steps when the system is really down | `incident-runbook-template` | instead |
| Error-rate metrics and alerts | `observability-basics` | alongside |
| Where a failed background job goes next | `background-jobs` | alongside |
| Error messages that must be translated into several languages | `i18n-and-locale` | alongside |
| Tests for failure cases | `testing-standards` | alongside |

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
The reference code is the same correlation id as in `logging-standards`.

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

**The retry formula** (service-to-service calls · jobs in a queue use the numbers in [`background-jobs`](../background-jobs/SKILL.md) §4 · when a person sits waiting on the screen → see the last item below):

```
at most 3 tries · exponential delay + jitter
try 1 waits 1 second · try 2 waits 2 · try 3 waits 4  (each ±20% random)
```

- **You need the random part** — otherwise every instance retries at the exact same moment and hits the target system again together
- **The total retry time must be less than the caller's timeout**, or the caller has given up while we are still trying
- **Retrying a write needs an idempotency key**, or the customer is charged twice (see `api-conventions`)
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

- [`references/sources.md`](references/sources.md) — where the checklist ideas came from


## reference: sources.md

# Sources · error-handling-patterns

- Section 7 checklist: idea from ECC error-handling.
- The 4 silent-failure kinds in section 7: adapted from silent-failure-hunter in pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10.
