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

**Pick the status to match** the table in `web-service-essentials` section 2. One addition for this skill: return `404` also when you do not want to reveal that the thing exists.

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

# skill: web-service-essentials

Use when building or reviewing an HTTP backend

# Web Service Essentials

> **The one rule:** before writing the first business endpoint, the service must be able to answer
> "Are you still alive? · Are you ready for work? · Which version are you running now?" If it cannot, on the day the system goes down you will be guessing blind.

## When to use this skill

- Starting a new service / REST API / microservice
- Someone asks for a health check, ping, readiness, liveness, or version endpoint
- Deploying to production for the first time, or moving into Docker/Kubernetes
- You must set one API error format for the whole system

## When **not** to use it

- To design business endpoints, use the command `/api-design`
- For URL style · paging · dates · API ids, use `api-conventions`
- For log format, use `logging-standards`
- To choose an architecture, use `architecture-patterns`
- To check responses against OpenAPI in CI or catch breaking changes, see `api-conventions` [`references/contract-testing.md`](../api-conventions/references/contract-testing.md)

---

## 1 · The 4 basic endpoints

| Endpoint | What it answers | auth | Checks dependencies | Who calls it |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | no | no | load balancer, every second |
| `GET /health/live` | the process is still alive | no | **no** | orchestrator (restarts if dead) |
| `GET /health/ready` | ready to take traffic | no | yes | orchestrator (removes from the pool) |
| `GET /version` | what is running | no* | no | a person, when tracing a problem |

> **live must not check dependencies.** This is the most common mistake.
> If `/health/live` checks the database (DB) and the DB goes down briefly, Kubernetes will **kill every pod**
> even though the app itself is fine. When the DB comes back, no pod is left to take traffic.
> The dependency check belongs in `/health/ready`, which only removes a pod from the pool for a while.

\* If you do not want the public to see the commit hash in `/version`, restrict it so only the internal network can call it.

**Wire it to Kubernetes like this** — live and ready must point to different paths, or the point above means nothing.

```yaml
livenessProbe:            # dead → restart the container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # let the app start first, or it gets killed before it can listen
  periodSeconds: 10
  failureThreshold: 3     # restart only after 3 failures in a row (30 seconds)
readinessProbe:           # not ready → remove from the Service for a while, no restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

For an app with a long warm-up (loading a model · a big cache), add a `startupProbe` pointing to `/health/live` with a high `failureThreshold`, instead of stretching the liveness `initialDelaySeconds`.

### Response shape (the same in every language)

```jsonc
// GET /health/ready → 200 normally · 503 when a critical dependency is down
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 states, not 2:**
- `up` — everything is normal → 200
- `degraded` — a **non-critical** dependency is down (such as email) but the service can still take traffic → 200
- `down` — a critical dependency is down (such as the DB) → **503**

**Every check must have a timeout** (default 3 seconds). Otherwise a hung dependency
makes the health endpoint hang too, and the orchestrator makes the wrong decision for the whole system.

**Never send a stack trace or connection string out through these endpoints**, because anyone can call them.

---

## 2 · One error format for the whole system

Follow **RFC 9457 (`application/problem+json`)**, which is a real standard, so you do not invent your own.

```jsonc
// 422 — the format is right, but the data fails a rule (see the table below)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // matches the cid in the log — trace the case at once
  "errors": [                           // validation only · every field in one response
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` is the full path including array indexes · `code` is for programs · `message` is for people

| Status | Use when |
|---|---|
| 400 | Malformed data |
| 401 | Not yet authenticated |
| 403 | Authenticated but not allowed |
| 404 | The thing does not exist |
| 409 | Conflicts with current state (duplicate, overwrite) |
| 422 | Format is right but breaks a business rule |
| 429 | Called too often — must have `Retry-After` |
| 500 | Our side broke — **never send internal details out**, send `requestId` instead |

> **A 500 must say only "an error occurred, please report this requestId".** The real details stay in the log.
> Sending a stack trace out is like handing the system's blueprint to someone looking for a way in.

---

## 3 · Request id

- Accept it from the **`X-Request-Id`** header only when it matches `^[A-Za-z0-9-]{1,64}$` · if it is missing or does not match → create a new one (a uuid cut to 8 characters).
  This value goes into every log line. If you accept it as is, the sender can insert new lines or fake text into the log (log injection).
- **Return it in a response header every time**, including on errors.
- Put it in every log line (see `logging-standards`) and in the error body.
- Pass it on to the downstream service every time you call across systems.

When a customer calls to say "it broke", ask for the requestId and `grep` once to find the whole story.

---

## 4 · Graceful shutdown

On a new deploy the orchestrator sends `SIGTERM`. If the app dies at once, requests in progress are cut off midway.

```
SIGTERM → 1. Stop accepting new requests (make /health/ready answer down at once)
          2. Wait for in-flight requests to finish (timeout 15–30 seconds)
          3. Close the DB pool / queues / files
          4. exit(0)
```

> Step 1 matters more than it looks. `/health/ready` must answer `down` about 5 seconds **before** the real shutdown,
> so the load balancer removes us from the pool in time. Otherwise traffic keeps arriving while we are closing.

---

## 5 · What must exist before deploy (not optional)

- **Timeouts everywhere**: incoming requests, outgoing calls, and DB queries. Without a timeout, the moment a downstream is slow, the whole system hangs with it.
- **Limit body size** (for example 1MB) to stop memory blowing up from a large payload.
- **Cross-Origin Resource Sharing (CORS) names the origin explicitly** — `*` is allowed only for a public API with no cookies.
- **Rate limit** at least on the login endpoint and on anything that sends a one-time password (OTP)/email.
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (replaces the old `X-Frame-Options` header · also add `X-Frame-Options: DENY` for old browsers) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` sets them all in one line · .NET: `UseHsts()` sets only HSTS, and the rest needs a short middleware or the package `NetEscapades.AspNetCore.SecurityHeaders` (example in `references/per-stack.md`)
- **Turn off the full error page in production** (`app.UseDeveloperExceptionPage()` in dev only)
- **Put the version in the path**: `/api/v1/...` from day one, because moving later costs much more.
- **OpenAPI** generated from the real code, not written by hand and then forgotten.

---

## 6 · Ready-made code

| File | Stack | Status |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ all 4 endpoints run and tested, plus the degraded/down/timeout cases |
| `assets/health_py.py` | Python / FastAPI | ✓ run and tested the same way, results match on every field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | Caution: not yet compiled or tested |

Usage snippets for the Node and Python routers: [`references/per-stack.md`](references/per-stack.md).

---

## 7 · Check the work

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# stop the DB and call again — ready must be 503 but live must still be 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` does **not** touch the DB — it still answers 200 with the DB stopped
- [ ] `/health/ready` answers 503 when a critical dependency is down
- [ ] When a non-critical dependency is down, the result is `degraded` + 200 (still takes traffic)
- [ ] Every check has a timeout — make a dependency hang, and the endpoint must answer within ~3 seconds
- [ ] `/version` matches the commit actually deployed
- [ ] Every response has `X-Request-Id`, including a 500
- [ ] Trigger a 500 and confirm no stack trace / connection string leaks out
- [ ] After `SIGTERM`, in-flight requests finish before the app closes
- [ ] `/ping` is not written to the log (or the file fills up with pings)


## reference: per-stack.md

# .NET และ Angular

> Caution: the code in this file is **not yet compiled or tested** (unlike `assets/health.node.js` and
> `assets/health_py.py`, which have been run against every endpoint). It is the standard setup of
> ASP.NET Core. On the first run, compare the response with the shape in SKILL.md section 1.

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

Make the response match the same format as the other stacks:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core already ships `ProblemDetails`. Use it, and do not invent your own format.

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

Make `/health/ready` answer down for a short while before the real shutdown, so the load balancer removes the instance from its pool in time.
Use `IHostedLifecycleService.StoppingAsync` (.NET 8 and later), because the host calls it **before** it stops Kestrel (after `ApplicationStopping`).
So you can wait with `await Task.Delay` without blocking a thread, and the server still answers 503 for the load balancer to see.

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

Host shutdown order (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` of the hosted services (including Kestrel) → `StoppedAsync` → `ApplicationStopped` — per the .NET Generic Host page at learn.microsoft.com (checked 22 Oct 2026)

### สิ่งที่ต้องเปิดก่อน deploy

Register services only **before** `builder.Build()`. After Build the service list is read-only, and calling `builder.Services.Add…` then throws `InvalidOperationException` at app start.

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

To avoid writing your own middleware, use the package `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) which sets the full basic header set

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**Turn problem+json into a message the user can understand**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**System status page**, so the support team can check it without calling a developer:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |

## Wiring the ready-made health router

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```


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


---

# skill: observability-basics

Use when a live system needs metrics, logs or alerts

# Measuring and monitoring a system

> **The one rule:** if a customer is the one who tells us the system is down, monitoring has failed.
> It does not mean the customer is kind.

## When to use this skill

- The system has real users
- Someone asks "is the system healthy right now?" and you must open the logs to answer
- You get woken in the middle of the night by an alert that needs no action
- The system is slow and you do not know where

## When **not** to use it

| Job | Use this instead |
|---|---|
| Log line format and masking | `logging-standards` |
| A trail of who did what | `audit-trail` |
| Health check endpoint | `web-service-essentials` |
| Steps during an incident | `incident-runbook-template` |
| Post-incident summary | `postmortem-template` |

---

## 1 · These three answer different questions

| | Answers the question | Example | Cost |
|---|---|---|---|
| **metric** | "Is it bad now? Getting better or worse?" | error 2.3% · p95 = 840 ms | Cheapest, keeps a long time |
| **log** | "What happened in that request?" | message + stack trace + id | Medium cost |
| **trace** | "Which step is slow?" | one request across 5 services | Most expensive, sample it |

**Order of use during an incident:** the metric says there **is a problem** → the trace says **where** → the log says **why**.
All 3 must be linked by the same correlation id (see `logging-standards`).

---

## 2 · The four signals to measure

| Signal | Measures | Numbers to watch |
|---|---|---|
| **Request rate** | How much work is coming in | Per second, split by endpoint |
| **Error rate** | What percentage fails | Split 4xx (user's fault) from 5xx (our fault) |
| **Response time** | How slow | **p50 · p95 · p99** |
| **Resources** | Is anything near full | CPU · memory · disk space · connection pool |

> **Never look at the average response time.** An average of 200 ms sounds good
> while 5% of users wait 9 seconds. The average always hides the people who hit the problem. **Look at p95 and p99.**

**For queues and background jobs**, add 3 more: jobs waiting in the queue · wait time in the queue · jobs that failed for good
(see `background-jobs`).

---

## 3 · Naming metrics

```
<domain>_<what is measured>_<unit>

http_requests_total              cumulative count
http_request_duration_seconds    duration
orders_created_total             business event
queue_depth_jobs                 value at this moment
```

| Rule | Reason |
|---|---|
| Always end with the unit | `_seconds`, not `_time`, which nobody can tell is seconds or milliseconds |
| End cumulative values with `_total` | It says the value keeps rising and is not the current value |
| Use labels instead of making new names | `http_requests_total{route,status}`, not a separate name per endpoint |
| **A label must not take unbounded values** | If you put a user id or order id in a label, the metrics system cannot cope |

### 3.1 · If you use Prometheus and Grafana

- **Metric types:** a counter counts events (read it with `rate()`) · a gauge holds the value right now · a histogram holds durations when you need p95 · a summary is for when you do not need to aggregate across instances
- **Units:** seconds · bytes · ratio 0 to 1 (`_seconds`, not `_milliseconds`)
- p95: `histogram_quantile(0.95, sum by (le) (rate(<name>_bucket[5m])))`
- Every alert rule has `for:` · `severity` · a runbook link · alert on symptoms (latency · error), not on CPU or GPU
- Keep dashboards as JSON in git and provision them from files · RED per service · USE per resource
- Details on PromQL · alert rule examples · provisioning · a voice agent example (STT · LLM · TTS latency · Kafka lag · GPU): `references/prometheus-grafana.md`

---

## 4 · Alerts

> **Every alert must give the receiver something to do.** If the person reads it and has nothing to do,
> in 3 weeks they will mute alerts, and the day a real one fires nobody will see it.

**Alert on what users feel, not on machine numbers**

| ✗ Alert like this | ✓ Alert like this |
|---|---|
| CPU over 80% | Error rate over 2% for 5 minutes |
| Memory over 70% | p95 of the payment page over 3 seconds for 10 minutes |
| pod restart | Successful orders drop by more than 50% against last week |
| disk 60% | **disk will be full in 4 hours at the current rate** |

| Level | Example | Send to |
|---|---|---|
| **Wake a person** | Users cannot use the system · data is being damaged | Phone call · push |
| **Check in work hours** | disk will be full in 3 days · errors rising but still low | Team chat |
| **Just record it** | Everything else | Dashboard |

**Every alert must have:** what broke · who is affected · **a link to the runbook** · a link to the dashboard.
**Always set a duration (for N minutes)**, not an alert the moment a value spikes once.

### 4.1 · Error budget and burn rate

A system with an SLO uses this instead of a fixed error % threshold, because it says "if this goes on, when will the whole month's budget run out?"

- **Budget** = the time you may fail in 30 days → SLO 99.9% = 43 minutes · 99.5% = 3.6 hours · 99% = 7.2 hours
- **Burn rate** = current error rate ÷ (1 − SLO) → burn 1 = the budget runs out exactly on day 30 · burn 10 = gone in 3 days
- Set 3 alert levels as in the table, and every level must hold true over both the long window and the short window (short window = 1/12 of the long one), so the alert stops as soon as the system recovers

| Level | burn rate | Long window · short window | Budget already used | SLO 99.9% means errors above | Send to |
|---|---|---|---|---|---|
| Fast burn | 14.4 | 1 hour · 5 minutes | 2% of the month in 1 hour | 1.44% | Wake a person |
| Slow burn | 6 | 6 hours · 30 minutes | 5% of the month in 6 hours | 0.6% | Wake a person |
| Slow leak | 1 | 3 days · 6 hours | 10% of the month in 3 days | 0.1% | Team chat |

Show the remaining budget on the overview dashboard. When the budget is nearly gone, stop shipping features and fix stability first. Agree this rule with the product owner in advance, not in the middle of an argument.

---

## 5 · Dashboards

Two pages are enough.

| Page | Answers the question | Contains |
|---|---|---|
| **Overview** | "Is it normal now?" | The 4 signals for the whole system · dependency status · latest releases |
| **Deep dive per service** | "Where did it break?" | The 4 signals split by endpoint · queues · database |

- **A vertical line marks the deploy time.** Most problems start after this line, and you see it in one second
- The overview page must be readable in 10 seconds, so keep it to 6 graphs at most
- Draw the alert threshold lines on the graphs, so you can see how far the value is from the line

---

## 6 · Business metrics

Technical metrics all green while the business has stalled really happens, and you will not catch it unless you measure it.

| Example | What it catches |
|---|---|
| Successful orders per hour | The pay button is broken even though every endpoint returns 200 |
| Successful login rate | A problem with an external identity provider |
| Background jobs waiting more than N minutes | The queue is stuck but the API still answers normally |
| Emails that failed to send | Customers do not get receipts, with no error anywhere |

**Pick 3–5 that are the heart of the business**, and alert when they drop abnormally against the same period last week.

---

## References

- [`references/prometheus-grafana.md`](references/prometheus-grafana.md) — open for PromQL · alert rules · Grafana provisioning · voice agent example
- `mcp-server` item 1.1 — when an agent must read Prometheus or Grafana through MCP
- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: prometheus-grafana.md

# Prometheus and Grafana — using them correctly

Part of `observability-basics` · the thinking about what to measure and what to alert on is in `SKILL.md` sections 2 · 4 · 5 · this file says how to do it in Prometheus and Grafana · metric names and numbers labelled `ตัวอย่าง` (example) are hypothetical data and must be adjusted to the real system

## Contents

- [1 · The 4 metric types](#1--the-4-metric-types)
- [2 · Names and units](#2--names-and-units)
- [3 · Labels and cardinality](#3--labels-and-cardinality)
- [4 · Common PromQL](#4--common-promql)
- [5 · Alert rules](#5--alert-rules)
- [6 · Grafana](#6--grafana)
- [7 · Voice agent system example](#7--voice-agent-system-example)
- [8 · Check before sending](#8--check-before-sending)
- [9 · Sources](#9--sources)

## 1 · The 4 metric types

| Type | What it is | Use when | Example |
|---|---|---|---|
| counter | A cumulative value that only goes up and returns to 0 when the process restarts | Counting events that have happened (requests · errors · finished jobs) · read with `rate()`, never the raw value | `http_requests_total` |
| gauge | The value at that moment, can go up and down | Things that are pending or measurable right now (calls in progress · queue length · memory) | `voice_calls_active` |
| histogram | Counts measured values into ranges (buckets), with a sum and a count | Durations or sizes where you need p95 · p99 and want to aggregate across many instances | `http_request_duration_seconds` |
| summary | Computes quantiles on the app side, over a sliding time window | Use only when you do not need to aggregate across instances · the quantiles and window are chosen when writing the code and cannot be changed later | Rare; normally choose histogram |

- Never average quantiles from a summary across several instances; the result has no statistical meaning (the Prometheus docs use this wording)
- **How to choose** (prometheus.io/docs/practices/histograms/ checked 2026-10-27): if the library and Prometheus you use support it, use a native histogram first, because you can change the percentile and time window later in PromQL · if not supported but you need to aggregate across instances, use a classic histogram · use a summary only when you do not need to aggregate across instances
- The Prometheus docs recommend native histograms first, but the libraries that support them are still limited; if your library does not support them, use a classic histogram and place buckets so that an edge sits at the SLO value, otherwise the estimated p95 will be off (example in the docs: true p95 about 320 ms is estimated as 443 ms because the bucket is wide from 300 to 450 ms)

## 2 · Names and units

| Rule | Right | Wrong |
|---|---|---|
| Start with one word that names the system | `voice_stage_duration_seconds` | `stage_duration` |
| Use base units: seconds · bytes · ratio 0 to 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| The unit goes at the end, in plural form | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| A counter ends in `_total` (if it has a unit, the unit comes first) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 name, 1 unit, 1 meaning | All in seconds | Half in seconds, half in milliseconds |
| Do not put a label name again in the metric name | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · Labels and cardinality

Every unique set of label values is 1 new time series. The Prometheus docs warn you to avoid labels whose values are unbounded, such as user id or email.

| Must not be a label | Use instead |
|---|---|
| `user_id` · `customer_id` · phone number · email | Leave it out · keep it in logs or traces · if you must count per person, use a database, not a metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | Logs and traces tied to the same id (`logging-standards`) |
| A full URL that has an id or query string | A route template such as `/orders/{id}` |
| An error message with variable values | A limited set of error codes such as `reason="timeout"` |

- A label you may use must have all its possible values countable in advance (stage = 3 values · status = 5 groups) · the number of series of one metric is close to the product of the number of values in each label · a histogram multiplies by the number of buckets on top
- To find which metric makes series explode: open the TSDB status page in the Prometheus UI · the `tsdb_stats` tool of `prometheus-mcp` gives similar information (see `mcp-server` step 1.1)

## 4 · Common PromQL

| Need | Query | Note |
|---|---|---|
| Requests per second | `sum by (route) (rate(http_requests_total[5m]))` | The `[5m]` range should be several times the scrape interval (number not yet checked against the docs) |
| Error rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | Count 5xx (our fault) apart from 4xx · with no traffic the quotient is NaN and the alert rule will not fire, which can hide a system receiving no requests at all; add a separate rule that alerts on no requests |
| p95 of latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | Keep `le` in `sum by` · to split by route, add `route` to `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | Use when the library and Prometheus support it |
| Average latency (for context only, never for deciding) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | See `SKILL.md` section 2 |
| Disk will be full in 4 hours | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | An example of saturation that warns ahead of time (not yet checked against the PromQL docs) |

## 5 · Alert rules

Principle from the Prometheus docs: alert on symptoms users feel (latency · errors) at the highest point in the stack you can · wake someone for latency at a single point of the stack · put causes (CPU · GPU · consumer lag) on the dashboard for tracing, and do not wake anyone for them · except for things a person must act on before the system goes down, such as capacity

Exception: a number users feel directly counts as a symptom even if it comes from an underlying system, such as Kafka consumer lag that makes callers wait for an answer (section 7); it may wake someone · lag that affects nobody right away, such as a report job after the call ends, is a cause; put it on the dashboard or the team chat

Every rule must have 4 things

| Item | Where | Reason |
|---|---|---|
| `for:` | In the rule | Do not alert the moment the value spikes once · if omitted, the rule fires from the first evaluation round |
| Severity level | Label `severity` (the name and values are a convention the team sets, not required by Prometheus) | Lets Alertmanager route it to the right place · use 3 levels per `SKILL.md` section 4: wake someone · look during work hours · log it |
| Runbook link | Annotation `runbook_url` (the key name is a convention; the docs say only that an annotation can hold a runbook link) | The responder starts from a procedure, not from zero at 3 a.m. |
| `summary` stating the symptom and who is affected | Annotation | Reading it on a phone tells you what to do |

Example (hypothetical thresholds; set them from the real SLO):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` stops alerts from flapping when the value hovers around the threshold · for burn rate alerts see `SKILL.md` section 4.1

## 6 · Grafana

| Topic | How |
|---|---|
| 1 dashboard per 1 service | A service that takes requests uses RED: Rate · Errors · Duration · resources (CPU · GPU · disk · connection pool) use USE: Utilization · Saturation · Errors · the Grafana docs say RED stands for the user experience, so set alerts from RED and use USE to trace causes |
| Keep it as code | Dashboard JSON lives in git · the Grafana docs treat not keeping JSON in version control as a sign the system is not yet in order · when many dashboards look alike, generate them with grafonnet (Jsonnet) or grafanalib (Python) |
| Load automatically | A provider YAML file in `provisioning/dashboards/` points `options.path` to the JSON folder |
| Stop edits in the browser from being lost | Set `allowUiUpdates: false` · whoever wants a change edits the JSON in git and opens a PR · loading from files always overwrites the version in the database |
| Do not copy a dashboard | Use template variables (choose service · environment) on a parent dashboard · the Grafana docs warn that copying means you do not get fixes from the original |
| Temporary dashboards | Name them starting with `TEST:` and delete when done |
| uid | Set a fixed `uid` in the JSON so links from alerts do not break · `uid` and `title` must be unique within the same folder |

Example provider (checked against the Grafana docs 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · Voice agent system example

All metric names in this section are set by the team (examples), except `DCGM_FI_DEV_GPU_UTIL` and `kafka_consumergroup_lag*`, which come from exporters

**Latency of each stage of a call** · 1 histogram split by stage with a `stage` label that has limited values

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- Place buckets densely in the range 0.1 to 3 seconds, for example `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5`, with an edge at the threshold you set (1.5 seconds in the example of section 5)
- p95 per stage: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · put it in one chart with 3 lines and you see at once which stage eats the time
- Alert on `voice_turn_duration_seconds` (the symptom callers feel); do not alert on every stage · stages are for tracing causes
- Never put `call_id` or the caller's phone number as a label · the call id goes to logs and traces

**Kafka consumer lag** · when the pipeline sends call events through Kafka

- The lag value comes from a Kafka exporter · `kafka_exporter` (danielqsj · Apache-2.0 · not an official Apache project · checked 2026-10-27) gives `kafka_consumergroup_lag{consumergroup,topic,partition}` and `kafka_consumergroup_lag_sum{consumergroup,topic}` · if you use another exporter, the names may differ
- Wake someone when the lag of a consumer that makes callers wait (such as the real-time call summarizer) is high and does not fall for a long time · example `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` with `for: 10m` (hypothetical threshold) · lag of a report job after the call ends is fine to send to the team chat
- The `partition` label is only for drill-down charts; do not put it in alert rules

**GPU utilization** · the exporter is NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` is a gauge in % (checked from `etc/default-counters.csv` of the repo 2026-10-27) · this name was set by the exporter and does not follow the rules of section 2; use it as it is
- GPU is a cause (USE), not a symptom · put it on the dashboard next to the latency of the stages that use the GPU (STT · TTS) · high utilization together with a high p95 of that stage means the machine is saturated and you must add machines or reduce load
- GPU that stays high for many hours alerts at the look-during-work-hours level; it does not wake anyone

## 8 · Check before sending

- [ ] Every metric has a unit and `_total` per the rules · no label with unbounded values (user · phone · call id)
- [ ] Latency is a histogram with a bucket edge at the SLO threshold · no decisions from averages
- [ ] Every alert has `for:` · `severity` · `runbook_url` · `summary` · alerts on symptoms, not on CPU or GPU
- [ ] Dashboards are JSON in git · provisioned from files · `allowUiUpdates: false`
- [ ] There is a RED dashboard per service and USE per resource

## 9 · Sources

Checked 2026-10-27

| Topic | Source |
|---|---|
| Metric types | prometheus.io/docs/concepts/metric_types/ |
| Names, units, label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| Principle of alerting on symptoms | prometheus.io/docs/practices/alerting/ |
| Rule syntax `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| Dashboard provisioning | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (not official to Kafka) |
| `predict_linear` · `[5m]` range vs scrape interval · NaN behavior when dividing by 0 | General team knowledge (not yet checked against the official PromQL pages) |


## reference: sources.md

# Sources · observability-basics

Source of item 3.1: prometheus.io (metric types · naming · histograms · alerting) and grafana.com (dashboard best practices · provisioning), checked 2026-10-27 · full links are at the end of `references/prometheus-grafana.md`


---

# skill: background-jobs

Use when work runs outside the request in queues or schedules

# Background jobs

> **The one rule:** every background job must be **safe to run again without repeating its effect**,
> because it will certainly run again: the machine dies halfway · a person clicks again · the system retries by itself.

## When to use this skill

- Work the user should not have to sit and wait for: sending email, building a report, importing a file
- Scheduled work: a daily summary, month-end closing, deleting expired data
- Calling an external system that is slow or often down
- A jammed queue, or jobs that vanish with nobody noticing

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| Timeouts and retries for ordinary requests | `error-handling-patterns` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Events across several services through Kafka (several consumers read the same event · history is kept) | `kafka-streaming` | instead |
| A job queue through RabbitMQ (several workers · retry · dead letter · needs a real broker) | `rabbitmq-messaging` | instead |
| Importing Excel/CSV files as the main job | `data-import-export` | instead |
| Sending email/SMS as the main job | `notifications` | instead |
| Designing an agent system (Loop · Graph · Dynamic · choosing a framework) | `llm-engineering` → [`agent-systems.md`](../llm-engineering/references/agent-systems.md) | alongside |

---

## 1 · What belongs in the background

| Send to the background | Do inside the request |
|---|---|
| Takes more than 1–2 seconds | Fast, and the user must see the result at once |
| Calls an external system that can fail | Permission checks · data validation |
| The user does not wait for the result (email, notification) | The result is what they clicked to see |
| Many items done as a batch | |

> **Do not move work to the background just because it is slow.** If the user must see the result before moving on,
> moving it adds a waiting screen, a notification, and a place to store results.
> Sometimes making it faster is much cheaper (see `lazy-coding`).

---

## 2 · Choose a mechanism

| Mechanism | Fits | Watch out for |
|---|---|---|
| **Job table in the database** | small to medium systems · up to a few thousand jobs a day | you must write the job picker yourself · watch for workers fighting over jobs |
| **A real queue** (Redis · RabbitMQ · Amazon Simple Queue Service (SQS)) | many jobs · need built-in retry and dead letter | one more thing to look after |
| In-app scheduler (cron in code) | scheduled work with a single instance | **several instances will run it at the same time** · see section 5 |
| Platform scheduler | scheduled work on the cloud | |

**If the system is still small, always start with a table in the database,** because PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED`
lets several workers pick jobs at once safely, with no new system to add.

**Every job needs at least:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · Running again must not repeat the effect

Almost every queue system guarantees only "delivered at least once", **not exactly once**.

| Method | How to use it |
|---|---|
| **Duplicate-blocking key** | a unique constraint on `(job_type, business_key)` makes a duplicate job fail to insert |
| **Check state before acting** | "if the email for this purchase order was already sent, stop" |
| **Pass on an idempotency key** | when calling an external API (see `api-conventions`) |
| **Set a new value, do not add to the old one** | `set status = 'paid'` is safer than `balance = balance + 100` |

> **A job that adds to a value or sends something outside costs real money if it runs twice.**
> Two emails are only annoying, but two money transfers are a big problem.

---

## 4 · Retry and dead jobs

These numbers are for jobs in a queue · for retries outside a queue use [`error-handling-patterns`](../error-handling-patterns/SKILL.md) §4: service-to-service calls use 3 tries at 1/2/4 seconds · when a person waits on the screen → at most 1 retry, then let them press again

```
fail → wait 1 min → fail → wait 4 min → fail → wait 16 min → 4th failure → dead letter
```

| Rule | Detail |
|---|---|
| **Always set a cap** | 3–5 tries · with unlimited retries a single job can jam the queue |
| Increase the wait each round (a fixed multiple such as ×4) + a little randomness | same as `error-handling-patterns` |
| Bad data needs no retry | a malformed payload stays the same however many times you try |
| **A job that has run out of tries goes to one place** | dead letter (where jobs that failed until they ran out of tries are kept), keeping the full payload and the last error |
| A person must watch the dead letter | **alert when a new job arrives there**, do not wait for a customer to complain |
| It can be run again | after fixing the cause, you can re-run from the dead letter without writing a script |

**A job stuck because a worker died** needs an unlocker.
If a job's `locked_at` is older than N minutes, treat it as having nobody working on it, and unlock it so another worker picks it up.

**Job state is a state machine, not a boolean** — every mechanism in section 2 must be able to say which state a job is in: `queued → running → succeeded`, or `running → failed (attempts < cap) → queued`, or `failed → dead` · keep `attempts` · `locked_at` · `last_error` · `finished_at` with the job · move only along the arrows above (a `succeeded` job cannot go back to `running`; create a new job) · the admin screen and the dead letter read from this state in one place

---

## 5 · Scheduled jobs

> **With several instances, a scheduled job runs several times at once.**
> A summary report sent 3 times, or money charged 3 times, comes from this.

| Method | Use when |
|---|---|
| Lock in the database (advisory lock) | you can do it right away with nothing added |
| The platform scheduler calls an endpoint | on the cloud · Kubernetes CronJob |
| A scheduler that supports several instances directly | Quartz · Hangfire |

**Rules for scheduled jobs:**

- **Take the time range as a parameter**, so you can re-run missed dates without changing code
- If a run is missed, you must be able to catch up, not skip it for good
- State the time zone clearly: "every midnight" in which zone (see `i18n-and-locale`)
- **Record which runs succeeded**, do not infer it from logs

---

## 6 · Long jobs the user waits on

| Needed | Detail |
|---|---|
| Job id | return it the moment the job is accepted · the user uses it to ask about progress |
| State | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| Progress | "340 of 1,200 items done" (ทำแล้ว 340 จาก 1,200 รายการ), not a blind spinner |
| Cancellable | the job must check for a cancel signal regularly |
| Result | keep it available to download, with an expiry date |
| Notify when done | email or an in-system notification (see `notifications`) |

**Split a big job into small pieces.** For example, import 50,000 rows as sub-jobs of 500 rows each,
because a single 40-minute job that fails at minute 39 must start over from the beginning.

---

## 7 · What to measure

| Metric | Alert when |
|---|---|
| Jobs waiting in the queue | keeps growing and does not fall |
| Wait time in the queue (p95 · 95% of jobs wait no longer than this) | above what was promised |
| Failure rate | above the threshold |
| **Count in the dead letter** | **rises, even by just one** |
| Scheduled runs that did not run | a run was skipped |
| Jobs stuck in the running state for an unusual time | more than N times the normal |

> **A jammed queue is completely silent.** The API still answers 200 to every request and the health checks are all green,
> but no email has gone out for 3 hours. You see it only if you measure.

---

## 8 · Payload

- **Send the id, not the whole data block, in the payload** — the job reads it itself, so it gets the latest data too

---

## 9 · Durable workflow for agent jobs that run long or wait for human approval

An agent job that runs tens of minutes, calls an LLM and tools many times, or pauses for approval across days cannot use a plain queue, because a failure at step 8 of 10 means starting over and paying the token cost again · use an engine that records the result of every step and resumes from the same point

- [`references/durable-workflow.md`](references/durable-workflow.md) — open before choosing an engine (Temporal · Step Functions · checkpointer) or writing replayable code

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: durable-workflow.md

# Durable workflow for agent jobs · background-jobs

| Tool | Fits | Waits for human approval | Watch out for |
|---|---|---|---|
| **Temporal** | Python and other languages · the agent loop lives in a workflow, while LLM and tool calls are activities · has `OpenAIAgentsPlugin` · `activity_as_tool` | (`ยังไม่ได้ตรวจ` · see the signal page) | the integration with the OpenAI Agents SDK is still in Public Preview |
| **AWS Step Functions** | fixed steps on AWS · fan-out with `Map` (Inline in parallel 40 · Distributed 10,000 child jobs) | `.waitForTaskToken` can wait up to 1 year until `SendTaskSuccess` / `SendTaskFailure` arrives · set `HeartbeatSeconds` to prevent a silent hang | when an LLM must choose the route, let Lambda or Bedrock decide, then use `Choice` |
| **Agent framework checkpointer** | you do not want to add an engine · LangGraph `PostgresSaver` · Microsoft Agent Framework `CheckpointManager` · OpenAI `RunState.to_json()` | LangGraph `interrupt()` · OpenAI `needs_approval` · Microsoft Agent Framework `RequestInfoExecutor` | an in-memory store is lost when the process restarts · use a database-backed store in production |

**Rules for code that must be replayable** (Temporal · Google ADK · Claude Code workflows use the same principle · checked against [Temporal: Workflow Definition](https://docs.temporal.io/workflow-definition) 2026-10-26)

- **Never read the time or draw a random value in code that controls the order of work** (`Date.now()` · `datetime.now()` · `Math.random()` · `uuid4()`) · on replay the value differs from the first run, the order drifts, and the old result cannot be reused · do anything that needs time or randomness in an activity, or use the SDK's own API for it
- **All LLM calls, tool calls, and outside reads and writes go in activities.** The result is recorded once, and replay reads the record instead of calling again.
- **The order of calls must be the same on every run** · changing the order of steps in code that still has jobs in flight makes the old jobs fail replay (Temporal calls this a nondeterminism error) · switch to the engine's versioning or patching
- **The steps before a wait point must be safe to repeat** (section 3) · LangGraph re-runs the paused node from the start on resume, so move side effects to after the wait point
- **Saved state carries no identity check** (the OpenAI docs warn about `RunState`) · load it only from a store we control
- The cap on rounds, the token budget, and stopping when there is no improvement are still needed, as for jobs in a queue · details in [`agent-systems.md`](../../llm-engineering/references/agent-systems.md) section 6


## reference: sources.md

# Sources · background-jobs

Sources (opened 2026-10-26): [Temporal · OpenAI Agents SDK](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [Temporal announcement](https://temporal.io/blog/announcing-openai-agents-sdk-integration) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Step Functions Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html) · [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [OpenAI human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Claude Code workflows](https://code.claude.com/docs/en/workflows)
