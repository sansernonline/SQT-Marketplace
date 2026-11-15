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
- **The learner's goal**: record the reason the learners need this skill in one place in `brief.md`, then use it to decide which content stays and which is cut (idea from `teach` in mattpocock/skills · MIT · rewritten).

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

- **Never use "understand," "know," "be aware of," or "be familiar with" as the verb of an outcome**, because they cannot be checked. Ask "If they truly understood, what would they do differently?" and write that instead (Eberly Center, Carnegie Mellon). Krathwohl notes that when teachers say they want learners to "really understand," the meaning ranges from the understand level up to creating new work, so the word gives no level.
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
- Open every session with 3 review questions from the previous session, answered without notes (retrieval practice). Near the end of the day, loop back to use the first session's skill once more (spaced review, or spacing). These 2 principles come from `teach` (rewritten).
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
- **Exercise folders**: number the prefix by session order. Each exercise splits into `problem/` (a task with gaps to fill) · `solution/` (the answer) · `explainer/` (the explanation), with a short README in every folder. Move or renumber with `git mv` so file history is not lost (idea from `scaffold-exercises` in mattpocock/skills · MIT · rewritten).
- **Multiple-choice questions**: make all options similar in length and shuffle the position of the correct one, so learners cannot guess from how the options look (idea from `teach`).
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
| Learner side: planning your own learning path | `learning-path` |
| Slides someone will present (storyline, slide titles, Thai fonts) | `presentation-design` (software-development) |
| Single-file HTML slides that open offline, with speaker notes | `html-slide-deck` (software-development) |
| Handouts as Word from Markdown | `markdown-report-docx` (software-development) |
| Thai in handouts, slides and feedback forms | `human-writing` · Thai word breaking in exported files: `references/thai-line-breaking.md` |
| Learners who want to go on to a certification exam | `cert-prep` |
| Collecting learners' names or emails · recording teaching video | `pdpa-workflow` (e-commerce) |
| Teaching contract and rights in the materials | `doc-contract-th` (e-commerce) |
| Quotation for training fees | `doc-quotation` (e-commerce) |
| Short clip promoting the course | `video-script-to-clip` (graphic-design) |

## Sources (checked 2026-10-23)

The full table of sources (Bloom · rubric · Kirkpatrick · copyright · Creative Commons · Git): [references/sources.md](references/sources.md)


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

- **Slides**: for storyline, conclusion-style slide titles, layout and Thai fonts, use `presentation-design` (software-development). If the deck must open offline, as a single file, with speaker notes, use `html-slide-deck` (software-development). If that plugin is not installed, tell the user, then use section 6 of `human-writing` (a slide title is the conclusion of the page).
- **Slides are not handouts.** A slide has a conclusion-style title, a picture, or a short piece of code. Details and commands to type along go in the handout, so learners do not need to photograph the screen.
- **Thai handouts**: write them by `human-writing` at the "explain" register (no ครับ or ค่ะ in the body) · commands go in a code block that can be copied, pasted and run · spell out abbreviations on first use · call the same thing by one word across slides, handouts and exercises · run `thai_tells.py` before sending to print.
- **1-page summary (cheat sheet)**: the commonly used commands with examples, which learners can take back and keep beside the screen.
- To export to Word or PDF, use `markdown-report-docx` (software-development) · break Thai words in the exported file by `human-writing` `references/thai-line-breaking.md`.
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
- **Who owns the material you make.** If you made it as an employee, the copyright belongs to the creator unless a written agreement says otherwise, but the employer may publish it within the purpose of the employment (section 9). If you made it under a commission for someone else, the copyright belongs to the commissioner unless agreed otherwise (section 10). An independent trainer who wants to reuse the slides elsewhere should write that into the contract before the work starts. Use `doc-contract-th` (e-commerce).


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


---

# skill: human-writing

Use before writing anything people read, in Thai or English

# human-writing — write like a person: smooth to read, easy to understand

Applies to everything a person will read, from chat to labels in a diagram. This skill teaches good Thai and good English. Rules about Thai output stay as written. Examples of every rule and their sources → [`headings-and-examples`](references/headings-and-examples.md). Thai of 1 paragraph or more → [`thai-grammar`](references/thai-grammar.md) (sentence structure · register · example paragraphs in [`thai-examples`](references/thai-examples.md)). Research or work sent to outsiders → [`strict-review`](references/strict-review.md). Thai documents with justified alignment → [`thai-line-breaking`](references/thai-line-breaking.md). It lives only in plugin `superuser`; other plugins share it through `dependencies`.

Boundary: this skill owns the wording. The look of kept documents (headings, tables, text boxes, theme) → `polished-document-style`. Abbreviations and glossaries → `spell-out-abbreviations`.

## 1 · Core principles

- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

## 2 · Symbols and numbers

- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral · the words around a symbol must be human language.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ — that is, if … then … · and then · as for · because). Do not chain sentences into fragments with `→` or `·`.
- In tables, short text is fine, but it must still read as human language, not code.
- A symbol must never replace a word so far that the reader has to decode it. If an outsider must guess what the arrow means, add words.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes, because readers spot them at once as AI-written. Use bold words instead, such as **หมายเหตุ** (note). Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` (example) from the first place they appear.
- **Dates** in Thai text use Buddhist Era (พ.ศ.) or Common Era (ค.ศ.), one style across the whole set. File names, codes, and machine-read data use Common Era `YYYY-MM-DD`.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่` (done · in progress · blocked · awaiting approval · pending). Check results use `ผ่าน · ไม่ผ่าน` (pass · fail).

## 3 · Words

- Use words people actually say. No bureaucratic words or literal-translation jargon.
- Keep terms the field already uses in English (token · prompt · API · OCR).
- Abbreviations → follow `spell-out-abbreviations`. Explain a coined or confusing term the first time you use it.
- Call one thing by one word across the whole set: chat, slides, documents, and diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch back and forth inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ" — empty Thai fillers such as "ทำการ" before a verb).
- **Cut items, not function words.** Every kind of length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing content, or moving it to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` (Thai function words: future marker, "to/let", "also", "too", "then", emphatic particle) or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). These do work in the sentence. Cut them and Thai turns curt and reads like a translation.
- Avoid moves that look AI-written: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" (not just… but also…) used for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" (certainly) · closing with "หวังว่าจะช่วยได้" (hope this helps) · using "หลาย" (several) when you know the number · stacked hedges (hedge once, at the point you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge — elevate · seamless · cutting-edge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…" — "In the digital age where…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ." — "Fast. Easy. Complete.") · claims a competitor could also make: put in a real name or number instead · for the look of the work, use `no-ai-look`.

## 4 · Answering in chat

- First sentence answers directly, then the reason.
- Short question → short answer, 2–3 sentences, no headings or tables.
- Use a table to compare 2 or more options or many numbers. Use a list when there are several items to scan. No nested bullets (split sub-topics into a new bold heading). 2–3 short items go on one line separated by ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right. No long apology. If unsure, say where and how to check. Do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, and close with 1 question that is easy to answer.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" (confused) or "พูดง่าย ๆ" (say it simply): rewrite the last answer at half the length, with no unexplained jargon and no new content.
- End with 1 thing they can actually do next. No recap.
- **Answering from a document or the web**: retell in your own words, never translate sentence by sentence · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · put sources together at the end of the answer.

## 5 · Documents and reports

- The first paragraph is the conclusion. Reading only it must give the point.
- Headings say what the content is, not the category name · at most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning.
- Footnotes are for definitions and number sources · never hide an important conclusion in a footnote.
- Work summaries and status reports: bold headings only as needed, **ผล** (result) → **ที่ทำ** (what was done) → **ต่อไป** (next) (add headings when there is real content, such as awaiting approval) · cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision · tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (verified · from a source · inferred · not yet checked; meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires. This file covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the whole piece.

## 6 · Slides and headings of every kind

Applies to slide titles, figure titles, document headings, and box titles in a diagram. The full rules and the before → after table are in the same reference.

- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the page body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast — because or so · as for · but) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader.
- The verb matches what the page shows · do not use "คน" (person) for things that are not people.
- The caption under a picture must say what the picture does not. If it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is actually spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

## 7 · Diagrams

- Box labels are short nouns of 1–4 words people understand · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## 8 · 7-point check before sending

1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer the question or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Is there any padding you can cut without changing the meaning? If so, cut it. But `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding (section 3). If cutting made a sentence curt, put them back.
6. Does every heading pass section 6: 2 parts have a connector · a phrase people say · words fit the reader · the verb matches what the figure shows?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only, does not judge), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. For language, taste, and looks, the final verdict belongs to the user, not to the model doing the check.


## reference: headings-and-examples.md

# Headings, slides, diagrams and before → after examples (full version)

Read when writing a slide title, figure title or diagram label, or when you want examples of fixes. The short rules are in `SKILL.md` sections 6–7.

## Slides and headings of every kind

- A slide title = the conclusion of the page, not the topic name: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**Write titles that read smoothly and are not ambiguous.** This applies to slide titles, figure titles, document headings and box titles in a diagram.

- **A title with 2 parts needs a connector** (ส่วน · แต่ · เพราะ · จึง — as for · but · because · so). Do not just place 2 phrases side by side, because the reader has to guess how the 2 parts relate.
- **The connector must match the real relationship.** Use "เพราะ" or "จึง" only when one part really is the cause of the other. If the 2 parts just split roles, use "ส่วน". If they contrast, use "แต่". 1 title, 1 connector. If it needs 2, you crammed too much in: cut it down to one topic.
- **The title must still be short.** A slide title is at most 2 lines (about 15 words). If it is longer, move detail down into the page body. Do not add connectors until the title becomes a paragraph.
- **Use phrases people actually say.** If shortening leaves a string of nouns such as "AI ทำงานภาษา", find the verb people really use, such as "AI ช่วยเขียนคำตอบ".
- **Choose words by reader.** If the reader is not technical, use "ระบบ" (system) instead of "โค้ด" (code) and "ตรวจขาเข้า" (check incoming) instead of "Guard". Technical terms are fine when the reader is a technical team.
- **The verb must match what the page shows.** If a box in the figure is a checking step, use "ตรวจ" (check) or "ตัดสิน" (judge), not "ตัดสินใจ" (decide), which sounds like choosing a path.
- **Do not use "คน" (person) for things that are not people**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **The summary line under a figure must say what the figure does not.** If it is only an arrow chain of steps that repeats the figure, cut it, or replace it with 1 sentence saying why this figure matters.
- **Test**: read the title once to an outsider. If they cannot retell it in their own words, or have to ask "what does that mean", rewrite it.
- Page structure: problem → fix → result. Each part can be read in one glance.
- Write a speaking script the way it is actually spoken. It must read aloud without tripping.

## Diagram

- A box label is a short noun of 1–4 words that people understand: "รับข้อมูลเข้า" not "Ingress Layer Handler"
- An arrow label is a verb: "ส่งไฟล์" · "ตรวจสิทธิ์". An unlabelled arrow must be impossible to misread.
- Every word in the figure must match the word in the document.
- The figure title is a conclusion, like a slide title. Under the figure, 1 sentence says what to look at.
- If the project has a house style, follow it. For how to draw, see the figure skill of that plugin.

## Before → after examples

Write a condition as a full sentence with a connector (section 2):

  - Before: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - After: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - Before: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - After: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| Before | After |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทุกข้อความผ่าน 8 ขั้น: AI ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ | ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน |
| Guard ขาเข้า (ในรูปที่ทำให้คนทั่วไปดู) | ตรวจขาเข้า |
| guard ขาเข้า → ค้นคลังความรู้ → แนบกฎร้าน → Typhoon → guard ขาออก (บรรทัดใต้รูปที่ซ้ำกับรูป) | AI มีหน้าที่เขียนให้อ่านง่าย ส่วนเรื่องเงิน เวลา และกฎร้าน ระบบตรวจทุกครั้ง |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .claude/superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.claude/superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |
| `${CLAUDE_PLUGIN_ROOT}` คือ path ของ version ที่ติดตั้งอยู่ และจะเปลี่ยนเมื่อ plugin อัปเดต ส่วนโฟลเดอร์เก่าระบบจะลบทิ้งเองภายหลัง [ที่มา] | แต่ละ version ติดตั้งเป็นโฟลเดอร์ของตัวเอง พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่ แล้วลบโฟลเดอร์เก่าทิ้ง |
| ข้อยกเว้น: plugin จาก marketplace บน claude.ai … จะไม่ถูก pin ด้วยฟิลด์นี้ (แยกย่อหน้า) | … ไม่งั้นเครื่องที่ลงไว้จะใช้ชุดเก่าต่อ (ยกเว้น plugin จาก marketplace บน claude.ai ซึ่งเห็นการแก้ทันที) |

## Examples for the rules in SKILL.md (moved from SKILL.md)

| Section | Rule | Example |
|---|---|---|
| 1 | Plain words (English) | buy, not purchase |
| 2 | `→` order of steps | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` separates nouns | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` introduces detail | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | Write numbers as numerals | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | Say what the number means | "กำไร 32% ของราคาขาย" not a bare "margin 32%" |
| 2 | Compare so it is easy to picture | "เร็วขึ้น 3.2 เท่า" reads easier than "ลดลง 69%" |
| 2 | Uncertain result | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | Words people actually say | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | Abbreviation at first use | Large Language Model (LLM) |
| 3 | Coined term | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | Cut padding words | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | No stacked hedges | อาจจะ · น่าจะ · ในบางกรณี in one sentence |
| 4 | First sentence answers directly | Asked "ใส่ในรายงานดีไหม" → "ควรใส่ครับ", then the reason |
| 4 | Report by result | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | Cause and effect in one paragraph | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | Bold labels | **ระวัง:** · **สิ่งที่ยังอยู่:** not "**ระวัง (เจอบ่อย):**" |
| 5 | Heading says the content | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" is better than "ผลการทดลอง" |
| 5 | Column heading | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | Phrase people say | "AI ช่วยเขียนคำตอบ" not "AI ทำงานภาษา" |
| 6 | Words by reader | General reader: "ระบบ" "ตรวจขาเข้า" instead of "โค้ด" "Guard" |
| 6 | No "คน" for non-people | "ให้ระบบตัดสิน" |

Sources: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย (guide to drafting Thai documents)


## reference: strict-review.md

# Strict review — for research and work sent to outsiders

The default for `human-writing` is a **normal check**: go through the 7 points in section 8 of SKILL.md once, then send. Use this file only when the user asks for a **strict review** (ตรวจเข้ม).

**Passing the rules ≠ reading smoothly.** The review pass catches only what has a rule (sentence structure · words to avoid · register). Work that passes every rule but has no voice is called **flat** (`อ่านแบน`). Label it as flat. Do not report it as passing. Whether it reads like a person wrote it is for the user to decide by reading aloud, not for the model doing the check (the model that drafted and the model that checks share the same blind spots).

## When to turn it on

- The user says "ตรวจเข้ม" · "ตรวจแบบงานวิจัย" · "ขัดภาษาให้สุด" · "วนตรวจจนไม่เจอที่ผิด" · "strict"
- Or the work is a thesis · independent study (IS) · research article · report for a lecturer or committee · official letter, and the user did not ask for the quick version.
- For book structure, chapters and citations, use skill `thesis-writing` (plugin `personal-life`) alongside. This file covers language only.

## Steps

1. **Open [`thai-grammar`](thai-grammar.md) in full**, and [`thai-line-breaking`](thai-line-breaking.md) if the output is a file.
2. **Choose the register** from the table in section 4. Research uses the academic register. State the chosen register on the first line of the review result.
3. **Read the whole piece once first** without editing. For work over 3,000 words, review chapter by chapter. Tell the user how you split it, then carry on without stopping to ask.
4. **Review pass.** Run `python scripts/thai_tells.py <file>` first (the machine catches words to avoid · connectors over budget · mid-paragraph dots · ๆ with no space), then read it yourself for what the script cannot see. Record every spot in a table. Do not edit while recording.

   | # | Rule code | Original text | Fix |
   |---|---|---|---|
   | 1 | `t-chueung` | …ซึ่งพัฒนาโดย… ซึ่งเปิดเป็น… | … |

   **Sort by weight, not by the order found.** At the top are the spots that tell the reader at once a machine wrote it: canned opening sentences · recap at the end of a paragraph · groups of 3 everywhere · broad ad words · repeated sentence structures side by side. Then the small things (extra connectors · punctuation). Fixing the top 5 first often makes several of the lower ones vanish. A short piece with only small findings is fixed in one pass, with no loop.
   **Compare with the author's voice.** If there is text the user wrote themselves (`ก่อน → หลัง` pairs in `~/.claude/superuser-style.md` · earlier emails or chapters by the user), read against it: sentence length · pronouns · sentence-final particles · words the user never uses. Record each spot that differs from the user's voice with code `v-voice` in the table. If there are no samples, check against the rules only, and label the result `อ่านแบน` as usual (idea from humanizer by blader · MIT).
5. **Fix pass.** Fix according to the table, then reread the whole piece (do not look only at the fixed spots, because fixing one spot often makes the neighbouring joins stumble).
6. **Repeat steps 4–5** until the review pass finds nothing. **At most 5 rounds.** If spots remain after 5 rounds, report them with the reason they were not fixed.
7. If working under `superuser`, make each review round a new `reviewer` (small model · low effort), and let the lead do the fixing. The `reviewer` may report only the rule codes found, and does not judge whether it reads smoothly. For the fix pass, give the fixer the whole rule set, not just the points flagged (if you give only the flagged points, the fixer will keep going in circles).

## Extra checks for research

| Code | Check |
|---|---|
| `a-register` | Academic register throughout · no ครับ/ค่ะ · no ผม/ฉัน (use `ผู้วิจัย` or drop the pronoun) · every formal-side word in the pairs of the `r-drift` table · `สามารถ…ได้` complete |
| `a-term` | One word per technical term across the whole book · first use written as `ไทย (English)`, then Thai afterwards · abbreviations spelled out at first use in every chapter · matches the Royal Society of Thailand's coined terms where they exist |
| `a-claim` | Every statement of fact has a citation · no citing a source that was not opened · the researcher's opinion is clearly separated from fact |
| `a-hedge` | Hedge only as far as the data supports: a result from a small sample says `ในกลุ่มตัวอย่างนี้` · no stacked hedges · no claiming more than the result shows |
| `a-number` | Numbers have units · same decimals across a table · numbers in the text match the table · percentages state the base |
| `a-ref` | Tables, figures and equations are numbered and referred to in the text before they appear · figure and table titles are conclusions |
| `a-cite` | One citation style across the whole book (APA 7 or the faculty's) · the reference list at the end covers everything cited in the text |
| `a-tense` | The method chapter and results are told as things already done · do not switch between `จะ` and `ได้` in one chapter |
| `a-break` | After export, run `scripts/thai_linebreak.py --check` and open the PDF to look at every page |

## What to send the user

- First line: the register used · the number of rounds · `ผ่านกฎ` (passed the rules) or `เหลือ N จุด` (N spots left) · if flat, say `ผ่านกฎ · อ่านแบน` with the paragraphs worth reading aloud.
- A table of fixes across all rounds (rule code · old · new). It lets the user answer the committee about what was changed and why.
- Spots not fixed, and why (for example wording fixed by the faculty's template · quoted speech).
- The fixed file overwrites the original. Keep the original in `_to_delete/`.

Source of the review loop: skill `kode-thai` in [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT) · adapted with a cap on rounds, and used only on request, because the full version costs tens of thousands of tokens per round.


## reference: thai-examples.md

# Thai paragraph examples, before → after (one register at a time)

Open before writing a long Thai paragraph, and look at the pair for the register you will use. Example pairs teach better than rules, because you see sentence structure and tone together. Rule codes are in [`thai-grammar`](thai-grammar.md).

**Rules of this file.** 1 pair = 1 paragraph. The "after" must be text the owner wrote or edited. Text written by the team is labelled `(ชั่วคราว)` (temporary) until the owner reads it and accepts it. At most 10 pairs per register. When a new rule absorbs a pair, delete that pair. Every pair states its source and date.

## Register อธิบาย (explain): README and technical docs

**Before**

> ในยุคปัจจุบันที่ข้อมูลมีความสำคัญอย่างมาก ระบบนี้ถูกออกแบบมาเพื่อทำการประมวลผลข้อมูลจากหลายแหล่ง ซึ่งจะช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลได้อย่างมีประสิทธิภาพ โดยระบบจะทำการดึงข้อมูลทุก 5 นาที ดังนั้นผู้ใช้จึงไม่ต้องกังวลเรื่องข้อมูลไม่อัปเดต

**After**

> ระบบนี้รวมข้อมูลจาก 3 แหล่ง (ERP · ไฟล์ Excel ของฝ่ายขาย · API ของขนส่ง) ไว้ที่เดียว ข้อมูลพวกนี้ระบบจะดึงใหม่ทุก 5 นาที เปิดหน้า dashboard เมื่อไหร่ก็เห็นตัวเลขของ 5 นาทีก่อน ถ้าแหล่งไหนล่ม แถวของแหล่งนั้นจะขึ้นเวลาที่ดึงได้ครั้งสุดท้ายแทน

Rules applied: `t-block` (ในยุคปัจจุบัน) · `t-padding` (ทำการ ×2 · มีความสำคัญ) · `t-thuk` · `t-chueung` · `t-budget` (ซึ่ง โดย ดังนั้น in one paragraph) · `t-reassure` · `f1` put the data first · `f2` condition comes first · "หลายแหล่ง" → the 3 named sources · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ธุรกิจ (business): proposal to a customer

**Before**

> เรามีความยินดีที่จะนำเสนอโซลูชันที่จะช่วยยกระดับการทำงานของท่าน ไม่ว่าจะเป็นการจัดการเอกสาร การอนุมัติ หรือการรายงาน ซึ่งทั้งหมดนี้จะถูกรวมไว้ในแพลตฟอร์มเดียว โดยทีมงานของเราจะทำการติดตั้งและฝึกอบรมให้อย่างครบถ้วน

**After**

> บริษัทฯ เสนอระบบจัดการเอกสาร (Document Management System: DMS) ที่รวมงาน 3 อย่างของฝ่ายจัดซื้อไว้ในหน้าเดียว คือยื่นเอกสาร อนุมัติ และออกรายงาน ติดตั้งและอบรมผู้ใช้ 20 คนให้เสร็จภายใน 15 วันทำการ นับจากวันลงนามในสัญญา ค่าใช้จ่ายและเงื่อนไขอยู่ในหัวข้อ 4

Rules applied: register ธุรกิจ (`เรา` `ท่าน` → `บริษัทฯ` and the department name) · broad ad words (ยกระดับ · โซลูชัน) → what is actually done · `t-mai-wa` · `t-thuk` · `t-padding` · `t-doi` · key term at first use as `ไทย (English: abbreviation)` · a number replaces "อย่างครบถ้วน" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ราชการ (official): resolution in meeting minutes

**Before**

> ที่ประชุมได้มีการพิจารณาเรื่องการจัดซื้อเครื่องคอมพิวเตอร์ ซึ่งฝ่ายไอทีได้ทำการเสนอราคามาแล้ว โดยที่ประชุมเห็นว่ามีความเหมาะสม ดังนั้นจึงมีมติให้ทำการจัดซื้อต่อไป ทั้งนี้ให้ฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จโดยเร็ว

**After**

> ฝ่ายเทคโนโลยีสารสนเทศเสนอจัดซื้อเครื่องคอมพิวเตอร์ 12 เครื่อง วงเงิน 420,000 บาท ตามใบเสนอราคาเลขที่ QT-2569-031 ที่ประชุมพิจารณาแล้วเห็นว่าราคาอยู่ในงบประมาณที่ได้รับอนุมัติ มติที่ประชุม อนุมัติให้จัดซื้อตามที่เสนอ และมอบฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จภายใน 30 วัน นับจากวันที่รับรองรายงานการประชุมฉบับนี้

Rules applied: `t-padding` (ได้มีการ · ทำการ ×2 · มีความเหมาะสม) · `t-chueung` · `t-doi` · `t-budget` (ดังนั้น · ทั้งนี้) · extras for the official register: call departments by their real names · figures and document numbers · keep `ดำเนินการ` because it is a standard form word · deadline `ภายใน X วัน นับจาก…` instead of "โดยเร็ว" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ข่าว (news): release note

**Before**

> ในเวอร์ชันนี้ เราได้ทำการปรับปรุงประสิทธิภาพในส่วนของการส่งออกรายงาน ซึ่งจะทำให้ผู้ใช้ได้รับประสบการณ์ที่ดียิ่งขึ้น นอกจากนี้ยังมีการแก้ไขข้อผิดพลาดต่าง ๆ อีกมากมาย

**After**

> ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จากเดิม 12 วินาที เพราะเปลี่ยนมาเขียนไฟล์ทีละก้อนแทนสร้างทั้งไฟล์ในหน่วยความจำ แก้บั๊กวันที่ใน Excel แสดงเป็น ค.ศ. ทั้งที่ตั้งค่าเป็น พ.ศ. (ฝ่ายบัญชีแจ้งเมื่อ 2 ต.ค.) เวอร์ชัน 2.4.0 · 22 ต.ค. 2569

Rules applied: register ข่าว (no `เรา` · first sentence says who does what to what · close with version and date) · `t-padding` · `t-block` (ในส่วนของ) · `t-chueung` · `f7` (นอกจากนี้) · "ต่าง ๆ อีกมากมาย" → say what was fixed · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register แชตร้าน (shop chat): replying to a customer about a late parcel

**Before**

> สวัสดีค่ะ ทางร้านต้องขออภัยในความไม่สะดวกเป็นอย่างสูงนะคะ ทางร้านได้ทำการตรวจสอบแล้วพบว่าพัสดุของลูกค้าอยู่ระหว่างการจัดส่ง ทางร้านจะทำการติดตามให้อย่างใกล้ชิด ไม่ต้องกังวลนะคะ

**After**

> ขอโทษด้วยนะคะที่ของยังไม่ถึง ร้านเช็กกับ Flash แล้ว พัสดุเลข TH1234 ออกจากศูนย์คัดแยกลาดกระบังเมื่อเช้านี้ ปกติถึงบ้านภายใน 1–2 วันค่ะ ถ้าพรุ่งนี้เย็นยังไม่ได้รับ ทักมาได้เลย ร้านจะเปิดเรื่องตามกับขนส่งให้ทันทีค่ะ

Rules applied: register แชตร้าน (`ทางร้าน` ×3 → `ร้าน` once per sentence · ค่ะ in every message · keep the apology, because polite words are not padding) · `t-padding` (ทำการ ×2) · `t-reassure` → the next step the customer can take · "อย่างใกล้ชิด" "อย่างสูง" → facts (parcel number · sorting centre · time) · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

---

Registers with no pair yet: marketing · personal · academic · complaint · job application · screen. Add them from the owner's edits under the rules above (`thai-grammar` section 8). The 5 team-written pairs above wait for the owner to read them aloud and accept or edit them.


## reference: thai-grammar.md

# Smooth Thai: 7-point composition framework · words to avoid · registers

Open this file when writing or editing Thai of 1 paragraph or more, or when a strict review is ordered (see [`strict-review`](strict-review.md)). Short chat messages, labels, buttons and variable names do not need it.

Thai written by AI carries English sentence structure: sentences run long, are chained with "ซึ่ง" and "โดย", and open the same way every time. Deleting banned words fixes only the symptom. The cause is sentence structure, covered by the 7 points below. Once the structure is right, most of the smaller rules pass by themselves.

Every rule has a code (`f1` · `t-chueung`) to cite during review.

**Contents**

- [1 · The 7-point composition framework](#1--the-7-point-composition-framework)
- [2 · Moves AI likes to use (fix on sight)](#2--moves-ai-likes-to-use-fix-on-sight)
- [3 · Grammar AI often gets wrong](#3--grammar-ai-often-gets-wrong)
- [4 · Registers](#4--registers)
- [5 · Loanwords: pick 1 form per word, use it throughout](#5--loanwords-pick-1-form-per-word-use-it-throughout)
- [6 · Closing](#6--closing)
- [7 · Translating English into Thai](#7--translating-english-into-thai)
- [8 · Discipline for adding rules, and companion files](#8--discipline-for-adding-rules-and-companion-files)

## 1 · The 7-point composition framework

| Code | Point | Before (literal translation) | After (Thai) |
|---|---|---|---|
| `f1` | **Put the topic first.** Do not drag a long subject along as in English. Stop using `การที่…นั้น…` and `การที่ X ทำให้ Y`. | ระบบประมวลผลข้อมูลพวกนี้ทุก 5 นาที | ข้อมูลพวกนี้ ระบบจะ process ทุก 5 นาที |
| `f2` | **Condition and time come first.** Do not trail them at the end with "เมื่อ…". | DB จะเริ่ม timeout เมื่อ traffic พุ่งสูง | พอ traffic พุ่ง DB ก็เริ่ม timeout |
| `f3` | **Start a new sentence with a space or a new paragraph.** Do not put a full stop after every sentence. Use a full stop at the end of a paragraph, or between 2 long sentences on different topics. | เร็วขึ้น. ใช้ memory น้อยลง. ทีมพอใจ. | เร็วขึ้น ใช้ memory น้อยลง ทีมพอใจ |
| `f4` | **Close the clause with a final word:** `ด้วย` `แล้ว` `เลย` `อยู่` `อยู่ดี` `ต่างหาก`. A "ไม่ได้…อย่างเดียว" or "ไม่ใช่แค่…" sentence must close with `ด้วย`. A "ไม่ได้อยู่ที่ X อยู่ที่ Y" sentence must close with `ต่างหาก`. | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุน | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุนต่างหาก |
| `f5` | **Drop a subject that is already known, and use a demonstrative instead of a pronoun** (`ตัวนี้` `เคสนั้น` `ตรงนี้แหละที่…`). Do not use `มัน` `เขา` `พวกเขา` for it/they. Take care not to drop so much that it is unclear who acts. | มันลด memory และมันยังปรับปรุงการทดสอบ | ทั้งลด memory และยังปรับปรุงการทดสอบอีกด้วย |
| `f6` | **Use "ก็" to control rhythm:** `พอ X ก็ Y` · `ถ้า X ก็ Y` · `X แล้วก็ Y`. Link a sequence of actions with `แล้ว`. | ถ่ายรูปบิล ระบบอ่านรายการให้เอง | ถ่ายรูปบิลแล้วระบบจะอ่านรายการให้เอง |
| `f7` | **Change topic with a question, a demonstrative or "แต่"** instead of `อย่างไรก็ตาม` `นอกจากนี้` (this cuts about half of them). After listing 2–3 problems, put a turning point before the fix. | อย่างไรก็ตาม การใช้งานจริงมีข้อจำกัด | แต่พอขึ้น production จริง ก็มีเรื่องให้ปวดหัวอีก |

**"ก็" does not go everywhere (`f6-scope`).** A `…ทีไร` sentence does not need ก็ (`ลองทีไร พังทุกที`). A `ไม่ว่าจะ…เมื่อไหร่` sentence needs `ก็จะ`. A result that is the definition of its cause (cost = price of raw materials) takes no ก็ (`วัตถุดิบขึ้นเมื่อไหร่ ต้นทุนต่อจานขึ้นตามทันที`).

## 2 · Moves AI likes to use (fix on sight)

| Code | Move | Fix |
|---|---|---|
| `t-chueung` | "ซึ่ง" chained several levels deep | At most 1 ซึ่ง per sentence. Use "ที่" when the noun is clear. Or split the sentence. |
| `t-budget` | Frequent formal connectors | Per paragraph: ซึ่ง ≤ 1 · โดย ≤ 1 · ดังนั้น ≤ 1. `ทั้งนี้` does not open a paragraph (allowed near a disclaimer or a call to action). This budget does **not** count the final words `ด้วย` `แล้ว` `เลย` `อยู่`, nor `เพื่อ…เพื่อ` in official letters. If a final word reads oddly, restructure the sentence, do not delete the word. In an explanatory article, order connectors ดังนั้น → นอกจากนี้ (rarely) → แต่. |
| `t-doi` | `โดยที่… โดยการ… โดยมี…` | Use ผ่าน · จาก · ด้วย, or no connector at all. |
| `t-khanathi` | `ในขณะที่` used to mean "while (contrast)" / "but" | `A เชื่อ X แต่ B เชื่อ Y` · `ส่วน B กลับเชื่อ Y` (ในขณะที่ = the same period of time) |
| `t-thuk` | ถูก- in every sentence (literal passive) | ถูก/โดน is for bad things or an unknown doer. Otherwise say who did it. |
| `t-padding` | ทำการ · มีการ · ได้มีการ · มีความ + adjective · ที่มีความ | Use the verb directly: `ซับซ้อน` not `มีความซับซ้อน`. Exception: `เป็นความ + verb` (`เป็นความตั้งใจ`) must be kept. |
| `t-khong` | ของ…ของ…ของ | Join the nouns directly: `การพัฒนาเศรษฐกิจไทย` |
| `t-nueng-nai` | หนึ่งใน…ที่สุด (one of the most) | `…ที่สุดคนหนึ่ง` |
| `t-mai-wa` | ไม่ว่าจะเป็น A, B หรือ C (merely listing items) | `A B หรือ C` · `ทั้ง A B และ C` |
| `t-hedge` | Stacked hedges `อาจจะมีความเป็นไปได้ที่จะ` | A single `อาจ`, exactly where you are truly unsure. |
| `t-pronoun` | เรา…เรา…เรา / ท่าน | Drop after the first sentence. Address the reader as `คุณ`, not `ท่าน` (except in official letters). |
| `t-mun` | `มันเป็นที่ชัดเจนว่า` (it is clear that) | `ชัดเจนว่า` |
| `t-comma` | Commas around a modifier `แฮรารี, นักประวัติศาสตร์, แย้งว่า` | Use spaces. |
| `t-dash` | Long dash — and ; | Use a space, a new paragraph, or ที่/ซึ่ง. |
| `t-particle` | ครับ/ค่ะ in document body text | Allowed only in chat, quoted speech and personal blogs (opening, closing, and when speaking to the reader directly, such as `มาดูกันครับ`). |
| `t-overcut` | Cutting words until it turns curt: `อยากช่วย` `ใช้ template` `ส่งมา` | Thai does not "pay rent" on every word the way English does. `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` and the polite words `ขอ` `รบกวน` `นะ` do real work: `อยากจะช่วย` · `ให้ใช้ template` · `รบกวนส่งมาด้วยนะครับ`. The "cut words" rule of other skills applies only to padding words (`t-padding`). |
| `t-reassure` | Vague soothing `ไม่ต้องกังวล` `สบายใจได้` | End on a fact and the next step: `แอดมินจะแจ้งผลภายในพรุ่งนี้ค่ะ` |
| `t-force` | `ระบบบังคับให้…` `ระบบไม่อนุญาตให้…` (the system forces… / does not allow…) | Tell it as a capability or a sequence: `ต้องยืนยันอีเมลก่อน ถึงจะเข้าใช้ได้` (`ถึงจะ` for sequence · `ก็ต่อเมื่อ` for a single condition) |
| `t-samrap` | `สำหรับผมแล้ว ผมคิดว่า` · `สำหรับ…นั้น` opening a sentence | `ผมว่า…` · put the topic first as in `f1` |
| `t-topology` | Telling structure instead of the case `มีเส้นทางเชื่อมระหว่าง A กับ B` | Tell who does what and what happens: `ลูกค้ากดสั่ง ร้านเห็นรายการทันที` |
| `t-considered` | `ถูกพิจารณาว่าเป็น` `ถูกมองว่า` (is considered) | `ถือว่าเป็น` · `คนมองว่า` · or say who is looking. |

**Words and phrases to avoid (`t-block`).** Fix on sight, unless inside `` ` `` or quotation marks (quoted for discussion):

`ในยุคปัจจุบัน` · `ในโลกปัจจุบัน` · `ในโลกที่…` · `เป็นที่ทราบกันดีว่า` · `เป็นที่รู้กันว่า` · `ปฏิเสธไม่ได้ว่า` · `เป็นสิ่งสำคัญที่ต้องตระหนัก` · `มีความสำคัญ` (use `สำคัญ`) · `การที่…นั้น` · `ในเรื่องของ` · `ในส่วนของ` · `อย่างมหาศาล` · `อย่างน่าทึ่ง` · `อย่างไม่น่าเชื่อ` · `ทุกสิ่งที่คุณต้องรู้เกี่ยวกับ` · `โดยสรุปแล้ว` · `กล่าวโดยสรุป` · `นั่นเอง!` · `รีบ…เลย!`

Ad words that are acceptable when paired with a number: `อย่างมาก` · `อย่างมีประสิทธิภาพ` (business documents only) · a single `!` at a hook or call to action on a sales page, not elsewhere.

## 3 · Grammar AI often gets wrong

| Code | Topic | Example |
|---|---|---|
| `g-classifier` | Wrong or missing classifier | server 1 `เครื่อง` · function/parameter 1 `ตัว` · token/record 1 `อัน` · บรรทัด · หน้า · รายการ. If unsure, avoid counting. The official register needs exact classifiers (ถัง · ฉบับ · ราย); informal registers may use `อัน` `ตัว`. |
| `g-cha` | Missing `จะ` in a future or hypothetical sentence | `จะเลือกตัวไหนขึ้นอยู่กับ…` · `วิธีนี้จะคุม rate ได้` |
| `g-function` | Short connector used with the wrong function | `จะ` ≠ `จน` · informal language uses `เวลา` `ตอนที่` instead of `เมื่อ` · `เหมาะกับ` needs กับ |
| `g-verb` | Literally translated verb | burst ≠ `ระเบิด` (use `ยิง`) · drop ≠ `ทิ้ง` (use `ปฏิเสธ`) · match ≠ `ซ้ำ` (use `ตรง`) · cap ≠ `ครอบ` (use `จำกัดไว้ที่`) · throttle ≠ `บีบคอ` (use `ชะลอ` `หน่วง`). A verb that is a physical image in English often needs a different Thai verb. |
| `g-capability` | สามารถ…ได้ (can) | Academic, official and news writing use the full `สามารถ + verb + ได้`. General writing uses `verb + ได้`. |
| `g-time` | Period of time takes ของ | `ในศตวรรษที่ 20` not `ของศตวรรษที่ 20` |
| `g-tirai` | `ทีไร` must close with `ทุกที` or `ไม่เคย…สักที` | `ฝนตกทีไร น้ำท่วมทุกที` · `ทุกครั้ง` is weaker and breaks the idiom · `ทีไร…เสมอ` is borderline, avoid. |
| `g-quant` | A number paired with a feeling verb | `ตัวเลขไม่ตรงกับที่คาด` not `ที่รู้สึก` |
| `g-yamok` | Mai yamok attached to the word `ต่างๆ` `บ่อยๆ` | Put a space before and after: `ต่าง ๆ` `บ่อย ๆ` throughout. Source: spacing rules item ๑.๒.๑๕.๑ "เว้นวรรคเล็กหน้าและหลังเครื่องหมายไปยาลใหญ่ ไม้ยมก …" with example `วันหนึ่ง ๆ เขาทำอะไรบ้าง` · Royal Society of Thailand office https://www.orst.go.th/iwfm_table.asp?a=36 (checked 2026-10-26 · royin.go.th could not be opened from this machine; the same site moved to orst.go.th) |

## 4 · Registers

Choose the register before writing, then keep it for the whole piece (`r-drift`). Change only at a new heading.

| Work | Register | Final particle ครับ/ค่ะ | Speaker/reader |
|---|---|---|---|
| Technical docs · README · manuals · explanatory articles | อธิบาย (explain) | None | `เรา` / `คุณ` |
| Sales pages · landing pages | การตลาด (marketing) | None | `คุณ` only in the body (do not use `เจ้าของร้าน` `ผู้ใช้` in place of คุณ) |
| Personal blog · telling experience · team announcements | ส่วนตัว (personal) | Opening, closing, and when speaking to the reader directly | `ผม` / `ดิฉัน` according to the author (if unknown, use the owner's default in `~/.claude/superuser-style.md` and note it as `ตัดสินใจเอง`) |
| News · release notes · announcements · CHANGELOG | ข่าว (news) | None | No first person · first sentence says who does what to what · the source goes in sentence 2 · close with the version, date or source · `ดังนั้น` only when there is a real cause |
| Thesis · IS · research article · long analysis | วิชาการ (academic) | None | `ผู้วิจัย` or drop the pronoun · `เรา` only for shared experience |
| Official letters · meeting minutes · policy | ราชการ (official) | None | No first person · use standard-form wording (word table below) |
| Company letter to a customer · proposal · BRD FSD SRS · company profile | ธุรกิจ (business) | None | `บริษัทฯ` or the team name, not `เรา` · `คุณ` only in steps telling the reader to do something · key term at first use `ไทย (English: abbreviation)` |
| Customer chat · live selling · review replies · broadcast | แชตร้าน (shop chat) | In every message (ค่ะ or ครับ, one style for the whole shop) | The shop calls itself `ร้าน` or `แอดมิน` once per message · customer is `คุณลูกค้า` or dropped · end on a fact and the next step, no vague soothing (`t-reassure`) |
| Complaint letter · refund request · contract cancellation | ร้องเรียน (complaint) | None | `ข้าพเจ้า` · recipient `ท่าน` or the company name · facts, dates, amounts before the demand · deadline `ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้` · no threats, no apology |
| CV · job application letter · salary negotiation · LinkedIn | สมัครงาน (job application) | None in a CV · yes in letters and messages to HR | `ผม` / `ดิฉัน` · a CV bullet starts with a verb and ends with a number (`ลดเวลาปิดงบจาก 8 วันเหลือ 5 วัน`) · no `ซึ่งทำให้` |
| On-screen text · buttons · errors · notifications · placeholders | หน้าจอ (screen) | None | `คุณ` or dropped · a button starts with a verb (`บันทึก` `ส่งคำขอ`) · an error = what happened + what to do next, in 1–2 sentences · no stacked `กรุณา` `ท่าน` `ครับ/ค่ะ` · 1 word per action across the whole app, kept in a glossary |

**Person and reader do not switch within a paragraph (`r-deixis`).** Teaching uses `เรา`, advising uses `คุณ`, never mixed in a paragraph. In text that speaks to the reader, `ใคร` `คน` `ผู้ใช้` do not appear in place of the reader: `ขาดทุน แต่ไม่มีใครรู้` → `ขาดทุนโดยไม่รู้ตัว`

**Extra for the official register** (temporary · from one set of examples, waiting for real letters to confirm). A procedure sentence = doer + method + what is done + destination. Call documents by their real names, do not abbreviate like notes (`15/30/45`). Word swaps: เซ็น → `ลงนาม` · ทำ → `ดำเนินการ` · เช็ค → `ตรวจสอบ` · ส่งให้ → `ส่งมาเพื่อ…` · open questions → `ประเด็นที่ยังต้องการคำชี้แจง`. The official correspondence regulation in force is edition 4 of B.E. 2564 (checked 2026-10-22, edition 5 not found).

**Extra for the marketing register.** A single `!` at a hook or call to action · `…` as a coach-style pause is allowed in financial work · a soft close (`ลองได้เลย`) is better than a curt command · do not open a sales page with a definition `X คือ…` · financial work closes with 1 sentence of advice on moderation (`กู้เท่าที่จำเป็นและชำระคืนไหว`) and folds the disclaimer into a sentence in the same voice.

**Word pairs where you pick one side for the whole piece (`r-drift`)**

| Informal | Formal (academic · official) |
|---|---|
| ยังไง | อย่างไร |
| คนไหน · แบบไหน | คนใด · รูปแบบใด |
| เยอะ | มาก · จำนวนมาก |
| ทำไม | เพราะเหตุใด |
| ตอนนี้ | ขณะนี้ · ปัจจุบัน |
| อยากรู้ | ต้องการทราบ |

**Extra for the academic register.** Sentences may be long but must alternate with short ones · `ทว่า` `อย่างไรก็ตาม` `นอกจากนี้` only at real turning points · assert directly, do not hedge if the source did not hedge · open with a question or the frame of the topic, not something broad · close by posing a new question, not by recapping.

## 5 · Loanwords: pick 1 form per word, use it throughout

| Form | Use when | Example |
|---|---|---|
| Translate to Thai | A Thai word people know exists, or the Royal Society of Thailand coined one | เสรีภาพ · ผลิตภาพ · ทุนนิยม |
| Write the sound in Thai | Proper names, new words with no direct Thai word | อัลกอริทึม · บล็อกเชน · ซอฟต์แวร์ |
| Keep English letters | Brand names, abbreviations, terms developers use in English | Google · API · deploy · query |
| Coin a Thai term + brackets at first use | A core concept used repeatedly · abbreviations | ระเบียบในจินตนาการ (imagined order), then Thai only afterwards · ปัญญาประดิษฐ์ (Artificial Intelligence: AI), then Thai or AI, one style for the whole piece. This is the one form for every plugin (`spell-out-abbreviations` · `srs-writing` · `thesis-writing` refer here). |

Mix English only at a single noun or verb (`deploy โค้ด` `query ตาราง`), not `ทำการ deployment ของ code`. Write sounds in Thai following the Royal Society of Thailand's transliteration rules: no tone marks, unless the word's sound collides with a Thai word and causes confusion, such as `โค้ก` (item ๕) (`ซอฟต์แวร์` not `ซ้อฟต์แว่ร์`). Add the silencer mark (karan) on letters that are not pronounced (item ๓.๑). Choose 1 spelling per word and note it. (Source: Office of the Prime Minister announcement, "Rules for transliterating English", announced 26 August B.E. 2532, Royal Gazette volume 106 part 153, 14 September 1989 · read the PDF published by the Royal Society of Thailand https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000753.PDF pages 1-5, checked 2026-10-26 · the consonant table (table 2) has not been compared letter by letter.) Write a foreign person's name in Thai, then English in brackets at first use: `ไมเคิล แซนเดล (Michael Sandel)`. Do not use commas around a modifier.

## 6 · Closing

No recap (`c-recap`). End with what to do next, a newly posed question, or simply stop.

## 7 · Translating English into Thai

Use when the source is English (docs · error messages · papers · articles) and the result is Thai for people to read. Retell the whole paragraph, do not translate sentence by sentence.

1. Reorder by `f1` `f2`: topic first, condition and time first. Turn English passives back into who-did-it (`t-thuk`), except for bad things or an unknown doer.
2. Add nothing the source lacks: no ครับ/ค่ะ, no `อาจจะ` or other hedges the source did not make. Do not drop numbers or conditions.
3. Translate idioms by meaning, not word by word. For an author's metaphor used throughout the piece, coin 1 Thai word and use it every time (section 5, row 4).
4. `it is … that …` `there is` `one of the most` have no Thai form: `ชัดเจนว่า` · `มี…` · `…ที่สุดคนหนึ่ง` (`t-mun` `t-nueng-nai`) · `is considered` is not `ถูกพิจารณาว่า` (`t-considered`).
5. English italics used for emphasis become a final word or word order in Thai (`ต่างหาก` `เลย` `แหละ`), not italics. Foreign person's name `ไมเคิล แซนเดล (Michael Sandel)` at first use.
6. Technical terms stay English per section 5. Verbs that are physical images (burst · cap · throttle · drop) take a different Thai verb each (`g-verb`). Choose classifiers yourself, do not translate `a` `an`.
7. Read the whole paragraph aloud. If you can tell the source was English, restructure it.

## 8 · Discipline for adding rules, and companion files

- **A new rule needs a source:** the owner's edit (before → after) · a source actually opened, with its date · or a real run result. If none, tag it `(ชั่วคราว)` (temporary), like the extra official-register rule above.
- **The user edits an agent's Thai.** Before adding a rule, search this file for whether the rule already exists. If it exists but was not applied, fix the wording or move the rule, and do not add a duplicate. If not, store the before/after pair in [`thai-examples`](thai-examples.md) first (the "after" text must be the user's, not one the agent wrote). Only when it repeats 2 or more times, summarise it into a rule. The examples file keeps at most 10 pairs per register, and a rule that absorbs a pair deletes that pair.
- **Before/after pairs teach better than rules.** Before writing a long Thai paragraph, open [`thai-examples`](thai-examples.md) and look at the pair for the register in use.
- **Automatic checker** `scripts/thai_tells.py` catches `t-block` `t-budget` `t-padding` `f3` (mid-paragraph full stops) `g-yamok` `t-dash` and `ทั้งนี้` opening a paragraph. It only warns, and does not judge whether the text reads smoothly. What the script cannot see (`f1` `f2` `f4`–`f7`, register) you still have to read yourself.
- **Thai letters in exported files** (line breaking · spacing · line-height per medium) live only in [`thai-line-breaking`](thai-line-breaking.md). Other skills link to it.

---

Source: distilled from [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT License · Copyright (c) 2026 Chakrit Wichian · full licence text in [`THIRD-PARTY-NOTICES`](../THIRD-PARTY-NOTICES.md)): the 7-point framework · files `ai-tells` · `grammar` · `register` · `style-rules` · `forbidden-phrases` · `decisions/` (polite words are not an AI tell · Thai does not cut words the English way · do not let the model judge language quality · example pairs before rules), checked 2026-10-22. Academic sources as cited by that repo: Iwasaki & Ingkaphirom · Takahashi 2023 (ก็) · Olsson 2013 (แล้ว) · spacing rules of the Royal Society of Thailand. The 5 extra register rows (business · shop chat · complaint · job application · screen) come from sweeping the templates in the SQT-Marketplace plugins on 2026-10-22.


## reference: thai-line-breaking.md

# Breaking Thai words so lines wrap cleanly

Use whenever you export a Thai document as Word · PDF · HTML · slides with justified paragraphs, or when you see a line with stretched letter spacing (`เ ท ค โ น โ ล ยี`).

## Why it happens

Thai has no spaces between words, so the program must guess where to break. If it cannot guess (a run tagged as English · a font that does not support Thai · a file generated by a script), the whole block of Thai text becomes one long word. The previous line is left with empty space, and justification then stretches the spacing letter by letter to fill the line.

## Fix by file type

| File | Fix |
|---|---|
| **.docx** (made by you or received) | Run `python scripts/thai_linebreak.py <file>.docx` after the file is built. It inserts invisible break points (U+200B) between words · tags runs as Thai · binds numbers to neighbouring words ("4 ประเด็น" does not split across lines) · keep the original in `_to_delete/` · test the script itself with `python -B scripts/thai_linebreak.py --self-test` (pythainlp not needed). |
| **.md before converting with pandoc** | Run the same script on the .md · code inside `` ` `` is not touched. |
| **python-docx / docx-js** | Set the Thai language on the run (`w:lang w:bidi="th-TH"`) and the complex-script font (`w:rFonts w:cs="TH Sarabun New"`) at creation time, then run the script at the end. |
| **HTML** | Chrome · Edge · Firefox break Thai words on their own, no ZWSP needed · set `<html lang="th">` · CSS `word-break: normal; overflow-wrap: anywhere; line-break: auto;` · use `text-align: left` for Thai content · never `word-break: break-all` (breaks mid-word). |
| **PDF** | Fix at the source (.docx or HTML), then convert again. |
| **Slides .pptx** | Thai text boxes left-aligned · long text cannot go through the script, so break lines by hand at phrase boundaries. |

## Paragraph alignment

- General Thai content: **left-aligned** is the safest.
- Academic or official work that needs justification: use "ชิดสองข้าง" (justify, `both`) only **after** running the script.
- Do not use "กระจายแบบไทย" (Thai distribute, `thaiDistribute`) or "กระจาย" (distribute, `distribute`) for body text, because they stretch letters on every line. The script reports paragraphs that use them, and can change them with `--align both` or `--align left`.

## Never break here

- A number and its unit or prefix: `4 ประเด็น` · `ตารางที่ 1` · `พ.ศ. 2569` · `50 %`
- Before `ๆ` `ฯ`, and before vowels or tone marks that cannot start a line.
- Short proper names: `IEEE Transactions`. If it is hard to read after wrapping onto a new line, hold it together with a non-breaking space.

## Line spacing per medium (the central values other skills refer to)

Thai has upper vowels, lower vowels and tone marks that can stack 2 levels, so it needs more line spacing than Latin. Pure Latin can use 1.2–1.4, but for Thai below about 1.4 the upper vowels and tone marks collide or get clipped. The values in the table are the central values the skills in this set use. Change them here, and the skills that refer to them follow.

| Medium | Body text | Headings | Used by |
|---|---|---|---|
| Web page (CSS `line-height` times font size) | 1.6 · long articles 1.75–1.85 | Thai not below 1.4 · large pure-Latin headings can go down to 1.0–1.1 | `web-app-design` · `dynamic-website` |
| Mobile app | 1.5–1.75 · the smaller the screen, the more spacing | Not below 1.4 | `mobile-app-design` |
| Windows app | 20px at 14px text for on-screen text · long paragraphs 22px | Follow the Fluent scale | `windows-app-design` |
| Slides | Not below 1.5 | Not below 1.4 | `presentation-design` |
| Graphics · posts · posters | 1.5–1.7 | Not below 1.4 | `brand-kit` · `graphic-design` |
| Diagram | Not below 1.5 | — | `diagram-figures` |
| Word .docx (Tahoma font) | 1.3–1.35 as "Multiple" (หลายเท่า) | Follow the template | `branded-document-design` |

**Word does not count the same way as CSS.** "Multiple" in Word multiplies the line height that the font itself defines, and Thai fonts already reserve room for vowels and tone marks. So the number in Word can be lower than on the web without lines colliding. Whenever you change the font, reopen the PDF and look at every page again.

**Web pages must tolerate user adjustment.** WCAG 2.2 criterion 1.4.12 (level AA) requires that when the user sets line spacing to 1.5 times the font size, content must not be cut off or overlap. How to check is in `web-quality-audit`.

## Check

1. Run `--check` to see the number of break points and the paragraphs that are distributed.
2. Convert to PDF and open every page, looking for lines with abnormally wide letter spacing.
3. The word segmenter (pythainlp `newmm`) can break wrongly now and then, for example `ท่า|ทางการ` where it should be `ท่าทาง|การ`. A wrong break point does not change the text, it only may start a new line mid-word. If you find it on a real line, fix that spot by hand.

**Good to know:** the invisible break points are in the actual file. Searching for a word in Word mostly still finds it, but if you copy text into another system and search fails, run the script on the print copy only.
