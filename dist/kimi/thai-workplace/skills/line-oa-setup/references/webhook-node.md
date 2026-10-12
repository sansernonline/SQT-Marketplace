# Minimal LINE webhook in Node.js (Express)

Verifies the signature on the raw body, answers 200 at once, replies to text with an echo. Node 18+ (global `fetch`).

```js
import express from 'express';
import crypto from 'node:crypto';

const SECRET = process.env.LINE_CHANNEL_SECRET;
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const app = express();

// keep the raw bytes — the signature is computed over them
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const expected = crypto.createHmac('sha256', SECRET).update(req.body).digest('base64');
  const given = req.get('x-line-signature') || '';
  const ok = given.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return res.sendStatus(401);

  res.sendStatus(200); // answer first, work after
  const { events = [] } = JSON.parse(req.body.toString('utf8'));
  for (const ev of events) handle(ev).catch(err => console.error('event failed', ev.type, err.message));
});

async function handle(ev) {
  if (ev.type !== 'message' || ev.message.type !== 'text') return;
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ replyToken: ev.replyToken, messages: [{ type: 'text', text: ev.message.text }] }),
  });
}

app.listen(process.env.PORT || 3000);
```

Notes

- The Verify button in the console sends an empty `events` array — the handler must still return 200.
- Do not log the full body in production (it contains `userId` and message text — personal data); log event type and id.
- The official SDK `@line/bot-sdk` does the same check with `middleware({ channelSecret })`.
