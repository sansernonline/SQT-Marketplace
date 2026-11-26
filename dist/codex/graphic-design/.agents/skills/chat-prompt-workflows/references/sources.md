# Sources · chat-prompt-workflows

## Sources

- The Loop · Graph · Dynamic templates and the work-check sheet from the AI Workflow course (CWN2026) of the repo owner · shortened and adapted to the team's terms · read 2026-10-26
- Team rules the templates match: `crew-patterns/agent-patterns` and [`pattern-details`](../../crew-patterns/parts/agent-patterns/references/pattern-details.md) section 1 plan adjustment · 3 Reflection · 4 Multi-Agent
- [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (start from the simplest pattern · evaluator-optimizer · round ceiling) · opened 2026-10-26
- [Huang et al. · LLMs Cannot Self-Correct Reasoning Yet (ICLR 2024)](https://arxiv.org/abs/2310.01798) (self-correcting with no real material to compare against gets worse) · opened 2026-10-26
- [Madaan et al. · Self-Refine](https://arxiv.org/abs/2303.17651) (the first rounds give the most · the checker often answers "fine" on math items) · opened 2026-10-26
- [Google ADK · Loop agents](https://adk.dev/agents/workflow-agents/loop-agents/) (a loop needs its own round ceiling) · opened 2026-10-26
- [Claude Code docs · Dynamic workflows](https://code.claude.com/docs/en/workflows) (stop when 2 rounds in a row make no progress) · opened 2026-10-26
- [Microsoft Research · Magentic-One](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/) and [AutoGen · Magentic-One](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html) (progress ledger: is it done · is it repeating · is it moving forward · who continues · what to order) · opened 2026-10-26
- [Kim et al. · LLMCompiler](https://arxiv.org/abs/2312.04511) (a flow chart where pieces partly depend on each other) · opened 2026-10-26
