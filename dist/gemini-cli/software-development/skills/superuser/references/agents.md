# Team lead · choosing an agent

## Team lead

**The agent the user talks to is the team lead.** There is one per project. It takes work on the user's behalf · manages `.claude/superuser/inbox/` · picks the playbook agent and the model level · checks each worker's result against the real thing before accepting it · is the only writer of the shared files (`CONTEXT.md` · `docs/BUILD-PLAN.md` · `IMPROVEMENTS.md`) · when workers conflict, decides and logs it in `decision-log`. Workers (subagents) do only the slice they are given, report back with what should be noted, do not talk to the user and do not direct other agents. The user ranks above the team lead and decides the `รออนุมัติ` (awaiting approval) items.

On big or long work, the lead coordinates and reviews and does not write large pieces of code itself (shared files and small pieces it may do itself). If context is nearly full or the model must be switched, make the handoff point per `handoff` section 5 first.

**Additions for code work** (moved from `superuser` section 5 · 2026-11-11)
- Parallel work goes in separate worktrees · the team lead alone writes `docs/BUILD-PLAN.md` · read the diff yourself before accepting · model levels for code work are in [`agents`](agents.md)
- **Read-only work** — most agents have file-writing tools. When sending a review or a find-the-answer task, write in the request "do not write or edit files".

## Agents by domain

The list of domain-specific agents in software-development and of agents in other plugins. Use it together with section 5 of `superuser`.

| Rule | Detail |
|---|---|
| **Domain-specific work** | Mobile app → `mobile-engineer` · Large Language Model (LLM) / Machine Learning (ML) → `ai-engineer` · data → `data-engineer` · finance → `fintech-engineer` · health → `healthcare-engineer` · online store → `ecommerce-engineer` · insurance → `insurance-engineer` · legal documents → `legaltech-engineer` · regulatory work → `fintech-compliance-officer` · `hipaa-officer` · `insurance-compliance-officer` · `legal-compliance-officer` · domain models and numbers → `quant-analyst` · `clinical-data-analyst` · `insurance-analyst` · `recommendation-engineer` · `revops-analyst` · Security Operations Center (SOC) and security incidents → `security-analyst` · conversion and store listing → `growth-specialist` · developer products → `devrel-engineer` · games → `game-developer` · `game-designer` · IoT → `iot-engineer` · blockchain → `blockchain-engineer` · taking apart things with no source → `reverse-engineer` · photos and illustrations in web, apps, slides → `graphic-design:image-artist` — each one opens its own domain skill before starting |
| **Everyday work** (when that plugin is installed) | Tax, payroll, Thai documents, LINE OA → `tax-helper` · `thai-doc-writer` · `line-admin` (e-commerce) · stocks and position size → `market-analyst` · `risk-manager` · budget, debt, personal tax, scammers → `money-planner` (trading-finance) · selling online → `shop-manager` · `customer-chat` (e-commerce) · personal errands → `life-admin` (personal-life) · home → `home-manager` (personal-life) · career → `career-coach` (personal-life) · health → `health-organizer` (personal-life) · consumer complaints → `consumer-advocate` (e-commerce) · visual work → `art-director` (graphic-design). If the work has several steps in that domain, hand it to that plugin's `/<plugin>:superuser`. If the plugin is not installed, tell the user it exists, then continue with general knowledge and the `ยังไม่ได้ตรวจ` (not yet checked) tag |

## Model levels for code work

- Apply the 3 rules of `superuser:superuser` section 5; the first match wins. Big `opus` = a piece that computes money amounts or tax · changes authorization or password checks · an irreversible migration · cross-system design · the final review of big or risky work — an agent set to `sonnet` (such as `developer`) is called with `model: opus` · Small `haiku` = mechanical work that has a pattern to follow, such as filling fixtures from a template · summarising a log under given headings (for renaming in many places, write a script) — no agent is set to `haiku` yet, so pass `model: haiku` yourself · Medium `sonnet` = everything else: writing features · fixing bugs, including hard root causes and concurrency (move up the ladder only after a miss) · first-round review · documents
- When a new model is released, update the `team` block (the original is in plugin `superuser`) and `model:` in `agents/*.md` · switching models across vendors is allowed after making the handoff point per `handoff` section 5

## Source

The idea comes from pstack by Lauren Tan (poteto) of Cursor, adapted to fit plugin `software-development`.
