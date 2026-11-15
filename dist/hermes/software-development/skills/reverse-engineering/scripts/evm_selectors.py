#!/usr/bin/env python3
"""List the function selectors, event topics and dangerous opcodes of EVM contract
bytecode. Accepts a hex text file (with or without 0x) or raw bytes. Strips the
Solidity CBOR metadata tail and an obvious constructor, then walks the opcodes
(skipping PUSH data) and reads the dispatcher. Keccak-256 is implemented here so
a --signatures file can name the selectors. Pure stdlib; nothing is executed.

Usage:
  python -I evm_selectors.py <bytecode.hex>
  python -I evm_selectors.py <bytecode.hex> --signatures sigs.txt   # one `transfer(address,uint256)` per line
  python -I evm_selectors.py <bytecode.bin> --json --limit 0
  python -I evm_selectors.py --self-test
"""

import argparse
import json
import re
import sys
import tempfile
from pathlib import Path

MAX_MB = 8                                # EVM code is capped at 24 KB; creation code is not much bigger
EQ, JUMPI, PUSH4, PUSH32 = 0x14, 0x57, 0x63, 0x7F
DANGEROUS = {0xF2: "CALLCODE", 0xF4: "DELEGATECALL", 0xFF: "SELFDESTRUCT"}
CREATION_TO_RUNTIME = bytes.fromhex("f3fe6080604052")   # RETURN INVALID, then solc runtime start
MASK64 = (1 << 64) - 1


def _round_constants():
    """24 Keccak round constants from the spec's LFSR (x^8+x^6+x^5+x^4+1)."""
    state, out = 1, []
    for _ in range(24):
        rc = 0
        for j in range(7):
            if state & 1:
                rc |= 1 << ((1 << j) - 1)
            state <<= 1
            if state & 0x100:
                state ^= 0x171
        out.append(rc)
    return out


def _rotation_offsets():
    offsets, x, y = [[0] * 5 for _ in range(5)], 1, 0
    for t in range(24):
        offsets[x][y] = ((t + 1) * (t + 2) // 2) % 64
        x, y = y, (2 * x + 3 * y) % 5
    return offsets


ROUND_CONSTANTS, ROTATIONS = _round_constants(), _rotation_offsets()


def rol(v, n):
    return ((v << n) | (v >> (64 - n))) & MASK64 if n else v


def keccak_f(a):
    for rc in ROUND_CONSTANTS:
        c = [a[x] ^ a[x + 5] ^ a[x + 10] ^ a[x + 15] ^ a[x + 20] for x in range(5)]
        a = [a[i] ^ c[(i % 5 - 1) % 5] ^ rol(c[(i % 5 + 1) % 5], 1) for i in range(25)]
        b = [0] * 25
        for x in range(5):
            for y in range(5):
                b[y + 5 * ((2 * x + 3 * y) % 5)] = rol(a[x + 5 * y], ROTATIONS[x][y])
        a = [b[x + 5 * y] ^ (~b[(x + 1) % 5 + 5 * y] & b[(x + 2) % 5 + 5 * y]) & MASK64 for y in range(5) for x in range(5)]
        a[0] ^= rc
    return a


def keccak256(data):
    """Original Keccak padding (0x01), not SHA-3 (0x06) — this is what Ethereum uses."""
    rate = 136
    padded = bytearray(data) + b"\x01"
    padded += b"\0" * (-len(padded) % rate)
    padded[-1] |= 0x80
    state = [0] * 25
    for off in range(0, len(padded), rate):
        for i in range(rate // 8):
            state[i] ^= int.from_bytes(padded[off + 8 * i:off + 8 * i + 8], "little")
        state = keccak_f(state)
    return b"".join(lane.to_bytes(8, "little") for lane in state[:4])


def load_code(raw):
    text = re.sub(rb"\s+", b"", raw)
    if text[:2] in (b"0x", b"0X"):
        text = text[2:]
    if text and re.fullmatch(rb"[0-9a-fA-F]+", text):
        if len(text) % 2:
            raise ValueError("hex text has an odd number of digits")
        return bytes.fromhex(text.decode())
    if not raw:
        raise ValueError("empty file")
    return raw


def strip_metadata(code):
    """Solidity ends with CBOR data followed by its 2-byte big-endian length."""
    if len(code) > 2:
        size = int.from_bytes(code[-2:], "big")
        body = code[-2 - size:-2] if 0 < size <= len(code) - 2 else b""
        if body[:1] and 0xA0 <= body[0] <= 0xBF and re.search(rb"solc|ipfs|bzzr|experimental", body):
            hit = re.search(rb"solc\x43(...)", body)
            version = ".".join(map(str, hit.group(1))) if hit else None
            return code[:-2 - size], {"bytes": size + 2, "solc": version}
    return code, None


def disassemble(code):
    pc = 0
    while pc < len(code):
        op = code[pc]
        width = op - 0x5F if 0x60 <= op <= 0x7F else 0
        yield pc, op, code[pc + 1:pc + 1 + width]
        pc += 1 + width


def analyse(code, names=None):
    names = names or {}
    code, meta = strip_metadata(code)
    start = code.find(CREATION_TO_RUNTIME)
    ctor = start + 2 if start >= 0 else 0
    runtime = code[ctor:]
    ins = list(disassemble(runtime))
    selectors, topics, flags = {}, {}, {}
    for i, (pc, op, data) in enumerate(ins):
        if op == PUSH4 and len(data) == 4:
            window = ins[i + 1:i + 5]
            if EQ in [x[1] for x in window[:2]]:              # PUSH4 EQ  or  PUSH4 DUP2 EQ
                dest = None
                for prev, nxt in zip(window, window[1:]):     # EQ PUSHn JUMPI → jump target
                    if nxt[1] == JUMPI and 0x60 <= prev[1] <= 0x62:
                        dest = int.from_bytes(prev[2], "big")
                selectors.setdefault(data.hex(), dest)
        elif op == PUSH32 and len(data) == 32 and len(set(data)) > 2:
            topics[data.hex()] = names.get(data.hex())
        elif op in DANGEROUS:
            flags.setdefault(DANGEROUS[op], []).append(pc)
    return {"total_bytes": len(code) + (meta["bytes"] if meta else 0), "constructor_bytes": ctor, "runtime_bytes": len(runtime),
            "metadata": meta, "selectors": [{"selector": s, "jump_to": d, "name": names.get(s)} for s, d in selectors.items()],
            "push32_topics": [{"value": t, "name": n} for t, n in topics.items()],
            "dangerous_opcodes": {k: [hex(p) for p in v] for k, v in flags.items()}}


def read_signatures(path):
    names = {}
    for line in Path(path).read_text("utf-8").splitlines():
        sig = line.strip()
        if sig and not sig.startswith("#"):
            digest = keccak256(sig.encode())
            names[digest[:4].hex()] = names[digest.hex()] = sig
    return names


def show(r, limit):
    meta = f"metadata {r['metadata']['bytes']} bytes (solc {r['metadata']['solc'] or '?'})" if r["metadata"] else "no CBOR metadata"
    print(f"{r['total_bytes']} bytes · constructor {r['constructor_bytes']} · runtime {r['runtime_bytes']} · {meta}")
    print(f"dangerous opcodes: {', '.join(f'{k} at {v}' for k, v in r['dangerous_opcodes'].items()) or 'none'}")
    print(f"\nfunction selectors ({len(r['selectors'])}):")
    for s in r["selectors"][:limit or None]:
        dest = f"  -> {s['jump_to']:#x}" if s["jump_to"] is not None else ""
        print(f"  0x{s['selector']}{dest}  {s['name'] or ''}")
    print(f"\nPUSH32 values, likely event topics ({len(r['push32_topics'])}):")
    for t in r["push32_topics"][:limit or None]:
        print(f"  0x{t['value']}  {t['name'] or ''}")


def sample_contract():
    selector = lambda h: bytes.fromhex("80" "63" + h + "14" "61aaaa" "57")        # DUP1 PUSH4 x EQ PUSH2 JUMPI
    ctor = bytes.fromhex("6080604052" "0000" "f3fe")
    topic = bytes.fromhex("ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
    runtime = (bytes.fromhex("6080604052" "6000" "35" "60e0" "1c") + selector("a9059cbb") + selector("70a08231")
               + b"\x7f" + topic + bytes.fromhex("f4" "00"))
    cbor = bytes.fromhex("a264697066735822") + bytes(34) + bytes.fromhex("64736f6c63430008190033"[:-4])
    return ctor + runtime + cbor + len(cbor).to_bytes(2, "big")


def self_test():
    assert keccak256(b"").hex() == "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
    assert keccak256(b"transfer(address,uint256)")[:4].hex() == "a9059cbb"
    assert keccak256(b"Transfer(address,address,uint256)").hex().startswith("ddf252ad1be2c89b")
    code = sample_contract()
    with tempfile.TemporaryDirectory() as tmp:
        sigs, hexfile, binfile, junk = (Path(tmp, n) for n in ("s.txt", "c.hex", "c.bin", "j.hex"))
        sigs.write_text("# erc20\ntransfer(address,uint256)\nbalanceOf(address)\nTransfer(address,address,uint256)\n")
        hexfile.write_text("0x" + code.hex() + "\n")
        binfile.write_bytes(code)
        junk.write_text("0xabc")
        names = read_signatures(sigs)
        for f in (hexfile, binfile):
            r = analyse(load_code(f.read_bytes()), names)
            assert [s["selector"] for s in r["selectors"]] == ["a9059cbb", "70a08231"], r["selectors"]
            assert r["selectors"][0]["name"] == "transfer(address,uint256)" and r["selectors"][0]["jump_to"] == 0xAAAA, r
            assert r["push32_topics"][0]["name"] == "Transfer(address,address,uint256)", r["push32_topics"]
            assert list(r["dangerous_opcodes"]) == ["DELEGATECALL"], r["dangerous_opcodes"]
            assert r["metadata"] == {"bytes": 53, "solc": "0.8.25"} and r["constructor_bytes"] == 9, r
        try:
            load_code(junk.read_bytes())
            raise AssertionError("odd hex accepted")
        except ValueError:
            pass
        show(r, 5)
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?")
    ap.add_argument("--signatures", metavar="FILE", help="text file, one function or event signature per line")
    ap.add_argument("--limit", type=int, default=100, help="rows per list, 0 = all")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.file or not Path(a.file).is_file():
        ap.error("give an existing bytecode file")
    if Path(a.file).stat().st_size > MAX_MB * 1024 * 1024:
        ap.error(f"larger than {MAX_MB} MB")
    if a.signatures and not Path(a.signatures).is_file():
        ap.error("--signatures file not found")
    try:
        result = analyse(load_code(Path(a.file).read_bytes()), read_signatures(a.signatures) if a.signatures else None)
    except (ValueError, UnicodeDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(result, indent=1)) if a.json else show(result, a.limit)


if __name__ == "__main__":
    main()
