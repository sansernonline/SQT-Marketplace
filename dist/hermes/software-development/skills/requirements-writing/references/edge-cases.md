# Errors and edge cases to answer in full

The test team uses this table, and most FSDs lack it. Go through every row that touches the feature, then write the answers into section 9 of the document.

| Case | Question to answer |
|---|---|
| No data | What does the empty screen show? Is there a button that points to the next step? |
| Very large data | How many items per page? How are they sorted? Can the user search? |
| Rapid repeated clicks | How do you prevent duplicate work? (See idempotency key in `api-design`) |
| Two people edit at once | Who wins? What does the other person see? (See ETag in `api-design`) |
| Connection drops midway | Is the entered data lost? Does a retry create a duplicate? |
| Session timeout | Does the user get kicked out at once, or is their input kept? |
| Boundary values | 0 · negative values · today · last day of the month · leap year |
| Unusually long text | Does a 200-character name break the layout? |
| Thai text and special characters | Does sorting work? Does search find it? Do emoji break anything? |
| External system does not respond | How many seconds to wait? How many retries? What does the user see meanwhile? |
| Insufficient permission | Visible but not clickable, or not visible at all? **Choose one clearly.** |
