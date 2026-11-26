# Make 3 styles, then vote 2 of 3

Used with `cover-design.md` step 7. It is a variant of `crew-patterns/parallel-attempts-pick-best` that swaps "1 middleman agent" for "3 reviewers who vote".
Cost: about 3–5 times the work of a single style. Use it when you set a project's look for the first time, not at every version bump.

## 1 · Prepare before launching

1. **Survey** (1 middleman agent, read-only) → `_to_delete/cover-lab/survey/SURVEY.md`: app description · main verbs · logo files · colors · fonts · main-screen images from the mockup · image of the current cover, page 1 (Word through COM, the Windows automation interface → PDF → `pdftoppm`) with critique.
2. **Research** (1 middleman agent, in parallel with step 1) → `research/RESEARCH.md`: good-looking tech-company covers · trends · cheap-looking things · image techniques done in code · Word limits · every claim has a URL.
3. **Same brief for every designer**, `BRIEF.md`. Every designer reads `EXAMPLES.md` and looks at the overview sheet of real covers first (`cover-real-examples.md`). Start from the cover builder that already builds in Word; do not rewrite it. The brief lists the deliverables (an SRS cover for every project · the image set for BRD/SRS/ARCH · at least 1 print cover · repeatable `src/` · `METHOD.md` ≤ 90 lines), the hard rules (items 3 and 9 of cover-design.md), and a ban on opening other designers' folders.
4. **The team lead keeps the voting criteria** and does not send them to designers (put them in the scratchpad, not in `cover-lab/`).

## 2 · 3 designers — they differ by style, not just by random draw

| Designer | Style (constraint sent) |
|---|---|
| A | The app's behavior drawn as art from real data · Swiss grid |
| B | The app as hero, magazine-cover style · real mockup screens placed with intent |
| C | Logo shapes as architecture · type as structure · no illustration, screenshot, or glow |

- Use a large-tier model · launch all 3 in one message · one folder each: `_to_delete/cover-lab/attempt-<A|B|C>/`.
- **Each agent needs Bash** so it can render and look at its own images (cap of 3 fix rounds). Before launching, check the tool list of the agent as **installed**. History: in the real bake-off (2026-10-15), the installed `graphic-designer` of plugin version 2.3.0 had no Bash (the current version in the repo has it). All 3 designers therefore sent code they had never seen rendered. The team lead had to render it and send a fresh `general-purpose` agent to do the fix round. If there is no Bash, use `general-purpose` and attach the designer role in the instruction.

## 3 · 3 reviewers — read-only, different angles, same criteria

| Reviewer | Angle |
|---|---|
| 1 | Art director: is it a real wow, does it look AI-made? |
| 2 | Brand strategist + Thai client who reads the BRD: can they remember the app, do they know what it does, does a set of 6–15 documents go together? |
| 3 | Production engineer + skill author: can an agent repeat it on a new project, how many numbers are project-specific, do the background images for Word hide all the text, is the version embedded in the image? |

The options voted on must always include the **current cover** (if there is one).

Score each of 7 criteria from 1 to 5: wow compared with the old cover · no repeats between projects · tells the truth about the app · document-set system · polish (Thai · contrast · smallest text · print cover · Word matches the sample image) · learned from real covers (borrow structure, do not copy) · buildable in Word and repeatable.
Then vote: `overall` 1 style · `per_project` the best style for each project · `steal` at most 2 pieces from losing styles.

## 4 · Count the votes

- The style with **2 of 3** wins, for both `overall` and per project (per-project winners may differ from overall).
- If the vote splits 3 ways, the team lead reads the total score per criterion. The "repeatable" criterion decides when scores are close. Then log it in `decision-desk/decision-log`.
- The team lead looks at all the images before reading the votes, then compares. If they disagree, read both sides' reasons before deciding.

## 5 · Merge the results

1 new agent (with Bash) works in `_to_delete/cover-lab/final/`: use the per-project winning style · bring in the voted `steal` pieces · fix what reviewers flagged · make 300 dpi background images for every document · build a sample .docx with `brandkit.py` and render it in real Word to look at it · write `NOTES.md`.
Do not overwrite the user's .docx. Build a new render from the source markdown. (Origin of this rule: SQT-Marketplace prompt set `prompt/software-development/prompt-new-project.md`, version 14, which lives outside this plugin.)

## First real result (2026-10-15 · the full reviewer report was in `_to_delete/cover-lab/votes.md` of the repo at the time, a temporary file)

| | A real data | B real screens | C logo shapes |
|---|---|---|---|
| Total score, reviewer 1 / 2 / 3 | 23.5 / 21 / 23 | 23 / 24 / 24 | 27 / 27 / 22 |
| overall | — | 1 vote | **2 votes** |
| LiteNet · Telex · SwipeOS | 1 · 0 · 0 | 0 · **2** · 0 | **2** · 1 · **3** |

### Round 2: learned from 35 real covers, then compared with the round 1 cover (R1)

| | R1 | X institutional set | Y editorial art | Z builds on R1 |
|---|---|---|---|---|
| Total score, reviewer 1 / 2 / 3 (7 criteria) | 26 / 24 / 24 | 24 / 24 / 24 | 26 / 26 / 30 | 31 / 29 / 28 |
| overall | — | — | 1 | **2** |
| LiteNet · Telex · SwipeOS | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 1 · **2** | **3** · **2** · 1 |

Lesson: **put the old cover in the vote every time**, so you know whether the new one is really better. Add criterion 7, "learned from real covers". Pieces taken: the series-name line (X) · version as Word text in a badge (X) · one color per document type in the brand family (Y).

Pieces taken in round 1: the sentence under the title saying what the app does (from B) · the truth test for every image (from A) · `checks.json` (from C, put into B).

## The lesson behind this skill (3-style bake-off · 2026-10-15 · 3 projects · 3 reviewers)

The old covers of the 3 projects used one formula: black background, glow in the brand color, mono badge, data row at the bottom of the page. Only the color differed, which is the look AI produces for everything.
We tried 3 styles in parallel and had 3 reviewers vote. **The logo-shape style won 2 of 3.** The real-screen style won only for Telex (a plain T_ logo does not say it is a terminal). The art-from-real-data style had a few standout covers (LiteNet got 1 vote) but is the hardest to repeat on a new project.
Round 2 (the user said much more should change, and to learn from other people's real work): we collected 35 real covers, then made 3 new styles to compare with the round 1 cover. **The round 1 cover scored lowest on "learned from real work" from every reviewer.** The winner, 2 of 3, was the style that builds on round 1 with lessons from real covers (Thai title largest · version as a separate badge · logo-shape image bleeding off the edge like Stripe Press · real screen layered under a title bar like O'Reilly). SwipeOS won with a grid of 12 real hand gestures (in the style of the Microsoft Inclusive Design pictogram set).
