# from diagram-figures/assets/mermaid-engine
"""Gantt layout: one row per task, bars on a week grid, months on top, milestones as a square flag."""
import datetime as dt
import theme as T
import svgkit as K

W, M = T.SHEET_W, T.MARGIN
ROW, SEC = 34, 30


def layout(model):
    tasks = [t for s in model["sections"] for t in s["tasks"]]
    first = min(t["start"] for t in tasks)
    last = max(t["end"] for t in tasks)
    g0 = first - dt.timedelta(days=first.weekday())                 # Monday on or before
    weeks = ((last - g0).days + 7) // 7 + 1
    label_w = max(K.text_w(t["name"], T.FS) for t in tasks) + 28
    x0, x1 = M + label_w, W - M
    wk = (x1 - x0) / weeks

    def X(d):
        return x0 + (d - g0).days / 7 * wk

    top = 30
    head = 2 * K.lh(12) + 8
    rows = sum(len(s["tasks"]) for s in model["sections"])
    y_end = top + head + rows * ROW + len(model["sections"]) * SEC + 8
    o = []
    # week grid and month labels
    for i in range(weeks + 1):
        d = g0 + dt.timedelta(weeks=i)
        o.append(K.vline(x0 + i * wk, top + head - 4, y_end, "#EEF1F6", 1))
        if d.day <= 7 and x0 + i * wk + 6 + K.text_w(d.strftime("%b %Y"), 12, True) <= x1:
            o.append(K.vline(x0 + i * wk, top, y_end, T.FRAME, 1))
            o.append(K.text_block(x0 + i * wk + 6, top, [d.strftime("%b %Y")], 12, True, fill=T.INK, anchor="start"))
        if i % 2 == 0 and i < weeks:
            o.append(K.text_block(x0 + i * wk + wk / 2, top + K.lh(12) + 4, [str(d.day)], 10.5, fill=T.MUTED))
    o.append(K.hline(M, x1, top + head - 4, T.FRAME, 1))
    y = top + head
    for s in model["sections"]:
        o.append(K.rect(M, y + 4, x1 - M, SEC - 8, fill=K.tint(T.ACCENT, .96), stroke="none"))
        o.append(K.text_block(M + 10, y + (SEC - K.lh(12)) / 2, [s["name"]], 12, True, fill=K.ACCENT_INK, anchor="start"))
        y += SEC
        for t in s["tasks"]:
            ty = y + (ROW - K.lh()) / 2
            o.append(K.text_block(M + 10, ty, [t["name"]], T.FS, anchor="start"))
            cy = y + ROW / 2
            if t["milestone"]:
                mx = X(t["start"])
                o.append(K.vline(mx, y + 4, y + ROW - 4, T.ACCENT, 2))
                o.append(K.rect(mx, y + 5, 12, 10, fill=T.ACCENT, stroke=T.ACCENT))
                o.append(K.text_block(mx - 8, ty, [t["start"].strftime("%d %b %Y")], 12, True, fill=K.ACCENT_INK, anchor="end"))
            else:
                bx, bw = X(t["start"]), max(X(t["end"]) - X(t["start"]), 4)
                o.append(K.rect(bx, cy - 9, bw, 18, fill="url(#wg)", stroke="none"))
            o.append(K.hline(M, x1, y + ROW, "#F1F3F7", 1))
            y += ROW
    if model["title"]:
        note = model["title"]
        if "(" in note:
            note = note[note.index("(") + 1:].rstrip(")")
            note = note[0].upper() + note[1:] + "."
        o.append(K.text_block(M, y_end + 8, K.wrap(note, W - 2 * M, 12), 12, fill=T.MUTED, anchor="start", italic=True))
        y_end += 8 + K.lh(12)
    h = y_end + 24
    return K.sheet(W, h, "".join(o), dots=False), W, h
