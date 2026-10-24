# skill: asset-organize

Use when design files are a mess (untitled exports, final_v2 copies, lost logo). Folders, naming, versions.

# Asset Organize

Files you cannot find do not exist. The fix is 1 folder tree, 1 naming pattern and 1 version rule, written in the brand kit README so new people learn it on their first day.

## Workflow

1. **Inventory** — list every file with path, size, date modified. Group by campaign or use (PowerShell: `Get-ChildItem -Recurse -File | Select FullName,Length,LastWriteTime | Export-Csv inventory.csv`; Linux: `find . -type f -printf '%p,%s,%TY-%Tm-%Td\n' > inventory.csv`; Mac: use `gfind` from findutils or a spreadsheet)
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

Status lives in the folder, not the file name: drafts stay in `01-masters/`, only approved files reach `02-exports/`; the working version stays in `01-masters/`.

## Naming pattern

```
<campaign>[-<id>]-<asset>-<platform>-<format>-v<NN>[-<lang>].<ext>
```

| Token | Rule | Example |
|---|---|---|
| campaign | Short code, year-month if it recurs | `songkran26`, `2026-11-sale` |
| id (optional) | Row ID from the campaign asset matrix (`campaign-set`), lowercase, so "fix D3" finds one file | `m1`, `d3`, `v1` |
| asset | What it shows, 1–2 words | `hero`, `menu-matcha`, `promo-a` |
| platform | Code from the list | `ig`, `fb`, `tt`, `yt`, `line`, `x`, `li`, `print` |
| format | Placement or ratio | `feed45`, `story`, `reel`, `cover`, `richmenu-l`, `a4` |
| vNN | 2 digits so it sorts: `v01` … `v12` | `v03` |
| lang (optional) | `th`, `en` when both exist | `-th` |

Example: `songkran26-hero-ig-feed45-v03-th.png` · with a matrix ID: `songkran26-m1-hero-ig-feed45-v03-th.png`

## Version rules

- Every save that leaves your machine is a new version. Never overwrite a file you have sent
- Masters and exports share the version number — `v03` export was made from `v03` master
- Small fixes after approval: `v03` → `v04`, not `v03b`
- Banned words in names: `final`, `new`, `latest`, `edit`, `copy`, `ล่าสุด`, `แก้` — they soon stop being true
- Keep the last approved export and the one before it in `02-exports/`; the current working version stays in `01-masters/`; older versions move to `04-archive/`

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
- `document-naming` — naming for client documents (proposals, reports, contracts)


## reference: naming-and-tree.md

# Naming codes, full tree and rename log

## Platform and format codes

| Platform | Code | Format codes |
|---|---|---|
| Instagram | `ig` | `feed11` · `feed45` · `feed34` · `story` · `reel` · `profile` |
| Facebook | `fb` | `feed11` · `feed45` · `story` · `reel` · `cover` · `link` · `event` |
| TikTok | `tt` | `video` · `cover` · `profile` |
| YouTube | `yt` | `thumb` · `short` · `banner` · `profile` |
| LINE OA | `line` | `richmenu-l` · `richmenu-s` · `richmsg` · `profile` · `cover` · `card` |
| X | `x` | `post169` · `header` · `profile` |
| LinkedIn | `li` | `post` · `link` · `cover` · `logo` |
| Website | `web` | `hero` · `og` · `banner` |
| Print | `print` | `a4` · `a5` · `a3` · `card` · `rollup` |

Sizes for each format: see `social-formats`.

## Full tree with campaign sub-folders

```
brand-assets/
├── 00-brand-kit/v1/ ...
├── 01-masters/
│   └── songkran26/
│       ├── songkran26-hero-master-v03.psd
│       └── songkran26-video-master-v02.prproj
├── 02-exports/
│   └── songkran26/
│       ├── README.md                    (campaign sentence, Thai titles, approver)
│       ├── asset-matrix.md              (from campaign-set)
│       ├── songkran26-hero-ig-feed45-v03-th.png
│       ├── songkran26-hero-ig-story-v03-th.png
│       └── songkran26-hero-line-richmsg-v03-th.png
├── 03-source-media/
│   ├── 2026-03-shoot-cafe/
│   └── 2026-03-ai-batch-hero/           (keep prompt files next to generations)
├── 04-archive/
│   ├── 2025-songkran25/
│   └── 2026-03-unsorted/
└── _inbox/
```

## rename-log.csv

```csv
old_path,new_path,renamed_on,by,note
"Desktop/โพสต์สงกรานต์ final.png","02-exports/songkran26/songkran26-hero-ig-feed11-v01-th.png",2026-10-06,ploy,
"Downloads/IMG_4471.jpg","03-source-media/2026-03-shoot-cafe/cafe-interior-001.jpg",2026-10-06,ploy,
"untitled-2.png","04-archive/2026-03-unsorted/untitled-2.png",2026-10-06,ploy,unknown origin
```

## Batch rename (after the log is approved)

PowerShell, one line per row of the log:

```powershell
Import-Csv rename-log.csv | ForEach-Object { New-Item -ItemType Directory -Force (Split-Path $_.new_path) | Out-Null; Move-Item -LiteralPath $_.old_path -Destination $_.new_path }
```

macOS / Linux:

```bash
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; mkdir -p "$(dirname "$new")"; mv -n "$old" "$new"; done
```

Dry run on a copy of the folder first (`-WhatIf` / `echo`), and keep the reverse ready (swap old_path and new_path):

```powershell
Import-Csv rename-log.csv | ForEach-Object { Move-Item -LiteralPath $_.old_path -Destination $_.new_path -WhatIf }   # dry run
Import-Csv rename-log.csv | ForEach-Object { Move-Item -LiteralPath $_.new_path -Destination $_.old_path }          # reverse
```

```bash
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; echo mv -n "$old" "$new"; done   # dry run
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; mkdir -p "$(dirname "$old")"; mv -n "$new" "$old"; done   # reverse
```

Count files before and after (`(Get-ChildItem -Recurse -File).Count` or `find . -type f | wc -l`); the numbers must match.
