# skill: goals-and-decisions

Use when setting goals, building a habit or facing a big decision

# goals-and-decisions — quarterly goals, habits and decision records

> **One rule:** Write the decision down before the outcome is known, and never edit the original entry. Revisits are added below it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Set goals for this quarter" or "I keep missing a habit" | [`references/goal-and-habit.md`](references/goal-and-habit.md) |
| "I have a big decision to make, a job offer, a house, a move" | [`references/decision-journal.md`](references/decision-journal.md) |

The goal tracker is in `references/tracker-template.md`. The decision entry form is in `references/entry-template.md`. Worked numbers are in `references/scoring-example.md`.

## Check before done

- Options include at least three choices, always including "do nothing or wait".
- Iron rules come first: an option that breaks a limit the user set before looking is dropped, not scored.
- Never edit an old decision entry. Revisits are appended below it.
- Never shame a missed habit. One miss is normal, and two in a row means the system needs changing.
- Say once that money decisions are general information, not financial advice. For a large sum, talk to a licensed adviser or an accountant (นักบัญชี).
- A whole decision or goals cycle with several steps → playbooks `superuser/references/playbook-decide-and-goals.md` or `playbook-habit-tracking.md`.


## reference: decision-journal.md

<!-- merged from skill `decision-journal` on 2026-11-27 · description was: Use when facing a big personal life decision -->
# Decision Journal

Write down why you decided, so future-you cannot rewrite it — and so you can tell bad luck from bad judgement.

Entry and revisit templates: [references/entry-template.md](entry-template.md).

## When to write an entry

| Write one | Skip |
|---|---|
| Costs more than ~1 month of income, or locks money in for a year+ | Reversible within a week at low cost |
| Hard to undo (job, move, marriage-level, big purchase, loan) | Daily or repeated choices |
| Made under strong emotion, pressure or a sales deadline | Choices someone else makes for you |
| You notice yourself arguing with someone about it | |

## Workflow

1. **State the decision** in one sentence, with the date it takes effect.
2. **Classify the door** — two-way (reversible: decide fast) or one-way (irreversible: slow down, sleep on it).
3. **List the real options** — at least three, always including "do nothing / wait".
4. **Write the key facts** with numbers (price, monthly cost, time, salary) and what you do **not** know.
5. **Reasoning** — the two or three reasons that actually tip it, each with confidence 1–10 (10 = would bet a year's income on it; under 5 = a guess dressed as a reason, so find the fact or drop it). At the revisit, a 9 that turned out wrong is the lesson.
6. **Pre-mortem** — "It is one year later and this went badly. Why?" List the top 2 causes and what would warn you early.
7. **Prediction** — what you expect to observe, measurable, with a check-in date (3, 6 or 12 months).
8. **Emotional state** — calm / excited / anxious / pressured. One word.
9. **Schedule the revisit** in the calendar now.
10. **At the revisit** — fill the revisit block **without editing the original**, give the verdict, write one process lesson.

## Choose between options by numbers (`decision-desk/decision-scoring`)

Use this at step 3–5, once the options and the numbers exist. Pick the command by what is known:

| Situation | Command | Read the result as |
|---|---|---|
| The outcome depends on the future and the user can state the chances | `payoff` | expected value (ค่าคาดหวัง) = sum of chance × outcome |
| Chances unknown (a guess dressed as a number) or the door is one-way | `payoff`, read the **เสียดายมากสุด** column | minimax regret: pick the option whose worst regret is smallest |
| Several different criteria (money, time, growth), each option sure | `score` | weighted score after iron rules drop options |

Iron rules first (กฎเหล็ก): an option that breaks a limit the user set before looking (monthly payment above a fixed share of income, no emergency fund left) is dropped, not scored. Run `node decide.mjs payoff decision.json` or `score`. Example, the job offer in the worked example below (pay in year 1, baht, higher is better; chances 0.3 / 0.4 / 0.3 are the user's guess):

Example input (JSON for `payoff`) and the result when run: [references/scoring-example.md](scoring-example.md)

## Revisit verdict grid

| | Outcome good | Outcome bad |
|---|---|---|
| **Reasoning good** | Earned — repeat the process | Bad luck — do not overcorrect |
| **Reasoning bad** | Lucky — fix the process anyway | Learn — what signal was ignored? |

Judge the reasoning on what was knowable *then*, not on what happened.

## Thai-context checks for common big decisions

- **Buying a condo/house** — monthly instalment vs rent, transfer fees and taxes at the land office, common-area fee (ค่าส่วนกลาง), and whether the bank's approved loan is the user's comfortable payment; tax angle in `income-tax-th` (trading-finance) if installed
- **Changing jobs** — total package not base salary: bonus history, provident fund (PVD) employer match and vesting, social security continuity, notice period in the contract; `thai-employment` (e-commerce) if installed
- **Lump-sum investing** — emergency fund first, then fit to the time horizon; product choice is outside this skill
- **Big purchase with a "today only" price** — that pressure is a reason to log, wait 48 hours, and compare (`buyer-help` in e-commerce if installed)

General information, not financial advice — for money decisions of this size talk to a licensed adviser or นักบัญชี.

## Worked example

A full dated entry with its revisit and verdict: [references/scoring-example.md](scoring-example.md)

## Rules

- Short beats detailed — if it cannot be stated in five lines, it is not decided yet
- Never edit the original entry; revisits are appended
- Log emotional decisions especially; they teach the most
- One file `decision-journal.md`, newest first, or one file per decision `YYYY-MM-DD-decision-topic.md`

Related: `weekly-review` (surfaces revisit dates) · `goal-and-habit.md`.

## เรียกเป็นคำสั่ง

`/personal-life:goals-and-decisions <the decision, in one sentence>`

Run the `goals-and-decisions` skill for: **the user's request**

Confirms options considered and expected outcome, writes the dated entry, and sets the check-in reminder.


## reference: entry-template.md

# Decision journal templates

## Entry

```markdown
## YYYY-MM-DD — [decision in one sentence], effective YYYY-MM-DD

- Door: one-way / two-way
- Options: 1) ___ 2) ___ 3) do nothing / wait
- Key facts (numbers): ___
- Unknowns: ___
- Reasoning (confidence 1–10 each):
  - ___ (H)
  - ___ (M)
- Pre-mortem — it went badly because: ___ · early warning sign: ___
- Prediction (measurable): ___ by YYYY-MM-DD
- State of mind: calm / excited / anxious / pressured
- Revisit: YYYY-MM-DD (calendar event created: yes / no)
```

## Revisit (append below the entry — never edit above)

```markdown
### Revisit YYYY-MM-DD
- What happened: ___
- Prediction met? yes / partly / no
- Early warning appeared? ___
- Verdict: reasoning good|bad / outcome good|bad
- Process lesson (one line): ___
```

## Quarterly look-back (10 minutes)

| Decisions revisited | Good/good | Good/bad (luck) | Bad/good (lucky) | Bad/bad | Repeated lesson |
|---|---|---|---|---|---|
| | | | | | |

A lesson that appears twice becomes a personal rule, written at the top of the journal.


## reference: goal-and-habit.md

<!-- merged from skill `goal-and-habit` on 2026-11-27 · description was: Use when setting quarterly goals or building a habit -->
# Goals and Habits

Few goals, measured honestly, carried by habits small enough to survive a bad week.

## Workflow

1. **Brain-dump** everything the user wants this quarter. Do not filter yet
2. **Pick three, at most** — by numbers, see "Choosing goals by numbers" below. Everything else goes on a `someday` list, which is parked, not deleted
3. **Make each goal measurable** using the outcome formula below
4. **Find the lead habit** for each goal: the repeated action that produces the outcome. A goal with no habit is a wish
5. **Design the habit** with cue, routine and reward, and shrink it with the 2-minute rule
6. **Set up the tracker** using the template below, in `goals/YYYY-Qn.md`
7. **Weekly check (5 minutes)** inside `weekly-review`: tick last week, read the three goals, and choose the one adjustment for next week
8. **Week 6 midpoint**: is the goal on pace? If not, change the plan (step 9). Do not just try harder
9. **Failure review** when two weeks in a row are missed, or at quarter end. See the failure review section below
10. **Quarter end**: score each goal, write three lines of lessons, and carry forward or drop

## Choosing goals by numbers (`decision-desk/decision-scoring`, command `knapsack`)

1. **Budget = real free hours per week**, not wished-for hours: 168 minus sleep, work, commute, family and chores, as the user counts it from last week's calendar. Write that number first.
2. **For each brain-dump item** give: cost = hours per week it needs; value = **impact × desire**, each 1–5 by the user (impact = how much life changes if it happens; desire = how much the user wants it, not how much they should). Value is 1–25.
3. **Iron rules:** an item with a fixed deadline outside the user's control (an exam date, a tax filing) goes in with `"must": true`. Cost over the whole budget → cut or shrink the item.
4. **Run:** `node decide.mjs knapsack goals.json` — it tries every set and returns the best one for the budget · put `"max_items": 3` in the file so it never picks more than three goals. 

Example input (JSON for `knapsack`) and the result when run: [references/tracker-template.md](tracker-template.md)
5. A close call (the "ชุดรองลงมา" line in the result is under 10% behind the best set, starting value, not yet measured; the line appears only with 20 items or fewer) or a goal the user refuses → the user decides. Impact and desire are the user's own scores; the tool only does the arithmetic. Time budget and scores are starting value, not yet measured until a quarter of weekly checks shows the real hours.

## Outcome formula

> **Verb + measurable result + by date + measured how**

| Vague | Measurable |
|---|---|
| Get fit | Run 5 km under 35 minutes by 31 Dec, timed on the running app |
| Save more | Have ฿60,000 in the emergency account by 31 Dec, checked on the bank app on the 1st of each month |
| Learn English | Finish 60 lessons and hold a 10-minute call with a tutor without switching to Thai by 31 Dec |
| Read more | Finish 6 books by 31 Dec, logged in `reading.md` |

Rule: the user must be able to say **yes or no** on the date. "Better" and "more" are not outcomes.

## Habit design

| Part | Question | Example (run 5 km) |
|---|---|---|
| **Cue** | After what existing thing, or at what time and place? | "After I drop the kids at school on Mon, Wed and Fri" |
| **Routine** | What exactly? | Put on running shoes and run/walk 20 minutes |
| **Reward** | What feels good right after? | The podcast episode I only allow myself while running, plus the tick on the tracker |
| **2-minute version** | What is the bad-day minimum that still counts? | Put on running shoes and walk to the end of the street |

- **The 2-minute rule**: a new habit starts as something that takes 2 minutes or less. On bad days, the 2-minute version counts as done. Showing up is the habit; the volume comes later
- **Habit stacking**: "After [current habit], I will [new habit]." Attach the new habit to something that already happens every day
- **Make it easy, and make the alternative hard**: shoes by the door; the phone charger in the living room, not the bedroom
- **Never miss twice**: one miss is normal; two misses in a row is the start of a new habit of not doing it

## Tracker template

Markdown template (quarter goals table + weekly log): [references/tracker-template.md](tracker-template.md)

## Failure review (blame-free, 10 minutes)

1. **What happened?** The facts only: how many days were done out of how many planned
2. **When did it break?** Which day of the week, and what was different about it (travel, overtime, a sick child)
3. **Which part failed?** The cue never came / the routine was too big / there was no reward / the goal was not really wanted
4. **One change** for the part that failed: a new cue, a smaller routine, or a better reward. If the goal was not wanted, drop it openly and record why
5. Write the review in the quarter file under `## Reviews`

## Worked example

Save ฿60,000 in the emergency account by 31 Dec (cue · routine · reward · week 6 review and failure review): [references/worked-example.md](worked-example.md)

## Rules

- Measure the habit weekly and the outcome monthly. Daily outcome-watching discourages people
- Never shame a slip. Change the system first, then the goal
- Health goals: set the habit and the measurement; ask a doctor before strict diets or intense training

Related: `weekly-review` (the weekly check), `decision-journal.md` (drop or continue), `budget-and-debt` in `trading-finance` (money goals), `learning-path` (learning goals).


## reference: scoring-example.md

# decision-journal — examples and templates

## Example input for `payoff` and the result

```json
{"better":"high","options":["stay at A","take B","negotiate at A"],
 "scenarios":[{"name":"B bonus 0 months","p":0.3},{"name":"B bonus 1 month","p":0.4},{"name":"B bonus 2 months","p":0.3}],
 "table":{"stay at A":[624000,624000,624000],"take B":[720000,780000,840000],"negotiate at A":[672000,672000,672000]}}
```

Result when run: take B has the best expected value (780,000), the best worst case (720,000) and regret 0. That is only year-1 pay; growth, commute and the PVD loss go into a `score` run. Expected value and score disagree, or two options are close (`สูสี`) → the user decides, and writes why in the entry. Money and life decisions: supporting data, not advice.

## Worked example — full dated entry with revisit

## Worked example

**2026-10-06 — Accept the job offer at Company B, start 1 Dec 2026.** One-way-ish door (can return to market, cannot return to A).

Options: stay at A (52,000/month) · take B (60,000) · negotiate A counter-offer.
Facts: B base +15%; B bonus 0–2 months (no history known); A PVD match 5% vested after 5 years — I am at year 4, leaving forfeits about 125,000 plus returns (5% × 52,000 × 12 × 4 years; รอยืนยัน with HR); commute B 25 min shorter.
Reasoning: growth in role (8), salary (5), commute (9).
Pre-mortem: B's team lead leaves; bonus is zero. Early warning: no clear role scope by week 6.
Prediction: by 2027-06-01, leading one project, total pay ≥ A's last year, more evenings free.
State: excited. Revisit: 2027-06-01.

Revisit (2027-06-01): leading a project ✓, bonus 0.5 month, evenings ✓. Verdict: reasoning good / outcome good. Lesson: ask for bonus history in writing at offer stage next time.


## reference: tracker-template.md

# goal-and-habit — examples and templates

## Example input for `knapsack` and the result

```json
{"budget":6,"max_items":3,"items":[{"name":"Run 5 km","cost":3,"value":12},{"name":"Emergency fund 60,000","cost":1,"value":20},{"name":"English 60 lessons","cost":4,"value":15},{"name":"Read 6 books","cost":2,"value":6}]}
```

Result when run: emergency fund + run 5 km + read 6 books (6 of 6 hours, total value 38); English is the one parked on `someday`.

## Tracker template

## Tracker template

```markdown
# 2026-Q4 goals (1 Oct – 31 Dec)

| # | Goal (outcome formula) | Lead habit | 2-min version | Target/week |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Weekly log
| Week | Goal 1 habit (✔/✖ per day) | Goal 2 | Goal 3 | Outcome number now | Adjustment |
|---|---|---|---|---|---|
| W40 | ✔✖✔ | | | | |
```


## reference: worked-example.md

# Worked example · goal-and-habit

- Goal: "Save ฿60,000 in the emergency account by 31 Dec 2026, checked on the 1st of each month"
- Lead habit: move money on payday before spending. Cue: the salary notification. Routine: transfer ฿20,000. Reward: update the progress bar in the tracker
- 2-minute version (bad-day minimum): transfer any amount, even ฿100, so the habit stays alive
- Week 6 review: October ฿20,000 ✔, November only ฿8,000 (an unplanned car repair). Failure review: the routine worked, but there was no buffer. Change: lower to ฿15,000 a month and add December's bonus. Still on pace if the bonus is ≥ ฿17,000 (60,000 − 28,000 − 15,000 for December)
