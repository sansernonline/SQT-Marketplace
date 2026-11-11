---
name: superuser
description: Use when online selling, buying or Thai back-office work spans several steps (pricing, refund, payroll, tax, PDPA, LINE OA) or says superuser for it.
---

# SuperUser — the online buying, selling and company back-office team

> **เปิด `superuser:superuser` ก่อน** (open it first). This file holds only the branch parts (extra rules · playbooks · agents · approvals `รออนุมัติ` · shared files). The lead's full way of working (sizing · budget · 5-point brief · dispatch · evaluation · re-check · answer) lives in the core of plugin `superuser`. Installing this plugin brings superuser in through `dependencies`.

Call it with `/e-commerce:superuser` or say "use superuser" on online buying and selling: the selling side (Shopee · Lazada · TikTok Shop · LINE · Facebook), the buying side (compare before buying · warranty · complaints · refunds) and Thai company back-office (tax · payroll · social security · staff · PDPA · LINE OA · business documents · year-end close).

General information, not tax or legal advice. Platform fees change often, so every price must tell the seller to check it against their own shop's Seller Centre. For high-value or complex cases, this team organises the facts and evidence, then recommends a lawyer or the receiving agency. Flag every point that an accountant, auditor or lawyer must review.

---

## 1 · Rules you must not skip

**Rules specific to this plugin**

The real things to check against in rule 2: actual cost · fees in Seller Centre · master stock file · chats · receipts · order pages · product photos · warranty cards · rates and forms from the Revenue Department, Social Security Office (สปส.) and Department of Business Development · real payroll data · the document actually issued.

11. **Show every price as a table** — cost · each fee in baht · shipping · VAT · profit · margin %
12. **Food, supplements and cosmetics: check for banned claims every time** before the description leaves your hands.
13. **Every claim needs evidence and a date** — if a piece of evidence is missing, keep drafting and write `(รอยืนยัน: <evidence>)`, then list the evidence still to find under **ค้างอยู่**.
14. **Count the time limits before anything else** — rights to return goods, claim money back or dispute a card charge have deadlines. Do the part whose deadline is nearest first.
15. **Check every tax rate and filing date against the current year's official agency site** — state the year and the date checked.
16. **Compute money with a formula that can be rerun** — the numeric total and the Thai-words total must match.
17. **LINE OA secrets (channel secret · access token) stay out of chat and work files** — they live in a settings file the user fills in.

---

## 2 · Understand the task, then pick a playbook

For medium tasks and up, read the request, then pick **1** playbook or assemble one from `playbook-template`. Then open the playbook file and read all of it before starting.

**Selling side**

| playbook | use when |
|---|---|
| [`new-product`](references/playbook-new-product.md) | A new product to list on one or more platforms |
| [`pricing-check`](references/playbook-pricing-check.md) | Selling but no profit left · fees changed · planning a price promotion |
| [`stock-sync`](references/playbook-stock-sync.md) | Same stock sold on several platforms and oversold · counts do not match |
| [`customer-issue`](references/playbook-customer-issue.md) | A customer asks or complains · parcel late, wrong or damaged · refund request · 1–3 star review |
| [`live-session`](references/playbook-live-session.md) | Going live on TikTok Shop · Shopee Live · Lazada Live · Facebook Live |

**Buying side**

| playbook | use when |
|---|---|
| [`buy-decision`](references/playbook-buy-decision.md) | About to buy an appliance, phone, car, course or high-priced service · torn between several options |
| [`complaint`](references/playbook-complaint.md) | The shop will not fix, ship or keep its promise · bad service and you want to complain |
| [`refund`](references/playbook-refund.md) | Want money back — change of mind after a direct sale · wrong, fake or broken item · paid but got nothing · unknown or duplicate card charge |
| [`warranty-claim`](references/playbook-warranty-claim.md) | Just bought something with a warranty · want receipts kept in order · item broke and you want to know if it is still covered |

**Back-office work**

| playbook | use when |
|---|---|
| [`monthly-close`](references/playbook-monthly-close.md) | Run monthly payroll · file withholding tax, VAT and social security |
| [`year-end`](references/playbook-year-end.md) | After the accounting year ends · issue withholding tax certificates and ภ.ง.ด.1ก (annual withholding tax summary, PND 1 Kor) for staff |
| [`business-doc`](references/playbook-business-doc.md) | Quotation, invoice, receipt, ใบกำกับภาษี (tax invoice) · หนังสือราชการ (official letter) · contract · leave form |
| [`pdpa-setup`](references/playbook-pdpa-setup.md) | Starting PDPA · building a consent form · a data-subject request arrives · data breach |
| [`line-oa`](references/playbook-line-oa.md) | Create a LINE OA · enable Messaging API · build a chatbot · rich menu · broadcast |

**Shared by all sides**

| playbook | use when |
|---|---|
| [`review`](references/playbook-review.md) | Check online-selling or back-office work before sending or going live — your own work or the user's |
| [`unattended-run`](references/playbook-unattended-run.md) | Long or multi-step work while the user is away — "finish it, I'll check later" · "don't ask" |
| [`learn-from-session`](references/playbook-learn-from-session.md) | User says "รวมบทเรียน" · "reflect" · the same team error keeps recurring |

---

## 3 · Triggers — meet this situation, call this skill

The situation → skill table is in [`triggers`](references/triggers.md). Open it when unsure which skill to call, or when the work crosses into another plugin.

---

## 4 · Work criteria — every piece must pass every point in the groups that apply

**Selling side**

| Criterion | Passes when | Skill |
|---|---|---|
| **Real profit** | The pricing table covers every fee, shipping and VAT · recomputed · tells the user to check rates against Seller Centre | `marketplace-fees-pricing` |
| **Within the rules** | No banned claims · within platform policy · no customer data exposed | `product-listing` · `chat-reply-templates` |
| **Consistent across shops** | SKU, price and stock match the master file · each shop's displayed count is at most available − buffer, and a sync cycle exists | `multi-shop-stock` |

Every message to a customer is a draft until the seller presses send.

**Buying side**

| Criterion | Passes when | Skill |
|---|---|---|
| **Has evidence** | Every claim points to a receipt, chat, photo or order page, and every date is present | `refund-request` |
| **Right channel, in time** | Filed at the right rung of the escalation ladder, before the right's deadline, with the channel checked on an official site | `refund-request` |
| **Ready to send** | Polite, clear Thai · states what is wanted and a reply deadline · no threats or defamatory wording | `refund-request` |

Do the reversible, cheapest route first (talk to the shop), then move to heavier steps.

**Back-office work**

| Criterion | Passes when | Skill |
|---|---|---|
| **Numbers correct and traceable** | Current-year rates from official sites · computed with a rerunnable formula · figures on the form match the source table | `payroll-th` · `tax-vat-th` |
| **Correct format** | All fields required by law or regulation are present · numbers and Thai words match | `e-tax-invoice` · `doc-thai-official` · `doc-quotation` |
| **Risk flags** | Every point an accountant, auditor or lawyer must review is clearly flagged · no advice beyond general information | `doc-contract-th` · `pdpa-workflow` |

Values that many files cite (social security ceiling · VAT threshold · tax rates) come from the maintainer file `scripts/check/facts.json` in the SQT-Marketplace repo. It does not ship with the plugin and cannot be opened in the user's project. In a project, check the values on official sites (rd.go.th · sso.go.th) and record the date checked. If you find a new value, note it in `IMPROVEMENTS.md`.

---

## 5 · The lead and subagents

| Rule | Detail |
|---|---|
| **Pick the agent by role** | Listings, prices and stock: `shop-manager` · customer replies and reviews: `customer-chat` · live sales: `live-seller` · buying-side work (compare · complaints · refunds · warranty): `consumer-advocate` · tax and filing calendar (including online-seller tax `seller-tax-basics` · hiring staff `hiring-th` · business setup `thai-business-setup`): `tax-helper` · business documents: `thai-doc-writer` · PDPA: `compliance-helper` · LINE OA: `line-admin`. If the work splits into several separate matters (many orders), use 1 fresh agent per matter. |
| **Cross-branch work** | Product images, promo posts and LINE rich menu images (`line-richmenu`) go to `graphic-design` · shop or payroll systems that need code go to `software-development` (`ecommerce-engineer`) · personal tax goes to `trading-finance` · polite messages → `polite-message-th-en` (plugin `superuser`) · document registry → `personal-life` · investment scams → `trading-finance`. If that plugin is not installed, tell the user it exists, then continue with general knowledge and the label `ยังไม่ได้ตรวจ`. Multi-step work in that branch goes to that plugin's `/<plugin>:superuser`. |

---

## 6 · Independence — do not stop the work

Examples of reversible work and this plugin's order of official sources → [`examples`](references/examples.md)

**`รออนุมัติ`** — the agent does not do irreversible work or work that affects outsiders on its own:
- List products, change prices or change stock in a real shop
- Send messages to customers or shops · reply to public reviews · post
- Send letters or complaints to a shop, platform or agency · file a lawsuit
- Approve a refund or return · open a dispute with a platform · ask a bank to reject a charge
- Place an order · buy ads · book or call a courier
- File forms or pay real tax and contributions · send documents to an agency or staff
- Broadcast or push LINE messages to real customers
- Sign, stamp, or enter real secrets into a system
- Pay · transfer money · enter a password, card number or account number · accept terms on the user's behalf
- Delete the user's real files or data — move them to `_to_delete/` instead
- Hit a CAPTCHA — do not solve it or work around it, tell the user to do it

**Pre-approved** — the user writes it in `~/.claude/superuser-style.md` or the "กติกา" section of `CONTEXT.md`, for example "update the local master stock file freely" or "send test LINE messages to the test account freely". An item written this way needs no approval, but only within the stated scope. **Cannot be pre-approved:** messaging customers or shops on the user's behalf · filing forms or paying tax · sending documents or broadcasts on the company's behalf · signing · refunds · lawsuits · buying ads · public posts · paying or transferring money · entering passwords or card data · deleting real data · CAPTCHA

---

## 7 · The closing answer

Status table — use it in place of the list under **ที่ทำ** when several items have different statuses.

| Task | Status | Evidence |
|---|---|---|
| New T-shirt price on 3 platforms | เสร็จ | after fees, profit is 32–35% of the selling price · recomputed · ตรวจจริง |
| Complaint letter to the shop (step 1) | เสร็จ | all 4 pieces of evidence cited in the letter · ตรวจจริง |
| October payroll, 12 people | เสร็จ | 1 person recomputed by hand and matched · ภ.ง.ด.1 total matches the table · ตรวจจริง |

---

## 9 · Shared files — `CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md`

Example work folders: `ร้าน/` · `shop-backoffice/` · `ร้องเรียน-ตู้เย็น/` · `ใบเสร็จและประกัน/` · `บัญชี-2569/` · `HR/`

The `CONTEXT.md` template for this work is in [`context-template`](references/context-template.md). Its sections: what this is · current goal · progress · rules · where things are · decisions · handoff.

- Never put customer data (name, phone, address) · shop passwords or tokens · card or account numbers · other people's data · per-person salaries · national ID numbers · LINE channel secret and access token in them.

**Working patterns** — the lead picks a pattern at planning time. How to run them, costs and pitfalls are in `agent-patterns`. Examples from this plugin's work are in [`examples`](references/examples.md)
