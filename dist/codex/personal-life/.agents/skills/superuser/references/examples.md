# Examples for this plugin — model tiers · autonomy · team patterns

The rules are in `superuser:superuser` (the core). This file holds examples only.

## Model tiers — example jobs

The rules, model names and mid-task switching are in `superuser:superuser`. This file holds only example jobs for each tier.

Tiers run from top to bottom under the core's 3 rules, and the first match wins (large → small → medium). **Large** `opus` — every piece that touches money, health, law or account security: check an email suspected to come from a scammer · find why a bill went up · compare quotes whose scope differs · negotiate with several offers · set up elder care · build a symptom timeline · check that health work stays in scope. **Small** `haiku` — mechanical work that has a pattern to follow: put appointments in the calendar from a list · search documents and report. **Medium** `sonnet` (everything else) — plan a career change · triage the inbox · summarise a long meeting · find weak points in a CV · explain a hard paper · design a learning path · check sample code.

## Autonomy — reversible work and sources

| Found | Do |
|---|---|
| Reversible work: draft messages · draft a CV · draft tables and cards · build a table · organise a folder in a reversible way · set up a reminder file · rehearse an interview · write sample code in a practice folder · install packages in the project folder or a virtual environment | Do it now |
| Public fact not known (visa conditions · service cancellation steps · electricity and water rates · welfare entitlements · car tax renewal steps · free health-check entitlements · physical activity guidelines · market salary · labour law entitlements) | Search it yourself. Go through sources in this order: websites of the relevant government agencies, state enterprises and embassies → the Royal Gazette and the World Health Organization → reports that name the publisher and year → news outlets. Usable under the 3-source rule in `superuser:superuser` section 6 |
| Technology fact not known (latest version · changes · exam format) | Search it yourself. Go through sources in this order: official docs and release notes → standards (RFC) → the repo or blog of the tool's maintainers. Not social media |

## Team patterns — how each is used in this work

How to run each pattern, its cost and its traps are in `agent-patterns`.

| Pattern | How it is used here |
|---|---|
| **Planning** | Weekly review → 3 key items → one at a time · 12-month home calendar → one job at a time · medication and appointment list → table → reminders · job-application playbook → todo, one step at a time · learning milestones → one step at a time |
| **ReAct** | Triage email → open and read → group · read bills → compare 3 months → find the cause · pick from the medicine label → compare with the photo again → fix · draft a CV → check keywords against the job ad → fix · write sample code → run → read the result → fix |
| **Reflection** | A new `reviewer` (read-only, not the agent that did the piece) checks that no email was missed · compares figures in the table with the real bills · checks every row against the medicine label and looks for sentences that go beyond scope · reads the CV like an HR person before sending · reruns sample code from scratch |
| **Multi-Agent** | `meeting-prep` → `life-admin` → `doc-caretaker` pass on work from a meeting · `home-manager` does bills and the house · `family-planner` does meals and school · health gets 1 agent per person in the household so data does not mix · `career-coach` makes the CV → `interview-coach` uses the CV to prepare for interviews · `tech-mentor` paper-reading piece → code-writing piece → summary piece |
| **Mixture-of-Agents (MoA)** | Big decision → 3 angles: money · time · risk, then merge into the decision journal · contractor quote → 3 angles: price · scope · risk · starter exercise plan → 2–3 versions, then pick the most doable (not used for medicine or symptoms) · 2 job offers → 3 angles: total pay for the year · growth · risk · explain a hard idea → 3 versions (comparison · code · picture), then pick the clearest |
| **Reranker** | 30 emails → score urgency and impact → answer only the top 5 today · dozens of menus or shops → score budget · time · nutrition → pick 7 a week · several health-check packages → score by entitlement held · price · distance → pick 3 · dozens of job ads → score by matching experience · salary · location → pick 5 · dozens of release notes → score impact on the project → keep 5 |
