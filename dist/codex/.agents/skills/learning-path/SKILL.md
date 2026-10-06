---
name: learning-path
description: Use when the user wants to learn a new language, framework or paradigm properly. Builds small milestones anchored to the user's real projects, each producing something runnable, with honest checkpoints on whether to continue.
---

# Learning Path

Learn it on your own battlefield, in small wins.

## Steps

1. **Goal and depth** — what "learned" means here (working knowledge vs mastery) and why; depth chosen explicitly
2. **Baseline check** — ten quick questions to find what the user already knows; skip everything below the baseline
3. **Milestones** — 4–7 steps, each: concept → tiny exercise → applied to the user's real project; each step under two hours
4. **Anchoring rule** — at least half the milestones modify or extend something the user already owns, not toy examples
5. **Checkpoints** — after milestone 3 and at the end: can the user do the thing unaided? If not, loop back; if yes, the path ends even if topics remain — the rest is reference material

## Worked example — Docker to working knowledge, anchored to the user's project

Goal: "run my Flask expense app and its Postgres with one command on any machine". Depth: **working**. Baseline: has used `docker run`, never written a Dockerfile.

| # | Concept | Tiny exercise (≤ 30 min) | Applied to the real project | Done when | Hours |
|---|---|---|---|---|---:|
| 1 | Image vs container, layers | Build the official Python image tutorial | Write a Dockerfile for the Flask app | `docker run` serves the home page | 1.5 |
| 2 | Layer caching, `.dockerignore` | Reorder COPY lines and time two builds | Cut rebuild time of the app | Rebuild after a code change < 10 s | 1 |
| 3 | Volumes and networks | Run Postgres with a named volume | App connects to Postgres in a container | Data survives `docker rm` | 1.5 |
| ✔ | **Checkpoint**: explain image/container/volume without notes; rebuild from scratch unaided | | | | |
| 4 | Compose | Two-service compose file | `docker compose up` runs app + DB | One command from a fresh clone | 1.5 |
| 5 | Config and secrets | `.env` + compose `env_file` | Remove the hard-coded DB password | No secret in git | 1 |
| ✔ | **Final checkpoint**: a teammate runs it from the README alone | | | | |

Stopped after 5 milestones (6.5 hours). Kubernetes was out of scope for "working" depth and went to the reference list.

## Template

Use [references/path-template.md](references/path-template.md) for the plan file and the `learning-log.md` entry.

## Rules

- The path ends on competence, not exhaustion — knowing when you know enough is the skill
- Each milestone's deliverable is visible in the project (a feature, a refactor, a test)
- Re-plan freely when reality disagrees with the plan; the path serves the learner
- Record finished paths in a `learning-log.md` with dates — future-you will want the map
