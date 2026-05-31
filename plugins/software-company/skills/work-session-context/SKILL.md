---
name: work-session-context
description: Use at the END of any significant task to save a concise context summary file under .claude/context/ so work can be resumed in a future session (even after closing terminal or switching teammate). Also use at the START of a session to check existing context. Critical for cross-session continuity and team handoff.
---

# Work Session Context

## When to use this skill

### 📥 At START of session (always)
- Check `.claude/context/INDEX.md` if exists
- Read recent session files to know what's in progress
- Resume from "Next Steps" of latest session

### 📤 At END of significant work (always)
- After completing a task that took > 5 min
- After making decisions worth remembering
- Before stopping for the day
- After a `/feature-kickoff`, `/sprint-plan`, or similar workflow

### 🤝 For team handoff
- When teammate will pick up
- When work spans multiple days
- When work spans multiple Claude sessions

## File Layout (Convention)

```
<project-root>/
└── .claude/
    └── context/
        ├── INDEX.md                                ← latest summaries (rolling)
        └── sessions/
            ├── 2026-05-30-1430-feature-kickoff.md  ← per-session details
            ├── 2026-05-30-1610-code-review.md
            └── ...
```

**Why this location:**
- `.claude/` is Claude Code convention (excluded by most projects' `.gitignore` patterns — but we WANT this committed)
- Git-tracked → team sees + reviews
- Markdown → readable anywhere
- Subfolder `sessions/` → can be archived/cleaned up

> ⚠️ **Make sure `.claude/context/` is NOT in `.gitignore`** — we want this committed.

## Format: Session File

Filename: `YYYY-MM-DD-HHMM-<short-task-slug>.md`

```markdown
# 📝 <Task Title>

| | |
|--|--|
| **Date** | YYYY-MM-DD HH:MM (timezone) |
| **Agent(s)** | business-analyst, system-analyst |
| **Status** | 🟢 Completed \| 🟡 In Progress \| 🔴 Blocked |
| **Duration** | ~XX min |
| **Triggered by** | User request / /feature-kickoff / etc. |

## 🎯 What was done

1-3 sentences. What did we accomplish?

## 🧠 Key decisions

- Decision 1 (why)
- Decision 2 (why)

## 📂 Files touched

- `path/to/file.ts` — what changed
- `path/to/doc.md` — created

## ❓ Open questions

- [ ] Question 1 (needs answer from: @who)
- [ ] Question 2

## ➡️ Next steps

What should happen next? (Critical — this is how we resume.)

1. ...
2. ...

## 🔗 Related

- Previous session: [link](sessions/...)
- Related issue/PR: ...
- Related docs: ...
```

## Format: INDEX.md

Rolling latest-on-top list:

```markdown
# 📚 Work Context Index

Latest sessions at top. Full details in `sessions/`.

---

## 🟡 In Progress

### 2026-05-30 14:30 — Feature kickoff: User membership
- **Agent:** business-analyst
- **Status:** BRD drafted, awaiting stakeholder review
- **Next:** PM to align timeline once BRD approved
- **File:** [sessions/2026-05-30-1430-feature-kickoff.md](sessions/2026-05-30-1430-feature-kickoff.md)

---

## 🟢 Recently Completed

### 2026-05-30 16:10 — Code review: login.ts
- **Agent:** developer
- **Status:** 3 blocking + 5 nit findings, dev fixed
- **File:** [sessions/2026-05-30-1610-code-review.md](sessions/2026-05-30-1610-code-review.md)

### 2026-05-29 11:00 — Sprint planning
- **Agent:** project-manager
- **Status:** Sprint 12 plan finalized, 25 points committed
- **File:** [sessions/2026-05-29-1100-sprint-plan.md](sessions/2026-05-29-1100-sprint-plan.md)

---

## ⚪ Older (archive after 30 days)

(automatically rolled off, or move to sessions/archive/)
```

## Resume Pattern

At session start (if context exists):

```
1. Read .claude/context/INDEX.md
2. Skim recent in-progress + completed
3. For ANYTHING marked 🟡 In Progress:
   - Read full session file
   - Continue from "Next Steps"
4. Acknowledge user with: "I see we were working on X. Last step was Y. Should I continue?"
```

## Writing Discipline

### ✅ Good summaries

```markdown
## 🎯 What was done
Designed authentication flow using OAuth 2.0 PKCE. Chose Stripe Identity
for KYC. Documented in adr/0007-auth.md.

## ➡️ Next steps
1. Solution architect to review ADR (ping @bob)
2. Once approved, dev starts implementation in /src/auth
3. Need API key for Stripe Identity (request from @alice)
```

### ❌ Bad summaries

```markdown
## What was done
Worked on stuff.

## Next steps
TBD.
```

> 💡 **Concise but complete.** Future you (or teammate) needs enough to resume.

## Granularity Rules

### Write a session file when:
- ✅ Completed a feature-kickoff workflow
- ✅ Finished implementing a feature
- ✅ Made architectural decision
- ✅ Concluded code review with findings
- ✅ Designed test plan for a feature
- ✅ Filed a bug report
- ✅ Conducted threat model
- ✅ Completed sprint planning / retro

### Skip session file for:
- ❌ Single chat answer
- ❌ Quick lookup
- ❌ < 5 min work
- ❌ Trivial edits

## Multi-Agent Sessions

If multiple agents worked (e.g., `/feature-kickoff`):

```markdown
## 🎯 What was done

**business-analyst** → BRD draft at docs/brd/membership-v1.md
**solution-architect** → ADR-0007 at adr/0007-auth.md
**system-analyst** → FSD draft at docs/fsd/membership-v1.md
**project-manager** → Sprint plan with 25 points

## ➡️ Next steps
1. Stakeholder review of BRD by Friday
2. Once approved, dev kickoff Monday
```

## INDEX Maintenance

After each session file is written, update INDEX.md:

1. Move new entry to top of "🟢 Recently Completed" (or "🟡 In Progress")
2. Move stale "In Progress" items to "Recently Completed" or archive
3. Move entries older than 30 days to "⚪ Older"
4. Periodically: move ⚪ Older items to `sessions/archive/`

Keep INDEX.md **scannable** — < 50 entries visible at top level.

## Avoid Bloat

- Don't write a session file for every chat
- Don't duplicate content (link to docs, don't copy)
- Don't write "what was discussed" — write "what was decided"
- One session = one task or one workflow
- 200-400 words per session file (1 page max)

## Integration with Other Skills

- **At start of every workflow command** (e.g., `/feature-kickoff`): check context
- **`polished-document-style`** — use for stakeholder-facing output, NOT for session files (those should be quick + scannable)
- **`commit-message-format`** — when committing session file, use: `docs(context): <task summary>`

## Sample Workflow

```
User: /feature-kickoff ระบบสมาชิก
       ↓
Claude (orchestrator):
  1. Check .claude/context/INDEX.md ✓
     (no existing membership work — fresh start)
  2. Run business-analyst → BRD
  3. Run solution-architect → ADR
  4. Run system-analyst → FSD
  5. Run project-manager → Plan
       ↓
Workflow done. Now save context:
  - Write sessions/2026-05-30-1430-membership-kickoff.md
  - Update INDEX.md
  - Suggest git commit:
    `git add .claude/context/ && git commit -m "docs(context): kickoff for membership feature"`
       ↓
User closes terminal.
       ↓
Next day, new session:
       ↓
Claude:
  1. Check .claude/context/INDEX.md
  2. Sees 🟡 In Progress: membership kickoff
  3. Reads session file
  4. "I see we kicked off membership yesterday. BRD/FSD/Plan done,
      next step is dev kickoff. Want to proceed?"
```

## Setup Tips (One-time)

If `.claude/context/` doesn't exist yet, create it:

```bash
mkdir -p .claude/context/sessions
touch .claude/context/INDEX.md
echo "# 📚 Work Context Index" > .claude/context/INDEX.md
```

Make sure not gitignored:
```bash
# Check
grep -E "^\.claude" .gitignore

# If listed, refine to allow context:
# .gitignore should NOT include `.claude/` blanket
# OR add specific allow: !.claude/context/
```

## Anti-patterns

- ❌ **Saving everything** — only significant work
- ❌ **Copying chat history** — write decisions, not transcript
- ❌ **Forgetting INDEX.md update** — INDEX is the entry point
- ❌ **Not committing to git** — defeats team handoff purpose
- ❌ **Including secrets** in session files (PII, API keys, etc.)
- ❌ **Vague "Next steps"** — must be actionable
