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

Count files before and after (`(Get-ChildItem -Recurse -File).Count` or `find . -type f | wc -l`); the numbers must match.
