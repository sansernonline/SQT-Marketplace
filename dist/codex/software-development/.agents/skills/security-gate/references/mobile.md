# principle-secure-by-default · mobile apps and apps with no server

Open this file when the work is a mobile app or an on-device tool · the 10 rules in [`SKILL.md`](principle-secure-by-default.md) all still apply.

**An app with no server** (an offline mobile app · an on-device tool) usually does not need items 2 · 3 · 4 and the database accounts in item 8, but it must pass the extra mobile rules:

| # | Rule for mobile apps | Wrong example → right example |
|---|---|---|
| M1 | **Only the permissions actually used**, including those a plugin adds | An offline app has `INTERNET` → remove it, then check the merged manifest (`security-gate`) |
| M2 | **A component that other apps do not need to call must be `exported="false"`** | Every activity · service · receiver is open → open only the main activity |
| M3 | **Set data backup explicitly** (`allowBackup` · `dataExtractionRules`) | Leave the default and personal data ends up in a cloud backup → choose what may be backed up |
| M4 | **Send files out through the system share sheet / `FileProvider`** | Write a file where every app can read it and pass the path → share through a temporary URI that grants access only to the receiving app |
| M5 | **The app signing key is not in the app or the repo** | `key.properties` · `*.jks` in git → gitignore them + keep them in the CI secret store and back them up (`cicd-and-release`) |
