---
name: calendar-audit
description: Use when there is never time for real work, or monthly. Audits the calendar, proposes focus blocks.
---

# Calendar Audit

Your calendar is the honest record of your priorities. Read it once a month.

## Workflow

1. **Pull the last 4 weeks** (working days only) from the calendar plugin or a screenshot/export.
2. **Classify every block** into one category from the table below; unlabelled time counts as *reactive*.
3. **Compute the split** in hours and % of available hours (e.g. 4 weeks × 5 days × 8 h = 160 h).
4. **Compare with the target split** the user names (default targets below) and with their stated top three priorities — any priority with under 10% of time is not really a priority this month.
5. **List recurring meetings** with: sessions in the period, total hours (× attendees if the user organises it), decisions produced.
6. **Pick the worst three by numbers** with `decision-scoring` command `priority` (below), then choose an action for each: kill · shorten · less often · make async · send a delegate.
7. **Protect** — put focus blocks and guard rails into next month's calendar *now*, as real events.
8. **Record** the split in a running file so next month shows a trend.

## Categories and default targets (knowledge worker)

| Category | Includes | Default target |
|---|---|---|
| Focus | deep work blocks, writing, analysis | ≥ 30% |
| Meetings | internal, external, 1:1 | ≤ 40% |
| Admin | email, approvals, expenses | ≤ 15% |
| Travel / commute in hours | between sites, client visits | as low as possible |
| Recovery | lunch actually taken, breaks | 1 h/day |
| Reactive | unplanned, unlabelled | ≤ 10% |

Managers often run 50–60% meetings by design — adjust targets to the role, but keep focus ≥ 20%.

## Meeting cost line

`hours per session × attendees × sessions per month` = person-hours. Example: weekly sync 1 h × 8 people × 4 = 32 person-hours/month. Ask: "what did those 32 hours decide?"

**Refocus overhead.** A meeting dropped into a focus block costs its length plus about 23 minutes to get back into the work. Count it: `meetings that cut a focus block × 23 min` and add it to the meetings column — 5 scattered 30-minute calls in a day cost about 2 h of focus on top of their 2.5 h. Same-length meetings back to back cost nothing extra, which is why the guard rails below cluster them. (23 minutes: Mark, Gudith and Klocke, "The cost of interrupted work: more speed and stress", CHI 2008 — figure as widely quoted; paper not opened on 2026-10-23 → รอยืนยัน.)

## Rank recurring meetings by numbers (`decision-scoring`, command `priority`)

Per recurring meeting give: **urgent 1–5** (does a decision or deadline wait on it this month: 5 = yes now, 1 = no) · **important 1–5** (how much it serves one of the user's top three priorities; the user's own score) · **minutes** = the user's own minutes per month, plus the 23-minute refocus overhead for each session that cuts a focus block. Run `node decide.mjs priority meetings.json` with `{"method":"eisenhower","items":[{"name":"weekly status sync","urgent":2,"important":2,"minutes":240},{"name":"daily stand-up","urgent":3,"important":3,"minutes":600},{"name":"vendor call","urgent":3,"important":4,"minutes":240}]}`.

- Group "drop" (urgent and important both under 3) → kill or make async · group "delegate" (urgent only) → send a delegate · the lowest scores inside the keep groups → shorten or run less often. The worst three are the bottom three rows.
- Number of decisions produced (the column in the worked example) breaks a tie: zero decisions in the last 4 sessions moves the meeting one step down.
- Scores are the user's and untested (starting value, not yet measured). Close scores (within about 20%) → the user decides.

## Guard rails

- One meeting-free half-day per week (e.g. Wednesday morning), marked busy
- Focus blocks of 90–120 minutes, at the user's best hours
- Hard stop time; no meetings over lunch unless it is the meeting
- 25/50-minute default meeting lengths, leaving buffer between
- Long weekends: check the Thai public-holiday calendar for next month and move deadlines that land on or after a วันหยุด

## Worked example

160 h available in September. Found: meetings 78 h (49%), focus 22 h (14%), admin 30 h (19%), reactive 22 h (14%), commute 8 h. Stated priority #1 "write the Q4 (fourth-quarter) plan" got 3 h.

Worst three:
| Meeting | Sessions | Person-hours | Decisions | Action |
|---|---|---|---|---|
| Weekly status sync (8 people) | 4 | 32 | 0 | Make async — written update in chat by Monday 10:00 |
| Daily stand-up 30 min | 20 | 10 (own) | few | Shorten to 15 min |
| Vendor call weekly | 4 | 4 | 1 | Every 2 weeks |

Protect: Tue/Thu 09:00–11:00 focus "Q4 plan", Wednesday morning no meetings. Expected: focus to ~30 h (19%) next month.

## Rules

- Name the worst offenders politely but concretely ("weekly sync, 4 sessions, zero decisions")
- Changes go to the organiser with an alternative, never a silent decline — `polite-message-th-en` has wording
- The audit is worthless unless next month's calendar changes before the session ends

Output: split table vs target · worst three with action · events added · one-line trend vs last month.

Related: `weekly-review` · `meeting-prep-card` (meetings that stay should have a goal).
