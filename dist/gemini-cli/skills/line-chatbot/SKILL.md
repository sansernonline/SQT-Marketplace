---
name: line-chatbot
description: Use when the company LINE OA should answer customers automatically. Reply vs push and quota, reply token limits, knowledge-base answers, human handoff, PDPA notice; never invents prices or stock.
---

# LINE Chatbot

A customer-facing bot that knows what it does not know — and that answers with free reply messages wherever it can.

## 1. Reply vs push — the cost decision

| | Reply message | Push message |
|---|---|---|
| Trigger | answers a webhook event (message, follow, postback) | sent any time by the server |
| Needs | `replyToken` from the event | the user's `userId` |
| Quota | **free, not counted** | **counted per recipient** against the package (`line-oa-setup` §5) |
| Limit | token is single-use, use within about **1 minute**; up to 5 message objects | up to 5 message objects per call |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ ("within one minute", subject to change)

Design rule: answer inside the reply window whenever possible. If the answer needs a slow lookup (> ~20 s), reply at once with "รับเรื่องแล้วค่ะ กำลังตรวจสอบให้นะคะ" and send the result later by push — or better, by a staff reply in OA Manager chat (also free).

## 2. Build steps

1. **Collect real questions** — export 1–3 months of OA chat; group into 10–20 intents (เวลาทำการ, ราคา, สต็อก, ค่าส่ง, การรับประกัน, ที่ตั้ง, การชำระเงิน, ติดตามพัสดุ).
2. **Knowledge base** — one approved answer per intent in a sheet: intent, sample questions, answer, owner, **last verified date**. Prices/stock come from the live system, never typed into the KB.
3. **Matcher** — keyword rules first (cheap, predictable); add an LLM classifier only for the long tail. The LLM picks an intent and fills from the KB; it never writes facts.
4. **Confidence gate** — below threshold, or an intent on the handoff list → handoff (section 3).
5. **Rich menu** shortcuts send fixed keywords the matcher knows (`line-richmenu`).
6. **Log** every turn: time, intent, KB answer version, confidence, handoff reason — not the full message text longer than needed.
7. **Weekly review** — top unmatched questions → new KB entries; retire answers older than their verify date.

## 3. Human handoff

| Trigger | Bot says | Staff action |
|---|---|---|
| Low confidence twice in a row | "ขอส่งต่อให้เจ้าหน้าที่ดูแลนะคะ จะตอบกลับภายใน [เวลา]" | reply in OA Manager chat |
| Refund, complaint, legal, angry words | same, no attempt to answer | supervisor within SLA |
| Price/stock not in the live system | same | confirm and reply |
| Out of hours | hours + "เจ้าหน้าที่จะตอบกลับวันทำการถัดไป" | first thing next day |

While a human handles the chat, mute the bot for that `userId` (flag with expiry, e.g. 2 hours) so it does not talk over staff. Turn on OA Manager **Chat** mode alongside webhook so staff can answer.

## 4. PDPA and disclosure

- First reply (or greeting): "ตอบโดยผู้ช่วยอัตโนมัติ" plus a link to the privacy notice.
- Chat logs with names, phone numbers, addresses are personal data — state the purpose, keep a retention period (e.g. 1 year) and delete after; limit who can read logs (`pdpa-workflow`).
- Sending chats to an external LLM API = sharing with a processor: needs a data processing agreement and a line in the privacy notice; strip phone numbers and ID numbers before sending.

## 5. Worked example — monthly cost

OA on Basic (15,000 free). 3,000 chats/month, all answered by reply → 0 quota. 400 order-status updates sent by push → 400 counted. Remaining for broadcasts: 14,600.

KB entry template and a handoff message set: [references/kb-template.md](references/kb-template.md).

## Rules

- The bot never guesses prices, promotions, stock or policies — unknown means handoff.
- Thai register matches the OA persona (ค่ะ/ครับ), short sentences, one question per message.
- Never send a push the user did not expect; pushes spend quota and invite blocks.

## Related

`line-oa-setup` · `line-richmenu` · `line-broadcast` · `pdpa-workflow` · if installed: `chat-reply-templates` (online-seller), `notifications` (software-company).
