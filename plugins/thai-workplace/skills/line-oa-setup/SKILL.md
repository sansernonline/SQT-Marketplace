---
name: line-oa-setup
description: Use when creating a LINE Official Account or enabling the Messaging API — OA Manager vs Developers console, channel access tokens, HTTPS webhook, X-Line-Signature check, Thai package quotas.
---

# LINE OA Setup

From zero to a Messaging API channel that answers "hello", with the secrets in the user's hands only.

## 1. Two consoles, two jobs

| Console | URL | Used for |
|---|---|---|
| **LINE Official Account Manager** | manager.line.biz | create the OA, buy the package, profile, greeting, auto-reply, rich menu (no-code), chat, broadcasts, **enable Messaging API** |
| **LINE Developers console** | developers.line.biz | the Messaging API channel: channel secret, access tokens, webhook URL, LIFF/LINE Login |

Since 4 Sep 2024 a Messaging API channel can **no longer be created directly** in the Developers console — create the OA in OA Manager, then Settings → Messaging API → Enable; that creates the channel under a provider you pick.

## 2. Setup steps

1. **OA Manager** — create the account (unverified is fine to start; a verified/blue badge needs business documents).
2. **Enable Messaging API** — choose or create the Provider (use the company name; providers cannot be merged later).
3. **Developers console → channel → Basic settings** — copy the **channel secret** into the server's secret store (env var `LINE_CHANNEL_SECRET`).
4. **Messaging API tab → issue a token** (see section 3) → env var `LINE_CHANNEL_ACCESS_TOKEN`.
5. **Deploy the webhook** (section 4) on HTTPS.
6. **Messaging API tab → Webhook URL → Update → Verify** (expects 200) → turn on **Use webhook**.
7. **OA Manager → Response settings** — turn **Auto-reply messages off** if the bot replies; keep the greeting message if wanted.
8. **Echo test** — add the OA as a friend, send `hello`, confirm the log shows the event and the bot replies.

## 3. Channel access token — which type

| Type | Valid for | Limit | Use when |
|---|---|---|---|
| Long-lived | no expiry | 1 per channel; reissue invalidates the old one | quick start, small internal bot |
| Short-lived | 30 days | 30 per channel | servers that can refresh |
| v2.1 (JWT assertion) | you set, up to 30 days | 30 per channel | production — key pair, rotate on schedule |
| Stateless | 15 minutes | unlimited, cannot be revoked | serverless / per-request |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://developers.line.biz/en/docs/basics/channel-access-token/

## 4. Webhook requirements

- **HTTPS** with a certificate from a widely trusted CA — self-signed is rejected.
- Return **200 fast**; process events asynchronously (queue) — LINE redelivers if no 2xx (when redelivery is on).
- **Verify `x-line-signature` before anything else**: HMAC-SHA256 of the **raw request body** with the channel secret, Base64, compared to the header. Parsing or re-serialising the JSON first breaks the check.
- Body is UTF-8; one POST can carry several events — loop over `events`.

Minimal Node (Express) handler: [references/webhook-node.md](references/webhook-node.md).

## 5. Packages in Thailand

| Package | Monthly fee (ex VAT 7%) | Free messages/month | Extra message |
|---|---|---|---|
| Free | 0 | 300 | not available |
| Basic | 1,280 baht | 15,000 | 0.10 baht |
| Pro | 1,780 baht | 35,000 | 0.06 baht |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://lineforbusiness.com/th/service/line-oa-features/broadcast-message

Counted messages = push, multicast, narrowcast, broadcast — **per recipient**. Reply messages (using a reply token) and 1:1 chat typed by staff are not counted. Quota math: `line-broadcast`.

## Rules

- Tokens and the channel secret never go into code, chat, git or logs — environment or secret store only.
- One provider per company; a user's LINE `userId` differs per provider, so splitting OAs across providers breaks customer matching.
- Packages and prices change — re-check lineforbusiness.com before quoting a cost.
- Collecting names, phone numbers or chat logs = personal data: add the privacy notice (`pdpa-workflow`).

## Related

`line-chatbot` · `line-broadcast` · `line-richmenu` · `pdpa-workflow` · if installed: `config-and-secrets`, `notifications` (software-company).
