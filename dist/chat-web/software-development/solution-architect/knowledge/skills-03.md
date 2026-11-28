# skill: project-docs

Use when choosing project docs, onboarding docs or release notes

# project-docs — pick the right docs, then write them for the reader who uses them

> **One rule:** every doc must answer who reads it and what they decide after reading. If it cannot answer, do not write it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Are the paths and commands in CLAUDE.md still true?", agent docs drifted from the code | [`scripts/docs-truth.mjs`](scripts/docs-truth.mjs) · checks that every path with a folder (`docs/guide.md`, `src/auth/login.ts`) and every `npm run` script named in `CLAUDE.md` · `AGENTS.md` · `README.md` exists · bare file names (`SKILL.md`) and two-part names without a dot (`owner/repo`, `ground-rules/simplify`) are skipped on purpose, because in agent docs they are usually generic names, not paths · `--ignore '.claude/**'` for folders kept out of git · put it in CI or a card's `done_when` |
| "Which docs does this project need?", "docs are scattered", "a client asks what we deliver", "open-items Excel" | [`references/project-doc-set.md`](references/project-doc-set.md) (table of docs: [`references/technical-docs.md`](references/technical-docs.md)) |
| "Onboard a new developer", "30/60/90-day guide", "a new QA joins next week" | [`references/onboard.md`](references/onboard.md) |
| "Release notes for 1.4.0", "what changed in this version for users" | [`references/release-notes.md`](references/release-notes.md) (templates: [`references/writer-templates.md`](references/writer-templates.md)) |
| "Put the docs on a website", "searchable manual with versions" | [`references/docs-site.md`](references/docs-site.md) |
| The project has 2 or more sub-projects, each with its own docs | [`references/ecosystem.md`](references/ecosystem.md) |

To list the open items in the open-items Excel, run `scripts/open_items.py`. The checklist of docs is in `assets/doc-set-checklist.md`.

## Steps every part shares

1. Ask who reads the doc, and what they must do after reading. Unknown answers go in as `(รอยืนยัน)` (awaiting confirmation), and the work goes on.
2. Look for the real document first. Keep one source for each fact, and link to it instead of copying it.
3. Put files that come from the client or the old system in `ref/`. Treat `ref/` as read-only.
4. Create a folder only when it has real content, not in advance.
5. Write the doc in the register its reader needs, then check it with a fresh reader who has not seen the project.

## Check before done

- No password, token or account secret is in any doc. Link to the place where access is requested instead.
- A document that outsiders must not see stays in `docs/` in the repo. It does not go on a public docs site.
- A public docs site is not used as free hosting for an online business or a SaaS product, and the site counts as public even when the repo is private.
- Release notes are written for users, from the commits since the last version, and every unknown is marked `(รอยืนยัน)`.
- Every sub-project folder in an ecosystem is named `ecosystem/`, and shared docs live once in the root `docs/`.


## reference: docs-site.md

# Docs site

Pick a docs-site generator when a manual or developer documentation must go on the web, be searchable, and have several versions · use with `SKILL.md` item 1 (where the documents live) and the templates in [`writer-templates.md`](writer-templates.md).
Facts checked 2026-10-23 from official docs · npm · PyPI · GitHub and real tests (section "Sources").
Abbreviations: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · Is a docs site needed

| Situation | Use |
|---|---|
| People outside the team read often (public API · SDK · a manual updated every release) · search needed · several versions at once | a docs site (this file) |
| The team reads it themselves | `README.md` + `docs/*.md` on GitHub is enough |
| The customer signs for acceptance | `.docx` per `SKILL.md` item 2.1 · a docs site does not replace the handover document |

## 2 · Comparing the 4 generators

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| Requires | Python | Node · React | Node · Astro | Node · Vue |
| Latest version | 9.7.7 | 3.10.2 | 0.42.6 (not yet 1.0) | 1.6.4 · 2.0 is still alpha |
| Built-in search | yes · lunr.js + lunr-languages (can set `lang: th`) | no · the official one is Algolia DocSearch · local search uses a community plugin | yes · Pagefind is on by default, no setup | yes · MiniSearch (`provider: 'local'`) or Algolia |
| Versioning | via `mike`, an external tool | built in, `docusaurus docs:version` | community plugin `starlight-versions` | none · issue #109 is still open |
| Multiple languages (i18n) | the UI can be translated (`th` exists) · a multilingual site = one project per language + a language switcher | built in | built in · a Thai UI is included | built in |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: the maintainers announced they will maintain only critical fixes until 5 May 2027 and told users to move to Zensical (version 0.0.71 · status Alpha · MIT) · a new project that must live for years should record this in an ADR.
Quick pick: Python team → MkDocs Material (plan a move) · need built-in versioning → Docusaurus · want a light site with little setup → Starlight · Vue team → VitePress

## 3 · Thai search, tested for real

Thai has no spaces between words, so a search engine that splits words on spaces cannot find a word in the middle of a sentence · tested 2026-10-23 with 2 Thai pages, searching 9 words: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| Search engine (version tested) | Used in | What the docs say about Thai | Found |
|---|---|---|---|
| Pagefind 1.5.2 (builds an index, searches in the browser) | Starlight | has `th` · no stemming · the word-segmentation section mentions only Chinese, Japanese, Korean | 6/9 · missed กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (word splitting with wordcut · tested in Node, not in the theme) | MkDocs Material · plugin `@easyops-cn/docusaurus-search-local` (accepts every lunr-languages language) | Material accepts `lang: th` | 6/9 · missed ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 defaults (prefix + fuzzy as in VitePress) | VitePress | VitePress segments with `Intl.Segmenter` only for Chinese and Japanese | 0/9 |
| MiniSearch + a `tokenize` that uses `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | `tokenize` can be set by yourself | 9/9 (tested in Node 22 · not yet tested in a whole VitePress site) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | Algolia's language table: Thai segmentation "Not supported" | not tested |

- Results depend on the project's vocabulary → before delivery, search 20 real terms and record the results in the docs site's README.
- DocSearch is free only for technical documentation and technical blogs that are public. The site must be live and have no non-technical content.

## 4 · Hosting

| | GitHub Pages | Cloudflare |
|---|---|---|
| Price | free · a free account needs a public repo | Pages has a free plan · Workers static assets: static file requests are free and unlimited |
| Limits | site ≤ 1 GB · bandwidth 100 GB/month (soft) · build 10 times/hour (soft · builds through GitHub Actions do not count) · a deploy over 10 minutes fails | Pages free plan: 500 builds/month · 1 build at a time · max 20 minutes · 20,000 files · each file ≤ 25 MiB |
| Conditions | must not be used as free hosting for an online business or SaaS · the site is public even if the repo is private | the Pages page tells new projects to start on Workers |

A document that outsiders must not see does not go on a public site. Keep it as `docs/*.md` in the repo (how each host restricts readers has not been checked).

## 5 · Thai fonts

- Use the same fonts as the app: `Inter` + `Noto Sans Thai` (`ui-craft` part `web-app-design` → `references/tokens.md`) · other Google Fonts choices that have Thai letters and are OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- Load through the Google Fonts CSS2 API with `display=swap` · the API splits out the `/* thai */` block with `unicode-range: U+0E01-0E5B …` by itself, so the browser loads only the parts the page uses (seen in the CSS the API returned 2026-10-23)
- Thai line-height is the English value plus 0.1 (`ui-craft` item 2)
- Set the font in the slot the theme exposes · the setting names and CSS variables of each theme have not been checked

## 6 · Content lives in the repo beside the code

- The docs site source lives in the code folder `<project-name>/docs/` with the generator's config file (layout A of `project-bootstrap` item 1) · code and manual change in the same pull request
- Type B projects: the handover `.docx` · ADR · runbook · BUILD-PLAN stay in `docs/` at the root · the docs site takes only what outsiders read (manual · tutorial · API reference · release notes) · the same content must never live in 2 places
- Build in Continuous Integration (CI) on every pull request and deploy on merge (`cicd-and-release`)
- An exception to the root is declared in the code folder's README (`SKILL.md` item 1)

## Sources

| Topic | URL or evidence (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (status · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (file `lunr.th.js` uses wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| Docusaurus local-search plugin | https://github.com/easyops-cn/docusaurus-search-local |
| Versions and licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` in https://github.com/google/fonts · real CSS from fonts.googleapis.com |
| Thai search test | Pagefind via `npx pagefind@1.5.2` + a browser · lunr and MiniSearch via Node 22 · 2 test pages, the 9 search words in item 3 |


## reference: ecosystem.md

# Ecosystem project: 1 system split into several sub-projects

Read this when a project has 2 or more sub-projects and each one has its own doc set. The short rule is in `SKILL.md` section 1.

Use it when the project is a product suite with 2 or more sub-projects, and each has its own doc set (SRS · mockup · architecture). Example: Quanton, split into CONNECT · LAB · INTEL · DESK.
**The folder must always be named `ecosystem/`.** Never use `projects/`, `modules/` or `apps/`. When someone opens the folder, they must see at once that everything inside is a piece of one system.

```
<project-name>/
├─ docs/                ecosystem-level docs — README (index) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <code>-<SUB>/     1 folder per sub-project, e.g. QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    code repo of this sub-project (lowercase, joined with `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   shared by the whole ecosystem (same rules as type B)
```

- Docs that cover every sub-project (BRD · project plan · BUILD-PLAN) live in one place, the root `docs/`. Never copy them into each sub-project.
- Create a sub-project folder when you start writing that sub-project's docs. Do not create folders in advance.
- Sub-project folder name = project code + sub-project name in capitals (`QTN-CONNECT`). Use the same code the docs cite.
- If a project already uses `projects/`, rename it to `ecosystem/` and fix the paths in every doc and script in the same pass.
- A project with a single product does not need `ecosystem/`. Use type B as usual.
- An add-on or sub-program of one app (browser extension · plugin · CLI · hook client · SDK) without its own doc set is not a sub-project. It stays in that app's repo under `extension/<name>/` (`project-bootstrap` item 1). Move it here only when it gets its own SRS, mockup or release cycle.


## reference: onboard.md

<!-- merged from skill `onboard` on 2026-11-27 · description was: Use when a new team member needs onboarding docs (30/60/90-day guide) via technical-writer. -->
Use the `technical-writer` agent to create an onboarding guide for: **the user's request**

The technical writer should:

1. **Initial Discovery** — gather:
   - Role + level (junior, senior, lead)
   - Team they're joining
   - Tech stack they'll work with
   - Existing onboarding materials
   - Common confusion points from past onboards

2. **Apply Diátaxis framework** — onboarding has 4 parts:
   - **Tutorial** — first day setup + first task
   - **How-To** — common dev workflows (pull request (PR), deploy, test)
   - **Reference** — links to systems, who-owns-what
   - **Explanation** — architecture overview, history

3. **Structure as 30/60/90 day plan:**

   **Day 1-7: Setup & Orientation**
   - Environment setup checklist
   - Setup check before hand-over: run every setup command in the README on a clean checkout (fresh clone or a `infra-and-deploy` container), note the first step that fails, and fix the README — the guide must not paper over a broken README (แนวคิดจาก borghei codebase-onboarding · เขียนใหม่)
   - Tool access (Slack, GitHub, Amazon Web Services (AWS), etc.) — put the link to where access is requested; never put passwords or tokens in the document
   - Key people to meet (intros)
   - Codebase tour (key directories)
   - First small task (warm-up)

   **Day 8-30: Foundation**
   - Architecture overview
   - Domain knowledge basics
   - First real feature/bug fix
   - Pair programming sessions
   - Code review participation

   **Day 31-60: Contribution**
   - Independent feature delivery
   - On-call shadowing (if applicable)
   - Participate in planning meetings
   - Start mentoring suggestions

   **Day 61-90: Full Productivity**
   - Lead small initiatives
   - Contribute to design discussions
   - Improve team processes
   - Performance check-in

4. **Include practical sections:**

   **Quick Reference Card:**
   - Critical commands
   - Important Slack channels
   - On-call info / escalation (channel names and the on-call schedule; no passwords or tokens — link to where access is requested instead)
   - Where to find docs
   - Who to ask about X

   **Codebase Tour:**
   - Repository structure
   - Build / test / deploy commands
   - Branching strategy
   - Code style + linting

   **Team Norms:**
   - Meeting cadence
   - Communication channels (Slack vs email vs sync)
   - PR review expectations
   - Working hours / time zones

5. **Produce polished onboarding doc** using `design-gate/polished-document-style` skill:
   - Welcome message
   - 30/60/90 timeline (a timeline figure in the house style of the skill `diagrams` — project documents must not use default Mermaid · Mermaid is allowed only for a rough sketch in chat or a short README note)
   - Checklist per phase
   - Frequently Asked Questions (FAQ) section
   - Glossary of company terms

6. **Hand-off suggestions:**
   - Architecture deep dive → `solution-architect`
   - Security training → `security-engineer`
   - Domain training → `business-analyst`
   - Buddy system pairing → `project-manager`


## reference: project-doc-set.md

<!-- merged from skill `project-doc-set` on 2026-11-27 · description was: Use when choosing a project doc set or open-items Excel -->
# Project doc set

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Docs inside or outside the repo](#1--docs-inside-or-outside-the-repo)
- [2 · Choose the doc set by project size](#2--choose-the-doc-set-by-project-size)
- [3 · Writing order](#3--writing-order)
- [4 · Who writes which doc, with which skill](#4--who-writes-which-doc-with-which-skill)
- [5 · Figures in docs: choose correctly from the start](#5--figures-in-docs-choose-correctly-from-the-start)
- [6 · Colour theme of the doc set](#6--colour-theme-of-the-doc-set)
- [7 · Checklist before delivering the doc set](#7--checklist-before-delivering-the-doc-set)
- [8 · Anti-patterns](#8--anti-patterns)
- [10 · Links to other skills](#10--links-to-other-skills)

> **One rule:** every doc must answer **who reads it** and **what they decide after reading**.
> If it cannot answer, do not write it.

---

## When to use this skill

Use it when: opening a new project and deciding which docs it needs · docs are scattered and nobody knows which is the real one · a client asks what will be delivered · about to write a doc but unsure what must come first.

## When **not** to use it

| Situation | Use instead |
|---|---|
| Folder layout of the **code** (including the `docs/` inside code in type A) · README · CHANGELOG · linter | `project-bootstrap` |
| Naming **files** and version numbers of docs | `workspace-rules/document-naming` |
| Actually writing one doc | The skill for that doc (table in section 4) |
| Making document pages look good | `document-design` |

---

## 1 · Docs inside or outside the repo

**Decide this first** (moving later means fixing links across the whole project). **The default is type B**, even when the docs are pure markdown. The code lives in `<project-name>/` (lowercase, joined with `-`). Use type A only when the user asks.

- **Type B** (docs outside the repo): use it for every set size (S · M · L). `.docx` / `.xlsx` / mockups / PNGs that the client must see stay out of pull requests. The root layout is below (this section owns the root layout).
- **Type A** (docs inside the repo): only when the user asks and the docs are pure markdown. Docs and code change in the same pull request. The root looks like type B but has no root `docs/`. The `docs/` folder sits inside the code folder, and its inner layout belongs to `project-bootstrap` section 1.
- A type A project that grows deliverable docs moves to type B **as a whole set in one go**. A doc that lives in 2 places means 2 versions.

### Type B layout

```
<project-name>/
├─ ref/                 things received — TOR · meeting notes · screenshots of the old system · client files  **read-only, never edit**
├─ docs/                every doc we write — delivered .docx and technical .md live together
│  ├─ figures/          exported figures — .png only        [exists when delivered docs have figures]
│  │  └─ src/           source files of the figures (.html · .mmd · .drawio)
│  ├─ decisions/        ADR-NNNN-<slug>.md, one decision per file  [optional]
│  ├─ runbook-<topic>.md  guide for when the system has problems, one topic per file  [optional]
│  └─ research/         research on a reference app (`reference-app-research`) [optional]
├─ mockup/              .html that opens and really clicks
├─ qa/                  test cases · test results · bugs/ bug reports
├─ assets/              logos · icons in all sizes · favicon · wordmark (.svg source + exports)
├─ _to_delete/          every kind of temporary item
├─ .claude/            project skills (such as verify) — must sit where Claude Code is opened
│  └─ superuser/        SuperUser working files — CONTEXT.md · HISTORY.md · IMPROVEMENTS.md · log/ · inbox/ · learn/
└─ <project-name>/      code repo, project name lowercase joined with `-` — inner layout belongs to `project-bootstrap`
```

**SuperUser files** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`): the single source is [`superuser/references/team-files.md`](../../superuser/references/team-files.md).

**ADRs and runbooks live in the root `docs/`, not in `<project-name>/docs/`.** Type A moves the whole `docs/` into the code folder, with the same inner layout. Paths: `docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<topic>.md`. This section is the only place that defines this.

**Root exceptions:** `.sandbox/` may sit at the root when you use `infra-and-deploy` · `AGENTS.md` / `GEMINI.md` under the conditions above. Declare every exception in the README of the code folder.

**Create folders when real content exists, not in advance:** `ref/` when you get files from the client or the old system (never mix them into `docs/`) · `docs/figures/` when a delivered doc has a self-drawn figure (otherwise the figure is stuck inside the `.docx` and cannot be edited) · `docs/decisions/` when a decision needs explaining later · `docs/research/` when the user wants an app like an existing one · `qa/` when test cases exist (test cases always live here; `docs/test-plan.md` holds only the plan) · `assets/` when there is a logo or icon.

**Ecosystem project** (2 or more sub-projects, each with its own doc set): the folder is always named `ecosystem/` (never `projects/` `modules/` `apps/`). `ecosystem/<code>-<SUB>/` holds `docs/` `mockup/` `qa/` and its own repo. Docs that cover all sub-projects live in one place, the root `docs/`. Full layout and rules: [`ecosystem.md`](ecosystem.md). An add-on or sub-program of one app (browser extension · plugin · CLI · hook client · SDK) with no doc set of its own is not a sub-project: it lives in the code repo under `<project-name>/extension/<name>/` (`project-bootstrap` item 1).


**Folder rules (both types):**

- **`.docx` and `.md` may share one `docs/`.** No need for separate folders, because the extension already says who reads it.
- **Never lose the source files of figures.** If a figure must change next year and only the PNG is left, the whole figure must be redrawn.
- **Every button in a mockup must really click**, because a fake button makes the review wrong.
- **`.docx` / `.xlsx` live only in `docs/` and `qa/`.** Do not scatter them to the project root.
- **Temporary items go to `_to_delete/`** (`workspace-rules/temp-file-discipline`).
- **`docs/README.md` is the index.** It says what to read first and who owns what (template in `project-bootstrap` → `assets/starter-files.md`).

---

## 2 · Choose the doc set by project size

Size is measured by **duration × number of people who must agree**, not by lines of code.

**S** ≤ 2 weeks · one team · nobody outside the team signs — **M** 1–3 months · internal client · delivered in rounds — **L** > 3 months · external client signs off · contractual obligations

### 2.1 · Deliverable docs: people read and sign them

| Doc | Format | Readers | S | M | L |
|---|---|---|:-:|:-:|:-:|
| Project Plan | `.docx` | client · team | ○ | ● | ● |
| SRS | `.docx` | dev · client | ○ | ● | ● |
| Architecture | `.docx` | dev · ops | ○ | ● | ● |
| Test Plan | `.docx` | QA · client | ○ | ● | ● |
| User guide (`MAN`) | `.docx` → `.pdf` | end users | ○ | ● | ● |
| FSD | `.docx` | dev · QA | ○ | ○ | ● |
| BRD | `.docx` | business side | ○ | ○ | ● |
| Document Checklist | `.docx` | everyone | ○ | ○ | ● |
| Test Cases | `.xlsx` | QA | ○ | ○ | ● |

● required · ○ not needed unless there is a specific reason
**Set S has none of these docs.** That is correct.

---

### 2.2 · Technical docs: the team and agents use them while building

All markdown. They **depend on what the project contains**, not on project size. Full table (file · question answered): [`technical-docs.md`](technical-docs.md).

- **Always:** `<project-name>/README.md` · `docs/BUILD-PLAN.md`
- **Conditional:** USER-STORIES and `docs/sprints/sprint-NN.md` (work runs in sprints) · AGENT-LOOP (an agent writes code in rounds) · API-SPEC (an API that others call) · DATA-DICTIONARY (a database exists) · EVALUATION-POLICY and PROMPT-LIBRARY (LLM used) · `docs/decisions/ADR-NNNN-<slug>.md` (decisions that will be questioned again) · `docs/runbook-<topic>.md` (system in real use and someone on call)

---

## 3 · Writing order

**Delivery track.** Never skip a step that belongs to the set for that size. Skip steps that are not in the set, such as BRD · FSD in set M.

```
Project Plan ─► BRD ─► SRS ─┬─► mockup
                            └─► Architecture ─► FSD
                                                 │
              User Guide ◄─ Test Cases ◄─ Test Plan
```

**The next doc may build on the DRAFT of the previous one.** Put `(รอยืนยัน)` (awaiting confirmation) on every unconfirmed item in both docs. Never set the next doc to APPROVED before the previous one, because if the upstream doc changes, the whole chain must be redone.
The one exception: **the mockup may run in parallel with the SRS**, because screenshots help the SRS get confirmed faster.

### 3.1 · Open-items register: when the user asks "what is still stuck", answer with an Excel file, not chat text

Labels such as `(รอยืนยัน)` · `(รอวัดใน Phase 0)` (awaiting measurement in Phase 0) and question tables are spread over every doc, so the decision maker sees no overall picture. Merge them into one file with the script. Do not read them all by hand:

```
python scripts/open_items.py docs/ docs/<CODE>-OPEN-ITEMS.xlsx --project <CODE>    # test the script: --self-test
```

- It reads every `.docx` in `docs/`: question tables · tables of undecided assumptions · sign-off tables still "waiting" · labels in the body. It skips revision history, table of contents, label-explanation lines and `(รอบหลัง)` (later round).
- The **สรุป** (summary) sheet counts by document × type with formulas. The **รายการค้าง** (open items) sheet has the heading in the doc · who answers · decide by · value used for now · cross-references · and "สถานะ" (status) and "คำตอบ" (answer) columns for people to fill in.
- Types (ประเภทที่ต้องเลือก), shown in Thai in the sheet: **เจ้าของตัดสิน** (owner decides: a web search cannot close it) · **ทีมตัดสิน** (team decides: BA · SA) · **กฎหมาย** (legal) · **วัดจริง** (needs a real-world number: none is published) · **ลงนาม** (sign-off). A question that cites an owner question in another doc also counts as "เจ้าของตัดสิน".
- **Before sending, read the list by eye.** The script matches wording. A row that was already answered but does not use the words "ตอบแล้ว · ปิดแล้ว · ตัดสินแล้ว" (answered · closed · decided) still gets through.
- When the user fills in answers: write the answer into the source doc, remove the label, record it in the revision history, then rerun the script. This file is a work list, not a source. Do not edit answers in this file in place of the doc.

**Technical track.** Write when you reach the point of need. No need to wait for anyone: README · BUILD-PLAN before the first line of code · DATA-DICTIONARY when designing the first table · API-SPEC at the first endpoint · PROMPT-LIBRARY at the first prompt really used · ADR at decision time (not in the final wrap-up, because the real reasons are gone by then) · Runbook before going live. Full table in [`technical-docs.md`](technical-docs.md).

---

## 4 · Who writes which doc, with which skill

Full table (agent · skill for each of 16 doc types): [`technical-docs.md`](technical-docs.md). Main ones: SRS → `requirements-writing` · FSD → `requirements-writing` · ADR → `architecture` · Test → `qa-docs` · mockup → `ui-craft` · README → `project-bootstrap`

---

## 5 · Figures in docs: choose correctly from the start

- Figures in every kind of project doc (BRD · SRS · FSD · ADR · ER · flowcharts) · slides · print work → `diagrams` (one house style). Keep them in `docs/figures/` with sources in `src/`. **Default Mermaid is banned from project docs.**
- Quick figures in a README · PR · code notes → Mermaid (`diagrams`) embedded in `.md` (colours are random and meaningless, Thai overflows the boxes, and shrunk to A4 it is unreadable).

**Every figure header needs all 6 items:** project logo · title · 1-line subtitle · figure number · version and date · owner (details in `diagrams` → `references/diagram-figures.md` section 3).

---

## 6 · Colour theme of the doc set

Declare it once per project, at the top of every doc's source file:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(The example uses the house colour `#2A78D6`. Replace it with the project's main colour.)

`document-design` · `slide-deck` · `diagrams`
read this value instead of picking colours themselves, so docs, slides and every figure form one set.

**Colour comes from the work, not from taste.** If there is a brand colour, use it. If not, use the house colour of `document-design`, write `(รอยืนยัน)`, and carry on without stopping to ask.
Exceptions that do not follow the theme: service provider logo colours · grey structural lines · green = pass / red = fail

---

## 7 · Checklist before delivering the doc set

- [ ] In every `.docx`, open the Navigation Pane and **see all headings** (use real Heading styles, not bold text)
- [ ] Every doc has a revision history page · version number · date · author
- [ ] Every figure has a figure number and is cited in the body at least once
- [ ] The source file of every figure is in `docs/figures/src/` (if this folder exists)
- [ ] Technical docs that meet the conditions in section 2.2 are all present. For example, if there is an API there must be an API-SPEC, and if an LLM is used there must be a PROMPT-LIBRARY
- [ ] Every abbreviation is spelled out at first appearance
- [ ] File names follow `workspace-rules/document-naming`: no `final2`, no `ล่าสุด` ("latest")
- [ ] Docs in the set cite each other's versions consistently
- [ ] Run `scripts/open_items.py`, and the open-items register has no row with status "เปิด" (open), or the client knows about every row still open
- [ ] Tell the user what is left in `_to_delete/` (delete only what `workspace-rules/temp-file-discipline` step 9 allows: old task folders nothing else still uses)

---

## 8 · Anti-patterns

Wrong: `.docx` with no Heading style · keeping only the PNG and not the source · `.docx` and mockups inside the code repo (at this point move to type B) · a doc in 2 places (= 2 versions) · FSD before the SRS is confirmed · using an LLM with no PROMPT-LIBRARY · sub-projects named `projects/` `modules/` `apps/` · empty folders created in advance · one doc that answers every question

---

## 10 · Links to other skills

Doc status in `docs/BUILD-PLAN.md` → `superuser/status-report` · checklist for the printed version → `assets/doc-set-checklist.md`

**Read more when needed:** [`writer-templates.md`](writer-templates.md): `technical-writer` doc templates (tutorial · API reference · release notes · for README see `project-bootstrap`)

**When the guide must go on the web, be searchable and have many versions:** [`docs-site.md`](docs-site.md): choosing MkDocs Material · Docusaurus · Starlight · VitePress · Thai search test results · hosting · Thai fonts


## reference: release-notes.md

<!-- merged from skill `release-notes` on 2026-11-27 · description was: Write user-facing release notes for a version with the technical-writer agent. -->
Use the `technical-writer` agent to create release notes for: **the user's request**

The technical writer should:

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - Audience (end users, developers, both?)
   - Tone (formal, friendly, technical)
   - Channel (in-app, email, blog, GitHub)
   - Time period covered (date range or version range)

2. **Gather inputs** — source is the commits since the last tag (written per `git-and-review`) plus `CHANGELOG.md`:
   - Commit log since last release (`git log`)
   - Merged pull requests (PRs) with their descriptions
   - Closed issues/tickets
   - Breaking changes noted

3. **Categorize changes:**
   - New features (user-visible)
   - Improvements (existing features enhanced)
   - Bug fixes (with severity context)
   - Breaking changes — every one carries 3 fields: **what changed** · **who is affected** (which users, integrations or versions) · **how to migrate** (steps or link); a field unknown → `(รอยืนยัน)`, never a one-line "X removed"
   - Security updates (Common Vulnerabilities and Exposures (CVE) entries patched)
   - Documentation updates (if significant)

4. **Translate dev-speak to user value:**
   - ผิด: "Refactored auth middleware"
   - ถูก: "Login is now 40% faster" — only with a measured number (before/after, how measured); no measurement → describe the change without a number
   - ผิด: "Fixed null pointer in cart.ts:127"
   - ถูก: "Fixed crash when removing the last item from cart"

   **Thai text:** use the news register (`human-writing` `thai-grammar.md` section 4). No first person. Write each line as subject + verb + object ("ส่งออกรายงานเป็น CSV ได้แล้ว"). End with the version number and the date.
   - ผิด: "ได้มีการปรับปรุงประสิทธิภาพในส่วนของการส่งออก ซึ่งทำให้ผู้ใช้ได้รับประสบการณ์ที่ดีขึ้น"
   - ถูก: "ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที"
   - ผิด: "เราได้แก้ไขข้อผิดพลาดที่เกิดขึ้นเมื่อผู้ใช้ทำการลบสินค้าชิ้นสุดท้าย"
   - ถูก: "ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก"

5. **Produce release notes** following the release-notes template in `project-docs/references/writer-templates.md`:
   - Too long; didn't read (TL;DR) highlights at top
   - Feature sections with examples
   - Migration guide for breaking changes
   - Contributors acknowledgment

6. **Generate accompanying communications** (if requested):
   - X / social post draft
   - Email announcement
   - Changelog entry (technical, separate)

7. **Hand-off suggestions:**
   - Marketing copy → `growth-specialist`
   - User docs updates → technical-writer (continue)
   - Migration code examples → `developer`


## reference: technical-docs.md

# Technical docs: table, writing order and who writes what

Read this when choosing the technical doc set or about to write one of them. The summary is in `SKILL.md` sections 2.2–4.

## Technical docs (section 2.2)

This group is **all markdown** and **does not depend on project size**. It depends on what the project contains.

| Doc | File | Answers the question | Needed when |
|---|---|---|---|
| README | `<project-name>/README.md` | How to install and run | **Always** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | What to build first and next · where we are now | **Always** |
| USER-STORIES | `docs/USER-STORIES.md` | What to build for whom · which story is ready for a sprint · what the AC (acceptance criteria) are | Work runs in sprints or there is a backlog (`requirements-writing`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | Which stories this sprint takes · what the goal is · what the risks are | Work runs in sprints (`/sprint-plan`). One file per sprint; never overwrite old ones |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | How the agent works in a cycle · what the stop condition is | An agent writes code in rounds (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | What each endpoint accepts, returns and how it fails | There is an API that others call (`api-design`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | What a field means · what values it can take | There is a database or data schema (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | What measures whether the output is good enough · what the pass threshold is | Output comes from a model or LLM that is not always right |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | Which prompt is the real one · which version · what changed | An LLM sits on the system's main path |
| ADR | `docs/decisions/ADR-*.md` | Why we chose this way and not the other | A decision will be questioned again (`architecture`) |
| Runbook | `docs/runbook-<topic>.md`, one topic per file | What to do when the system goes down at 2 a.m. | A system is really running and someone is on call |

> **The 4 conditional docs (LLM · API · database) are the ones people forget most often.**
> The team then ends up asking the agent every round "which prompt is the real one" or "what does this field mean".

## Technical track: when to write (section 3)

| Write when | Doc |
|---|---|
| Before the first line of code | README · BUILD-PLAN |
| Before letting an agent work in rounds | AGENT-LOOP |
| When designing the first table | DATA-DICTIONARY |
| When designing the first endpoint | API-SPEC |
| When writing the first prompt that will really be used | PROMPT-LIBRARY · EVALUATION-POLICY |
| When deciding something that will be questioned again | ADR |
| Before going live | Runbook |

> **Write the ADR and DATA-DICTIONARY at decision time, not in the project wrap-up.**
> You can write them afterwards, but the real reasons are gone by then.

## Who writes which doc, with which skill (section 4)

| Doc | agent | skill used |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `document-design` |
| BRD · user story | `business-analyst` | `requirements-writing` |
| SRS | `system-analyst` | `requirements-writing` |
| FSD | `system-analyst` | `requirements-writing` |
| Architecture | `solution-architect` | `architecture` · `diagrams` |
| ADR | `solution-architect` | `architecture` |
| Test Plan · Test Cases | `qa-tester` | `qa-docs` |
| mockups | `ux-designer` | `ui-craft` |
| User guide (`MAN`) | `technical-writer` | `design-gate/polished-document-style` |
| Runbook | `devops-engineer` | `incidents-and-monitoring` |
| BUILD-PLAN | `project-manager` | `superuser:ground-rules` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-design` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | none (pairs with skill `ai-engineering`) |


## reference: writer-templates.md

# technical-writer templates — README · tutorial · API reference · release notes

**Contents:** README · Tutorial Template · API Reference Template · Release Notes Template

Open when you actually have to write this kind of document · put `(รอยืนยัน)` (to be confirmed) on any part you do not know.

## Standard Outputs

### README

There is no README template here — use the single template of `project-bootstrap` (`SKILL.md` item 2 and `assets/starter-files.md`). The 15-section skeleton (9 always present · 6 present when the project has that thing) is in `references/readme-skeleton.md` · commands per language are in `references/readme-by-stack.md`.

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes must always come before the other sections (right after Highlights) — the full release notes rules are in the skill `release-notes.md`.

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (Thai)

> Same structure as the English version · wording at news register (`human-writing` `references/thai-grammar.md` section 4): no first person · each line has subject + verb + object · numbers must be measured, and if there are none, leave them out · right/wrong examples are in the skill `release-notes.md` item 4.

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````


---

# skill: database-design

Use when designing or changing a database schema

# Database design

> **One rule:** the schema is the hardest thing in a system to change.

## When to use this skill

- Designing the database of a new system or a new module
- Adding or changing a table, column, relationship or index
- Writing a migration, especially once the system holds real data
- A query is slow and you suspect the schema or an index

Not for: overall architecture → `architecture` · endpoints and JSON shapes → `api-design` · passwords, tokens, permissions → `web-service-essentials` · running migrations in a pipeline → `cicd-and-release`

**Syntax specific to each database, data types compared, and the migration commands of each Object-Relational Mapping (ORM) tool** are in `references/per-stack.md`.

---

## 1 · Choose the database type first

| Criterion | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| Data has clear relationships and needs joins | ✓ | ✗ must be done by hand |
| Data shape is uncertain and differs per record | Careful: use a JSON column | ✓ |
| Needs transactions across several tables | ✓ | Careful: possible but costlier |
| Reports, totals, analysis | ✓ | ✗ |
| Very heavy writes, log/telemetry | Careful | ✓ or use a time-series database |

> **The default is relational.** Choose document only when you **can answer why**.
> "More flexible" is not a reason. It means the design is not done yet.

**You can mix them**: use relational as the base, and store data of uncertain shape in a `jsonb` column.
In almost every case this is better than running 2 separate databases.

---

## 2 · Naming rules — choose once, use across the whole system

| What you name | Format | Example |
|---|---|---|
| Table | `snake_case` **plural** | `orders`, `order_items` |
| Column | `snake_case` singular | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<singular table>_id` | `customer_id` |
| Join table | `<a>_<b>` in alphabetical order | `role_users` ✓ (not `user_roles`) |
| index | `ix_<table>_<column>` | `ix_orders_customer_id` |
| unique | `ux_<table>_<column>` | `ux_users_email` |
| foreign key constraint | `fk_<table>_<target table>` | `fk_orders_customers` |
| check constraint | `ck_<table>_<topic>` | `ck_orders_total_non_negative` |

**Do not:**

- Wrong: put the data type in the name, such as `name_varchar`, `is_active_bit`
- Wrong: prefix a column with the table name, such as `order_order_date` (it is already in the `orders` table)
- Wrong: use reserved words such as `user`, `order`, `group`, `key`, which need quotes every time. Use `users`, `orders` instead.
- Wrong: use abbreviations people cannot read, such as `cst_nm`. It saves 8 characters but costs 3 years of confusion.

> SQL Server may use `PascalCase` if the existing project already does.
> **Using one style across the whole system matters more than which style is right.** Do not switch midway.

---

## 3 · Columns every table must have

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

Add these as needed:

| Column | Add when | Note |
|---|---|---|
| `deleted_at timestamptz` | Data must be recoverable, or the law requires keeping it | **Every query must filter on it**, or deleted data shows up |
| `created_by` / `updated_by` | You must be able to say who changed it | Store the user id, not the name |
| `row_version` / `xmin` | Several people can edit at the same time | Use with the ETag in `api-design` |
| `tenant_id` | Multi-tenant system | See section 10 |

> **soft delete (delete by only setting a flag) has a cost**: every unique constraint must be rethought.
> `ux_users_email` will block signing up with the same email again, even though the old account was deleted.
> Fix it with a partial index: `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · Choose the identifier type

| Type | Pros | Cons | Use when |
|---|---|---|---|
| `bigint` auto-increment | Small, fast, index does not fragment, easy to read when tracing problems | Next id can be guessed · ids collide when merging data from several places | Default, single system, single database |
| **UUIDv7 / ULID** | Sorted by time · can be generated on the app side · no collisions | 16 bytes · hard to read by eye | Distributed system · id needed before saving · id appears in a URL |
| `UUIDv4` fully random | No collisions, cannot be guessed | **index fragments, and writes get clearly slower with lots of data** | Avoid if you can |

> **UUIDv4 as a primary key is the most common trap.**
> Fully random values make every insert land in the middle of the index structure.
> You do not feel it at tens of thousands of rows, but at tens of millions it gets so slow you must rebuild.
> If you must use a UUID, use **v7**, which starts with the time, so it grows in order like bigint.

**A number people see is not the primary key**: a purchase order number such as `SO-2026-00042` that the customer refers to
should be stored as a separate column with a unique constraint, and the primary key should not be shown.

---

## 5 · How much normalisation is enough

**Always start at Third Normal Form (3NF)**: each fact is stored in one place.

You may denormalise (accept duplicated data) only when all 3 of these hold:

1. You measured and it is truly slow (with numbers, not a feeling).
2. You know how the duplicated data will be updated so that the copies match.
3. You wrote the reason in the table comment.

**A commonly accepted exception**: data that must be "frozen" at a point in time.
The product price in a purchase order must be copied into `order_items.unit_price`
and not joined to `products.price`, because today's price is not the price on the day the customer bought.

---

## 6 · Four data types people get wrong all the time

Details of the 4 data types people get wrong all the time (money · time · enum or status · boolean), with examples, are in [`data-types`](references/data-types.md).

## 7 · index — where to put one so it works

**Must have:**

- Every foreign key (most databases **do not create it automatically**)
- Columns in the `WHERE` of frequently run queries
- Columns used in `ORDER BY` together with pagination

**composite index (an index on several columns): column order matters**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

Order the columns by condition type: **equals → range → sort**.
An index `(a, b)` works for a query that filters on `a` alone, but **not** for one that filters on `b` alone.

**Do not add an index when:**

- The table has fewer than a few thousand rows, because the database reads the whole table faster
- The column has many repeated values, such as `is_active` where 95% are true
- The table is written far more often than read, because every index adds cost on every write

> **Measure before guessing**: `EXPLAIN ANALYZE` (PostgreSQL) or the execution plan (SQL Server)
> tells you whether the index is really used. Guessing that it "should help" is wrong more often than right.

---

## 8 · Constraints live in the database, not only in the app

| Rule | Where it should live |
|---|---|
| Email must not repeat | `UNIQUE` in the database **and** a check in the app so the error message looks nice |
| Amount must not be negative | `CHECK (total_amount >= 0)` |
| A purchase order must have a real customer | `FOREIGN KEY` |
| Status must be one of the defined values | `CHECK` or a lookup table |

> **Reason:** the app is not the only thing that touches the data. There are also urgent data-fix scripts,
> import jobs at 3 a.m., and a 2nd service written later.
> A constraint in the database is the last gate that nobody can skip.

**Choose `ON DELETE` on purpose:**

| Option | Meaning | Use with |
|---|---|---|
| `RESTRICT` (the default you should use) | Cannot delete while children exist | Almost every case |
| `CASCADE` | Delete all the children too | True components, such as `order_items` |
| `SET NULL` | Child becomes parentless | Optional relationships |

If you put `CASCADE` in the wrong place just once, deleting 1 customer wipes 10 years of purchase history with it.

---

## 9 · migration — change the schema without taking the system down

The expand-and-contract steps, and example migrations that deploy without downtime, are in [`migrations`](references/migrations.md).

Data warehouses for analysis (star schema · SCD · ELT) are in [`warehouse-modeling`](references/warehouse-modeling.md) · pipelines that can rerun safely (incremental · backfill · data quality tests · checklist before going to production) are in [`data-pipeline-patterns`](references/data-pipeline-patterns.md).

## 10 · Multi-tenant systems

| Style | How separate | Cost | Fits |
|---|---|---|---|
| A `tenant_id` column in every table | Low: one slip and data leaks across tenants | Cheapest | Many tenants, small data per tenant |
| A separate schema per tenant | Medium | Migrations must loop over every schema | Tens to hundreds of tenants |
| A separate database per tenant | Highest | Most expensive | Enterprise customers who require separation |

> **Important:** if you choose the `tenant_id` style, **enforce it at the lowest layer, not by adding it to each query**.
> Use the database's row-level security, or the ORM's global filter.
> A single query that forgets `WHERE tenant_id = ?` shows one customer's data to another,
> and no error appears at all.

---

## 11 · Personal data

- Keep a list of **which columns are personal data**. Without this list you cannot answer the question "where is my data?".
- National ID numbers, credit card numbers and health data: encrypt at the column level, or do not store them at all if not needed.
- Set a **retention period** per table, and have a real job that deletes accordingly.
- Data must be deletable when the owner asks, and soft delete alone does not count as deleting.
- Never copy real data onto a developer machine without masking it.

---

## 12 · Anti-patterns

- **One table that stores everything** (`entity` / `attribute` / `value`): every query becomes hard.
- **`varchar(255)` on every column**: this number means nothing. Set it from real data.
- **Several values in one column**, such as `"1,4,7"`: cannot search it, cannot add a constraint. Use a join table.
- **No foreign key because "the app takes care of it"**: one day you will have orphan rows.
- **An index on every column just in case**: writes get slower and storage bloats, with no one benefiting.
- **`SELECT *` in real code**: the code breaks every time a column is added.
- **Business logic in triggers**: problems are untraceable, because nobody sees it running.
- **A migration that also writes data**, mixed with the structure change: on rollback the data is lost.
- **Changing the schema on production by hand**: at the next deploy the schema will not match.


## reference: data-pipeline-patterns.md

# Data pipeline patterns — incremental, backfill, quality, catalog

Every pipeline must give the same result when run again (`code-craft`) and must always pass values into SQL as parameters.

**สารบัญ:**

- [Pipeline Patterns](#pipeline-patterns)
- [Data Catalog Pattern](#data-catalog-pattern)
- [Production Pipeline Checklist](#production-pipeline-checklist)

## Pipeline Patterns

### Pattern 1: Incremental Loading

```sql
-- dbt incremental model
{{ config(materialized='incremental', unique_key='id') }}

SELECT
    id,
    user_id,
    event_type,
    created_at
FROM {{ source('raw', 'events') }}
WHERE 1=1
{% if is_incremental() %}
    -- Only new since last run
    AND created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}
```

### Pattern 2: Late-arriving Data

```sql
-- Don't just look at last 1 hour, look back further for late events
WHERE created_at > NOW() - INTERVAL '7 days'  -- buffer
  AND created_at > (SELECT MAX(created_at) - INTERVAL '1 day' FROM target)
```

### Pattern 3: Data Quality Tests (dbt)

```yaml
# models/marts/orders.yml
version: 2

models:
  - name: orders
    description: One row per order
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
      - name: amount
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

### Pattern 4: Idempotent Backfills

```python
# Backfill should be safe to re-run
async def backfill(start_date: date, end_date: date):
    for d in date_range(start_date, end_date):
        # DELETE then INSERT in one transaction (idempotent); value passed as a parameter, never in the SQL string
        async with db.transaction():
            await db.execute("DELETE FROM target WHERE date = $1", d)
            await load_for_date(d)
```

### Pattern 5: Real-time Pipeline

```python
# Kafka consumer pattern
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'events',
    bootstrap_servers='kafka:9092',
    enable_auto_commit=False,  # ← manual commit = at-least-once (not exactly-once)
    isolation_level='read_committed',
)

batch = []
for message in consumer:
    batch.append(parse(message))

    if len(batch) >= 1000:
        # Write first, commit the offset after. Kafka and the DB share no
        # transaction, so a crash between the two replays this batch
        # (at-least-once). Make the write idempotent so a replay is harmless.
        with db.transaction():
            db.bulk_upsert('events', batch, key=('topic', 'partition', 'offset'))  # unique key + ON CONFLICT DO NOTHING
        consumer.commit()  # only after the DB write succeeds
        batch = []
```

For exactly-once effect: idempotent upsert as above, or store the offsets in the
same DB transaction as the data and seek to them on start (skip `consumer.commit()`).

## Data Catalog Pattern

For every table, document:

```yaml
- table: dim_customer
  description: Slowly-changing customer master
  owner: data-team
  freshness: hourly
  source: postgres.app.users (CDC)
  pii: yes
  retention: 7 years
  columns:
    - name: customer_key
      description: Surrogate key
    - name: customer_id
      description: Natural key from source system
    - name: email
      pii: yes
```

## Production Pipeline Checklist

- [ ] Schema validation at ingestion
- [ ] Schema evolution handled (additive only)
- [ ] Tests on critical columns (uniqueness, not-null, ranges)
- [ ] Monitoring on row counts, freshness, error rates
- [ ] Alerting (PagerDuty / Slack) on failures
- [ ] Backfill procedure documented + tested
- [ ] Idempotency verified
- [ ] Lineage visible (dbt docs, OpenLineage)
- [ ] PII tagged
- [ ] Access controls per dataset
- [ ] Cost monitored (query / storage)


## reference: data-types.md

# 6 · Four data types that are routinely got wrong

### Money

```sql
total_amount   numeric(19,4)   NOT NULL      -- ถูก:
currency       char(3)         NOT NULL      -- ถูก: ISO 4217 เช่น THB
total_amount   float / double                -- ผิด: 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> Wrong: **float for money is a bug you cannot find.** The total drifts by 1 satang per line
> You only learn at month-end close, and cannot trace back where it drifted

### Time

| Store | Use | Reason |
|---|---|---|
| Time an event happened | `timestamptz` (SQL Server uses `datetimeoffset`) stored as UTC | Thailand has no daylight saving, but systems sold abroad do |
| Birth date, due date | `date` | no time, no time zone |
| Shop opening hours | `time` + a separate time zone column | |

**Rule:** store UTC and convert to `+07:00` only at display time; never store raw Thai time in a `timestamp` that has no zone

**Buddhist Era (BE)**: always store Common Era (CE), then convert to BE at display time
If you store the year 2569 in the database, every function will compute durations wrongly

### enum / status

| Approach | Good when | Bad when |
|---|---|---|
| Lookup table + foreign key | values can be added without a deploy, has Thai/English names, and has a display order | needs a join |
| `check constraint` as text | constant values that rarely change | adding a value needs a migration |
| PostgreSQL `enum` type | fast, small | **a value cannot be removed** and the order cannot be changed |
| raw `int` | — | ✗ reading `status = 3`, nobody knows what it means |

### boolean

- Name it as a positive statement: `is_active` (right) · `is_not_disabled` (wrong)
- **If a third state might appear in the future, do not use boolean**, because `is_approved` will become `approval_status`
  within 6 months, once "รออนุมัติ" (awaiting approval) is added

---


## reference: migrations.md

# 9 · migration — change the schema without taking the system down

**3 rules:**

1. **Forward only**: a migration that has been merged must not be edited; if it is wrong, write a new one over it
2. **1 migration does one thing**: easy to trace problems, and rollback is exact
3. **Old-version code and the new-version schema must work together**, because during a deploy both versions of the code always run at the same time

### expand / contract — the standard steps for a change that destroys something existing

Example: rename the column `name` → `full_name`

| Deploy round | Database | Code |
|:--:|---|---|
| **1 · Expand** | add `full_name` (nullable) | write to both columns · read from `name` |
| **2 · Migrate** | copy old data in batches | read from `full_name`, fall back to `name` if it has no value |
| **3 · Contract** | set `NOT NULL` · drop `name` | read and write only `full_name` |

3 rounds looks slow, but every round can roll back without losing data
If you do it in one round, you must accept that the system has to go down

**Commands that lock the table until the system hangs** (be extra careful on large tables):

- Adding a column with both `DEFAULT` and `NOT NULL` at once — newer PostgreSQL does this fast, and MySQL 8.0.12 and up can add a column as INSTANT (changing a data type still rewrites the table)
- Changing a data type
- Creating a plain index; use `CREATE INDEX CONCURRENTLY` instead (PostgreSQL) or `ONLINE = ON` (SQL Server)

**Always test a migration against a copy of real data**, because a migration that runs in 0.2 seconds on your own machine
may take 40 minutes on production and hold the table lock the whole time

---


## reference: per-stack.md

# Syntax and tools per database and ORM

**Contents:** 1 Data types compared · 2 PostgreSQL · 3 SQL Server · 4 MySQL / MariaDB · 5 MongoDB · 6 Entity Framework Core (.NET) · 7 Prisma / Drizzle (Node) · 8 Alembic (Python) · 9 Slow query commands

1. [Data types compared](#1--data-types-compared)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [Slow query commands](#9--slow-query-commands)

---

## 1 · Data types compared

| To store | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| Auto-increment id | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` or `CHAR(36)` |
| Money | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| Time + time zone | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (store UTC) |
| Date only | `date` | `date` | `DATE` |
| Unlimited-length text | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| Thai text | `text` (already UTF-8) | **`nvarchar` only** | `utf8mb4` |
| True/false | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (can be indexed) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| Binary file | `bytea` (or store outside the database) | `varbinary(max)` | `BLOB` |

> **SQL Server + Thai**: `varchar` turns Thai characters into `?`.
> Use `nvarchar` and always write literals as `N'ข้อความ'`.
>
> **MySQL must use `utf8mb4`**, because MySQL's character set named plain `utf8`
> stores only 3 bytes per character, so emoji and some other characters are lost.

---

## 2 · PostgreSQL

```sql
CREATE TABLE orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no      varchar(20)  NOT NULL,
  customer_id   bigint       NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status        varchar(20)  NOT NULL DEFAULT 'draft',
  total_amount  numeric(19,4) NOT NULL DEFAULT 0,
  currency      char(3)      NOT NULL DEFAULT 'THB',
  meta          jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0),
  CONSTRAINT ck_orders_status CHECK (status IN ('draft','confirmed','shipped','cancelled'))
);

CREATE UNIQUE INDEX ux_orders_order_no ON orders (order_no) WHERE deleted_at IS NULL;
CREATE INDEX ix_orders_customer_id ON orders (customer_id);
CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC);
```

**Create an index without locking the table:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- Must not run inside a transaction · if it fails it leaves an index in invalid state: DROP it and redo
```

**Update `updated_at` automatically:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**Row-level security for multi-tenant systems:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- The app sets this per connection: SET app.tenant_id = '42';
```

**Common PostgreSQL traps** (ideas from wshobson postgresql-table-design · version numbers are the version where the behaviour began)

| Trap | Do this instead |
|---|---|
| `timestamp` (no time zone) silently drops the offset, so a `+07:00` machine and UTC store values with different meanings | Always `timestamptz` |
| `serial` creates a separate sequence whose permissions and `DROP` do not follow the table | `GENERATED ALWAYS AS IDENTITY` (PG 10+) |
| `ADD COLUMN ... NOT NULL` on a big table risks a long lock | With a constant `DEFAULT` the table is no longer rewritten (PG 11+) · a function DEFAULT such as `now()` still rewrites the whole table |
| `ADD CONSTRAINT` (FK · CHECK) scans the whole table while holding the lock | Use `... NOT VALID` first, then run `VALIDATE CONSTRAINT` as a separate statement (lighter lock) |
| DDL queues behind a long transaction, and every query after it waits too | Run `SET lock_timeout = '5s'` before every DDL, and rerun if it times out |
| A unique index lets `NULL` repeat on many rows | `UNIQUE NULLS NOT DISTINCT` (PG 15+) or a partial index `WHERE col IS NOT NULL` |
| `LIKE '%คำ%'` and `ILIKE` do not use a btree index | Extension `pg_trgm` + GIN index · for serious text search use `tsvector` |
| `jsonb` search with `->>` does not use an index | GIN index on the column (`@>` · `?`) or an expression index on `(meta->>'key')` |
| `count(*)` over the whole table to show a page count | Use the estimate from `pg_class.reltuples`, or drop the total count (cursor pagination) |

---

## 3 · SQL Server

```sql
CREATE TABLE orders (
  id            bigint IDENTITY(1,1) PRIMARY KEY,
  order_no      nvarchar(20)   NOT NULL,
  customer_id   bigint         NOT NULL,
  status        nvarchar(20)   NOT NULL CONSTRAINT df_orders_status DEFAULT N'draft',
  total_amount  decimal(19,4)  NOT NULL CONSTRAINT df_orders_total DEFAULT 0,
  created_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_created DEFAULT sysdatetimeoffset(),
  updated_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_updated DEFAULT sysdatetimeoffset(),
  row_version   rowversion,
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0)
);

CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC)
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL only
```

- `rowversion` works directly as an ETag to detect conflicting edits.
- To sort Thai correctly, set the collation `Thai_100_CI_AS` at the column or database level.
- The old `datetime` has a precision of only 3.33 milliseconds. Use `datetime2` / `datetimeoffset` instead.

---

## 4 · MySQL / MariaDB

```sql
CREATE TABLE orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(20)   NOT NULL,
  customer_id  BIGINT        NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_orders_order_no (order_no),
  KEY ix_orders_customer_id (customer_id),
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- From MySQL 8.0.12, `ADD COLUMN` can use `ALGORITHM=INSTANT` (before 8.0.29 it could add only at the end of the table). Changing a data type still rewrites the table (dev.mysql.com online DDL, checked 22 Oct 2026 (B.E. 2569)). For big tables that need a rebuild, use `pt-online-schema-change` or `gh-ost`.
- Set the server time to UTC (`default_time_zone = '+00:00'`).

---

## 5 · MongoDB

```js
db.createCollection("orders", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["orderNo", "customerId", "totalAmount", "createdAt"],
    properties: {
      orderNo:     { bsonType: "string" },
      customerId:  { bsonType: "objectId" },
      totalAmount: { bsonType: "decimal" },   // wrong: do not use double for money
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- Embed when the child data is **always read together with the parent and does not grow without limit**. Otherwise use references.
- One document has a 16 MB ceiling, so an array that keeps growing will hit it one day.
- Use `Decimal128` for money, and nothing else.

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # right: review the SQL before the real run
dotnet ef database update                                # dev only
```

> **On production, run the reviewed script, not `database update`.**
> That command needs the app's connection to have permission to change the schema, which it should not have in the first place.

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete across the whole system
    e.Property(x => x.RowVersion).IsRowVersion();        // detect conflicting edits
});
```

---

## 7 · Prisma / Drizzle (Node)

```prisma
model Order {
  id          BigInt   @id @default(autoincrement())
  orderNo     String   @unique @map("order_no") @db.VarChar(20)
  totalAmount Decimal  @map("total_amount") @db.Decimal(19, 4)
  status      String   @db.VarChar(20)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(3)
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  BigInt   @map("customer_id")

  @@index([status, createdAt], name: "ix_orders_status_created")
  @@map("orders")
}
```

```bash
npx prisma migrate dev --name add_order_status   # dev — creates the migration file
npx prisma migrate deploy                        # production — runs only the existing ones
```

- Prisma's `Decimal` returns an object, not a number. Calculate with `decimal.js` and do not convert to float.
- `BigInt` cannot be converted to JSON directly. Convert it to a string at the API layer.

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

Split into 3 migrations (1 migration does one thing):

```python
# 1) schema: add a nullable column
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))

# 2) data: backfill existing values (on a big table, do it in small batches)
def upgrade():
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")

# 3) schema: enforce NOT NULL and create the index
def upgrade():
    op.alter_column("orders", "status", nullable=False)
    # CREATE INDEX CONCURRENTLY must not run inside a transaction, so step out of Alembic's transaction
    with op.get_context().autocommit_block():
        op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                        postgresql_concurrently=True)
```

> `--autogenerate` **does not see** renames (it reads them as a drop plus a new add, so the data is lost).
> Always read the file it generates before you commit.

---

## 9 · Slow query commands

| Database | Command |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · extension `pg_stat_statements` |
| SQL Server | Turn on "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**Danger signs to fix:** `Seq Scan` / `Table Scan` on a big table ·
estimated row count differs from the actual by more than 10 times · a `Nested Loop` that runs hundreds of thousands of times


## reference: warehouse-modeling.md

# Warehouse modeling — ELT, stack, star schema, SCD

For an analytics warehouse, not an application database.

**สารบัญ:**

- [ELT vs ETL (Modern Default: ELT)](#elt-vs-etl-modern-default-elt)
- [Tech Stack (2026 Recommendations)](#tech-stack-2026-recommendations)
- [Schema Design: Star/Snowflake](#schema-design-starsnowflake)
- [SCD (Slowly Changing Dimensions)](#scd-slowly-changing-dimensions)

## ELT vs ETL (Modern Default: ELT)

```
ETL (old way):
Source → Transform → Warehouse
        ↑
        Limited compute, slow

ELT (modern):
Source → Load raw → Transform in warehouse
                    ↑
                    Snowflake/BigQuery scale
```

> **2026 default: ELT with dbt** — load raw to warehouse, transform with SQL via dbt

## Tech Stack (2026 Recommendations)

> The tool list comes from model knowledge and has not been checked against official websites (รอยืนยัน, awaiting confirmation). Check before recommending.

### Warehouse / Lake
| Tool | Best for | Cost |
|------|----------|------|
| **Snowflake** | Pure warehouse, separation of compute/storage | $$|
| **BigQuery** | Serverless, ad-hoc, GCP shops | $$|
| **Databricks** | Unified lake + warehouse, ML-heavy | $$$|
| **DuckDB** | Local dev, embedded analytics | $free |
| **Redshift** | AWS-native, legacy | $$|
| **Postgres** | Small data (<1TB), simplicity | $|

### Transformation
- **dbt** — SQL-based, version controlled, tested (industry default)
- **SQLMesh** — newer alternative to dbt, stronger features

### Orchestration
- **Airflow** — most popular, mature
- **Prefect** — modern Python-native
- **Dagster** — software-engineering approach to pipelines

### Stream Processing
- **Kafka + Flink** — high throughput, exactly-once
- **Kinesis Streams + Flink** — AWS-native
- **Pub/Sub + Dataflow** — GCP-native
- **Materialized views** (Snowflake, BigQuery) — for simple cases

### Ingestion
- **Airbyte** — open source, many connectors
- **Fivetran** — managed, expensive but reliable
- **Estuary** — modern, streaming-first
- **Custom** — for sources not covered

## Schema Design: Star/Snowflake

```sql
-- Fact table (events / measurements)
CREATE TABLE fact_orders (
    order_key BIGINT PRIMARY KEY,
    customer_key BIGINT,
    product_key BIGINT,
    date_key INT,
    quantity INT,
    amount NUMERIC(19,4)
    -- foreign keys to dimensions
);

-- Dimension tables (descriptive context)
CREATE TABLE dim_customer (
    customer_key BIGINT PRIMARY KEY,
    customer_id VARCHAR,        -- natural key
    name VARCHAR,
    email VARCHAR,
    country VARCHAR,
    -- SCD Type 2 tracking:
    valid_from DATE,
    valid_to DATE,
    is_current BOOLEAN
);
```

> **Star = denormalized, query-fast**
> **Snowflake = normalized dims, save storage**
> **Wide tables / OBT (One Big Table) = even faster for analytics**

## SCD (Slowly Changing Dimensions)

### Type 1: Overwrite
```
Customer Bob lived in Bangkok. Moved to Phuket.
→ Update row, lose Bangkok history
```

### Type 2: New row per change (most common)
```
| customer_key | id | name | city    | valid_from | valid_to   | is_current |
| 1            | 42 | Bob  | Bangkok | 2024-01-01 | 2025-06-30 | false      |
| 2            | 42 | Bob  | Phuket  | 2025-07-01 | 9999-12-31 | true       |
```

### Type 3: Add column
```
Customer table: current_city, previous_city
→ Only most recent change preserved
```


---

# skill: web-service-essentials

Use when building an HTTP backend, login, config, uploads or audit

# web-service-essentials — the basic parts every HTTP backend needs before its first business endpoint

> **The one rule:** before writing the first business endpoint, the service must be able to answer "Are you still alive? · Are you ready for work? · Which version are you running now?" If it cannot, on the day the system goes down you will be guessing blind.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| New service, health check, ping, readiness, version endpoint, graceful shutdown, one error format | This file: sections 1 to 4 |
| Login with sessions, JWT, OAuth, SSO, MFA, passwords, lockout | [`references/auth-implementation-patterns.md`](references/auth-implementation-patterns.md) · [`references/auth-flows.md`](references/auth-flows.md) · [`references/mfa.md`](references/mfa.md) · [`references/api-auth-and-authorization.md`](references/api-auth-and-authorization.md) |
| Settings differ by environment, secrets must stay hidden, `.env` files | [`references/config-and-secrets.md`](references/config-and-secrets.md) |
| Users upload files, or the app serves stored files | [`references/file-upload-and-storage.md`](references/file-upload-and-storage.md) |
| The system must record who did what and when | [`references/audit-trail.md`](references/audit-trail.md) |
| Ready-made libraries and sample code | [`references/libraries-and-code.md`](references/libraries-and-code.md) |
| Stack-specific setup (.NET, Angular, Node, Python) | [`references/per-stack.md`](references/per-stack.md) |

## When to use this skill

- Starting a new service / REST API / microservice
- Someone asks for a health check, ping, readiness, liveness, or version endpoint
- Deploying to production for the first time, or moving into Docker/Kubernetes
- You must set one API error format for the whole system

## When **not** to use it

- To design business endpoints, use the command `/api-design`
- For URL style · paging · dates · API ids, use `api-design`
- For log format, use `errors-and-logs`
- To choose an architecture, use `architecture`
- To check responses against OpenAPI in CI or catch breaking changes, see `api-design` [`references/contract-testing.md`](../api-design/references/contract-testing.md)

---

## 1 · The 4 basic endpoints

| Endpoint | What it answers | auth | Checks dependencies | Who calls it |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | no | no | load balancer, every second |
| `GET /health/live` | the process is still alive | no | **no** | orchestrator (restarts if dead) |
| `GET /health/ready` | ready to take traffic | no | yes | orchestrator (removes from the pool) |
| `GET /version` | what is running | no* | no | a person, when tracing a problem |

> **live must not check dependencies.** This is the most common mistake.
> If `/health/live` checks the database (DB) and the DB goes down briefly, Kubernetes will **kill every pod**
> even though the app itself is fine. When the DB comes back, no pod is left to take traffic.
> The dependency check belongs in `/health/ready`, which only removes a pod from the pool for a while.

\* If you do not want the public to see the commit hash in `/version`, restrict it so only the internal network can call it.

**Wire it to Kubernetes like this** — live and ready must point to different paths, or the point above means nothing.

```yaml
livenessProbe:            # dead → restart the container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # let the app start first, or it gets killed before it can listen
  periodSeconds: 10
  failureThreshold: 3     # restart only after 3 failures in a row (30 seconds)
readinessProbe:           # not ready → remove from the Service for a while, no restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

For an app with a long warm-up (loading a model · a big cache), add a `startupProbe` pointing to `/health/live` with a high `failureThreshold`, instead of stretching the liveness `initialDelaySeconds`.

### Response shape (the same in every language)

```jsonc
// GET /health/ready → 200 normally · 503 when a critical dependency is down
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 states, not 2:**
- `up` — everything is normal → 200
- `degraded` — a **non-critical** dependency is down (such as email) but the service can still take traffic → 200
- `down` — a critical dependency is down (such as the DB) → **503**

**Every check must have a timeout** (default 3 seconds). Otherwise a hung dependency
makes the health endpoint hang too, and the orchestrator makes the wrong decision for the whole system.

**Never send a stack trace or connection string out through these endpoints**, because anyone can call them.

---

## 2 · One error format for the whole system

Follow **RFC 9457 (`application/problem+json`)**, which is a real standard, so you do not invent your own.

```jsonc
// 422 — the format is right, but the data fails a rule (see the table below)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // matches the cid in the log — trace the case at once
  "errors": [                           // validation only · every field in one response
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` is the full path including array indexes · `code` is for programs · `message` is for people

| Status | Use when |
|---|---|
| 400 | Malformed data |
| 401 | Not yet authenticated |
| 403 | Authenticated but not allowed |
| 404 | The thing does not exist |
| 409 | Conflicts with current state (duplicate, overwrite) |
| 422 | Format is right but breaks a business rule |
| 429 | Called too often — must have `Retry-After` |
| 500 | Our side broke — **never send internal details out**, send `requestId` instead |

> **A 500 must say only "an error occurred, please report this requestId".** The real details stay in the log.
> Sending a stack trace out is like handing the system's blueprint to someone looking for a way in.

---

## 3 · Request id

- Accept it from the **`X-Request-Id`** header only when it matches `^[A-Za-z0-9-]{1,64}$` · if it is missing or does not match → create a new one (a uuid cut to 8 characters).
  This value goes into every log line. If you accept it as is, the sender can insert new lines or fake text into the log (log injection).
- **Return it in a response header every time**, including on errors.
- Put it in every log line (see `errors-and-logs`) and in the error body.
- Pass it on to the downstream service every time you call across systems.

When a customer calls to say "it broke", ask for the requestId and `grep` once to find the whole story.

---

## 4 · Graceful shutdown

On a new deploy the orchestrator sends `SIGTERM`. If the app dies at once, requests in progress are cut off midway.

```
SIGTERM → 1. Stop accepting new requests (make /health/ready answer down at once)
          2. Wait for in-flight requests to finish (timeout 15–30 seconds)
          3. Close the DB pool / queues / files
          4. exit(0)
```

> Step 1 matters more than it looks. `/health/ready` must answer `down` about 5 seconds **before** the real shutdown,
> so the load balancer removes us from the pool in time. Otherwise traffic keeps arriving while we are closing.

---

## 5 · What must exist before deploy (not optional)

- **Timeouts everywhere**: incoming requests, outgoing calls, and DB queries. Without a timeout, the moment a downstream is slow, the whole system hangs with it.
- **Limit body size** (for example 1MB) to stop memory blowing up from a large payload.
- **Cross-Origin Resource Sharing (CORS) names the origin explicitly** — `*` is allowed only for a public API with no cookies.
- **Rate limit** at least on the login endpoint and on anything that sends a one-time password (OTP)/email.
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (replaces the old `X-Frame-Options` header · also add `X-Frame-Options: DENY` for old browsers) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` sets them all in one line · .NET: `UseHsts()` sets only HSTS, and the rest needs a short middleware or the package `NetEscapades.AspNetCore.SecurityHeaders` (example in `references/per-stack.md`)
- **Turn off the full error page in production** (`app.UseDeveloperExceptionPage()` in dev only)
- **Put the version in the path**: `/api/v1/...` from day one, because moving later costs much more.
- **OpenAPI** generated from the real code, not written by hand and then forgotten.

---

## 6 · Ready-made code

| File | Stack | Status |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ all 4 endpoints run and tested, plus the degraded/down/timeout cases |
| `assets/health_py.py` | Python / FastAPI | ✓ run and tested the same way, results match on every field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | Caution: not yet compiled or tested |

Usage snippets for the Node and Python routers: [`references/per-stack.md`](references/per-stack.md).

---

## 7 · Check the work

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# stop the DB and call again — ready must be 503 but live must still be 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` does **not** touch the DB — it still answers 200 with the DB stopped
- [ ] `/health/ready` answers 503 when a critical dependency is down
- [ ] When a non-critical dependency is down, the result is `degraded` + 200 (still takes traffic)
- [ ] Every check has a timeout — make a dependency hang, and the endpoint must answer within ~3 seconds
- [ ] `/version` matches the commit actually deployed
- [ ] Every response has `X-Request-Id`, including a 500
- [ ] Trigger a 500 and confirm no stack trace / connection string leaks out
- [ ] After `SIGTERM`, in-flight requests finish before the app closes
- [ ] `/ping` is not written to the log (or the file fills up with pings)

## Check before done

- **Never** store passwords in plain text or with MD5, SHA-1 or raw SHA-256. Use Argon2id, or bcrypt with cost 12 or more.
- **Never** put a secret in git, in a log, or in a file sent to the browser. Log only "set" or the last 4 characters of a secret.
- **Never** use the file name the user sent as the stored name. Check the file's real contents, not its extension, and strip EXIF location data from photos.
- **Never** edit or delete an audit record. Write a correction entry instead, and never record passwords, tokens, ID card numbers or health data in it.
- Every request, outgoing call and database query has a timeout, and the sections 5 and 7 checks pass before deploy.


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

How each type of API authentication works, principles for managing API keys, and examples of RBAC and ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### Enforcing a role on an endpoint
- Check on the server in middleware before the handler runs; never trust a role sent by the client
- Deny by default: a route with no rule is closed
- No or bad credentials → `401`; signed in but without the role → `403`; do not reveal whether the resource exists
- Test both: a request without the role gets `403`, one with it gets `200` (name tests after the rule, e.g. `A01_non_manager_gets_403`)

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: audit-trail.md

<!-- merged from skill `audit-trail` on 2026-11-27 · description was: Use when a system must record who did what and when -->
# Audit trail

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill, or together](#when-to-use-another-skill-or-together)
- [1 · audit log ≠ application log](#1--audit-log--application-log)
- [2 · Fields every entry must have](#2--fields-every-entry-must-have)
- [3 · Which events to record](#3--which-events-to-record)
- [4 · How to record "what changed"](#4--how-to-record-what-changed)
- [5 · Never edit after writing](#5--never-edit-after-writing)
- [6 · Who can view, and what must not be recorded](#6--who-can-view-and-what-must-not-be-recorded)
- [7 · Show it to people](#7--show-it-to-people)

> **One rule:** a trail cannot be built after the fact.
> The day a customer asks "who changed this price", if it was not recorded beforehand, it can never be answered.

## When to use this skill

- The system has approvals, money, user permissions, or personal data
- A customer or auditor can ask "who did it, when, and what was changed from what to what"
- There was a dispute over edited data and nobody could answer
- The system falls under the Personal Data Protection Act (PDPA) or a standard that must be checkable after the fact

## When to use another skill, or together

| Job | skill | |
|---|---|---|
| Logs for technical troubleshooting | `errors-and-logs` | instead |
| Metrics and alerts | `incidents-and-monitoring` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns.md` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `requirements-writing` | together |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| Who reads it | developers, when troubleshooting | auditors · customers · the legal team |
| What it records | anything that helps troubleshooting | **only events with business meaning** |
| Where it is kept | files · a log collection system | **a table in the database**, or storage that cannot be overwritten |
| Lifetime | 7–90 days | **years, as the law or contract requires** |
| Can it be edited | does not matter | **never edit, never delete** |
| Can it be lost | some loss is acceptable | **cannot be lost.** If the write fails, the transaction must fail with it |

> **Always keep these 2 separate.** An audit log mixed into the general log files
> gets deleted by the log retention period within a month, and nobody finds it when it is needed.

---

## 2 · Fields every entry must have

| Field | Example | Note |
|---|---|---|
| `id` | UUIDv7 | sortable by time |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC**, and the time it happened, not the time it was recorded |
| `actor_id` | `1042` | the user id, not the name, because names can change |
| `actor_type` | `user` · `system` · `api_client` | automated jobs need an identity too |
| `actor_ip` · `user_agent` | | keep only when needed for the audit |
| `action` | `order.cancelled` | **a past-tense verb**, in one style across the system |
| `entity_type` · `entity_id` | `order` · `1042` | the thing acted on |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | only the fields that changed |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" (customer phoned to cancel) | required for actions that need a reason |
| `correlation_id` | `01J9Z8…` | links back to the application log |
| `result` | `success` · `denied` | **denied attempts must be recorded too** |

> **A denied action is worth more than a successful one**, because someone trying to reach something
> they have no right to is what auditors most want to see, and it is the best warning sign there is.

---

## 3 · Which events to record

**Record:**

| Group | Examples |
|---|---|
| money and contracts | create/cancel/refund · price change · discount change |
| approvals | approve · reject · send back for fixing |
| permissions and identity | grant/revoke permission · create/close account · change password · consecutive failed logins |
| personal data | view · edit · export · delete |
| system settings | changing a value that affects the whole system |
| bulk data access | exporting a report · downloading a name list |

**Do not record:** ordinary screen views · searches · sorting · clicks that change nothing.
An audit log that records everything is worth the same as none, because nothing can be found in it.

**Name actions in one style across the system:** `<entity>.<past-tense verb>`, for example `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · How to record "what changed"

| Method | Good | Bad |
|---|---|---|
| **Record only the changed fields (from/to)** ✓ | small, readable at once | to see the whole picture you must trace back |
| Record the whole row before and after | full picture | grows very fast and risks keeping more sensitive data than needed |
| Record only that "it was edited" | smallest | **cannot answer the question**, so do not use it |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**For sensitive fields, record only that it changed, not the value:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · Never edit after writing

- Grant the audit table only **INSERT and SELECT**. The account the app uses must have no UPDATE or DELETE permission.
- Write in the same transaction as the real data change. **If the audit write fails, the transaction must fail with it.**
- Never edit history to "tidy up". If a record is wrong, add a correction entry. Do not overwrite.
- A system that needs stronger protection should chain the entries with hashes, to prove nobody inserted or deleted anything.

**Retention** follows the law or the contract. Accounting documents in Thailand usually must be kept 5 years.
When the period ends, move them to cheap storage. Never delete them without someone's approval.

---

## 6 · Who can view, and what must not be recorded

| Topic | Rule |
|---|---|
| Read permission | only roles with an audit duty, and **reading the audit log must also be recorded in the audit** |
| Export | record every time who exported which period |
| **Must not record** | passwords · tokens · ID card numbers · health data · the content of personal data |
| Record instead | point to **which item** was viewed or edited, not the content inside |

> `patient_record.viewed` with the `entity_id` is enough. **Never copy test results into the audit log.**
> Otherwise the audit log becomes the most sensitive data store in the system, without anyone meaning it to.

---

## 7 · Show it to people

The history screen must filter by at least 4 things: **time period · actor · action type · which item**.

Show it as a sentence people can read, not raw JSON (the sample below is the Thai text shown to Thai users: on 25 Sep 2569 [B.E.; 2026] at 16:42, Somchai (sales) cancelled order SO-2026-00042, status: confirmed → cancelled, reason: customer phoned to cancel):

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

Show the time in the viewer's time zone, but store it as UTC (see `i18n-and-locale`).


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

Step-by-step order for session, JWT, OAuth with PKCE and password reset. Use it when writing code, or when reviewing whether the code covers every step. The requirements and mistakes to avoid are in `SKILL.md`

## Pattern 1: Session-Based Auth — Flow

```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

## Pattern 2: JWT — Flow

```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

## Pattern 3: OAuth 2.0 / OIDC — Authorization Code Flow with PKCE

PKCE = Proof Key for Code Exchange. It stops a stolen code from being swapped for a token.

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

## Pattern 5: Password reset flow

```
1. User requests reset (enter email)
2. Server: always show "if email exists, link sent" (don't leak)
3. Generate random token (≥ 256 bits), hash it, store with expiry (15 min)
4. Email link with raw token
5. User clicks → /reset?token=...
6. Server hashes input, compares, verifies expiry
7. User sets new password (apply policy)
8. Invalidate all existing sessions
9. Send confirmation email
```


## reference: auth-implementation-patterns.md

<!-- merged from skill `auth-implementation-patterns` on 2026-11-27 · description was: Use when building login with sessions, JWT, OAuth or SSO -->
# auth-implementation-patterns — secure login, token, MFA and authorization choices

## Use when
- Building login/signup/logout or a password reset flow.
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn.
- Choosing session vs token authentication.
- Integrating OAuth or OpenID Connect (OIDC) logins, or single sign-on (SSO) with SAML or OIDC.
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth).
- Reviewing existing auth code for security issues.

## Steps

1. **Choose the pattern by who is authenticating.**
   - Browser user, first-party app → session cookies (`HttpOnly`, `Secure`, `SameSite`). Cross-domain → JWT in an `HttpOnly` cookie, never `localStorage`.
   - Mobile app → OAuth 2.0 PKCE flow.
   - Service-to-service → same org: mTLS or service mesh; external: OAuth 2.0 Client Credentials.
   - Third-party developer → API keys (with rotation) or OAuth.

2. **Sessions (server-rendered apps, monoliths, one domain).** Cookie `HttpOnly` + `Secure` + `SameSite=Lax` (or Strict). Session ID cryptographically random, ≥ 128 bits. Store in Redis with a time-to-live (TTL), not in app memory if more than one instance runs. Idle timeout 30 min, absolute timeout 8–12 hours. Issue a new session ID when privileges change (login, role change). On logout, delete the session from the store. Avoid: session inside a JWT (cannot revoke) · session token in `localStorage` (cross-site scripting (XSS) can steal it) · same ID after login (session fixation).

3. **JWT (microservices, mobile, single-page app (SPA) with a backend API).** JWT is overused: with a single backend, sessions are simpler and safer. Algorithm `RS256` or `ES256`, not `HS256` for distributed systems. Access token 5–15 min. Refresh token lives days, is stored separately, is revocable, and is replaced each time it is used. Required claims `sub`, `iat`, `exp`, `iss`, `aud`. Store in an `HttpOnly Secure` cookie. Have a way to cancel tokens (blocklist, short expiry). Avoid: accepting `alg: none` (check the algorithm explicitly) · skipping signature verification · sensitive data in the payload (base64, not encrypted).

4. **OAuth 2.0 / OIDC ("Login with Google/GitHub", handing login to an identity provider (IdP)).** Always Authorization Code Flow with PKCE, even for confidential clients (steps in [`auth-flows.md`](auth-flows.md)). Validate the `id_token` signature with the IdP's JWKS, and validate `aud`, `iss`, `exp`, `nonce`. Use the `state` parameter against cross-site request forgery (CSRF) and validate it. Match `code_verifier` to `code_challenge`. Use a library (Auth0, Passport.js), do not write your own. Avoid: implicit flow · Resource Owner Password Credentials flow (both deprecated).

5. **MFA.** For a new app use WebAuthn (passkeys) by default (no shared secret to steal). Use TOTP when users need easy standard 2FA. Use SMS or email only as a last resort (SMS is not safe against SIM swap). Details: [`mfa.md`](mfa.md).

6. **Passwords.**
   - Hash with **Argon2id** (preferred) or **bcrypt** with cost ≥ 12. Never MD5, SHA-1, raw SHA-256 or plain text.
   - Policy per NIST SP 800-63B-4 (checked 2026-10-14): minimum **15 characters** when the password is the only factor, **8** when used only inside MFA. Check against breached passwords (Have I Been Pwned (HIBP) API). Allow long passphrases (any maximum at least 64) and special characters. No forced composition rules, no forced regular changes (only on suspected breach).
   - Reset flow: the response is the same whether or not the email exists. Token random, ≥ 256 bits, stored as a hash, expires in 15 minutes. After the new password is set, revoke all old sessions and send a confirmation email. All 9 steps: [`auth-flows.md`](auth-flows.md).

7. **Lockout and rate limiting.** 5 failed attempts in 15 min → lock 15 min; 10 in 1 hour → lock 1 hour; key on IP + email together. Message "Too many failed attempts. Try again in 15 minutes." Never "Account locked." (reveals the account exists). Use existing tools: [`libraries-and-code.md`](libraries-and-code.md).

8. **API authentication.** API key for simple server-to-server · OAuth 2.0 Client Credentials for service-to-service · mTLS for high-security internal · HMAC signing for webhooks. For an API key, show the secret once at creation, store it as a hash, let users revoke it at once. Table: [`api-auth-and-authorization.md`](api-auth-and-authorization.md).

9. **Authorization.** RBAC (Role-Based Access Control) as the main model; ABAC (Attribute-Based Access Control) when permissions depend on data attributes. Check at every endpoint, on the server, using the user from the session or token. Never trust a role sent by the client or JWT claims as the authorization source.

## Check before done
- [ ] Session ID regenerated on login (fixation)
- [ ] CSRF token or SameSite cookie
- [ ] Rate limiting (brute force) and HIBP check or MFA (credential stuffing)
- [ ] Redirect URLs on an allowlist (open redirect)
- [ ] Same error message every time (user enumeration)
- [ ] Constant-time comparison (timing attacks)
- [ ] No token in the URL; header or cookie only
- [ ] Logout invalidates on the server
- [ ] Authorization re-checked after a role change
- [ ] No homemade crypto or auth; no reversible password storage

## References
- [`auth-flows.md`](auth-flows.md) — open when writing session, JWT, OAuth with PKCE or password reset code
- [`mfa.md`](mfa.md) — open when building MFA (TOTP setup, WebAuthn, SMS limits)
- [`api-auth-and-authorization.md`](api-auth-and-authorization.md) — open when designing API keys or RBAC/ABAC
- [`libraries-and-code.md`](libraries-and-code.md) — open when choosing a library or needing hashing and rate-limit samples
- [`sources.md`](sources.md) — NIST source and check date


## reference: config-and-secrets.md

<!-- merged from skill `config-and-secrets` on 2026-11-27 · description was: Use when settings differ by environment or secrets need hiding -->
# Config and secrets

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill instead, or together](#when-to-use-another-skill-instead-or-together)
- [1 · Tell config and secret apart first](#1--tell-config-and-secret-apart-first)
- [2 · Order of priority: later values override earlier ones](#2--order-of-priority-later-values-override-earlier-ones)
- [3 · Check at boot: if any value is missing, die at once](#3--check-at-boot-if-any-value-is-missing-die-at-once)
- [4 · Naming environment variables](#4--naming-environment-variables)
- [5 · `.env` and `.env.example`](#5--env-and-envexample)
- [6 · Where to keep secrets](#6--where-to-keep-secrets)
- [7 · Rotation](#7--rotation)
- [8 · When a secret leaks: order matters more than speed](#8--when-a-secret-leaks-order-matters-more-than-speed)
- [9 · Do not let secrets flow out other ways](#9--do-not-let-secrets-flow-out-other-ways)
- [10 · Frontend config: nothing in it is secret](#10--frontend-config-nothing-in-it-is-secret)

> **2 rules:**
> 1. The same code must run in every environment. The only difference is config.
> 2. A secret must not be in git, not in logs, and not in any file sent to the browser.

## When to use this skill

- Starting a project, or adding a new environment.
- You need to store a connection string, API key, certificate, or signing key.
- You find a hardcoded value in code and must move it out.
- A secret leaked into git, or you suspect it did: go to step 8 at once.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Storing secrets in a pipeline · approval gates | `cicd-and-release` | instead |
| Secrets in a Jenkinsfile (`withCredentials` · single quote) | `cicd-and-release` | together |
| Kubernetes secrets kept out of values.yaml (External Secrets · SealedSecret) | `infra-and-deploy` | together |
| Designing login, tokens, user permissions | `auth-implementation-patterns.md` | instead |
| Keeping sensitive values out of logs | `errors-and-logs` | instead |
| Database connection strings | `database-design` | together |
| Recording a secret leak · steps during the incident | `incidents-and-monitoring` | together |

**How to do it in each language and framework** is in `per-stack.md`.

---

## 1 · Tell config and secret apart first

| | config | secret |
|---|---|---|
| Examples | API address, log level, page size, time zone, feature flag | Database password, API key, token signing key, certificate |
| Allowed in git | ✓ yes | ✗ never |
| Who can see it | The whole team | Only those who need it |
| If it leaks | No harm | Must be revoked and replaced at once |
| Changes how often | With the work | On a rotation schedule |

> **If you cannot decide which one it is, treat it as a secret.** Being too careful costs only a small annoyance.
> But if you guess wrong, the key stays in git history forever.

---

## 2 · Order of priority: later values override earlier ones

```
1. Defaults in code             (safe, really usable for dev)
2. Config file per environment  (appsettings.Production.json, config/production.yaml)
3. Environment variables
4. Secret store                 (Key Vault, Secrets Manager, Kubernetes secret)
5. Arguments at launch          (for troubleshooting only)
```

**Defaults must be safe.** If someone forgets to set a value, the system must run in its strictest mode.
For example `DEBUG=false` · `ALLOWED_ORIGINS=` empty · Transport Layer Security (TLS) on, not the opposite.

---

## 3 · Check at boot: if any value is missing, die at once

> **Important:** this step is worth the most on this page.
> A system that boots with wrong config will break at 2 a.m. in a function that is rarely used.
> A system that **refuses to boot** on wrong config tells you at deploy time, when you can still roll back.

Node zod example: `per-stack.md` section 2. The pattern is a schema that parses `process.env` once at boot, so an invalid value kills the process and names the value.

**What to check:** every value is present · types are right · values are in the accepted range ·
keys are long enough · values banned on production (`JWT_SECRET=dev-secret` must fail).

**Print a config summary at boot:** the value names, and the values that are not secrets.
For a secret, print only "set" or the last 4 characters, never the full value.

---

## 4 · Naming environment variables

```
<system>_<group>_<name>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| Rule | Reason |
|---|---|
| Uppercase with underscores | The convention on every operating system |
| Start with a system prefix | Avoids clashing with the system's `PATH`, `HOME`, `USER` |
| Same name in every environment | Values may differ, but names must not, or every move between environments means editing code |
| Put the unit in the name | `APP_TIMEOUT_SECONDS`, not `APP_TIMEOUT` |
| Do not put the environment name in the variable name | ✗ `APP_PROD_DB_HOST` |

---

## 5 · `.env` and `.env.example`

| File | In git | Role |
|---|:--:|---|
| `.env.example` | ✓ | The list of **all** required values, with explanations and example values that are not real |
| `.env` | ✗ | Real values on each developer's machine |
| `.env.production` | ✗ | **This file should not exist at all**, because production uses a secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # database address
APP_DB_PASSWORD=change-me          # important: the real value is in the team's 1Password vault
APP_JWT_SECRET=                    # important: generate with: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**Update `.env.example` in the same commit that adds a new value.**
Otherwise the next person who clones hits an error nobody can explain.

> **A `.env` added to `.gitignore` too late:** once the file has been tracked, even once,
> adding it to `.gitignore` later **does not remove it from history.** Run `git rm --cached` and treat the secret as leaked.

**Pre-commit gate**: `.gitignore` blocks only files you know by name, but a key pasted by mistake into code or YAML needs a scanner. Install gitleaks as a pre-commit hook in every repo (`gitleaks git --pre-commit --staged` in gitleaks 8.19 and later · earlier versions use `gitleaks protect --staged`) and rerun it in CI over the whole history with `gitleaks git --redact`. If the hook fails, never use `--no-verify`; move the value out first. If you find one in history, go to step 8 at once, not just delete the line.

---

## 6 · Where to keep secrets

| Situation | Use | Note |
|---|---|---|
| Developer machine | A `.env` that stays out of git; for .NET use `dotnet user-secrets` | Never use production values |
| Small team sharing | The team's password manager (1Password, Bitwarden) | Not chat, not email, not a Google Sheet |
| Production in the cloud | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | Grant access with a managed identity, not another key |
| Kubernetes | External Secrets Operator pulling from a vault above | A Kubernetes secret is only base64, **not encryption** |
| You really must store in git | SOPS or sealed-secrets (encrypt before commit) | Last resort |

**Permissions:** each service reads only its own secrets, environments are fully separate, and
no account can read all of them, except an admin account whose access is logged.

---

## 7 · Rotation

**Design for it from day one**, not when you finally have to rotate.

| Must have | Detail |
|---|---|
| Two values valid at once | During the change, both the old and the new value must work, or you must shut the system down |
| Reload without restart | Or accept that you need one deploy, and write down that it must be done |
| Schedule | Token signing key 90 days · database password 180 days · certificate 30 days before expiry |
| Automatic | A task that depends on someone remembering ends up done by nobody |

**A token signing key must carry an id (key id)**, so that after signing new tokens with the new key,
you can still verify old tokens that have not expired.

---

## 8 · When a secret leaks: order matters more than speed

1. **Revoke the old value first:** disable that key at its source.
2. Issue a new value, then deploy.
3. Check past logs for anyone using it from a place that is not ours.
4. Remove it from git history (`git filter-repo`) and tell everyone to clone again. (If you must force push, wait for the user's approval and tell the team first.)
5. Record the incident with `incidents-and-monitoring`.

> **Step 4 is not step 1**, because deleting the commit does not make the key any safer.
> Anyone who forked or cloned already, and the provider's backups, still have the old value.
> **Treat every secret that has ever been in git as leaked**, even if the repo is private.

---

## 9 · Do not let secrets flow out other ways

| Leak path | How to close it |
|---|---|
| Logs | The list of terms to mask is in `errors-and-logs` |
| Error messages sent to the client | Return only a `requestId`, not a stack trace or connection string |
| Crash reports / error trackers | Set a sensitive-data filter before sending out |
| Shell command history | Use `read -s` or read from a file, instead of typing the value on the command line |
| `docker history` | Do not put secrets in `ARG`/`ENV` at build time; use a mount at run time instead |
| Backup files and dumps | Encrypt them and store them where you control access |
| Screenshots in documents and issues | Always mask before attaching |

---

## 10 · Frontend config: nothing in it is secret

> **Important:** everything in a file the browser loads **is public information**,
> whether it is named `VITE_SECRET_KEY` or sits in a file minified until it is unreadable.
> Minifying code is not encryption. Open DevTools and you can see it.

| Allowed in the frontend | Must stay on the server only |
|---|---|
| API address · environment name | API keys of any external service |
| Publishable key of a payment provider | The secret key of the same provider |
| Feature flags that are not secret | Pricing rules · approval thresholds |
| Web ID of an analytics tool | Tokens that call a third party's API |

**If you need to change a value without rebuilding,** load `/config.json` when the app starts,
instead of embedding the value at build time (`import.meta.env`), which locks the value into the built files.

---


## reference: file-upload-and-storage.md

<!-- merged from skill `file-upload-and-storage` on 2026-11-27 · description was: Use when users upload files or an app serves stored files -->
# Accepting file uploads and storing files

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill instead, or together](#when-to-use-another-skill-instead-or-together)
- [1 · Check before accepting](#1--check-before-accepting)
- [2 · Where to store](#2--where-to-store)
- [3 · Naming the stored file](#3--naming-the-stored-file)
- [4 · Sending files back to the user](#4--sending-files-back-to-the-user)
- [5 · Images](#5--images)
- [6 · Deleting and retention](#6--deleting-and-retention)

> **One rule:** a file a user sends is untrusted data.
> The file name, the extension, the type the browser reports, and the size it claims can **all be faked**.

## When to use this skill

- A screen lets users attach files, images, or documents.
- The system must store files and send them back for viewing or download.
- You must decide where to keep the files.
- Some files should be hidden from others, but right now anyone with the link can open them.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Import Excel/CSV and load the data into the system | `data-import-export` | instead |
| Permissions: who may access what | `auth-implementation-patterns.md` | instead |
| Process large files as a background job | `async-messaging` | instead |

---

## 1 · Check before accepting

| What to check | How |
|---|---|
| **File type** | Read the **contents** (magic bytes). Do not trust the extension or `Content-Type`. |
| **Size** | Enforce it on the server **and** at the front-facing request receiver. A check in the browser is only a convenience. |
| Files per request | Set a limit. |
| Total size per user | Set a quota, or one person uses up all the space. |
| Allowed types | **An allow list, not a deny list.** |

```
Typical allow list: jpg · png · webp · pdf · xlsx · docx · csv
Always forbidden: executables (exe, sh, bat) · server script files (php, aspx, jsp) · svg that has not been sanitised
```

> **SVG is HTML.** It can run scripts. To accept it, sanitise it first or convert it to PNG.
>
> **Check the size before reading the file into memory.** Otherwise a 5 GB file kills the server
> before the size-check code gets to run.

**Virus-scan** any file that other people will download. While the scan result is pending, set the status to `pending`
and give nobody access.

---

## 2 · Where to store

| Store | Good for | Note |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | The default to use | Scales · has expiring links built in |
| The server's disk | A small, single-machine system | **Must sit outside the folder the web serves**, and must be backed up |
| In the database | Very small files that must be in the same transaction | Grows fast · backups get much slower |

> Wrong: **keeping files in the app's folder.** They vanish on every deploy, and with several instances they cannot see each other.
> Wrong: **keeping files directly in the folder the web serves.** Someone uploads a script file and runs it.

**The database holds only metadata; the file itself lives elsewhere.** The metadata table needs the columns
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · Naming the stored file

**Never use the file name the user sent as the real stored name.**

```
Wrong: uploads/รายงาน (1).xlsx              spaces · Thai · brackets
Wrong: uploads/../../etc/passwd             escapes the folder
Right: 2026/09/25/01J9Z8K7X2M4.xlsx         random · split into folders by date
```

- The real stored name is a random value (UUIDv7 or ULID) + an extension that you have **verified**.
- Keep the user's original name in the database, and send it back on download through a header.
- Split folders by date. One folder with millions of files is slow and cannot be browsed.
- Store a checksum too. It detects duplicates and checks the file is not corrupted.

---

## 4 · Sending files back to the user

| File | How to send |
|---|---|
| Public (logo, product image) | A direct URL through a CDN is fine |
| **Private** (document, receipt, user photo) | **A signed link that expires** in 5–15 minutes |

> **A "hard-to-guess link" is not access control.** Links get forwarded, logged by proxies,
> and left in the `Referer` header. For a private file, **check permission every time**, then issue a temporary link.

- For large files, let the user upload straight to object storage with a link we sign, so the file does not pass through the app.
  **The checks in §1 are still all required.** This route bypasses the app, so restore the checks like this:
  - **When signing the link:** limit size and type inside the signature. S3 uses a presigned POST whose policy has `content-length-range` and a `Content-Type` condition (a presigned PUT cannot enforce size). Other providers have equivalents, for example GCS uses the header `x-goog-content-length-range`.
  - **When signing the link:** set the key yourself (a random name as in §3) in a holding folder · keep the link's expiry short · save a metadata row with `scan_status = pending`.
  - **After the upload finishes** (a storage event, or the user reports it done): read the real magic bytes from the object · compare the real size with the limit · virus-scan. If it passes, move it to the real store and set `clean`. If it fails, delete or quarantine it.
  - While `pending`, issue no download link to anyone.
- When serving a file for download, set `Content-Disposition` and `Content-Type` correctly,
  and never send back user-uploaded HTML in a way that lets the browser render it.
- If you can, serve user files from a different domain than the app, so scripts in a file cannot reach the app's cookies.

---

## 5 · Images

- **Never send the original camera image to the screen.** An 8 MB photo on a phone is a page that does not load.
- Pre-generate 2–3 sizes (thumbnail · medium · a downsized full size).
- **Strip EXIF.** The photo holds the location where it was taken, and users do not know they are publishing it.
- Convert to WebP if the browser supports it.
- Rotate the image according to EXIF before you strip EXIF, or phone photos come out sideways.
- If the file is large or there are many, resize as a background job (see `async-messaging`).

---

## 6 · Deleting and retention

| Topic | Rule |
|---|---|
| Deleting the parent record | A job must also hunt down and delete the orphan files left behind. |
| Order of deletion | Delete the metadata first, then the file. An orphan file is harmless, but metadata pointing to a file that is gone breaks the screen. |
| An uploaded file never linked to anything | Delete it after 24 hours. |
| Retention | Set it per file type · a file with personal data needs an expiry date (see `pdpa-compliance`). |
| Backup | Files belong in the backup plan just like the database, **and a restore must have been tested for real.** |


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

Sample code for storing passwords, rate-limiting tools, and recommended libraries by language

## Password storage — code

```typescript
// Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, Auth.js, Better Auth | Lucia v3 is deprecated (lucia-auth.com, checked 22 Oct 2026) so do not start new work on it; Better Auth status (รอยืนยัน, check before use) |
| Python | `authlib`, `PyJWT` (or `joserfc`) | authlib for OAuth; python-jose is rarely maintained (รอยืนยัน) |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

Details of all 3 types of multi-factor authentication. Use it when choosing or building MFA

## TOTP (Google Authenticator, Authy)
**When:** standard two-factor login (2FA), easy for users. TOTP = time-based one-time password.

```
Setup:
1. Server generates random secret (160 bits)
2. Server shows QR code: otpauth://totp/...?secret=...
3. User scans with authenticator app
4. User confirms with first code
5. Server stores secret encrypted

Verify:
1. User enters 6-digit code
2. Server computes expected code(s) (±1 window for clock drift)
3. Match → grant access
```

## WebAuthn (Passkeys) — Future-proof
**When:** you want login that phishing can't beat, no SMS, hardware keys

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret, so nothing to phish
- Default for new apps in 2026+

## SMS / Email codes
**When:** there's no other option (users without smartphone apps)

- Note: SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry


## reference: per-stack.md

# .NET และ Angular

> Caution: the code in this file is **not yet compiled or tested** (unlike `assets/health.node.js` and
> `assets/health_py.py`, which have been run against every endpoint). It is the standard setup of
> ASP.NET Core. On the first run, compare the response with the shape in SKILL.md section 1.

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

Make the response match the same format as the other stacks:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core already ships `ProblemDetails`. Use it, and do not invent your own format.

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

Make `/health/ready` answer down for a short while before the real shutdown, so the load balancer removes the instance from its pool in time.
Use `IHostedLifecycleService.StoppingAsync` (.NET 8 and later), because the host calls it **before** it stops Kestrel (after `ApplicationStopping`).
So you can wait with `await Task.Delay` without blocking a thread, and the server still answers 503 for the load balancer to see.

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

Host shutdown order (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` of the hosted services (including Kestrel) → `StoppedAsync` → `ApplicationStopped` — per the .NET Generic Host page at learn.microsoft.com (checked 22 Oct 2026)

### สิ่งที่ต้องเปิดก่อน deploy

Register services only **before** `builder.Build()`. After Build the service list is read-only, and calling `builder.Services.Add…` then throws `InvalidOperationException` at app start.

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

To avoid writing your own middleware, use the package `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) which sets the full basic header set

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `errors-and-logs`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**Turn problem+json into a message the user can understand**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**System status page**, so the support team can check it without calling a developer:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก ui-craft ส่วน web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |

## Wiring the ready-made health router

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```


## reference: sources.md

# Sources · auth-implementation-patterns

- Password policy (minimum 15 characters as the only factor, 8 inside multi-factor authentication, breached-password check, no composition rules, no forced rotation, maximum at least 64): NIST SP 800-63B-4 §3.1.1.2, https://pages.nist.gov/800-63-4/sp800-63b.html, checked 2026-10-14.
