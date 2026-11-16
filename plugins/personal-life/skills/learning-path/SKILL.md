---
name: learning-path
description: Use when learning a new language or framework properly
argument-hint: <technology or paper> [--depth skim|working|mastery]
---

# Learning Path

Learn on your own real project, in small wins.

Not for: a certification exam → `cert-prep` · choosing a practice or portfolio project → `side-project-picker`.

## Steps

1. **Goal and depth** — what "learned" means here (skim, working knowledge or mastery) and why. Choose the depth out loud. Then **check the hours against the real week** ("สัปดาห์ปกติมีอะไรอยู่แล้วบ้าง") and ask whether this path **adds to or replaces** a course the user already follows; never two syllabi at once. Same checks as `cert-prep` step 4
2. **Baseline check** — 10 quick questions to find what the user already knows. Skip everything they already know
3. **Milestones** — 4–7 steps, each: concept → tiny exercise → applied to the user's real project. Each step takes under 2 hours
4. **Anchoring rule** — at least half the milestones modify or extend something the user already owns, not toy examples
5. **Checkpoints** — after milestone 3 and at the end: can the user do the thing without help? If not, go back. If yes, the path ends even if topics remain. The rest is reference material

## Template

Use [references/path-template.md](references/path-template.md) for the plan file and the `learning-log.md` entry. A full worked example (Docker to working knowledge, with milestone table and checkpoints) is in [references/worked-example.md](references/worked-example.md); open it before writing the first milestone table.

## Rules

- The path ends on competence, not exhaustion — knowing when you know enough is the skill
- Each milestone's deliverable is visible in the project (a feature, a refactor, a test)
- Re-plan freely when reality differs from the plan. The path serves the learner
- Record finished paths in a `learning-log.md` with dates — future-you will want the map

## เรียกเป็นคำสั่ง

`/personal-life:learning-path <technology or paper> [--depth skim|working|mastery]`

With `--depth` or a technology: run `learning-path`. With a paper, RFC, or article: run `paper-to-practice`. Both with the `tech-mentor` agent: **$ARGUMENTS**

Every path ends in something runnable in the user's own project.
