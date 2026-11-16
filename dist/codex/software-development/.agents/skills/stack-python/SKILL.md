---
name: stack-python
description: Use when writing or testing Python code
---

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
