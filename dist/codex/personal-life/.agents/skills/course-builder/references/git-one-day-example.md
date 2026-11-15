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
