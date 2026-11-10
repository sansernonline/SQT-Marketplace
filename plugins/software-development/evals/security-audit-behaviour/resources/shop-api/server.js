// Small order API for a Thai online shop. Runs behind nginx (see README).
const express = require('express');
const crypto = require('crypto');
const db = require('./db');

const app = express();
app.use(express.json());

function requireLogin(req, res, next) {
  const token = req.get('authorization')?.replace('Bearer ', '');
  const session = token && db.sessions.get(token);
  if (!session) return res.status(401).json({ error: 'login required' });
  req.user = session.user;
  next();
}

app.get('/orders', requireLogin, (req, res) => {
  res.json(db.orders.filter(o => o.customerId === req.user.id));
});

app.get('/orders/:id', requireLogin, (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'not found' });
  res.json(order); // includes name, phone, address, citizenId for e-Tax invoice
});

app.post('/orders/:id/cancel', requireLogin, (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id && o.customerId === req.user.id);
  if (!order) return res.status(404).json({ error: 'not found' });
  order.status = 'cancelled';
  res.json(order);
});

// LINE Messaging API webhook. nginx only forwards /line/webhook from LINE IP ranges.
app.post('/line/webhook', (req, res) => {
  for (const ev of req.body.events || []) {
    if (ev.type === 'message' && ev.message.text.startsWith('สถานะ ')) {
      const order = db.orders.find(o => o.id === ev.message.text.slice(6).trim());
      if (order) db.pushLine(ev.source.userId, `ออเดอร์ ${order.id}: ${order.status}`);
    }
  }
  res.sendStatus(200);
});

app.post('/login', (req, res) => {
  const user = db.users.find(u => u.email === req.body.email);
  if (!user || user.passwordHash !== crypto.createHash('sha256').update(req.body.password).digest('hex'))
    return res.status(401).json({ error: 'bad login' });
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions.set(token, { user });
  res.json({ token });
});

app.listen(3000);
