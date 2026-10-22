# from diagram-figures/assets/mermaid-engine
"""Shared drawing for ELK-laid graphs (state, ER, flowchart): edges, labels, overlap check."""
import theme as T
import svgkit as K
import check


def points(edge, ox, oy):
    out = []
    for sec in edge.get("sections", []):
        pts = [sec["startPoint"]] + sec.get("bendPoints", []) + [sec["endPoint"]]
        out.append([(p["x"] + ox, p["y"] + oy) for p in pts])
    return out


def _loop(n, side):
    """3-segment rectangular self-loop on one side of the node, kept near a corner so it
    stays clear of edges that enter the middle of that side."""
    x, y, w, h = n["x"], n["y"], n["width"], n["height"]
    if side in ("top", "bottom"):
        ey = y if side == "top" else y + h
        oy = ey - 24 if side == "top" else ey + 24
        return [(x + w - 14, ey), (x + w - 14, oy), (x + w - 52, oy), (x + w - 52, ey)]
    ex = x if side == "left" else x + w
    ox = ex - 28 if side == "left" else ex + 28
    return [(ex, y + 8), (ox, y + 8), (ox, y + h - 8), (ex, y + h - 8)]


def _segs(pts):
    return [(min(a[0], b[0]) - 2, min(a[1], b[1]) - 2, max(a[0], b[0]) + 2, max(a[1], b[1]) + 2)
            for a, b in zip(pts, pts[1:])]


def _free(rect, others):
    return not any(check._hit(rect, o, 0) for o in others)


def place_self_loops(g):
    """Pick a corner for every self-loop where loop and label hit nothing else.
    Returns the drawing's bounding box (x0, y0, x1, y1)."""
    nodes = {n["id"]: n for n in g.get("children", [])}
    taken = [(n["x"], n["y"], n["x"] + n["width"], n["y"] + n["height"]) for n in nodes.values()]
    loops = []
    for e in g.get("edges", []):
        a, b = e.get("ends") or (e["sources"][0], e["targets"][0])
        if a == b and a in nodes:
            loops.append((e, nodes[a]))
            continue
        for pts in points(e, 0, 0):
            taken += _segs(pts)
        taken += [(l["x"], l["y"], l["x"] + l["width"], l["y"] + l["height"]) for l in e.get("labels", [])]
    x0, y0, x1, y1 = 0, 0, g["width"], g["height"]
    for e, n in loops:
        labs = e.get("labels", [])
        lw = max([l["width"] for l in labs] + [0])
        lh = sum(l["height"] + 2 for l in labs)
        options = []
        for loop_side in ("top", "bottom", "right", "left"):
            pts = _loop(n, loop_side)
            xs, ys = [p[0] for p in pts], [p[1] for p in pts]
            cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            # beside a top or bottom loop the label stays clear of the node edge
            sy = {"top": max(ys) - 4 - lh, "bottom": min(ys) + 4}.get(loop_side, cy - lh / 2)
            spots = {"above": (cx - lw / 2, min(ys) - 4 - lh), "below": (cx - lw / 2, max(ys) + 4),
                     "right": (max(xs) + 8, sy), "left": (min(xs) - 8 - lw, sy)}
            order = {"top": ("above", "left", "right"), "bottom": ("below", "left", "right"),
                     "right": ("right", "above", "below"), "left": ("left", "above", "below")}[loop_side]
            loop_ok = all(_free(sg, taken[len(nodes):]) for sg in _segs(pts))
            for spot in order:
                lx, ly = spots[spot]
                rect = (lx, ly, lx + lw, ly + lh)
                options.append((not (loop_ok and _free(rect, taken)), loop_side, pts, lx, ly, rect))
        bad, _, pts, lx, ly, rect = sorted(options, key=lambda o: o[0])[0]
        e["_loop"] = pts
        for l in labs:
            l["x"], l["y"] = lx + (lw - l["width"]) / 2, ly
            ly += l["height"] + 2
        taken += [rect] + _segs(pts)
        x0, y0 = min(x0, rect[0], min(p[0] for p in pts)), min(y0, rect[1], min(p[1] for p in pts))
        x1, y1 = max(x1, rect[2], max(p[0] for p in pts)), max(y1, rect[3], max(p[1] for p in pts))
    return x0, y0, x1, y1


def origin(g, top=40):
    """Offset that centres the drawing on the sheet, self-loop labels included."""
    x0, y0, x1, y1 = place_self_loops(g)
    w = x1 - x0
    return max(T.MARGIN, (T.SHEET_W - w) / 2) - x0, top - y0, y1 - y0 + top


def draw_edges(g, ox, oy, style=lambda e: {}):
    """Returns (wires_svg, labels_svg, label_rects, segments); rects and segments carry their edge id.
    Labels sit inline on their own edge on a white plate, which breaks the line under the text."""
    wires, labs, rects, segs = [], [], [], []
    nodes = {n["id"]: n for n in g.get("children", [])}
    for e in g.get("edges", []):
        st = style(e)
        a, b = e.get("ends") or (e["sources"][0], e["targets"][0])
        if a == b and a in nodes:          # self-loop: ELK draws it tiny, use a clear 3-bend loop
            clean = [(px + ox, py + oy) for px, py in e["_loop"]]
            wires.append(K.wire(clean, **st))
            segs += [(e["id"], (p[0], p[1], q[0], q[1])) for p, q in zip(clean, clean[1:])]
            e = {**e, "sections": []}
        for pts in points(e, ox, oy):
            # drop zero-length steps ELK sometimes leaves
            clean = [pts[0]] + [p for a, p in zip(pts, pts[1:]) if p != a]
            wires.append(K.wire(clean, **st))
            segs += [(e["id"], (a[0], a[1], b[0], b[1])) for a, b in zip(clean, clean[1:])]
        for lb in e.get("labels", []):
            x, y = lb["x"] + ox, lb["y"] + oy
            lines = lb["lines"]
            size = lb.get("size", 12)
            labs.append(K.plate(x, y, lb["width"], lb["height"], border="ink" not in lb))
            labs.append(K.text_block(x + lb["width"] / 2, y + 3, lines, size, False, fill=lb.get("ink", T.TAG_INK)))
            rects.append((e["id"], (x, y, x + lb["width"], y + lb["height"])))
    return "".join(wires), "".join(labs), rects, segs


def label(text, size=12, max_w=190, **extra):
    lines = K.wrap(text, max_w, size)
    w, h = K.block_size(lines, size)
    return {"text": text, "lines": lines, "width": round(w + 10), "height": round(h + 6), "size": size,
            "layoutOptions": {"elk.edgeLabels.inline": "true"}, **extra}


def verify(rects, boxes, segs):
    check.label_clear(rects, boxes, segs)
