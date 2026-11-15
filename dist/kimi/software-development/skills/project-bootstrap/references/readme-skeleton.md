# README skeleton and companion documents — full version

The rules are in `SKILL.md` item 2 · a copy-ready template is in `assets/starter-files.md` · commands and files for each language are in [`readme-by-stack.md`](readme-by-stack.md)

## 1 · README sections in the order a newcomer needs them

> This table is the fallback and the length criteria for layer 3 in `SKILL.md` item 2 · the real sections of each project come from the layer 2 survey (read the project · official docs · READMEs of projects of the same type) · a section that this type of project needs but that is not in the table may be added.

The order follows what someone who has just arrived needs: what is this → install → run → change code → ship · the "Sources" column is the number of the 5 main sources (item 4) that recommend the section · a row that merges several topics gives a range · "—" means no main source recommends it; it is this skill's own judgment. The section names in the "Section" column are the Thai headings written into the README, so they stay Thai (English gloss in brackets).

| # | Section | Question it answers | Present when | How long · where to move it if longer | Sources |
|:--:|---|---|---|---|:--:|
| 1 | ชื่อ + ทำอะไรให้ใคร (name + what it does for whom) | What is this, who uses it | always | 2–3 lines · first line at most 120 characters | 5 |
| 2 | บรรทัดสถานะ (status line) | Is it still in development, who owns it, where are the docs | always | 1 line: status · owner · link to `docs/README.md` | 2–4 (status 2 · owner 4 · docs link 4) |
| 3 | ภาพหน้าจอหรือตัวอย่างผล (screenshot or sample output) | What does it look like or produce | there is a screen or output to look at | 1 image, or a sample command with its output | 2 (usage example 3) |
| 4 | ต้องมีบนเครื่อง (needed on the machine) | What must be installed first, which version | always | table: tool · version · which file pins the version (`.nvmrc` · `global.json`) | 3 |
| 5 | เริ่มใช้งาน (getting started) | How to install and run | always | commands that can be copied, pasted and run, at most 6 commands · more than that becomes `scripts/setup` | 4 |
| 6 | ตั้งค่า (configuration) | What must be configured, how many environments, how to switch | the project reads values from outside | table: variable name · what it is for · required or not · sample value (no real values) · for a secret give only the name and where to get it · if there is none, write "ไม่มีค่าตั้งภายนอก" (no external config) | 0 · based on Twelve-Factor |
| 7 | คำสั่งที่ใช้บ่อย (common commands) | How to run dev · test · lint · format · build | always | table of 4–8 rows · test must be 1 command | 2 |
| 8 | โครงโปรเจกต์ (project layout) | What is in which folder | always | a one-level tree, at most 15 lines · more → `ARCHITECTURE.md`, code-map section | 1 |
| 9 | สถาปัตยกรรมย่อ (short architecture) | How many parts the system has, how they talk | more than 1 part (web page + API + database · queue · external service) | 3–5 lines + a Mermaid diagram at Context or Container level · full → `ARCHITECTURE.md` | — · based on matklad and C4 |
| 10 | build และไฟล์ที่ได้ (build and output files) | How to make the deliverable, what files come out, where | there is something to build (web · app · binary · package) | build command per target + the path of the output file | 2 (counted together with deploy) |
| 11 | deploy | Where it goes live, who triggers it, through which Continuous Integration (CI), how to roll back | it can be deployed | 3–5 lines · full steps → `docs/runbook-deploy.md` | 2 (counted together with build) |
| 12 | ติดปัญหา (troubleshooting) | Common symptoms and fixes | always | table of symptom · fix · start from what you hit yourself while writing the README | — |
| 13 | ร่วมพัฒนา (contributing) | branch · commit · pull request (PR) · what to check before sending | other people change the code | 3–5 lines · longer → `CONTRIBUTING.md` | 4 |
| 14 | ติดต่อและขอความช่วยเหลือ (contact and help) | Whom to ask when stuck, which channel | always | 1–2 lines | 4 |
| 15 | สัญญาอนุญาต (license) | How far it can be reused | always · the last section | 1 line + the `LICENSE` file · for internal work write "ใช้ภายใน <บริษัท> ห้ามเผยแพร่" (internal use at <company>, do not distribute) | 2 |

**Skeleton rules**
- Cut a section that has nothing in it; do not write "none" · except section 6, which must say there is no external config.
- The README holds only what a newcomer needs in the first 30 minutes · anything longer moves to the file named in column 2, with a link back; do not delete it.
- Longer than 100 lines → put a table of contents under the status line.
- Edit the README in the same commit as the code that changes a command or setting.
- Each language has sections to add (Flutter flavors · .NET `user-secrets`) → [`readme-by-stack.md`](readme-by-stack.md) section 3.

## 2 · What goes into other files

| File | Lives at | Content | Create when |
|---|---|---|---|
| `ARCHITECTURE.md` | `<project-name>/` | a code map for people who change the code (section 3) | the folder tree in the README exceeds 15 lines, or the system has more than 1 part |
| `CHANGELOG.md` | `<project-name>/` | what users see changing in each version | per the table in `SKILL.md` item 3 |
| `CONTRIBUTING.md` | `<project-name>/` | developer machine setup · branch · commit · PR · lint and test before sending | README section 13 is longer than 5 lines |
| `LICENSE` | `<project-name>/` | the full license text | the repo is public, or the contract requires it |
| `SECURITY.md` | `<project-name>/` or `.github/` | how to report a vulnerability · versions still supported | the repo is public, or delivered to a customer who maintains it |
| `CODEOWNERS` | `.github/` | which folder whom must review in a PR | there are several teams or owners |
| `runbook-deploy.md` | `docs/` at the root | build → release → run steps · each environment's setup · rolling back | the deploy steps are longer than 5 lines |
| `decisions/ADR-NNNN-<slug>.md` | `docs/` at the root | decision records (Architecture Decision Record (ADR)), one per decision | a hard-to-reverse decision is made (`adr-writer`) |
| Architecture, delivery edition | `docs/` at the root | an arc42-style architecture document | delivering to a customer or there is an acceptance reviewer (`project-doc-set`) |

The location of `docs/` follows layout B in `project-doc-set` item 1 · GitHub looks for `CONTRIBUTING` and `CODEOWNERS` in `.github/` first, then the repo root, then `docs/` · documents in `docs/` can be split by what the reader needs into 4 kinds (Diátaxis): learning (tutorial) · getting a job done (how-to, e.g. a runbook) · looking up facts (reference, e.g. an API settings table) · understanding the reasons (explanation, e.g. ARCHITECTURE · ADR)

## 3 · ARCHITECTURE.md

**Default: matklad's short form** — the reader is someone who will change the code and wants to know where the thing that does X lives.

```markdown
# สถาปัตยกรรม

## ภาพรวม
<ระบบแก้ปัญหาอะไร รับอะไรเข้า ส่งอะไรออก — 1 ย่อหน้า + รูป Context หรือ Container 1 รูป>

## แผนที่โค้ด
<แต่ละโฟลเดอร์หรือโมดูลหลักทำอะไร คุยกับใคร — ทีละย่อหน้าสั้น ๆ>

## ข้อห้ามที่ต้องรักษา
<กฎที่โค้ดต้องไม่ละเมิด เช่น "ชั้น domain ไม่ import ฐานข้อมูล" · "ทุกการเขียนเงินผ่าน ledger">

## เส้นแบ่งระหว่างชั้น
<ตรงไหนคือ API สาธารณะ ตรงไหนแก้ได้อิสระ>

## เรื่องที่ตัดผ่านทุกส่วน
<log · error · สิทธิ์ · config · การทดสอบ — ทำแบบไหน อยู่ที่ไหน>
```

- Short; include only what rarely changes · you may name a file, module or type, but put no links, because links break when files move; let people search by name instead.
- Do not explain every module in detail · do not chase every commit · review 2–3 times a year.
- Diagrams use only the 2 C4 levels, Context and Container, which c4model.com says are enough for most teams · do not draw the Code level · draw with Mermaid per `software-diagrams`.

**Use arc42 instead when** delivering to a customer or another team who will maintain it · there are quality requirements (speed, security) that must be proven · an acceptance reviewer is needed — choose only the sections that have real content from the 12 sections: goals · constraints · scope and context · solution strategy · building blocks · runtime view · deployment · cross-cutting concepts · decisions (point to ADRs) · quality requirements · risks and technical debt · glossary · this edition lives in `docs/` per `project-doc-set`, not in the code folder.

## 4 · Sources (read 2026-11-07)

The 5 main sources used to count the "Sources" column in item 1:
- [standard-readme spec](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — required sections · license at the end · table of contents when over 100 lines
- [Make a README](https://www.makeareadme.com/) — long is better than short; if too long, move, do not delete
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Google documentation guide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) · [Best practices](https://google.github.io/styleguide/docguide/best_practices.html) — change docs together with code
- [Microsoft Engineering Playbook: Project and Repositories](https://microsoft.github.io/code-with-engineering-playbook/documentation/guidance/project-and-repositories/) — folder layout · compile test build deploy

Supporting sources: [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) · [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) · [arc42](https://arc42.org/overview) · [C4 model diagrams](https://c4model.com/diagrams) · [Diátaxis](https://diataxis.fr/) · [Twelve-Factor: Config](https://12factor.net/config) · [Build, release, run](https://12factor.net/build-release-run)

The section order · the 15-line and 6-command ceilings · the configuration table · the troubleshooting and short-architecture sections are this skill's own judgment, not the sources' words.
