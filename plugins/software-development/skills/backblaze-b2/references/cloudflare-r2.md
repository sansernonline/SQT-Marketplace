# Cloudflare R2 — connect an app to Cloudflare R2 with a private bucket, least privilege, and a money limit

- [Use when](#use-when)
- [Related skills](#related-skills)
- [1 · Search first, then ask once](#1--search-first-then-ask-once)
- [2 · Choose the route](#2--choose-the-route)
- [3 · Create the bucket and token](#3--create-the-bucket-and-token)
- [4 · Connect with an S3 client](#4--connect-with-an-s3-client)
- [5 · Upload from the browser with a presigned PUT](#5--upload-from-the-browser-with-a-presigned-put)
- [6 · Make files public](#6--make-files-public)
- [7 · Lifecycle and Infrequent Access (IA)](#7--lifecycle-and-infrequent-access-ia)
- [Money and things outside the machine (เงินและของนอกเครื่อง)](#money-and-things-outside-the-machine-เงนและของนอกเครอง)
- [Check before sending](#check-before-sending)
- [References](#references)


R2 facts come from the official docs read on 2026-11-05. Anything not yet read carries the label `(ยังไม่ได้ตรวจ)` (not yet checked).

> **One rule:** the bucket stays private until the user says to open it, and the app holds only a token that can read and write its own bucket. Before you create anything that costs money, make anything public, or delete something that exists, pass the gate in the section "Money and things outside the machine (เงินและของนอกเครื่อง)".

> Read from `backblaze-b2` when the user picks Cloudflare R2. Sections below keep their own numbering.

## Use when

- The app must store files (images, documents, backups) in S3-style object storage and wants free egress.
- A browser uploads straight into the bucket with a presigned URL.
- Files must be public through r2.dev or a custom domain.
- Setting CORS · lifecycle · moving old files to Infrequent Access.
- The user asks whether R2 is free enough.

Not for: deciding which file types are accepted and how to virus-scan them → `file-upload-and-storage` · needing an S3 feature R2 does not support (table in section 4) → pick other storage.

## Related skills

- `file-upload-and-storage` sets the rules on file type, size, scanning and link sharing; this skill only connects R2.
- `config-and-secrets` defines what counts as secret; this skill says which token and how much privilege.
- On Render, set R2 variables as `sync: false` (`render-deploy`). A pipeline that needs R2 at build or deploy time uses its own token, separate from the app token (`cicd-and-release`).
- `security-gate` scans the repo for secrets before push. `principle-secure-by-default` covers outside input (file name, type, size) in section 5.

## 1 · Search first, then ask once

Search the repo first: the S3 library in use · `R2_*` or `AWS_*` variables · `wrangler.toml` / `wrangler.jsonc` · existing upload code · `npx wrangler --version` · `npx wrangler r2 bucket list` (reads the list of what exists).

| Question | Why you need it |
|---|---|
| Monthly money limit | Decides whether usage stays in the free tier (section "Money and things outside the machine") |
| Upload from the browser or from the server | A browser needs a presigned URL and CORS (section 5) |
| Must the files be public | Decides section 6 |
| Must the data stay in one region (jurisdiction, such as EU) | You need the endpoint that matches the jurisdiction, set when the bucket is created |

If you get no answer: stay in the free tier and create nothing that costs money until you get a money limit · private bucket · not public · upload through the server · no jurisdiction. Record in `decision-desk/decision-log` that you chose these yourself, and mark the unanswered items `(รอยืนยัน)` (awaiting confirmation).

## 2 · Choose the route

| Route | Use when | Limit |
|---|---|---|
| **S3 SDK** (any S3 library) | Default · the app runs outside Cloudflare | Endpoint and region as in section 4 |
| **wrangler** (`npx wrangler r2 ...`) | Create a bucket · set CORS, lifecycle, domains · list contents | It is not known whether `object put/get` defaults to `--local` or `--remote`. Always add `--remote` yourself when you mean the bucket on Cloudflare `(ยังไม่ได้ตรวจ)` |
| Workers binding (`r2_buckets` in the wrangler config) | The app runs as a Cloudflare Worker | `(ยังไม่ได้ตรวจ)` the docs page was not read · read it before use |

## 3 · Create the bucket and token

1. Create the bucket: `npx wrangler r2 bucket create <NAME>` (options `--location` `--storage-class` `--jurisdiction`) · pass the money gate first.
2. Create an API token in the Dashboard with the least privilege:

| Permission level | What it allows | Use for the app |
|---|---|---|
| **Object Read & Write** | Read, write, and list objects in the named bucket (whether deleting an object is included `(ยังไม่ได้ตรวจ)`) · S3 API only | **Use this one**, limited to the app's own bucket |
| Object Read only | Read objects only | For parts that only download |
| Admin Read & Write / Admin Read only | Create and delete buckets, change config | The app must not hold it · use it only for your own setup |

3. **The Secret Access Key is shown once, when it is created.** The user stores it in a secret manager, or in the Dashboard of whatever hosts the app, right away. If it is lost, create a new token.
4. Secret values do not go into git, chat, or logs. Check that a value is set without printing it: `[ -n "$R2_SECRET_ACCESS_KEY" ] && echo OK || echo MISSING`
5. For short-lived credentials, use the Temporary Credentials API (the tokens page mentions it · details not read `(ยังไม่ได้ตรวจ)`). The tokens page says nothing about expiry or IP restriction for a normal token.

## 4 · Connect with an S3 client

| Value | What to put |
|---|---|
| endpoint | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| region | `auto` (an empty value or `us-east-1` is treated as `auto`) |
| bucket with a jurisdiction | The endpoint becomes `<ACCOUNT_ID>.eu.r2.cloudflarestorage.com` (or `.fedramp.` · `.us.`) · create a separate client per jurisdiction |
| path-style or virtual-hosted | `(ยังไม่ได้ตรวจ)` the S3 API page does not say |

Supported commands: PutObject GetObject HeadObject DeleteObject DeleteObjects CopyObject · the full multipart set · **ListObjectsV2** (the docs recommend it over ListObjects) · bucket level: ListBuckets CreateBucket HeadBucket DeleteBucket CORS lifecycle GetBucketLocation

S3 features that R2 **does not support** (S3 API page · 2026-11-05):

| S3 feature | Effect on the app |
|---|---|
| ACL (`x-amz-acl`) | You cannot set permissions per object · control access at the bucket level and with tokens instead |
| versioning | No old versions to roll back to · a deleted or overwritten object is gone → keep your own backup if it matters |
| bucket policy · public access block | Control public access through section 6 |
| object tagging · object lock · replication · notifications · logging · website · request payment | Remove them if existing code calls them |
| SSE-KMS · AES-256 | (SSE-C is supported) |

Only two storage classes exist: `STANDARD` and `STANDARD_IA`.

## 5 · Upload from the browser with a presigned PUT

The server creates a URL, and the browser PUTs the file straight into the bucket. The file does not pass through our server.

1. **The server creates the key itself** (for example `uploads/<uuid>` · if needed, append an extension taken only from the allowed file type · the template `assets/r2-presign.mjs` uses `uploads/<uuid>` with no extension). Never use the user's file name directly. This prevents name clashes and odd paths (`principle-secure-by-default`).
2. **Check type and size on the server** before issuing the URL · bind `Content-Type` when signing (this is our own conclusion, not confirmed from the presigned page `(ยังไม่ได้ตรวจ)`) · the type and size rules live in `file-upload-and-storage`.
3. **Short lifetime.** R2 supports 1 second to 7 days (604,800 seconds). A URL is a bearer token: whoever holds it can use it until it expires. Set a few minutes.
4. Limits of presigned URLs in R2: **POST is not supported** (HTML form), use PUT · **custom domains do not work**, only `<ACCOUNT_ID>.r2.cloudflarestorage.com`.
5. **Set CORS on the bucket**, or the browser blocks the upload. Use [`assets/r2-cors.json`](../assets/r2-cors.json) (Dashboard format). **Run `cors list` and keep a copy of the existing rules first**, because `cors set` may replace the whole existing set `(ยังไม่ได้ตรวจ)`. Set it with wrangler: `npx wrangler r2 bucket cors set <BUCKET> --file r2-cors.json` · check: `npx wrangler r2 bucket cors list <BUCKET>`. wrangler uses a different JSON shape from the Dashboard (`{"rules":[...]}`), full fields `(ยังไม่ได้ตรวจ)` → if wrangler rejects the file, paste it into the Dashboard. Browsers may cap `MaxAgeSeconds` at 2 hours.
6. **When a URL has expired, the browser cannot read the cause.** R2 answers 403 `ExpiredRequest` without CORS headers, so the browser sees an ordinary CORS error. Have the page request a new URL before the old one expires, instead of waiting for the failure.
7. Sample code that creates the URL: [`assets/r2-presign.mjs`](../assets/r2-presign.mjs)

## 6 · Make files public

A bucket is **not public by default**. Once opened, every object in the bucket is exposed to the internet (the domain root cannot list the contents). Keep non-public files in another bucket.

| Route | Use when | Limit |
|---|---|---|
| Private (default) | User files, documents, backups | Download through the server or a presigned GET |
| `r2.dev` | **Development only** | Rate limit · no cache · no WAF (Web Application Firewall) · no access control · a CNAME cannot point to r2.dev |
| custom domain | Production | The domain must be a zone in the same Cloudflare account as the bucket · Cache and WAF work · by default only some file types are cached, so set Cache Everything to cache all |

- Enable r2.dev: `npx wrangler r2 bucket dev-url enable <BUCKET>` (or Dashboard → Bucket → Settings → Public Development URL → Enable → type `allow`)
- Attach a domain: `npx wrangler r2 bucket domain add <BUCKET> --domain <D> --zone-id <Z>`
- **If you use WAF or Cloudflare Access on a custom domain, you must disable r2.dev for that bucket**, or people can get in around it through r2.dev.

## 7 · Lifecycle and Infrequent Access (IA)

Set rules to delete automatically or move to IA: `npx wrangler r2 bucket lifecycle add <BUCKET> [NAME] [PREFIX]` with options `--expire-days` `--ia-transition-days` `--abort-multipart-days` · list existing rules: `lifecycle list`

- `--expire-days` **deletes objects permanently**, and the bucket has no versioning to roll back to → ask the user before setting it, every time, and state the prefix and number of days clearly.
- IA has a 30-day minimum: deleting or moving before then is still billed for the full 30 days, and retrieval has a fee · ask before setting this too.
- `lifecycle set` replaces the whole set (it works by replacement `(ยังไม่ได้ตรวจ)`) → always run `list` first so you do not overwrite the user's existing rules.
- Full fields of the lifecycle JSON `(ยังไม่ได้ตรวจ)`

## Money and things outside the machine (เงินและของนอกเครื่อง)

This skill can create things that cost money and expose files to the internet. All 4 items are required:

1. **The user sets the money limit.** State the free tier and the prices before you create anything (pricing page · read 2026-11-05 · page updated 2026-10-30).

| Item | Free per month (Standard) | Charged beyond that (Standard) | Infrequent Access |
|---|---|---|---|
| Storage | 10 GB-month | 0.015 USD/GB-month | 0.01 USD/GB-month · retrieval 0.01 USD/GB |
| Class A (write, list) | 1 million requests | 4.50 USD/million requests | 9.00 USD/million requests |
| Class B (read) | 10 million requests | 0.36 USD/million requests | 0.90 USD/million requests |
| egress (data out) | Free when served directly from R2 (Workers API · S3 API · r2.dev) | Other services connected to the bucket may bill separately | |

   Our own conclusion, not from the pricing page: list and put count as Class A, which costs more than get · a loop that lists often can burn money → use a prefix and cache the list result · if usage goes over the limit, ask the user; never raise the limit yourself.
2. **Do not delete or change anything that exists without asking** — bucket · object · token · lifecycle rule · domain. Read the list first (`npx wrangler r2 bucket list` · `lifecycle list` · `cors list`), then change. If a bucket name clashes with an existing one, stop and ask.
3. **After a delete, check again** that it is gone from the list, using a listing command (`npx wrangler r2 bucket list` · `npx wrangler r2 object get <bucket>/<key> --remote` should not find it · `--remote` is required, or it may search local storage instead, see section 2). Then tell the user the cost actually incurred. IA objects deleted before 30 days are still billed in full.
4. **Delete is not the same as closing public access or revoking a token.** Tell the user plainly which one you did: deleting an object does not close the way in · **disabling r2.dev does not disable a custom domain** (closing one custom domain does not close the others either) · revoking a token in the Dashboard is what makes the old key stop working · deleting a bucket does not revoke a token (the exact way to revoke `(ยังไม่ได้ตรวจ)`).

## Check before sending

1. The bucket is private, unless the user asked to open it and it matches section 6.
2. The token is Object Read & Write, limited to the bucket · no Admin token in the app.
3. No secret values in any file · env checked as OK/MISSING.
4. Presigned PUT: server-made key · type and size checked on the server · short lifetime · CORS set and `cors list` shows it.
5. No calls to features R2 does not support (ACL, versioning) · ListObjectsV2 is used.
6. The 4-item money gate passed · the user approved any lifecycle rule that deletes permanently.

## References

- [`cloudflare-r2-example.md`](cloudflare-r2-example.md) — open to see a full run for a shop that takes payment slips
- [`cloudflare-r2-sources.md`](cloudflare-r2-sources.md) — official docs read on 2026-11-05 and what was not read
