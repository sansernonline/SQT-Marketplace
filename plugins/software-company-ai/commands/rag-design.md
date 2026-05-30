---
description: Design a production-grade RAG system using llm-architect agent. Covers ingestion, chunking, embeddings, retrieval, re-ranking, and evaluation.
argument-hint: <use case, e.g., "customer support Q&A" or "internal knowledge base">
---

Use the `llm-architect` agent to design a RAG system for: **$ARGUMENTS**

The LLM architect should:

1. **Initial Discovery** — gather:
   - Document corpus (size, format, update frequency)
   - Query patterns (questions, who asks)
   - Quality bar (accuracy, citation requirements)
   - Latency budget
   - Cost budget
   - Privacy / data residency constraints

2. **Apply `rag-architecture` skill** for system design

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
   - Apply `llm-evaluation-patterns` skill
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
   - Production deployment → `mlops-engineer`
   - Prompt optimization → `prompt-engineer`
   - Application integration → `developer` (from software-company)
