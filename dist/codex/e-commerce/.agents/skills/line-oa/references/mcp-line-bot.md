# Optional MCP server for the Messaging API · line-oa-setup

LY Corporation publishes an MCP server for the Messaging API: `@line/line-bot-mcp-server` ([github.com/line/line-bot-mcp-server](https://github.com/line/line-bot-mcp-server)). Its README calls it a **preview**. Checked on npm 2026-10-28: version 0.5.0. It can push text and flex messages from the OA.

This plugin does not ship it, because nothing here downloads code at run time. If the user wants it, they add it to their **user** scope with the version pinned, so the token lands in their own Claude Code settings and not in the project:

```bash
claude mcp add line-bot --scope user -e CHANNEL_ACCESS_TOKEN=<from the Developers Console> -e DESTINATION_USER_ID=<optional default user> -- npx -y @line/line-bot-mcp-server@0.5.0
```

Do not put the server with a real token into the project's `.mcp.json`, because that file is meant to be committed and shared. If a project must declare it, write `"CHANNEL_ACCESS_TOKEN": "${LINE_CHANNEL_ACCESS_TOKEN}"` and keep the real value in an environment variable.

- The token stays in the user's own settings or environment. It never goes into project files or git.
- A push message counts against the monthly quota. Run the quota math in `line-broadcast.md` before sending to many people.
- Read the tool list in the README of the pinned version before relying on it, because a preview can change between versions.
