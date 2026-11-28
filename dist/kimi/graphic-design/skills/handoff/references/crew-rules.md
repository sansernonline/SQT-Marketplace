# Team patterns — hard rules (from crew-patterns, merged into handoff 2026-11-28)

> **The one rule:** the lead picks the pattern without asking the user; workers never write to the same place; nothing is concluded before every worker is back and checked.

## Hard rules

- **agent-patterns:** The lead picks the style, without asking the user. If the user names a style, follow it; if not, choose from the table and write the chosen style at the end of the **เสร็จเมื่อ** line. Fits none → Loop, the simplest.
- **agent-patterns:** Do not turn on agent teams by default; use subagents. Say in the report only what changes a decision.
- **parallel-split-and-merge:** Split with no overlap: every part sits in exactly one piece, none repeated, none dropped. Fix one report format for every worker.
- **parallel-split-and-merge:** Never write to the same place. Each editing worker gets its own file or folder (code: one git worktree per worker). The combined summary is written by the main session alone.
- **parallel-split-and-merge:** Wait for all. Never conclude from the ones that finished first. A failed worker is released once more; if it fails again, record the piece as not checked. Serious items need a `file:line` (or page · link) the main session opened.
- **parallel-attempts-pick-best:** Every contestant gets the same task, because the task is the contract. The difference must come from somewhere (angle or model size), and each contestant has a separate delivery folder. Never paste a whole block from another entry; write the strong parts in so the result reads as one idea.
- **parallel-attempts-pick-best:** For taste work (icons · logos · looks · colors) ask for 2–3 examples the user likes before the contest.
- **adversarial-review-panel:** The output is a verdict, not a fix to the work. Verify every finding one at a time before it enters the report; confidence below 80 stays out.
- **adversarial-review-panel:** Cross-examination voters are always fixed at 3. If the `head:` does not match, or a reviewer failed, is still running or was cut, report it that way and never count it as clean.

## Check before done

- The chosen style is written in the **เสร็จเมื่อ** line.
- Pieces cover the whole task with no gap and no overlap.
- Every worker returned; failed pieces are marked not checked.
- Serious items were opened by the main session.
