# from diagram-figures/assets/mermaid-engine
"""Checks on a finished SVG: every connector runs horizontal or vertical; the only bends are
quarter-circle elbows (A commands with equal x and y travel)."""
import re

NUM = r"-?\d+(?:\.\d+)?"
CMD = re.compile(rf"([MLA])\s*((?:{NUM}[\s,]*)+)")


def orthogonal(svg):
    problems = []
    for d in re.findall(r'<path class="wire" d="([^"]+)"', svg):
        if re.search(r"[^MLA\d.,\s-]", d):
            problems.append(f"curve command in path {d[:40]}")
        cur = None
        for c, args in CMD.findall(d):
            v = [float(n) for n in re.findall(NUM, args)]
            x, y = v[-2], v[-1]
            if c == "L" and cur and abs(cur[0] - x) > .05 and abs(cur[1] - y) > .05:
                problems.append(f"diagonal segment {cur[0]},{cur[1]} -> {x},{y}")
            if c == "A" and cur and (abs(abs(x - cur[0]) - v[0]) > .2 or abs(abs(y - cur[1]) - v[0]) > .2):
                problems.append(f"elbow is not a quarter circle at {cur[0]},{cur[1]}")
            cur = (x, y)
    for x1, y1, x2, y2 in re.findall(rf'<line class="wire" x1="({NUM})" y1="({NUM})" x2="({NUM})" y2="({NUM})"', svg):
        if x1 != x2 and y1 != y2:
            problems.append(f"diagonal line {x1},{y1} -> {x2},{y2}")
    return problems


def count_wires(svg):
    return len(re.findall(r'class="wire"', svg))


WARN = []   # filled by the layouts, read by build.py


def _hit(a, b, pad=1):
    return a[0] < b[2] - pad and b[0] < a[2] - pad and a[1] < b[3] - pad and b[1] < a[3] - pad


def label_clear(labels, boxes, segments):
    """labels: (edge_id, rect) · boxes: rect · segments: (edge_id, (x0,y0,x1,y1)).
    A label may sit on its own edge (it is drawn on a white plate) but not on a box,
    another edge or another label. Records problems in WARN."""
    for i, (eid, l) in enumerate(labels):
        if any(_hit(l, b) for b in boxes):
            WARN.append(f"label {i} overlaps a box")
        for sid, s in segments:
            seg = (min(s[0], s[2]) - 1, min(s[1], s[3]) - 1, max(s[0], s[2]) + 1, max(s[1], s[3]) + 1)
            if sid != eid and _hit(l, seg, 0):
                WARN.append(f"label {i} of {eid} sits on line of {sid} at {[round(v) for v in s]}")
                break
        for j, (_, o) in enumerate(labels[:i]):
            if _hit(l, o):
                WARN.append(f"labels {j} and {i} overlap")


def self_test():
    """python check.py --self-test: small SVG strings with one known fault each"""
    good = ('<path class="wire" d="M 10 10 L 50 10 A 8 8 0 0 1 58 18 L 58 80"/>'
            '<line class="wire" x1="5" y1="5" x2="5" y2="90"/>')
    assert orthogonal(good) == [] and count_wires(good) == 2
    assert any("diagonal segment" in p for p in orthogonal('<path class="wire" d="M 0 0 L 30 40"/>'))
    assert any("not a quarter circle" in p for p in orthogonal('<path class="wire" d="M 0 0 A 8 8 0 0 1 20 20"/>'))
    assert any("curve command" in p for p in orthogonal('<path class="wire" d="M 0 0 C 5 5 9 9 20 20"/>'))
    assert any("diagonal line" in p for p in orthogonal('<line class="wire" x1="0" y1="0" x2="9" y2="9"/>'))
    WARN.clear()
    label_clear([("e1", (0, 0, 20, 10))], [(100, 100, 120, 120)], [("e1", (0, 5, 50, 5))])   # on its own edge: allowed
    assert WARN == [], WARN
    label_clear([("e1", (0, 0, 20, 10)), ("e2", (10, 0, 30, 10))], [(0, 0, 20, 10)], [("e3", (0, 5, 50, 5))])
    assert any("overlaps a box" in w for w in WARN) and any("sits on line of e3" in w for w in WARN)
    assert any("labels 0 and 1 overlap" in w for w in WARN), WARN
    WARN.clear()
    print("self-test ok")


if __name__ == "__main__":
    import sys
    if sys.argv[1:] == ["--self-test"]:
        self_test()
    else:
        print("usage: python check.py --self-test   (this file is imported by build.py)")
