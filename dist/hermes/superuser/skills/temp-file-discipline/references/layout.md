# Layout of `_to_delete/` and what counts as temporary

Open when you are unsure whether a file is temporary, or when you need the example layout.

## Example layout

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── 2026-11-06-login-page-redesign/
    │   ├── screenshots/
    │   ├── logs/
    │   └── transfer.zip
    ├── 2026-11-07-fix-export-bug/
    │   └── logs/
    └── superuser-lock/            ← ของเครื่องมือ ไม่ใช่ของงาน
```

(Gloss: `โปรเจกต์/` = project · `ผลงานจริง` = real work products · `ของเครื่องมือ ไม่ใช่ของงาน` = belongs to the tool, not to a task.)

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** (a `.docx` or `.pdf` converted to `.md`). The original is the real thing and the converted one is temporary. Never mix them in the documents folder, or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced. A file no longer in use is a temporary file: when you replace an old file with a new one, move the old one into `_to_delete/` and do not leave them side by side

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image. If you will edit next year, you need the source file, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk. Never move the user's things without asking
- Output of build tools (`build/` · `node_modules/`): leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

## Anti-patterns

- Extracting a zip into the project root and cleaning up later
- Naming files `file-v2` `file-final` `file-really-new` (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- Leaving a project task's temporary files in the session workspace, so the user cannot check back after the session ends
- Making a new subfolder name for an existing kind of thing (`shots/` `img-check/`)
- Placing files directly in `_to_delete/` or sharing `screenshots/` across tasks
- Leaving stray files without telling anyone
