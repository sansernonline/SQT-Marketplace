# Research the category before designing a brand icon

Designers do not start from a blank page. They first look at what things in the same category look like, what rules they follow, and what has become overused · this file is the first round of research (read 2026-10-26), a starting point only · each job must research its own category further.

## 1 · What to research (every job, takes little time)

| Look up | Example queries or where to look | What you get |
|---|---|---|
| The store or listing page where the icon will sit | Raycast Store · VS Code Marketplace · JetBrains Marketplace · Chrome Web Store · App Store, same category | Size, frame, dark or light background, and how the neighbors beside it look |
| The destination's official rules | That store's guideline page (table in section 3) | The bans that get an icon rejected |
| Icon families with many members that still read as a set | Microsoft, Adobe, Atlassian, JetBrains, Google app suites | How to tie icons into a set (section 2) |
| Redesign articles where the designer is named | "behind the design" + brand name · "new icons" + year | The thinking and the lessons, not just the pictures |
| Styles overused in that category | "AI logo trend" · "<category> icon cliché" | What to avoid (section 4) |

Give the results to the user as links to open themselves. Do not copy other brands' images to keep or put in the work · reading text alone is not enough, so if a screenshot tool exists, open the real page and look before deciding on a style.

## 2 · Ways to tie several icons into a set

| Method | Example | Watch out |
|---|---|---|
| Same shape and surface, different color | Microsoft 365 2025 set (prototype was the Copilot icon · Jon Friedman 2025-10-01) | Color alone is not enough to tell icons apart for color-blind people |
| Same frame, with an initial inside | Adobe Creative Cloud · JetBrains IDEs | Users complain they cannot tell them apart when there are many (Adobe 2020 · JetBrains forum) |
| One color set for every icon | Google Workspace 2020 | Criticized as indistinguishable · redone in 2026 and dropped the forced 4 colors |
| A symbol that tells each product's story, on one shared frame | Atlassian 2017 · Atlassian icon system 2025 | Stroke weight and grid must be kept equal |

Shared lesson: every icon in a set must be distinguishable at 16 px by shape, not by color or letters alone.

## 3 · Rules of the destinations where plugin icons usually go

| Destination | File | Key rules |
|---|---|---|
| Claude Code (`icon` field in `plugin.json`) | Image path inside the plugin · the directory gate accepts PNG JPEG GIF WebP SVG | No size or shape set · Claude Code does not read it, only the directory page uses it |
| Raycast | PNG 512 | Must look good on both dark and light themes (a separate `icon@dark.png` is allowed) · the default starter icon is rejected |
| JetBrains | SVG 40 · artwork within 36 | No pure-text logos · must not resemble another brand · must be clear on both backgrounds |
| VS Code | PNG at least 128 (256 for Retina screens) | No SVG |
| Chrome | PNG 128, real artwork 96 with 16 margin on each side | No border · avoid large drop shadows · face front |

Rules that several sources agree on: readable on both backgrounds · no text · no border or large shadow · keep a transparent margin · equal visual weight across the set · not similar to another brand · one master file exports to every destination (PNG 512 · PNG 128 · SVG 40)

## 4 · Styles that look AI-made (avoid)

| Style | Source of the criticism |
|---|---|
| Purple-blue gradient · starburst · glow | Allen · UX Collective (2024-06) |
| Sparkle ✦ that became a "beta" tag | Josh Clark · Big Medium (2024-09) · Fast Company (2024) |
| Hexagon or swirl · big-eyed robot | Fast Company (2023) |
| Gradient circle with a hole in the middle | Radek Sienkiewicz (2025-04) |

The Claude logo deliberately avoids these styles (DesignRush) · "brain" has no named source yet (ยังไม่ได้ตรวจ — not checked).

## Sources (read 2026-10-26)

- Microsoft Design · Fluid forms, vibrant colors — https://microsoft.design/articles/fluid-forms-vibrant-colors/
- Adobe Design · Behind the design: Adobe's updated app icons — https://adobe.design/ideas/behind-the-design-adobe-s-updated-app-icons
- Creative Bloq · Adobe icon update 2020 — https://www.creativebloq.com/news/adobe-icon-update-2020
- Atlassian · Our bold new brand — https://www.atlassian.com/blog/announcements/our-bold-new-brand
- Atlassian Design · Building Atlassian's new icon system — https://atlassian.design/whats-new/building-atlassians-new-icon-system
- JetBrains · New icons in IntelliJ Platform 2018.2 — https://blog.jetbrains.com/blog/2018/06/26/new-icons-in-intellij-platform-2018-2/
- Google Workspace Updates · Fresh visual identity for app icons (2026-05) — https://workspaceupdates.googleblog.com/2026/05/introducing-fresh-visual-identity-for-Google-Workspace-app-icons.html
- 9to5Google · New Gmail icon (2020) — https://9to5google.com/2020/10/06/new-gmail-icon/
- UX Collective · The way we design AI looks like nostalgia already — https://uxdesign.cc/the-way-we-design-ai-looks-like-nostalgia-already-aa5dfc01d4c7
- Big Medium · Your sparkles are fizzling — https://bigmedium.com/ideas/your-sparkles-are-fizzling.html
- Fast Company · AI boom logo trend — https://www.fastcompany.com/90869029/ai-boom-logo-trend-swirling-hexagon
- Fast Company · How the sparkle emoji took over AI — https://www.fastcompany.com/91030156/how-the-sparkle-emoji-took-over-ai
- VelvetShark (Radek Sienkiewicz) — https://velvetshark.com/ai-company-logos-that-look-like-buttholes
- DesignRush · Claude logo design — https://www.designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference · Claude · Submit a plugin — https://claude.com/docs/plugins/submit
- Raycast · Prepare an extension for the Store — https://developers.raycast.com/basics/prepare-an-extension-for-store
- JetBrains · Plugin icon file — https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html
- JetBrains Marketplace · Best practices for listing (no name-only logos · must not resemble another brand) — https://plugins.jetbrains.com/docs/marketplace/best-practices-for-listing.html
- VS Code · Extension manifest — https://code.visualstudio.com/api/references/extension-manifest
- VS Code · Publishing extensions (icon in package.json must not be SVG) — https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Chrome Web Store · Images — https://developer.chrome.com/docs/webstore/images
