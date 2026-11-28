# skill: course-builder

Use when designing a course or workshop you will teach

# course-builder · designing a course from the teacher's side

> **The one rule of this skill:** every session in the teaching schedule must point back to one learning outcome, and every outcome must have an exercise and an assessment that show results. If a session cannot point back, cut it.

Use this skill when you are the teacher. When you are the learner, use `learning-path`. The product is 1 `course/` folder: the organizer's brief · learning outcomes · a timed schedule · exercises · rubric · slides and handouts · a post-training feedback form · a post-teaching log.

Numbers labeled `แนวของเรา` (our rule of thumb) are defaults the team chose itself and has not checked against research. Use them as a starting point, then adjust from the post-teaching log (section 7 in references/materials-feedback-online-copyright.md).

## When to use

| Situation | Use |
|---|---|
| Teaching a workshop · in-company training · online course · tutoring a teammate | this skill |
| Wanting to learn something well yourself | `learning-path` |
| Content is ready and you only need slides | `slide-deck` (software-development) |
| Preparing for a certification exam | `learning-path` |
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
| Slides someone will present | `slide-deck` (software-development) |
| Handouts as Word from Markdown | `document-design` (software-development) |
| Collecting learners' names or emails · recording teaching video | `pdpa-workflow` (e-commerce) |
| Teaching contract and rights in the materials | `thai-business-docs` (e-commerce) |

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources

- A whole course with several steps → playbook `superuser/references/playbook-teach-a-course.md` · what good teaching is → `life-principles` → `references/teaching.md`.


## reference: git-one-day-example.md

# Example: a 1-day course "Git สำหรับมือใหม่" (Git for beginners)

A full example for `course-builder` section 10 · all the rules are in [SKILL.md](../SKILL.md), and this file shows what the rules look like in use.

This whole section is an **example** (ตัวอย่าง): the learners, head count and times are assumed values · every Git command line was really run with Git 2.54 on Windows (2026-10-23)

Brief: 12 business analysts (BA) and quality assurance testers (QA) want to keep requirement documents and test cases in Git, instead of emailing `_final_v3` files. Classroom teaching. The company laptops already have Git installed.

Prerequisites: the learner can open a terminal and use `cd` and `ls` · typing `git --version` shows a version number.

**3 outcomes.** By the end of the day, the learner can:

1. Create a repository and commit changes to a file 3 times, with every commit message saying what changed (apply).
2. Use `git log` and `git show` to find the commit that made a menu price wrong, then undo only that change with `git revert` unaided (analyze).
3. Work on a branch, merge it back into `main`, and fix 1 conflict so the file keeps the work from both sides (apply).

**Table of 4 sessions** (training day as assumed in section 3)

| Time | Session | Outcome no. | Teach (min) | Hands-on (min) | What happens |
|---|---|---|---:|---:|---|
| 09:00–10:30 | 1 · Keeping versions of a file | 1 | 25 | 65 | Why the `_final_v3` file breaks · `git config` · `init` · `status` · `diff` · `add` · `commit` · exercise 1 part A |
| 10:30–10:45 | Break | | | | |
| 10:45–12:00 | 2 · Looking back and undoing | 2 | 20 | 55 | `log` · `show` · `revert` · exercise 1 part B |
| 12:00–13:00 | Lunch | | | | |
| 13:00–14:30 | 3 · Splitting work and merging | 3 | 20 | 70 | `switch -c` · `merge` · conflict · exercise 2 |
| 14:30–14:45 | Break | | | | |
| 14:45–16:00 | 4 · Doing the whole set alone | 1–3 | 30 | 45 | 10 minutes to explain the task · 45-minute solo closing task scored with the rubric · 20 minutes of review and the feedback form |

Total: 95 minutes of teaching and 235 minutes of hands-on work (about 29% to 71%). Pushing to GitHub and pull requests are not in this day. They are kept for the next half-day course.

**Exercise 1 · Coffee shop menu** (follow-along level · outcomes 1 and 2)

Part A (session 1): hand out the `cafe-menu/` folder that holds a `menu.md` file, then type each command together.

```bash
git config --global user.name "ชื่อของคุณ"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
cd cafe-menu
git init
git status                      # menu.md is not yet tracked by Git
git add menu.md
git commit -m "เริ่มเมนูร้าน"
# add the line "- ชาไทยเย็น 45" to menu.md and save the file
git diff                        # shows the added line
git add menu.md
git commit -m "เพิ่มชาไทยเย็นในเมนู"
git log --oneline
```

Done when `git log --oneline` shows 3 lines (the learner makes the 3rd commit alone) and each line tells what changed. 3-step hint: look at what `git status` says about the file → `add` must come before `commit` → the full 2-line command. On Windows the learner may see the warning `LF will be replaced by CRLF`. Tell them first that it is not an error.

Part B (session 2): hand out the `cafe-history` repo with 6 commits. One commit, named "ปรับเมนู", changes the Americano price from 50 to 500. The learner finds it with `git log --oneline`, checks what it changed with `git show <commit id>`, then undoes only that change with `git revert --no-edit <commit id>`. (`--no-edit` stops Git from opening a message editor that beginners cannot close.) Done when `menu.md` is back to 50 and every later change is still there.

When you prepare this repo, make sure no later commit edits a line next to the wrong-price line. Otherwise `git revert` hits a conflict and turns into the lesson of session 3 too early (this happened when we tested this example).

**Exercise 2 · Oat milk latte** (guided do-it-yourself level, then alone · outcome 3)

Round 1 has a 5-step instruction sheet and a 3-step hint.

1. `git switch -c oat-milk`, then change the line `- ลาเต้เย็น 55` to `- ลาเต้เย็นนมโอ๊ต 55`, then `add` and `commit`.
2. `git switch main`, then change the same line to `- ลาเต้เย็น 60`, then `add` and `commit`.
3. `git merge oat-milk` causes a conflict in `menu.md`.
4. Edit the file so it keeps both intentions as `- ลาเต้เย็นนมโอ๊ต 60`, and delete the markers `<<<<<<<` `=======` `>>>>>>>`.
5. `git add menu.md`, then `git commit --no-edit`.

Round 2 hands out the file `hours.md` (shop opening hours), committed to `main` first. Then create the same kind of conflict on a branch with a new name, such as `weekend-hours` (one side adds Saturday, the other moves the opening time). Give no instruction sheet. Done when `git log --graph --oneline` shows 2 lines joining together and no `<<<<<<<` marker is left in the file.

**Rubric for the closing task (session 4)**: 4 levels · pass when every criterion reaches level 3.

| Criterion (outcome) | 1 Cannot do yet | 2 Can do with help | 3 Can do alone | 4 Can do and explain to others |
|---|---|---|---|---|
| commit (no. 1) | No commit, or everything in one commit without checking what is in it | Can commit, but the message does not say what changed, such as `update` | Splits commits by topic, and messages say what changed | Level 3, and opens `git status` and `git diff` before every commit without being reminded |
| Find and undo a change (no. 2) | Cannot find the commit that made the price wrong | Finds it when someone gives the command | Finds it with `log` and `show`, then runs `revert` alone | Level 3, and can say when to undo a whole commit and when to edit one file |
| branch and conflict (no. 3) | Merge fails, or the other side's work is lost after fixing the conflict | Fixes the conflict while following the instruction sheet | Fixes the conflict alone and keeps the work from both sides | Level 3, and can say how to avoid this kind of conflict next time |

Sample work for each level: after the pilot run, keep a screenshot of `git log --graph --oneline` and the fixed `menu.md` file, from level 2 and level 3 work on the branch and conflict criterion, in `course/anchors/` (names removed).

**Alignment table**

| Outcome | Session | Exercise | Assessment |
|---|---|---|---|
| 1 commit | 1 | Exercise 1 part A | Rubric criterion commit · pre-test and post-test items 1–2 |
| 2 Find and undo a change | 2 | Exercise 1 part B | Rubric criterion find and undo · test items 3–4 |
| 3 branch and conflict | 3 | Exercise 2 | Rubric criterion branch and conflict · test item 5 |


## reference: materials-feedback-online-copyright.md

# course-builder · sections 6–9 (materials, feedback form, online, copyright)

Moved from [SKILL.md](../SKILL.md) · the skill's main rule (outcomes point back from every session) stays in SKILL.md · section numbers are unchanged.

## 6 · Teaching materials: Thai slides and handouts

- **Slides**: for storyline, conclusion-style slide titles, layout and Thai fonts, use `slide-deck` (software-development). If the deck must open offline, as a single file, with speaker notes, use `slide-deck` (software-development). If that plugin is not installed, tell the user, then use section 6 of `human-writing` (a slide title is the conclusion of the page).
- **Slides are not handouts.** A slide has a conclusion-style title, a picture, or a short piece of code. Details and commands to type along go in the handout, so learners do not need to photograph the screen.
- **Thai handouts**: write them by `human-writing` at the "explain" register (no ครับ or ค่ะ in the body) · commands go in a code block that can be copied, pasted and run · spell out abbreviations on first use · call the same thing by one word across slides, handouts and exercises · run `thai_tells.py` before sending to print.
- **1-page summary (cheat sheet)**: the commonly used commands with examples, which learners can take back and keep beside the screen.
- To export to Word or PDF, use `document-design` (software-development) · break Thai words in the exported file by `human-writing` `references/thai-line-breaking.md`.
- Put the version and date in the file name, such as `git-basics-handout-v02-2026-11-05.pdf`, so learners know which copy they hold.

## 7 · Post-training feedback form, and what to fix next round

Kirkpatrick's model measures training results at 4 levels: reaction (how learners feel about the training) · learning (whether they gained the knowledge and skills in the goals) · behavior (whether they actually do it back at work) · results (whether the organization's goals move). A 1-day course measures the first 2 levels on the day, then schedules a level 3 follow-up 30 days after training (แนวของเรา, our rule of thumb).

The feedback form has at most 7 items, takes 3 minutes to fill in, and needs no name.

1. Confidence 1–5 for each outcome (put the real outcome text into the form).
2. Which session was used the most.
3. Which session wasted time.
4. Pace: too slow · just right · too fast.
5. Which 1 topic they will use next week.
6. If they could change 1 thing in the course, what it would be.
7. Whether they would recommend it to a coworker, and why.

If you must collect a name or email, for example to send a certificate, tell people what it is kept for and for how long, under the Personal Data Protection Act (PDPA). The steps are in `pdpa-workflow` (e-commerce).

**Review within 48 hours after teaching**, then record it in `course/course-log.md` with the teaching date, number of learners and version of the materials.

| Decision | Evidence | Next round |
|---|---|---|
| Keep | Session 3 got average confidence of 4.5 out of 5 (ตัวอย่าง, example) | Keep it |
| Fix | 5 of 12 people were stuck on a conflict for more than 20 minutes (ตัวอย่าง) | Add screenshots to the instruction sheet, and a hint for the first step |
| Cut | Nobody picked the Git history session as one they used (ตัวอย่าง) | Reduce to 1 slide |

Fix at most 3 things per round, so you can tell what really helped (แนวของเรา).

## 8 · How online differs from in the room

| Topic | In the room | Online |
|---|---|---|
| Length per session | 75–90 minutes | At most 60 minutes, then a 5–10 minute break · split a 1-day course into 2 half-days on different days |
| Machines and software | 1–2 spare machines in the room | Send the install guide 3 days ahead · schedule a 15-minute machine check before the real day |
| Teaching assistant | 1 per 10–12 learners during hands-on time | 1 person watches the chat and the breakout rooms |
| Seeing who is stuck | Walk around and look at screens | Ask them to share their screen, or post a picture of the result in the chat at a checkpoint |
| Group work | Groups of 3–4 per table | Breakout rooms of 3–4 · write the task and time in the chat before splitting |
| Questions | Raise a hand | Ask in the chat or a poll · the trainer stops to read the chat every 10 minutes |
| Recording video | Mostly not recorded | Can record, but say so before starting, and tell people where it is kept and for how long (PDPA) |
| Documents | Print and hand out | Send the PDF and links before starting |

The numbers in this table are our rule of thumb (แนวของเรา). Adjust them from `course-log.md`.

## 9 · Copyright of teaching materials

General information, not legal advice · for materials you will sell or use with many clients, have a lawyer check first.

- **Use your own examples.** Write the code, scenarios and sample data yourself. Never put real client or employee data in an exercise, because it is personal data. Invent all names and numbers anew.
- **Credit other people's work.** For every picture, text and piece of code you did not make, put the work's title, creator, link, license and the date you viewed it under the picture or at the end of the document.
- **The teaching exception applies only when not for profit.** The Copyright Act B.E. 2537 (1994), section 32 (6) and (7), exempts teachers and educational institutions that copy or distribute works for non-profit teaching. Paid training or teaching for hire therefore should not rely on this exception (อนุมาน, inferred). Section 33 allows copying or quoting a reasonable part of a work if you say who owns it.
- **Creative Commons (CC) licenses.** BY means you must give credit · SA means adaptations must use the same license · NC means no commercial use, so paid training avoids NC works · ND means no adaptation. A work that states no license at all should be treated as unusable until the owner allows it (แนวของเรา).
- **Who owns the material you make.** If you made it as an employee, the copyright belongs to the creator unless a written agreement says otherwise, but the employer may publish it within the purpose of the employment (section 9). If you made it under a commission for someone else, the copyright belongs to the commissioner unless agreed otherwise (section 10). An independent trainer who wants to reuse the slides elsewhere should write that into the contract before the work starts. Use `thai-business-docs` (e-commerce).


## reference: sources.md

# Sources for course-builder (checked 2026-10-23)

## Sources (checked 2026-10-23)

| Topic | Source |
|---|---|
| The 6 levels of cognitive process and their meaning · teachers use "understand" too broadly | Krathwohl, D. R. (2002). A Revision of Bloom's Taxonomy: An Overview. *Theory Into Practice*, 41(4), 212–218. https://doi.org/10.1207/s15430421tip4104_2 · article details checked with CrossRef, and pages 214–215 read from the copy published by the Royal Veterinary College |
| Outcomes need a verifiable verb · "understand X" is an example of a vague outcome | Eberly Center, Carnegie Mellon University · cmu.edu/teaching/designteach/design/learningobjectives.html |
| Definition of a rubric | Susan M. Brookhart, *How to Create and Use Rubrics for Formative Assessment and Grading* (ASCD) · chapter 1 page on ascd.org · publication year (ยังไม่ได้ตรวจ, not yet checked) |
| Kirkpatrick's 4 levels | kirkpatrickpartners.com/the-kirkpatrick-model |
| Copyright Act B.E. 2537 (1994), sections 9 · 10 · 32 · 33 | Text on th.wikisource.org · not yet checked against the Royal Gazette or later amendments (No. 2 B.E. 2558 (2015) onward) |
| Meaning of BY · SA · NC · ND | creativecommons.org/share-your-work/cclicenses |
| Learner goals recorded in one place · retrieval practice and spaced review · answer options of similar length with the correct answer's position shuffled | github.com/mattpocock/skills file `skills/productivity/teach` · MIT (Copyright (c) 2026 Matt Pocock) · idea used, rewritten, not copied |
| Folders for exercise, answer and explanation · numeric prefixes · `git mv` | github.com/mattpocock/skills file `skills/misc/scaffold-exercises` · MIT · idea used, rewritten |
| Git commands in section 10 (`references/git-one-day-example.md`) | Really run with Git 2.54.0 on Windows 2026-10-23 · `git revert` conflicts when a later commit edits an adjacent line (seen in testing) |
| Training day times · talk-to-hands-on ratio · numbers labeled "our rule of thumb" (แนวของเรา) | Team assumptions and defaults, not yet checked against research |
