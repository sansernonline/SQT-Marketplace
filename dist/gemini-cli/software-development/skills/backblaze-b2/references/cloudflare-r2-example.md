# Worked example · Cloudflare R2

## Worked example

Request (in Thai): "เว็บร้านให้ลูกค้าอัปโหลดสลิปโอนเงิน อยากเก็บที่ R2 เปิดดูได้เฉพาะแอดมิน งบไม่เกิน 5 USD ต่อเดือน" (A shop site lets customers upload payment slips. Store them in R2, viewable only by admins, budget at most 5 USD a month.)

1. Search the repo: Express · multer writing to disk · no CORS · `npx wrangler r2 bucket list` shows no bucket with the same name.
2. Ask once: is the upload from the browser · is it public · which data region? Answer: "browser · not public · none" (example).
3. Result: private bucket `shop-slips` · an Object Read & Write token limited to that bucket, passed through environment variables, checked as OK/MISSING without printing the value · the server issues a presigned PUT valid for 5 minutes, checks type (images and PDF) and size first, and the key is `slips/<uuid>` (created by the server) · CORS set for the site's origin · admins view through a presigned GET, r2.dev stays off · usage compared with the free 10 GB-month before creating · `cors list` shows the rule that was set.
