---
name: jenkins-pipeline
description: Use when writing or fixing a Jenkinsfile
---

# jenkins-pipeline — a Jenkinsfile that builds images, tests and deploys with Helm without leaking secrets

> **The one rule:** keep secrets in Jenkins credentials and let the shell read them from the environment (`sh '...'` with single quotes) · never let Groovy concatenate a secret into a command.
> Groovy expands the value before it reaches the agent, so the secret ends up in the process arguments, where `ps` can see it ([Jenkins: Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)).

## Use when

- Writing a new Jenkinsfile, or fixing one that builds images, tests and deploys to Kubernetes with Helm
- There are many services and the team wants to share a pipeline (shared library)
- A secret shows up in the console log, or the pipeline uses the `latest` tag

Do not use when: the team uses GitHub Actions · GitLab CI · Azure DevOps → `cicd-and-release` (`references/per-platform.md`) · there is no chart to deploy yet → `kubernetes-helm` first

Alongside: `cicd-and-release` (read first · general pipeline principles) · `config-and-secrets` (store, rotate secrets) · `security-gate` (dependency, image, secret checks) · [`kubernetes-helm`](../kubernetes-helm/SKILL.md) (owns the chart · Dockerfile). Instead: agent drives Jenkins through MCP → `mcp-server` · untrusted-code containers → `docker-sandbox`


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
- For how to store, rotate and separate secrets per environment → `config-and-secrets` · to check for secrets that leaked into git → `security-gate`

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
- Helm 3: `--atomic` rolls back by itself when the upgrade fails, and turns on `--wait` ([Helm 3](https://helm.sh/docs/v3/helm/helm_upgrade/)) · Helm 4: the `--atomic` flag is marked deprecated, so use `--rollback-on-failure` instead (as `kubernetes-helm` checked in `references/helm-chart.md` · [Helm 4 upgrade](https://helm.sh/docs/helm/helm_upgrade/)) → run `helm version` on the build machine and pick the matching flag
- `--timeout` counts per individual action, not for the whole upgrade (default 5m0s) · workloads that load models (stt · tts) need longer than that, real value `(ยังไม่ได้วัด)` (not yet measured) as in `kubernetes-helm` item 5 · `--history-max` defaults to 10
- **The digest lives in `values-<env>.yaml`**, as the `kubernetes-helm` chart specifies (`api.image.digest` and so on · the chart uses `required` to force it to exist) · never pass it with `--set` · the pipeline writes the built digest into each environment's values file, then hands the same file on to staging and production
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
- The MCP Server plugin turns the controller into an MCP server (endpoint `/mcp-server/mcp`) · use the API token of a least-privilege user, and `allowUnauthenticatedMcp` must be `false` ([plugins.jenkins.io/mcp-server](https://plugins.jenkins.io/mcp-server/)) · to install it and connect an agent → `mcp-server`
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

- [`references/jenkinsfile-voice-clinic.md`](references/jenkinsfile-voice-clinic.md) — open for the full Jenkinsfile and the worked example (dental clinic voice agent) decision table
- [`references/sources.md`](references/sources.md) — sources checked 2026-10-27
