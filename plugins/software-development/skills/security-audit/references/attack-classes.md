# Attack classes — main groups, what often slips through, and files by lane

Use when building the ledger (pick a `class` per unit) and when assembling the brief for hunting sub-agents (paste the chosen sections whole) · Choose from the scope found in the recon step, not because you saw a library name · Not every group applies to every system

## Pick files by lane

| What recon found | Open file |
|---|---|
| Web app · API · login · session · JWT · OAuth · LINE Login · pages that run JavaScript | [`classes-web-auth`](classes-web-auth.md) |
| Data of many customers or shops in one database · export · backup · data deletion · cache · search | [`classes-data-tenant`](classes-data-tenant.md) |
| Calls an LLM · RAG · an AI agent that calls tools · an MCP server or client | [`classes-ai-mcp`](classes-ai-mcp.md) |
| dependencies · CI/CD · Dockerfile · build scripts · loadable plugins · update system | [`classes-supply-chain`](classes-supply-chain.md) |
| Terraform · docker-compose · Kubernetes · Helm · cloud config files (IAM · ports · buckets · encryption · images) | [`infra-checklist`](infra-checklist.md) |
| webhook (incoming or outgoing) · queues · background jobs · gRPC · GraphQL · WebSocket | [`classes-messaging-webhook`](classes-messaging-webhook.md) |
| LINE OA · LIFF · PromptPay · slips · Thai payment gateways · e-Tax Invoice · national ID numbers | [`classes-thai`](classes-thai.md) |

Lanes with no file of their own use the sections in this file: cloud and deployment (section 9) · resource exhaustion or outage (section 10) · mobile and desktop apps use `security-gate/references/android.md` together with the web-auth file for the backend · native code (C · C++) and binaries go to `reverse-engineering`

## 1 · injection — input reaches a point where it is interpreted as a command

- Hunt: SQL built by string concatenation · shell commands · template engines · file paths · LDAP · XPath · regex built from input · unescaped HTML · headers containing newlines · logs
- Often missed: data stored safely and later pulled by other code into a dangerous place (second-order) · input that is a field name, column name, or sort direction, not just a value · an ORM with a raw escape hatch (`$queryRawUnsafe` · `FromSqlRaw` · `.extra()`) · downstream systems that take the data on (search index · PDF generator · Excel file)
- `class`: `sqli` · `cmdi` · `ssti` · `path-traversal` · `xss-stored` · `xss-reflected` · `header-injection` · `log-injection`

## 2 · access control — doing more than your own permission allows

- Hunt: an endpoint that checks only that you are logged in but not that you have permission · checking the wrong permission (checks read permission but performs an edit) · checking the owner from an id in the body instead of the session · body fields that overwrite values the system means to control (`role` · `shopId` · `price`)
- Often missed: parallel paths that reach the same result with weaker checks (old API version · admin page · batch · export · import) · bulk operations that check only the first item · changing the method (`GET` is allowed but `DELETE` is not checked) · paths used on error or retry
- `class`: `idor` · `missing-authz` · `mass-assignment` · `privilege-escalation` · `authn-bypass`

## 3 · files and resources

- Hunt: path traversal, including through symlinks and encoding · the server fetching a URL the user sent (SSRF), including after a redirect · extracting a zip so files land outside the folder (zip slip) · deserializing outside data · file uploads checked only by extension · temp files whose names others can guess · check and use far enough apart that the thing can change in between
- Often missed: notification or webhook URLs the user sets themselves · PDF generators or preview makers that load images from a URL · signed object storage URLs that last too long or are too broad
- `class`: `ssrf` · `zip-slip` · `unsafe-deserialization` · `upload-type` · `toctou`

## 4 · cryptography and secrets

- Hunt: random values used as tokens that come from a guessable generator (`Math.random` · `random.random`) · secrets in code, logs, error messages, URLs or responses · HMAC not verified or compared in non-constant time · encryption modes that do not check integrity · fixed IV · passwords stored with a fast hash
- Often missed: paths where encryption fails and the code carries on unencrypted · secrets in git history that were deleted from the file (use the gitleaks result)
- `class`: `weak-random` · `secret-exposure` · `signature-bypass` · `weak-crypto` · `password-storage`

## 5 · business logic — scanners cannot find it, but impact is high

- Hunt: skipping a step, going back a step, or repeating a finished step · 2 simultaneous requests getting a 2x result (reusing a coupon · withdrawing twice · deducting stock twice) · negative numbers, zero, decimals, rounding, or numbers sent as strings · expiry at the exact boundary second · different time zones between parts of the system
- Often missed: step 2 of 3 fails and step 1 is not rolled back · a value "checked on entry" but written from another path that does not check · defaults when config is missing, a feature flag is off, or the system is mid-migration
- `class`: `race-condition` · `workflow-bypass` · `numeric-abuse` · `replay` · `fail-open`

## 6 · using a feature the wrong way

- Hunt: export or backup that yields data beyond permission · import that overwrites others' data or skips validation · search, filter, sort used to guess data that is not visible · error messages, timing, or response sizes that differ enough to enumerate users · preview or draft links that open too widely · a cache that stores a private page and serves it to others
- `class`: `export-scope` · `import-abuse` · `enumeration` · `search-oracle` · `preview-leak`

## 7 · vulnerabilities chained together

- Hunt: 2 small things that are each not a vulnerability but together cross a boundary · part A checks and passes on to B, but B trusts more than A guarantees (truncating length · type conversion · normalising) · permission that widens after a refresh token changes role, or on delegation · recovery, cancel, or rollback that does not check current permission
- Rule: every link in the chain must be confirmable separately, never assume the result of the next step · `class`: `chain` + the destination name, such as `chain-account-takeover`

## 8 · find what fits no category (wildcard) and the basics everyone assumes someone checked

**wildcard** — 1 per job, takes no category: read code that looks odd, half-finished, or named `temp` `hack` `legacy` · APIs the web page never calls · routes and headers not in the docs · 2 features not designed to be used together · git history that rolled back a security fix · tests that are missing (compare the cases the dev thought of with those they did not) · comments explaining why something is safe, check whether it is true

**the basics** — check one by one literally, and every one found must be traced along its path until you see the effect before proposing it (a cookie without `HttpOnly`: look at what it holds):

1. Passwords, keys, tokens in code (`password` · `secret` · `apikey` · `Bearer` · `-----BEGIN`) and committed `.env` `*.pem` `*.key` `credentials.json` files
2. `TODO` `FIXME` `HACK` comments that mention auth or validation
3. Debug mode that can be turned on in production through env, query, or header · sample or seed accounts that really work
4. `/debug` `/admin` `/test` `/metrics` `/env` `/.env` `/config` `/swagger` with no protection
5. `.gitignore` that does not cover secret files, uploaded files, and local config
6. `eval` · `exec` · `child_process` · `Function()` · `vm` · dynamic `import()` that takes input
7. CORS open with `*` together with credentials, or reflecting the Origin back without checking
8. Redirect from the parameters `redirect` `return` `next` `url` `goto` without checking the destination
9. Production errors that send back a stack trace, internal paths, or SQL
10. An endpoint that is still plain HTTP

## 9 · cloud and deployment (the checklist is in [`infra-checklist.md`](infra-checklist.md))

- Hunt: service account permissions broader than the job · an app trusting proxy headers (`X-Forwarded-For` · `X-User-Id`) without checking they came from the real proxy · reaching cloud metadata (`169.254.169.254`) through SSRF · public buckets or storage · secrets readable by other workloads · config systems that fail open
- Mostly outside the repo, so usually `needs_validation` · IaC inside the repo (Terraform · compose · Kubernetes YAML) can really be checked, use the `trivy config` result as a candidate

## 10 · resource exhaustion or outage (no lane file yet)

- Hunt: a regex or parser that goes exponentially slow on certain input · compressed files that become huge when extracted · queries with no limit, or N+1 from input · heavy work done before login · quotas counted over the wrong scope or resettable · exponential retries · 1 bad message that stalls the whole queue
- Rule: you must be able to show that one user makes the system unusable for others, or makes the owner pay cloud or LLM costs · heavy work that affects only themselves is not a finding · never prove it by hitting the live system, measure in the lab with small input that shows exponential growth
- `class`: `redos` · `decompression-bomb` · `unbounded-query` · `preauth-work` · `quota-bypass` · `poison-message`
