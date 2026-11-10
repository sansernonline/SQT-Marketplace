#!/usr/bin/env python3
"""Compare the deals of two MetaTrader 5 Strategy Tester runs — the original
.ex5 and the MQL5 rewrite — on the same symbol, period, dates and tick mode.
A deal matches when symbol and side (buy/sell) agree and the times are within
a tolerance. Pure stdlib; reads only the two files it is given.

Input per file (auto-detected):
  - Strategy Tester HTML report (the Deals table; UTF-16 or UTF-8)
  - CSV with a header row holding Time, Symbol, Type, Direction (Volume, Price optional)

Usage:
  python compare_trades.py original.html rewrite.html
  python compare_trades.py a.csv b.csv --tolerance 60 --leg in --threshold 90
  python compare_trades.py a.html b.html --json
  python compare_trades.py --self-test
Exit code: 0 ok · 1 match % below --threshold · 2 input problem
"""

import argparse
import csv
import io
import json
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

SIDES = {"buy", "sell"}
FIELDS = ("time", "symbol", "type", "direction", "volume", "price")


def read_text(path):
    raw = Path(path).read_bytes()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return raw.decode("utf-16")
    if raw[:3] == b"\xef\xbb\xbf":
        return raw[3:].decode("utf-8")
    if b"\x00" in raw[:200]:  # UTF-16 without BOM
        return raw.decode("utf-16-le")
    return raw.decode("utf-8", errors="replace")


class Tables(HTMLParser):
    """Collect every table row as a list of cell texts."""

    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell = [], None, None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)


def rows_from_html(text):
    """Rows after the header that has Deal + Direction, until the cell count changes."""
    parser = Tables()
    parser.feed(text)
    out, header = [], None
    for row in parser.rows:
        names = [c.strip().lower() for c in row]
        if header is None:
            if "deal" in names and "direction" in names and "time" in names:
                header = names
            continue
        if len(row) != len(header):
            if out:
                break
            continue
        out.append(dict(zip(header, row)))
    return out


def rows_from_csv(text):
    sample = text[:2048]
    dialect = csv.Sniffer().sniff(sample, delimiters=",;\t") if sample.strip() else csv.excel
    return [{(k or "").strip().lower(): (v or "").strip() for k, v in r.items()}
            for r in csv.DictReader(io.StringIO(text), dialect=dialect)]


def parse_time(value):
    for fmt in ("%Y.%m.%d %H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y.%m.%d %H:%M", "%Y-%m-%d %H:%M",
                "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            pass
    raise ValueError(f"unknown time format: {value!r}")


def number(value):
    try:
        return float(value.replace(" ", "").replace(",", ""))
    except (AttributeError, ValueError):
        return None


def load_deals(path, leg):
    text = read_text(path)
    rows = rows_from_html(text) if "<table" in text.lower() else rows_from_csv(text)
    if not rows:
        raise SystemExit(f"{path}: no deal rows found (need the Deals table or a CSV header)")
    missing = [f for f in ("time", "symbol", "type") if f not in rows[0]]
    if missing:
        raise SystemExit(f"{path}: missing columns {missing}; header has {sorted(rows[0])}")
    deals = []
    for r in rows:
        side = r.get("type", "").lower()
        direction = r.get("direction", "in").lower() or "in"
        if side not in SIDES:  # balance, credit, commission rows
            continue
        if leg != "all" and direction not in (leg, "inout"):
            continue
        deals.append({"time": parse_time(r["time"]), "symbol": r["symbol"].upper(), "type": side,
                      "direction": direction, "volume": number(r.get("volume")),
                      "price": number(r.get("price"))})
    return sorted(deals, key=lambda d: d["time"])


def match(a, b, tolerance):
    """Greedy nearest-in-time pairing; each deal of b is used once."""
    used, pairs, only_a = set(), [], []
    for da in a:
        best = None
        for i, db in enumerate(b):
            if i in used or db["symbol"] != da["symbol"] or db["type"] != da["type"]:
                continue
            gap = abs((db["time"] - da["time"]).total_seconds())
            if gap <= tolerance and (best is None or gap < best[1]):
                best = (i, gap)
        if best is None:
            only_a.append(da)
        else:
            used.add(best[0])
            pairs.append((da, b[best[0]], best[1]))
    only_b = [db for i, db in enumerate(b) if i not in used]
    return pairs, only_a, only_b


def summarize(a, b, pairs, only_a, only_b):
    total = max(len(a), len(b)) or 1
    gaps = sorted(g for _, _, g in pairs)
    same_volume = sum(1 for x, y, _ in pairs if x["volume"] is not None and x["volume"] == y["volume"])
    price_gaps = [abs(x["price"] - y["price"]) for x, y, _ in pairs
                  if x["price"] is not None and y["price"] is not None]
    return {
        "deals_a": len(a), "deals_b": len(b), "matched": len(pairs),
        "only_a": len(only_a), "only_b": len(only_b),
        "match_pct": round(100 * len(pairs) / total, 1),
        "same_volume_pct": round(100 * same_volume / len(pairs), 1) if pairs else 0.0,
        "median_gap_s": gaps[len(gaps) // 2] if gaps else None,
        "mean_price_gap": round(sum(price_gaps) / len(price_gaps), 6) if price_gaps else None,
    }


def fmt(d):
    return f'{d["time"]:%Y.%m.%d %H:%M:%S} {d["symbol"]} {d["type"]} {d["direction"]} {d["volume"]} @ {d["price"]}'


def self_test():
    import tempfile
    head = "Time,Deal,Symbol,Type,Direction,Volume,Price\n"
    a_csv = head + ("2024.01.02 00:00:00,1,,balance,,,\n"
                    "2024.01.02 10:00:00,2,EURUSD,buy,in,0.10,1.10000\n"
                    "2024.01.02 12:00:00,3,EURUSD,sell,out,0.10,1.10200\n"
                    "2024.01.03 09:00:00,4,EURUSD,sell,in,0.10,1.09500\n"
                    "2024.01.04 15:00:00,5,EURUSD,buy,in,0.20,1.09000\n")
    b_csv = head + ("2024.01.02 10:00:30,7,EURUSD,buy,in,0.10,1.10003\n"
                    "2024.01.03 09:05:00,8,EURUSD,sell,in,0.10,1.09550\n"
                    "2024.01.05 11:00:00,9,EURUSD,buy,in,0.10,1.08000\n")
    cells = lambda tag, vals: "<tr>" + "".join(f"<{tag}>{v}</{tag}>" for v in vals) + "</tr>"
    html = ("<html><body><table>" + cells("td", ["Orders"])
            + cells("th", ["Time", "Deal", "Symbol", "Type", "Direction", "Volume", "Price"])
            + cells("td", ["2024.01.02 10:00:30", "7", "EURUSD", "buy", "in", "0.10", "1.10003"])
            + cells("td", ["2024.01.03 09:05:00", "8", "EURUSD", "sell", "in", "0.10", "1.09550"])
            + cells("td", ["2024.01.05 11:00:00", "9", "EURUSD", "buy", "in", "0.10", "1.08000"])
            + cells("td", ["", "", "", "", "", "0.30", "Total"]) + "</table></body></html>")
    with tempfile.TemporaryDirectory() as tmp:
        pa, pb, ph = Path(tmp, "a.csv"), Path(tmp, "b.csv"), Path(tmp, "b.html")
        pa.write_text(a_csv, encoding="utf-8")
        pb.write_text(b_csv, encoding="utf-8")
        ph.write_text(html, encoding="utf-16")  # tester reports are often UTF-16
        a, b, h = load_deals(pa, "in"), load_deals(pb, "in"), load_deals(ph, "in")
        assert len(a) == 3 and len(b) == 3, (len(a), len(b))  # balance row and exit skipped
        assert [fmt(x) for x in b] == [fmt(x) for x in h], "HTML and CSV parse differently"
        pairs, only_a, only_b = match(a, b, 60)  # 09:05 is 300 s away -> not a match
        s = summarize(a, b, pairs, only_a, only_b)
        assert (s["matched"], s["only_a"], s["only_b"], s["match_pct"]) == (1, 2, 2, 33.3), s
        pairs, only_a, only_b = match(a, b, 600)
        s = summarize(a, b, pairs, only_a, only_b)
        assert (s["matched"], s["match_pct"], s["same_volume_pct"]) == (2, 66.7, 100.0), s
        assert len(load_deals(pa, "all")) == 4
    print("self-test ok")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("original", nargs="?", help="report or CSV from the original .ex5")
    ap.add_argument("rewrite", nargs="?", help="report or CSV from the rewrite")
    ap.add_argument("--tolerance", type=float, default=60, help="max seconds between matching deals (60)")
    ap.add_argument("--leg", choices=("in", "out", "all"), default="in", help="entries, exits or both (in)")
    ap.add_argument("--threshold", type=float, help="exit 1 when match %% is below this")
    ap.add_argument("--list", type=int, default=20, help="unmatched deals to print per side (20)")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--self-test", action="store_true", help="run built-in checks and exit")
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    if not (args.original and args.rewrite):
        ap.error("give <original> <rewrite>, or --self-test")
    try:
        a, b = load_deals(args.original, args.leg), load_deals(args.rewrite, args.leg)
    except (OSError, ValueError) as err:
        print(f"input problem: {err}")
        raise SystemExit(2)

    pairs, only_a, only_b = match(a, b, args.tolerance)
    s = summarize(a, b, pairs, only_a, only_b)
    s.update(tolerance_s=args.tolerance, leg=args.leg)
    if args.json:
        s["only_original"] = [fmt(d) for d in only_a]
        s["only_rewrite"] = [fmt(d) for d in only_b]
        print(json.dumps(s, indent=2, ensure_ascii=False))
    else:
        print(f"deals ({args.leg}): original={s['deals_a']} rewrite={s['deals_b']} matched={s['matched']} "
              f"-> match {s['match_pct']}% (time within {args.tolerance:g}s, same symbol and side)")
        print(f"same volume among matched: {s['same_volume_pct']}% · median time gap: {s['median_gap_s']}s "
              f"· mean price gap: {s['mean_price_gap']}")
        for title, rows in (("only in original", only_a), ("only in rewrite", only_b)):
            print(f"\n--- {title}: {len(rows)} (showing {min(len(rows), args.list)}) ---")
            for d in rows[:args.list]:
                print(fmt(d))
    if args.threshold is not None and s["match_pct"] < args.threshold:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
