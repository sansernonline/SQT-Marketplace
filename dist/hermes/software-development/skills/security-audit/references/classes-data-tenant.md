# Class family: multi-customer data and data lifecycle

Open this when data from several shops, branches or customers lives in one database · there is export · backup · import · deletion or restore · a cache, search or analytics store keeps copies. Paste the chosen sections into the sub-agent brief whole. For a multi-tenant SaaS system, read the design principles in `domain-systems` alongside.

## Rules for this family

- A `shop_id` or `owner_id` column in a table does not mean the data is separated. Find which query · key · path or policy enforces it, on every read and write path.
- Follow every copy: a safe primary store can still leak from a cache · search index · export file · log · backup · preview image, each of which checks rights differently.
- Deletion and revoking rights are promises. Check the current data, history, cache, index, exports already sent, and jobs in the queue.
- A privacy preference or a retention period is not yet a vulnerability. There must be a boundary the system promised, and someone without rights must really be able to cross it. For legal retention periods, hand off to `pdpa-compliance`.
- Always prove it with 2 fake tenants in the lab. Never use real data.

## Data separation

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `idor` · `tenant-scope` | Reads or edits a record by id without filtering on owner or shop | `findById(id)` · `WHERE id = ?` with no `AND shop_id = ?` · a central repository that takes no tenant | A test where tenant A asks for B's id must get 403 or 404 | A global filter already wraps it (EF `HasQueryFilter` · Prisma middleware · Postgres RLS). Open it and confirm it really covers this query |
| `key-collision` | A cache key, file key or unique index leaves out the tenant, so keys collide | `cache.get('orders:' + id)` · `UNIQUE(code)` that should be `UNIQUE(shop_id, code)` | Two shops create the same code. Check whether they see each other's data | Ids are UUIDs across the whole system and cannot collide |
| `policy-query-mismatch` | Rights are checked on one condition, but the query fetches on another | Checks `user.shopId`, then the query uses `req.body.shopId` | A test sends another shop's shopId in the body | The body value is overwritten by the session value before the query |
| `signed-url-scope` | A signed file link lives too long, is too broad or can be guessed | `expiresIn` in days or missing · file paths are sequential numbers | Check the lifetime of links created in the lab · change the number in the path | The file is public on purpose (product images) |

## Copies and indirect disclosure

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `search-acl-drift` | A search index or cache does not filter rights the way the database does | Searches Elasticsearch or Meilisearch with no tenant filter | Two shops search the same term in the lab | The index is separate per shop |
| `log-pii` | Personal data or tokens land in logs, traces or analytics that a wider group can read | `logger.info(req.body)` · sends a whole event object to analytics | Call the endpoint in the lab, then search the logs for ID card numbers, phone numbers, tokens | The log is readable only by people with the same rights (still a PDPA matter, hand off to `pdpa-compliance`) |
| `enumeration` | Error messages, timing or response size differ enough to count which records or users exist | `404` versus `403` differing by existence · a sign-up form that says "this email already exists" | Compare responses for an id that exists and one that does not | The countable data is not secret (public shop names) |
| `aggregate-oracle` | A summary report or filter can be used to guess individual values | A group with one person · sort by a hidden field | Query a small group in the lab and see whether it yields a per-person value | The system already sets a minimum group size |

## Export, import, backup, migrate

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `export-scope` | Export returns data beyond the user's rights, deleted data or drafts | The export query differs from the screen's query · no `deleted_at IS NULL` condition | Export with a low-rights account in the lab and count the rows | The export belongs to the system admin by design |
| `import-abuse` | Import overwrites someone else's record, or creates records that skip validation or cross shops | Upsert by id from the file · does not call the same validator as the form | Import a fake file that carries another shop's id | Import works within one shop and always overwrites shop_id |
| `restore-authz` | Restore or rollback brings back old rights or old data | Restores the whole row including `role` or `owner_id` | Lower a user's rights, then restore the old record | Restore keeps content only and does not touch rights |
| `migration-default` | A migration fills a default that leaves records with no owner or owned by everyone | `DEFAULT NULL` on `shop_id` where queries read null as every shop | Run the migration in the lab, then query as another shop | The defaults are fully filled in by the next migration right away |

## Deletion, revocation and data age

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `soft-delete-bypass` | A soft-deleted record can still be opened by id or through another API | `deleted_at` is filtered on the list page but not in `findById` | Delete, then call by id in the lab | The system promises recovery within a set time, and the caller is the owner |
| `stale-authz` | After rights are removed or an employee is deleted, the session token or rights cache still works | Rights live in a long-lived JWT · the rights cache is not cleared on change | Remove the rights, then use the old token in the lab | Tokens are short-lived as the system states, and that window is accepted in writing |
| `queued-after-delete` | A queued job still emails or processes data of someone who asked for deletion | The job reads from a payload copied earlier, not from current state | Delete the user, then release the pending job in the lab | The job checks current state before every run |

## Method that works across the family

- Pick 1 important record type and map every path: write · read · cache · index · event · export · backup · delete · restore. For each path, write who acts and where the tenant is checked.
- Start from the paths that often carry no user identity: background jobs · migrations · clients that bypass the API · system-wide unique indexes · cache keys.
- Repeat the 2-shop test after changing rights, deleting, switching accounts and restoring.
