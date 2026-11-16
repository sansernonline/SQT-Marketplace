---
name: course-builder
description: Use when designing a course or workshop you will teach
---

# course-builder · designing a course from the teacher's side

> **The one rule of this skill:** every session in the teaching schedule must point back to one learning outcome, and every outcome must have an exercise and an assessment that show results. If a session cannot point back, cut it.

Use this skill when you are the teacher. When you are the learner, use `learning-path`. The product is 1 `course/` folder: the organizer's brief · learning outcomes · a timed schedule · exercises · rubric · slides and handouts · a post-training feedback form · a post-teaching log.

Numbers labeled `แนวของเรา` (our rule of thumb) are defaults the team chose itself and has not checked against research. Use them as a starting point, then adjust from the post-teaching log (section 7 in references/materials-feedback-online-copyright.md).

## When to use

| Situation | Use |
|---|---|
| Teaching a workshop · in-company training · online course · tutoring a teammate | this skill |
| Wanting to learn something well yourself | `learning-path` |
| Content is ready and you only need slides | `presentation-design` (software-development) |
| Preparing for a certification exam | `cert-prep` |
| Teaching ordinary people to use AI in multi-step chat (Loop · Graph · Dynamic) | this skill plans the course, then uses the prompt templates from `superuser:chat-prompt-workflows` as exercises |
| Teaching a subject at an institution that has its own course form | fill in the institution's form first, then use sections 2 to 5 of this skill to fill in the content |

## 1 · Know the learners before writing content

Ask the organizer (HR or the team lead) 6 questions in one go, then write the answers to `course/brief.md`.

1. Who is learning, how many, and in what roles?
2. After the course, what can they do at work? The answer is the goal of the whole course.
3. What are they stuck on now? Ask for 1–2 real incidents.
4. How many hours in total, and what are the start and end times?
5. In the room or online? Whose machines? Can they install software themselves?
6. How is it measured? Do you need to submit scores or issue certificates?

- **Prerequisites** are written as things the learner can do, never "has a background." Example: "can open a terminal and move folders with cd." Send a 5-item check 3 days ahead. If results differ widely, pair a fluent learner with a beginner, or open a 30-minute warm-up before the real day (แนวของเรา).
- **The learner's goal**: record the reason the learners need this skill in one place in `brief.md`, then use it to decide which content stays and which is cut.

## 2 · Learning outcomes use visible verbs

A learning outcome says what the learner can do that others can see or check, under which conditions, and how well.

Sentence form: **At the end of the course, the learner + visible verb + what they do + condition + criterion.** Example: "Branch, edit a file, and merge back into main alone without opening notes, with no work from the other side lost."

Pick verbs from the revised Bloom's taxonomy, cognitive process dimension, 6 levels (Krathwohl 2002). The level names are not verbs to write into an outcome. Use the verbs in column 3.

| Level | Meaning | Visible verbs | Example in a Git course |
|---|---|---|---|
| 1 Remember | Retrieve relevant knowledge from memory | name · identify · write the command | Name the command that shows file status |
| 2 Understand | Work out the meaning of what was taught, in speech, text and pictures | explain in own words · give an example · compare | Explain how `add` differs from `commit` |
| 3 Apply | Carry out a method in a given situation | use · run · follow the steps · solve a task | Commit 3 changes, with messages saying what changed |
| 4 Analyze | Break into parts and find how the parts relate | distinguish · find the cause · group | Walk through `git log` to find the commit that made the price wrong |
| 5 Evaluate | Judge against a criterion or standard | check against criteria · choose with reasons · critique | Choose between undoing a whole commit and editing one file, with reasons |
| 6 Create | Put parts together into a new whole that works | design · plan · build | Design the team's branch naming rules |

- **Never use "understand," "know," "be aware of," or "be familiar with" as the verb of an outcome**, because they cannot be checked. Ask "If they truly understood, what would they do differently?" and write that instead (Eberly Center, Carnegie Mellon).
- A 1-day course has 3–5 outcomes, mostly at levels 3–4, and at most 1 at level 6, because creating something new takes long hands-on time (แนวของเรา).
- Map every outcome to its teaching session, exercise and assessment in one table. An outcome with no exercise means you taught it but never let learners try it (the alignment table is in section 10).

## 3 · A schedule split into timed sessions

**Assumptions for the training day** (used in the example, not facts): 1 in-company training day in Thailand, 09:00–16:00, with a 15-minute morning break, a 15-minute afternoon break and a 60-minute lunch, leaving 5 hours 30 minutes of real teaching time. For every job, ask the organizer for the real times, because each place differs. Some have an opening ceremony or a group photo that takes extra time.

| Time | Session | Outcome no. | Teach (min) | Hands-on (min) | What happens · what to prepare |
|---|---|---|---:|---:|---|
| 09:00–10:30 | 1 · Session name | 1 | 25 | 65 | Activity · files to hand out |

Rules for arranging sessions (แนวของเรา):

- Talk for at most 20 minutes at a stretch, then let learners do something or answer questions.
- A skills course uses about 30% talking and about 70% hands-on.
- The session after lunch is hands-on work, not lecture.
- Keep a 10% buffer in every session for machine problems and questions.
- Open every session with 3 review questions from the previous session, answered without notes (retrieval practice). Near the end of the day, loop back to use the first session's skill once more (spaced review, or spacing).
- Use the last 20 minutes of the day to review, fill in the feedback form (section 7) and say where to keep practicing.

## 4 · Exercises, from guided to alone

Every skill goes through 4 stages. Do not jump from watching the teacher straight to doing it alone.

| Stage | Teacher does | Learner does | Support given |
|---|---|---|---|
| 1 Watch | Demonstrates on screen, saying thoughts aloud | Watches and takes notes | Every step is on the slides |
| 2 Follow along | Works together one command at a time, pausing at checkpoints | Follows on their own machine | An instruction sheet with every step |
| 3 Do it with help | Walks around, answers when learners ask | Does a new task similar to the earlier one | Starter files · a 3-step hint |
| 4 Do it alone | Gives no help, notes who is stuck where | Does a task on a new topic | None · scored with a rubric |

**Each exercise has all 7 parts:** which outcome · starter files · steps or task · **เสร็จเมื่อ** (done when: a checkable result, such as which command must show what) · a 3-step hint (point the direction, then name the command, then say almost all of it) · an answer key in a separate file · an extension task for those who finish early.

- **Use topics the learners meet at work.** The accounting team uses a financial statement file, the testing team uses test cases. Do not use bare names like `foo` and `bar` (same principle as the real-project rule of `learning-path`).
- **Exercise folders**: number the prefix by session order. Each exercise splits into `problem/` (a task with gaps to fill) · `solution/` (the answer) · `explainer/` (the explanation), with a short README in every folder. Move or renumber with `git mv` so file history is not lost.
- **Multiple-choice questions**: make all options similar in length and shuffle the position of the correct one, so learners cannot guess from how the options look.
- **Try every exercise yourself before teaching**, on the same machine type as the learners, and note the time it takes. Multiply by 3 for a beginner's time (แนวของเรา).

## 5 · Assessment: a rubric with 3–4 levels and sample work

A rubric is a set of criteria for a task that describes what work at each quality level looks like (Brookhart · ASCD).

1. 3–5 criteria, each tied to 1 outcome.
2. 3–4 levels. 4 levels have no middle, so the assessor must decide pass or not yet. 3 levels are faster and suit short tasks (แนวของเรา).
3. Each cell in the table describes what is visible in the work. Do not use bare verdicts like "good," "very good" or "complete."
4. **Sample work for each level (anchor)**: keep 1 real piece per level from the pilot run, remove names, and ask the owner's permission first. Then have 2 assessors score the same set. If they differ by more than 1 level, rewrite the wording in that cell.
5. **Judge pass or fail one criterion at a time, not by total score.** Every criterion must reach the level "can do alone," because a total score lets a strong item cancel out an item the learner cannot do (แนวของเรา).
6. Give the rubric to learners before they start the task, not after scoring.

A pre-test and post-test (the same 5 items) show whether knowledge grew. The rubric shows whether they can really do it. Use both.

## 6–9 · Materials, feedback form, online, copyright

The details are in [references/materials-feedback-online-copyright.md](references/materials-feedback-online-copyright.md) · open it when you reach that step.

| Section | Open when | Core point to remember |
|---|---|---|
| 6 · Teaching materials | Making slides and handouts | Slides are not handouts · details and commands go in the handout · run `thai_tells.py` before printing |
| 7 · Post-training feedback form | Designing the form · reviewing after teaching | At most 7 items, 3 minutes, no name · review within 48 hours · fix at most 3 things per round |
| 8 · Online versus in the room | Teaching online | At most 60 minutes per session · send the install guide 3 days ahead · announce before recording video (numbers are แนวของเรา) |
| 9 · Copyright | Using other people's pictures, text or code · selling or teaching clients | Credit other people's work · paid training should not rely on the teaching exception · no stated license means unusable · not legal advice |

## 10 · Example: a 1-day "Git สำหรับมือใหม่" (Git for beginners) course

The full example is at [references/git-one-day-example.md](references/git-one-day-example.md): 3 outcomes · a table of 4 sessions (95 minutes of teaching, 235 minutes hands-on, about 29% to 71%) · 2 exercise sets · a 4-level rubric · an alignment table · every Git command line really run with Git 2.54 on Windows (2026-10-23).

2 lessons from testing this example apply to every exercise that uses a pre-built repo:

- **A repo where learners undo a change with `git revert`**: make sure no later commit edits a line next to the line being undone. Otherwise `revert` hits a conflict and becomes the conflict lesson too early (seen in testing, 2026-10-23).
- **Warnings that are not errors**, such as `LF will be replaced by CRLF` on Windows: tell learners before they see it. Add `--no-edit` to commands that would open a message editor that beginners cannot close.

## 11 · Check before sending

- [ ] Every outcome uses a visible verb, with no "understand," "know" or "be aware of."
- [ ] Every session points to an outcome, and every outcome has an exercise and an assessment in the alignment table.
- [ ] The times in the table add up to the real teaching time the organizer confirmed. If not yet confirmed, write that it is an assumption.
- [ ] Exercises cover all 4 stages, each has a checkable "เสร็จเมื่อ," and every command line has really been run on the same machine type as the learners.
- [ ] The rubric has 3–4 levels, cells describe what is visible in the work, pass or fail is judged one criterion at a time, and it is handed out before the task.
- [ ] Handouts pass `human-writing` and `thai_tells.py` · slides and handouts use the same terms.
- [ ] Other people's pictures, text and code have a source and a license · paid training has no NC work · exercises hold no real personal data.
- [ ] The feedback form has at most 7 items, and the post-teaching review is booked in the calendar.

## 12 · Common mistakes

- **So many slides that no time is left for hands-on work.** Count time from the schedule, not from the number of slides.
- **An outcome written as "understand Git."** It cannot be checked, so exercises and assessment cannot be designed either.
- **Exercises with only the follow-along stage.** Learners can do it in the room but cannot do it alone back at their desk.
- **A rubric that says "good" and "very good."** Two assessors score the same work differently.
- **A feedback form that asks only about satisfaction.** Next round you do not know what to fix.
- **Installing software on the teaching day.** The first part of the session is lost to fixing machines. Send the install guide and schedule a machine check ahead.
- **Using pictures from search results without checking the license.** See section 9 in references/materials-feedback-online-copyright.md.

## Link to other skills

| Need | Use |
|---|---|
| Slides someone will present | `presentation-design` (software-development) |
| Handouts as Word from Markdown | `markdown-report-docx` (software-development) |
| Collecting learners' names or emails · recording teaching video | `pdpa-workflow` (e-commerce) |
| Teaching contract and rights in the materials | `doc-contract-th` (e-commerce) |

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources
