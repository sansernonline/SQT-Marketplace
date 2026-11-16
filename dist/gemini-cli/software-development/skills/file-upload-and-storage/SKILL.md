---
name: file-upload-and-storage
description: Use when users upload files or an app serves stored files
---

# Accepting file uploads and storing files

> **One rule:** a file a user sends is untrusted data.
> The file name, the extension, the type the browser reports, and the size it claims can **all be faked**.

## When to use this skill

- A screen lets users attach files, images, or documents.
- The system must store files and send them back for viewing or download.
- You must decide where to keep the files.
- Some files should be hidden from others, but right now anyone with the link can open them.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Import Excel/CSV and load the data into the system | `data-import-export` | instead |
| Permissions: who may access what | `auth-implementation-patterns` | instead |
| Process large files as a background job | `background-jobs` | instead |

---

## 1 · Check before accepting

| What to check | How |
|---|---|
| **File type** | Read the **contents** (magic bytes). Do not trust the extension or `Content-Type`. |
| **Size** | Enforce it on the server **and** at the front-facing request receiver. A check in the browser is only a convenience. |
| Files per request | Set a limit. |
| Total size per user | Set a quota, or one person uses up all the space. |
| Allowed types | **An allow list, not a deny list.** |

```
Typical allow list: jpg · png · webp · pdf · xlsx · docx · csv
Always forbidden: executables (exe, sh, bat) · server script files (php, aspx, jsp) · svg that has not been sanitised
```

> **SVG is HTML.** It can run scripts. To accept it, sanitise it first or convert it to PNG.
>
> **Check the size before reading the file into memory.** Otherwise a 5 GB file kills the server
> before the size-check code gets to run.

**Virus-scan** any file that other people will download. While the scan result is pending, set the status to `pending`
and give nobody access.

---

## 2 · Where to store

| Store | Good for | Note |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | The default to use | Scales · has expiring links built in |
| The server's disk | A small, single-machine system | **Must sit outside the folder the web serves**, and must be backed up |
| In the database | Very small files that must be in the same transaction | Grows fast · backups get much slower |

> Wrong: **keeping files in the app's folder.** They vanish on every deploy, and with several instances they cannot see each other.
> Wrong: **keeping files directly in the folder the web serves.** Someone uploads a script file and runs it.

**The database holds only metadata; the file itself lives elsewhere.** The metadata table needs the columns
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · Naming the stored file

**Never use the file name the user sent as the real stored name.**

```
Wrong: uploads/รายงาน (1).xlsx              spaces · Thai · brackets
Wrong: uploads/../../etc/passwd             escapes the folder
Right: 2026/09/25/01J9Z8K7X2M4.xlsx         random · split into folders by date
```

- The real stored name is a random value (UUIDv7 or ULID) + an extension that you have **verified**.
- Keep the user's original name in the database, and send it back on download through a header.
- Split folders by date. One folder with millions of files is slow and cannot be browsed.
- Store a checksum too. It detects duplicates and checks the file is not corrupted.

---

## 4 · Sending files back to the user

| File | How to send |
|---|---|
| Public (logo, product image) | A direct URL through a CDN is fine |
| **Private** (document, receipt, user photo) | **A signed link that expires** in 5–15 minutes |

> **A "hard-to-guess link" is not access control.** Links get forwarded, logged by proxies,
> and left in the `Referer` header. For a private file, **check permission every time**, then issue a temporary link.

- For large files, let the user upload straight to object storage with a link we sign, so the file does not pass through the app.
  **The checks in §1 are still all required.** This route bypasses the app, so restore the checks like this:
  - **When signing the link:** limit size and type inside the signature. S3 uses a presigned POST whose policy has `content-length-range` and a `Content-Type` condition (a presigned PUT cannot enforce size). Other providers have equivalents, for example GCS uses the header `x-goog-content-length-range`.
  - **When signing the link:** set the key yourself (a random name as in §3) in a holding folder · keep the link's expiry short · save a metadata row with `scan_status = pending`.
  - **After the upload finishes** (a storage event, or the user reports it done): read the real magic bytes from the object · compare the real size with the limit · virus-scan. If it passes, move it to the real store and set `clean`. If it fails, delete or quarantine it.
  - While `pending`, issue no download link to anyone.
- When serving a file for download, set `Content-Disposition` and `Content-Type` correctly,
  and never send back user-uploaded HTML in a way that lets the browser render it.
- If you can, serve user files from a different domain than the app, so scripts in a file cannot reach the app's cookies.

---

## 5 · Images

- **Never send the original camera image to the screen.** An 8 MB photo on a phone is a page that does not load.
- Pre-generate 2–3 sizes (thumbnail · medium · a downsized full size).
- **Strip EXIF.** The photo holds the location where it was taken, and users do not know they are publishing it.
- Convert to WebP if the browser supports it.
- Rotate the image according to EXIF before you strip EXIF, or phone photos come out sideways.
- If the file is large or there are many, resize as a background job (see `background-jobs`).

---

## 6 · Deleting and retention

| Topic | Rule |
|---|---|
| Deleting the parent record | A job must also hunt down and delete the orphan files left behind. |
| Order of deletion | Delete the metadata first, then the file. An orphan file is harmless, but metadata pointing to a file that is gone breaks the screen. |
| An uploaded file never linked to anything | Delete it after 24 hours. |
| Retention | Set it per file type · a file with personal data needs an expiry date (see `pdpa-compliance`). |
| Backup | Files belong in the backup plan just like the database, **and a restore must have been tested for real.** |
