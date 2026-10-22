# from diagram-figures/assets/mermaid-engine
"""Sequence layout: boxes on top, vertical lifelines, horizontal messages, titled frames.
Self-messages are a 3-segment rectangular loop. Every line is horizontal or vertical."""
import re
import theme as T
import svgkit as K

W, M = T.SHEET_W, T.MARGIN
FS, LH = T.FS, K.lh()
BADGE = 20
MAIN = re.compile(r"core|back end", re.I)


def _main_lane(model):
    for p in model["parts"]:
        if MAIN.search(p["label"]):
            return p["id"]
    count = {}
    for e in model["events"]:
        if e["kind"] == "msg":
            for k in (e["a"], e["b"]):
                count[k] = count.get(k, 0) + 1
    others = [p["id"] for p in model["parts"] if not p["actor"]] or [p["id"] for p in model["parts"]]
    return max(others, key=lambda k: count.get(k, 0))


def _cond(x, y, text):
    """Branch condition in brackets on a white plate so lifelines do not run through it."""
    t = f"[{text}]"
    return (K.rect(x, y, K.text_w(t, 12, True) + 8, K.lh(12), stroke="none")
            + K.text_block(x + 4, y, [t], 12, True, fill=T.MUTED, anchor="start"))


def layout(model):
    parts, n = model["parts"], len(model["parts"])
    slot = (W - 2 * M) / n
    cx = {p["id"]: M + slot * (i + .5) for i, p in enumerate(parts)}
    col = {p["id"]: i for i, p in enumerate(parts)}
    main = _main_lane(model)

    # participant boxes
    head_lines = {p["id"]: K.wrap(p["label"], slot - 48, FS, True) for p in parts}
    icon = 22 if any(p["actor"] for p in parts) else 0
    box_h = max(len(l) for l in head_lines.values()) * LH + 22 + icon
    top = 24
    y = top + box_h + 26

    back, fore, labels = [], [], []          # draw layers
    frames, stack, done_frames = [], [], []
    num = 0

    def touch(x0, x1):
        for f in stack:
            f["x0"], f["x1"] = min(f["x0"], x0), max(f["x1"], x1)

    for e in model["events"]:
        k = e["kind"]
        if k == "msg":
            num += 1
            a, b = cx[e["a"]], cx[e["b"]]
            color = T.STATUS["error"][0] if e["head"] == "cross" else None
            if e["a"] != e["b"]:
                span = abs(b - a)
                lines = K.wrap(e["text"], max(span - 40, 140))
                tw, th = K.block_size(lines)
                mid = (a + b) / 2
                labels.append(K.plate(mid - tw / 2 - 4, y - 1, tw + 8, th + 2))
                labels.append(K.text_block(mid, y, lines, fill=T.TAG_INK))
                ay = y + th + 8
                fore.append(K.wire([(a, ay), (b, ay)], e["dashed"], e["head"], color))
                touch(min(a, b, mid - tw / 2) - 12, max(a, b, mid + tw / 2) + 12)
            else:
                side = 1 if col[e["a"]] < n - 1 else -1
                lines = K.wrap(e["text"], slot - 56)
                tw, th = K.block_size(lines)
                tx = a + side * 16
                labels.append(K.text_block(tx, y, lines, anchor="start" if side > 0 else "end"))
                ay = y + th + 8
                lx = a + side * 40
                fore.append(K.wire([(a, ay), (lx, ay), (lx, ay + 24), (a + side * 2, ay + 24)],
                                   e["dashed"], e["head"], color))
                ext = (a + side * (16 + tw)) if tw > 24 else lx
                touch(min(a, ext, lx) - 12, max(a, ext, lx) + 12)
                ay += 24
            if model["numbered"]:
                by = ay if e["a"] != e["b"] else ay - 24
                fore.append(K.badge(a, by, num))
            y = ay + 22
        elif k == "note":
            xs = [cx[i] for i in e["ids"]]
            want = K.text_w(e["text"]) + 32
            if e["pos"] == "over":
                lo, hi = min(xs) - 40, max(xs) + 40
                if len(xs) == 1:
                    half = min(max(want, 160), slot - 20) / 2
                    lo, hi = xs[0] - half, xs[0] + half
            elif e["pos"] == "right of":
                lo, hi = xs[0] + 16, xs[0] + slot - 24
            else:
                lo, hi = xs[0] - slot + 24, xs[0] - 16
            lo, hi = max(lo, M - 20), min(hi, W - M + 20)
            lines = K.wrap(e["text"], hi - lo - 28)
            _, th = K.block_size(lines)
            fore.append(K.rect(lo, y, hi - lo, th + 18, fill=K.tint(T.SECOND, .88), stroke=K.tint(T.SECOND, .35), sw=1.2))
            fore.append(K.text_block((lo + hi) / 2, y + 9, lines))
            touch(lo - 12, hi + 12)
            y += th + 18 + 22
        elif k == "open":
            f = {"type": e["type"], "text": e["text"], "y0": y - 6, "x0": 1e9, "x1": -1e9, "seps": []}
            stack.append(f)
            frames.append(f)
            y += K.lh(11.5) + 4 + 12
        elif k == "else":
            y += 2
            stack[-1]["seps"].append((y - 6, e["text"]))
            y += K.lh(12) + 16
        elif k == "close":
            f = stack.pop()
            f["y1"] = y - 6
            head_w = K.text_w(f["type"], 11.5, True) + 14 + 12 + K.text_w(f"[{f['text']}]", 12, True) + 16
            for _, t in f["seps"]:
                head_w = max(head_w, K.text_w(f"[{t}]", 12, True) + 24)
            if f["x1"] - f["x0"] < head_w:
                f["x1"] = f["x0"] + head_w
            f["x0"] -= 4; f["x1"] += 4
            f["x0"], f["x1"] = max(f["x0"], 10), min(f["x1"], W - 10)
            touch(f["x0"] - 10, f["x1"] + 10)
            y += 14

    end_y = y
    # frames
    fr = []
    for f in frames:
        x0, x1, y0, y1 = f["x0"], f["x1"], f["y0"], f["y1"]
        fr.append(K.rect(x0, y0, x1 - x0, y1 - y0, fill="none", stroke=T.FRAME, sw=1.4))
        t, tw, th = K.tag(x0, y0, f["type"])
        fr.append(t)
        if f["text"]:
            fr.append(_cond(x0 + tw + 8, y0 + 2, f["text"]))
        for sy, txt in f["seps"]:
            fr.append(K.hline(x0, x1, sy, T.FRAME, 1.4, "6 4"))
            if txt:
                fr.append(_cond(x0 + 6, sy + 4, txt))

    # participants and lifelines
    heads, lifelines = [], []
    for p in parts:
        x = cx[p["id"]]
        lines = head_lines[p["id"]]
        tw, _ = K.block_size(lines, FS, True)
        bw = min(slot - 20, max(tw + 36, 130))
        is_main = p["id"] == main
        heads.append(K.focus_card(x - bw / 2, top, bw, box_h) if is_main else
                     K.rect(x - bw / 2, top, bw, box_h, shadow=True))
        ty = top + 11 + icon + (box_h - 22 - icon - len(lines) * LH) / 2
        if p["actor"]:
            ic = T.FOCUS_SUB if is_main else T.MUTED
            heads.append(f'<circle cx="{x:.1f}" cy="{top + 13}" r="5" fill="{ic}"/>'
                         + K.rect(x - 8, top + 20, 16, 6, fill=ic, stroke=ic))
        heads.append(K.text_block(x, ty, lines, FS, True, fill=T.FOCUS_INK if is_main else T.INK))
        lifelines.append(K.vline(x, top + box_h, end_y, K.LINE if is_main else T.LIFELINE,
                                 2 if is_main else 1.4, "5 5"))
    body = "".join(lifelines + fr + labels + fore + heads)
    return K.sheet(W, end_y + 16, body), W, end_y + 16
