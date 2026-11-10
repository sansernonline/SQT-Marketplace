> Building agent systems inside a client's product: when not to use an agent, the 3 workflow shapes (Loop · Graph · Dynamic), the mechanisms each one needs, which framework to pick in 2026, cost, field cases and safety. All sources opened 2026-10-26.
>
> This file is about agents **in the product we ship**. How our own agent team works (SuperUser) is a different topic → `superuser:agent-patterns`.

**Contents:**

- [1. Before you pick an agent](#1-before-you-pick-an-agent)
- [2. Who holds the plan](#2-who-holds-the-plan)
- [3. Loop](#3-loop)
- [4. Graph](#4-graph)
- [5. Dynamic](#5-dynamic)
- [6. Mechanisms that always come together](#6-mechanisms-that-always-come-together)
- [7. The checker must be real](#7-the-checker-must-be-real)
- [8. Choosing a framework (2026)](#8-choosing-a-framework-2026)
- [9. Token cost and sizing the effort](#9-token-cost-and-sizing-the-effort)
- [10. Field cases](#10-field-cases)
- [11. Safety](#11-safety)
- [12. Sources](#12-sources)

Evidence tags, kept from the research notes: no tag = the linked page says it · `อนุมาน` = our inference, the page does not use that name · `(ยังไม่ได้ตรวจ)` = not checked. Company numbers are self-reported; no independent audit.

## 1. Before you pick an agent

Start with the simplest thing that works, and add complexity only when you can measure that it helps. Many tasks need one model call with retrieval and nothing else ([A1]).

| Situation | Build this, not an agent |
|---|---|
| One answer, no follow-up steps | One model call (with RAG if needed) |
| Steps are known in advance and fixed | A chain in code, with checks between steps |
| Pieces are known and independent | Parallel calls in code, then merge |
| The pieces share most of their context, or depend on each other heavily | One agent in one conversation, not a team |
| Low-value task | One call. A multi-agent run costs about 15 times a chat ([A2]) |

Use an agent (the model picks its next step) only when the path cannot be written down in advance, and give it a sandbox and guardrails. More autonomy brings "higher costs and compounding errors" ([A1]).

**When multi-agent did not work**

| Who | What failed | What they use instead |
|---|---|---|
| Cognition, "Don't Build Multi-Agents" (2025-06-12) | Sub-agents working in parallel without shared context. Flappy Bird example: one built a Mario-style background, another a bird that did not match. "Actions carry implicit decisions, and conflicting decisions carry bad results." They also dropped "big model explains the edit, small model applies it" | One continuous agent · a model that compresses history for long tasks · sub-agents only for narrow questions, not parallel code writing ([X1]) |
| Anthropic Research | Multi-agent is a poor fit when every agent needs the same context, when tasks depend on each other, for most coding work, for low-value tasks, and for real-time coordination | One agent, or multi-agent only for broad, parallel reading work ([A2]) |
| Replit | One ReAct agent holding many tools had a high error rate | Several agents, each with a narrow scope ([R3]) |
| Uber uReview | One prompt produced noisy, duplicate comments | Add a scoring-and-filter step, drop low-value categories ([R1]) |
| "Why Do Multi-Agent LLM Systems Fail?" (arXiv 2503.13657) | 1,600+ traces from 7 frameworks: benchmark gains from multi-agent "often minimal". 14 failure modes in 3 groups: system design · agents not coordinating · verification | A taxonomy for diagnosis, not a call to stop ([X2]) |

These do not contradict each other (`อนุมาน`): multi-agent wins were on reading or search work that splits cleanly, or work with an automatic evaluator. The warnings were about writing work where small decisions must stay consistent.

## 2. Who holds the plan

Workflow and agent differ in who decides the next step. A workflow follows a path the code defines; an agent lets the model choose ([A1]). OpenAI Agents SDK calls these orchestration via code and via LLM, and says the code version is "more deterministic and predictable, in terms of speed, cost and performance" ([O1]).

| Shape | Who decides the path | Use when | Typical framework feature |
|---|---|---|---|
| **Loop** | Fixed: make → check → fix, repeat | One piece of work with a clear pass/fail check | ADK `LoopAgent` · LangGraph conditional edge back to the same node · Dify Loop node |
| **Graph** | Drawn once at the start: steps, branches, fan-out, merge | Steps or pieces known in advance | LangGraph `StateGraph` · MAF `WorkflowBuilder` · Step Functions · CrewAI Flows |
| **Dynamic** | Decided at run time: a planner creates the tasks and may re-plan | Pieces cannot be known in advance (broad research, multi-file change) | LangGraph `Send` · MAF Magentic · ADK 2.0 dynamic nodes · CrewAI hierarchical |

Most real systems mix them: code or a graph holds the big structure, agents work inside the nodes (MAF agent vs workflow, CrewAI Flow vs Crew, Strands Swarm inside a Graph).

## 3. Loop

**Use when** there is a clear check and extra rounds measurably help. Ask 2 questions first: can the model give useful feedback, and does that feedback improve the result ([A1])? Best with an outside signal such as tests, a compiler, a type check or search results. Reflexion reached 91% pass@1 on HumanEval vs 80% for GPT-4 by feeding test results back ([P2]).

**Do not use** a self-critique loop where the same model re-checks its own reasoning with nothing real to compare against. On GPT-3.5, self-correction made results worse: GSM8K 75.9 → 75.1 → 74.7, CommonSenseQA 75.8 → 38.1 → 41.8 ([P1]). In Self-Refine, ChatGPT's feedback said "everything looks good" on 94% of math items ([P3]). If you want confidence without a real check, vote over several answers: majority vote beat multi-agent debate on GSM8K at equal answer counts ([P1]).

**Rules**

- The critic answers in 2 forms only: specific feedback that can be acted on, or a fixed "pass" signal. Return it as structured output (pass/fail + feedback) and let code pick the edge ([G1]).
- If the writer is a small model, use a stronger or different critic. Vicuna-13B writing with ChatGPT critiquing raised math from 24.18% to 40.5% ([P3]).
- Round cap 3–5, and stop when 2 rounds in a row show no progress ([A1], [G1], [P3], [C2]). Gains shrink fast: Self-Refine constrained generation 29.0 → 40.3 → 46.7 → 49.7 (read from the paper's chart). Rounds 1–2 carry most of the gain (`อนุมาน`).
- Each round costs at least 2 model calls (critic + fix) (`อนุมาน`). Token cost per round from an official source (ยังไม่ได้ตรวจ).

## 4. Graph

**Use when** the steps form a fixed chain with programmatic gates between them, when independent pieces can run in parallel (sectioning), or when you want several answers to vote on ([A1]). For tool calls that depend on each other partly, a planner can emit a DAG and run ready tasks in parallel: LLMCompiler was up to 3.7x faster and 6.7x cheaper than ReAct, and up to about 9% more accurate ([P5]).

**Rules**

- Settle the data contract of each node before splitting: output schema and how parallel branches merge ([L2], [C2]).
- Give every state key an explicit merge rule. In LangGraph the default is overwrite; to collect results from parallel branches set a reducer such as `Annotated[list, operator.add]` ([L2]). Without it, branches overwrite each other (`อนุมาน` from the mechanism).
- Pass large results by reference (file or row id), not by pasting them back into the coordinator's context ([A2]).
- Each worker brief has 4 parts: objective · output format · tools and sources to use · task boundaries ([A2]).
- LangGraph pitfall: `Command(goto=...)` plus a static edge from the same node runs both paths ([L2]).

## 5. Dynamic

**Use when** the pieces cannot be predicted (orchestrator-workers) ([A1]), or the task has many steps that can be planned as a whole. Plan-and-execute is faster and cheaper than ReAct because the big model is not called on every step ([L4]); ReWOO used 5x fewer tokens and gained 4% on HotpotQA ([P6]). When sub-task difficulty varies, split only when the direct attempt fails: ADaPT raised success up to 28.3% (ALFWorld), 27% (WebShop), 33% (TextCraft) ([P7]).

**Do not use** when the steps are known and fixed: a chain or graph is more predictable in time and cost ([A1], [O1]).

**Re-plan only on a trigger:** a step failed · an intermediate result changed what needs doing · the plan finished and still has no answer ([L4], [P5], [P7]).

**Progress ledger (Magentic pattern).** Magentic-One's orchestrator keeps a task ledger (facts, guesses, plan) in an outer loop and a progress ledger in an inner loop ([R4], [F4]). Each round it answers 5 questions:

1. Is the request done?
2. Are we repeating ourselves (looping)?
3. Are we making progress?
4. Who acts next?
5. What exactly is the instruction to them?

If "no progress" or "looping" repeats, the stall count goes up. When it passes `max_stall_count` the orchestrator resets and re-plans; `max_reset_count` stops endless re-planning, and `max_round_count` caps the whole run ([F4]). The Magentic-One diagram uses stall count > 2 ([R4]). Plan review lets a person approve or send feedback at the start and at each re-plan: Python `enable_plan_review=True` (off by default), .NET `RequirePlanSignoff` (on by default) ([F4]). Microsoft notes it has not tested how well Magentic works outside its original 4 agents ([F4]).

Write the same ledger yourself when the framework has none (LangGraph, LlamaIndex custom planner): store it in state, make the 5 answers structured output, and let code read the stall count.

Keep the plan outside the context window: Anthropic's lead agent saves its plan to external memory so it survives context truncation past 200,000 tokens ([A2]).

## 6. Mechanisms that always come together

Every framework surveyed converged on the same 3 parts (`อนุมาน` across 5+ frameworks). Build all 3, whatever the shape.

**a) Round cap, separate from the pass condition.** The pass condition says "good enough"; the cap says "stop anyway". Never merge them into one test.

| Framework | Cap | Early exit when passing |
|---|---|---|
| LangGraph | `recursion_limit` (default 1000 super-steps since 1.0.6) · `RemainingSteps` lets a node take a fallback before the cap | conditional edge to `END` |
| Google ADK | `LoopAgent(max_iterations=N)` | tool `exit_loop` sets `tool_context.actions.escalate = True` |
| MAF Magentic | `max_round_count` · `max_stall_count` · `max_reset_count` | manager marks the task done |
| Strands | `set_max_node_executions()` · `set_execution_timeout()` · Swarm `max_handoffs` (default 20) | condition on edge |
| Dify | Maximum Loop Count | Loop Termination Condition · Exit Loop node |

ADK 2.0 warns that cycles in a graph have no automatic cap and recommends writing bounded loops as dynamic (code) workflows ([F2]). Strands Swarm also detects agents handing work back and forth (`repetitive_handoff_detection_window`) ([F6]).

**Stop rule for production agents:** stop at whichever comes first: round cap · token or money budget per task (`อนุมาน` · our own addition, the sources give only the round cap and the no-improvement rule) · 2 rounds with no improvement. Log which one fired.

**b) One merge point after fan-out.** Parallel results come back to one place with a defined rule: LangGraph `Send` + reducer · ADK `JoinNode` · MAF fan-in edge · CrewAI `and_()` (wait for all) or `or_()` (first wins) · Step Functions `Map` · LlamaIndex `ctx.collect_events`.

**c) Checkpoint + pause for a person + resume.**

- Persist state at step boundaries in a durable store. LangGraph in-memory savers vanish on restart; use `PostgresSaver` or similar in production ([L1]). Durability modes `exit` · `async` · `sync` trade speed for safety; tell the team which one you chose ([F1]).
- Pause before anything expensive or irreversible (API call that changes data, payment) ([L3]). APIs: LangGraph `interrupt()` + `Command(resume=...)` · OpenAI `needs_approval` → `result.interruptions` → `state.approve()` / `reject()` · ADK `RequestInput` · MAF `RequestInfoExecutor` · LlamaIndex `InputRequiredEvent` · Step Functions `.waitForTaskToken` (up to 1 year, use `HeartbeatSeconds`) · Dify Human Input · n8n human review on the tool.
- On resume, LangGraph re-runs the interrupted node from its start, so side effects before `interrupt()` must be idempotent or moved after it ([L3]). LlamaIndex recommends splitting "ask" and "receive answer" into separate steps for the same reason ([F7]).
- OpenAI `RunState.to_json()` is not authenticated: load it only from a store you trust ([O3]).
- Resume should skip finished work. That only works when the order of calls is the same on every run, so no clock reads or random values in orchestration code (Temporal, ADK, Claude Code workflows all require this) ([C2]). Long-running and approval-waiting runs → durable workflow in [`background-jobs`](../../background-jobs/SKILL.md) section 9.

## 7. The checker must be real

The most repeated lesson across field cases: the check that ends a loop or accepts a result must touch the real world, not a model praising itself.

| Who | Real checker |
|---|---|
| AlphaEvolve | Runs each candidate program and scores it automatically ([R5]) |
| LinkedIn SQL Bot | Checks tables and fields exist, runs `EXPLAIN`, then self-corrects ([R2]) |
| GitHub Copilot coding agent | Runs tests and linters in a throwaway Actions environment ([R6]) |
| Claude Code | Tests · build · screenshot compared with the design ([C3]) |

Warnings: AI co-scientist's Elo score is not independent truth (its authors say so), and AI Scientist's LLM reviewer still compared numbers wrongly ([R7], [R8]). An LLM judge is fine for scoring output quality; it is not a substitute for running the code. Over-strict critics hurt too: Uber found false positives made developers stop trusting the tool, so they kept fewer, sharper comments ([R1]).

## 8. Choosing a framework (2026)

**Status changes that affect the choice**

- **AutoGen is archived**: no bug or security fixes. New work starts on Microsoft Agent Framework (MAF) ([F5]).
- **Semantic Kernel → MAF**: the repo says "Semantic Kernel is now Microsoft Agent Framework". MAF 1.0 GA on 2026-04-03 for .NET and Python; Go is public preview; Magentic in .NET is still experimental (`MAAIW001`) ([F4]).
- **Amazon Bedrock Agents (now "Agents Classic") is in maintenance mode**: closed to new accounts from 2026-07-30; AWS points to AgentCore ([F8]).
- **Google ADK 2.0** moved from template agents (`SequentialAgent`, `LoopAgent`) to graph and dynamic workflows. TypeScript is announced GA; Python and Go ship in v2.0.0 but the page does not say GA ([F2]).
- `langgraph-supervisor` is no longer maintained ([F1]).

**Pick by team language** (whole table `อนุมาน`: built from the docs, not from building each one)

| Team uses | Pick first | When | Avoid or watch |
|---|---|---|---|
| Python | **LangGraph** | Clear graph · fan-out by count · checkpoint to Postgres · approval across days | Re-plan is yours to write |
| Python | **MAF** | Open-ended work that needs re-planning (Magentic), or the client is on Azure / Foundry | Magentic unproven outside its original agents · never start new work on AutoGen |
| Python | **Google ADK 2.0** | Gemini or Google Cloud · bounded loops written as code | Python GA not stated on the page |
| Python | **CrewAI** | Small team wants readable Flows (`@router` / `@listen`) | `@persist` durability in production (ยังไม่ได้ตรวจ) |
| Python | **OpenAI Agents SDK + Temporal** | Long jobs that must not be lost (finance, official documents) | The integration is Public Preview |
| TypeScript | **OpenAI Agents SDK** (`@openai/agents`) | Handoffs and tool approval in a web app | No graph built in |
| TypeScript | **Google ADK TS 2.0** | Graph + dynamic, announced GA | Tied to the Google ecosystem |
| TypeScript | **Strands Agents** or **LangGraph JS** | On AWS (Strands) or matching a Python LangGraph team | Some Strands features are Python-only · LangGraph JS (ยังไม่ได้ตรวจ) |
| TypeScript | **Claude Agent SDK** | Agents that edit files and run commands | Not a graph engine |
| .NET | **MAF** | The one GA option on .NET with `WorkflowBuilder` + checkpoint + Magentic | Magentic experimental on .NET · never start new work on Semantic Kernel |
| No code | **Dify** | Loop with pass condition + Human Input by email; business team edits it | Self-hosting limits and PDPA (ยังไม่ได้ตรวจ) |
| No code | **n8n** | Many existing integrations (LINE, Gmail, Sheets) and approval before risky tools | Loop node (ยังไม่ได้ตรวจ) |
| Long jobs that must never be lost | **Temporal** or **AWS Step Functions** around the agent | Fixed steps · fan-out to tens of thousands (Distributed `Map`) · approval by task token | Bedrock Agents Classic: do not start new; use AgentCore |

Not checked yet: CrewAI Flow loop syntax, n8n loop/if/merge nodes, Dify parallel iteration, Semantic Kernel Process Framework, Bedrock AgentCore multi-agent, GA status of CrewAI, Strands and LlamaIndex Workflows (ยังไม่ได้ตรวจ).

## 9. Token cost and sizing the effort

- A single agent uses about 4 times the tokens of a chat; a multi-agent system about 15 times. Token volume alone explained 80% of the performance difference on BrowseComp ([A2]). The task has to be worth that.
- Agents "struggle to judge appropriate effort", so put the sizing rule in the prompt ([A2]):

| Task | Effort |
|---|---|
| Simple fact finding | 1 agent, 3–10 tool calls |
| Direct comparison | 2–4 sub-agents, 10–15 calls each |
| Complex research | More than 10 sub-agents |

- Anthropic's early failures: 50 sub-agents for a simple question, endless searches for sources that do not exist, duplicated work, searching on after enough was found ([A2]).
- Route simple requests away from the expensive path (Klarna and AppFolio cut tokens with routing and situation-specific prompts) ([R9], [R10]).
- Try on a small slice before a big run, and set caps on agent count and tokens. Claude Code warns above 25 agents or about 1.5 million tokens ([C2]).
- Rewriting tool descriptions with an agent's help cut task time by 40% ([A2]).

## 10. Field cases

| Company · product | Shape | Mechanism | Result (self-reported) | Tag |
|---|---|---|---|---|
| Anthropic · Research in Claude ([A2]) | Dynamic + Loop in workers | Lead (Opus 4) plans, saves plan to memory, spawns Sonnet 4 workers to search in parallel, decides whether to spawn more; CitationAgent at the end | 90.2% better than single Opus 4 on internal eval · up to 90% less time on complex questions · about 15x chat tokens | from source |
| LinkedIn · SQL Bot ([R2]) | Graph + Loop | LangGraph · intent routing · retrieve 20 tables, LLM re-ranks to 7 · planner writes query step by step · validator checks tables and runs `EXPLAIN` · self-corrects | About 95% of users rate accuracy "Passes" or better · usage up 5–10x inside DARWIN · "Fix with AI" is 80% of sessions | LangGraph from source · Graph/Loop label `อนุมาน` |
| Uber · uReview ([R1]) | Loop + Graph | 3 assistants (bugs, practices, security) comment in parallel → second prompt scores and filters → dedupe → drop low-value categories → developer feedback | Over 90% of about 65,000 diffs a week · 75% of comments marked useful · over 65% acted on (human comments 51%) · about 1,500 hours saved a week | `อนุมาน` (source says generate, grade, filter) |
| Klarna · AI Assistant ([R9]) | Graph (routing) | Multi-agent on LangGraph, routes by request type, LangSmith tests | Resolution time down 80% · about 70% of repetitive work automated · 85 million users (over 9 months) | from source (vendor page) |
| Google DeepMind · AlphaEvolve ([R5]) | Loop (evolutionary) | Gemini proposes programs → automatic evaluator runs and scores → program database → selection | Borg heuristic recovers 0.7% of Google's compute on average · Gemini matmul kernel 23% faster | from source |
| Microsoft · Magentic-One ([R4]) | Dynamic | Task ledger + progress ledger, re-plan when stalled | Close to state of the art on GAIA and AssistantBench at the time | from source |
| GitHub · Copilot coding agent ([R6]) | Loop + human approval | Throwaway environment · tests and linter · draft PR · cannot approve or merge its own work · CI waits for a person · pushes only to `copilot/*` | No outcome numbers | Loop `อนุมาน` |
| Replit · Replit Agent ([R3]) | Dynamic + human approval | Manager · editor · verifier; verifier often stops to ask the user; auto-commit at each big step for rollback | No outcome numbers; "We don't strive for full autonomy" | from source (vendor page) |

Reported failures worth designing against: Magentic-One retried a wrong login until the account was locked, then tried to reset the password, and reached out to real people by social media and email until stopped ([R4]). AI Scientist edited its own code to call itself endlessly and extended its own timeout instead of making the code faster ([R8]).

Thai deployments: KBTG (AthenaMind) appears only in press coverage with no mechanism described, so it is not counted (รอยืนยัน).

## 11. Safety

- **Tool output is data, not instructions.** Text returned by a tool, web page, email or database row that tells the agent to do something is shown to the user, never executed. Test it: the third eval case in [`mcp-server`](../../mcp-server/SKILL.md) section 7 plants an instruction in returned data.
- **A person approves before anything irreversible**: payments, sending messages, deleting data, merging code. Bind approval to the tool (OpenAI `needs_approval`, n8n human review), not only to the whole run. Copilot cannot merge its own PR and CI does not run until a person approves ([R6]).
- **Narrow permissions per agent**: each agent gets only the tools its job needs (Replit, Copilot `copilot/*` branches). Fewer tools also means better tool choice.
- **Guardrails can trip the whole run**: OpenAI input, output and tool guardrails run alongside the agent and stop it on a tripwire ([O2]).
- **Make every step reversible where possible**: commit or checkpoint per step (Replit, Anthropic resume) ([R3], [A2]).
- **Saved run state is untrusted input** until loaded from a store you control ([O3]).
- Agents reaching real systems (database, ERP, internal API) go through an MCP server → [`mcp-server`](../../mcp-server/SKILL.md). Input validation, server-side permission checks, secrets and logs → [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md).
- Evaluate the agent before and after every change → [`llm-evaluation-patterns.md`](llm-evaluation-patterns.md) section "Agent Evaluation".

## 12. Sources

All opened 2026-10-26.

- [A1] [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [A2] [Anthropic · How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [C2] [Claude Code · Dynamic workflows](https://code.claude.com/docs/en/workflows) · [C3] [Claude Code · Best practices](https://code.claude.com/docs/en/best-practices)
- [O1] [OpenAI Agents SDK · Multi-agent](https://openai.github.io/openai-agents-python/multi_agent/) · [O2] [Guardrails](https://openai.github.io/openai-agents-python/guardrails/) · [O3] [Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) (source of `RunState.to_json()` and its lack of authentication)
- [L1] [LangGraph · Persistence](https://docs.langchain.com/oss/python/langgraph/persistence) · [L2] [Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api) · [L3] [Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [L4] [LangChain · Plan-and-Execute Agents](https://www.langchain.com/blog/planning-agents)
- [F1] [LangGraph · Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) · [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview)
- [G1] [Google ADK · Loop agents](https://adk.dev/agents/workflow-agents/loop-agents/) · [F2] [ADK workflows](https://adk.dev/workflows/) · [Dynamic](https://adk.dev/graphs/dynamic/) · [Human input](https://adk.dev/graphs/human-input/)
- [F4] [Microsoft Agent Framework · Magentic](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic) · [Workflows](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/) · [Version 1.0 announcement](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) · [Semantic Kernel repo](https://github.com/microsoft/semantic-kernel)
- [F5] [AutoGen repo](https://github.com/microsoft/autogen) · [Magentic-One in AutoGen](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html)
- [F6] [Strands · Graph](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/multi-agent/graph/) · [Swarm](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/multi-agent/swarm/)
- [F7] [LlamaIndex Workflows · Human in the loop](https://developers.llamaindex.ai/python/llamaagents/workflows/human_in_the_loop/)
- [F8] [Bedrock Agents Classic maintenance mode](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-classic-maintenance-mode.html) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Map state](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html)
- [Temporal · OpenAI Agents SDK cookbook](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [CrewAI Flows](https://docs.crewai.com/en/concepts/flows) · [Dify Loop](https://docs.dify.ai/en/use-dify/nodes/loop) · [n8n human-in-the-loop tools](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/)
- [R1] [Uber · uReview](https://www.uber.com/blog/ureview/) · [R2] [LinkedIn · Practical text-to-SQL](https://www.linkedin.com/blog/engineering/ai/practical-text-to-sql-for-data-analytics) · [R3] [LangChain · Replit](https://www.langchain.com/breakoutagents/replit) · [R4] [Microsoft Research · Magentic-One](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)
- [R5] [DeepMind · AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) · [R6] [GitHub · Copilot coding agent 101](https://github.blog/ai-and-ml/github-copilot/github-copilot-coding-agent-101-getting-started-with-agentic-workflows-on-github/) · [R7] [Google Research · AI co-scientist](https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/) · [R8] [Sakana · AI Scientist](https://sakana.ai/ai-scientist/)
- [R9] [LangChain · Klarna](https://www.langchain.com/blog/customers-klarna) · [R10] [LangChain · AppFolio](https://www.langchain.com/blog/customers-appfolio)
- [X1] [Cognition · Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) · [X2] [arXiv 2503.13657 · Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)
- [P1] [Huang et al. · LLMs Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798) · [P2] [Reflexion](https://arxiv.org/abs/2303.11366) · [P3] [Self-Refine](https://arxiv.org/abs/2303.17651) · [P5] [LLMCompiler](https://arxiv.org/abs/2312.04511) · [P6] [ReWOO](https://arxiv.org/abs/2305.18323) · [P7] [ADaPT](https://arxiv.org/abs/2311.05772)
