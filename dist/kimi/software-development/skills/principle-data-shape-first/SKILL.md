---
name: principle-data-shape-first
description: Use when logic crosses functions or modules
---

# principle · data shape first — get the data shape first and the code follows

> Most messy code does not come from hard logic but from the wrong data shape from the start
> With the right types and data structure, most `if`s disappear by themselves

## Before writing the first line, be able to answer 4 questions

| Ask | What you get |
|---|---|
| What is the main data of this work, and what fields does it have | a type or schema actually written out, not in your head |
| How many possible states are there | one union or enum, instead of several booleans that can contradict each other |
| Where does data enter from outside the system | a single point that parses and validates, then trust the types inside |
| Who writes this data at the same time | separate them so they do not have to share, then use a lock or queue only when there truly must be a single writer |

## Rules

- **An invalid state must be impossible to create** — `{ status: 'paid', paidAt }`, not `isPaid` + `paidAt?` that can contradict
- **A value with meaning gets its own type** — `OrderId`, not a bare `string` · for money use an exact decimal type and never float · in the database use `decimal(19,4)` per `stack-sql` · integer satang is allowed only in memory or in JSON sent to a payment gateway that asks for it
- **Business rules live in the structure, not scattered as `if`s** — use a map table · state machine · lookup instead of repeating `if (type === ...)` across files
- **Validate when data enters the system, then trust it inside** — data from the CLI · config · requests · files · external APIs: convert with a schema the moment it arrives, so inner code does not re-check null
- **Do not lie to the compiler** — no `any` · `as` · `!` just to make it compile, and a `switch` must cover every case with an exhaustive check
- **Types come from one source** — generate from the database schema or OpenAPI, do not rewrite them by hand
- **A new requirement does not fit the old data shape** — design the new shape as if you had known from day one, do not bolt on another flag

## In the work

The `feature` and `new-project` playbooks say to write the data shape into the todo before starting · for a new table use `database-design`, and for APIs use `api-conventions`

## When not to do this

A one-off script, or a change inside a single function that does not change the data shape
