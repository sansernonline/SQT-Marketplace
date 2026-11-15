# playbook · line-oa — setting up and running a LINE Official Account

Use when: creating a LINE OA · turning on the Messaging API · building a chatbot · rich menu · broadcast
Main skills: `line-oa-setup` · `line-chatbot` · `line-broadcast` · `graphic-design:line-richmenu` (if installed) · agent `line-admin`

## ขั้นตอน (Steps — copy into the todo exactly)

1. Check the account's plan and message quota on LINE's official pages · ใคร: `line-admin` ตัวใหม่
2. Set up the channel and webhook following `line-oa-setup` — verify the X-Line-Signature signature, and keep secrets in a config file that the user fills in personally · ใคร: `line-admin` ตัวใหม่ (the user fills in the secrets personally)
3. Chatbot — group real customer questions by intent, then answer from the knowledge base. If unsure, hand over to staff, and never invent prices or stock · ใคร: `line-admin` ตัวใหม่
4. Rich menu — build the image size and tap areas following `graphic-design:line-richmenu` (not installed → use the sizes from LINE's official documents and tag them `ยังไม่ได้ตรวจ` (not yet checked)) · ใคร: `line-admin` ตัวใหม่
5. Broadcast — calculate the quota before sending. The actual send must wait for approval · ใคร: `line-admin` ตัวใหม่ calculates the quota, then ผู้ใช้อนุมัติ the actual send (the user approves)
6. Test (ทดสอบ) with an echo or a test message to a test account · ใคร: `line-admin` ตัวใหม่ sends to the test account · `reviewer` ตัวใหม่ checks the result against the log and the quota calculation

## Done when

The test message really passed, no secret is in code or chat, and the quota has been calculated.
