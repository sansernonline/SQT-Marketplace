#!/usr/bin/env python3
"""Find and download free, commercially usable photos from Openverse. No API key needed.

    python fetch_free_image.py --query "thai massage room" --out public/images/hero.webp --aspect 16:9 --n 3

Writes name-1, name-2 ... (one per candidate) and appends credits to <out folder>/CREDITS.md.
Pillow is optional: with it, images are cropped to the aspect, resized and saved as .webp/.jpg.
"""
import argparse
import io
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.openverse.org/v1/images/"
USER_AGENT = "sqt-image-fetch/1.0"
MAX_BYTES = 25 * 2**20  # 25 MB: above any web photo we resize to hero size, below a memory-eating file
RATIOS = {"1:1": 1.0, "16:9": 16 / 9, "4:3": 4 / 3, "3:2": 1.5, "9:16": 9 / 16, "3:4": 0.75, "2:3": 2 / 3, "4:5": 0.8}


def fail(message):
    sys.exit(f"fetch_free_image: {message}")


class Refused(Exception):
    """A URL or download this script will not take; the caller skips that photo."""


class HttpsOnlyRedirect(urllib.request.HTTPRedirectHandler):
    # urlopen follows redirects to http and ftp too; stop before the request goes out
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urllib.parse.urlparse(newurl).scheme != "https":
            raise Refused(f"refusing redirect to non-https URL: {newurl}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


_opener = urllib.request.build_opener(HttpsOnlyRedirect)


def get(url, timeout=60):
    if urllib.parse.urlparse(url).scheme != "https":
        raise Refused(f"refusing non-https URL: {url}")
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with _opener.open(request, timeout=timeout) as response:
        chunks, size = [], 0
        while chunk := response.read(65536):
            size += len(chunk)
            if size > MAX_BYTES:
                raise Refused(f"download larger than {MAX_BYTES // 2**20} MB, stopped: {url}")
            chunks.append(chunk)
        return b"".join(chunks)


def search(query, page_size):
    params = urllib.parse.urlencode({
        "q": query,
        "license_type": "commercial,modification",
        "page_size": page_size,
        "mature": "false",
    })
    try:
        return json.loads(get(f"{API}?{params}")).get("results", [])
    except urllib.error.HTTPError as error:
        fail(f"Openverse returned HTTP {error.code} (rate limit? wait a minute and retry)")
    except urllib.error.URLError as error:
        fail(f"cannot reach Openverse -> {error.reason}")


def pick(results, aspect, min_width, count):
    target = RATIOS[aspect]

    def score(item):
        width, height = item.get("width") or 0, item.get("height") or 0
        if not width or not height:
            return 9.0
        return abs(width / height - target)

    usable = [r for r in results if (r.get("width") or 0) >= min_width and r.get("url")]
    return sorted(usable, key=score)[:count]


def save(blob, path, source_url, aspect, max_width):
    try:
        from PIL import Image
    except ImportError:
        suffix = Path(urllib.parse.urlparse(source_url).path).suffix.lower() or ".jpg"
        path = path.with_suffix(suffix)
        path.write_bytes(blob)
        return path
    picture = Image.open(io.BytesIO(blob)).convert("RGB")
    target = RATIOS[aspect]
    width, height = picture.size
    if width / height > target:
        new_width = round(height * target)
        left = (width - new_width) // 2
        picture = picture.crop((left, 0, left + new_width, height))
    else:
        new_height = round(width / target)
        top = (height - new_height) // 2
        picture = picture.crop((0, top, width, top + new_height))
    if picture.width > max_width:
        picture = picture.resize((max_width, round(picture.height * max_width / picture.width)), Image.LANCZOS)
    if path.suffix.lower() not in (".webp", ".jpg", ".jpeg"):
        path = path.with_suffix(".webp")
    picture.save(path, quality=82)
    return path


def credit_line(file_name, item):
    code = (item.get("license") or "").lower()
    if code == "pdm":
        license_name = "Public Domain"
    elif code == "cc0":
        license_name = "CC0"
    else:
        license_name = f"CC {code.upper()} {item.get('license_version') or ''}".strip()
    creator = item.get("creator") or "unknown"
    return (f"| {file_name} | {item.get('title') or '-'} | {creator} | {license_name} | "
            f"{item.get('foreign_landing_url') or item.get('url')} |")


def main():
    parser = argparse.ArgumentParser(description="Download free, commercially usable photos from Openverse.")
    parser.add_argument("--query", required=True, help="English search words, e.g. 'thai massage room'")
    parser.add_argument("--out", required=True, help="output path, e.g. public/images/hero.webp")
    parser.add_argument("--aspect", default="16:9", choices=sorted(RATIOS))
    parser.add_argument("--n", type=int, default=3, help="candidates to download, 1-6")
    parser.add_argument("--min-width", type=int, default=1200)
    parser.add_argument("--max-width", type=int, default=1920)
    args = parser.parse_args()
    if not 1 <= args.n <= 6:
        fail("--n must be between 1 and 6")

    chosen = pick(search(args.query, 40), args.aspect, args.min_width, args.n)
    if not chosen:
        fail(f"no usable photo for '{args.query}' -> try other words or a smaller --min-width")

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    credits = out.parent / "CREDITS.md"
    lines = [] if credits.exists() else ["| file | title | creator | license | source |", "|---|---|---|---|---|"]
    for index, item in enumerate(chosen, start=1):
        try:
            blob = get(item["url"])
        except (urllib.error.URLError, TimeoutError):
            print(f"skip: cannot download {item['url']}", file=sys.stderr)
            continue
        except Refused as error:
            print(f"skip: {error}", file=sys.stderr)
            continue
        path = save(blob, out.with_name(f"{out.stem}-{index}{out.suffix}"), item["url"], args.aspect, args.max_width)
        lines.append(credit_line(path.name, item))
        print(path)
    with credits.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    main()
