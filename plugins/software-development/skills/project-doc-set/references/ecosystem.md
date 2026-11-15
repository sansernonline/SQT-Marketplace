# Ecosystem project: 1 system split into several sub-projects

Read this when a project has 2 or more sub-projects and each one has its own doc set. The short rule is in `SKILL.md` section 1.

Use it when the project is a product suite with 2 or more sub-projects, and each has its own doc set (SRS · mockup · architecture). Example: Quanton, split into CONNECT · LAB · INTEL · DESK.
**The folder must always be named `ecosystem/`.** Never use `projects/`, `modules/` or `apps/`. When someone opens the folder, they must see at once that everything inside is a piece of one system.

```
<project-name>/
├─ docs/                ecosystem-level docs — README (index) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <code>-<SUB>/     1 folder per sub-project, e.g. QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    code repo of this sub-project (lowercase, joined with `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   shared by the whole ecosystem (same rules as type B)
```

- Docs that cover every sub-project (BRD · project plan · BUILD-PLAN) live in one place, the root `docs/`. Never copy them into each sub-project.
- Create a sub-project folder when you start writing that sub-project's docs. Do not create folders in advance.
- Sub-project folder name = project code + sub-project name in capitals (`QTN-CONNECT`). Use the same code the docs cite.
- If a project already uses `projects/`, rename it to `ecosystem/` and fix the paths in every doc and script in the same pass.
- A project with a single product does not need `ecosystem/`. Use type B as usual.
