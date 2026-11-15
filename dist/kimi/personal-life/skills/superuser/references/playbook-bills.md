# playbook · bills — read bills and track monthly costs

Use when: the electricity or water bill went up · the user wants to track household costs every month · setting up automatic payment
Main skill: `household-bills`

## ขั้นตอน · Steps (copy into the todo as written)

1. Read the real bill the user sent. Copy the units, amount, Ft charge, and due date into the tracking table · ใคร: `home-manager` ตัวใหม่
2. Compare with the 3 months before. If the bill rose by more than 20%, look for the cause per `household-bills` (new rate · number of days in the cycle · new appliance · leak) · ใคร: `home-manager` ตัวใหม่
3. Check (ตรวจ) the current rate on the website of the local electricity or water authority · ใคร: `home-manager` ตัวใหม่
4. Summarize the possible causes from most to least likely, and what the user can check at home · ใคร: `home-manager` ตัวใหม่
5. Set a reminder for the due date of every bill · ใคร: `home-manager` ตัวใหม่ · `reviewer` ตัวใหม่ checks (ตรวจ) the whole set against the real bills and the official websites

## Done when

The bill table matches the real bills, and the explanation of why the bill rose is something that can be checked
