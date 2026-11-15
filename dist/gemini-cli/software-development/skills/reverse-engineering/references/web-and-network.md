# Web apps and network traffic

Ideas adapted from REA's `runtime-observation.md` and `evidence-workflows.md` (MIT · © 2026 morluto). The traffic-file part is rewritten to use local scripts.

## 1 · The user's web app

- The target must be the web app of the user, or of a customer under contract. Record the in-scope domains in the authorization record. Other domains the page calls (CDN · analytics · payment) may be looked at only in the capture; never send requests to them yourself.
- Browser-side code: take it from the user's build folder first. If there is none, have the user "Save as" or send the files. Then continue with `sourcemap_list.py` and [javascript-electron](javascript-electron.md).
- Never replay requests, try logins, or scan for vulnerabilities unless agreed in the scope. Pass security testing work on to `security-engineer`.
- For someone else's public web page, read only the page and scripts anyone can load, following that site's robots.txt and terms of use. Never enter parts of another party's site that need login.
- On a CAPTCHA, do not solve it and do not look for a way around it. Let the user do it.
- Check whether the machine has a browser and Playwright Core with `node scripts/check-tools.mjs --target web`. Letting Playwright click or fill in by itself needs asking every time, per [runtime-observation](runtime-observation.md).

## 2 · Have the user record the HAR (HTTP Archive) themselves

The user clicks; the agent does not drive the browser:

1. Open DevTools (F12) → Network tab → tick "Preserve log"
2. Do the steps to be observed, once
3. Right-click in the list → "Save all as HAR" (Chrome · Edge), then put the file in `_to_delete/re/<ชื่อ>/`

**A HAR holds cookies, tokens and personal data in full.** Treat it as a secret: keep it in `_to_delete/`, never commit it, never pass it on, and tell the user to delete it when the job ends. If a real session was used, advise the user to log out after recording so the tokens in the file expire.

### 2.1 · Recording a HAR with a script: 3 traps (example from that job: a flight search site)

| Trap | Symptom | Fix |
|---|---|---|
| A URL has an unencoded `\|` (for example Google Fonts) | HAR reading tools reject the raw file: `HAR schema validation failed ... must match format "uri"` | Convert `\|` to `%7C` and write a new file; do not edit the raw file |
| A streaming request the page cancels itself once it has all the data | The HAR has no body for that request | Have the script collect the incoming data through CDP (Chrome DevTools Protocol) and fill it into the HAR · write in that entry's `_comment` that it was added manually, not from the HAR directly |
| Playwright 1.64.1 cannot find the ffmpeg it needs (the machine only has ffmpeg-1011) | Cannot record video | Pin to 1.64.0-alpha and record the version in the evidence ledger |

## 3 · Summarize a HAR

```bash
python -I scripts/har_summary.py <capture.har>                       # ทั้งไฟล์
python -I scripts/har_summary.py <capture.har> --host api.example.com # เฉพาะ host เดียว
```

It reports: hosts and counts · status codes · endpoints grouped by method + host + path pattern (id numbers and uuids become `{id}`) · query parameter names · response content types · authentication method

- Values of cookie headers and queries are **dropped entirely**, leaving only names and prefixes like `Bearer` `Basic`. So the output can be pasted into a report.
- The path grouping is `อนุมาน` (inferred), not the server's schema. An endpoint not clicked in the capture is unknown, not absent.
- To see a request or response body, open the HAR and read only the entries needed, then write only the structure (field names · types) in the report, not the values.

## 4 · pcap files (packet capture)

Use Wireshark or tshark that the user installed from wireshark.org (check with `node scripts/check-tools.mjs --target network`). Reading an already recorded file needs no repeated asking, but capturing live traffic needs asking every time. Permission to read a saved file does not include permission to capture anew, and never capture or decrypt anyone else's traffic.

```bash
tshark -r <file.pcap> -q -z conv,tcp          # ใครคุยกับใคร
tshark -r <file.pcap> -q -z http,tree         # สรุป HTTP
tshark -r <file.pcap> -Y dns -T fields -e dns.qry.name | sort | uniq -c | sort -rn | head -50
tshark -r <file.pcap> -Y 'tls.handshake.type == 1' -T fields -e tls.handshake.extensions_server_name | sort -u
```

- Put in a display filter (`-Y`) narrowed to the target's host or port from the start. Do not open a whole large file.

- TLS without a key log shows only the host name (SNI) and sizes. Never claim to have seen the content.
- A Fiddler SAZ is a ZIP holding separate request/response files. Extract it with `python -m zipfile -e` and read one file at a time.

## 5 · Capturing new traffic through a proxy (mitmproxy)

Use when there is no saved capture and you must see the requests of a non-browser app. Ask the user every time, stating the app, the device and the time window to capture.

- Use only on authorized test systems or accounts, never real accounts holding customer data.
- State the side effects before starting: the mitmproxy CA certificate must be installed on the machine or device, and a proxy must be set. An app with certificate pinning will not connect; record that as an unknown and never modify the app to get around it.
- Save the results to a file with `mitmdump -w _to_delete/re/<ชื่อ>/flows.mitm`, then read only parts.
- At the end, restore everything: remove the CA certificate · turn off the proxy · record in the evidence ledger that it was restored.
- A flow file holds cookies and tokens like a HAR. Handle it the same way as section 2.

## 6 · Unknown protocols

1. Collect at least 3 samples that differ one thing at a time (one value changed).
2. Compare byte by byte to find headers · lengths · counters · checksums.
3. Write a parser that checks size before every read, then run it on all the samples. Only when every sample matches, label it `ตรวจจริง` (verified).
4. For a value that is the same in every sample, record it as an unknown. Do not name it yourself.
