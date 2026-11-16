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
