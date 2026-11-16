# skill: principle-prove-it-works

Use before saying work is done, fixed or working

# principle · prove it works — prove it against the real thing

> **One rule:** before using the words done (`เสร็จ`) · fixed · passed (`ผ่าน`) · works · sent, you must have seen the result from the real thing yourself in this round.

## Use when
- You are about to report work as done, fixed, passed, working, or sent
- A sub-agent reports done, or a draft for an outsider says "fixed"

## Steps
1. Before starting, write "how will I know it is done" in a checkable form.
2. After the work, check against that on the real thing and record the raw result (numbers · images · output). Use the evidence column below.
3. If you truly cannot check (no environment · needs a real account), say plainly `ยังไม่ได้ตรวจ` and what is missing; never write `ผ่าน`.
4. For an item whose result you have not seen, write what was done and what the result is separately, e.g. "CSV: code changed, not yet opened in Excel". Do not write "fixed, but not tried yet": readers remember done and forget but.
5. If a draft for a customer or outsider says "fixed" while the check is unfinished (even with "now testing"), write 1 version to send after the result is seen. The version that can be sent now must not contain "แก้แล้ว", "แก้ไขแล้ว" or "เรียบร้อย" in any form; it may say only "ได้รับเรื่องแล้ว ทีมกำลังตรวจ จะแจ้งผลภายใน (เวลา)".

| Work | Evidence that counts |
|---|---|
| Document · report | A fresh reviewer opens the rendered file and checks the requirements one by one (the writer does not reread its own work) |
| Numbers · formulas · amounts | Recompute another way on 2–3 rows; the total matches the source (receipt · statement) |
| Message to a customer · email · booking | Read against the original question; name · amount · date match the real data; for a booking, see the confirmation page |
| Feature in an app | Click it in the running app using the app-checking skill and see the criteria met (compiling or reading code does not count) |
| Fix of a bug | Repeat the case that failed before, by the same path, and it passes |
| Test · check | Pass/fail numbers come from this round's summary line (or `node scripts/test-verdict.mjs <TAP or JUnit result file> --expect <count>` → PROVEN · PARTLY · NOT PROVEN), never from memory · then break 1 line in a copy (invert a condition · return early); the test covering it must fail, otherwise the test proves nothing yet |
| Screenshot · render | Judge from the pixels of an image you opened yourself, looking for failure signs first (red or blank screen, a box covering content), then compare with the log · ambiguous counts as failed · name the image file in the evidence |
| Mockup | Open in a browser and click every button; no fake buttons |
| Measured values (sensor · lux · distance · weight) | Compare with a calibrated instrument · an emulator proves only the work path (label `emulator`); accuracy needs the real thing (label `เครื่องจริง <รุ่น>`) · no instrument → `ยังไม่ได้ตรวจ` |
| Works on another system (Windows · macOS · another machine) | Label every claim `observed` (ran it there) or `reasoned` (worked out); a pass on your own machine is the weakest evidence for another system |
| Sub-agent work | Read the work and run it yourself |

**Not evidence:** hedge words ("น่าจะใช้ได้" · "ควรจะผ่าน" · "ในทางทฤษฎี" · "เหมือนครั้งก่อน": in a final report they are a red flag, go back and check) · "test ผ่านแล้ว" with no output · "ไม่มี error" (no error is not the wanted result) · exit 0 or status `running` (exit 0 says only the program ended) · a sub-agent's own report · sending the user a command to run when you could run it · checking only the easy part. Full table with reasons and the `vastai` exit-0 case: [`references/evidence-table.md`](references/evidence-table.md).

## Check before done
- Every "done" word in the report has a raw result from this round behind it
- Anything not seen is labelled `ยังไม่ได้ตรวจ`, with what is missing
- No hedge word survives in the final report

## References
- [`references/evidence-table.md`](references/evidence-table.md) — open when judging a test, screenshot, measured value, cross-system claim, or sub-agent result, or when a claim of yours sounds like one on the "not evidence" list; also holds the sources


## reference: evidence-table.md

# Evidence by kind of work, and claims that do not count · principle-prove-it-works

Open this when the work is a test, a screenshot, a measured value, a cross-system claim, a message to a customer, or a sub-agent result, or when a claim in your own report sounds like one in the second table.

## Evidence by kind of work (full wording)

| Work | Evidence that counts | Does not count |
|---|---|---|
| Document · report | A fresh reviewer opens the rendered file and checks the requirements one by one (the writer does not reread its own work) | The file was written successfully |
| Numbers · formulas · amounts | Recompute another way on 2–3 rows, and the total matches the source (receipt · statement) | The formula shows no error |
| Message to a customer · email · booking | Read it against the original question; name · amount · date match the real data, and for a booking you see the confirmation page | The draft looks good · a button was pressed and no error appeared |
| Feature in an app | Click it in the running app using the app-checking skill, and see the result meet the criteria | It compiles · reading the code looks right |
| Fix of a problem · bug | Repeat the case that failed before, by the same path, and it passes | Other parts pass |
| Test · check | The pass/fail numbers come from the summary line of the command run this round (or `node scripts/test-verdict.mjs <TAP or JUnit result file> --expect <count>`, which reads the result file and gives a verdict PROVEN · PARTLY · NOT PROVEN), not a count typed by hand · then break 1 line of code in a copy (invert a condition · return early); the test that covers that line must fail · if it does not fail = the test proves nothing yet | Only "pass" · a test count recalled from memory |
| Screenshot · render result | Judge from the pixels of the image you opened yourself, not from a description · look for failure signs first (red screen, blank screen, a box or dialog covering content), then compare with the log · ambiguous counts as failed · if a box covers it, take it again · the evidence names the image file | Reading the code and believing the look is right · saying the image "looks OK" without naming the file |
| mockup | Open in a browser, click every button, no fake buttons | The HTML has valid syntax |
| Measured values (sensor · lux · distance · weight) | Compare with a calibrated reference instrument · an emulator proves only the work path (label `emulator`), accuracy needs the real thing (label `เครื่องจริง <รุ่น>`, real device <model>) · no instrument → `ยังไม่ได้ตรวจ` (not yet checked) | One measurement · comparing against itself |
| A claim that it works on another system (Windows · macOS · another machine) in a PR or report | Label every claim: `observed` (ran it and saw the result on that system) or `reasoned` (worked out by thought) · a pass on your own machine is the weakest evidence for another system | Writing "works on every system" with no label |
| Sub-agent work | Read the work and run it yourself | The sub-agent reports it is done |

## Claims that do not count as evidence

The first column quotes Thai claims as examples; English meanings are in brackets.

| Claim | Why it does not count | Do this instead |
|---|---|---|
| "น่าจะใช้ได้" · "ควรจะผ่าน" · "ในทางทฤษฎี" · "เหมือนครั้งก่อน" ("should work" · "ought to pass" · "in theory" · "same as last time") | Hedge words mean you have not looked — finding them in a final report = a red flag, go back and check before sending | Run or open it, then paste the raw result |
| "test ผ่านแล้ว" ("tests passed") with no output | Passed in memory and passing now are different things | Paste the summary line of this round's run |
| "แก้ตามที่บอกแล้ว" · "ไม่มี error" ("fixed as told" · "no errors") | No error ≠ the wanted result | Repeat the case that failed before and show it passes |
| A sub-agent reports it is done | A report is words, not a work product | Look at the diff or open the changed files yourself |
| A command ended with exit 0 · status shows `running` | exit 0 says only that the program ended, not that it worked · example from the course's `vastai` skill: the `vastai` CLI returns 0 even when the API answers with an error · `running` is not yet ready to use (`ssh … true` must return rc 0) · re-issuing the create command on a timeout got duplicate machines, paying twice | Check the end result with a list command or a command that really uses it · re-issue only after confirming the first one did not happen |
| Sending the user a command to run themselves when we could run it · checking only the easy part and concluding everything passed | Throws the checking onto someone else | Run it all yourself before using the word done |
| Drafting a message to a customer or outsider saying "fixed" so it can be sent right away, while the check is not finished (even with a trailing note that testing is in progress, such as "ทีมเราแก้ไขในระบบแล้ว ตอนนี้กำลังทดสอบอีกรอบ" ("our team fixed it in the system, now testing once more"), seen in eval 3 of 3 rounds 2026-11-09) | The recipient believes the word fixed at once, and if the check fails the words must be withdrawn | Draft 1 version with the condition that it is sent after the check result is seen · the version that can be sent now must not contain "แก้แล้ว" (fixed), "แก้ไขแล้ว" (has been fixed) or "เรียบร้อย" (all done) in any form; it may say only "ได้รับเรื่องแล้ว ทีมกำลังตรวจ จะแจ้งผลภายใน (เวลา)" (received, the team is checking, will report within (time)) |

## Sources

Sources of the screenshot row · expo · .claude/skills/expo-skill-eval/agents/visual-grader.md · seen 2026-11-10 · the test row (verdict script + break one line of code) · code-modernization · commands/modernize-verify.md · seen 2026-11-10 · the observed/reasoned row · claude-remember (do not redistribute · took the mechanism only) · CONTRIBUTING.md · seen 2026-11-10 · reviewer lenses and packages → [`review-lenses`](../../superuser/references/review-lenses.md)

Source of the claims-table idea: skill `verification-before-completion` in obra/superpowers (MIT) · rewritten to cover work outside code.
