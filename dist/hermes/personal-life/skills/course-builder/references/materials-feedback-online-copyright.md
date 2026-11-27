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
