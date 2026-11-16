# API sequence · line-richmenu

Open when building the menu through the Messaging API (create, upload, set default, link or unlink users).

```
POST   https://api.line.me/v2/bot/richmenu/validate                      check the JSON
POST   https://api.line.me/v2/bot/richmenu                               create → {richMenuId}
POST   https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content     upload (Content-Type image/png or image/jpeg)
POST   https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}         set default for everyone
POST   https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}    link to one user (e.g. member)
DELETE https://api.line.me/v2/bot/user/{userId}/richmenu                 unlink → user falls back to default
```

Many users at once: `POST /v2/bot/richmenu/bulk/link` (up to 500 user IDs per call · ตรวจล่าสุด 2026-10-26 ในหน้าอ้างอิง API).

What a user sees, highest priority first: **per-user menu (API) > default menu (API) > default menu set in OA Manager**.
