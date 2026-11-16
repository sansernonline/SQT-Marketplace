# Log line types in `log/<date>/runs.jsonl` · model-scorecard

| Line | What you get |
|---|---|
| `run` | When an Agent is ordered: agent type · the `model` ordered (not given = `inherit`) · the `resolved_model` actually used · `effort` (not given = `null`) · the step `step` · `async` · time · tokens if tool_response has them · `estimate_tokens` · `brief_sections` = how many of the 5 headings the brief has (goal · scope · done-when · rules or what to use · what to send back) · for work that waits for a result, it records `verdict` `round` `high` `mid` `low` |
| `result` | A subagent sends its report back: `verdict` (pass · fail · conditional) · `round` · `high` `mid` `low` = counts of high, medium, low items from the reviewer's report header line (not on that line = `null`) · the task-finished message gives the real total tokens (`total_tokens`) |
| `feedback` | The user rejects or accepts (`reject` · `accept`), inferred from wording, tagged `inferred` |
| `expect` | The team lead adds a `คาด:` (expected) line to `CONTEXT.md`: `size` · `workers` · `review_rounds` · `level` · `critical_k` · `width` (parsed from the words, the text is not stored) · caught from Edit and MultiEdit (new lines only) · Write and Bash commands that contain both `superuser/CONTEXT.md` and `คาด:` count only lines that carry today's date, so a `คาด:` line with no date written through these 2 routes is not recorded · the heading "คุ้มแค่ไหน" (how worthwhile) in `SUMMARY.md` is compared with the number of subagents and review rounds actually ordered after that line on the same day |
