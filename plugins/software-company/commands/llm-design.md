---
name: llm-design
description: Design a RAG system or an LLM evaluation suite using the ai-engineer agent. Two modes — rag-design or llm-eval.
argument-hint: <rag-design | llm-eval> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `rag-design` | Design a production-grade RAG system using ai-engineer agent. Covers ingestion, chunking, embeddings, retrieval, re-ranking, and evaluation. |
| `llm-eval` | Design or run LLM evaluation suite using ai-engineer agent. Builds eval set, defines metrics, and creates regression test framework. |

---

## Mode: `rag-design`

Use the `ai-engineer` agent to design a RAG system for: **$ARGUMENTS**

The LLM architect should:

1. **Initial Discovery** — gather:
   - Document corpus (size, format, update frequency)
   - Query patterns (questions, who asks)
   - Quality bar (accuracy, citation requirements)
   - Latency budget
   - Cost budget
   - Privacy / data residency constraints

2. **Apply `llm-engineering` skill** for system design

3. **Design each stage:**

   **a. Ingestion**
   - Document parsing approach
   - Cleaning pipeline
   - Metadata extraction

   **b. Chunking**
   - Strategy selection (fixed/recursive/semantic)
   - Chunk size + overlap
   - Hierarchical (parent-child) if needed

   **c. Embeddings**
   - Model selection (cost/quality trade-off)
   - Dimension strategy

   **d. Vector DB**
   - Selection based on scale + features
   - Sharding / replication plan

   **e. Retrieval**
   - Hybrid (vector + keyword) recommended
   - Metadata filtering
   - Top-K strategy

   **f. Re-ranking**
   - Model selection
   - Position in pipeline

   **g. Context construction**
   - Token budget management
   - Citation format
   - Truncation strategy

   **h. Generation**
   - Prompt template (with citation requirement)
   - Refusal pattern (no answer in context)
   - Model selection per query type

4. **Design evaluation:**
   - Apply `llm-engineering` skill
   - Build initial eval set (50+ examples)
   - Metrics: faithfulness, relevance, context precision
   - Regression testing approach

5. **Plan production deployment:**
   - Indexing pipeline (initial + incremental)
   - Reindexing strategy when docs change
   - Caching layers
   - Monitoring (retrieval quality, latency, cost)
   - Fallback when retrieval fails

6. **Produce polished design document** using `polished-document-style` skill (from software-company):
   - System architecture diagram (Mermaid)
   - Tech stack with rationale
   - Data flow sequence diagram
   - Eval framework
   - Cost projection
   - Phased rollout plan
   - Risks + mitigations

7. **Hand-off suggestions:**
   - Data pipeline implementation → `data-engineer`
   - Production deployment → `ai-engineer`
   - Prompt optimization → `ai-engineer`
   - Application integration → `developer` (from software-company)

---

## Mode: `llm-eval`

Use the `ai-engineer` agent to design LLM evaluation for: **$ARGUMENTS**

The prompt engineer should:

1. **Initial Discovery** — gather:
   - Application type (classification, generation, RAG, agent, etc.)
   - Current prompt(s) and model(s) in use
   - Production traffic patterns (input distribution)
   - Quality concerns (where does it fail today?)
   - Existing eval set (if any)
   - Acceptable cost / latency for eval runs

2. **Apply `llm-engineering` skill** for framework design

3. **Build eval set:**

   **a. Seed examples (30-50 hand-crafted)**
   - 50% happy path
   - 20% edge cases
   - 15% safety / refusal
   - 10% multilingual (if applicable)
   - 5% known failure modes

   **b. Production traffic samples**
   - Sample 50+ from real traffic
   - Human label for ground truth
   - Identify slices that need coverage

4. **Choose metrics by task:**

   **Classification:**
   - Accuracy, F1, per-class precision/recall
   - Confusion matrix analysis

   **Extraction:**
   - Field-level accuracy
   - Schema validity rate
   - JSON parseability

   **Generation:**
   - LLM-as-judge (correctness, completeness, tone)
   - Semantic similarity
   - Length / format compliance

   **RAG:**
   - Faithfulness (grounded in context?)
   - Answer relevance
   - Citation accuracy

   **Agent:**
   - Task completion rate
   - Number of steps to completion
   - Tool selection accuracy

5. **Add operational metrics (always):**
   - Latency (p50, p95, p99)
   - Token usage (in/out)
   - Cost per call
   - Error rate

6. **Set up LLM-as-judge (if applicable):**
   - Use bigger model for judging
   - Validate with human correlation (target > 0.7)
   - Multi-dimension rubric

7. **Define regression criteria:**
   - Quality drop > X% → fail
   - Safety eval pass < 99% → fail
   - Latency p95 increase > Y% → fail
   - Cost increase > Z% → fail

8. **Produce polished eval document** using `polished-document-style` skill (from software-company):
   - Eval set documentation (categories, sources)
   - Metrics catalog with definitions
   - LLM-as-judge prompts
   - Baseline performance
   - Regression test integration (CI hook)
   - Monitoring dashboard spec

9. **Implementation suggestions:**
   - Run via promptfoo / LangSmith / DeepEval / RAGAS
   - Daily/weekly cadence for production sampling
   - Alert thresholds
   - Versioning strategy for eval set

10. **Hand-off suggestions:**
    - Implementation → `developer` (from software-company)
    - CI integration → `devops-engineer` (from software-company)
    - Production monitoring → `ai-engineer`
    - LLM system improvements → `ai-engineer`
