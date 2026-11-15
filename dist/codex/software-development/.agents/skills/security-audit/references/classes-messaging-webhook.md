# Class family: webhook · queue · background job · RPC

Open this when the system receives webhooks (payment · LINE · shipping · marketplace) · sends webhooks to other systems · has a queue or broker · has scheduled jobs · uses gRPC, GraphQL or WebSocket. Paste the chosen sections into the sub-agent brief whole. For webhooks from Thai providers in particular, use `classes-thai` alongside.

## Rules for this family

- Anyone who can send a message into a webhook or queue is an actor. Ask who can send (the whole internet · internal systems · other tenants) and how the code knows the sender is genuine.
- Check the signature on the raw bytes received, before parsing and before anything with effect. After the check, see what it is bound to (time · event id · shop).
- The same message can arrive twice, out of order, or after the state has already changed. The system must survive all 3 cases (`principle-safe-to-rerun`).
- A provider that resends when it gets no 2xx is no reason to accept everything before checking.
- A control outside the repo (an IP allowlist at the load balancer · a broker ACL) → `needs_validation`.

## Receiving webhooks

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `webhook-signature` | No signature check · checked after parsing and re-serializing · checked but not rejected on mismatch | The handler reads the parsed `req.body` before checking · `express.json()` wraps the route before the raw body is saved · `if (!valid) log(...)` and then carries on | A test sends a body with a wrong signature. It must get 401 and cause no effect | The check happens at a proxy inside the repo (you can verify this in a config file). A proxy outside the repo = needs_validation |
| `webhook-compare` | Compares the signature with `==` | `signature == expected` | Read the code. The real impact depends on network conditions, so it is usually low severity | The language or library already compares in constant time |
| `webhook-replay` | An old message with a valid signature is resent and has its effect again | No timestamp check in the signature · does not remember event ids already handled | Send the same message twice in the lab. See whether the state or the stock changes twice | The handler checks the current state before acting (for example, an order already paid is not processed again) |
| `webhook-trust-payload` | Trusts the amount, status or shop id from the payload without re-fetching from the provider's API, or without comparing against the order | `order.paid = body.status === 'successful'` with no look at the amount | Send a payload with a valid signature whose amount does not match the order (in the lab, with a fake secret) | The code fetches the status from the API by id and compares the amount with the order |
| `webhook-tenant` | Shop A's webhook changes shop B's data (multi-shop systems) | Finds the order by a reference from the payload without binding it to the shop's secret | Send a payload signed with shop A's secret that names shop B's order | Secrets are separate per shop, and the order is filtered by the shop that owns the secret |

## Sending webhooks and callbacks

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `webhook-ssrf` | A user can set the destination URL to an internal address | `fetch(shop.webhookUrl)` without checking the destination IP after resolve and after redirect | Set the URL to `http://127.0.0.1:<port>` in the lab. See whether the request goes through | The IP is checked after resolve and redirects are off |
| `callback-correlation` | A callback or reply is tied to the wrong request because the id is guessable or not bound to the user | The correlation id is a sequential number · the user is not compared when the result comes back | Send a callback with the id of another request | The id is long and random and bound to the session |

## Queue, job and ordering

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `duplicate-delivery` | One message arrives twice and stock is deducted, email is sent or credit is added twice | No unique key for the event · ack before the work is done, or the work is done but the ack fails | Send the message twice in the lab and count the effects | Every action is an upsert keyed by event id |
| `out-of-order` | An old message arrives late and overwrites a newer state (for example `pending` over `paid`) | Updates the status without comparing order or time | Send 2 messages in swapped order in the lab | The state machine refuses to move backward |
| `partial-transition` | The work stops halfway and leaves a state someone can exploit (paid but no order · stock deducted but no money) | Several steps with no transaction or compensating step | Make a middle step fail in the lab, then inspect the state | A compensating step exists and is tested |
| `queue-scope` | One tenant or service can subscribe or publish to another's topic | The topic name is built from input · one credential for every service | Check the ACL that lives in the repo. The rest is needs_validation | The broker is separate per tenant |
| `dlq-disclosure` | A dead-letter queue or the log of failed messages keeps personal data or secrets that a wide group can read | Stores the whole payload in the DLQ or in the error log | Make a message fail in the lab and see what is stored | The DLQ sits where the rights equal the main system's |
| `untrusted-producer` | A message from a low-rights sender is trusted as a control command (change rights, delete data) | The consumer follows the `action` field from the message without checking the sender | Send a message with an admin action from an ordinary producer in the lab | Only internal services can send into this queue (confirm in config) |

## RPC, GraphQL, WebSocket

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `rpc-interceptor-gap` | The rights interceptor covers some methods or paths but not all | The allowlist of methods that "need no check" is too broad · streams do not pass through the interceptor | Call the missed method as a user without rights in the lab | That method is public by design |
| `graphql-field-authz` | Rights are checked at the top-level query, but a nested field reaches someone else's data | A field resolver does not check · batch queries are unlimited | A nested query through a relation reaches another person's record | Every resolver uses a central checker |
| `stream-item-authz` | Rights are checked once when the stream or WebSocket opens, and later messages are not checked | Subscribes to any id after connecting | Connect, then subscribe to someone else's room | Every message is checked for rights on its resource |

## Method that works across the family

- For each entry point, ask 4 questions: who can send · how do we know it is genuine · what happens when it arrives twice · what happens when it arrives late or out of order.
- Compare the paths that do the same work: the webhook versus a "check status" page the user clicks · a scheduled job that pulls the status · an admin who confirms by hand. Every path must check equally.
