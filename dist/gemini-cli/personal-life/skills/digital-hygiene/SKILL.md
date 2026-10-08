---
name: digital-hygiene
description: Use when securing family accounts (password manager, 2FA, passkeys, LINE to a new phone, photo backup, SIM swap) or after an account takeover.
---

# Digital Hygiene

Protect the few accounts that can unlock all the others, and keep one copy of the photos that would hurt to lose.

This is general guidance, not a security audit. If money has already left an account, call the bank and 1441 first and read this afterwards.

## Workflow (first setup: about 2 hours per adult; yearly check: 30 minutes)

1. **List the accounts** for each family member in `digital-hygiene.md`: email, bank apps, LINE, Apple ID or Google account, social media, and government apps (ทางรัฐ, เป๋าตัง). Record **which phone number and which email** each account recovers to
2. **Password manager**: pick one with the criteria below, then move passwords in, starting with the top of the priority list
3. **Two-factor authentication (2FA)**: turn it on in the priority order below. Use passkeys where they are offered
4. **Recovery codes**: generate them, print them, and store them using the storage rules below
5. **LINE**: set the PIN and two-factor authentication now, before the phone is lost. See [references/line-and-phone.md](references/line-and-phone.md)
6. **Photo backup 3-2-1**: set it up per phone. See the table below
7. **Scam briefing for parents and grandparents**: go through the scam patterns together in person, 10 minutes. The patterns are in [references/scams-and-takeover.md](references/scams-and-takeover.md)
8. **Write the first-hour card** (in the same reference) and stick it somewhere everyone can find it
9. Every year: run the yearly checklist at the end of this file

## Choosing a password manager

| Criterion | What good looks like |
|---|---|
| Family sharing | A shared vault for the Wi-Fi, streaming and utility logins, plus a private vault per person |
| Works on every device the family uses | iPhone, Android, Windows and Mac, with browser autofill |
| Emergency access | A trusted person can request access after a waiting period, for when someone is in hospital or dies |
| Passkey support | Can store and sync passkeys |
| Security record | An independent audit is published. The breach history and how it was handled are public |
| Export | Can export everything, so you are not locked in |
| Older relatives can use it | If grandma will not use it, the built-in Apple Passwords or Google Password Manager is better than nothing |

Rule: one manager per family, chosen by whoever will support everyone else.

## 2FA — order of priority

| Rank | Account | Why first | Best method |
|---:|---|---|---|
| 1 | **Main email** (Gmail, Outlook, iCloud) | Every other password is reset through it | Passkey or authenticator app. Avoid SMS where possible |
| 2 | **Bank and wallet apps** | Direct access to money | The bank app's own device binding and PIN. Never share an OTP |
| 3 | **LINE** | Family chats, LINE Pay, and impersonation of you to borrow money | PIN + two-factor authentication + email registered |
| 4 | **Apple ID / Google account** | Controls the phone, backups and Find My | Passkey + a trusted second device |
| 5 | **Social media** (Facebook, Instagram, TikTok) | Used to impersonate you and scam your friends | Authenticator app + recovery codes |
| 6 | Shopping and everything else | Saved cards | 2FA where offered |

- **Passkeys**: turn them on for email, Apple and Google accounts first. A passkey cannot be typed into a fake website, which defeats most phishing
- **SMS OTP is the weakest method** because of SIM swap. Keep it only where nothing else is offered

## Recovery codes — storage rules

- Print them on paper. Store one copy at home in the document folder (see `important-docs`) and one with a trusted relative in a sealed envelope
- Not as a photo in the camera roll, and not in the same password manager the codes recover
- Write on the envelope which account they are for and the date they were generated. Old codes stop working when new ones are generated

## Photo backup — 3-2-1

3 copies, on 2 different kinds of storage, with 1 copy away from home.

| Copy | Option A (iPhone family) | Option B (Android family) |
|---|---|---|
| 1. The phone | Original | Original |
| 2. Cloud | iCloud Photos (5 GB free (รอยืนยัน); paid tiers above) | Google Photos (15 GB free, shared with Gmail and Drive (รอยืนยัน)) |
| 3. Offline | An external drive. Copy every quarter on a computer, and keep the drive at a relative's house | Same |

- Check that the cloud copy is actually running: open the photos website on a computer and find last week's photo
- A cloud copy is not a backup against deleting a photo by mistake, because a deletion syncs. The offline copy is the protection

## Worked example — the Somchai family

- Dad: Gmail with SMS 2FA → switched to a passkey + authenticator app. Recovery codes printed and put in the document folder
- Mum: LINE had no email registered and no PIN → set both, and turned on two-factor authentication
- Grandma: receives +697 calls → dialled `*138*1#` to block incoming international calls (she has no family abroad). Taught the rule "police never call on LINE"
- Photos: 2 iPhones on a 200 GB iCloud family plan, plus a quarterly copy to a 1 TB drive kept at an aunt's house
- Time taken: one Saturday afternoon

## Yearly checklist (copy into `digital-hygiene.md`)

- [ ] Each person: the recovery phone and email on email, Apple and Google accounts are still current
- [ ] The password manager's weak or reused password report is reviewed, and the top 10 are fixed
- [ ] Recovery codes are regenerated if any were used. The envelopes are updated
- [ ] `*179*<ID number>#` on each phone: the SIM is registered to its user's own ID card
- [ ] LINE: PIN known, email registered, two-factor authentication on. Old logged-in devices removed
- [ ] Logged-in devices removed in Google, Apple and Facebook (old phones, sold laptops)
- [ ] The offline photo drive is updated and actually opens
- [ ] The scam briefing is repeated with parents. Add any new pattern from the news
- [ ] Emergency access in the password manager is still set to the right person
- [ ] The first-hour card is still on the fridge, with its numbers checked

Related: `important-docs` (where the recovery-code envelope is kept), `subscription-audit` (unknown charges), `scam-check` in `trading-finance`, and `pdpa-workflow` in `thai-workplace`.
