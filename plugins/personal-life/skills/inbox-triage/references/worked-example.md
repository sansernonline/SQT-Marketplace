## Worked example

Monday, 63 unread. Ten minutes:
- 2 **verify** — "KBank: account suspended, click to confirm" (phish — report and delete) · courier "fee unpaid" SMS-style mail (delete)
- 3 **today** — boss asks for figures by 15:00 (slot 13:00–14:00) · school form due tomorrow (signed, replied) · landlord asks repair time (2-minute reply)
- 5 **this week** — dated tasks Wed/Thu
- 2 **delegate** — IT access request to the admin, logged
- 6 **file** — e-Tax invoices to `Receipts-Tax`
- 45 **archive** — 4 newsletters unsubscribed

## Priority scoring input

Run `node decide.mjs priority mail.json` with `{"method":"eisenhower","items":[{"name":"boss asks for figures","urgent":5,"important":5,"minutes":60},{"name":"school form due tomorrow","urgent":4,"important":4,"minutes":5},{"name":"landlord repair time","urgent":3,"important":3,"minutes":2},{"name":"vendor invoice query","urgent":2,"important":4,"minutes":20},{"name":"newsletter survey","urgent":2,"important":1,"minutes":15}]}`
