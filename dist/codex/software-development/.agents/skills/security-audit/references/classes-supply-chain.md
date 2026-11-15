# Class family: supply chain · build · CI/CD · releases

Open this when the repo has a lockfile · Dockerfile · GitHub Actions or Azure DevOps workflows · build scripts that pull from the internet · a plugin or extension system · a self-updating system. Paste the chosen sections into the sub-agent brief whole.

Results from `npm audit` · `pip-audit` · `osv-scanner` · `trivy` via `security-gate` are candidates for this family. This file focuses on what scanners do not see.

## Rules for this family

- A dependency with a CVE is a finding only if the code calls the vulnerable part with input an attacker controls. If no path calls it → `rejected`, then add "update" under the hardening heading (follow `security-gate/references/dependency-updates.md`).
- The attackers here are whoever opens a PR · whoever names a package · the owner of a compromised registry or action. State what they gain (CI secrets · code in a release · push rights).
- Settings that live in GitHub or the cloud (branch protection · environment secrets · token permissions) are not in the repo → `needs_validation`.
- Never prove it by really pushing or opening a PR. Use `act`, or read the workflow and trace which command the PR data reaches.

## Dependencies and build-time inputs

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `dependency-confusion` | An internal package with an unscoped name can be pulled from the public registry | `.npmrc` does not bind the scope to the internal registry · `--extra-index-url` in pip | Check the registry order in config · check whether the name is free on the public registry (read-only) | A registered scope is used and bound to the registry |
| `unpinned-input` | The build pulls floating versions (`latest` · a branch · a URL with no hash) | `FROM node:latest` · `curl` output piped straight into `sh` · no lockfile · an action pinned to `@main` | Go through every line in the Dockerfile and workflows that pulls from the internet | The version floats but the build does not reach a release (hardening) |
| `vulnerable-dep-reachable` | A CVE in a package that the code really calls with external input | The function named in the advisory is imported and called | Trace the call path from a route to that function · reproduce with the advisory's example in the lab | Only a part unrelated to the vulnerability is called |
| `build-context-leak` | A secret file or `.git` gets into an image or artifact | `COPY . .` with no `.dockerignore` · the artifact bundles the whole folder | Build in the lab and inspect the files in the image (`docker run --rm <img> ls -la`) | The files that got in hold no secrets |

## CI and automation

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `ci-untrusted-code` | A workflow runs code from an outsider's PR with the repo's rights or secrets | `pull_request_target` paired with a checkout of `head.sha` · a `workflow_run` that uses an artifact from a PR | Trace which step runs code from the PR and which secrets that step sees | The repo is private and only the team can open PRs (needs_validation until the settings are confirmed) |
| `ci-expression-injection` | A branch name, PR title or issue goes straight into a shell command | `run: echo "${{ github.event.pull_request.title }}"` | Go through every `${{ github.event.* }}` inside `run:` | The value goes through `env:` and is referenced as a quoted shell variable |
| `ci-cache-poisoning` | A cache or artifact that a PR job can write is later read by a release job | The cache key is the same for the PR and main | Compare the cache key and scope across jobs | The platform separates caches by branch (check the platform's documentation for the version in use) |
| `ci-token-scope` | The workflow token has write rights beyond the job · secrets are printed to the log | No `permissions:` block · `echo $SECRET` · `set -x` | Read the workflow · check whether secrets are masked or transformed so they escape the mask | The org's default is read-only (needs_validation) |

## Releases and updates

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `release-substitution` | What was tested and what is deployed are different artifacts · a new build happens at deploy | Deploy builds a new image instead of using the digest that was tested | Trace whether the digest or hash is passed between steps | The same digest is used throughout |
| `update-integrity` | The app downloads an update without checking the signature · accepts an older version | Download over HTTP · checks only a checksum that comes from the same place · does not compare version numbers | Feed a fake update file to the updater in the lab | The app uses the store's or the OS's update system, which verifies signatures |
| `plugin-trust` | A loadable plugin or extension gets the app's full rights with no boundary | `require(userPath)` · loads a DLL from a folder the user can write to | Place a fake plugin in the lab and see what it can reach | Only admins can install plugins, and the system states this |

## Method that works across the family

- Draw the code path from commit → build → test → artifact → deploy. For each edge, write who can write to it and what the next step trusts.
- Count every place that pulls from the internet at build time and at run time, and ask what an attacker gains if that destination is compromised.
- Compare the rights of jobs that run on a PR with jobs that run on main. Nothing may flow from the first to the second without a check.
