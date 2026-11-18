import csv, json
from decimal import Decimal

with open("data/branches.csv", encoding="utf-8", newline="") as f:
    alias = {r["alias"].strip().casefold(): r["branch"] for r in csv.DictReader(f)}

def canon(name):
    n = name.strip()
    return alias.get(n.casefold(), n)

tot, cnt = {}, {}
def add(name, satang):
    b = canon(name)
    tot[b] = tot.get(b, 0) + satang
    cnt[b] = cnt.get(b, 0) + 1

with open("data/old.json", encoding="utf-8") as f:
    for r in json.load(f)["records"]:
        if r["date"] <= "2026-09-30":
            add(r["branch"], int((Decimal(str(r["amount"])) * 100).to_integral_value()))
with open("data/new.json", encoding="utf-8") as f:
    for r in json.load(f):
        if r["status"] == "ok":
            add(r["store"], int(r["amount_satang"]))

rows = sorted(tot, key=lambda b: (-tot[b], b))
with open("summary.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f, lineterminator="\n")
    w.writerow(["branch", "orders", "total_baht"])
    for b in rows:
        w.writerow([b, cnt[b], f"{tot[b] // 100}.{tot[b] % 100:02d}"])
