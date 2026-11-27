# Contract testing — OpenAPI is the contract, and CI checks that the real thing matches

The document `docs/API-CONVENTIONS.md` states the rules · the OpenAPI file states the shape of each endpoint · contract tests are what keep these 2 from being just documents

## 1 · OpenAPI as the contract

- Generate it from the real code (annotations · decorators · the framework's generator) and commit the resulting file — do not hand-write it separately · when the 2 sides differ, the code side is the truth, and the diff in the file is what the reviewer sees
- Every response has a schema, including errors (`web-service-essentials` §2) · every field has a `format` for dates · ids · money, per §6 of the main `api-conventions.md`

## 2 · Check responses against the spec in CI (provider side)

| Tool | What it does | licence | Note (checked 2026-10-23) |
|---|---|---|---|
| Schemathesis | reads OpenAPI, builds requests from the schema, fires them at the real service, and checks that responses match the spec and are not 500 · `schemathesis run <url of openapi.json>` | MIT | really fires, creates and deletes data → point it only at dev or staging · Python |
| Prism (Stoplight) | `prism mock <spec>` lets the frontend work before the backend is done · `prism proxy <spec> <upstream>` checks real traffic against the spec | Apache-2.0 | Node ≥ 18.20 · proxy mode can sit in front of the service in a test environment |
| Dredd | checks an API against API Blueprint / OpenAPI 2 (OpenAPI 3 experimental) | MIT | **no longer maintained** (archived 2024-11-08) — do not start using it |

Our default: Schemathesis in a CI job after the service is up with test data (the reset endpoint from `test-automation`) · failure = no merge

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
