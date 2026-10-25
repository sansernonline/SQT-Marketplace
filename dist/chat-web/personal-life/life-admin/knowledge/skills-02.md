# skill: digital-hygiene

Use when securing family accounts (password manager, 2FA, passkeys, backup, SIM swap) or after a takeover.

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
| 2 | **Bank and wallet apps** | Direct access to money | The bank app's own device binding and PIN. Never share a one-time password (OTP) |
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

Related: `important-docs` (where the recovery-code envelope is kept), `subscription-audit` (unknown charges), `scam-check` in `trading-finance`, and `pdpa-workflow` in `e-commerce`.


## reference: line-and-phone.md

# LINE and the phone number

## Before anything goes wrong

1. In LINE, open Settings → **Account** and register an **email** and a **password**. Without them, a lost phone can mean a lost account
2. Turn on **two-factor authentication**, also under Settings → Account (LINE Thailand recommends it)
3. Set a **PIN** for account transfer and write it in the password manager
4. **Chat backup**: iPhone backs up to iCloud Drive, Android to Google Drive. Turn on automatic backup
5. **Login permission**: turn off "Allow login" on PC and iPad if you do not use LINE there

## Moving LINE to a new phone

- **Easy Transfer QR code**: on the new phone, choose Log in → Log in with QR code. On the old phone, open Settings → Easy transfer QR code and scan
- Easy Transfer moves the **last 14 days** of chats, including across iPhone ↔ Android
- Older history comes back only from the **backup on the same platform** (iCloud ↔ iPhone, Google Drive ↔ Android). Back up on the old phone just before moving
- Keep the old phone until you have confirmed everything works on the new one

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://help.line.me/line/smartphone/categoryId/20007834?lang=th · https://www.sanook.com/hitech/1625046/

## The phone number itself (SIM-swap defence)

| Action | How | Note |
|---|---|---|
| Check that the SIM in this phone is registered to your own ID card | Dial `*179*<13-digit ID>#` and call | Free on all networks. A "does not match" reply = go to the operator shop with your ID card. Listing **all** numbers in your name may need the operator shop (รอยืนยัน) |
| Block incoming international calls | Dial `*138*1#` and call. To undo: `*138*2#` | Works on AIS, dtac and True. Relatives abroad will not get through either |
| Ask the operator to require ID in person for SIM replacement | Visit a shop | Policy varies by operator (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipbs.or.th/news/content/340403 · https://droidsans.com/block-inter-calling-gang-callcenter/

**Sign of a SIM swap**: the phone suddenly shows "No service" or "SOS only" while others around you have signal, followed by one-time password (OTP) or password-reset emails. Treat it as the first hour of a takeover (see [scams-and-takeover.md](scams-and-takeover.md)).


## reference: scams-and-takeover.md

# Thai scam patterns and the first hour after a takeover

## Scam patterns to brief the family on

| Pattern | What it sounds like | The tell |
|---|---|---|
| Call from **+697 / +698**, or +66 over the internet | "This is the police / Department of Special Investigation (DSI) / Kerry / the Revenue Department / your bank" | Police have warned not to answer these numbers at all. They are calls from abroad shown as if local |
| แก๊งคอลเซ็นเตอร์: "your parcel contains drugs", "your account is linked to money laundering" | Moves to a LINE video call with a "police officer" in uniform, asks you to transfer money "for checking" | **No Thai authority asks you to move money to check it**, and none works through LINE video |
| Fake loan / refund / electricity-bill SMS with a link | "Click to receive your refund" | Agencies do not send links by SMS. The link installs an app that takes over the phone |
| Remote-control app (screen-sharing Android app file, APK) | "Install this app to update your details" | Installing anything at a caller's request = hang up |
| A friend's hacked LINE or Facebook asking to borrow money | "Can you transfer ฿5,000 urgently? I'll return it tonight" | Call the friend on a phone number you already have before sending anything |
| Investment / job / "like and earn" groups | Small payouts first, then bigger deposits | See `scam-check` in `trading-finance` (if installed) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://thailand.prd.go.th/en/content/category/detail/id/2078/iid/327803 · https://www.thebangkokinsight.com/news/the-bangkok-insight-th/899307/

**Family rule**: if a call asks for money, a one-time password (OTP), or an app install, hang up, then call back on a number you already know.

## The first hour after an account takeover or a scam transfer

Write this on a card and stick it on the fridge. Fill in the blanks now.

| Minute | Do this | Number |
|---|---|---|
| 0–10 | **Money left the account?** Call the bank's 24-hour line and ask to freeze the account or card | Bank hotline: ______ (from the back of the card) |
| 0–15 | Call **1441**, the **AOC** (Anti Online Scam Operation Center). It runs 24 hours and can request a freeze on the receiving (mule) account. Be ready with transfer slips, the time, the amount and the destination account | **1441** |
| 10–30 | From a **different, safe device**: change the email password first, then sign out all sessions. Then do the same for the bank, Apple or Google, and LINE | — |
| 15–30 | If it was a SIM swap: call or visit the mobile operator to block the SIM. Bring your ID card | Operator: ______ |
| 30–45 | Tell family and friends on another channel: "my LINE or Facebook was hacked, do not send money" | — |
| 45–60 | Save evidence: screenshots, call logs, slips, URLs. File a police report online at thaipoliceonline.go.th (รอยืนยัน: the URL and the process) | — |
| Next day | Check the password manager for any reused password and change it. Uninstall any remote app installed. If one was installed, back up the photos and factory-reset the phone | — |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.prachachat.net/hilight-prachachat/news-1695153 (1441 AOC, 24 hours, account freeze)


---

# skill: goal-and-habit

Use when setting quarterly or new-year goals, starting or stopping a habit, or goals fade by February.

# Goals and Habits

Few goals, measured honestly, carried by habits small enough to survive a bad week.

## Workflow

1. **Brain-dump** everything the user wants this quarter. Do not filter yet
2. **Pick three, at most.** Ask "if only one happened, which would matter most?" three times. Everything else goes on a `someday` list, which is parked, not deleted
3. **Make each goal measurable** using the outcome formula below
4. **Find the lead habit** for each goal: the repeated action that produces the outcome. A goal with no habit is a wish
5. **Design the habit** with cue, routine and reward, and shrink it with the 2-minute rule
6. **Set up the tracker** using the template below, in `goals/YYYY-Qn.md`
7. **Weekly check (5 minutes)** inside `weekly-review`: tick last week, read the three goals, and choose the one adjustment for next week
8. **Week 6 midpoint**: is the goal on pace? If not, change the plan (step 9). Do not just try harder
9. **Failure review** when two weeks in a row are missed, or at quarter end. See the failure review section below
10. **Quarter end**: score each goal, write three lines of lessons, and carry forward or drop

## Outcome formula

> **Verb + measurable result + by date + measured how**

| Vague | Measurable |
|---|---|
| Get fit | Run 5 km under 35 minutes by 31 Dec, timed on the running app |
| Save more | Have ฿60,000 in the emergency account by 31 Dec, checked on the bank app on the 1st of each month |
| Learn English | Finish 60 lessons and hold a 10-minute call with a tutor without switching to Thai by 31 Dec |
| Read more | Finish 6 books by 31 Dec, logged in `reading.md` |

Rule: the user must be able to say **yes or no** on the date. "Better" and "more" are not outcomes.

## Habit design

| Part | Question | Example (run 5 km) |
|---|---|---|
| **Cue** | After what existing thing, or at what time and place? | "After I drop the kids at school on Mon, Wed and Fri" |
| **Routine** | What exactly? | Put on running shoes and run/walk 20 minutes |
| **Reward** | What feels good right after? | The podcast episode I only allow myself while running, plus the tick on the tracker |
| **2-minute version** | What is the bad-day minimum that still counts? | Put on running shoes and walk to the end of the street |

- **The 2-minute rule**: a new habit starts as something that takes 2 minutes or less. On bad days, the 2-minute version counts as done. Showing up is the habit; the volume comes later
- **Habit stacking**: "After [current habit], I will [new habit]." Attach the new habit to something that already happens every day
- **Make it easy, and make the alternative hard**: shoes by the door; the phone charger in the living room, not the bedroom
- **Never miss twice**: one miss is normal; two misses in a row is the start of a new habit of not doing it

## Tracker template

```markdown
# 2026-Q4 goals (1 Oct – 31 Dec)

| # | Goal (outcome formula) | Lead habit | 2-min version | Target/week |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Weekly log
| Week | Goal 1 habit (✔/✖ per day) | Goal 2 | Goal 3 | Outcome number now | Adjustment |
|---|---|---|---|---|---|
| W40 | ✔✖✔ | | | | |
```

## Failure review (blame-free, 10 minutes)

1. **What happened?** The facts only: how many days were done out of how many planned
2. **When did it break?** Which day of the week, and what was different about it (travel, overtime, a sick child)
3. **Which part failed?** The cue never came / the routine was too big / there was no reward / the goal was not really wanted
4. **One change** for the part that failed: a new cue, a smaller routine, or a better reward. If the goal was not wanted, drop it openly and record why
5. Write the review in the quarter file under `## Reviews`

## Worked example

- Goal: "Save ฿60,000 in the emergency account by 31 Dec 2026, checked on the 1st of each month"
- Lead habit: move money on payday before spending. Cue: the salary notification. Routine: transfer ฿20,000. Reward: update the progress bar in the tracker
- 2-minute version (bad-day minimum): transfer any amount, even ฿100, so the habit stays alive
- Week 6 review: October ฿20,000 ✔, November only ฿8,000 (an unplanned car repair). Failure review: the routine worked, but there was no buffer. Change: lower to ฿15,000 a month and add December's bonus. Still on pace if the bonus is ≥ ฿17,000 (60,000 − 28,000 − 15,000 for December)

## Rules

- **Three goals maximum per quarter.** A fourth goal makes all of them weaker
- Measure the habit weekly and the outcome monthly. Daily outcome-watching discourages people
- Never shame a slip. Change the system first, then the goal
- Health goals: set the habit and the measurement; ask a doctor before strict diets or intense training

Related: `weekly-review` (the weekly check), `decision-journal` (drop or continue), `personal-budget` in `trading-finance` (money goals), `learning-path` (learning goals).
