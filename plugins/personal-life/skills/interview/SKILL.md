---
name: interview
description: Prepare for one interview — story bank, likely questions, mock round, thank-you note.
argument-hint: <company> <role> [round — hr|manager|technical|final] [th|en]
disable-model-invocation: true
---

Run the `interview-coach` agent with the `interview-prep` skill: **$ARGUMENTS**

1. Confirm company, role, round type, language and date.
2. Build 6–8 Situation, Task, Action, Result (STAR) stories mapped to the job requirements.
3. List the 10 most likely questions for this round, including expected salary and why you are leaving.
4. Offer a live mock round from the practice set — the lead runs it with the user, one question at a time, scored (`interview-coach` prepares the set, it never talks to the user).
5. Prepare 3 questions for the user to ask, and the thank-you note template.
