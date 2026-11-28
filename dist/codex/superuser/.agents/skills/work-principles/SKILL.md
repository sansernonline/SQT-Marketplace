---
name: work-principles
description: Use before any task to know what good work looks like, in every plugin
---

# work-principles — what good work looks like, before how and who

> **One rule:** every kind of work has 3 layers. Read the principle first (what good is, and why), then use the skill (how), and let the playbook set the order and who does each step. Judge the finished work against the principle, not only against the checklist.

## 3 layers, one job each

| Layer | Answers | Who reads it | Where |
|---|---|---|---|
| **หลักคิด** (principles) | What is good, and why? | everyone, maker and reviewer | this skill (every job) · the plugin's own `*-principles` skill (its kinds of work) |
| **skill** | How do I do this piece right? (rules, numbers, scripts) | the agent doing the piece | each plugin's skills |
| **playbook** | In what order, who does each step, when is it done? | the team lead | `superuser/references/playbook-*.md` of each plugin |

Which layer a sentence belongs to:
- a line with `ใคร:` → playbook only;
- a line with a number or a working rule (24 px · 4.5:1 · a tax rate · a command) → skill, unless the number is the principle itself and cites its source;
- a line that says why something is good → principle.

A playbook never repeats how-to; it links to the skill. A skill never says who does it; it may end with 1 line "whole job → playbook `<name>`". A principle has no step order and no `ใคร:`.

## Principles for every job (this plugin)

| Principle | Where |
|---|---|
| Prove it works: see the real result before saying done | `ground-rules` · part `principle-prove-it-works` |
| Small steps you can check one by one | `ground-rules` · part `principle-small-verifiable-steps` |
| Build a tool instead of repeating handwork | `ground-rules` · part `principle-build-a-tool-not-handwork` |
| Go ahead on work that can be undone; stop on what cannot | `ground-rules` · part `principle-proceed-on-reversible-work` |
| The person's experience comes first | `ground-rules` · part `principle-user-experience-first` |
| Keep it simple | `ground-rules` · part `simplify` |
| Fix the root cause, not the symptom | `fix-at-source` · part `principle-fix-root-cause` |
| Write in human language people can read | `human-writing` |
| Check facts against sources | `research-with-sources` |
| Decide with options, scores and a written reason | `decision-desk` |
| Anything people look at: meaning first, live references, no AI look | `design-gate` (`design-method` · `design-references` · `no-ai-look`) |

## Kinds of work in this plugin

| Kind of work | Principle | Skills | Playbook |
|---|---|---|---|
| A document people read (report · plan · letter · message) | `human-writing` · `design-gate` when it is looked at | `human-writing` · `design-gate` · `workspace-rules` (file names, versions) | `document` |
| Finding facts that need sources | `research-with-sources` | `research-with-sources` · `decision-desk` (when a choice follows) | `research` |
| Checking finished work | `ground-rules` part `principle-prove-it-works` | `ground-rules` · `fix-at-source` | `review` |
| Team work, handing over, long runs | `ground-rules` part `principle-small-verifiable-steps` | `handoff` · `context-budget` | `team-project` · `pickup-and-pause` · `unattended-run` |
| Replying in chat | `human-writing` | `lean-reply` · `quick` (small tasks) | none (one reply) |
| Keeping lessons and the owner's style | `fix-at-source` part `principle-fix-root-cause` | `learn-loop` | `learn-from-session` |
| Writing skills, agents, playbooks | [`references/skill-authoring.md`](references/skill-authoring.md) · `ground-rules` part `principle-prove-it-works` (red → green before done) | `skill-authoring` | `skill-authoring` (software-development, if installed) |
| Multi-step prompts for a chat app | `human-writing` | `handoff` | none |

## Principles per plugin (kinds of work)

| Plugin | Principle skill | Kinds of work covered |
|---|---|---|
| graphic-design | `design-principles` | logo · poster · banner · cover · slides · icon · short and long video · audio · thumbnail · product images · LINE · brand kit |
| software-development | `dev-principles` | code · architecture and API · testing · security · operations · requirements and docs · screens · data and AI · mobile and games · regulated domains · documents and diagrams · product and project planning · systems without docs or source |
| e-commerce | `shop-principles` | selling · customer care · shop money · Thai paperwork · LINE OA · business setup · buying |
| trading-finance | `money-principles` | personal money · investing · trading · scams and tax · company financials · news and alerts |
| personal-life | `life-principles` | life admin · health care organising · career · learning · teaching · planning · family home · family legal · tech growth |

A plugin's principle skill is read only when that plugin is installed. This skill and its table always work, because every plugin depends on `superuser`.

## Adding a principle

1. It goes in the plugin whose work it describes; a principle true for every job goes here.
2. Format: `งานดีคืออะไร` (6–8 principles, each with why + how a reviewer checks it) · `พลาดบ่อย` · `ใช้คู่กับ` · sources.
3. Each principle needs at least 3 reliable sources that agree; drop it otherwise.

## Check before done

- The principle for this kind of work was opened before starting, and the reviewer judged against it
- No step order or `ใคร:` went into a principle file; no how-to was copied into a playbook
