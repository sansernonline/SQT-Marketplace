# from diagram-figures/assets/mermaid-engine
"""Mermaid gantt -> sections of tasks with real start and end dates."""
import datetime as dt
import re

TAGS = {"milestone", "done", "active", "crit"}


def _date(s):
    return dt.date.fromisoformat(s.strip())


def parse(src):
    title, sections, tasks = "", [], {}
    for raw in src.splitlines():
        s = raw.strip()
        if not s or s.startswith("%%") or s == "gantt" or s.startswith(("dateFormat", "axisFormat", "excludes", "todayMarker")):
            continue
        if s.startswith("title"):
            title = s[5:].strip()
            continue
        if s.startswith("section"):
            sections.append({"name": s[7:].strip(), "tasks": []})
            continue
        m = re.match(r"^(.*?)\s*:\s*(.*)$", s)
        if not m:
            raise ValueError(f"unknown gantt line: {s}")
        name, parts = m.group(1), [p.strip() for p in m.group(2).split(",")]
        tags = [p for p in parts if p in TAGS]
        rest = [p for p in parts if p not in TAGS]
        tid = rest.pop(0) if len(rest) == 3 else None
        start_s, end_s = rest
        if start_s.startswith("after"):
            start = max(tasks[x]["end"] for x in start_s.split()[1:])
        else:
            start = _date(start_s)
        d = re.match(r"^(\d+)([dw])$", end_s)
        end = start + dt.timedelta(days=int(d.group(1)) * (7 if d.group(2) == "w" else 1)) if d else _date(end_s)
        t = {"name": name, "id": tid, "start": start, "end": end, "milestone": "milestone" in tags}
        if tid:
            tasks[tid] = t
        sections[-1]["tasks"].append(t)
    return {"title": title, "sections": sections}
