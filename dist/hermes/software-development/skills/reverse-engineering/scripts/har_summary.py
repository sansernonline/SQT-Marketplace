#!/usr/bin/env python3
"""Summarise a HAR (HTTP Archive) capture: hosts, endpoints, status codes and
how requests authenticate. Pure stdlib. Nothing is replayed or fetched.

Secrets never reach the output: header, cookie and query VALUES are dropped —
only their names, and the auth scheme word (Bearer, Basic), are shown.

Usage:
  python -I har_summary.py <capture.har>
  python -I har_summary.py <capture.har> --host api.example.com   # one host only
  python -I har_summary.py --self-test
"""

import argparse
import contextlib
import io
import json
import re
import sys
import tempfile
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import parse_qsl, urlsplit

MAX_MB = 512
AUTH_HEADERS = {"authorization", "proxy-authorization", "cookie", "x-api-key", "api-key", "x-auth-token",
                "x-csrf-token", "x-xsrf-token", "x-amz-security-token", "ocp-apim-subscription-key"}
ID_SEGMENT = re.compile(r"^(\d+|[0-9a-f]{8}-[0-9a-f-]{27,}|[0-9a-f]{16,}|[A-Za-z0-9_-]{24,})$", re.I)


def template(path):
    """/users/123/orders/9f1c... → /users/{id}/orders/{id}"""
    return "/".join("{id}" if ID_SEGMENT.match(p) else p for p in path.split("/")) or "/"


def auth_of(headers):
    found = set()
    for h in headers:
        name = str(h.get("name", "")).lower()
        if name in AUTH_HEADERS or "token" in name or "secret" in name:
            if name in ("authorization", "proxy-authorization"):
                scheme = str(h.get("value", "")).split(" ", 1)[0][:20]
                found.add(f"{name}: {scheme} <redacted>")
            elif name == "cookie":
                names = sorted({c.split("=", 1)[0].strip() for c in str(h.get("value", "")).split(";") if c.strip()})
                found.add(f"cookie names: {', '.join(names[:12])}")
            else:
                found.add(f"{name}: <redacted>")
    return found


def summarize(har, host_filter=None):
    entries = har.get("log", {}).get("entries")
    if not isinstance(entries, list):
        raise ValueError("no log.entries — not a HAR file")
    hosts, statuses, auth, sets = Counter(), Counter(), Counter(), Counter()
    endpoints = defaultdict(lambda: {"count": 0, "status": Counter(), "query": set(), "types": set()})
    for e in entries:
        req, resp = e.get("request", {}), e.get("response", {})
        parts = urlsplit(str(req.get("url", "")))
        if host_filter and parts.hostname != host_filter:
            continue
        hosts[parts.hostname] += 1
        key = f"{req.get('method', '?')} {parts.scheme}://{parts.hostname}{template(parts.path)}"
        ep = endpoints[key]
        ep["count"] += 1
        ep["status"][resp.get("status")] += 1
        ep["query"].update(k for k, _ in parse_qsl(parts.query, keep_blank_values=True))
        ep["types"].add((resp.get("content", {}).get("mimeType") or "").split(";")[0])
        statuses[resp.get("status")] += 1
        for a in auth_of(req.get("headers", [])):
            auth[a] += 1
        for h in resp.get("headers", []):
            if str(h.get("name", "")).lower() == "set-cookie":
                sets[str(h.get("value", "")).split("=", 1)[0].strip()] += 1
    return {"entries": len(entries), "hosts": hosts, "statuses": statuses, "auth": auth,
            "set_cookie_names": sets, "endpoints": endpoints}


def show(s, limit):
    print(f"{s['entries']} requests in file")
    print("\nhosts:")
    for h, n in s["hosts"].most_common(limit or None):
        print(f"  {n:>6}  {h}")
    print(f"\nstatus codes: {dict(s['statuses'])}")
    print("\nauthentication seen (values removed):")
    for a, n in s["auth"].most_common():
        print(f"  {n:>6}  {a}")
    if s["set_cookie_names"]:
        print(f"set-cookie names: {', '.join(sorted(s['set_cookie_names']))}")
    print(f"\nendpoints ({len(s['endpoints'])}) — count · method url · status · query names · response type:")
    rows = sorted(s["endpoints"].items(), key=lambda kv: -kv[1]["count"])
    for key, ep in rows[:limit or None]:
        q = ",".join(sorted(ep["query"])) or "-"
        t = ",".join(sorted(x for x in ep["types"] if x)) or "-"
        print(f"  {ep['count']:>5}  {key}  {dict(ep['status'])}  ?{q}  {t}")


def self_test():
    secret = "eyJhbGciOiJIUzI1NiJ9.SECRET.SIG"
    def entry(url, status=200, extra=()):
        return {"request": {"method": "GET", "url": url,
                            "headers": [{"name": "Authorization", "value": f"Bearer {secret}"},
                                        {"name": "Cookie", "value": "sid=COOKIEVALUE; theme=dark"}, *extra]},
                "response": {"status": status, "headers": [{"name": "Set-Cookie", "value": "sid=NEWVALUE; HttpOnly"}],
                             "content": {"mimeType": "application/json; charset=utf-8"}}}
    har = {"log": {"entries": [entry("https://api.example.com/users/123?token=QUERYSECRET&page=2"),
                               entry("https://api.example.com/users/456?page=3", 404),
                               entry("https://cdn.example.com/app.js", extra=({"name": "X-Api-Key", "value": "KEYVALUE"},))]}}
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp, "t.har")
        p.write_text(json.dumps(har))
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            show(summarize(json.loads(p.read_text())), 20)
        out = buf.getvalue()
        print(out)
        for leak in (secret, "SECRET", "COOKIEVALUE", "NEWVALUE", "QUERYSECRET", "KEYVALUE"):
            assert leak not in out, f"leaked {leak}"
        assert "GET https://api.example.com/users/{id}" in out and "page,token" in out
        assert "authorization: Bearer <redacted>" in out and "x-api-key: <redacted>" in out
        try:
            summarize({"foo": 1})
            raise AssertionError("non-HAR accepted")
        except ValueError:
            pass
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("har", nargs="?")
    ap.add_argument("--host")
    ap.add_argument("--limit", type=int, default=60, help="rows per table, 0 = all")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.har or not Path(a.har).is_file():
        ap.error("give an existing .har file")
    if Path(a.har).stat().st_size > MAX_MB * 1024 * 1024:
        sys.exit(f"error: larger than {MAX_MB} MB — export a smaller capture")
    try:
        show(summarize(json.loads(Path(a.har).read_text("utf-8-sig")), a.host), a.limit)
    except (ValueError, json.JSONDecodeError) as e:
        sys.exit(f"error: {e}")


if __name__ == "__main__":
    main()
