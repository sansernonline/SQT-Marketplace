---
name: stack-python
description: Use when writing or testing Python code
---

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
