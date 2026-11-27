# MCP for RabbitMQ: which to use, which not to, and how to run it read-only

Part of `async-messaging` · checked 2026-10-27 · no MCP from the RabbitMQ or Broadcom team itself was found (searched 2026-10-27; found only community ones and Amazon MQ's) · the information was read through a web-fetch tool that summarizes with a small model; none of them was installed or run · the summary row for DevOps tools is at [`devops-mcp`](../../ai-engineering/references/devops-mcp.md)

## Contents

- [1 · Options](#1--options)
- [2 · Read-only setup](#2--read-only-setup)
- [3 · Sources and what is not yet checked](#3--sources-and-what-is-not-yet-checked)

## 1 · Options

| Server | Version · date | What it does | Verdict |
|---|---|---|---|
| `amq-mcp-server-rabbitmq` (repo `amazon-mq/mcp-server-rabbitmq` · Apache-2.0) | PyPI 4.0.0 (2026-07-28) · GitHub has no release | v4: 31 tools as enums (`--v4`) · v3: 61 tools · read: queues · exchanges · bindings · get_messages · connections · health · definitions · writes need `--allow-mutative-tools`: create/delete queue exchange vhost policy · purge · publish · import definitions · `enqueue` · `fanout` | **Recommended**, used read-only · connects to the Management API (15672, or 443 with TLS) and to AMQP only for `enqueue`/`fanout` · the name says Amazon MQ, but per the repo page it can connect to ordinary RabbitMQ (not yet tried against a broker that is not Amazon MQ) · latest commit 2026-10-01 (dependabot) · 42 stars |
| `awslabs.amazon-mq-mcp-server` (Apache-2.0) | PyPI 2.1.1 (2026-09-08) | manages the Amazon MQ broker itself in AWS (RabbitMQ and ActiveMQ): list/describe/reboot/update · creating a broker needs `--allow-resource-creation` | **Not a queue manager** · use it when you must manage the broker on AWS · **CVE-2026-18655** (CVSS 7.1) prompt injection tricks a tool connected to the broker into sending passwords or an OAuth token to the attacker's destination · versions before 2.0.24 are affected, fixed in 2.0.24 (2026-08-03) · use 2.0.24 or later · the CVE data came from releasealert.dev; NVD itself was not opened |
| `kenliao94/mcp-server-rabbitmq` | no release | the origin of the first one, moved to `amazon-mq/mcp-server-rabbitmq` | use the one it moved to |
| `kmitchell/rabbitmq-mcp` · `maiconjobim/rabbitmq-mcp-go` · `sansong089/rabbitmq-mcp-server` | version not checked | connect to the Management API · the go one can publish messages | **Not recommended**, unmaintained: kmitchell last push 2025-05-07 · go 2025-07-07 · 1-2 stars · the sansong089 repo was not opened |
| `messageaid/mcp` (.NET) | version not checked | several brokers · the RabbitMQ feature is still planned per the search result | **Not recommended**: last push 2025-04-23 · BSL 1.1 license |

## 2 · Read-only setup

Per the RabbitMQ management docs there is no read-only tag · the way the docs give is a user with tag `monitoring` and configure/read/write permissions set to `^$` (can view everything but cannot publish, consume, create or delete).

1. Create a separate user for the agent: tag `monitoring` · permissions `^$` `^$` `^$` on every vhost it may view · pass the password through an environment variable
2. **Do not pass `--allow-mutative-tools`** · do not enable the tools `enqueue` `fanout` `purge`
3. Side effect (`อนุมาน` (inferred) from the docs, not tried): `get_messages` cannot read message bodies because there is no read permission on the queue · this is a plus, since message bodies may contain personal data
4. Pin the version `amq-mcp-server-rabbitmq==4.0.0` (or the version checked on the install date); do not use `latest`
5. Set the broker endpoint in advance in the config file; never let the agent type the hostname itself (the vulnerability in the awslabs one shows that a tool connected to a broker can be tricked into sending the password out)
6. Start on staging · text a tool returns is data, not instructions (`ai-engineering` → `references/mcp-server.md` item 4)
7. Check after connecting: call a write tool with this user; it must be refused or the tool must not exist (`ground-rules/principle-prove-it-works`) · not done in this round

## 3 · Sources and what is not yet checked

Links actually opened (viewed 2026-10-27):

- https://github.com/amazon-mq/mcp-server-rabbitmq · https://api.github.com/repos/amazon-mq/mcp-server-rabbitmq/commits · https://pypi.org/pypi/amq-mcp-server-rabbitmq/json · https://github.com/kenliao94/mcp-server-rabbitmq (move notice page)
- https://pypi.org/project/awslabs.amazon-mq-mcp-server/ · https://awslabs.github.io/mcp/servers/amazon-mq-mcp-server · https://raw.githubusercontent.com/awslabs/mcp/main/src/amazon-mq-mcp-server/README.md · https://releasealert.dev/pypi/awslabs.amazon-mq-mcp-server/cves
- https://api.github.com/repos/messageaid/mcp · https://api.github.com/repos/maiconjobim/rabbitmq-mcp-go · https://api.github.com/repos/kmitchell/rabbitmq-mcp
- https://www.rabbitmq.com/docs/management · https://www.rabbitmq.com/docs/access-control

Not yet checked (ยังไม่ได้ตรวจ): the tool list of the awslabs server and how it connects to the broker · versions of the community MCPs and npm packages · the GitHub security advisory of awslabs/mcp (page 1 does not have it; page 2 was not opened) · whether the amazon-mq one really works with RabbitMQ outside AWS
