# Class family: AI · LLM · agent · MCP

Open this when the system calls an LLM · has RAG or persistent memory · has an agent that calls tools · is or uses an MCP server · has a customer-facing chatbot (for example a LINE chatbot wired to an LLM). Paste the chosen sections into the sub-agent brief whole. For design principles see `ai-engineering`.

## Rules for this family

- Prompt injection alone is not a finding. Show that attacker-controlled content causes a cross-boundary effect in code: it lands in someone else's context · calls a tool with rights the requester lacks · writes to persistent memory · or sends data out.
- Model output, memory, tool descriptions and MCP server results are all untrusted input. Point to the code that trusts them and then performs an action with effect.
- A system prompt that says "do not do X" is not a control. Only code checks, permissions bound to the resource, context separation and credentials with limited scope count.
- State all of it: attacker · who is affected · the identity the tool runs as · resource · action · visible effect. A user who calls a tool with their own rights is not a vulnerability.
- If you cannot or should not prove it in the lab with a real model, use a fake model that returns a fixed message (what the attacker wants the model to say) and watch what the code does next. The flaw is in the code after the model, not in whether the model complies.

## Context and memory

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `indirect-injection` | Someone else's document, web page, email or chat message enters the context and drives a tool that has effect | Retrieved content is pasted straight into the prompt, and the model may call write or send tools | A fake model returns a tool-call command. Check whether the code runs it without asking the user | The exposed tools are read-only and limited to that user's scope |
| `context-bleed` | One user's or shop's chat history or search results show up in another's context | Session key does not include the user id · vector store searches without a tenant filter | Two fake users in the lab ask the same question. Inspect the context that gets assembled | The store is separated per tenant |
| `memory-poisoning` | A user writes text into persistent memory that other users or other agents read | Conversation summaries are stored as shared "knowledge" with no owner separation | Write through account A and check whether it appears in B's context | Memory is separated per user and is never used to decide permissions |
| `role-confusion` | User text is placed in the system role or in a tool result | Builds a `role: system` message from input · concatenates strings instead of separating roles | Inspect the payload sent to the API in the lab | Input always sits in the user role |

## Tools and actions

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `tool-arg-injection` | An argument from the model reaches SQL, a shell, a path or a URL without validation | `exec(args.cmd)` · `query(args.sql)` · `fetch(args.url)` | A fake model sends a dangerous argument. Check whether it reaches the sink | The argument is validated with a schema and an allowlist before use |
| `excessive-agency` | A tool runs with credentials broader than the requesting user (confused deputy) | One service key for every request · a `refund` tool that does not check the requester owns the order | A fake user tells the chat to act on someone else's record | The tool checks the end user's rights itself every time |
| `approval-binding` | The user is asked to confirm, but the argument changes after confirmation, or the user only confirms a vague message | Confirmation happens before the model builds the final argument · the confirmation id is not bound to the payload | Change the argument between confirmation and execution in the lab | The confirmation is bound to a hash of the final payload |
| `schema-mismatch` | The declared schema and what the dispatcher checks do not match (extra fields, different types) | Dispatch with `**kwargs` · no server-side validation | Send a field that is not in the schema | The server validates with the same schema |
| `agent-loop-cost` | A user makes the agent loop on tools or the LLM without end, so the owner pays | No round cap, token cap or timeout per request | A fake model that keeps asking for the same tool call. Count the rounds in the lab | Caps already exist per user and per request |

## MCP and sub-agents

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `mcp-trust` | A sub-agent or MCP server gets all of the parent's rights · server results are trusted as commands | Passes the user's token on to an external server · uses results as a system message | Check which credential reaches which server | The server is our own and accepts a token with limited scope |
| `mcp-identity` | Tool names collide across servers and the wrong one is called · a server changes its description after the user approved | Maps tools by name only · does not pin the version or a hash of the description | Register a fake server in the lab that reuses a name | Fully qualified names such as `<server>.<tool>` are used |
| `mcp-server-authz` | An MCP server we wrote does not check rights per tool, or opens HTTP without authentication | HTTP transport with no auth · a database-writing tool open to every client | Call the tool from a client without a token in the lab | The server runs over stdio on a single user's machine |

## Output and disclosure

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `llm-output-xss` | The model's answer is rendered as HTML or as markdown that loads images from any URL (data leaves through the image URL) | `innerHTML = answer` · a markdown renderer with HTML and external images enabled | A fake model returns `<img src=...?q=data>`. Check whether the lab browser loads it | The renderer escapes output and blocks images from external domains |
| `context-extraction` | A user pulls out secrets, other people's data or a secret system prompt | API keys or other customers' data placed in the prompt | Check whether secrets really sit in the context | The system prompt holds no secrets (a prompt leak alone is not a finding) |

## Method that works across the family

- Map 4 things first: the identity each tool runs as · the tools that have effect (write, send, pay, delete) · every source that can write into the context or memory · every destination of the answer.
- Start from the tools that have effect, then trace back through dispatch · schema · confirmation · context · document retrieval.
- Compare the direct path, the queue, retry, resume, batch and sub-agents for the same action. The strongest control must sit behind the final argument and before the effect, on every path.
