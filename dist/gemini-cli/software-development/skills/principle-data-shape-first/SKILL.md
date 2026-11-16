---
name: principle-data-shape-first
description: Use when logic crosses functions or modules
---

# principle-data-shape-first — get the data shape first and the code follows

> **One rule:** most messy code comes from the wrong data shape from the start; with the right types and data structure, most `if`s disappear by themselves.

## Use when

- Logic crosses functions or modules
- Starting a feature or new project: the `feature` and `new-project` playbooks write the data shape into the todo before starting

Not for: a one-off script, or a change inside a single function that does not change the data shape · a new table → `database-design` · APIs → `api-conventions`

## Steps

1. **Before the first line, answer 4 questions** and write the answers as a real type or schema, not in your head:
   - What is the main data of this work, and what fields does it have?
   - How many possible states are there? Use one union or enum instead of several booleans that can contradict each other.
   - Where does data enter from outside the system? Use a single point that parses and validates, then trust the types inside.
   - Who writes this data at the same time? Separate them so they do not share; use a lock or queue only when there truly must be a single writer.
2. **Make an invalid state impossible to create:** `{ status: 'paid', paidAt }`, not `isPaid` + `paidAt?` that can contradict.
3. **Give a value with meaning its own type:** `OrderId`, not a bare `string`. For money use an exact decimal type, never float; in the database `decimal(19,4)` per `stack-sql`; integer satang only in memory or in JSON sent to a payment gateway that asks for it.
4. **Put business rules in the structure:** a map table, state machine or lookup instead of repeating `if (type === ...)` across files.
5. **Validate when data enters** (CLI · config · requests · files · external APIs): convert with a schema on arrival so inner code does not re-check null.
6. **Do not lie to the compiler:** no `any` · `as` · `!` just to make it compile; a `switch` covers every case with an exhaustive check.
7. **Take types from one source:** generate from the database schema or OpenAPI, do not rewrite by hand.
8. **When a new requirement does not fit the old shape,** design the new shape as if you had known from day one; do not bolt on another flag.

## Check before done

- The 4 questions have written answers (type or schema)
- No pair of booleans can contradict each other; no `any` · `as` · `!` added to compile
- Outside data is parsed at a single entry point
