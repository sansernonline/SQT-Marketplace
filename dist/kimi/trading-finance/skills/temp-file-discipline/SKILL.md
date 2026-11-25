---
name: temp-file-discipline
description: Use when a task writes temporary files into a project
---

# Temporary file discipline — keep non-products in `_to_delete/<task folder>/`

> **One rule:** anything that is not a real work product must live only in `_to_delete/`. Never leave it in the project root, and never mix it with work files.

## Use when
- A task creates check images, logs, one-off scripts, backups, extracted zips, converted copies of documents (`.docx`/`.pdf` → `.md`), or replaces a file (the old one is now temporary).
- Finishing work in a project: confirm the root holds no stray files.

Not for: a work product the user keeps (goes in its own destination folder) · intermediate steps not tied to any project (use the session's workspace).

## Steps
1. **Decide what is temporary:** check images, logs, one-off scripts, backups, extracted zips, converted copies, old versions, anything no longer in use. Not temporary: a work product the user asked for · the source file of a work product (keep it in a subfolder beside it) · files the user placed themselves (never move them without asking) · build output (leave it, check `.gitignore`). If unsure whether the user created or uses a file, do not move it; tell the user. Detail: [`references/layout.md`](references/layout.md).
2. **Use one `_to_delete/` at the project root.** From inside a subfolder (such as the code folder), write to the project root's `_to_delete/`; do not nest one. A temporary file that landed in the root: move it into `_to_delete/` right away.
3. **Clear old trash first, then make a task folder when the task starts.** Before the first temporary file, list the folders in `_to_delete/` and delete those nothing uses any more, by step 9 (owner's order 2026-11-19: "ก่อนเริ่มงาน อ่านก่อนว่ามีไฟล์ไหนต้องใช้ต่อไหม ถ้าไม่ใช้ก็ควร clear ของเก่า"). Then make the task folder: `_to_delete/YYYY-MM-DD-<topic>/` (the day the task started; topic lowercase English joined by `-`, 2–5 words, such as `2026-11-06-temp-task-folders`, not `task1`). A task that spans rounds or sessions reuses its folder; a new topic gets a new folder. Sub-agents write into the lead's task folder; put the path in the brief.
4. **Never place a file directly in `_to_delete/`**, except what a tool or hook creates at a fixed place (`superuser-lock/` · `STOP`) and `delete-plan.txt`.
5. **When another skill writes `_to_delete/<x>`** (such as `_to_delete/screenshots/`), read it as `_to_delete/<task folder>/<x>`. For a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder.
6. **Use only these subfolder names inside the task folder:**

   | Subfolder | What goes in |
   |---|---|
   | `drafts/` | Temporary drafts that are not the original (a re-rendered markdown original lives at `docs/src/<topic>.md`; `superuser:document-naming`) |
   | `attempts-<topic>/` | Work of each competing agent ([`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md)) |
   | `screenshots/` | Rendered mockup images or images for checking work |
   | `logs/` | Logs from a one-time run |

   Code work (`verify-runs/` · `security/` · `check/`) → `superuser` → `references/code-extensions.md` in plugin `software-development`.
7. **Add `_to_delete/` to `.gitignore`** in every git project (check first, add if missing). If the project README already names another temporary folder (`tmp/` `scratch/`), follow it and record 1 row in the "การตัดสินใจ" table. Never use `.cache/`.
8. **At the end of the work,** say where this task's temporary things are in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list. Then run `node <this skill's folder>/scripts/root-check.mjs <project root>`. It lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`); for things the project keeps in the root on purpose, add `--allow README.md,LICENSE`.
9. **`_to_delete/` is the trash bin.** Anything already inside it may be deleted for good without asking (owner's order 2026-11-19: "ถ้าไฟล์อยู่ในนี้ลบจากถังขยะได้เลย"), for example to free disk space or at the end of a task. Leave every folder still in use: one made in this session (its path may be in your report) · one a file outside `_to_delete/` still names (`CONTEXT.md` · `BUILD-PLAN.md` · a committed file) · one from another session, worktree or AI · `_to_delete/superuser-lock/`. Unsure → keep it. Say what you deleted in one line. Outside `_to_delete/`, never delete on your own: deleting in the user's folder cannot be undone, so move the files into `_to_delete/` first and tell the user. Delete inside `_to_delete/` this way:
   1. Write the plan into `_to_delete/delete-plan.txt`, 1 path per line from the project root (a whole task = its folder on one line).
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt`. It prints the delete list and the keep list to compare. A path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete.
   3. Only after it passes, delete line by line from the "delete" list. The script does not delete. Never build the list from `ls` (on Windows names may end in `/`; see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md)).

## Check before done
- [ ] Every temporary file is under `_to_delete/<task folder>/` using the standard subfolder names.
- [ ] `root-check.mjs` shows nothing unexpected in the root.
- [ ] `_to_delete/` is in `.gitignore`.
- [ ] The reply says where the temporary things are, in one line, and nothing outside `_to_delete/` was deleted without the user's order.

## References
- [`references/layout.md`](references/layout.md) — open when unsure whether a file is temporary, or for the example layout and anti-patterns.
