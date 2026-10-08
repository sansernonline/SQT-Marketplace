---
name: paper-to-practice
description: Use when the user wants to understand and apply a paper, RFC or long technical article. Minimal working example plus a plain-language brief.
---

# Paper to Practice

From "I read it" to "it runs on my machine".

## Steps

1. **Brief** — the problem, the core idea in 1 paragraph, why it beats the alternative, and 1 line on limitations the authors admit
2. **Scope the example** — the smallest program that shows the core idea. Do not reproduce the whole paper
3. **Build it** — runnable code in the user's language of choice, standard library first, at most 1 dependency unless the idea needs more
4. **Run and verify** — actually run it. The output is part of the deliverable
5. **Note** — 1 page: the idea, the example, where it applies in the user's world, where it does not

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

4. **Run and verify** — the formula predicts about 1%; the measured rate should land close to it (around 1%). Paste the actual output into the note; m ≈ 95,851 bits ≈ 12 KB versus storing 10,000 strings
5. **Note** — where it applies: "have we already sent this notification?", cache pre-checks. Where it does not: anything that needs deletion or exact answers

## Template

Use [references/practice-note-template.md](references/practice-note-template.md) for the one-page note.

## Rules

- The example runs, or the deliverable says why it could not and what was tried
- Turn math into code or concrete numbers. A formula nobody calculated teaches nothing
- Credit the source with title, authors, and date in the note
- If the core idea needs infrastructure the user lacks, use a simulation instead and say so
