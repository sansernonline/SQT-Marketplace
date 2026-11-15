---
name: stack-typescript
description: Use when writing or reviewing TypeScript code
---

# stack-typescript — TypeScript the team can read easily and that is hard to break

> **One rule:** let the compiler catch bugs instead of people. `tsc` passing with 0 errors does not mean done, but failing means not started.

This file covers only what is specific to TypeScript · Node · Angular. The general principles are in `lazy-coding` · `readable-code` · `principle-data-shape-first` · `principle-secure-by-default`.

## 1 · Starting work — look at the repo before the first command

| Look at | It tells you | Do |
|---|---|---|
| `package-lock.json` · `pnpm-lock.yaml` · `yarn.lock` | package manager | Use that one only; never have 2 lockfiles |
| `.nvmrc` · `engines` in `package.json` | Node version | Follow it. If absent, use the latest Long Term Support (LTS) — last checked 2026-10-14 · source: https://nodejs.org/en/about/previous-releases : LTS is 24 and 22 · 26 is still Current, so do not use it in production until this page lists it as LTS · the next one to expire is 22 (2027-04-30 (รอยืนยัน)) · re-check this page before use · Node 26 will probably become LTS in late Oct 2026 (รอยืนยัน); re-check this line right after that date |
| `"type"` in `package.json` · `tsconfig` `module` | ECMAScript Modules (ESM) or CommonJS (CJS) | Follow what exists; never mix |
| `scripts` in `package.json` | the repo's real commands | Use an existing script before guessing a command |

```bash
npm ci                      # pnpm install --frozen-lockfile · yarn install --immutable
npx tsc --noEmit            # ตรวจ type ทั้งโปรเจกต์
npm run lint && npm test && npm run build 2>&1 | tail -40   # ดูแค่ท้ายผล
npx vitest run src/order/order.service.test.ts -t "คืนเงินเกินยอด"   # รัน test เดียว
```

- For Angular use `ng test --include=src/app/order/**` and check the bundle size at the end of the `ng build` output.
- `npm install <pkg>` changes the lockfile, so commit the lockfile in the same round.

## 2 · Strict TypeScript

| Never | Use instead | Reason |
|---|---|---|
| `any` | `unknown`, then narrow with `typeof` · `in` · a type guard | `any` switches off the compiler along the whole chain |
| `value!` just to silence an error | check `if (!value) throw …` or fix the source type | `!` is a lie to the compiler |
| `as Order` on outside data | parse with zod (or the library the repo uses) | a cast checks nothing |
| several booleans to hold a state | discriminated union | impossible states cannot be written |
| `const x: Config = {...}` that loses the literal | `satisfies Config` | you get both the shape check and the narrow type |

- `tsconfig`: `"strict": true` · `noUncheckedIndexedAccess` · `noImplicitOverride`. If an old repo has strict off, turn it on one folder at a time, not for the whole repo in one task.
- For `enum` versus a union of strings, follow what the repo uses. A new repo uses `as const` + union (no runtime code is generated).
- Keep API types shared by frontend and backend in one place (a shared package, or generated from OpenAPI).

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

## 3 · Node backend (Express · Fastify · NestJS)

- **No floating promises.** Turn on `@typescript-eslint/no-floating-promises` and `no-misused-promises`, and every `async` must be `await`ed or given a `.catch` that does something real.
- Express 4 does not forward errors from an `async` handler by itself, so use Express 5 or wrap the handler. Fastify and NestJS already handle it.
- **Validate config at startup.** Parse `process.env` with a schema once; if a value is missing or wrong, refuse to start (details in `config-and-secrets`).
- **Shut the server down cleanly**: receive `SIGTERM` → stop accepting new requests → wait for pending requests → close the DB pool, and set a timer to force exit.
- For large files use `stream.pipeline` from `node:stream/promises`; never `readFile` the whole file into memory.
- No `fs.*Sync` · heavy `crypto.*Sync` · big loops in a request path, because the event loop would block the whole server.
- DB access must always use parameterized queries (`$1` · `?`) or an ORM; never concatenate strings into SQL.
- Use structured logs (pino in Fastify · the repo's logger) per `logging-standards`; no `console.log` in a server.

```ts
const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(async () => { await db.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

## 4 · Angular

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

## 5 · Common traps

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

## 6 · test

Use the framework the repo has · for Vitest and Angular setup with examples, see [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#node--typescript--vitest) · for browsers see `e2e-testing-patterns`.

- HTTP API: `supertest` (Express · NestJS) · `fastify.inject()` (Fastify) — no need to open a real port.
- From Angular v21 the CLI uses Vitest by default, not Karma.

- For new logic or a bug fix, write a test that is red first, then fix it until green.
- A snapshot alone does not count as a test; it must assert the values that matter.
- For a signal in a test, read the value directly, `component.unpaid()`; no need to wait with `fakeAsync` if nothing is really async.

## 7 · Stack-specific security

- **A new package** must be checked before installing: spelled correctly (typosquat) · download count · maintainer · latest release date. For an organisation-internal scope name, set the registry in `.npmrc` to prevent dependency confusion.
- Run `npm audit --omit=dev` before sending · the lockfile must be committed and CI uses `npm ci`.
- Cross-Site Scripting (XSS): never use `innerHTML` · `[innerHTML]` · `dangerouslySetInnerHTML` with user data. Angular escapes for you if you do not bypass.
- Cookie login must set the cookie `HttpOnly` · `Secure` · `SameSite` + guard against Cross-Site Request Forgery (CSRF) (token or Angular's `withXsrfConfiguration`).
- Cross-Origin Resource Sharing (CORS): list origins one by one; never use `*` together with `credentials`.
- Secrets must never be in the frontend, because everything in `environment.ts` and `VITE_*` is built into the bundle for everyone to read.
- For security headers use `helmet` (Express) · `@fastify/helmet` · in NestJS use `helmet` in `main.ts`.

## 8 · Pre-submit checklist

- [ ] `tsc --noEmit` 0 errors
- [ ] lint 0 warnings in the files changed
- [ ] the whole test suite passes, and the new behaviour has a test that was red before the fix
- [ ] no `any` · `as` on external data · new `!` in the diff
- [ ] no floating promise and no subscription left uncancelled
- [ ] frontend work: bundle size compared before and after; if it grew more than 20 KB (gzip), give the reason in the report
- [ ] if the lockfile changed, the new packages were checked per item 7

## 9 · Link to other skills

| Need | Use together with |
|---|---|
| the least code that works | `lazy-coding` |
| names · file layout · comments | `readable-code` |
| design types and data shape before writing | `principle-data-shape-first` |
| where to catch errors · retry · timeout | `error-handling-patterns` |
| log format and correlation id | `logging-standards` |
| test proportions and naming | `testing-standards` |
| tests through the browser | `e2e-testing-patterns` |
| screens · color tokens · layout | `web-app-design` |
| security rules for every diff | `principle-secure-by-default` |
| env and secrets | `config-and-secrets` |
| Thai dates · Buddhist Era · Thai word sorting | `i18n-and-locale` |
