---
name: learning-path
description: Use to learn a tech, prep a cert, track releases or pick side projects
argument-hint: <technology, exam or paper> [--depth skim|working|mastery]
---

# Learning Path

Learn on your own real project, in small wins.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "I want to learn this technology properly" | This page (the steps below) |
| "Turn this paper, RFC or article into a working example" | [`references/paper-to-practice.md`](references/paper-to-practice.md) (brief, smallest runnable example, run, one-page note) |
| "I'm sitting an exam or a cloud or developer certification, or I need flashcards and quizzes" | [`references/cert-prep.md`](references/cert-prep.md) |
| "An English error message or doc passage needs a Thai explanation" | [`references/english-tech-reading.md`](references/english-tech-reading.md) |
| "What changed in the tools I follow this week?" · "What portfolio project should I build?" | [`parts/tech-growth/guide.md`](parts/tech-growth/guide.md) (tech radar · side project picker) |

**Hard rules (paper flow):** Run the example for real. If it cannot run, say why and what was tried. Build only the smallest program that shows the core idea. If infrastructure is lacking, use a simulation and say so. Credit the paper with title, authors and date.

Choosing a practice or portfolio project → [`parts/tech-growth/guide.md`](parts/tech-growth/guide.md).

## Steps

1. **Goal and depth** — what "learned" means here (skim, working knowledge or mastery) and why. Choose the depth out loud. Then **check the hours against the real week** ("สัปดาห์ปกติมีอะไรอยู่แล้วบ้าง") and ask whether this path **adds to or replaces** a course the user already follows; never two syllabi at once. Same check as in `references/cert-prep.md`
2. **Baseline check** — 10 quick questions to find what the user already knows. Skip everything they already know
3. **Milestones** — 4–7 steps, each: concept → tiny exercise → applied to the user's real project. Each step takes under 2 hours
4. **Anchoring rule** — at least half the milestones modify or extend something the user already owns, not toy examples
5. **Checkpoints** — after milestone 3 and at the end: can the user do the thing without help? If not, go back. If yes, the path ends even if topics remain. The rest is reference material

## Template

Use [references/path-template.md](references/path-template.md) for the plan file and the `learning-log.md` entry. The paper flow has its own steps in [references/paper-to-practice.md](references/paper-to-practice.md); its worked example (bloom filter) is a separate file, [references/bloom-filter-example.md](references/bloom-filter-example.md). A full worked example (Docker to working knowledge, with milestone table and checkpoints) is in [references/worked-example.md](references/worked-example.md); open it before writing the first milestone table.

## Rules

- The path ends on competence, not exhaustion — knowing when you know enough is the skill
- Each milestone's deliverable is visible in the project (a feature, a refactor, a test)
- Re-plan freely when reality differs from the plan. The path serves the learner
- Record finished paths in a `learning-log.md` with dates — future-you will want the map

## เรียกเป็นคำสั่ง

`/personal-life:learning-path <technology, exam or paper> [--depth skim|working|mastery]`

With `--depth` or a technology: run the steps above. With a paper, RFC, or article: follow `references/paper-to-practice.md`. With an exam: follow `references/cert-prep.md`. All with the `tech-mentor` agent: **$ARGUMENTS**

Every path ends in something runnable in the user's own project.
