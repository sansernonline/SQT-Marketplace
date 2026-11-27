---
name: line-oa
description: Use when setting up a LINE OA, broadcasts or an auto-reply chatbot
---

# line-oa — set up, broadcast and auto-answer on LINE

> **One rule:** a LINE token and channel secret never go into code, chat, git or logs; they live only in environment variables or a secret store.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Creating a LINE OA or enabling the Messaging API | [references/line-oa-setup.md](references/line-oa-setup.md) |
| Sending a broadcast to LINE OA friends | [references/line-broadcast.md](references/line-broadcast.md) |
| Making the LINE OA answer customers automatically | [references/line-chatbot.md](references/line-chatbot.md) |

Other files in this folder: `segment-knapsack.md` (choosing which segment to message), `webhook-node.md`, `mcp-line-bot.md`, `kb-template.md`, `broadcast-template.md` and `worked-example.md`.

## Steps every part shares

1. Confirm the OA name and the account owner before any setting is changed.
2. Test with one account before any change reaches all friends.
3. Write the date of the last check next to every answer in the knowledge base.

## Check before done

- Personal details (name, order) go only in a push or multicast to that one person, never in a broadcast.
- Prices and stock come from the live system, never typed into the knowledge base.
- The chatbot's language model only returns an intent id from the fixed list; the code fills the answer, and the model never writes facts or runs actions.
- Every broadcast counts against the message quota; check the quota before a large send.
- Credentials stay in the LINE Developers console and environment variables, never in chat or code.

Whole job with several steps → playbook [line-oa](../superuser/references/playbook-line-oa.md).
