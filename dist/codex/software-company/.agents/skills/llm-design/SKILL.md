---
name: "llm-design"
description: "Design a RAG system or an LLM evaluation suite with the ai-engineer agent (rag-design or llm-eval)."
---

Two modes. Read the first word of **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `rag-design` | Design a production-grade RAG system using ai-engineer agent. Covers ingestion, chunking, embeddings, retrieval, re-ranking, and evaluation. |
| `llm-eval` | Design or run LLM evaluation suite using ai-engineer agent. Builds eval set, defines metrics, and creates regression test framework. |

---

## Mode: `rag-design`

Use the `ai-engineer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** corpus (size, format, update rate), who asks what, quality bar and citations, latency and cost budget, privacy and data residency
2. **Apply `llm-engineering` skill**, open `references/rag-architecture.md`
3. **Design stages 1-7** from that file: ingestion, chunking, embeddings, vector database, hybrid retrieval with metadata filters, re-ranking, context and prompt with citations and a "not in context" refusal
4. **Apply its Security section:** retrieved text is data, filter by the user's access at query time
5. **Design evaluation** with `references/llm-evaluation-patterns.md` (eval set 20-50 to start, 50+ before production)
6. **Plan production:** incremental indexing and re-indexing, caching, monitoring (retrieval quality, latency, cost), fallback when retrieval fails
7. **Produce polished design** using `polished-document-style`: architecture and sequence diagrams, stack with reasons, cost projection, phased rollout, risks
8. **Hand-off:** data pipeline → `data-engineer`, application integration → `developer`, production deployment → `devops-engineer`

---

## Mode: `llm-eval`

Use the `ai-engineer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** application type, current prompts and models, real input mix, where it fails today, existing eval set, cost and time allowed per eval run
2. **Apply `llm-engineering` skill**, open `references/llm-evaluation-patterns.md`
3. **Build eval set** per its Step 1: 20-50 hand-crafted to start, 50+ before production, plus labelled samples from real traffic
4. **Choose metrics by task** from its metrics tables, plus operational metrics (latency p95, tokens, cost, error rate)
5. **Set up LLM-as-judge** if needed, validated against human labels
6. **Define regression gates** (quality, safety, latency, cost) with numbers the user confirms
7. **Produce polished eval document** using `polished-document-style`: eval set, metric definitions, judge prompts, baseline, CI hook, monitoring
8. **Hand-off:** implementation → `developer`, CI integration → `devops-engineer`, production monitoring → `ai-engineer`
