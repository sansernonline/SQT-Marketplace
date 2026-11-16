# Worked example · learning-path

## Docker to working knowledge, anchored to the user's project

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
