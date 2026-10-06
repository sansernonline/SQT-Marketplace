---
name: llm-engineering
description: Use when a system calls a large language model — writing or tuning prompts, structured output, building a RAG pipeline (chunking, embeddings, vector search, re-ranking), or measuring LLM quality with eval sets and LLM-as-judge.
---

# llm-engineering

ทุกเรื่องของระบบที่เรียก LLM — prompt · RAG · การวัดคุณภาพ · และบทบาทวิศวกร ML/LLM

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or optimizing prompts for LLMs, building prompt templates, implementing few-shot learning, chain-of-thought reasoning, structured output, or systematic prompt improvement. Covers production patterns with concrete examples | [`references/prompt-engineering-patterns.md`](references/prompt-engineering-patterns.md) |
| building LLM evaluation systems, designing eval sets, choosing eval metrics, implementing LLM-as-judge, running A/B tests, or measuring LLM quality changes systematically. Critical for production LLM applications | [`references/llm-evaluation-patterns.md`](references/llm-evaluation-patterns.md) |
| designing Retrieval-Augmented Generation systems, choosing vector databases, designing chunking strategies, implementing hybrid search, evaluating retrieval quality, or scaling RAG. Covers production patterns from prototype to scale | [`references/rag-architecture.md`](references/rag-architecture.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| designing LLM-powered systems — choosing models, building RAG pipelines, designing agent systems, evaluation frameworks, multi-LLM routing, or large-scale LLM deployment. Focuses on system design, not individual prompts | [`references/agent-llm-architect.md`](references/agent-llm-architect.md) | `ai-engineer` |
| designing prompts for LLMs, optimizing existing prompts, building prompt chains, implementing structured output, designing evaluation suites, or systematically improving LLM application quality. Specializes in production-grade prompt engineering | [`references/agent-prompt-engineer.md`](references/agent-prompt-engineer.md) | `ai-engineer` |
| building machine learning models, training pipelines, feature engineering, model evaluation, hyperparameter tuning, or productionizing ML systems. Covers classical ML, deep learning, and the full model lifecycle | [`references/agent-ml-engineer.md`](references/agent-ml-engineer.md) | `ai-engineer` |
| productionizing ML models, building model serving infrastructure, implementing CI/CD for ML, setting up model monitoring, managing model registry, or scaling ML systems. Bridges ML engineering and production operations | [`references/agent-mlops-engineer.md`](references/agent-mlops-engineer.md) | `ai-engineer` |

## agent ของสายนี้

`ai-engineer` · `data-engineer`

## ที่มา

รวมจาก plugin `software-company-ai` (skill `prompt-engineering-patterns` · `llm-evaluation-patterns` · `rag-architecture`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`
