# skill: cicd-and-release

Use when setting up or fixing CI/CD, Jenkins, releases or rollback

# Continuous Integration / Continuous Delivery (CI/CD) and releasing

> **The one rule:** build once, then carry the **same artifact** to every environment.
> If you rebuild when going to production, what passed testing and what the customer runs are not the same thing.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Pipeline stages, branches, environments, gates, versions, "which commit is production running?" | This file: sections 1 to 10 |
| Pipeline files for GitHub Actions, Azure DevOps or GitLab CI | [`references/per-platform.md`](references/per-platform.md) |
| A Jenkinsfile, Jenkins credentials, Helm deploy from Jenkins | [`references/jenkins-pipeline.md`](references/jenkins-pipeline.md) and [`references/jenkinsfile-voice-clinic.md`](references/jenkinsfile-voice-clinic.md) |
| Release day plan, who approves, what to check after deploy | [`references/deployment-plan-template.md`](references/deployment-plan-template.md) |
| Android or Flutter app releases | Section "Android / Flutter apps" at the end of this file |

## When to use this skill

- Setting up a pipeline for a new project, or rebuilding an old one that is slow or gives untrustworthy results
- Deciding about branches, versions, environments, or how to release
- Deploys often break, or you cannot roll back
- Someone asks "which version and which commit is production running right now?"

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| Where secrets are stored and how they rotate | `web-service-essentials` | instead |
| The pipeline runs on Jenkins (Jenkinsfile · credentials · approval input) | `cicd-and-release` | alongside |
| Dockerfile · Helm chart · deploy to Kubernetes | `infra-and-deploy` | alongside |
| Proportion and scope of tests per layer | `test-automation` | alongside |
| Writing a migration | `database-design` | instead |
| Steps when the system is down or a deploy breaks it | `incidents-and-monitoring` (+ `incidents-and-monitoring` after) | instead |
| Writing release notes for users to read | command `/release-notes` | instead |
| Health check the pipeline uses to decide | `web-service-essentials` | alongside |
| Commit messages that can generate release notes automatically | `git-and-review` | alongside |

**Working pipeline files for GitHub Actions, Azure DevOps and GitLab** are in `references/per-platform.md`.
**Read more when needed:** [`references/deployment-plan-template.md`](references/deployment-plan-template.md) — plan template

---

## 1 · Pipeline stages

| Order | Stage | Blocks when | Acceptable time |
|:--:|---|---|---|
| 1 | Check code format + lint | a rule is broken | < 1 minute |
| 2 | Build | compile fails · a warning set as an error appears | < 3 minutes |
| 3 | Unit test | a test fails · coverage is below the threshold | < 5 minutes |
| 4 | Check dependencies + secrets leaked into git | a high-severity vulnerability or a secret is found | < 2 minutes |
| 5 | Create the artifact + stamp the version | — | < 2 minutes |
| 6 | Deploy to staging | — | |
| 7 | Integration + end-to-end test | a test fails | < 15 minutes |
| 8 | **Human gate** (production only) | nobody has clicked approve yet | |
| 9 | Deploy to production | — | |
| 10 | Post-deploy check | a failed health check triggers an automatic rollback | < 2 minutes |

**Stages 1–5 are CI. They must run on every pull request**, not only at merge.
**Stages 1–5 together should finish within 10 minutes.** If they take longer, people start looking for ways to skip them.

---

## 2 · Build once, then promote

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (this one)
                                           ├→ uat      (same one)
                                           └→ production (same one)
```

- An artifact is a file that can really be deployed: a container image · a published zip file · a package
- **Environments may differ only in the config applied at run time**, not in a new build
- Keep artifacts for at least 30 days so you can go back, because a rollback means deploying an old artifact, not rebuilding from an old commit

> Wrong: **running `git pull` on the production machine and building there.** Nobody then knows which commit is running,
> and the dependencies pulled at that moment may not be the set that was tested.

---

## 3 · A version must trace back to a commit

Use Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| Which number goes up | When |
|---|---|
| MAJOR | a change that breaks the callers (see the table in `api-design`) |
| MINOR | a new capability; old behavior still works |
| PATCH | a bug fix |

- **The git tag is the source of truth.** `v1.4.0` points to exactly one commit.
- Attach the commit hash to the artifact too, for example `1.4.0+abc1234`
- The `/version` endpoint must return the same value (see `web-service-essentials`). A mobile app with no endpoint shows it on the "About" page instead.
- **Exception for Flutter / Android:** the number after `+` in `pubspec.yaml` is the versionCode, which must be an integer, so it cannot hold a hash (see the section "Android / Flutter apps")
- Before 1.0.0, use `0.x` and treat big changes as still allowed

---

## 4 · Branches

| Style | How | Fits |
|---|---|---|
| **trunk-based** (recommended) | short-lived branches of 1–2 days, merged into `main` often · unfinished work hidden behind a feature flag | most teams · frequent releases |
| release branch | `main` + `release/1.4` for urgent fixes | software that customers install themselves · several versions to maintain at once |
| gitflow | `develop` + `feature` + `release` + `hotfix` | big releases, rarely · usually more complex than needed |

**Rules that hold whichever style you pick:**

- `main` must be deployable at all times
- Protect `main`: require a pull request and a green CI, and never push directly
- Expect merge conflicts on any branch older than 1 week
- Delete the branch right after merging (`gh pr merge --delete-branch`) · turn on "Automatically delete head branches" in the repo's Settings → General on GitHub so it deletes after every PR · a deleted branch can be restored from the PR page

---

## 5 · Environments and gates

| Environment | Data | Who deploys | What it must pass |
|---|---|---|---|
| dev | fake | automatic on every commit | build passes |
| staging | production-like (masked) | automatic on merge into `main` | unit + integration |
| uat | production-like | the team clicks | users pass their testing |
| production | real | **a person clicks approve** | everything above |

- Staging must be as close to production as possible: database version, operating system, config values
- **Never copy real data into staging without masking personal data**
- If you have only one environment because of budget, say so plainly in the documents and use feature flags to help

---

## 6 · Secrets in the pipeline

- Store them in the platform's secret store, not in pipeline files
- Grant only the permissions that stage needs. For example, the build stage does not need the production database password.
- A pipeline that runs from an outsider's fork **must not see secrets**
- The tool that detects secrets leaked into git must sit at stage 4, not run once a year

Full detail is in `web-service-essentials`.

---

## 7 · Database migration in the pipeline

```
deploy schema (expand) → deploy code → check → deploy schema (contract) in the next round
```

- Run the migration as **its own stage** before the code deploy, not when the app boots
  (if several app instances boot at once, the migrations collide and can corrupt data)
- Use an account that can change the schema only in this stage. The account the app runs with must not be able to change the schema.
- A migration must work with the previous code version too, or rolling back the code will break the system
- Always back up first, and **test that the restore really works**
- **Exception: databases on the user's device** (SQLite · sqflite · drift on mobile) must migrate when the app opens, because there is no other way.
  The rules above apply to server databases shared by several instances. For an on-device migration, write tests that start from every schema version ever released.

For the expand/contract method, see `database-design` item 9.

---

## 8 · Release methods

| Method | How it works | Needs | Fits |
|---|---|---|---|
| stop and replace | shut down → replace → start | nothing | internal systems · can shut down at night |
| **rolling** | replace machines one at a time | a reliable health check · both versions can run together | the default for systems that run several instances |
| blue-green | bring up the whole new set, then switch traffic | 2 times the resources, temporarily | must roll back within seconds |
| canary | release to 5% of users first, then widen 5 → 25 → 100% by the numeric criteria below | metrics that split by version | large systems · high risk |

> **Rolling has a point people often forget:** during the deploy, the old and new versions serve at the same time.
> The API and schema must therefore work with both versions. If you did not design for this, some users will hit errors on every deploy.

**Criteria for widening a canary (numeric, agreed before the deploy).** Use burn rate (the rate at which the error budget is spent) by the formula in [`incidents-and-monitoring`](../incidents-and-monitoring/SKILL.md) section 4.1, measured on the new version's traffic only. Do not copy the formula here.

| Step | Traffic | Hold at least | Widen when (all must pass) |
|---|---|---|---|
| 1 | 5% | 30 minutes and at least 1,000 requests | short-window burn rate < 1 · p95 (95th percentile) latency no more than 1.2 times the old version (starting value, not yet measured) · health check passes on every machine |
| 2 | 25% | 1 hour | same criteria again |
| 3 | 100% | watch the first hour | short-window burn rate < 1 |

The hold time and the minimum request count are starting values, not yet measured. Adjust them to real traffic. If traffic is too low to reach 1,000 requests in 30 minutes, hold longer until it does. Do not lower the criteria. For a system with no SLO (Service Level Objective), use this criterion instead: the new version's errors ≤ max(2 times the old version, the old version + 0.5 percentage points) (starting value, not yet measured).

A **feature flag** (a switch that turns a feature on or off) separates "releasing the code" from "turning the feature on".

- You can merge unfinished code into `main` with the flag off
- Turn it on for some groups first, and turn it off instantly without a deploy
- **A flag needs an expiry date**, because a flag left for 1 year becomes two code paths that nobody dares to delete.
  Remove it within 2 sprints after it reaches 100%.

---

## 9 · Rollback

**Set the criteria in advance.** Do not decide while everyone is panicking and arguing over whether to wait a little longer. Use the burn rate from [`incidents-and-monitoring`](../incidents-and-monitoring/SKILL.md) section 4.1 instead of "errors above X%":

| Condition (new version's traffic) | Action |
|---|---|
| burn rate ≥ 14.4 over both the 1-hour and the 5-minute windows | roll back at once, without waiting for anyone |
| burn rate ≥ 6 over both the 6-hour and the 30-minute windows | roll back and open an incident |
| burn rate 1–6 | stop widening, stay at the current step, have a person look |
| p95 latency above 2 times the old version for 10 minutes (starting value, not yet measured) or the health check fails | roll back |

During a 5% canary, when the 1-hour window is not yet full, you may use the short window (5 minutes) with the 14.4 criterion. But the request count must first reach the minimum for that step before you trust the number.

| Required | Criterion |
|---|---|
| Rollback command | works with a single command |
| Time taken | under 5 minutes |
| **Real rehearsal** | at least once a quarter, on staging |
| Data | a migration already applied must not break the old code |

> **A rollback that has never been rehearsed is the same as no rollback**, because you find out it does not work at the moment you need it.

- No Friday-evening deploy while the team cannot yet roll back with a single command.
- No manual deploy by following steps in a Word file: on the day the author is out sick, nobody can deploy.

---

## 10 · The pipeline must be fast and trustworthy

| Problem | Fix |
|---|---|
| Slow | cache dependencies · run several test sets in parallel · move slow tests to a nightly run |
| Tests with unstable results (flaky) | **quarantine at once** and open a task to fix, because a test that sometimes fails and sometimes passes makes people stop reading results |
| Everyone waits in the queue | add runners · let pull requests run only the relevant parts |
| The build is not the same every time | lock dependency versions (lock file) · pin image versions by digest |

**Metrics worth watching:** how often you release · how long from commit to live ·
what percentage of deploys break · how long recovery takes

**Common symptoms and the first place to look**

| Symptom | Look here first |
|---|---|
| Passes on the machine, fails on CI | lock file not committed · environment variables that exist only locally · file name letter case (Linux tells them apart) · the runner's time zone is UTC |
| Fails sometimes | flaky tests (row above) · jobs running at the same time fight over the same port or database · runner out of memory |
| Slower every week | the cache key changes every time so it never hits · an unpinned image is pulled again · one test suite grows and is not split |
| Deploy is green but nothing changes on the server | reusing an old artifact or the `latest` tag · CDN or reverse proxy cache · an old instance still receives traffic |
| permission denied or an empty secret on a branch or PR | a PR from a fork gets no secrets · environment protection rule · the token expired or its scope is too small |

---

## Android / Flutter apps — differences from servers

| Topic | Rule |
|---|---|
| Version number | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` follows SemVer · **`N` is the versionCode, an integer that only goes up** (for example the CI run number) · pass the commit hash through `--dart-define=GIT_SHA=<hash>` and show it on the "About" page |
| Build once | `flutter build appbundle --release` gives one Android App Bundle (AAB) file, then promote that same file through the Play tracks: internal → closed → production · do not rebuild per track |
| Staged release | production uses a staged rollout in % (for example 5 → 20 → 50 → 100) instead of a server canary · Play tracks stand in for the environments in section 5 |
| Rollback | **you cannot roll back a version on Play**, because the versionCode cannot go down and devices that already installed it do not go back. Halt the rollout, then release a fix with a higher versionCode, and rehearse this procedure instead of section 9 |
| Signing key | keep the upload key in the CI secret store as base64 + the password as a separate secret · `android/key.properties` and `*.jks` go in `.gitignore` · **back up the key outside CI in at least 1 place.** If you lose it, you cannot update the app until Play support resets it (use Play App Signing so Google holds the real key) |

## Check before done

- **Never** rebuild for production. The artifact that passed staging is the one that ships.
- **Never** copy real customer data into staging without masking personal data (`pdpa-compliance`).
- **Never** let a pipeline that runs from an outsider's fork see secrets, and grant each stage only the permissions it needs.
- **Never** let Groovy or a shell string join a secret into a command (Jenkins). Read secrets from the environment.
- **Production needs a person who clicks approve.** A canary or staged rollout uses numbers agreed before the deploy.
- **Rehearse the rollback.** On Google Play a version cannot be rolled back, so halt the rollout and release a fix with a higher versionCode.
- **Back up the Android upload key** outside CI in at least one place, and keep it out of git.


## reference: deployment-plan-template.md

# แม่แบบแผน deploy

Open when you actually need to write this kind of document · put `(รอยืนยัน)` on anything you do not know

## Standard Output: Polished Deployment Plan

```markdown
# Deployment Plan: <Release vX.Y.Z>

| | |
|--|--|
| **Release** | vX.Y.Z |
| **Type** | Routine \| Major \| Hotfix |
| **Status** | Planned |
| **Deploy Lead** | @name |
| **Maintenance Window** | YYYY-MM-DD HH:MM-HH:MM UTC |
| **Expected Downtime** | Zero / 5 min |

---

## Pre-Deployment Checklist

| # | Item | Owner | Status |
|:-:|------|:------|:------:|
| 1 | All tests passing in CI | @dev | Done |
| 2 | Security scan passed | @security | Done |
| 3 | Database migrations reviewed | @dba | Pending |
| 4 | Rollback plan documented | @devops | Pending |
| 5 | Stakeholders notified | @pm | Pending |
| 6 | On-call engineer briefed | @oncall | Pending |
| 7 | Status page prepared | @devops | Pending |

## Deployment Flow

_[รูปขั้นตอน deploy: Tag release → CI สุดท้าย → ผ่านทั้งหมด? (ไม่ผ่าน = หยุดและตรวจ) → canary 5% → ปกติหลัง 10 นาที? (ไม่ = rollback) → 50% → ปกติ? (ไม่ = rollback) → 100% → smoke test → เสร็จ. วาดด้วย skill `diagrams`]_

## Deployment Steps

| Step | Action | Command/Link | Owner |
|:----:|--------|--------------|:------|
| 1 | Tag release | `git tag vX.Y.Z && git push --tags` | @devops |
| 2 | Trigger CD pipeline | [Pipeline link](#) | @devops |
| 3 | Deploy canary | Auto via pipeline | — |
| 4 | Monitor canary | [Grafana](#) | @oncall |
| 5 | Approve full deploy | Slack `/deploy approve` | @lead |
| 6 | Verify production | Smoke test suite | @qa |

## Verification

### Health Checks
- [ ] `/health` returns 200
- [ ] All pods/instances running
- [ ] Database connections OK
- [ ] No spike in 5xx errors (Grafana dashboard X)

### Smoke Tests
- [ ] User login works
- [ ] Critical user journey #1 works
- [ ] Critical API endpoints return expected response

### Key Metrics (15 min post-deploy)
| Metric | Baseline | Threshold | Current |
|--------|---------:|----------:|--------:|
| p95 latency | 150ms | < 200ms | — |
| Error rate | 0.1% | < 0.5% | — |
| Throughput | 1000 RPS | > 800 RPS | — |

## Rollback Plan

> **Triggers:** Any of the following requires immediate rollback
> - 5xx error rate > 2% sustained for 5 min
> - p95 latency > 500ms sustained for 5 min
> - Customer-impacting bug confirmed

### Rollback Steps
1. Run: `./scripts/rollback.sh vX.Y.Z-1`
2. Verify health checks
3. Post in #incidents channel
4. Schedule post-mortem within 48h

## Post-Deployment

- Monitor for 1 hour post-deploy
- Update changelog with release notes
- Send announcement to #releases
- Close release ticket
```


## reference: jenkins-pipeline.md

<!-- merged from skill `jenkins-pipeline` on 2026-11-27 · description was: Use when writing or fixing a Jenkinsfile -->
# jenkins-pipeline — a Jenkinsfile that builds images, tests and deploys with Helm without leaking secrets

## Contents

- [Use when](#use-when)
- [1 · Declarative Pipeline layout](#1--declarative-pipeline-layout)
- [2 · agent: Kubernetes or Docker](#2--agent-kubernetes-or-docker)
- [3 · Secrets](#3--secrets)
- [4 · Build the image](#4--build-the-image)
- [5 · Deploy with Helm](#5--deploy-with-helm)
- [6 · Many services](#6--many-services)
- [7 · Shared library](#7--shared-library)
- [8 · Plugins and checking a Jenkinsfile](#8--plugins-and-checking-a-jenkinsfile)
- [Check before sending](#check-before-sending)
- [References](#references)

> **The one rule:** keep secrets in Jenkins credentials and let the shell read them from the environment (`sh '...'` with single quotes) · never let Groovy concatenate a secret into a command.
> Groovy expands the value before it reaches the agent, so the secret ends up in the process arguments, where `ps` can see it ([Jenkins: Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)).

## Use when

- Writing a new Jenkinsfile, or fixing one that builds images, tests and deploys to Kubernetes with Helm
- There are many services and the team wants to share a pipeline (shared library)
- A secret shows up in the console log, or the pipeline uses the `latest` tag

Do not use when: the team uses GitHub Actions · GitLab CI · Azure DevOps → `cicd-and-release` (`per-platform.md`) · there is no chart to deploy yet → `infra-and-deploy` first

Alongside: `cicd-and-release` (read first · general pipeline principles) · `web-service-essentials` (store, rotate secrets) · `security-gate` (dependency, image, secret checks) · [`infra-and-deploy`](../../infra-and-deploy/SKILL.md) (owns the chart · Dockerfile). Instead: agent drives Jenkins through MCP → `ai-engineering` · untrusted-code containers → `infra-and-deploy`


## 1 · Declarative Pipeline layout

- Use Declarative, not Scripted · put `agent none` at the top and let each stage declare its own `agent` · with `agent none`, Jenkins requires every stage to have an `agent` ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- Order the stages as in `cicd-and-release` section 1: lint → test → build + scan → staging → test on staging → approval → production → post-deploy check
- Use a Multibranch Pipeline, because `when { branch 'main' }` works only in multibranch · deploy stages run only on `main` · a PR runs only lint · test · build
- **Put `beforeAgent true` on `when`.** By default it is evaluated after the agent is allocated, which wastes a pod on branches that do not deploy. **Put `beforeOptions true` on any stage with `input`.** By default `when` is not evaluated before `input`, so the approval prompt appears even when the branch is not `main`. `beforeOptions true` overrides `beforeInput` and `beforeAgent` ([Pipeline Syntax, section on when](https://www.jenkins.io/doc/book/pipeline/syntax/#when))
- Always set these `options`

| option | Example | Reason |
|---|---|---|
| `timeout` | `timeout(time: 45, unit: 'MINUTES')` | Keeps a hung build from holding a runner. (At the top level it does not count the wait for an agent, but it does count the wait for `input`, so a pipeline with an approval gate needs a timeout longer than the approval wait.) |
| `disableConcurrentBuilds` | `disableConcurrentBuilds()` | 2 builds cannot deploy the same release at once · the plain form queues the new build · `abortPrevious: true` cancels the running one, which may be mid-deploy, so do not use it in a pipeline that deploys |
| `buildDiscarder` | `buildDiscarder(logRotator(numToKeepStr: '30'))` | Logs and artifacts do not grow without limit · the number 30 is our own choice, not an official value |

## 2 · agent: Kubernetes or Docker

| Form | Use when | Watch out for |
|---|---|---|
| `agent { kubernetes { yaml '''...''' defaultContainer 'x' } }` | Jenkins runs on Kubernetes · you want a clean pod for every build | Needs Multibranch or Pipeline from SCM · a declarative template does not inherit from a parent template unless you add `inheritFrom` ([Kubernetes plugin](https://plugins.jenkins.io/kubernetes/)) |
| `agent { docker { image '...' } }` | One stage needs a specific tool (helm · node) | Pin the image to a version number or digest, never `latest` |
| `agent { label 'docker-build' }` | Build images with Docker on a machine set up for it | The Docker daemon runs as root, so let this machine run only our team's pipelines and never PRs from forks ([Docker security](https://docs.docker.com/engine/security/)) |

- **Do not mount the node's `/var/run/docker.sock` into the pod** to build images `(ยังไม่ได้ตรวจ: the Kubernetes plugin page has no warning about docker.sock and does not mention build tools inside a pod · our reason is that the daemon runs as root)` · if you must build inside a pod, check an official source for a tool that builds without the node's daemon before you choose one
- The deploy stage uses a pod with `helm` and `kubectl` pinned to versions, not the same agent that builds images

## 3 · Secrets

| Before → after | Reason |
|---|---|
| `sh "helm ... --password ${TOKEN}"` → `sh 'helm ... --password "$TOKEN"'` | Groovy does not touch the value · the shell reads it from the environment |
| `credentials()` in the top-level `environment` → `withCredentials` wrapped around only the stages that use it | The value is not in the environment of every stage |
| `echo` of a secret, or `set -x` in a block with secrets → no echo · add `set +x` | Jenkins masks values as `****` in the log, but that only guards against mistakes, not against someone who deliberately extracts the value |
| Passing user parameters into `sh "..."` → single quotes, and let the shell read the variable | Special characters in a parameter can inject commands |
| kubeconfig as text → a credential of type Secret file (`file(credentialsId: '...', variable: 'KUBECONFIG')`) | The variable holds the path of a temporary file, not the file contents |

- Credential types that `credentials()` accepts: secret text · username/password (gives `X`, `X_USR`, `X_PSW`) · secret file · SSH private key · any other type makes the pipeline fail ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- On Windows, a value containing `%` gets mangled inside double quotes · use `bat 'echo %KEY%'` ([Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/))
- Build `withCredentials` blocks with Jenkins's Snippet Generator instead of typing them by hand
- PRs from forks must never see credentials · set Multibranch to use the Jenkinsfile only from trusted branches `(ยังไม่ได้ตรวจ: the setting's name in the plugin)`
- For how to store, rotate and separate secrets per environment → `web-service-essentials` · to check for secrets that leaked into git → `security-gate`

## 4 · Build the image

1. Tag with the commit SHA (`GIT_COMMIT` cut to 12 characters), never `latest` · the tag points at one commit, so you can trace back (`cicd-and-release` section 3)
2. Build once, push once, then read the **digest** from `docker buildx build --push --metadata-file meta.json`, key `containerimage.digest` ([buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/))
3. Staging and production use the same digest, passed along with `env.IMAGE_DIGEST`, with no rebuild
4. Scan for vulnerabilities before deploy: `trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 <image>@<digest>` · `--exit-code` is the exit code returned when issues are found, which fails the stage ([Trivy CLI](https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/) · [filtering](https://trivy.dev/latest/docs/configuration/filtering/)) `(ยังไม่ได้ตรวจ: the default value of --exit-code in the docs)`
5. Log in to the registry with `--password-stdin`, never passing the password as an argument `(ยังไม่ได้ตรวจ: the docker login page)`
6. Keep the digest and scan results as build artifacts (`archiveArtifacts`) for tracing back

## 5 · Deploy with Helm

```
helm upgrade --install clinic deploy/chart/clinic-voice -n clinic-production \
  -f deploy/chart/clinic-voice/values.yaml -f deploy/chart/clinic-voice/values-production.yaml \
  --atomic --timeout 20m
```

- `--install` installs the release if none exists ([helm upgrade](https://helm.sh/docs/helm/helm_upgrade/))
- Helm 3: `--atomic` rolls back by itself when the upgrade fails, and turns on `--wait` ([Helm 3](https://helm.sh/docs/v3/helm/helm_upgrade/)) · Helm 4: the `--atomic` flag is marked deprecated, so use `--rollback-on-failure` instead (as `infra-and-deploy` checked in `helm-chart.md` · [Helm 4 upgrade](https://helm.sh/docs/helm/helm_upgrade/)) → run `helm version` on the build machine and pick the matching flag
- `--timeout` counts per individual action, not for the whole upgrade (default 5m0s) · workloads that load models (stt · tts) need longer than that, real value `(ยังไม่ได้วัด)` (not yet measured) as in `infra-and-deploy` → `references/kubernetes-helm.md` item 5 · `--history-max` defaults to 10
- **The digest lives in `values-<env>.yaml`**, as the `infra-and-deploy` chart specifies (`api.image.digest` and so on · the chart uses `required` to force it to exist) · never pass it with `--set` · the pipeline writes the built digest into each environment's values file, then hands the same file on to staging and production
- **Staging is automatic** after a merge into `main`, then run tests on staging (smoke · integration) and let them pass before the human gate
- **Production needs `input`**
  - `input message: '...', ok: 'Deploy', submitter: 'release-managers'` · `submitter` is the list of users or groups who may click, separated by commas · leave it out and anyone can click ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
  - A stage-level `input` runs before the agent is allocated, so it holds no executor while waiting · also set a `timeout` on that stage so it does not hang overnight
  - The approver should not be the person who pushed that commit `(our own criterion, not an official value)` · record who clicked with `submitterParameter` `(ยังไม่ได้ตรวจ: the description on the step page)`
- **Rollback:** `helm rollback <release> [REVISION]` · with no revision number it goes back to the previous revision · see the numbers with `helm history <release>` ([helm rollback](https://helm.sh/docs/helm/helm_rollback/)) · put it in `post { failure { ... } }` of the post-deploy check stage · for principles and drills → `cicd-and-release` section 9
- Database migration is its own stage before the code deploy → `cicd-and-release` section 7

## 6 · Many services

- Build many services at once with `matrix` (axis `SERVICE`) or `parallel` · add `failFast true` when the rest are pointless once any service fails ([Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/))
- Each service has its own tag and digest · deploy one release at a time in dependency order, not all at once
- `disableConcurrentBuilds` makes unrelated services wait on each other → split into one job per service when the teams are separate

## 7 · Shared library

- **Create one when** the same build/scan/deploy block has been copied into more than 3 Jenkinsfiles `(our own criterion)` · below that, copying is easier (`superuser:ground-rules`)
- Always pin the version: `@Library('clinic-pipeline@v1.2.0') _` · a version can be a branch · tag · commit hash ([Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)) · never rely on the default, because one push changes every pipeline
- Layout: `vars/` functions that a Jenkinsfile calls · `src/` Groovy classes · `resources/` files loaded with `libraryResource`
- A trusted library can call all of Jenkins's internal methods. **Anyone who can push a commit to the library repo controls Jenkins** → protect its branches and tags as strictly as production · global variables must hold no state (it is lost when the controller restarts)

## 8 · Plugins and checking a Jenkinsfile

- Pin plugin versions in `plugins.txt` in the form `name:version`, then install with `jenkins-plugin-cli --latest=false` (without it, a dependency pulls in a newer version and overrides yours) ([plugin-installation-manager-tool](https://github.com/jenkinsci/plugin-installation-manager-tool))
- Follow the security advisories by [RSS](https://www.jenkins.io/security/advisories/) · update plugins named in an advisory quickly · remove plugins you do not use
- The MCP Server plugin turns the controller into an MCP server (endpoint `/mcp-server/mcp`) · use the API token of a least-privilege user, and `allowUnauthenticatedMcp` must be `false` ([plugins.jenkins.io/mcp-server](https://plugins.jenkins.io/mcp-server/)) · to install it and connect an agent → `ai-engineering`
- **Check before commit**
  - `ssh -p $JENKINS_PORT $JENKINS_HOST declarative-linter < Jenkinsfile`
  - `curl -X POST --user "$JENKINS_AUTH" -F "jenkinsfile=<Jenkinsfile" "$JENKINS_URL/pipeline-model-converter/validate"` (`JENKINS_AUTH` = `user:api_token`) ([Pipeline Development Tools](https://www.jenkins.io/doc/book/pipeline/development/))
  - The linter checks only Declarative syntax. It does not run the pipeline and does not catch string interpolation → check section 3 yourself, or run `grep -nE 'sh +"|sh +\x27{3}' Jenkinsfile` and review every line it finds

## Check before sending

- [ ] No `sh "..."` or `"""` that contains a `$` for a secret · no `echo` of a secret
- [ ] `withCredentials` wraps only the stages that use it
- [ ] Image tag is a SHA with no `latest` · staging and production use the same digest
- [ ] There is an image scan that fails the stage
- [ ] Production has `input` + `submitter` + `timeout` · deploy uses `--atomic` or the equivalent flag of the Helm version in use
- [ ] `@Library` and plugins are pinned
- [ ] Passes `declarative-linter` or the validate endpoint
- [ ] Anything not yet checked is told to the user plainly

## References

- [`jenkinsfile-voice-clinic.md`](jenkinsfile-voice-clinic.md) — open for the full Jenkinsfile and the worked example (dental clinic voice agent) decision table
- [`sources.md`](sources.md) — sources checked 2026-10-27


## reference: jenkinsfile-voice-clinic.md

# Example Jenkinsfile: dental clinic voice agent

Use with the `SKILL.md` of `cicd-and-release`. Service names, chart, namespaces and probes match `infra-and-deploy` (one chart `clinic-voice`, release `clinic`). Credential names and the registry are made up, so replace them with real ones. **`ยังไม่ได้ตรวจ` against a real Jenkins**: it was only read against the docs (checked 2026-10-27). Check the syntax with `declarative-linter` before you commit.

## Contents

- [Jenkinsfile](#jenkinsfile)
- [Values to replace](#values-to-replace)
- [Not yet checked](#not-yet-checked)

## Jenkinsfile

```groovy
@Library('clinic-pipeline@v1.2.0') _   // if you have a shared library · pin the version · delete this line if you have none

pipeline {
  agent none
  options {
    timeout(time: 4, unit: 'HOURS')   // must exceed the whole build time plus the 2-hour approval wait, because the top-level timeout also counts the wait for input
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    REGISTRY = 'registry.example.com/clinic'
    CHART    = 'deploy/chart/clinic-voice'
  }

  stages {
    stage('Lint and unit test') {
      agent { label 'docker-build' }
      steps {
        sh 'make lint test'
        // the committed values need a temporary digest that passes the chart's required check, or lint fails before the step that writes the real digest
        sh 'helm lint "$CHART" --strict -f "$CHART/values-production.yaml"'
      }
    }

    stage('Build, push, scan, pin digest') {
      when { branch 'main'; beforeAgent true }
      agent { label 'docker-build' }
      steps {
        script { env.TAG = env.GIT_COMMIT.take(12) }
        withCredentials([usernamePassword(credentialsId: 'registry-push',
                                          usernameVariable: 'REG_USER',
                                          passwordVariable: 'REG_PASS')]) {
          // all single quotes: the shell reads REG_USER and REG_PASS itself
          sh '''
            set +x
            echo "$REG_PASS" | docker login registry.example.com -u "$REG_USER" --password-stdin
            # image name : key name in values.yaml
            for pair in web:web api:api voice-gateway:voiceGateway stt:stt tts:tts; do
              svc=${pair%%:*}; key=${pair##*:}
              docker buildx build "services/$svc" \
                -t "$REGISTRY/$svc:$TAG" --push --metadata-file "meta-$svc.json"
              D=$(jq -r '."containerimage.digest"' "meta-$svc.json")
              trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
                "$REGISTRY/$svc@$D"
              # the digest lives in each environment's values · staging and production get the same one
              for env in staging production; do
                D="$D" yq -i ".$key.image.digest = strenv(D)" "$CHART/values-$env.yaml"
              done
            done
          '''
        }
        archiveArtifacts artifacts: 'meta-*.json, deploy/chart/clinic-voice/values-*.yaml', fingerprint: true
        stash name: 'pinned', includes: 'deploy/chart/clinic-voice/values-*.yaml'
      }
    }

    stage('Deploy staging') {
      when { branch 'main'; beforeAgent true }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        unstash 'pinned'
        withCredentials([file(credentialsId: 'kubeconfig-staging', variable: 'KUBECONFIG')]) {
          // long timeout because stt/tts pull large images and load models (real value not yet measured)
          sh '''
            helm upgrade --install clinic "$CHART" -n clinic-staging --create-namespace \
              -f "$CHART/values.yaml" -f "$CHART/values-staging.yaml" \
              --atomic --timeout 20m
            kubectl -n clinic-staging rollout status deploy --timeout=10m
          '''
        }
      }
    }

    stage('Test on staging') {
      when { branch 'main'; beforeAgent true }
      agent { label 'docker-build' }
      steps {
        // hits /health/live and /health/ready of web, api and voice-gateway, plus 1 test call
        sh 'make smoke-staging'
      }
    }

    stage('Production') {
      // beforeOptions true: keeps the approval prompt from appearing on branches other than main
      when { branch 'main'; beforeOptions true }
      options { timeout(time: 2, unit: 'HOURS') }
      // input comes before agent: no executor is held while waiting for a person
      input {
        message 'Deploy to production (namespace clinic-production)?'
        ok 'Deploy'
        submitter 'clinic-release-managers'
        submitterParameter 'APPROVER'
      }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        echo "Approved by ${APPROVER}"        // a user name, not a secret
        unstash 'pinned'
        withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
          sh '''
            helm upgrade --install clinic "$CHART" -n clinic-production \
              -f "$CHART/values.yaml" -f "$CHART/values-production.yaml" \
              --atomic --timeout 20m
            kubectl -n clinic-production rollout status deploy --timeout=10m
            ./ci/smoke.sh clinic-production
          '''
        }
      }
      post {
        failure {
          withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
            // roll the single release back to the previous revision (no revision number) · see the number with helm history clinic
            sh 'helm rollback clinic -n clinic-production --wait --timeout 20m'
          }
        }
      }
    }
  }
}
```

## Values to replace

| Where | Replace with |
|---|---|
| `ci/helm-pod.yaml` | A pod with a container named `helm` (an image that has `helm` and `kubectl`, pinned to a version, never `latest`) |
| `registry-push` · `kubeconfig-staging` · `kubeconfig-production` | Credential IDs in Jenkins · the production kubeconfig uses a ServiceAccount that can change only the namespace `clinic-production` |
| `clinic-release-managers` | The approver group · start with people other than the one who pushed |
| `make lint test` · `make smoke-staging` · `ci/smoke.sh` | The project's own commands |
| key in `.<key>.image.digest` | The value name in the chart's `values-<env>.yaml` (`infra-and-deploy` `references/helm-chart.md` uses `api.image.digest`) |
| `--atomic` | Helm 4 uses `--rollback-on-failure` (`--atomic` is deprecated) · run `helm version` before you choose |
| digest in values | The pipeline edits the file only in the workspace and the artifact · whether to commit it back to git is the team's call `(รอยืนยัน)` |

## Not yet checked

- `jq`, `yq` and `trivy` must be installed on machines labelled `docker-build` · `ยังไม่ได้ตรวจ`: the docs for `yq -i` with `strenv()` have not been opened
- Stashing the values files across agents, then running `unstash` over the checked-out files, works as written (`ยังไม่ได้ตรวจ`: not tried)
- The one-line forms: `yamlFile` + `defaultContainer` separated by `;`, and `when { branch 'main'; beforeAgent true }` (the docs show a multi-line form) · let `declarative-linter` decide
- The `--timeout 20m` value for stt/tts has not been measured

## Worked example: dental clinic voice agent

**Problem:** a dental clinic voice agent system with 5 services (`web` · `api` · `voice-gateway` · `stt` · `tts`) in one chart `clinic-voice` · built as Docker images · staging is tested automatically · for production, a release manager clicks to approve · service names, namespaces and probes match `infra-and-deploy`

**What was done:** the full Jenkinsfile is the part above in this file · decision summary

| Topic | Choice | Reason |
|---|---|---|
| Clinic secrets (STT/TTS keys · Kafka · database) | In the chart's `ExternalSecret`, never through Jenkins | Jenkins knows only the kubeconfig and the registry · patient data stays out of the build log (`pdpa-compliance` · `errors-and-logs`) |
| image | `registry.example.com/clinic/<service>:<sha12>` + digest | Every service has its own version |
| digest | Written to `values-staging.yaml` and `values-production.yaml` in the build step | Production uses the same digest that passed staging |
| Test staging | Hit `/health/live` and `/health/ready` of `web` `api` `voice-gateway` + 1 test call | Before the human gate |
| Human gate | `input` `submitter: 'clinic-release-managers'` timeout 2 hours | A release window that does not collide with calls in progress `(รอยืนยัน)` |
| Failure | release `clinic` in `clinic-production` · `--atomic --timeout 20m` rolls back by itself · if the post-deploy smoke fails → `helm rollback clinic` | stt/tts take long to load models, so the timeout is long `(ยังไม่ได้วัด)` · drill on staging every quarter |

**Result:** secrets are not in the Jenkinsfile · production gets the same image that passed staging, traceable by digest `(ยังไม่ได้ตรวจ: not yet run against a real Jenkins)`



## reference: per-platform.md

# Starter pipeline files by platform

**Contents:** 1 GitHub Actions · 2 Azure DevOps · 3 GitLab CI · 4 Multi-stage Dockerfile · 5 Capability comparison table

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Multi-stage Dockerfile](#4--multi-stage-dockerfile)
5. [Capability comparison table](#5--capability-comparison-table)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` runs on every pull request.

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:                       # cancel the older run when a new push arrives
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }   # full history is needed to compute the version

      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --coverage

      - name: ตรวจ dependency
        run: npm audit --audit-level=high

      - name: ตรวจ secret รั่วใน repo
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }} # required when the repo belongs to an organization; not needed for a personal account (gitleaks-action README, checked 22 Oct 2026 (B.E. 2569))

      - uses: actions/upload-artifact@v4
        with:
          name: app-${{ github.sha }}
          path: dist/
          retention-days: 30
```

`.github/workflows/deploy.yml` takes the same artifact from ci and deploys it to one environment at a time.

```yaml
name: deploy
on:
  workflow_run:
    workflows: [ci]
    types: [completed]
    branches: [main]

jobs:
  staging:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4             # scripts/deploy.sh comes from the repo
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4    # the build output comes from the artifact (dist/)
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production        # <- set required reviewers here = the human gate
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4   # same artifact as staging
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh production
      - name: ตรวจหลัง deploy
        run: |
          for i in $(seq 1 10); do
            curl -fsS https://api.example.co/health/ready && exit 0
            sleep 6
          done
          ./scripts/rollback.sh && exit 1
```

**Cautions:**

- `pull_request_target` can see secrets and runs code from forks, so **do not use it** unless you know exactly what you are doing.
- Set `permissions` as narrow as possible in every workflow, because some organizations default to write access on the whole repo.
- The versions in the examples (`@v4`, Node 22, .NET 8.x) are only examples. Check the latest versions before use (`รอยืนยัน`, awaiting confirmation).
- Pin each action at least by version tag (`@v4`). For stricter control, pin by commit hash.
- `environment:` is where you set approvers (required reviewers) and secrets that belong to one environment.

---

## 2 · Azure DevOps

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [main] }

variables:
  buildConfiguration: Release

stages:
- stage: build
  jobs:
  - job: build
    pool: { vmImage: ubuntu-latest }
    steps:
    - task: UseDotNet@2
      inputs: { version: '8.x' }
    - script: dotnet restore
    - script: dotnet build -c $(buildConfiguration) --no-restore
    - script: dotnet test -c $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
    - script: dotnet publish -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory) --no-build
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: app

- stage: staging
  dependsOn: build
  jobs:
  - deployment: staging
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app
          - script: ./scripts/deploy.sh staging

- stage: production
  dependsOn: staging
  jobs:
  - deployment: production
    environment: production        # <- set approval on the Environments page
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app          # same artifact from the build stage
          - script: ./scripts/deploy.sh production
```

- A `deployment` job differs from a plain `job` because it binds to an environment, so it gets deploy history and an approval step.
- Keep secrets in a variable group linked to Azure Key Vault. Do not write them into files.
- Secret variables are **not passed into scripts automatically**. Map them one by one through `env:`.

---

## 3 · GitLab CI

`.gitlab-ci.yml`

```yaml
stages: [test, build, deploy]

default:
  interruptible: true

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  key: { files: [requirements.txt] }
  paths: [.cache/pip]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - ruff check .
    - pytest --cov --cov-fail-under=70
  coverage: '/TOTAL.*\s+(\d+%)$/'

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - echo "$CI_JOB_TOKEN" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:staging:
  stage: deploy
  environment: { name: staging, url: https://staging.example.co }
  script: ./scripts/deploy.sh staging $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  environment: { name: production, url: https://example.co }
  when: manual                     # <- human gate
  script: ./scripts/deploy.sh production $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

- Mark secret variables `Masked` and `Protected` under Settings → CI/CD.
- Use `when: manual` together with a protected environment. Only then is it an approval gate that really blocks.

---

## 4 · Multi-stage Dockerfile

```dockerfile
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package*.json ./
# this layer stays cached as long as the lock file does not change
RUN npm ci
COPY . .
RUN npm run build

# ---- run stage ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
# do not run as root
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js
CMD ["node", "dist/main.js"]
```

**Rules:**

- Copy the files that change least first, so the early layers reuse the cache.
- Do not copy `.env`, `.git` or `node_modules` into the image. Block them with `.dockerignore`.
- For a build that gives the same result every time, pin the base image by digest.
- Always name the tag with the commit hash. `latest` may serve as an alias, but never deploy with `latest`.

---

## 5 · Capability comparison table

| Need | GitHub Actions | Azure DevOps | GitLab CI |
|---|---|---|---|
| Human approval gate | Environment + required reviewers | Environment approvals | `when: manual` + protected env |
| Store artifacts | `upload/download-artifact` | `publish` / `download` | `artifacts:` |
| Cache dependencies | `actions/cache` or `cache:` in setup | `Cache@2` | `cache:` |
| Secrets per environment | Environment secrets | Variable group + Key Vault | Protected variables per environment |
| Cancel older runs | `concurrency` | `batch: true` (merges triggers that arrive while a run is active; it does not cancel the older run) | `interruptible: true` |
| Run in parallel | `strategy.matrix` | `strategy.matrix` | `parallel:` |
| Self-hosted runners | Yes | Yes | Yes |

> **Every platform can do the same things**, so do not choose by feature list.
> Pick the one that lives where the repo lives, and put your effort into the content of the pipeline instead.


## reference: sources.md

# Sources · jenkins-pipeline

### Checked 2026-10-27

- Jenkins: [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/) · [Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/) · [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/) · [Pipeline Development Tools](https://www.jenkins.io/doc/book/pipeline/development/) · [Security advisories](https://www.jenkins.io/security/advisories/) · [input step](https://www.jenkins.io/doc/pipeline/steps/pipeline-input-step/)
- Plugins: [Credentials Binding](https://plugins.jenkins.io/credentials-binding/) · [Kubernetes](https://plugins.jenkins.io/kubernetes/) · [MCP Server](https://plugins.jenkins.io/mcp-server/) · [plugin-installation-manager-tool](https://github.com/jenkinsci/plugin-installation-manager-tool)
- Helm: [upgrade 4.3.1](https://helm.sh/docs/helm/helm_upgrade/) · [upgrade 3.x](https://helm.sh/docs/v3/helm/helm_upgrade/) · [rollback](https://helm.sh/docs/helm/helm_rollback/)
- Docker · Trivy: [buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/) · [Docker security](https://docs.docker.com/engine/security/) · [Trivy image CLI](https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/)
- The Credentials Binding page shows how to use `withCredentials` only for `usernamePassword` and warns to use single quotes · the `file` and `sshUserPrivateKey` types are cited from the Using a Jenkinsfile page


---

# skill: test-automation

Use for automated, end-to-end or load tests and app verifiers

# test-automation — tests the team trusts, load tests with permission, and an app the agent can run

> **One rule:** a test is only worth keeping when people trust its result, and no load test or real-app run may touch a system, database or payment that you are not allowed to use.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Which commit broke the tests?", "the suite was green last week" | [`scripts/culprit.mjs`](scripts/culprit.mjs) `--good <commit> --test "<cmd>"` · finds the first bad commit in a temporary worktree and names its card · "two agents ran heavy tests and the machine froze" → wrap heavy runs in [`scripts/test-lock.mjs`](scripts/test-lock.mjs) `-- <cmd>` (one at a time per machine) |
| "Set up tests", "tests are flaky", "what should a good test look like?" | [`references/testing-standards.md`](references/testing-standards.md) |
| "Write end-to-end tests", "the browser test keeps failing" | [`references/e2e-testing-patterns.md`](references/e2e-testing-patterns.md) |
| "How many users can it hold?", "will it be slow at peak?" | [`references/load-testing.md`](references/load-testing.md) |
| "Let the agent run the app and check", no script to start the app, or the verifier is out of date | [`references/app-verifier-setup.md`](references/app-verifier-setup.md) |

Other references in this folder: [`flaky-tests.md`](references/flaky-tests.md) · [`page-object-model.md`](references/page-object-model.md) · [`test-data-strategies.md`](references/test-data-strategies.md) · [`per-stack.md`](references/per-stack.md) · [`ci-and-parallel.md`](references/ci-and-parallel.md) · [`reading-results.md`](references/reading-results.md).

## Steps every part shares

1. **Write the expected result before the run.** For a load test, the pass threshold is written into the script first. For a functional test, the expected value is written in the test, not read off the current output.
2. **Keep tests deterministic.** Use fixed data, a fixed clock, and no real outside service. A test that flips between red and green gets fixed or removed, never silently skipped.
3. **Prove the test can fail.** Break the feature once on purpose and confirm the test goes red. A test that cannot fail gives no evidence.
4. **Run the check the same way in CI and on your machine.** Pin the tool version. Do not use `latest`.

## Test mode for cards

Pick once per project and write it in `CLAUDE.md`. The default is `gate`, because the full suite on every card is the slowest path and parallel full runs can run the machine out of memory.

| Mode | Card `done_when` runs | Full suite runs |
|---|---|---|
| `every` | the full suite | on every card |
| `targeted` | only the tests of the card's files | at the milestone gate card |
| `gate` (default) | the card's own tests | once, on a gate card that `depends` on every card of the milestone |

Wrap full-suite and load-test commands in `scripts/test-lock.mjs --` so 2 lanes never run them at once. When the gate card fails, `scripts/culprit.mjs` finds the card that broke it.

## Check before done

- Never load test a system that is not ours (a partner API, a payment gateway, a competitor's site). Use a mock or a sandbox instead.
- Never run a load test beyond smoke, or any load test on production, without a named approver, a time window, a peak volume, and a person who can stop it at once.
- Load test data holds no real customer names, phone numbers or orders (`pdpa-compliance`). A load run must not send real money, email, SMS or orders.
- An app-verifier script never touches the real database, never calls a paid external API, never sends a real message, and never solves a CAPTCHA. Test accounts go in a test-data file, never real passwords.
- The verifier script never passes empty: if the feature name is missing, or the app does not start, it exits with an error.
- If the app is broken, file a bug with `qa-docs`. Never edit a verify step just to make it pass.

## References

- [`assets/k6-smoke.yml`](assets/k6-smoke.yml) and [`assets/load-test.js`](assets/load-test.js) — load test starter and CI smoke workflow
- [`scripts/with_server.py`](scripts/with_server.py) — starts a web server, waits for its port, runs the script, then stops the server
- [`references/sources.md`](references/sources.md) — where the tool facts came from (checked 2026-10-28)


## reference: android-native.md

# Driving a native Android / Flutter app on an emulator

> Summarized from a real app, `Lumio - Light Meter` (Flutter · Android). The script that ran and passed is `lumio-light-meter/test/e2e/verify.mjs`.
> Values marked "measured" come from an emulator on Windows using software GPU rendering. Other machines may be faster.

## Choose how to drive

| Method | Strength | Limit | Use when |
|---|---|---|---|
| Node/Python calling `adb` + `uiautomator dump` | Nothing extra to install · can drive the virtual sensor and camera · can check `dumpsys` | Reading the screen takes 3–4 seconds each time (measured) | Default · tests the whole path hardware → native → Dart → screen |
| Flutter `integration_test` (`flutter test integration_test/`) | Finds widgets directly with `find` · fast | Cannot feed real sensor values, so it needs a fake data source · cannot check system state (was the camera released?) | Long screen sequences that do not touch hardware |
| Maestro | Flows written in readable YAML | Needs an extra install · not yet tested in this setup | The team already uses Maestro |

## Script structure (verify.mjs style)

1. **Check before starting** that a device is connected (`adb devices`) and the APK exists (`build/app/outputs/flutter-apk/app-debug.apk`). If either is missing, exit 1 and print the command to run.
2. **Install** with `adb install -r <apk>`, then **start clean for every feature**: `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → wait for the text on the first screen.
3. **Read the screen**: `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → pull `text` and `content-desc` with the center point from `bounds`.
4. **Tap** with `adb shell input tap x y` · **feed a value** with `adb emu sensor set light <lux>` · **take a screenshot** with `adb exec-out screencap -p > shot.png`.
5. **Result**: `PASS/FAIL` with expected and actual values, and exit 0 only when at least 1 check ran and all checks passed.

## Rules learned from real runs

| Topic | Do this | Because |
|---|---|---|
| Text in Flutter | Add `Semantics(label: ...)` to every value you must check | The label appears as `content-desc` in `uiautomator dump`, so it can be checked, and it also helps screen-reader users. |
| Stale dump file | Delete `/sdcard/ui.xml` before every dump | When a dump fails it does **not overwrite** the old file, so you may read an old screen without knowing. |
| "could not get idle state" | Treat it as an app bug and fix the app | The app redraws constantly (Lumio redrew 5 times per second even when the value did not change). That wastes battery and makes TalkBack repeat itself. Fix it by notifying the UI only when the displayed value really changes (for a jittery sensor: a change over 1 %). For a secondary value that drifts slowly, update about once per second. |
| Moving targets | Tap only when 2 reads in a row give the same position | A dialog shifts up when the keyboard opens. A tap at the old position hits the backdrop and the dialog closes (probably the cause of the 1 remaining flaky (inconsistent) result, but not yet re-checked). |
| Permissions | Run `adb shell pm grant <package> android.permission.CAMERA` before any check that does not test the permission screen | The system permission dialog is not what that check is testing. |
| "Released" check | Check the precondition first (the camera is held) → press Home → poll `dumpsys media.camera` for "Active Camera Clients" every 1 second for up to 20 seconds | The emulator releases the camera in 5–8 seconds (measured). Without the precondition check, the check passes while testing nothing. |
| Git Bash | Call `adb` from Node/Python (`execFile`) or set `MSYS_NO_PATHCONV=1` | Git Bash rewrites `/sdcard/...` into `C:/Program Files/Git/sdcard/...`. |

## Feeding hardware values

| What to feed | On the emulator | Note |
|---|---|---|
| Light sensor | `adb emu sensor set light <lux>`, and the app receives the value through `Sensor.TYPE_LIGHT` (measured) | For other sensors use `adb emu sensor set <name> <value>` (not checked one by one) |
| Camera | The virtual front camera sends an image with ISO and exposure time (measured) | The image is a synthetic scene, so you can only check that "a value comes out", not its accuracy |
| Anything else, or what the emulator cannot do | A fake data source compiled into the debug build only | It must never leak into a release build |

Label every check: `emulator` means the data path is right, and `เครื่องจริง` (real device) means the value is right. If a check needs a real device but has not run there, report "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

## Time and memory

| Step | Measured time | Set a separate timeout |
|---|---|---|
| First Gradle build (downloads NDK · platform) | ~10 minutes | 20 minutes |
| Later Gradle builds | 1–2 minutes | 5 minutes |
| Emulator boot | Several minutes (not timed) | Poll `adb shell getprop sys.boot_completed` = 1 |
| Open the app until the first screen shows | A few seconds | 20 seconds |
| Per check (waiting for a value on screen) | 3–4 seconds per read | 15–20 seconds |

- The emulator and Gradle use a lot of memory. Claude Code once closed a background emulator because memory ran out.
- Run one emulator only, and stop the Gradle daemon after the build (`gradlew --stop` in `android/`).
- If the emulator is closed midway, report "ยังไม่ได้รันซ้ำ" (not yet re-run) with the list of checks that did not run. Never retry silently and report only the later run.
- No Docker: an emulator in Docker needs KVM, which Docker Desktop on Windows does not have, so run it on the host.


## reference: app-verifier-setup.md

<!-- merged from skill `app-verifier-setup` on 2026-11-27 · description was: Use when no scripted way to run the app, or verify is stale -->
# app-verifier-setup — give the agent hands and eyes

**Output:** 2 things, a script that lives with the project's tests, and a skill that is only a short guide for agents.

```
<project>/
├─ <project-name>/test/e2e/verify.*         script that drives the real app and opens and closes it itself (in the code folder, see project-bootstrap)
│                                           the list of features and checks lives only in this file (the feature map)
├─ .claude/skills/verify-<project>/SKILL.md   how to run · how to read results · what not to do (at the root, where Claude Code looks)
└─ _to_delete/verify-runs/                  evidence from each run — the script finds paths from its own location, so it does not depend on the folder it runs from
```

(Codex · Gemini use `.agents/skills/` · `skills/` instead of `.claude/skills/`.) The Flutter Android example (`lumio-light-meter/test/e2e/verify.mjs`, Node driving `adb`) is summarized in [`android-native.md`](android-native.md).

**Keep the steps in the script only.** A separate `.md` list of steps disagrees with the script from the first round, so the skill points to the script.

---

## Steps

1. **Find the existing way to run the app** from the README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android). If one exists, use it and do not build a new one.
2. **Choose how to drive it by app type**

   | Type | Drive with | Read results from |
   |---|---|---|
   | Web | Playwright (if Chromium is already installed, never download it again) | Screenshot · DOM · console · network |
   | Electron · desktop | Playwright `_electron` or Chrome DevTools Protocol (CDP) · on Windows use pywinauto (the latest WinAppDriver release was probably in 2020 and it is not confirmed that Microsoft still maintains it (`รอยืนยัน`, awaiting confirmation)) | Screenshot · log |
   | Command line · TUI | Run the real command with fixed input | stdout · stderr · exit code · created files |
   | API · service | `curl` or the client the repo uses | Status · body · log · values in the test database |
   | Web-based mobile (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | Screenshot · DOM |
   | Native mobile · Flutter (Android) | A Node/Python script calling `adb` + `uiautomator dump` (the Lumio way) · or Flutter `integration_test` · or Maestro · Playwright cannot drive an APK | Image from `adb exec-out screencap -p` · text/Semantics labels from `uiautomator` · `dumpsys` · `logcat` |

   - If the project has `.sandbox/`, drive the browser in the container. The default is headless (no window). To let a person watch, turn on `up -Browser` (see [`infra-and-deploy`](../../infra-and-deploy/SKILL.md) step 5). An Android emulator cannot run in Docker on Windows (it needs KVM), so run the emulator on the host machine and say so in the report.
   - For a page with CAPTCHA, use the provider's test keys or turn it off in the test environment. Never write a script that solves CAPTCHAs.
   - For an app that reads hardware (sensor · camera · GPS), feed values known in advance, through the emulator (`adb emu sensor set light 420`, virtual camera) or a fake data source that can be turned on only in a debug build. Label every check `emulator` or `เครื่องจริง` (real device), because real sensor accuracy cannot be proven on an emulator. If it has not run on a real device, write "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

3. **Write `test/e2e/verify.*`** so it opens the app itself on a port that does not clash (mobile: install the APK and clear app data), seeds test data, and waits until ready **with a time limit** (web: if it is not up in 10 seconds, count it as failed · mobile: set separate times for build · emulator boot · app start · each check, see the reference). Always close the app at the end, and a second run must give the same result (`ground-rules/principle-build-a-tool-not-handwork`).
   - **For a web app or API that needs a server started first**, use [`scripts/with_server.py`](../scripts/with_server.py). It starts the server, waits for the port, runs the script, then shuts everything down. For example `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (start several servers by repeating `--server` and `--port` · logs go to `--log-dir`, default `_to_delete/with-server-logs`, created automatically if missing). For dynamic apps, wait for `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) or `data-ready="true"` before reading the DOM. Never guess with `sleep`.

4. **Keep the feature list as data in the script.** Go through the menu · routes · command list · SRS, and write 1 group per feature with 1 line per check (`what to do → what must be seen`). Cover at least 3 main features and 1 error case per feature. **Every check starts from a clean state**, can run alone or in a different order, and prints `PASS/FAIL` with expected and actual values.
5. **The script must never pass emptily** (pass without really checking anything). If a feature name does not exist, exit 1. If the app does not come up, exit 1. If no check ran, exit 1 (checking 0 items counts as broken, not as a pass).
   - **A check that verifies "stopped/released" must check the precondition first** (for example, the camera is held before pressing Home). Otherwise it passes emptily. Wait for the result by polling until a timeout, not with a guessed `sleep`.
   - **Make sure you read the latest screen**: delete the old result file before each new read, and tap only when the target position has been steady for 2 reads in a row. If the screen cannot be read because the app never stops redrawing, treat it as an app bug, not a script bug.
6. **Prove the script catches wrong behavior** by breaking the app in 1 place temporarily. Run it, it must `FAIL`, and then restore the change.
7. **Prove the skill works in practice** by sending a fresh `qa-tester` agent that has never seen the code. It uses only this skill to test 1 feature from opening the app to taking a screenshot of the result. Wherever it gets stuck, fix the skill at that point.
8. **Keep the evidence in `_to_delete/verify-runs/<time>/`**, both screenshots and test logs, apart from the code (it is temporary, the user can delete it after delivery, and the agent never deletes it).

## Testing contract

verify must depend on things the app provides, not guess from text or CSS: `data-testid` on every control and result · `<html data-ready>` flipping to `"true"` · a reset endpoint enabled only with `ALLOW_TEST_RESET=1` · a clock lock for date rules. Write the contract into the feature map and have the developer follow it from the first feature. Full table: [`testing-contract.md`](testing-contract.md).

## What the SKILL.md of the verify skill must contain

- A description saying to use it when you "must prove a feature works on the real app · reproduce a bug · check before shipping".
- Commands that start with `with_server.py` (if the app needs a server) and the rule to wait for `networkidle` or `data-ready` before reading the DOM.
- Start · stop commands · test data (which file holds the test accounts — **never put real passwords**).
- A link to the feature map.
- Prohibitions: do not touch the real database · do not call external APIs that cost money or send real messages.

**Hard rules (upkeep):** Never edit verify steps just to make them pass. If the app is broken, file a bug with `qa-docs`.
Never drop a feature from the map because it is hard to test. Prepare upkeep fixes as one commit or PR, and commit only when the user says so.

## References

- [`builtin-verify.md`](builtin-verify.md) — Claude Code ships with `/verify`: for a project running on Claude Code, create a skill named `verify` at `.claude/skills/verify/SKILL.md` in that format, instead of `verify-<project>`.
- [`upkeep.md`](upkeep.md) — open when the app has changed so much that the map no longer matches: re-check the verify skill and fix only what is proven (maintain the one file, no second `verify-<project>`).
- [`testing-contract.md`](testing-contract.md) — open at steps 4 and 5, when writing the feature map or telling the developer which hooks to add


## reference: auth-in-e2e.md

# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

Three ways to log in within a test suite, ordered from worst to best, with Playwright code examples

## Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## Better: API login (no UI)
```typescript
// page.request shares its cookie jar with the page's browser context,
// so the Set-Cookie from the login response is already in the browser — no addCookies needed.
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  expect(response.ok()).toBeTruthy();
}

// Or once for the whole run (global setup), saved for every test:
// const ctx = await request.newContext({ baseURL });
// await ctx.post('/api/login', { data: user });
// await ctx.storageState({ path: 'playwright/.auth/user.json' });
```

> **Security:** The saved state file holds a live session (cookies, tokens). Keep it out of git: add `playwright/.auth/` (or your `auth.json`) to `.gitignore`, and use a test account only.


## reference: builtin-verify.md

# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `ground-rules/simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `test-automation` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `test-automation` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- Upkeep (`upkeep.md`) maintains this one file only and does not create a nested `verify-<project>`


## reference: ci-and-parallel.md

# Parallelization and CI Integration

Parallelism levels, the end-to-end (E2E) run tiers in continuous integration (CI), and the files to keep when a test fails.

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | Low (just enable) |
| Test-level within file | 10x+ | Med (isolation needed) |
| Sharded across CI workers | Nx | Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | High (cost) |

**Requirements for safe parallel:**
- Tests don't share state
- Unique test data per test
- Database/external services support concurrency

**Agree on rules before running many agents or workers at once** (example from an online-shop test job where a reset wipes the data of the whole server, run with 6 agents at once):

| Rule | Prevents |
|---|---|
| Reset once before the combined run starts; no agent resets during the run (set a variable such as `PP_SKIP_RESET=1`), and each agent keeps its results in its own folder | deleting each other's data and result files |
| Tests that buy things use different products, and never one that another test is checking stock on | stock collisions |
| New-account emails include `{run}` (project name + run start time) | a second run getting "อีเมลนี้ถูกใช้แล้ว" ("this email is already used") (one plan had 30 tests that could not be re-run; 0 after the fix) |
| Tests that hit the rate limit use their own account and run last | counters carrying over across tests |
| Tests that use shared central state and cannot be separated → `workers: 1` · `fullyParallel: false` | randomly wrong results |

## CI Integration

### Run E2E tier
```yaml
# Smoke (every pull request (PR), 2 min)
- 5-10 critical tests
- Chromium only → feedback เร็ว
- Fail = block merge

# Full (merge to main + nightly, 30 min)
- All E2E tests
- Chromium (desktop) + WebKit (iPhone viewport)
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P1 + P2 tests (test-case-template scale: P1 = most important)
- Chromium + WebKit + Firefox (ครั้งเดียวก่อน release)
- Must pass before prod deploy
```

### Browser matrix

Do not run all 3 browsers every round → CI time grows ~3x and flaky tests grow with the number of browsers.

| Browser | Covers | When to run |
|---------|----------|-----------|
| Chromium | Chrome · Edge (most users) | every round |
| WebKit | every browser on iPhone/iPad (including Chrome on iOS) | merge to main · nightly · pre-prod |
| Firefox | small share | pre-prod only · can be dropped if the customer does not use it |

Adjust to real users → look at analytics first; if an enterprise customer mandates Firefox, move it up to the nightly round.

Set them up as projects in Playwright and pick with `--project`.

```ts
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

```bash
npx playwright test --project=chromium                          # PR
npx playwright test --project=chromium --project=webkit-mobile  # main · nightly
npx playwright test                                             # pre-prod (ครบ 3)
```

**Tests that should run across browsers** (tag `@cross-browser`) → places that often break differently per browser:
- date/time input
- file upload · clipboard
- date/number formatting with `Intl`
- CSS layout · scroll · sticky
- video/audio autoplay

Pure-logic tests → Chromium alone is enough.

> Playwright's WebKit is not 100% the real Safari → for work where customers use iPhone a lot, try on a real device once more before release.

### Artifacts to capture
- Screenshots on failure
- Video on failure
- Trace files (Playwright)
- Console logs
- Network logs


## reference: coverage-and-libraries.md

# Critical Path Coverage Matrix และ Library Quick Reference

An example user-journey coverage table, and a table comparing commonly used Playwright and Cypress commands

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✓ | P1 |
| Login → main task | ✓ | P1 |
| Add to cart → checkout → success | ✓ | P1 |
| Search → filter → result | ✓ | P2 |
| Settings → save | ✓ | P2 |
| Admin panel CRUD | ✓ | P2 |
| Password reset | ✓ | P3 |
| Profile edit | Sample | P3 |
```

Priority uses the `qa-docs` scale (P1 = most important, P3 = least), the same as the `@P1|@P2|@P3` test tags.

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


## reference: e2e-testing-patterns.md

<!-- merged from skill `e2e-testing-patterns` on 2026-11-27 · description was: Use when writing end-to-end tests or fixing flaky ones -->
> **In SuperUser:** to have an agent run the app and prove the result itself, use [`app-verifier-setup.md`](app-verifier-setup.md). This skill holds the design principles for the E2E (end-to-end) test suite that verifier calls.

# End-to-End Testing Patterns

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to use](#when-not-to-use)
- [Read more when](#read-more-when)
- [The Testing Pyramid (Get This Right First)](#the-testing-pyramid-get-this-right-first)
- [Framework Selection](#framework-selection)
- [Test Structure: Page Object Model (POM)](#test-structure-page-object-model-pom)
- [Selectors: Hierarchy of Goodness](#selectors-hierarchy-of-goodness)
- [Test Data Strategy](#test-data-strategy)
- [What to Test E2E (Not Everything!)](#what-to-test-e2e-not-everything)
- [Expected Values and Failing Tests](#expected-values-and-failing-tests)
- [Fighting Flaky Tests](#fighting-flaky-tests)
- [Authentication in E2E](#authentication-in-e2e)
- [Parallelization and CI](#parallelization-and-ci)
- [Anti-patterns](#anti-patterns)
- [Quality Targets (from qa-tester agent)](#quality-targets-from-qa-tester-agent)

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a continuous integration and continuous delivery (CI/CD) pipeline
- Migrating from one framework to another

## When NOT to use

| Task | Use instead |
|---|---|
| Writing manual test cases (steps, expected result) | `qa-docs` |
| Unit or integration tests, test ratio and scope | `testing-standards.md` |

## Read more when

| File | Open when |
|---|---|
| [references/page-object-model.md](page-object-model.md) | You are setting up a new suite structure, or you find tests that copy the same login steps. It shows code comparing the bad way with the Page Object way. |
| [references/test-data-strategies.md](test-data-strategies.md) | You are choosing how to prepare test data and want the pros and cons of all 4 options with sample code. |
| [references/flaky-tests.md](flaky-tests.md) | Tests pass sometimes and fail sometimes. It shows code comparing a sleep wait with an event-based wait. |
| [references/auth-in-e2e.md](auth-in-e2e.md) | You are planning how to log in within the suite and need the `storageState` code or cookie injection through the API. |
| [references/ci-and-parallel.md](ci-and-parallel.md) | You are setting up parallel runs or splitting E2E run rounds in CI, and need to know which files to keep when a test fails. |
| [references/coverage-and-libraries.md](coverage-and-libraries.md) | You are building the user-path coverage table, or translating commands between Playwright and Cypress. |
| [references/oracle-and-mutation.md](oracle-and-mutation.md) | You have an old system to compare against (differential) · you will compare page structure with the accessibility tree · you want to know whether the suite really catches bugs (mutation) · or you must record and replay network requests to keep them stable. |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: ~5% of tests (same pyramid as testing-standards)
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: ~20%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: ~75%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** (default recommendation: best developer experience, fast, cross-browser) | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

## Test Structure: Page Object Model (POM)

If every test repeats the same `page.fill` and `page.click` calls for one page, move those steps into that page's class and have the tests call its methods instead. Comparison code is in [references/page-object-model.md](page-object-model.md)

> **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

Good:   Role + accessible name   page.getByRole('button', { name: 'Submit' })
Good:   Test IDs                page.getByTestId('submit-btn')
Medium: Visible text            page.getByText('Submit')
Medium: Label                   page.getByLabel('Email')
Bad:    CSS classes             page.locator('.btn-primary')
Bad:    Tag + index             page.locator('button:nth-child(3)')
Bad:    XPath                   page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

There are 4 options: shared test DB · per-test setup · API setup with UI verification · database snapshot with rollback.
The recommended one is **Option 3: API setup, UI verification (best)**. Prepare data through the API so it is fast and certain, then test the real UI. A shared test DB makes tests depend on order, makes parallel runs hard and mixes data. The pros and cons of every option are in [references/test-data-strategies.md](test-data-strategies.md)

## What to Test E2E (Not Everything!)

### DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

Make a Critical Path Coverage Matrix that says whether each path is covered yet and how important it is: P1, P2 or P3 (the same scale as `qa-docs` and the tags below · P1 is most important). An example is in [references/coverage-and-libraries.md](coverage-and-libraries.md)

## Expected Values and Failing Tests

For an E2E suite converted from a test plan (`qa-docs`):

- Start each test name with the TC code · tag `@<module>` `@P1|@P2|@P3` · put the expected result and the oracle in an annotation
  `test.info().annotations.push({ type: 'expected', description: '฿760 · [D] BR-03' })`
- Expected values are constants from the plan · never read a value from the screen and assert it back, for example reading the price from the card and comparing it with the total → if both are wrong, the test still passes
- Reset data before every TC (API reset or seed) · lock "today" with `page.clock.setFixedTime()` · `timezoneId` · `locale` in the config
- A TC with **Check when** `หลังรีโหลด` (after reload) → call `page.reload()` and assert again
- Run every browser the plan names · judge pass criteria per browser separately
- When a test fails → never edit the expected value · classify it as `app` / `plan` / `test` per the `qa-tester` agent into `triage.json` · in CI, never retry until green and call it done

## Fighting Flaky Tests

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |
| Click times out "not visible/stable" but the site works | The tab may be in the background (`document.visibilityState === "hidden"`, common with Playwright MCP sharing one browser). Check with `browser_evaluate`, switch to the tab, then click. Do not retry blindly |

Never use `page.waitForTimeout` for a fixed-time wait. Wait for a real event instead, such as the API response. Comparison code is in [references/flaky-tests.md](flaky-tests.md)

### Retry strategy
- **In CI:** retry at most 1 time, **only to collect a trace** (`retries: 1` + `trace: 'on-first-retry'`)
- **Pass on retry = flaky, not a pass** — report it as flaky and fail the run (`failOnFlakyTests: true` in `playwright.config.ts`, Playwright 1.52+) — the same rule as "Expected Values and Failing Tests" above and `testing-standards.md` (flaky test: fix or delete, never retry until green)
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Quarantine has an expiry date**: tag the test `@flaky` with an issue link and a date (`test('checkout total @flaky', { annotation: { type: 'quarantine', description: 'until 2026-11-15 · issue #123' } }, ...)`), run the `@flaky` set as a separate non-blocking job so the signal is not lost, and have CI fail when today is past the date — the test is then fixed or deleted, never extended twice
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

Do not log in through the UI in every test, because it is slow, brittle and repeats code. Log in once and share the state (`storageState`), or better, log in through the API and inject the cookie into the browser context. Code for all three ways is in [references/auth-in-e2e.md](auth-in-e2e.md)

## Parallelization and CI

The requirements for safe parallel runs are in [references/ci-and-parallel.md](ci-and-parallel.md)

Split E2E in CI into 3 rounds. First, smoke on every pull request (PR) on Chromium only; a failure blocks the merge. Second, full on merge into main and every night, on Chromium + WebKit (iPhone screen). Third, pre-prod before deploy, which must pass P1 and P2 on all 3 browsers (adding Firefox). When a test fails, always keep the screenshot · video · trace · console log · network log. The parallel level, the browser table for each round and the details of each round are in [references/ci-and-parallel.md](ci-and-parallel.md)

## Anti-patterns

- **Testing implementation details** — selectors based on internal structure
- **Long monolithic tests** — one test with 50 steps is hard to debug
- **Coupled tests** — Test B depends on Test A having run
- **Hidden state** — tests behave differently depending on order or data
- **Manual cleanup** — relying on people to reset the environment
- **No quarantine** — failing tests get merged anyway because "it's flaky"
- **Mocking everything** — at this layer, use the real integrations, or it's not E2E
- **Expected value read from the page** — the bug becomes the expectation

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

The table comparing common Playwright and Cypress commands (Library Quick Reference) is in [references/coverage-and-libraries.md](coverage-and-libraries.md)


## reference: flaky-tests.md

# Fighting Flaky Tests — examples of waiting the right way

Code comparing a fixed-time wait with an event-based wait. The cause table and the retry strategy are in `SKILL.md`.

## Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```


## reference: load-testing.md

<!-- merged from skill `load-testing` on 2026-11-27 · description was: Use when checking how many users a system holds -->
# load-testing — load tests with a goal, a pass threshold and permission

## Contents

- [Use when](#use-when)
- [Related skills](#related-skills)
- [1 · Goal and pass threshold — write before opening the tool](#1--goal-and-pass-threshold--write-before-opening-the-tool)
- [2 · Permission gate — before every run beyond smoke and every run on production](#2--permission-gate--before-every-run-beyond-smoke-and-every-run-on-production)
- [3 · Choose the tool](#3--choose-the-tool)
- [4 · Test types and the script](#4--test-types-and-the-script)
- [5 · Reading the result](#5--reading-the-result)
- [6 · Run together with monitoring](#6--run-together-with-monitoring)
- [7 · Plug into CI](#7--plug-into-ci)
- [Check before sending](#check-before-sending)
- [References](#references)

Sample script [`assets/load-test.js`](../assets/load-test.js) · sample workflow [`assets/k6-smoke.yml`](../assets/k6-smoke.yml) · tool facts checked 2026-10-28, links in [`sources`](sources.md)

> **One rule:** no pass threshold written before the run = no test result, only a graph · and never load a system that is not ours, or production, without a named person's written approval.

## Use when

- Before launching a system or before a campaign that brings many people at once (sale · registration opening · results announcement)
- Someone asks "ระบบรับได้กี่คน" · "ตอนคนเยอะจะช้าไหม" · "เพิ่มเครื่องแล้วดีขึ้นจริงไหม" (how many users can it hold · will it be slow when busy · did adding machines really help)
- A postmortem says the incident happened because load was never tested (`incidents-and-monitoring` → `references/postmortem-template.md` section 5)
- Setting up a speed smoke test in CI that fails when slower than the threshold
- The user says load test · stress test · spike · soak · k6 · Locust · JMeter · p95 · ยิงโหลด · ทดสอบประสิทธิภาพ

Do not use when: one web page loads slowly in the browser (Lighthouse · Core Web Vitals) → [`web-audit`](../../web-audit/SKILL.md) · the live system is slow right now and you must find where → [`incidents-and-monitoring`](../../incidents-and-monitoring/SKILL.md) first · testing that a button click gives the right result → [`e2e-testing-patterns.md`](e2e-testing-patterns.md)

## Related skills

- `incidents-and-monitoring`: open the system's dashboards next to the k6 results (section 6).
- `cicd-and-release`: section 7 says what runs on every PR and what runs on a schedule.
- `qa-docs`: for a whole-release test plan, put the load test in as one row, with the thresholds from section 1.
- `infra-and-deploy`: if you must add machines or autoscale after the run, run again with the same script and compare with the result before.
- `pdpa-compliance`: if test data contains names or phone numbers, use fake data. Do not pull real customer data in to load the system.

## 1 · Goal and pass threshold — write before opening the tool

Get answers to 4 questions, then note them at the top of the script file or the test plan:

| Item | Example answer | If there is no answer |
|---|---|---|
| Expected volume | Peak hour 50 requests per second on path `/api/orders` | Pull it from the live system's logs or metrics · for a new system, use the owner's estimate and tag it `(รอยืนยัน)` (awaiting confirmation) |
| Paths to load | Browse products 70% · add to cart 20% · pay 10% | Load the 1–3 paths that earn the most money or cost the most first |
| Speed threshold | The `p(95)` of response time is at most how many milliseconds | Default 500 ms for an API. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) · adjust once there is a baseline result |
| Error threshold | `http_req_failed` below what percent | Default 1%. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) |

- Measure with percentiles, not averages: an average hides the minority who wait a long time.
- Turn every threshold into `thresholds` in the script (section 4). Do not keep them in the head of whoever reads the result.
- If there is no volume figure at all, you can run smoke and baseline, but you must not conclude "it can handle it", because you do not know what it is handling it against.

## 2 · Permission gate — before every run beyond smoke and every run on production

Loading a system without permission can really bring it down and may be illegal. So stop here and wait for approval. Do not skip it even if the user is in a hurry.

1. **Whose system is it?** · If it belongs to someone else (a partner's API · payment gateway · external SaaS · a competitor's site) → do not load it · use a mock, or a sandbox the provider opens for load testing, and read their terms first.
2. **Environment** · Run on staging or a separate load-test environment · the k6 docs say a QA environment with machines unequal to production cannot be used to judge load capacity, only for smoke.
3. **Production** · Needs a named approver, a time window, a peak volume, and a watcher who can stop at once · start with a low-volume smoke (the k6 docs treat it as a low-risk practice) · never create real orders, payments, emails or SMS.
4. **Anything that causes side effects when hit** · Take payment and message-sending webhooks off the path, or point them at a mock · for an external provider that charges per call, set a spending cap first.
5. **Record** in the script header or plan: system · environment · peak volume · time window · approver · way to stop

The sample script enforces this gate in code: if `BASE_URL` or `TARGET_ENV` is missing, the script stops · if the type is not smoke, or `TARGET_ENV=production` (smoke included), and `APPROVED_BY` is missing, the script stops too.

## 3 · Choose the tool

| If | Use | Reason |
|---|---|---|
| Starting fresh · HTTP API or web · want the pass threshold to fail CI directly | **k6** (default) | Written in JavaScript · `thresholds` in the script · exits with a non-0 code when a threshold fails · AGPL-3.0 licence |
| Team prefers Python · needs complex step sequences or its own protocol | **Locust** | Test scenarios are plain Python code · can be spread over several machines · runs headless in CI · MIT licence |
| The organisation already has a `.jmx` plan · must load JDBC · JMS · LDAP · FTP · SOAP | **JMeter** | Wide protocol support · has a GUI to record plans · use CLI mode (headless) for real runs |

- Versions seen on 2026-10-28: k6 v2.3.0 (2026-09-21), and the 1.x line still gets a security patch v1.8.2 (2026-10-12) · pin the version in CI, do not use `latest` · `setup-k6-action` without `k6-version` always gets the latest ([README](https://github.com/grafana/setup-k6-action) checked 2026-10-28)
- Grafana Cloud k6 (runs from the cloud · stores results): price and quota `(ยังไม่ได้ตรวจ)` (not yet checked) · start with k6 on a machine or a CI runner, which is free
- The machine that sends the load must not be the same machine as the system under load, or they fight over CPU and the result is skewed.

## 4 · Test types and the script

Order per the k6 docs: **smoke always first** → average-load → other types by risk · use a plain load shape (ramp up · hold · ramp down). Do not run load that goes up and down several times, because the cause is hard to find.

| Type | What it asks | Virtual users (VU) and time, per the k6 docs | When |
|---|---|---|---|
| smoke | Is the script right? Does the system answer when few people use it? | Few · seconds to a few minutes | Before every other type · every PR in CI |
| load (average-load) | Does normal volume pass the threshold? | Equal to production average · 5–60 minutes | Before releasing a version · as the baseline |
| stress | What happens above normal? | Above average · 5–60 minutes | Systems at risk in heavy-use periods |
| spike | Does it survive a sudden rush? | Very high · a few minutes | Before a campaign · flash sale |
| soak | After long use, does memory leak or do connections hang? | Average · several hours | Systems that stay up for long periods |
| breakpoint | Where is the ceiling? | Ramp up until it breaks | Run only a few times, always needs approval per section 2 · the sample script has no such type, write the stages yourself |

The script [`assets/load-test.js`](../assets/load-test.js) picks the type with `TEST_TYPE`. Every type uses the `ramping-arrival-rate` executor (it fixes the number of iterations per unit of time, so when the system slows down it still gets hit at the same rate, and you see the real symptoms) · the core is thresholds:

```javascript
thresholds: {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
  http_req_duration: ['p(95)<500'],              // default, not measured
  'http_req_duration{type:API}': ['p(95)<500'],  // separate threshold by tag
},
```

- `abortOnFail` stops the run when a threshold fails midway, instead of pounding the system to the end · `delayAbortEval` waits to collect samples before judging
- Every number in the script (rate · VU · stages) is a **default, not measured** value. Adjust per section 1.
- Run: `k6 run -e TEST_TYPE=smoke -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com assets/load-test.js > _to_delete/k6.log 2>&1; tail -40 _to_delete/k6.log` (k6 prints a long progress log for as long as the run lasts, so read only the closing summary)

## 5 · Reading the result

Details and worked examples are in [`reading-results`](reading-results.md) · in short:

1. Look at the thresholds lines at the end of the report first (pass/fail), then the exit code: 0 = every threshold passed · a failed threshold usually gives 99
2. Look at `http_req_failed` before `http_req_duration`. If errors spike, the response times you see may be fast only because errors answer fast.
3. Look at the load-sending machine. CPU at full or too few VU = the result shows the limit of the load generator, not the system.
4. Compare with the previous baseline using the same script, same data, same environment · change one thing at a time
5. The report says "which threshold passed or failed, at what volume", not "the system holds 10,000 people", unless you really ran that.

For a multi-stage system (for example listen to audio → chat → speak): load each stage alone first, then the whole path · the bottleneck differs per stage (an example from a teaching job, not a threshold: chat holds 4 · listening holds 32 · speaking holds 2) · whole-system speed equals the weakest stage · a queue does not make it faster, it keeps it from breaking (the extra people get slower answers instead of errors) · set the consumer's prefetch equal to the number of jobs the backend can really do at once (`async-messaging` → `references/rabbitmq-messaging.md` section 4) · if the backend dies mid-run, add a watchdog per section 8 of `async-messaging`

## 6 · Run together with monitoring

The k6 result says it is slow, but not why · during the run, open the dashboards per `incidents-and-monitoring` → `references/observability-basics.md` section 2 (latency · traffic · errors · saturation) for the server, database and queue · note the start and end time of the run so you can match the graphs · common bottlenecks: database connection pool · queries without an index · connections not returned (example in `incidents-and-monitoring` → `references/postmortem-template.md` section 5)

## 7 · Plug into CI

| Run when | Type | Where |
|---|---|---|
| Every PR or every push | smoke · a few minutes | staging or the PR's environment |
| Overnight or on a schedule | load · stress · spike | a separate load-test environment |
| Before a major release | the full set chosen in section 4 · run at least 2 rounds | an environment equal to production |

- The k6 docs warn that load tests take 3–15 minutes or more, so do not put them on the path that deploys automatically, and do not trust pass/fail alone until the process is stable.
- GitHub Actions: `grafana/setup-k6-action@v1.2.2` (set `k6-version`) installs k6, then `grafana/run-k6-action@v1.5.0` runs it (pinned versions, checked 2026-10-28) · full example in [`assets/k6-smoke.yml`](../assets/k6-smoke.yml) · Jenkins or other CI call `k6 run` directly
- Do not wrap `k6 run` in a script that swallows the exit code (for example one with a trailing `echo`) · make `k6 run` the last command, or keep `$?` and `exit` with that value
- `BASE_URL` and tokens come from CI secret variables (`web-service-essentials`), not written into the script

## Check before sending

1. Expected volume, paths, and the p95 and error-rate thresholds exist before the run · guessed values carry the label "ค่าตั้งต้น ยังไม่ได้วัด" (default, not measured)
2. The system is ours · the environment is stated clearly · beyond smoke there is a named approver · production has a watcher and a way to stop
3. No real money, email, SMS or order came from the run
4. Thresholds are in `thresholds` · `abortOnFail` is set on the error rate
5. smoke passed before other types · the load generator is not the same machine as the system
6. The report states results against thresholds and the baseline at the volume really run, and does not conclude beyond what was run
7. CI does not swallow the exit code · secrets come from secret variables · the k6 version is pinned

## References

- [`reading-results.md`](reading-results.md) — open to read a k6 result (section 5)
- [`mcp-k6.md`](mcp-k6.md) — open when using the k6 MCP server
- [`worked-example.md`](worked-example.md) — open for a flash-sale example run through sections 1 to 7
- [`sources.md`](sources.md) — links and check date 2026-10-28 for every tool fact


## reference: mcp-k6.md

# k6 MCP (grafana/mcp-k6)

Extension of `test-automation` · checked 2026-10-28 from https://github.com/grafana/mcp-k6 and https://api.github.com/repos/grafana/mcp-k6/releases · not embedded in the plugin; the user installs it if wanted

## Status

| Topic | What was seen |
|---|---|
| Maintainer | Grafana (repo `grafana/mcp-k6`) |
| Status | The README says it is still experimental |
| Latest version | v0.7.0 on 2026-10-05 |
| License | The repo page is inconsistent: the sidebar says AGPL-3.0 but the README says MIT · open the LICENSE file before using it in customer work |
| Tools | `validate_script` (runs 1 VU for 1 round) · `run_script` (real run, up to 5 minutes) · `list_sections` · `get_documentation` |

## Cautions

- `run_script` sends real requests to the targets in the script · `validate_script` also sends 1 round · the permission gate in `test-automation` → `references/load-testing.md` section 2 applies to calls through MCP too, with no exceptions
- Start with only `get_documentation` and `validate_script` pointed at staging · have the agent call `run_script` only when the user allows it in that round
- HTTP mode has no built-in authentication; use it only in a trusted network · stdio on your own machine is better

## Install (the user does it, pin the version)

Claude Code via Docker (command form per the README):

```bash
claude mcp add --scope=user --transport=stdio k6 -- docker run --rm -i grafana/mcp-k6:<tag ของ v0.7.0>
```

The Docker Hub image tag that matches v0.7.0 `(ยังไม่ได้ตรวจ)` (not yet checked) · the README uses `latest`, but open the tag page and put in a pinnable version instead · other ways: Homebrew (`brew tap grafana/grafana` then `brew install mcp-k6`) or the `.deb` `.rpm` packages from the v0.7.0 release page · running natively also needs k6 on PATH

The k6 docs still mention the command `k6 x mcp`, which pulls the latest version automatically · to pin a version, use the standalone `mcp-k6` as above (from search results citing https://grafana.com/docs/k6/v2.3.x/set-up/configure-ai-assistant/; that page was not opened directly)


## reference: oracle-and-mutation.md

# Oracle, structure comparison and mutation — use when an existing system is available to compare against

Source: lessons from a 6-chapter web-clone course (Week 03 of Teaching_CWN2026), measured on 5 app versions · the numbers are results of that job, used as examples, not as criteria · content specific to the cloned website (flight data, container ports) is not carried over.

## 1 · Use the existing system as the answer key (differential testing)

Run the same scenario on the existing system and on our app, then compare the results field by field, instead of writing expected values by hand.

- The result passes only if every compared field matches (example: count + price + name + time, position by position).
- Fetch expected values from the existing system at run time; do not hard-code numbers in the comparison code, except parameters that come from the task.
- For a scenario the existing system cannot answer itself, an **inferred answer key** (computed by yourself) may be used, but first prove the method on cases that have a real answer key · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker (real round: S2 passed even though it had 10 tickets).
- Report a difference as position, row, field, not just "failed" · in the real round, 4 scenarios had one cause, fixed in one place (310 lines of data, 7 lines of code), going from 4/8 → 8/8.
- Remove what is meant to differ before comparing (banners, brand names, links to other domains, mock-data labels).

### If you must record and replay (record-replay), keep the existing system stable

| Trap | Do |
|---|---|
| The URL does not match the recorded one character for character (`+` vs `%20`) | `routeFromHAR` matches URL + method + body exactly · you need your own route for the cases that do not match |
| Random values in the URL or body | match POST by body and pick stable keys |
| Results differ every round | freeze the clock (`context.clock.setFixedTime`) · turn off telemetry · cut the network with a last-layer abort |
| Counting rows while the filter box is still open | wait for the count to settle before counting |
| Route order | Playwright tries the one registered later first |
| No recording file | never open the real live site instead; stability is lost |

- Check that it is really stable by running 3 rounds and getting the same result.
- Limit: it can answer only what was recorded; for full coverage, record every scenario first.
- The recording file contains cookies and tokens: do not commit it and do not take it off the machine.

## 2 · Compare page structure with the accessibility tree (`ariaSnapshot`)

Pixel comparison is brittle and can mislead (matching white backgrounds). Structure comparison tells you "what is missing" as a list.

1. Capture the page in the same state.
2. Remove what is meant to differ before comparing (banners, links to other domains, brand names, mock-data labels).
3. Normalize names: strip symbols, turn numbers into `#`.
4. Make `role | name` tokens (button, combobox, textbox can count as one control kind).
5. Compute the Jaccard score of the tokens (intersection ÷ union).
6. Check a list of key elements chosen from the existing system (38 items in the real round) · the existing system must pass all of them first, otherwise the list itself is wrong.
7. Total score = average of the two · give the result as a list of what is still missing.

Caution: Thai has no spaces, so splitting by whitespace fails; use `Intl.Segmenter('th')` · half of the score depends on the list you chose yourself.

## 3 · Mutation testing — examine the test suite with deliberate bugs

Plant bugs one at a time in an app that already passes, then see whether the test suite catches them.

**Count "caught" as pass → fail against the baseline, not "at least 1 failure".** If the baseline already has a red test, the latter criterion passes automatically (real round: raw score 10/10 for both suites, but the strict criterion gave acceptance 8/10 and differential 4/10 · the survivors survived because the related test was already red) · make the baseline green first, then the score can be read.

Steps:

1. Copy the base code to `mutants/base` · write `manifest.json` holding the before and after text of every bug (file + line) · change 1 spot per bug, never combined.
2. Run the baseline first and record the set of failing tests.
3. Per bug: create a compose project with a separate name → wait for the health endpoint (loop with a limited count) → run every test suite → always `down -v --remove-orphans` in `finally`.
4. Do not edit tests to point at a new target; wrap them: load `endpoint.cjs` with `node --require` to change only the baseURL · or write an extra runner that calls the same scenarios.
5. Compute both the raw criterion and the pass → fail criterion · record the additionally failing tests one by one.
6. Check the SHA-256 of the test files before and after · generate the report from a script, not by hand.
7. Tell the user the duration in advance (real round: 11 rounds × 2 suites took 46 minutes because Docker is built every round).

Bugs worth having: reversed sorting · turning off filters one at a time · result count short by 1 · load-more ending at 299 · `<` instead of `≤` · time shifted by 1 hour · wrong code.

Observations:
- The surviving bug was `<` instead of `≤`, because the boundary value was not in the test data; a dedicated boundary-value test is needed.
- Different kinds of suites catch different groups of bugs (acceptance catches several data bugs that differential cannot newly catch, while differential tells the wrong row and field) · use them together.
- 80% and 40% are lower bounds; they do not mean that a bug with no newly failing test certainly slipped through.
- The real round has not yet re-run mutation against the version where differential is green, and had only 10 bugs.

## 4 · Reusable runner

- 1 test per item · a fresh context for every test · no retry · no lowering of criteria · never edit a test.
- Keep it inside the scope: a route cancels navigate requests across origins.
- Locators must be specific: in the real round, a test that passed because it saw only 10 rows broke at once when the data was complete and it found 2 rows.
- Set an evidence-mode switch (e.g. `EVIDENCE=1`): normally run fast with many workers and no video; evidence mode lowers workers, raises timeouts and records video.
- A neutral element finder (control/choice) that supports both `select` and a tap menu lets one test suite run against two apps written differently · the projects differ only in `baseURL`.
- A test must not add things it does not delete (creating a new booking on every run = not idempotent).
- A popup that blocks a click needs a step that closes the popup first · look at the screenshot and snapshot of the failed test, not only the error text (real round: "cannot click the button" was really a popup blocking; root cause: a re-render removed the Escape key listener).
- Measuring an empty page and waiting for the timeout at every step took 24 minutes; it should fail fast.


## reference: page-object-model.md

# Page Object Model (POM) — ตัวอย่างโค้ด

An example comparing a test with no abstraction and a test that uses a Page Object · use it when setting up a test suite or reviewing tests that copy the same steps

## Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

## Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> **One Page Object per page or major component.**


## reference: per-stack.md

# Setup and examples per stack

> The examples in this file are **not yet run or tested** (except the Flutter section, which comes from a real app, Lumio). The rest is the standard setup of each framework.
> On the first run, check whether the commands and paths match the real project layout.

---

## Contents

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [Comparison table](#comparison-table)

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package AwesomeAssertions     # assertions that read like sentences (.Should()) · use instead of FluentAssertions since v8, which needs a paid Xceed license for commercial use · AwesomeAssertions is free, Apache-2.0, checked 22 Oct 2026 (B.E. 2569) on nuget.org
dotnet add tests/MyApp.Tests package NSubstitute           # mocks with shorter syntax than Moq
dotnet add tests/MyApp.Tests package Microsoft.AspNetCore.Mvc.Testing   # integration
dotnet add tests/MyApp.Tests package Testcontainers.PostgreSql
```

```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void CalculateDiscount_WhenMemberIsGold_Returns15Percent()
    {
        // Arrange
        var sut = new DiscountCalculator();

        // Act
        var result = sut.Calculate(new Order { Total = 1000m }, MemberTier.Gold);

        // Assert
        result.Should().Be(150m);
    }

    // Theory = test many cases with one body of code — never write the loop yourself
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration through `WebApplicationFactory` — sends real HTTP into the real pipeline without opening a port:

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetOrders_WhenNotAuthenticated_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/v1/orders");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

```bash
dotnet test                                        # everything
dotnet test --filter "FullyQualifiedName!~Integration"   # unit tests only
dotnet test --collect:"XPlat Code Coverage"
```

---

## Node / TypeScript — Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // the setup file sets fake timers / clears mocks the same way for every file
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.dto.ts', 'src/**/index.ts'],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountCalculator } from '../src/discount';

describe('DiscountCalculator', () => {
  beforeEach(() => vi.restoreAllMocks());   // stop state leaking across tests

  it('gives gold members a 15 percent discount', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('gives the right discount for tier %s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

Control time instead of using `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // advance 5 seconds at once
vi.useRealTimers();
```

```json
{ "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
} }
```

> **Jest instead of Vitest:** The API is almost the same (`jest.fn` ↔ `vi.fn`), but you must set up `ts-jest`
> or babel for TypeScript. Choose Jest when the team already knows it or you need one of its presets.

---

## Python — pytest

```bash
pip install pytest pytest-cov pytest-randomly
```

`pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q --strict-markers --cov=src --cov-report=term-missing"
markers = ["integration: needs DB/network — run separately from unit"]
```

```python
import pytest
from src.discount import calculate_discount

def test_calculate_discount_when_member_is_gold_returns_15_percent():
    assert calculate_discount(total=1000, tier="gold") == 150

@pytest.mark.parametrize("tier,expected", [("none", 0), ("silver", 50), ("gold", 150)])
def test_calculate_discount_by_tier(tier, expected):
    assert calculate_discount(total=1000, tier=tier) == expected

@pytest.mark.integration
def test_create_order_persists_to_db(db_session):
    ...
```

`conftest.py` — shared fixtures (restore the original state after every test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # every test always starts from a clean database
    conn.close()
```

```bash
pytest                        # everything (pytest-randomly shuffles the order itself = catches tests that depend on each other)
pytest -m "not integration"   # unit tests only
pytest --lf                   # only the ones that failed last time
```

---

## Angular

**Vitest that ships with the Angular CLI** (new projects — the builder `@angular/build:unit-test` is already configured, run `ng test` with no extra plugin · Karma still works · checked 22 Oct 2026 (B.E. 2569) on angular.dev/guide/testing) · add Testing Library if you want queries the way a real user finds things

```bash
ng test
npm i -D @testing-library/angular @testing-library/user-event
```

For older Angular projects (without this builder) → migrate from Karma following angular.dev/guide/testing/migrating-to-vitest, or use `@analogjs/vite-plugin-angular` with `vitest` and `jsdom`

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('shows a required error when the name is empty on submit', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> Test from the **user's point of view** — find a button by the text people see (`getByRole`, `getByText`),
> not `By.css('.btn-primary')`, because once the CSS class changes the test turns red even though the UI still works correctly.

**Jasmine + Karma** (Angular's old default — keep using it if the project already has it):

```ts
describe('DiscountService', () => {
  let service: DiscountService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DiscountService] });
    service = TestBed.inject(DiscountService);
  });

  it('calculate_whenMemberIsGold_returns15Percent', () => {
    expect(service.calculate(1000, 'gold')).toBe(150);
  });
});
```

```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # for CI
```

---

## Flutter / Dart — flutter_test

It ships with the SDK, so there is nothing to install. Test files live in `test/` and mirror the structure of `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`). File names use snake_case, the Dart convention.

```dart
// fake of the bridge to the native side: you can implement the real class directly, with no new interface
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...the remaining overrides return the values the test chooses (has a sensor or not · camera permission)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // the default test screen is 800×600 — set it to a phone size, or the button sits off-screen and the tap misses
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // do not use pumpAndSettle when a Timer is looping

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // close the Timer inside the test itself, or it fails with "A Timer is still pending"
    });
  });
}
```

| Topic | Do this |
|---|---|
| Test layers | unit (`test`) is for pure logic, while widget (`testWidgets`) is for screens and is the main middle layer. For on-device E2E, use `integration_test` (`flutter test integration_test/`) or an `adb` script per `app-verifier-setup.md` |
| platform channel | fake it with a class that `implements` the real bridge class, and add `mocktail` only when the hand-written fake grows long |
| `pumpAndSettle` | Fine when the screen really settles. If a Timer or animation loops forever, the screen never settles until it times out, so use `pump(duration)` instead |
| Pending Timer | Dispose the controller that holds a Timer inside the test itself before the last line, because a Timer still running at the end makes the test fail |
| Small screen | Add 1 separate test set at 360×800 dp with Thai text + a large `textScaler` to catch overflow (Flutter reports overflow as an exception in tests) |
| SnackBar covers a button | A widget test catches it by tapping the lower button after the SnackBar appears, then asserting **the result of the tap** (a `tester.tap` that hits something covering it only prints a warning and does not fail) |
| golden test | Optional, because images differ by machine and font. Use it when the team has a fixed CI machine. |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| Prove the test is useful | Break the code in 1 place, run it, and it must go red, then fix it back |

```bash
flutter test                              # everything
flutter test test/features/measure        # one folder
flutter test --coverage
flutter test integration_test/            # needs an emulator or a real device connected
```

---

## Comparison table

| Topic | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| Many cases | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | a `for` loop that creates `test(...)` inside a `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | an `implements` class · `mocktail` |
| Before/after each test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| Control time | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| Real DB | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| Shuffle order | Not built in | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |

## Framework options to offer (moved from SKILL.md)

| Stack | Options to offer |
|---|---|
| .NET | **xUnit** (recommended · the standard of modern .NET) · NUnit (a team coming from NUnit) · MSTest (organizations tied to VS) |
| Node/TS | **Vitest** (recommended · fast, little setup, ESM/TS work out of the box) · Jest (largest ecosystem) · `node:test` (when you want to install nothing) |
| Python | **pytest** (recommended) · `unittest` (pure stdlib; no extra packages allowed) |
| Angular | **Vitest that ships with Angular CLI** (`ng test` · recommended · default for new projects) + Testing Library if wanted · Jasmine + Karma (the old default, still usable) · very old versions use Analog |
| Flutter · Dart | **`flutter_test`** (ships with the SDK, no need to ask) · fake with a class that `implements` the real one, before installing `mocktail` |


## reference: reading-results.md

# Reading k6 results and writing the report

Extension of `test-automation` → `references/load-testing.md` section 5 · k6 facts checked 2026-10-28 from the pages linked at the end of the file · the interpretation is general practice, not yet tested against a real system this round

## 1 · Read in this order

| Order | What to look at | Interpretation |
|---|---|---|
| 1 | exit code | 0 = every threshold passed · not 0 = failed · a failed threshold usually gives 99 |
| 2 | the thresholds line at the end of the report | which thresholds passed, which failed, and the actual values |
| 3 | `http_req_failed` | if errors spike → a fast response time may only be because errors return fast, so do not celebrate the p95 yet |
| 4 | `http_req_duration` p95 and p99 | the range most users experience, and the tail a few users wait through · the average cannot be used to decide |
| 5 | `checks` | whether the answers are correct, not just a status 200 |
| 6 | warnings about not enough VUs, or rounds that did not start | the load generator could not keep up with the set rate; this run shows the limit of the generator, not the system (metric name of the dropped rounds `(ยังไม่ได้ตรวจ)` — not yet checked) |

## 2 · Find where it jams

Look at the system graphs for the same period as the run (`incidents-and-monitoring` → `references/observability-basics.md` section 2):

| Symptom in the graph | Suspect first |
|---|---|
| App CPU full, response time grows with it | Heavy code or too few machines · try adding machines and run again |
| App CPU idle, but response time grows | Waiting on something outside: database connection pool · table locks · an external API |
| Errors start at a certain load and then spike | Hit a ceiling (pool · open files · rate limit) · find the setting at that load |
| soak: memory keeps rising and never drops | Memory leak · connections not returned |
| Response time good at first, then worse as the data grows | Query without an index · table grown from data the run created |

## 3 · Re-run so results are comparable

- Same script, same starting data, same environment · clean up the data the previous run created
- Change one thing at a time (code, or a setting, or machine size) and run against the baseline
- The k6 docs advise running the same way at least 2 rounds before releasing a version, because each round's result varies

## 4 · One-page report format

```markdown
## ผล load test · <ระบบ> · <YYYY-MM-DD>

- environment: <staging-perf> · ผู้อนุมัติ: <ชื่อ> · ช่วงเวลา: <เริ่ม–จบ>
- แบบ: <smoke · load · spike> · ปริมาณสูงสุดที่ยิงจริง: <รอบต่อวินาที>
- k6 รุ่น: <v2.x.y> · exit code: <0 หรือ 99>

| เกณฑ์ | ตั้งไว้ | ได้จริง | ผล |
|---|---|---|---|
| http_req_duration p(95) | < 500 ms | <ค่า> | ผ่าน / ไม่ผ่าน |
| http_req_failed | < 1% | <ค่า> | ผ่าน / ไม่ผ่าน |

คอขวดที่เห็น: <กราฟไหน ที่ปริมาณเท่าไร>
ทำต่อ: <ข้อแก้ 1–3 ข้อ> · ยิงซ้ำหลังแก้: <วันที่>
```

Write results only as actually run · if you only ran 50 rounds per second → never write "can handle 1,000 users at once"

## Sources

- exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/ (checked 2026-10-28)
- thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/ (checked 2026-10-28)
- run at least 2 rounds again https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/ (checked 2026-10-28)


## reference: sources.md

# Sources · load-testing

Checked 2026-10-28 (opened through a web-fetch tool that summarises pages with a small model, so reopen the raw page before locking a value in production)

- thresholds · `abortOnFail` · `delayAbortEval` · per-tag thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/
- names of all 6 executors https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ · options of `ramping-arrival-rate` https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/
- test types and their order https://grafana.com/docs/k6/latest/testing-guides/test-types/
- CI · environment · production https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/
- exit codes 0 and 99 · scripts that swallow the exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/
- GitHub Actions https://github.com/grafana/run-k6-action
- k6 licence https://github.com/grafana/k6 · versions https://api.github.com/repos/grafana/k6/releases
- Locust https://docs.locust.io/en/stable/what-is-locust.html · JMeter https://jmeter.apache.org/ (the home page links to the Apache Software Foundation licence and does not state the latest version)
- Not yet checked (`ยังไม่ได้ตรวจ`): Grafana Cloud k6 price and quota · latest versions of Locust and JMeter


## reference: test-data-strategies.md

# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

The pros and cons of each way to prepare test data, with code examples of the recommended way

## Option 1: Shared test DB (popular, problematic)
```
Wrong: All tests share same data
Wrong: Order-dependent
Wrong: Hard to parallelize
Wrong: Pollution between tests
```

## Option 2: Per-test setup (slow)
```
Right: Clean slate every test
Mixed: Reliable but slow
Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// Right: Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
Right: Real production-like data
Right: Fast (uses snapshots)
Mixed: Requires DB tooling
```


## reference: testing-contract.md

# Testing contract · app-verifier-setup

verify must depend on things the app provides, not guess from text or CSS. Write this contract into the feature map in the script, and have the developer follow it from the first feature.

| What the app must have | What it is for | Rule |
|---|---|---|
| `data-testid="<page>-<thing>"` in kebab-case on every button, input, result, and error message | Find elements without tying to text or CSS, so checks do not break when language or design changes | For example `book-submit` · `summary-total` · `book-error` · no duplicates on one page · the full list of testids lives in the feature map |
| `<html data-ready="false">` → `"true"` when the page has finished loading data | Wait on a condition instead of a guessed `sleep` (step 5) | Set `true` after the last batch of data arrives, not when the component mounts |
| A reset endpoint such as `POST /api/test/reset` → clears and re-seeds within 5 seconds | Every check starts from a clean state (step 4) | Exists only when `ALLOW_TEST_RESET=1` is set · if not set, answer 404 · never enable in production |
| Clock lock: reset accepts `{"now":"<ISO + offset>"}` and every rule reads "today" from one module (`clock`) | Test date-dependent rules (expiry · cancel at least 24 hours ahead) with the same result every time | If `now` is not sent, use the start date written in the seed · flag off, use real time · never call `Date.now()` / `DateTime.Now` directly in a rule |

Non-web apps follow the same idea: Flutter → a `Key` / Semantics label with the same name · Android → `resource-id` · command line → a `--now` option or an `APP_NOW` variable · a reset on mobile can be enabled only in a debug build.


## reference: testing-standards.md

<!-- merged from skill `testing-standards` on 2026-11-27 · description was: Use when setting up automated tests or fixing flaky ones -->
# Testing Standards — tests the team trusts: fast, deterministic, tied to behavior

> **One rule:** a test nobody trusts is worse than no test. A test that flips between red and green on its own gets `skip`ped within 2 weeks, and then the whole suite dies with it.

## Use when
- Starting tests in a new project, or adding tests to existing code
- Someone asks for unit tests or to automate the tests
- The existing suite is slow, flips red and green, or nobody maintains it

Not for: browser E2E (Playwright/Cypress) → `e2e-testing-patterns.md` · a real mobile app on an emulator → `app-verifier-setup.md` (`android-native.md`) · business-level test cases before writing → `qa-docs`.

## Steps

### 1 · Use what exists; ask only when a new one must be added
- If the project already has a framework, or the stack ships one with its SDK (Flutter `flutter_test` · Angular CLI), use it. Do not ask; 2 systems in one project is worse than one you do not like.
- If a new test package must be installed, put the question in the single round of questions before starting (use `AskUserQuestion` if available), covering **framework** (options per stack in [`per-stack.md`](per-stack.md)) and **scope now**: unit only · unit + integration (real DB through Testcontainers of the same type as production; in-memory SQLite only when production is SQLite) · full set including E2E (continue to `e2e-testing-patterns.md`).
- If the need appears mid-work, pick the recommended option (first in the table) and record it under "ตัดสินใจเอง" in the report. Do not stop to ask.

### 2 · Keep the pyramid: unit 75% · integration 20% · E2E 5%
- Unit touches nothing outside and runs in under 100 ms each. E2E only for the paths that make money.
- A mobile app has a widget test layer (Flutter) or component test layer (React Native) between unit and E2E; use it as the main middle layer.
- **The whole unit suite finishes in 10 seconds** (Flutter: count after compilation; this number is รอยืนยัน on a real machine). Slower, and people stop running it before commit.

### 3 · Decide what needs a test
- **Must have:** business logic (calculations, permission conditions, state transitions) · every edge case (empty, zero, negative, bounds, duplicates) · **every bug that has happened** (write the red test first, then fix) · contracts others depend on (API response shape, event schema).
- **Not needed:** getters/setters, DTOs, direct mappings · framework code · other people's libraries · display-only UI.
- Coverage target is 70–80% of business logic, not 100% overall. A gate of "must not drop below the current level" beats a target number.

### 4 · Write the tests
- **Name** so the name says what broke: `MethodName_Scenario_ExpectedResult` (`CreateOrder_WhenStockIsZero_ThrowsOutOfStock`). Where the name is a string (Dart · Vitest · Jest), use `group('<what is tested>')` + `test('<scenario> → <expected result>')` as a sentence.
- **AAA** (Arrange · Act · Assert), 3 parts separated by blank lines; Act is one line.
- **1 test = 1 reason to break.** 5 unrelated asserts → 5 tests.
- **Before writing, say which code change turns this test red.** Cannot say → it does not catch behavior; rewrite to catch an observable result. The answer is "the text in the source file changes" → you test characters; run the real thing instead. It goes red only when someone changes a value on purpose (a label color) → it is a change detector; test what that value affects.
- **No logic in tests** (no `if`, no loop computing the expected value). Several cases → parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`).
- **Same result every run:** inject time (`TimeProvider` on .NET 8+, or `now()`) and never call `DateTime.Now` in the code under test · fix the random seed · tests run in any order, never relying on a previous test's state · **no `sleep`** for async; use a fake timer or a real signal.
- **Mock only boundaries outside the system** (HTTP, queues, time, files), not your own pure computation. Too many mocks tie the test to the code layout, and one refactor turns the suite red.
- Test data is never real customer data; use a fake-data generator.
- Do not write tests after the work only to pass the gate, assert only "does not throw", or chase 100% coverage.

### 5 · Integration tests
- Use a **real DB of the same type as production** (Testcontainers); SQL that passes on SQLite may break on PostgreSQL.
- Each test starts from a known state (transaction rollback or truncate).
- Separate the commands (`npm run test:unit` / `test:integration`).
- Test the API **contract**: status code, JSON shape, important headers, not just "no error".

### 6 · CI
`push / PR → lint → unit (< 10 s) → integration → build`
- **Red test = cannot merge**, no exceptions.
- No `skip`/`ignore` on the main branch; to skip, attach an issue link.
- A flaky test must be **fixed or deleted**; never retry until green, because that hides a real bug.
- Show the coverage report on the PR so a rise or fall is visible.

## Check before done
- [ ] Existing or SDK-shipped framework used; a newly installed one was asked or recorded under "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` passes from a clean machine with no extra setup (long output → `> _to_delete/test.txt 2>&1` then `tail -20`)
- [ ] The unit suite finishes in 10 seconds
- [ ] Shuffled order still all green (pytest: `pytest-randomly` then plain `pytest` · Vitest: `--sequence.shuffle` · Jest: `--randomize` · Flutter: `--test-randomize-ordering-seed random`)
- [ ] 3 repeated runs give the same result
- [ ] Break the code deliberately in 1 spot: the test **must go red**; if still green it tests nothing
- [ ] **Try breaking it in your head before closing the test file**, 5 ways: wrong constant or argument · wrong branch · forgotten state change or side effect · empty or default return · unchecked 0 · empty · null · no permission · wrong format. Any way that turns no test red is behavior nobody protects.
- [ ] Reading the test name tells what broke, without opening the code
- [ ] No `sleep` / `Thread.Sleep` in the suite · no test skipped without a reason

Related: health/ping endpoints → `web-service-essentials` · logs to trace a red test → `errors-and-logs` · reviewing test code → `git-and-review`.

## References
- [`per-stack.md`](per-stack.md) — open for framework options per stack, command details and config files for .NET, Node/TS, Python, Angular, Flutter.


## reference: upkeep.md

# Upkeep — keep the hands and eyes in step with the app

> A verify skill that gives wrong steps is more dangerous than none, because the agent will trust it and report a pass.

Use it when a verify skill built by [`test-automation`](app-verifier-setup.md) no longer matches the app. On Claude Code that file is `.claude/skills/verify/SKILL.md` (see [`builtin-verify.md`](builtin-verify.md)). Maintain that one file and do not create a second `verify-<project>`.

## Steps

1. **List the real features** by pulling from routes · menu · command list · the latest Software Requirements Specification (SRS). Compare against the feature map in the script `<project-name>/test/e2e/verify.*`, and split into 3 groups: matching · missing from the feature map · no longer in the app.
2. **Read the code in parallel.** Send 1 fresh `qa-tester` agent per feature group (at most 5 features each). Each reads only, then reports whether each feature's checks in `verify.*` still match the code, with file and line number, using `crew-patterns/parallel-split-and-merge`.
3. **Drive the real app once.** Use 1 agent to run `verify.*` (the script opens and closes the app itself) for every feature, and record pass or fail · screenshots · the step that failed.
4. **Fix only what is proven.** Every fix needs evidence from step 2 or 3. If a feature fails because the app is really broken, not because the steps are wrong, file it as a bug report (`qa-docs`). Do not edit the steps to make it pass.
5. **Add the features missing from the map** in the existing format, and run each at least once for real before saving.
6. **Bundle the fixes into one set**, prepared as a single commit or a single Pull Request (PR) (commit only when the user says so), and state the count of each group in the message: matching · fixed · added · removed · bugs found.
7. `superuser/status-report` type `ตรวจ` (check).

## What not to do

- Remove a feature from the map because it is hard to test.


## reference: worked-example.md

# Worked example · load-testing

## One worked example

Label `ตัวอย่าง` (example): designed on paper, no real system has been loaded

**Problem:** An online shop will run a flash sale at noon on Friday. It went down before because the connection pool filled up. They want to know whether it survives this time.

| Step | What is done | Section |
|---|---|---|
| Goal | Volume from the previous campaign (รอยืนยัน) · path: browse products → add to cart → pay with a mock · p95 at most 500 ms · errors at most 1% (default, not measured) | 1 |
| Permission | Load staging at production size · payment points at a mock · approver and time window noted in the script header | 2 |
| Run | smoke → load (baseline) → spike | 4 |
| Monitor | Dashboards of connection pool and database CPU during the run | 6 |
| Result | Report which thresholds passed and failed at the volume really run, then add smoke to CI | 5 · 7 |

