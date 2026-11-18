# skill: document-naming

Use when naming or filing a document others keep

# Naming and versioning documents

> **The one rule:** a file that a system already keeps history for (git · Google Docs version history) **must not carry a version in its name.**
> A file that leaves that system **must carry one**, because nothing else can tell you who holds which copy.

## When to use this skill

- Creating a new document that the team or the client will keep.
- Sending a document to people outside the team.
- A folder starts to fill with `final`, `final2`, `ล่าสุด` (latest), `แก้แล้ว` (edited).
- Someone asks "so which version do we go with?"

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Markdown formatting | `polished-document-style` | instead |
| The look of the rendered file | `branded-document-design` (plugin `software-development`) | instead |
| Temporary files during work | `superuser:temp-file-discipline` | instead |
| Code work: commit messages · version of the **program** · the project document index | `commit-message-format` · `cicd-and-release` · `project-bootstrap` (plugin `software-development`) | instead / together |

**The revision-history table template and the standard file-name list** are in `assets/naming-cheatsheet.md`.

---

## 1 · Pick the format before naming

**One test: if someone signs it or it goes outside the team, make it a deliverable file. A document that changes with the work stays markdown in the documents folder (e.g. `docs/`).**

| Document | Format | Reason |
|---|---|---|
| Proposal · quotation · handover report · acceptance certificate · contract (software project document sets → plugin `software-development`) | **docx** | Someone signs it, so the version must be locked |
| User manual | **docx + PDF** | End users can open it on any machine |
| Presentation slides | **pptx** · if html is requested → a single .html file (file type per `presentation-design` in plugin `software-development`) · PDF when the target machine lacks the fonts | |
| Work procedures · internal guides · README · meeting notes · decision records (code work → plugin `software-development`) | **markdown** in the documents folder | It changes often, needs diffs, and is easy to search |

> 🚨 **Markdown source that can be re-rendered is kept permanently in `docs/src/<topic>.md`, then rendered to docx into the documents folder (`docs/`).**
> `docs/` holds exactly one deliverable for that topic, the .docx. No .md or .pdf of the same topic sits beside it.
> On the next revision, edit `docs/src/` and render again. Never open Word and edit by hand (matches `markdown-report-docx`). The "ต้นฉบับ" (source) line on the cover points to this file.

**Make a PDF only for user manuals, or when the client asks.** Otherwise, one docx.

---

## 2 · File name format

```
<project code>-<type>-<topic>-v<M.m>-<status>.docx
```

| Document type | Format | Example |
|---|---|---|
| Exported file | `<project>-<type>-v<M.m>-<status>.docx` | `ACME-QUOTE-v1.2-APPROVED.docx` |
| Several topics | Add the topic after the type | `ACME-REPORT-sales-v0.3-DRAFT.docx` |
| Version actually sent to the client | Add the date at the very end, in International Organization for Standardization (ISO) 8601 format | `ACME-QUOTE-v1.2-APPROVED-2026-09-25.docx` |
| Markdown document | `<type>-<topic>.md`, lowercase, hyphens | `docs/guide-onboarding.md` |
| Meeting notes (exception: date first) | `YYYY-MM-DD-<topic>.md` | `docs/meetings/2026-09-25-kickoff.md` |

**File name rules:**

- No spaces; use hyphens. Spaces break links and command-line commands.
- **The date is always ISO `YYYY-MM-DD`** and goes at the very end, so sorting by name also sorts by time. The one exception: meeting notes put the date first, because the `docs/meetings/` folder holds only meeting notes, so it sorts by date at once.
- File names are in English even when the content is Thai. This avoids trouble when attaching to email and zipping across systems.
- Never put a person's name in a file name. `-somchai-edit` is a sign that people are not working from one source.
- Never name a file `final` · `final2` · `final_ล่าสุด` · `แก้แล้ว`: nobody can tell which is newer, or what was edited from which version. Use the version, status and revision history instead.

**Check with the script:** `node <this skill's folder>/scripts/doc-name-check.mjs docs/*` → it lists wrong names with a proposed name. To rename many files, add `--plan _to_delete/renames.json` to get a plan without touching files, check or edit the plan, then run `--plan _to_delete/renames.json --apply`. The script does not rename `APPROVED` files, does not overwrite existing files, and does not put received files (`ref/`) in the plan.

---

## 3 · Versions

| Which number goes up | When |
|---|---|
| **major** (1.x → 2.0) | Scope changes · document structure changes · needs a new sign-off |
| **minor** (1.1 → 1.2) | Content added or edited, still the same topic |
| No number change | Typo fixes, layout, but you **must still log it in the revision history** |

- The first version shown to anyone is `v0.1`, and the first version someone signs is `v1.0`.
- **Version numbers only move forward.** Never go back to an old number.
- A file that a system keeps history for has no version number in its name. To refer to a version, use a tag, commit, or version history.

---

## 4 · Status is a different thing from version

| Status | Means | Who may edit |
|---|---|---|
| `DRAFT` | Still being written | The author |
| `REVIEW` | Sent for review, awaiting comments | The author, following the comments received |
| `APPROVED` | Signed off | **No edits.** Raise a new version as DRAFT |

> **Once `APPROVED`, never edit the original file**, even for a typo.
> If you can, the version the client holds and the one we hold will differ, even though the file names match letter for letter.

---

## 5 · The revision history must be in the file

**A file name says only which version this is, not what changed.**
Every exported document must have this table on the first page.

```markdown
| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | สมชาย | เพิ่มบทสรุปผู้บริหาร · ตารางราคาเป็น 12 รายการ | ลูกค้าขอเพิ่มสรุป |
| 1.1 | 2026-09-12 | สมชาย | แก้ระยะส่งมอบจาก 3 วันเป็น 5 วัน | ถามผู้ขนส่งแล้วทำไม่ได้ |
| 1.0 | 2026-09-01 | สมชาย | ฉบับเซ็นรับ | — |
```

- **The "แก้อะไร" (what changed) column must be concrete.** "Improved the content" helps nobody.
- Put the newest on top. A reader opening the file wants to know what changed last.

---

## 6 · Storage and sending

| Topic | Rule |
|---|---|
| Source | Lives in `docs/src/` of the work, in one place only (code work: `project-doc-set` in plugin `software-development`) |
| Exported files | Live in the documents folder (`docs/`) or the client's storage, **not the project root** |
| Received files | Keep their original name; never rename. They refer to that name |
| Files mid-conversion | `_to_delete/` (see `superuser:temp-file-discipline`) |
| Sending by chat or email | Always send a file with the version and status in the name. Never send `เอกสาร.docx` |


---

# skill: product-naming

Use when naming a product, shop, app or brand

# Naming a product

> **The one rule:** a good name is one a person **types correctly the first time, after hearing it once.**
> Deeper meaning can come later, but if people misspell the name, customers cannot find you.

## When to use this skill

- Naming a product, shop, service, app, brand, module or internal project
- A name exists but feels dated, long or the same as someone else's
- There are several products and the names should form one family
- You must choose from a brainstormed list of names and cannot decide

Not for: logo, colours, brand typography → `graphic-design` · naming document files → `document-naming` · naming tables and columns → `database-design` · naming endpoints → `api-conventions`

---

## 1 · Six tests that cut a name at once

Test before you think further. If a name fails any one, cut it. Do not feel sorry.

| # | Test | Fails when |
|:--:|---|---|
| 1 | **Phone test**: say the name to someone over the phone. Do they type it correctly? | You have to spell it out |
| 2 | **Length** | More than 3 syllables, or more than 12 letters |
| 3 | **Domain and handle** | `.com` and `.co` are both taken and no social handle is free anywhere |
| 4 | **Collision with what exists** | A product, shop or service in the same category has the same or a very close name |
| 5 | **Meaning in other languages** | It means something bad in a language your customers speak |
| 6 | **Thai speakers can pronounce it** | It has a consonant cluster Thai speakers avoid, or ends in a sound that gets swallowed |

**Also cut:** a number in the name (`App360` · `Pro24` go stale when the version changes) · 3 or more words (nobody says the whole thing, so it gets shortened until it cannot be recognised).

> **People often forget test 6.** If the name has `th`, `v` or `z` at the end of a word, or a cluster like `str-` or `spl-`,
> Thai speakers will pronounce it off and type what they heard.

---

## 2 · Nine formulas for producing names

Do not sit and think in the air. Walk through the formulas one at a time, come up with 5–10 names per formula, then select.

| # | Formula | Method | Example |
|:--:|---|---|---|
| 1 | **Real word, cut the end** | Take an English word and drop the last syllable | `figure` → **Figma** · `velocity` → **Velo** |
| 2 | **2 words collided** | Cut the head and tail of 2 words and join them | `fold`+`drop` → **Foldrop** · `data`+`dog` → **Datadog** |
| 3 | **Word + suffix** | Add `-io` `-ly` `-ify` `-o` `-a` `-ex` | `home`+`ify` → **Homify** · `aurum`+`io` → **Aurio** |
| 4 | **Latin/Greek root** | Find the root word for what it does, then shorten it | `lumen` → **Lumo** · `nexus` → **Nexa** |
| 5 | **Family letters** | A word for the function + a family ending | **TradeXI · TelXI · DockXI · SoundXI** |
| 6 | **Short meaningless word** | 4–5 letters, consonant-vowel-consonant, readable at once | **Quix · Zeno · Riva · Volt** |
| 7 | **Real word borrowed across contexts** | An ordinary word unrelated to the work that gives the right feeling | **Slack · Notion · Arc · Linear** |
| 8 | **2 syllables that read smoothly** | 2 short real words side by side | **Speak Go · Cash App** |
| 9 | **2 whole unrelated words** | Join 2 real words that relate neither to the product nor to each other into one word | **Tailscale · Snowflake · Firebase · Basecamp** |

**The formulas that give the most "cool + clean" names** are 1 · 4 · 6, because they give short names with no literal meaning that are easy to remember.
**Formula 7 gives names that look grown-up**, but its domains are the hardest to find.

**Letters that feel modern:** start with `x` `z` `q` `v`, or end with `-o` `-a` `-ix` `-ex`.
**Letters that look dated:** ending with `-soft` `-tech` `-sys` `-pro` `-plus` `-max`.

---

**Formula 9 in depth:** take 2 whole real words (cut nothing) that relate neither to the product nor to each other, and put them side by side · at most 3 syllables in total · the first word concrete · read every pair aloud before choosing → reasons, rules and the A/B word pools for pairing are in [`references/formula-9-deep-dive.md`](references/formula-9-deep-dive.md). Open it when you use formula 9.

## 3 · Giving the name a meaning

A short, modern name does not have to be meaningless, because meaning can arrive 2 ways.

| Way | Formulas that give it | Example |
|---|---|---|
| **Built in from birth** | 4 Latin/Greek roots · 7 real words borrowed across contexts | `Aurio` from *aurum*, gold · `Anchor`, stability |
| **Added later** | 6 short meaningless words | `Quix` is chosen first, then tied to speed |

**Rule for meaning:** find the root from **what the user gets**, not from what the system does.
For example, for a gold inventory system, use the root "gold", not the root "warehouse".

**Test:** can you write the meaning in **1 line**?
"Aurio: from Latin aurum, meaning gold." That is all. If it takes more than 1 sentence to explain, the meaning is too weak.

**Thinking libraries:** a table of Latin/Greek roots that work in practice (light · gold · connect · time · protect and others) and a table of real words borrowed across contexts, grouped by feeling (fast · stable · clear · orderly · connected · guiding · quiet) → [`references/meaning-libraries.md`](references/meaning-libraries.md). Open it when you use formula 4 or 7. Real words are the hardest to find domains for, so keep a fallback (`arc.app` · `getprism.com`).

**The story:** short, memorable, easy to retell (not a chain of initials, and not the family dog's name) → good and bad examples in `references/meaning-libraries.md`

**Write the meaning into the brand document** on the day you pick the name, not when someone asks.
That way the sales team tells it the same way every time.

---

## 4 · Name families, when there are several products

Pick one pattern and use it for the whole family.

| Pattern | Looks like | Good | Bad |
|---|---|---|---|
| **Same ending** | `TradeXI` `TelXI` `DockXI` | You know at once they share a house, and new names are easy to make | If one name is damaged, the whole family suffers |
| **Same prefix** | `QuixChat` `QuixFlow` | The parent brand stands out | Every name gets longer |
| **Independent** | `Aurio` `Homify` `Foldrop` | Each one sells itself and can be sold separately | You must build a new brand for each |

**How to choose:** if you sell them as a bundle, use one family. If you might sell them separately or sell the business later, make them independent.

> **Write the family's naming rules down in a document**, together with the rule for naming the next one.
> Otherwise the 5th name breaks the pattern and the whole set looks messy.

---

## 5 · Check what is available before you fall in love

**Check when 5 names are left, not when 1 is left.** If you love a name and then learn you cannot use it, it hurts more.

| Check what | Where | Fails when |
|---|---|---|
| Domain | Domain registrar | `.com` and `.co` are taken and no fallback is left |
| Thai trademark | กรมทรัพย์สินทางปัญญา (Department of Intellectual Property) | A registration exists in our goods or services category |
| International trademark | WIPO database | Same as above, if you will sell abroad |
| Package name (if software) | npm · PyPI · NuGet | Already used in the ecosystem you will publish to |
| App store name (if an app) | App Store · Play Store | An app with the same name exists in the same category |
| Social handles | X · Instagram · Facebook · TikTok · GitHub · LINE | None is free |
| Plain search | Search engine | The first page is full of other people's results |

**Decision rule:** you must get the main domain, at least half the handles must be free, and
there must be no trademark collision in our category. These 3 have no exceptions.

---

## 6 · Sound and typing in the Thai context

| Topic | Rule |
|---|---|
| Thai customers will certainly write the name in Thai | Try writing it yourself first, for example `Aurio` as "ออริโอ", and see if it reads smoothly |
| Choose 1 official Thai form | Follow the transliteration rules of the Royal Society of Thailand (ราชบัณฑิตยสภา) with no tone marks (ซอฟต์แวร์, not ซ้อฟต์แว่ร์) · record it in the brand kit · keep other forms that customers actually type as search keywords, not for the work itself |
| Sounds Thai speakers swallow | `-th` `-v` `-s` at the end of a word vanish almost every time |
| Clusters they avoid | `str-` `spl-` `thr-` |
| Names easy to mistype on a Thai keyboard | Avoid letters so close together that they can swap |
| Length when written in Thai | No more than 5 Thai syllables |

**Real test:** say the name to 3 Thai speakers over the phone and have them type it in LINE and send it back.
If even 1 person types it differently, the name fails.

---

## 7 · Five tests before the final decision

| # | Test | Passes when |
|:--:|---|---|
| 1 | Write it in a real sentence | "ลองใช้ ___ ดูสิ" (Thai for "try ___") sounds natural |
| 2 | Write it next to the category word | "___ — ระบบจัดการคลังทอง" (Thai for "___, a gold inventory system") reads and makes sense |
| 3 | Shrink it to an icon | The first letter or 2 can become a symbol |
| 4 | Survives when the scope grows | A name with the word "gold" breaks the day you also sell silver |
| 5 | Resists teasing | Try making up jokes about your own name. If they come too easily, beware |

**Test 4 matters most for anything that will keep growing.** A meaningless name is safer in the long run.

## Related skills

Logo, colours, typography → `graphic-design` · same product already exists under this name → `prior-art-review` · names in documents → `document-naming` · feature terms inside the product → `i18n-and-locale` · presenting the shortlist → `presentation-design`. A shortlist table you can fill in right away → `assets/name-shortlist.md`


## reference: formula-9-deep-dive.md

# Formula 9 in depth

Open this when you generate names with formula 9.

## The pattern that makes a name look coolest without inventing a word

`Tailscale` = *tail* + *scale*. Neither word has anything to do with private networks, and the two words have nothing to do with each other either.

| How it differs from formula 2 | |
|---|---|
| Formula 2 | **Cuts** syllables before joining, such as `fold`+`drop` → Foldrop, so the result is not a real word |
| Formula 9 | **Cuts nothing.** Put 2 whole real words side by side |

**Why it works**

| Reason | |
|---|---|
| Easy to remember | The listener already knows both words, so there is no new spelling to learn |
| Unique | Nothing forces these words together, so nobody has paired them before |
| Domains are easier to find | Usually easier than a single word, but still check them as in section 5 of `SKILL.md` |
| Passes the phone test | The listener types it correctly at once, because the words are familiar |

**Rules for this formula**

- Total of at most **3 syllables**: `Tailscale` 2 · `Basecamp` 2 · `Snowflake` 2
- **The first word should be concrete**, something you can picture (tail, snow, fire, base, bit, black, cloud)
- Do not let the pair describe the product. If it explains the product, it becomes a dated name like `DataSync`
- **The combined meaning must not come out odd.** Read it aloud and picture it first
- Spellings must not collide into something hard to read. Avoid a first word that ends with the same letter the second word starts with

**How to generate** — build 2 separate pools, then pair at random and read every pair aloud

| Pool A: concrete | Pool B: structure/measure |
|---|---|
| tail · snow · fire · bit · black · cloud · iron · salt · moon · north · glass · pine | scale · flake · base · bucket · camp · bird · flare · stack · frame · gate · port · line |

Example pairs: `Saltframe` · `Pinegate` · `Moonstack` · `Ironport` · `Glassline`

> **Meaning can be added fully afterward** (see item 3). `Tailscale` had no meaning at the start,
> but after some use, people tied it to the idea of a network that can scale.


## reference: meaning-libraries.md

# Libraries for developing a name's meaning

Contents: Latin/Greek root library → real words borrowed across contexts → good and bad stories

## Latin/Greek roots that work in practice

| Meaning | Root | Resulting names |
|---|---|---|
| light · clarity | *lux · lumen* | Lumo · Lumen · Lucent |
| gold · valuable | *aurum* | Aurio · Aura |
| connect | *nexus · syn-* | Nexa · Syno · Nexo |
| power · electricity | *volta · vis* | Volta · Vira |
| circle · world | *orbis · kyklos* | Orbis · Kyklo |
| time · rhythm | *tempus · chronos · kairos* | Tempo · Chrono · Kairo |
| flow · move | *fluxus · kinesis* | Flux · Kinet |
| sound | *sonus · vox* | Sona · Voxa |
| store · chest | *arca* | Arca · Arka |
| protect · shield | *aegis · scutum* | Aegis · Scuto |
| care · look after | *cura* | Cura · Curo |
| beginning | *arche* | Arka · Archo |
| form | *morphe* | Morpho · Forma |
| word · language | *lexis · verbum* | Lexi · Verba |
| look · inspect | *specto* | Specta · Scopo |
| new | *nova* | Nova · Novo |
| true | *veritas* | Vera · Verio |
| work · output | *opus* | Opus · Opero |
| port · door | *portus · porta* | Porta · Portio |

## Real words borrowed across contexts, grouped by feeling

| Feeling | Words |
|---|---|
| fast · agile | Arc · Bolt · Dash · Swift · Rush · Skim |
| stable · safe | Anchor · Vault · Keel · Bastion · Forge · Bedrock |
| clear · visible | Prism · Lens · Beacon · Signal · Facet |
| orderly | Grid · Frame · Ledger · Atlas · Index · Stack |
| connected | Bridge · Relay · Mesh · Loom · Thread · Weave |
| guiding | Compass · Pilot · Helm · North · Trail |
| quiet · smooth | Slate · Quill · Linen · Drift · Still |

> Warning: **real words are the hardest to find domains for**, so prepare a fallback, such as adding a category word (`arc.app`, `getprism.com`)
> or using another short domain style.

## Good and bad stories

| | Example |
|---|---|
| ✓ Good | "Aegis is the shield of Zeus. This system exists to protect." Short, memorable, easy to retell |
| ✗ Bad | "A stands for Advanced, U for Unified, R for Realtime…" Nobody remembers it |
| ✗ Bad | "The name comes from the family dog's name." A personal meaning, so customers feel nothing |


---

# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

> **One rule:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone.

## Use when
- Any work handed to people (code, documents, plans, designs, slides, tables, answers) may hold more than the task needs.
- Cutting a spec, plan or architecture to the fewest parts: also open [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md).
- `human-writing` controls how it is written; this skill controls what the work contains.

Not for: Claude Code's own `/simplify` command · more detail on code (if installed) → `lazy-coding` · `readable-code` in plugin `software-development`.

## Steps
1. Climb the ladder and stop at the first step that works: (a) is this really needed? If not, do not do it and say in 1 line what you skipped; (b) is there an existing thing that works (file, template, function, tool, built-in feature)? Use it; (c) do the shortest version that is still complete and correct.
2. Do only what the task needs; cut before adding (if removing a part loses neither meaning nor function, cut it); plain things people know beat clever things that need decoding.
3. Apply by kind of work:
   - **Code:** names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say why · follow the project's style. Avoid an abstraction with one user, clever hard-to-read shortcuts, one big file, a pile-up `utils/`, a new dependency for a few lines.
   - **Documents · reports:** conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for compared data. Avoid repeats, empty headings, unknown terms.
   - **Plans · procedures:** 3–5 key items, each with an owner and a way to measure done · fewest steps that work. Avoid a 20-item list with no priority.
   - **Designs · slides · figures:** 1 page 1 point · shortest path to the user's goal · familiar patterns. Avoid cramming and decoration that does not help.
   - **Tables · data:** only columns used to decide · short formulas. Avoid columns that repeat a meaning and long nested formulas.
   - **Answers:** answer first, as long as the question needs.
4. **Simple is not sloppy:** never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly. **Simple is not one big pile:** keep clear separation of duties, 1 part doing 1 thing.
5. When you take a deliberate shortcut, write how far it works and when it changes, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process`, and put 1 line in the report: `ข้าม: X — เพิ่มเมื่อ Y`.

## Check before done
- [ ] An outsider can open it for the first time and understand within 30 seconds.
- [ ] No part, step or layer can be cut with no loss.
- [ ] Every added part has a reason it is needed now, not "just in case".
- [ ] Still complete on correctness, safety and what the user asked for.
- [ ] Duties still clearly separated, not squashed into one place to look short.

## References
- [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md) — open for architecture, specs, plans or designs: architecture do and avoid, extra checks per output type, anti-patterns to reject (future-proofing · layer cake · resume-driven design), wrong and right examples


## reference: architecture-and-anti-patterns.md

# Architecture, specs and anti-patterns · simplify

Open this file for architecture, a spec, a plan or a design that keeps growing parts. It holds the rules not already in `SKILL.md`; each section ends with a line naming the rules `SKILL.md` covers.

## Extra checks before submitting

- **Simplest thing that works:** fewest moving parts, boring proven patterns. Add complexity only when something breaks.
- **Reads in one pass:** no jargon the audience lacks, and the whole thing fits in 2 sentences.
- Any "no" or "not sure" on these or on the `SKILL.md` checklist means: simplify before delivering.

Already in `SKILL.md`: a tired teammate gets it in 6 months (the One rule) · every new component, option or layer has evidence it is needed now (checklist) · nothing can be deleted without losing meaning, deleting beats adding (step 2 and checklist) · an example for every abstract claim (step 3, documents).

## Architecture

Do:
- Monolith first. Split only when a bottleneck is proven.
- A familiar stack and standard patterns: Representational State Transfer (REST), queues, caches.
- 1 source of truth per data type.

Avoid:
- Microservices for small teams · distributed-everything.
- Multi-master databases before you must.
- Event-driven by default. A synchronous call is simpler.

## Documents (BRD · SRS · FSD · ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: sentences of at most 20 words · plain English.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy") · walls of text · hedging ("might possibly potentially") · acronym soup.

Already in `SKILL.md`: 1 idea per paragraph · an example for every abstract point · tables for structured data · no undefined jargon (step 3, documents).

## Plans

Do: realistic timelines with buffer · cut scope to fit the time.

Avoid: vague goals ("improve quality") · aspirational dates with no buffer · plans without success metrics.

Already in `SKILL.md`: 3–5 priorities, a named owner per item, measurable success criteria · no 20- or 50-item list with no priority (step 3, plans).

## Designs (user experience (UX) · application programming interface (API))

Do: stay consistent across screens · defaults that work for 80% of users · progressive disclosure (show advanced options only when asked).

Avoid: a novel interaction where a standard one works · a 10-step flow when 3 steps work · required fields with no smart default · hidden features that need a tutorial.

Already in `SKILL.md`: fewest steps to the user's goal · reuse familiar patterns (step 3, designs).

## Anti-patterns to reject

- **Future-proofing:** abstractions for needs that never arrive.
- **"It might scale":** infrastructure for 1M users while you have 1k.
- **Layer cake:** 6 layers where 90% just pass the call through.
- **Resume-driven design:** fancy tech chosen to look sophisticated.
- **Buzzword stacking:** "cloud-native event-driven AI-powered".

## Wrong and right examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use `?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard auth middleware. Log to the existing system."
