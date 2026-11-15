# playbook · performance — it is slow: measure first, fix one thing at a time, measure again

Use when: a slow page · a slow API · a slow build · memory use · you want one number to improve until it reaches a target · if the symptom should never happen at all (a leak · running while idle) → `bug-fix` (covers pstack's `perf` · `hillclimb` · `trace forensics`)
Main skills: `principle-prove-it-works` · `decision-log` · `observability-basics`

## ขั้นตอน · Steps (copy into the todo as written)

1. Set the one number to watch (for example, report page load time in seconds), how to measure it, and the target. If there is no target, set "at least 20% better" and log it in `decision-log` · ใคร: หัวหน้าทีม
2. **Measure the baseline at least 3 rounds** on the same data set and the same machine. If `.sandbox/` exists (a root exception per `project-doc-set` item 1), measure inside the sandbox, then save the raw values to `_to_delete/perf/<เรื่อง>.tsv` · ใคร: `qa-tester` ตัวใหม่
3. Find what limits that number — profiler · trace · query plan · timing log per stage. If you get a profile file (cpuprofile · heap snapshot), read it with a tool; do not guess from the code · ใคร: `developer` ตัวใหม่ (hard root cause: `model: opus`)
4. Form hypotheses one at a time, for example "slow because of X; if X is fixed the number should drop by about Y" · ใคร: `developer` ตัวใหม่ (given the result of step 3)
5. Fix one at a time (`lazy-coding`), then re-measure 3 rounds. If it is really better, beyond the noise of the measurement, keep it, and commit once per fix that works, with the before/after numbers in the message (per the commit rules in `superuser` section 6; if not allowed, keep it as a separate patch in `_to_delete/perf/`). If it is not better, revert the fix cleanly before trying the next one, and do not stack fixes that are not proven · ใคร: `developer` ตัวใหม่ fixes · `qa-tester` ตัวใหม่ measures
6. Put every hypothesis in the table `| สมมติฐาน | ก่อน | หลัง | เก็บ/ทิ้ง |` (hypothesis | before | after | keep/drop) in `decision-log` · ใคร: หัวหน้าทีม
7. Repeat steps 4–6 until the target is met, or until the remaining hypotheses are not worth it. If 3 fixes in a row fail in the same direction, go back to step 3, because what was thought to be the limit may be wrong · ใคร: หัวหน้าทีม
8. Check (ตรวจ) the whole set — the fixes kept · the raw values · the hypothesis table · ใคร: `reviewer` ตัวใหม่
9. Report — the before/after numbers with the number of rounds measured, and what limits the number now, then finish with `status-report` · ใคร: หัวหน้าทีม

## Done when

The number reached the target or there is a reason why you stopped, and every fix that was kept has a before/after measurement attached
