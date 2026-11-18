# skill: learning-path

Use when learning a new language or framework properly, or turning a paper, RFC or article into a working example

# Learning Path

Learn on your own real project, in small wins.

Paper, RFC or article → follow [references/paper-to-practice.md](references/paper-to-practice.md) (brief, smallest runnable example, run, one-page note) instead of the steps below.

**Hard rules (paper flow):** Run the example for real. If it cannot run, say why and what was tried. Build only the smallest program that shows the core idea.
If infrastructure is lacking, use a simulation and say so. Credit the paper with title, authors and date.

Not for: a certification exam → `cert-prep` · choosing a practice or portfolio project → `side-project-picker`.

## Steps

1. **Goal and depth** — what "learned" means here (skim, working knowledge or mastery) and why. Choose the depth out loud. Then **check the hours against the real week** ("สัปดาห์ปกติมีอะไรอยู่แล้วบ้าง") and ask whether this path **adds to or replaces** a course the user already follows; never two syllabi at once. Same checks as `cert-prep` step 4
2. **Baseline check** — 10 quick questions to find what the user already knows. Skip everything they already know
3. **Milestones** — 4–7 steps, each: concept → tiny exercise → applied to the user's real project. Each step takes under 2 hours
4. **Anchoring rule** — at least half the milestones modify or extend something the user already owns, not toy examples
5. **Checkpoints** — after milestone 3 and at the end: can the user do the thing without help? If not, go back. If yes, the path ends even if topics remain. The rest is reference material

## Template

Use [references/path-template.md](references/path-template.md) for the plan file and the `learning-log.md` entry. The paper flow has its own steps in [references/paper-to-practice.md](references/paper-to-practice.md); its worked example (bloom filter) is a separate file, [references/bloom-filter-example.md](references/bloom-filter-example.md). A full worked example (Docker to working knowledge, with milestone table and checkpoints) is in [references/worked-example.md](references/worked-example.md); open it before writing the first milestone table.

## Rules

- The path ends on competence, not exhaustion — knowing when you know enough is the skill
- Each milestone's deliverable is visible in the project (a feature, a refactor, a test)
- Re-plan freely when reality differs from the plan. The path serves the learner
- Record finished paths in a `learning-log.md` with dates — future-you will want the map

## เรียกเป็นคำสั่ง

`/personal-life:learning-path <technology or paper> [--depth skim|working|mastery]`

With `--depth` or a technology: run the steps above. With a paper, RFC, or article: follow `references/paper-to-practice.md`. Both with the `tech-mentor` agent: **$ARGUMENTS**

Every path ends in something runnable in the user's own project.


## reference: bloom-filter-example.md

# Worked example — bloom filters, from the original idea to running code

## Worked example — "bloom filters" from the original idea to running code

1. **Brief** — Problem: test membership in a huge set without storing the set. Core idea: k hash functions set k bits in an m-bit array; a lookup checks the k bits. It can say "maybe present" wrongly (a false positive) but never "absent" wrongly. Beats a hash set on memory. Limitation: no deletion in the basic form; the false-positive rate grows as it fills
2. **Scope** — 1 class, `add` and `might_contain`, and a measurement of the false-positive rate
3. **Build** (standard library only):

```python
import hashlib, math

class Bloom:
    def __init__(self, n, p):                      # n items expected, p target false-positive rate
        self.m = math.ceil(-n * math.log(p) / math.log(2) ** 2)
        self.k = max(1, round(self.m / n * math.log(2)))
        self.bits = bytearray(self.m)
    def _idx(self, item):
        for i in range(self.k):
            h = hashlib.sha256(f"{i}:{item}".encode()).digest()
            yield int.from_bytes(h[:8], "big") % self.m
    def add(self, item):
        for j in self._idx(item): self.bits[j] = 1
    def might_contain(self, item):
        return all(self.bits[j] for j in self._idx(item))

b = Bloom(n=10_000, p=0.01)
for i in range(10_000): b.add(f"user{i}")
fp = sum(b.might_contain(f"other{i}") for i in range(10_000)) / 10_000
print(f"m={b.m} bits, k={b.k}, measured false-positive rate={fp:.3%}")
```

4. **Run and verify** — the formula predicts about 1%; the measured rate should land close to it (around 1%). Paste the actual output into the note; m ≈ 95,851 bits — about 94 KB as written (`bytearray` uses 1 byte per bit; a real bit array would be about 12 KB) versus storing 10,000 strings
5. **Note** — where it applies: "have we already sent this notification?", cache pre-checks. Where it does not: anything that needs deletion or exact answers


## reference: paper-to-practice.md

# Paper to Practice

Open when the user brings a paper, RFC or article and wants to apply it. From "I read it" to "it runs on my machine". Used with the `tech-mentor` agent.

Not for: only understanding English wording in a paper or RFC → `english-tech-reading` · writing it up as a thesis or report → `thesis-writing`.

## Steps

1. **Brief** — the problem, the core idea in 1 paragraph, why it beats the alternative, and 1 line on limitations the authors admit
2. **Scope the example** — the smallest program that shows the core idea. Do not reproduce the whole paper
3. **Build it** — runnable code in the user's language of choice, standard library first, at most 1 dependency unless the idea needs more
4. **Run and verify** — actually run it. The output is part of the deliverable
5. **Note** — 1 page: the idea, the example, where it applies in the user's world, where it does not

Worked example — "bloom filters" from the original idea to running code (brief → scope → Python code → run → note): [bloom-filter-example.md](bloom-filter-example.md)

## Template

Use [practice-note-template.md](practice-note-template.md) for the one-page note.

## Rules

- The example runs, or the deliverable says why it could not and what was tried
- Turn math into code or concrete numbers. A formula nobody calculated teaches nothing
- Credit the source with title, authors, and date in the note
- Thai wording in the note passes the EN→TH checklist in `english-tech-reading` `references/decode-template.md` (`human-writing` `references/thai-grammar.md` section 7)
- If the core idea needs infrastructure the user lacks, use a simulation instead and say so


## reference: path-template.md

# Learning path template

Save as `learning/<topic>-path.md`.

```markdown
# <Topic> — learning path
Goal: <what I can do at the end, in one sentence>
Why: <the project or job reason>
Depth: skim | working | mastery
Time budget: <hours/week> × <weeks>
Started: <YYYY-MM-DD>

## Baseline (10 questions, ✔ = already know)
1. [ ] ...
...

## Milestones
| # | Concept | Tiny exercise (≤ 30 min) | Applied to my project | Done when | Est. h | Actual h |
|---|---|---|---|---|---:|---:|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| ✔ | Checkpoint: <what I must do unaided> | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| ✔ | Final checkpoint: <what I must do unaided> | | | | | |

## Parked for later (reference only)
- 
```

## `learning-log.md` entry

```markdown
## <YYYY-MM-DD> — <Topic> (<depth>) — finished | stopped
- Result: <what now runs in my project, with a link>
- Hours: <actual> (planned <x>)
- Next: <follow-up, or "none">
```


## reference: practice-note-template.md

# Practice note template (one page)

Save as `notes/<short-title>.md`.

~~~markdown
# <Idea name>
Source: <title> — <authors>, <venue/RFC/blog>, <date> · <link>
Read on: <YYYY-MM-DD>

## Problem (1–2 sentences)

## Core idea (one paragraph, no formulas without numbers)

## Why it beats the alternative
| | This idea | Usual alternative |
|---|---|---|
| Memory / speed / accuracy | | |

## Limitations (as the authors state them)

## Minimal example
- Path: `examples/<name>/`
- Run: `<command>`
- Output (pasted from an actual run):
```
<output>
```

## Where it applies in my work
## Where it does not
~~~


## reference: worked-example.md

# Worked example · learning-path

## Docker to working knowledge, anchored to the user's project

Goal: "run my Flask expense app and its Postgres with one command on any machine". Depth: **working**. Baseline: has used `docker run`, never written a Dockerfile.

| # | Concept | Tiny exercise (≤ 30 min) | Applied to the real project | Done when | Hours |
|---|---|---|---|---|---:|
| 1 | Image vs container, layers | Build the official Python image tutorial | Write a Dockerfile for the Flask app | `docker run` serves the home page | 1.5 |
| 2 | Layer caching, `.dockerignore` | Reorder COPY lines and time two builds | Cut rebuild time of the app | Rebuild after a code change < 10 s | 1 |
| 3 | Volumes and networks | Run Postgres with a named volume | App connects to Postgres in a container | Data survives `docker rm` | 1.5 |
| ✔ | **Checkpoint**: explain image/container/volume without notes; rebuild from scratch unaided | | | | |
| 4 | Compose | Two-service compose file | `docker compose up` runs app + DB | One command from a fresh clone | 1.5 |
| 5 | Config and secrets | `.env` + compose `env_file` | Remove the hard-coded DB password | No secret in git | 1 |
| ✔ | **Final checkpoint**: a teammate runs it from the README alone | | | | |

Stopped after 5 milestones (6.5 hours). Kubernetes was out of scope for "working" depth and went to the reference list.
