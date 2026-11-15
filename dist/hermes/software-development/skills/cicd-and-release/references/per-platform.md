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
