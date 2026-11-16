# Sources · mcp-server

## Sources (checked 2026-10-23)

| Topic | Source |
|---|---|
| MCP spec · versions · primitives · security principles | modelcontextprotocol.io/specification/2026-07-28 (index · server/tools · basic/transports/stdio · basic/authorization · changelog) · modelcontextprotocol.io/llms.txt (version list: 2024-11-05 → 2026-07-28) |
| tool result · `isError` · annotations untrusted · server MUST validate/rate-limit | spec 2025-06-18 → server/tools (same text as 2026-07-28 in the parts cited · not every line compared) |
| stdio must not write to stdout · logs to stderr | spec 2026-07-28 → basic/transports/stdio |
| stateless · no `Mcp-Session-Id` · SSE deprecated · fixed tool order · DCR → CIMD | spec 2026-07-28 → changelog |
| prompt injection · token passthrough · local server DNS rebinding · least scope | modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices |
| Python SDK v2: `MCPServer` · `ToolError` · `ToolAnnotations(read_only_hint=…)` · `mcp.run()` = stdio · structured output | py.sdk.modelcontextprotocol.io (index · migration · servers/tools · servers/handling-errors · servers/structured-output · run) · PyPI `mcp` 2.3.0 (2026-10-02 · Python ≥ 3.10) · licence MIT |
| TypeScript SDK v2: `@modelcontextprotocol/server` · `McpServer` · Zod v4 · v1 = `@modelcontextprotocol/sdk` | github.com/modelcontextprotocol/typescript-sdk README (Apache-2.0 for new parts · MIT for old parts) |
| `claude mcp add` (stdio · http · sse) · scope · `.mcp.json` · `${VAR:-default}` · `MAX_MCP_OUTPUT_TOKENS` 25,000 warn 10,000 · `/mcp` OAuth · prompt injection warning | code.claude.com/docs/en/mcp |
| claude.ai custom connector must be reachable from the internet · OAuth or API key header · who can add one | support.claude.com article "Getting started with custom connectors using remote MCP" |
| Tool design rules (names · pagination 20–50 · errors carry a next step · annotations · no secrets in code) · 10-question eval · recommends TypeScript | github.com/anthropics/skills → skills/mcp-builder (SKILL.md · reference/mcp_best_practices.md) · Apache-2.0 · reworded, not copied |
| Deploy options: remote HTTP · MCP app · MCPB · local stdio | github.com/anthropics/claude-plugins-official → plugins/mcp-server-dev README (licence in the LICENSE file not yet opened) |
| The 5–15 tool figure | Team experience — no official source · not measured |
