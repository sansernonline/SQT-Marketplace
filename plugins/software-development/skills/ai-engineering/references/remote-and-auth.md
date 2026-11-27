# Remote MCP — Streamable HTTP · OAuth 2.1 · when claude.ai needs it

> Read only when stdio is no longer enough (`mcp-server.md` section 2) · Compiled from the MCP spec 2026-07-28 (authorization · transports · security best practices), the Claude Code docs and support.claude.com · Checked 2026-10-23

## Contents

1. [When it must be remote](#1-when-it-must-be-remote)
2. [What Streamable HTTP is](#2-what-streamable-http-is)
3. [Two levels of auth](#3-two-levels-of-auth)
4. [OAuth 2.1 per the spec](#4-oauth-21-per-the-spec)
5. [What the server must do](#5-what-the-server-must-do)
6. [Claude Code and claude.ai side](#6-claude-code-and-claudeai-side)
7. [Host and ops](#7-host-and-ops)
8. [Check before enabling](#8-check-before-enabling)
9. [Sources](#9-sources)

## 1 · When it must be remote

| Situation | Remote? | Reason |
|---|---|---|
| The user is on claude.ai (web · mobile) or Cowork | **Must** | A custom connector accepts only servers reachable from the internet, because Claude connects from Anthropic's cloud · a server behind a VPN/firewall must allowlist Anthropic's IPs · stdio in `claude_desktop_config.json` cannot be used on claude.ai |
| More than 1 person on the team needs the same data, and the source system is in the cloud | Should | One server · per-person permissions through OAuth · no need to hand out database credentials to every machine |
| The source system is on the user's machine or the customer's LAN | No | stdio on that machine · data never leaves the network · nothing to maintain |
| One person · Claude Code · sensitive data | No | stdio |
| Needs a UI in chat (form · confirm button) | Remote or MCPB | Anthropic `mcp-server-dev` → `build-mcp-app` (`ยังไม่ได้ตรวจ` (not yet checked)) |

Remote = 3 extra pieces of work that stdio does not have: **HTTPS + hosting** · **auth** · **keeping uptime** — write the reasons into an ADR before starting (`architecture`)

## 2 · What Streamable HTTP is

- One endpoint, such as `https://mcp.example.co.th/mcp` · the client `POST`s JSON-RPC one request at a time · the server answers with JSON or a stream (SSE inside that response) · version 2026-07-28 requires the headers `Mcp-Method` and `Mcp-Name` on the POST
- **Stateless since 2026-07-28** — no `initialize` handshake · no `Mcp-Session-Id` · every request carries the protocol version and capabilities in `_meta` · state across requests must be a handle the server issues and gets back as an ordinary parameter (and you **must not** treat a handle as proof of identity)
- Earlier versions (2025-11-25 and below) have a session id and a handshake — current SDKs support both ways · we do not write it ourselves, but we must know that a customer's old client may talk the old way
- The **old HTTP+SSE transport (2024-11-05) is deprecated** — do not build it new · `claude mcp add --transport sse` exists only to connect old servers
- Python v2: `mcp.run(transport="streamable-http", host="0.0.0.0", port=9000, json_response=True, stateless_http=True)` · request body cap 4 MiB (adjust `max_request_body_size`) · TypeScript v2: the package `@modelcontextprotocol/express` helps with Host header validation

## 3 · Two levels of auth

| Level | Use when | How | Limits |
|---|---|---|---|
| **API key in a header** | An internal company server · a few users · no per-person permissions needed | `claude mcp add --transport http <name> <url> --header "Authorization: Bearer ${KEY}"` · on claude.ai put it in the connector's request headers | One key for everyone → the audit log cannot tell who called · hard to rotate the key · not something the spec defines |
| **OAuth 2.1** (per the spec) | Many users · per-person permissions · opening to all of an organization on claude.ai | The server is a resource server · there is an authorization server (our own, or an IdP such as Entra ID · Keycloak · Auth0 that supports RFC 8414 + PKCE) | 1–3 days of setup if an IdP already exists · more if we must write the AS ourselves (team estimate · not measured) |

Start with an API key when inside the LAN/VPN of one organization · move to OAuth when going onto the internet or when there is more than 1 organization

## 4 · OAuth 2.1 per the spec

The sequence the client (Claude) follows — our server must answer each step correctly:

1. The client calls `/mcp` with no token → the server answers **401** with a `WWW-Authenticate` header pointing to the `resource_metadata` URL
2. The client reads the **Protected Resource Metadata** (RFC 9728) at `/.well-known/oauth-protected-resource` → gets `authorization_servers[]` and `scopes_supported`
3. The client reads the **Authorization Server Metadata** (RFC 8414) of the AS → the various endpoints
4. The client registers itself — version 2026-07-28 mainly uses **Client ID Metadata Documents (CIMD)** (client_id is the URL of a metadata document) · **Dynamic Client Registration (RFC 7591) is deprecated** but still works with old AS · an AS that supports neither needs the client to supply `client_id` itself (Claude Code: `--client-id` · `--client-secret`)
5. **PKCE** is mandatory · send `resource=<URL of the MCP server>` (RFC 8707) both when requesting the code and requesting the token · check `state` and `iss` when receiving the callback
6. Once you have the access token → every request carries `Authorization: Bearer …` (never in the query string) · token expires → new 401 → refresh
7. Asking for more permission later: the server answers 403 or 401 with the `scope="…"` it needs (step-up) — start from the smallest scope, do not declare every scope in `scopes_supported`

## 5 · What the server must do

| Must | Because |
|---|---|
| Check the token on **every request** and check that the **audience is this server** (claim `aud` or equivalent) · reject another service's token with 401 | Spec MUST · prevents the confused deputy |
| **Do not forward a token received from the client to the source system** — use another token the server obtains itself as a client of that system | Token passthrough is explicitly forbidden in the security best practices |
| HTTPS on every endpoint · redirect URIs only HTTPS or `localhost` | OAuth 2.1 section 1.5 |
| 401 = missing/expired · 403 = not enough scope · 400 = malformed request | Table in the spec |
| If the server is a **proxy** to another vendor's API with a fixed client_id → show our own consent page for each client before forwarding · store consent per `client_id` · `redirect_uri` must match exactly | Confused deputy in the security best practices |
| Store tokens encrypted · short lifetime · rotate refresh tokens for public clients · never log tokens | Token theft |
| Separate the user's identity from the token and pass it into the audit log on every tool call | `web-service-essentials` · with a shared API key this cannot be done |
| Rate limit per user · timeout per tool · limit body size | The spec says the server MUST rate limit |

## 6 · Claude Code and claude.ai side

| Client | How | Notes |
|---|---|---|
| Claude Code (CLI) | `claude mcp add --transport http <name> https://…/mcp` · OAuth: type `/mcp` in the session and log in through the browser, or `claude mcp login <name>` · the token is stored and refreshed for you · to revoke: `claude mcp logout` or `claude mcp remove` (also deletes the token and client registration) | For an AS that needs the redirect URI registered in advance: `--callback-port 8080` · for an AS with no DCR/CIMD: `--client-id` `--client-secret` (the secret is prompted hidden) · the http `.mcp.json` uses `"type": "http"` · `"url"` · `"headers"` · Anthropic's own credential variables are not expanded in `url`/`headers` (stops a project from sending our key to another server) |
| claude.ai · Claude Desktop · Cowork | Settings → Connectors → Add custom connector → enter the URL · log in with OAuth or enter a header | Every plan (Free gets 1) · Team: the Owner/Primary Owner adds it for the whole organization · Enterprise: the Owner or a role with Manage Libraries permission · each member must enable it and log in themselves |
| The server must be reachable from the internet | — | If behind a firewall, allowlist Anthropic's IPs (the list is in the support article · not copied here because it can change) |

## 7 · Host and ops

- Run as a normal web service → use `web-service-essentials` (health endpoint · RFC 9457 errors for endpoints other than `/mcp`) · `incidents-and-monitoring` (measure latency per tool · `is_error` rate) · `cicd-and-release`
- Stateless → scales horizontally right away · no sticky session needed (version 2026-07-28) · if you still support old clients that use a session id, you need a shared store
- An internal server running on one machine but using HTTP: bind `127.0.0.1` · check `Origin` · require a token — stops DNS rebinding from a web page the user has open
- If our server is a client of someone else's AS (fetching metadata from URLs it was given): do not follow a URL to an internal IP (`10/8` · `172.16/12` · `192.168/16` · `169.254/16` · loopback) · enforce HTTPS · do not follow redirects unchecked — SSRF in the security best practices
- Cheapest Thai hosting first (owner's rule): an in-country VPS or a PaaS that provides HTTPS · prices and providers (รอยืนยัน (to be confirmed))

## 8 · Check before enabling

- [ ] The reason it must be remote is written in an ADR · the stdio alternative was rejected for a real reason
- [ ] `curl -i https://…/mcp` with no token → 401 + `WWW-Authenticate` pointing to a `/.well-known/oauth-protected-resource` that opens
- [ ] Another service's token (wrong audience) → 401 · not enough scope → 403
- [ ] Nowhere forwards the client's token on to the source system (grep `Authorization` in the code that calls out)
- [ ] All HTTPS · HTTP allowed only for `localhost` during dev
- [ ] The audit log has the user's identity from the token · no token or secret in the log
- [ ] `claude mcp add --transport http` + `/mcp` login really passed once · the claude.ai connector really added once (if the target is claude.ai) — note the date
- [ ] The 3 eval cases of `mcp-server.md` section 7 run through remote (not only stdio)
- [ ] `security-gate` passed · STRIDE by `security-engineer` because it is open to the outside

## 9 · Sources

| Topic | Source (checked 2026-10-23) |
|---|---|
| OAuth 2.1 · RFC 9728 · RFC 8414 · PKCE · RFC 8707 · 401/403/400 · token audience · no passthrough · stdio uses credentials from the environment | modelcontextprotocol.io/specification/2025-06-18/basic/authorization (version 2026-07-28 adds CIMD · `iss` · step-up scope — changelog) |
| stateless · no session id · `Mcp-Method`/`Mcp-Name` · SSE deprecated · DCR deprecated → CIMD | modelcontextprotocol.io/specification/2026-07-28/changelog |
| confused deputy · token passthrough · SSRF · state handle hijacking · local server · scope minimization | modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices |
| `claude mcp add --transport http` · `--header` · `/mcp` · `claude mcp login/logout` · `--callback-port` · `--client-id` · Anthropic credential not expanded in url/headers | code.claude.com/docs/en/mcp |
| custom connector: must be reachable from the internet · plans · who can add · OAuth or header · IP allowlist | support.claude.com → "Getting started with custom connectors using remote MCP" |
| Python v2 `run(transport="streamable-http", …)` · 4 MiB · TypeScript `@modelcontextprotocol/express` | py.sdk.modelcontextprotocol.io/migration · github.com/modelcontextprotocol/typescript-sdk README |
| Estimate of 1–3 days · hosting prices | Team · not measured · (รอยืนยัน (to be confirmed)) |
