# playbook · bug-fix — fix broken things with evidence

Use when: an error · stack trace · failing test · wrong screen · memory leak · CPU busy while idle · a user report · something that should never happen (if it works but you want it faster or lighter to a target → `performance`) (covers pstack's `bug fix` · `runtime forensics` · `trace forensics`)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md)
Main skills: [`code-craft`](../../code-craft/SKILL.md) · the skill for the stack · `test-automation` · `git-and-review` · `fix-at-source/targeted-fix` · `fix-at-source/principle-fix-root-cause` · `ground-rules/principle-prove-it-works`

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle files [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md) first. Copy the symptom exactly — the error message · test name · screenshot · the steps the user took · ใคร: หัวหน้าทีม
2. **Reproduce it yourself in the same place the user hit it.** For a web page, use the project's app-checking skill (if there is none yet, do `test-automation` first). For an API, use a real call. If you cannot reproduce it, say what is missing (data · environment · steps) and stop on this bug only. In a project that has `.sandbox/` (the root exception in `project-docs` → `references/project-doc-set.md` item 1), reproduce inside the sandbox · ใคร: `qa-tester` ตัวใหม่
   - For a symptom that appears at run time (leak · intermittent hang · busy while idle), add temporary measurement or logging so the symptom becomes a number before you fix it. If you were given a profile file (cpuprofile · heap snapshot · trace), read it with the tool for that file type. Do not guess from the code.
3. **Write a test that fails because of this bug first**, and run it to see it red (`test-automation`). If the project has no tests at all, first set up a first test that runs. If you truly cannot write a test (for example a symptom that happens at run time on the user's machine), write the reason in the report, and provide a runnable reproduction procedure instead · ใคร: `developer` ตัวใหม่
   - If you have not read this part in this session, do [`code-craft`](../../code-craft/SKILL.md) before tracing the cause
4. Find the root cause per `fix-at-source/principle-fix-root-cause` · for a rare or multi-layer cause, send an agent with `model: opus` (`superuser` section 5) · ใคร: `developer` ตัวใหม่ (pass in the step 3 result)
5. If you will change something shared (helper · type · config · schema), find every spot it affects per [`code-craft`](../../code-craft/SKILL.md) before changing it · for a **security bug**, also search the whole repo for places written the same way · pass the list of spots to step 6 · ใคร: `Explore` ตัวใหม่
6. Make the smallest fix that is still correct (`code-craft`), covering every spot from steps 4–5 in one round — pass the file locations and the root cause along · write a security bug up in the report under `qa/security/` · if a secret leaked, tell the user to rotate it at once · ใคร: `developer` ตัวใหม่
7. Prove it — run the case that used to fail and see it pass, run the nearby cases and see they still pass, then try to reproduce it in the original place once more yourself · ใคร: `qa-tester` ตัวใหม่
8. **Check (ตรวจ) the diff by review before saying done** — per `git-and-review`: the fix is at the root cause, does not spread beyond the spot, and the step 7 result covers the case that used to fail · for a security bug, look at every spot from step 5 · if it fails → a fresh `developer` fixes it, then loop per the check rounds in [`team-roles`](team-roles.md) (ตัดสินผลตาม [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md)) · ใคร: `reviewer` ตัวใหม่
9. If this bug is the kind an agent has made before, use `learn-loop/repeated-mistakes-to-checks` · ใคร: หัวหน้าทีม
10. Deliver per the commit rules in `superuser` section 6, then finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Done when

`ต้นเหตุ: … · แก้: … · พิสูจน์: <the case that used to fail and now passes + how it was run>` (root cause · fix · proof)
