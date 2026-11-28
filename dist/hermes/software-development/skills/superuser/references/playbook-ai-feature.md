# playbook · ai-feature — add an LLM feature measured by an eval set

Use when: "add a chatbot" · "summarise these with AI" · "RAG over our documents" · "improve the prompt" · "the AI answers are wrong" · an agent or MCP server inside the product (a quick try to learn if it can work at all → `prototype` first)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/data-ai.md`](../../dev-principles/references/data-ai.md) · [`references/security.md`](../../dev-principles/references/security.md)
Main skills: [`ai-engineering`](../../ai-engineering/SKILL.md) (`references/llm-evaluation-patterns.md` · `prompt-engineering-patterns.md` · `rag-architecture.md` · `agent-systems.md`) · `data-analysis` · `security-gate` · `pdpa-compliance` (personal data · voice recording · health data) · `test-automation` · `errors-and-logs`

## ขั้นตอน · Steps (copy into the todo as written)

1. Open [`references/data-ai.md`](../../dev-principles/references/data-ai.md) first. Write the one job the model does: input · output format · what counts as right · what a wrong answer costs (money · data · trust) · whether a plain rule or search would do it without a model · the money ceiling for eval runs and production calls, asked together with the brief at the start (the agent cannot raise it; unknown → `(รอยืนยัน · ผู้ใช้: เพดานค่าใช้จ่าย)`) · ใคร: หัวหน้าทีม
2. **Build the eval set before any prompt** — 20–50 cases from real work, including edge cases and inputs that try to make the model misbehave, each with the expected answer or a written grading rule, per `ai-engineering/references/llm-evaluation-patterns.md` · set the pass number and the latency ceiling now, inside the step 1 money ceiling, not after seeing results · ใคร: `ai-engineer` ตัวใหม่
3. Run the simplest version (one prompt, a pinned model version) against the set and record the score, cost per call and latency — this is the baseline · ใคร: `ai-engineer` ตัวใหม่ (pass in the saved eval set)
4. Improve one thing at a time (prompt · retrieval · model · tool) and rerun the whole set after each change · keep a change only when the score goes up and nothing else drops · for RAG, score retrieval apart from the answer · ใคร: `ai-engineer` ตัวใหม่ per change (pass in the eval set and the score log)
5. **Wire it in safely** — treat model output and retrieved text as untrusted data · validate the output format before use · no step that is expensive or changes data runs without a person's approval · a timeout and a fallback when the model fails · log input size, cost and latency per call without personal data (`errors-and-logs` · `security-gate`) · ใคร: `developer` ตัวใหม่
6. **Prove (พิสูจน์)** — rerun the full eval set through the real code path, not a notebook · run the injection cases from step 2 · check cost and latency against the step 2 ceiling (ตัดสินผลตาม [`references/data-ai.md`](../../dev-principles/references/data-ai.md) · [`references/security.md`](../../dev-principles/references/security.md)) · fail → back to step 4 · ใคร: `qa-tester` ตัวใหม่
7. **Check (ตรวจ)** the diff and the eval report: the set was not changed to make the score pass · the model version is pinned · no hidden step can act without approval · ใคร: `reviewer` ตัวใหม่
8. Deliver through playbook [`ship`](playbook-ship.md) with the eval set saved beside the code, so the next prompt change is measured the same way · finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Common excuses — read before skipping a step

| Excuse | Reality |
|---|---|
| "I tried 5 prompts by hand and it looks good" | 5 hand-picked inputs hide the cases that fail · without a fixed set, the next change breaks them silently |
| "Use the biggest model, then it will be fine" | Without a baseline you cannot tell if the cost bought anything |
| "Edit the eval case, the expected answer was strict" | Changing the test to pass hides the failure · change it only with the reason written down, then rerun everything |
| "The model only reads, so injection does not matter" | If it can read secrets and send text out, injected text can leak them |

## Done when

Eval score before and after, cost and latency are in the report and meet the step 2 numbers · injection cases pass · the eval set is committed beside the code
