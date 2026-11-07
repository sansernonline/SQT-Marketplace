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
