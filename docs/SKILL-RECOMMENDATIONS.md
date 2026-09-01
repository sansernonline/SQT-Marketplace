# Skill Recommendations & Changes

_Reviewed: all 14 plugins, 67 agents, 67 skills. Goal: each agent gets more capable with **less** prompting, by reusing simple, readable skills — not by adding bulk._

---

## 1. What I found

**The "universal" skill wasn't universal.** `simplicity-first` is described as
applying to every agent, but only the 12 core `software-company` agents
referenced it. The 55 specialist agents — including every engineer who writes
code — referenced it nowhere.

**Many engineers referenced *no* skills at all:** all 4 mobile agents, all 4 IoT
agents, `smart-contract-developer`, `payment-integration`, `fhir-specialist`,
`revops-analyst`, `contract-analyzer`, `document-automation-engineer`.

**`simplicity-first` was 372 lines** — ironically bloated for a skill about
simplicity, and it mixed code rules with doc/plan/architecture rules.

**The fix model: Ponytail.** The community [`ponytail`](https://github.com/DietrichGebert/ponytail)
skill does the "keep it simple" job for *code* in ~90 lines using a decision
**ladder**, **intensity levels**, a **comment convention**, and strict **output
discipline** (code first, ≤3 lines of explanation). Reported results: 80–94%
less code, 47–77% less cost, 3–6× faster. That's the pattern worth copying.

---

## 2. What I changed (done)

1. **Created `lazy-coding`** (`software-company/skills/lazy-coding/`) — a
   ponytail-adapted skill, 90 lines, **code only**. Keeps ponytail's ladder,
   `lite/full/ultra` intensity, and output discipline; adapted to the team's
   own rule ("a tired teammate understands it in 6 months") and uses a
   `// simple:` comment to mark deliberate shortcuts with their upgrade path.

2. **Slimmed `simplicity-first`** from 372 → 119 lines, **non-code only**
   (docs, plans, architecture, designs). Code now defers to `lazy-coding`. No
   more overlap.

3. **Wired `lazy-coding` into 30 code-writing agents** across all 14 plugins —
   including the ones that previously had no skills section at all.

Split rule, going forward:

| Output | Skill |
|--------|-------|
| Code (write / fix / refactor / review) | `lazy-coding` |
| Docs, plans, architecture, UX/API design | `simplicity-first` |

---

## 3. Recommended next: reuse skills you already have

The biggest remaining win needs **no new skills** — just point specialist
engineers at the core skills that already exist. Right now they're effectively
invisible outside the core plugin. Suggested additions per agent type:

| Agent type (across plugins) | Add these existing core skills | Why |
|---|---|---|
| Every `*-engineer` / `*-developer` that commits code | `commit-message-format`, `code-review-checklist`, `work-session-context` | Consistent commits, self-review, resumable sessions — zero extra prompting |
| Agents that open PRs | `pr-description-template` | Uniform PRs, faster review |
| Agents producing diagrams in docs/PRs | `markdown-visuals` | A diagram halves review time |
| Architect-type agents (`*-architect`, `saas-architect`, `edge-architect`) | `adr-writer`, `architecture-patterns` | Already used by `solution-architect`; reuse, don't reinvent |
| Compliance / officer agents | `polished-document-style`, `office-document-handling` | They produce reports and audit docs |

Each is a one-line addition to the agent's **Skills You Use** section, in the
same `` `skill-name` (from software-company) — when to use `` format already in
use. Say the word and I'll wire these in too.

---

## 4. Optional new skills worth creating (small, high-leverage)

Only if a real need shows up — same lazy philosophy, each ~1 page:

- **`tech-stack-defaults`** — the team's boring-by-default choices (DB, queue,
  language per layer) so every engineer reaches for the same proven tools
  instead of re-deciding. Cuts "which library?" prompting to zero.
- **`pr-self-review`** — a 10-item pre-PR checklist (tests pass, diff < 400
  lines, no debug logs). Pairs with `lazy-coding` and `code-review-checklist`.
- **`incident-comms`** — a fill-in-the-blanks status-update template for the
  cybersecurity / SRE agents during an incident.

I'd hold off on these until the reuse in §3 is in place — that alone closes
most of the gap without adding anything to maintain.

---

## 5. How to use `lazy-coding`

It triggers automatically on any code task. To steer intensity in a prompt:
`lazy lite` (suggest the lazier option, you pick), `lazy full` (default,
enforce the ladder), `lazy ultra` (challenge whether the code should exist at
all). Turn off with `stop lazy`.

**Sources:** [ponytail SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) · [ponytail repo](https://github.com/DietrichGebert/ponytail)
