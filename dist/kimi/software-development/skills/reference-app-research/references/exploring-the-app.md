# Exploring the app yourself · reference-app-research

Lessons if you actually used the app (explored it yourself, not read reviews). They come from exploring 6 real web chapters (Week 03 of Teaching_CWN2026):

- **A read-only source shows only the first state** (22 of 300 items; rules and duties that appear after a click all vanish). "Could not find it" does not mean "it does not exist". You must really click too.
- **Set a charter before exploring** (who · what · scope · lines not to cross) and finish with an honest list of "not tried". Note oddities as questions, do not conclude on your own.
- **Tag every item with its evidence**: [O] seen in person · [R] common sense not yet tried · [E] evidence from the system. An item that agrees from 2 angles (the button cannot be pressed + the minimum value in the DOM) can be trusted. One angle is half trusted, and you write that down.
- **5 exploration techniques**: normal path · edge values · combined conditions · go and come back · odd things (found a rule whose conditions are AND, and found that pressing load-more and coming back made the list disappear).
- **Numbers are tied to time.** Note the date collected. For data that changes over time, compare structure and rules, not numbers. When explorers conflict, put in both values with the time, then move the item to a question. Do not guess.
- **Split the exploration in parallel**: each explorer uses its own charter · folder · browser · a results table of the same schema (with a column for the text seen on screen as a common language). Then the lead merges. Count a duplicate once and credit every source (in the real round, 4 parts took 94 minutes in total, 53 minutes of real waiting).
- **1 explorer = 1 browser.** Subagents that run at the same time must not use the same Playwright MCP: they get the same browser and tab, results mix, and even an identical inline MCP setup may be merged into one process. Give each its own browser, for example `playwright-cli -s=<agent name>` (cited from an issue document the instructor keeps, not yet tried ourselves).
- **If the builder and the examiner use the same notes, the result is biased.** The exam will use the same button names as the app.
