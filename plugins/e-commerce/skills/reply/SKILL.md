---
name: reply
description: Draft a Thai reply to a customer chat or review — stock, late parcel, wrong item, refund, bad review.
argument-hint: <platform> <what the customer wrote> [order status, photos, shop voice]
disable-model-invocation: true
---

Run `chat-reply-templates` (and `returns-and-bad-reviews` for returns, refunds and reviews) with the `customer-chat` agent for: **$ARGUMENTS**

Give one ready-to-send reply, plus the next action for the seller (refund, resend, open a dispute, nothing).
