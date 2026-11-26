# skill: stack-typescript

Use when writing or reviewing TypeScript code

# stack-typescript — TypeScript the team can read easily and that is hard to break

> **One rule:** let the compiler catch bugs instead of people. `tsc` passing with 0 errors does not mean done, but failing means not started.

## Use when
- Writing or reviewing TypeScript in a Node backend (Express · Fastify · NestJS), Angular, or React/Vite code.

Not for: least code → `lazy-coding` · names and layout → `readable-code` · types and data shape before writing → `principle-data-shape-first` · browser tests → `e2e-testing-patterns` · screens and tokens → `web-app-design`

## Steps
1. Look at the repo before the first command. Use the package manager its lockfile shows (`package-lock.json` · `pnpm-lock.yaml` · `yarn.lock`), never 2 lockfiles. Follow `.nvmrc` or `engines` for Node; if absent use the latest Long Term Support (LTS), re-checking https://nodejs.org/en/about/previous-releases first (dated notes: `references/sources.md`). Follow the existing module system (`"type"` · `tsconfig` `module`), never mix ESM and CJS. Use an existing `package.json` script before guessing a command.
2. Install and verify with the repo's commands: `npm ci` (pnpm `install --frozen-lockfile` · yarn `install --immutable`) · `npx tsc --noEmit` · `npm run lint && npm test && npm run build 2>&1 | tail -40` · one test: `npx vitest run <file> -t "<name>"`. Angular: `ng test --include=...` and check the bundle size at the end of `ng build`. `npm install <pkg>` changes the lockfile, so commit it in the same round.
3. Write strict TypeScript. Instead of `any` use `unknown` then narrow (`typeof` · `in` · a type guard). Instead of `value!` to silence an error, check `if (!value) throw …` or fix the source type. Instead of `as Order` on outside data, parse with zod (or the repo's library). Instead of several booleans for a state, use a discriminated union. Instead of `const x: Config = {...}` that loses the literal, use `satisfies Config`.
4. Set `tsconfig` `"strict": true` · `noUncheckedIndexedAccess` · `noImplicitOverride`. If an old repo has strict off, turn it on one folder at a time, not for the whole repo in one task. For `enum` vs string union follow the repo; a new repo uses `as const` + union. Keep API types shared by frontend and backend in one place.
5. For types standing for a national ID number, an amount of money or a document number, apply 4 checks: hide the internals (one `parse` function creates values) · put the rules in the type (a rule-breaking value cannot be created) · validate once at the entrance · expose nothing mutable (`readonly` fields, never return an internal array). Examples: `references/examples.md`.
6. Node backend: turn on `@typescript-eslint/no-floating-promises` and `no-misused-promises`; every `async` is `await`ed or has a `.catch` that does something real. Express 4 does not forward `async` handler errors: use Express 5 or wrap (Fastify and NestJS handle it). Parse `process.env` with a schema once at startup and refuse to start on a bad value (`config-and-secrets`). Shut down cleanly: on `SIGTERM` stop accepting requests → wait for pending → close the DB pool, with a force-exit timer (code in `references/examples.md`). Use `stream.pipeline` for large files, never `readFile` them whole. No `fs.*Sync` · heavy `crypto.*Sync` · big loops in a request path. Use parameterized queries (`$1` · `?`) or an ORM, never string-concatenated SQL. Use structured logs per `logging-standards`, no `console.log` in a server.
7. Angular: standalone components · `inject()` · `signal`/`computed`/`input()`/`output()` · `OnPush` · `@if`/`@for (x of xs; track x.id)` · lazy routes · `async` pipe/`toSignal`/`takeUntilDestroyed()`. No new NgModule, no `*ngIf`/`*ngFor`, no `BehaviorSubject` state inside a component, no `subscribe` without unsubscribing. Keep logic in `computed`, never call a heavy function in a binding. Never use `DomSanitizer.bypassSecurityTrust*` on user data (if truly needed, comment why it is safe). In an old repo (v14–19) follow its style and do not migrate inside a feature task; propose migration separately. Full table, React/Vite notes and v22 facts: `references/angular.md`. For speed work on a React or Next.js repo read Vercel `react-best-practices` live (link in `references/angular.md`); on a conflict with step 3, follow this skill.
8. Avoid the common traps (time zone: store ISO 8601 UTC · money: integer satang · `===` · no shared-object mutation · cancel subscriptions · narrow imports · `Intl.Collator('th')` for Thai sorting · schema-parse `JSON.parse` at the edge): `references/traps.md`.
9. Test with the framework the repo has (Vitest and Angular examples: [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#node--typescript--vitest)). HTTP API: `supertest` (Express · NestJS) or `fastify.inject()`, no real port. Angular v21+ CLI uses Vitest, not Karma. For new logic or a bug fix, write a red test first, then fix to green. A snapshot alone is not a test; assert the values that matter. Read a signal directly (`component.unpaid()`); skip `fakeAsync` if nothing is really async.
10. Security: before installing a new package check spelling (typosquat) · download count · maintainer · latest release date, and for an internal scope set the registry in `.npmrc`. Run `npm audit --omit=dev`; commit the lockfile and use `npm ci` in CI. Never use `innerHTML` · `[innerHTML]` · `dangerouslySetInnerHTML` with user data. Cookie login sets `HttpOnly` · `Secure` · `SameSite` and guards against Cross-Site Request Forgery (CSRF: token or `withXsrfConfiguration`). Cross-Origin Resource Sharing (CORS): list origins one by one, never `*` with `credentials`. No secrets in the frontend (`environment.ts` and `VITE_*` are readable by everyone). Security headers: `helmet` · `@fastify/helmet`.

## Check before done
- `tsc --noEmit` 0 errors · lint 0 warnings in the changed files
- The whole test suite passes, and new behaviour has a test that was red before the fix
- No `any` · `as` on external data · new `!` in the diff
- No floating promise and no subscription left uncancelled
- Frontend: bundle size compared before and after; if it grew more than 20 KB (gzip), give the reason in the report
- If the lockfile changed, the new packages were checked per step 10

## References
- [`references/examples.md`](references/examples.md) — open for zod/union code, the branded ID type and the shutdown handler
- [`references/angular.md`](references/angular.md) — open for an Angular or React/Vite task (full do/do-not table, v22 facts)
- [`references/traps.md`](references/traps.md) — open when touching dates, money, equality, shared state, imports or sorting
- [`references/sources.md`](references/sources.md) — dated sources (Node LTS status to re-check)
- Also: `principle-secure-by-default` · `error-handling-patterns` · `i18n-and-locale` (Thai dates, Buddhist Era)


## reference: angular.md

# Angular and React notes · stack-typescript

Open when the repo is Angular (or React/Vite/Next.js) and you write or review components, state, forms, HTTP or routes.

The latest is v22 (released 3 Jun 2026 · source: https://angular.dev/reference/releases · checked 22 Oct 2026): new apps are zoneless and `OnPush` is the default, and Signal Forms are production-ready (these last 3 points (รอยืนยัน) — the source page does not state them; check the v22 release notes before citing).

| Topic | Do this | Do not |
|---|---|---|
| component | standalone · `inject()` | create a new NgModule |
| state | `signal` · `computed` · `input()` · `output()` | `BehaviorSubject` for state inside a component |
| change detection | `OnPush` (default in v22) | `Default`/`Eager` without a reason |
| template | `@if` · `@for (x of xs; track x.id)` · `@switch` | `*ngIf` · `*ngFor` (deprecated since v20) |
| form | Signal Forms (v22); an existing repo uses typed reactive forms | `UntypedFormGroup` |
| HTTP | `HttpClient` + functional interceptor (`withInterceptors`) | add the token header one place at a time |
| subscription | `async` pipe · `toSignal` · `takeUntilDestroyed()` | `subscribe` and never unsubscribe |
| route | lazy `loadComponent` · `loadChildren` | import every page in the root route |

- Move logic out of templates into `computed` so a template only displays, and never call a heavy function in a binding.
- Never use `DomSanitizer.bypassSecurityTrust*` on data sent by users. If it is truly needed, comment why it is safe.
- **Old repo (v14–19)**: write in the style the repo already uses, use new features only where that version supports them, and do not migrate the whole repo inside a feature task. If you want to migrate, propose it as a separate task, then use `ng generate @angular/core:control-flow` and Angular's other schematics.
- React or Vite: keep state in the component first · `useEffect` needs a cleanup · list keys are ids, not indexes · client-side env may use only `VITE_*`, and treat it as visible to everyone.
- For a React or Next.js repo where speed must be chased (repeated renders · bundle · waterfall data fetching), pull the rules from Vercel `react-best-practices` and read them live while working: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices — a link only, no rules copied here, because that repo's licence has not been checked (checked 23 Oct 2026) · a rule that conflicts with item 2 of this skill (strict TS): follow ours.

```ts
export class OrderList {
  private orders = toSignal(inject(OrderApi).list(), { initialValue: [] });
  readonly unpaid = computed(() => this.orders().filter(o => o.status === 'unpaid'));
}
// <ul>@for (o of unpaid(); track o.id) { <li>{{ o.id }}</li> } @empty { <li>ไม่มีรายการค้างจ่าย</li> }</ul>
```


## reference: examples.md

# Code examples and new-type checks · stack-typescript

Open when writing a zod parse, a discriminated union, a branded type for IDs or money, or the graceful-shutdown handler.

## Parse and union

```ts
const Order = z.object({ id: z.uuid(), totalSatang: z.number().int().nonnegative() });
type Order = z.infer<typeof Order>;

type PayResult =
  | { status: 'paid'; receiptId: string }
  | { status: 'failed'; reason: 'declined' | 'timeout' };
// switch (r.status) ครบทุกกรณี · default: const _never: never = r;
```

**4 new-type checks** (idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10). Apply them to types that stand for a national ID number, an amount of money, a document number:

1. **Hide the internals** — users of the type create a value in only one way (a `parse` function) and never edit fields directly.
2. **The rules live in the type** — a value that breaks the rules cannot be created; the rules are not written only in a document.
3. **Check at the entrance** — validate once at creation, and then the whole system can trust the type.
4. **Expose nothing mutable** — `readonly` on every field, and never return an internal array for others to change.

```ts
type ThaiNationalId = string & { readonly __brand: 'ThaiNationalId' };  // 13 หลัก + ตรวจเลขท้าย
const checkDigit = (d: string) => (11 - (d.slice(0, 12).split('').reduce((s, c, i) => s + Number(c) * (13 - i), 0) % 11)) % 10;
const parseNationalId = (s: string): ThaiNationalId | null =>
  /^\d{13}$/.test(s) && checkDigit(s) === Number(s[12]) ? (s as ThaiNationalId) : null;
// จำนวนเงินเก็บเป็นสตางค์ (number เต็ม) ไม่ใช้ float · ตัวอย่างเลข 1234567890121 สร้างขึ้นเอง ไม่ใช่เลขของใคร
```

## Graceful shutdown

```ts
const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(async () => { await db.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
});
```


## reference: sources.md

# Sources · stack-typescript

- Node LTS · https://nodejs.org/en/about/previous-releases · last checked 2026-10-14: LTS is 24 and 22 · 26 is still Current, so do not use it in production until this page lists it as LTS · the next one to expire is 22 (2027-04-30 (รอยืนยัน)) · re-check this page before use · Node 26 will probably become LTS in late Oct 2026 (รอยืนยัน); re-check this line right after that date
- Angular releases · https://angular.dev/reference/releases · checked 22 Oct 2026 (v22 released 3 Jun 2026)
- 4 new-type checks · idea from the type-design-analyzer of pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10
- Vercel react-best-practices · https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices · licence not checked (checked 23 Oct 2026) · link only, no rules copied


## reference: traps.md

# Common traps · stack-typescript

Open when the code touches dates and time zones, money, equality, shared objects, subscriptions, large imports, sorting Thai names or JSON parsing.

| Trap | Symptom | Do this |
|---|---|---|
| time and time zone | the date goes back 1 day between 00:00–06:59 Thai time | store and send ISO 8601 in UTC, then display with `Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok' })`; for the Buddhist Era year see `i18n-and-locale` |
| money | `0.1 + 0.2 !== 0.3` | store as satang (integer); for tax or currency conversion use the decimal library the repo uses |
| `==` | `'0' == false` is true | always use `===` and turn on eslint `eqeqeq` |
| mutating a shared object | values change by themselves across pages | create a new one with spread · `structuredClone` · `readonly` in the type |
| memory leak | RAM keeps growing | cancel subscriptions · `removeEventListener` · `clearInterval`, and caches need a cap |
| big imports | bundle bloats by hundreds of KB | `import { debounce } from 'lodash-es'`, not all of lodash, and check the bundle after the build |
| sorting Thai names | leading vowels sort wrong | use `new Intl.Collator('th').compare`, not bare `localeCompare` |
| `JSON.parse` without checks | crash deep in the code | parse with a schema at the system edge (item 2) |


---

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
- [ ] Confirm it really works before saying done → `ground-rules/principle-prove-it-works`; before sending, `security-gate`.

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
2. **Never run anything on production**; prepare the commands for a person to approve (`ground-rules/principle-proceed-on-reversible-work`). Use a local or sandbox database with row count close to real (100 rows hides every speed problem); if none, generate mock data so volume and value distribution are close to real.
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
7. **Test** against a real database of the production kind, never SQLite or in-memory (NULL, collation, locks differ). Fresh database every run with Testcontainers and seed script; stored procedures use tSQLt (SQL Server) or pgTAP (PostgreSQL). Check row counts and values: NULL · midnight date edges · Thai names · fractional money. Run a new migration on a production-like copy with near-real volume, time it, watch the locks. For a bug, write the failing test first (`fix-at-source/principle-fix-root-cause`); framework → `testing-standards`.
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
