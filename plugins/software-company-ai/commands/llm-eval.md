---
description: Design or run LLM evaluation suite using prompt-engineer agent. Builds eval set, defines metrics, and creates regression test framework.
argument-hint: <LLM application or prompt to evaluate>
---

Use the `prompt-engineer` agent to design LLM evaluation for: **$ARGUMENTS**

The prompt engineer should:

1. **Initial Discovery** — gather:
   - Application type (classification, generation, RAG, agent, etc.)
   - Current prompt(s) and model(s) in use
   - Production traffic patterns (input distribution)
   - Quality concerns (where does it fail today?)
   - Existing eval set (if any)
   - Acceptable cost / latency for eval runs

2. **Apply `llm-evaluation-patterns` skill** for framework design

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
    - Production monitoring → `mlops-engineer`
    - LLM system improvements → `llm-architect`
