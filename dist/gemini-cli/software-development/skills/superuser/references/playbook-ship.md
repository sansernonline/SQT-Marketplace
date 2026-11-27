# playbook · ship — prepare work to go onto the main branch

Use when: "Open a PR" · "Keep the PR green" · "Fix per the review comments" · "Ready to merge yet" (covers pstack's `opening a PR` · `babysit` · `shipping` · `autopilot-stack`)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md)
Main skills: `git-and-review` · `cicd-and-release` · [`security-gate`](../../security-gate/SKILL.md) · `crew-patterns/adversarial-review-panel`

> The agent **does not commit · push · merge by itself** unless permitted under the commit rule in `superuser` section 6. For a step that needs that permission when it has not been granted, prepare the command under "รออนุมัติ" (awaiting approval) and carry on with the other parts

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle files [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md) first. Check (ตรวจ) that every piece of work has been proven (tests · app-check skill). If not, go back to the original playbook (ตัดสินผลตาม [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md)) · ใคร: `qa-tester` ตัวใหม่
   - Run [`security-gate`](../../security-gate/SKILL.md) — if a confirmed critical or high finding is still open, do not ship. If a secret has leaked, stop and tell the user
   - Web app or API going to customers → the [`security-gate` OWASP section](../../security-gate/references/owasp-top10.md) report must cover A01–A10, with no item `ไม่ผ่าน` (fail) or `ยังไม่ได้ตรวจ` (not yet checked) · Who: a fresh `security-engineer` fills it in · a fresh `reviewer` opens the evidence of every row marked `ผ่าน` (pass)
2. **Find the impact outside the diff** per [`code-craft`](../../code-craft/SKILL.md) — every function, table, or API that changed · ใคร: `Explore` ตัวใหม่
3. Arrange the commits as small pieces, each passing tests and, read in order, making sense as one story; write the messages per `git-and-review` · ใคร: หัวหน้าทีม
4. Write the PR description per `git-and-review` — effect on users first · how it was proven · risks · screenshots if any · ใคร: หัวหน้าทีม
5. If the user allows it, push and open the PR. If not, put the commands and the PR text in the reply · ใคร: หัวหน้าทีม (ผู้ใช้อนุญาต)
6. **Watch until green** — if CI is red, find the root cause and fix it (`fix-at-source/principle-fix-root-cause`); do not retry or switch off a test. For review comments from people or bots, judge each one, fix the ones that are real problems, and reply to the ones that are not, with a reason · ใคร: `developer` ตัวใหม่
7. Before merge, check (ตรวจ) the whole PR again per the playbook [`review`](playbook-review.md), because a green CI does not mean it is safe (ตัดสินผลตาม [`references/operations.md`](../../dev-principles/references/operations.md) · [`references/security.md`](../../dev-principles/references/security.md)) · ใคร: `reviewer` ตัวใหม่
8. Merging into the main branch must wait for **`รออนุมัติ`** (awaiting approval) even when everything passes (have the merge command ready), then finish with `superuser/status-report` · ใคร: หัวหน้าทีม (merge: ผู้ใช้ ใน "รออนุมัติ")
9. After the user approves the merge, **delete the branch in the same step, no need to ask again:** `gh pr merge <เลข> --merge --delete-branch` (deletes both on GitHub and locally, then switches to the main branch) · before deleting, check there are no leftover files in the working tree and no other worktree uses this branch · if not using `gh` → `git branch -d <ชื่อ>` (only works for merged branches · never `-D`) and `git push origin --delete <ชื่อ>` · a deleted branch can be restored from the PR page on GitHub · ใคร: หัวหน้าทีม

## Common excuses — read before skipping a step

| Excuse | Reality |
|---|---|
| "The tests should pass, it's a tiny change" | "Should" is not evidence · you need the command that ran and the output it gave |
| "I read my own diff carefully, no need for anyone else" | Same writer, same blind spot · a fresh reviewer is the only fresh pair of eyes you have |
| "The reviewer said minor, so it's minor" | That label was given where the spec was silent · re-label by the effect on the user, then decide |
| "The fix is obvious, no need for a test that fails first" | A test that fails first is the only evidence the problem was real and is gone · without it you have only a diff and hope |
| "CI is red because it's flaky, just hit retry" | Retry hides the cause · find it per `fix-at-source/principle-fix-root-cause` |

## Done when

The PR is green · every comment has an answer · it passed an independent check, and the user has decided about the merge
