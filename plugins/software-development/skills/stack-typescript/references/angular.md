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
