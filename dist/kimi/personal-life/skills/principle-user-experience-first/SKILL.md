---
name: principle-user-experience-first
description: Use when easier to build conflicts with better for users
---

# principle · user experience first — choose what the user feels, not what is easy for us

> The user (or reader · customer) does not see how easy the work was for us. They only see whether using it felt smooth or bumpy.

## Rules

- **"This way is easier" is allowed only when the user cannot see the difference.**
- **Fewer, but really finished.** 3 features (or 3 sections) that cover every state beat 6 that lack an empty page, an error page or a loading state.
- **Cut scope by cutting content, not by cutting polish.**
- **Defaults that are right for most people** beat a settings page or a long form.
- **Error messages say what happened and what to do next,** in the user's language, not an internal code or a stack trace.
- **No decorative buttons.** Every button you can see must really work.

## Test

Before sending, open the real thing (app · document · form · message to be sent) and walk the main path as a new user. Any point where you must stop and think, read a manual, or wait without knowing what you are waiting for is a point to fix. For an app, the agent can walk it itself with the verify skill from `app-verifier-setup` (plugin `software-development`).

## See also

For code work → the additions in plugin `software-development` → `superuser` → `references/code-extensions.md` (the 5 screen states and the priority order on the `ui-craft` page · multi-language text `i18n-and-locale`)

## Do not use for

One-off internal tools used by one person · prototypes meant to be thrown away
