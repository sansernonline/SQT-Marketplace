---
name: asset-organize
description: Use when design files are a mess (untitled exports, final_v2 copies, lost logo). Folder tree, file naming pattern, version rules, logged bulk rename.
---

# Asset Organize

Files you cannot find do not exist. The fix is 1 folder tree, 1 naming pattern and 1 version rule, written in the brand kit README so new people learn it on their first day.

## Workflow

1. **Inventory** — list every file with path, size, date modified. Group by campaign or use (a spreadsheet or `dir /s /b > inventory.txt` is enough)
2. **Create the tree** below (template with sub-folders in [naming-and-tree.md](references/naming-and-tree.md))
3. **Decide the tokens** (the parts of a file name) — campaign codes, asset names, platform and format codes from the code list. Write them into the brand kit README
4. **Map old → new** in `rename-log.csv` before touching any file
5. **Rename and move** in 1 batch. Check that the file count before and after is the same
6. **Archive the unknown** — anything nobody can identify goes to `04-archive/<yyyy-mm>-unsorted/`, never deleted
7. **Announce** the tree and pattern; old shared links will break, so share the log

## Folder tree

```
brand-assets/
├── 00-brand-kit/          README, logo, colour, type (see brand-kit)
├── 01-masters/            editable sources: .psd .ai .fig links .afdesign .prproj
│   └── <campaign>/
├── 02-exports/            finished files only, named and versioned
│   └── <campaign>/
├── 03-source-media/       photos, footage, AI generations not yet used
│   └── <yyyy-mm>-<shoot-or-batch>/
├── 04-archive/            dead campaigns, read-only
└── _inbox/                drop zone, emptied weekly
```

Status lives in the folder, not the file name: drafts stay in `01-masters/`, only approved files reach `02-exports/`.

## Naming pattern

```
<campaign>-<asset>-<platform>-<format>-v<NN>[-<lang>].<ext>
```

| Token | Rule | Example |
|---|---|---|
| campaign | Short code, year-month if it recurs | `songkran26`, `2026-11-sale` |
| asset | What it shows, 1–2 words | `hero`, `menu-matcha`, `promo-a` |
| platform | Code from the list | `ig`, `fb`, `tt`, `yt`, `line`, `x`, `li`, `print` |
| format | Placement or ratio | `feed45`, `story`, `reel`, `cover`, `richmenu-l`, `a4` |
| vNN | 2 digits so it sorts: `v01` … `v12` | `v03` |
| lang (optional) | `th`, `en` when both exist | `-th` |

Example: `songkran26-hero-ig-feed45-v03-th.png`

## Version rules

- Every save that leaves your machine is a new version. Never overwrite a file you have sent
- Masters and exports share the version number — `v03` export was made from `v03` master
- Small fixes after approval: `v03` → `v04`, not `v03b`
- Banned words in names: `final`, `new`, `latest`, `edit`, `copy`, `ล่าสุด`, `แก้` — they soon stop being true
- Keep the last approved and the current working version in `02-exports/`; older versions move to `04-archive/`

## Thai-specific rules

- **No Thai characters, spaces or emoji in file names.** Thai names break in zip files between Windows and Mac, become `%E0%B8...` in URLs, and some upload tools reject them. Romanise: `เมนูมัทฉะ` → `menu-matcha`
- Thai titles go inside the file (metadata or a `README.md` per campaign folder), not in the name
- Use the Gregorian year in codes (`2026`, `26`) so sorting matches every tool; write the พ.ศ. year only in visible copy

## Rules

- Every token is something people search for. A word that is not in the name cannot be found
- Lowercase, hyphens only, no spaces or underscores mixed
- 1 pattern per team. Changing it means a new brand-kit version
- Review `04-archive/` every quarter. Nothing leaves the archive without a reason in the log

## Related

- `brand-kit` — the README where the pattern is written
- `campaign-set` — the asset matrix uses the same file names
- `social-formats` — source of the format codes
