<!-- merged from skill `llm-engineering` on 2026-11-27 · description was: Use when a system calls an LLM with prompts or RAG -->
# llm-engineering — route to the guide for prompts, RAG, agent systems, or LLM evaluation

## Use when
- A system calls a Large Language Model (LLM): prompts, RAG (retrieval-augmented generation, which searches documents to ground the answer), agent systems, deep research agents, or quality measurement.
- A role for ML or LLM engineering is needed (agents `ai-engineer` · `data-engineer`).

## Steps
1. **Open only the one reference that matches the job** from the list below. Each file is already the full guide to its topic; do not read them all.
2. **If an agent is called in for this area,** it opens its own role file (list below) before starting.
3. **If run as a command** `/software-development:ai-engineering <rag-design | llm-eval> <details>`: read the first word of `the user's request`. If it names a mode, run that mode on the rest; otherwise pick the mode that fits and say which one you chose. Modes: `rag-design` (production-grade RAG with the `ai-engineer` agent: ingestion · chunking · embeddings · retrieval · re-ranking · evaluation) · `llm-eval` (eval set · metrics · regression tests with the `ai-engineer` agent). Full steps per mode: [`design-modes.md`](design-modes.md).

## Check before done
- [ ] Only the matching reference was opened; if run as a command, the answer says which mode was used.

## References
- [`prompt-engineering-patterns.md`](prompt-engineering-patterns.md) — open when designing or optimizing prompts, templates, few-shot, chain-of-thought, structured output.
- [`llm-evaluation-patterns.md`](llm-evaluation-patterns.md) — open when building eval sets and metrics, LLM-as-judge, A/B tests; needed for any production LLM app.
- [`agent-systems.md`](agent-systems.md) — open when building an agent inside a product: whether to use an agent, Loop · Graph · Dynamic workflows, round caps, human approval, framework choice, token cost.
- [`deep-research-system.md`](deep-research-system.md) — open when building a Deep Research Agent product: planner → queue → parallel workers → citation check → writer, budgets, sandbox, metrics.
- [`rag-architecture.md`](rag-architecture.md) — open when designing RAG: vector databases, chunking, hybrid search, retrieval quality, scaling.
- Role files, opened by the `ai-engineer` agent: [`agent-llm-architect.md`](agent-llm-architect.md) (LLM system design) · [`agent-prompt-engineer.md`](agent-prompt-engineer.md) (production prompts, eval suites) · [`agent-ml-engineer.md`](agent-ml-engineer.md) (ML models, training) · [`agent-mlops-engineer.md`](agent-mlops-engineer.md) (serving, CI/CD for ML, monitoring).
