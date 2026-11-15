# Class family: web login and the browser side

Open this when the system has a web app or API where users log in · uses session cookies · JWT · OAuth or LINE Login · has web pages that run JavaScript. Paste the chosen sections into the sub-agent brief whole.

## Rules for this family

- For every kind of credential (cookie · JWT · API key · OAuth code), find where the signature is checked and what it is bound to (issuer · audience · user · time). A signature that is checked but not bound can still be bypassed.
- A header that comes from the user (`Host` · `X-Forwarded-*` · `Origin` · `Referer`) is a trust decision. Follow where the value ends up.
- A missing header · a missing cookie flag · no MFA · no rate limit is not a finding by itself. You must see a request that should be blocked get through, or an effect that lands on someone else.
- A decision made at a proxy · CDN · identity provider that is not in the repo → `needs_validation`.

## Login, session and token

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `jwt-verify` | A token whose signature is not checked, or that accepts `alg: none` · does not check `aud` `iss` `exp` | `jwt.decode(` instead of `verify` · `algorithms` not pinned · checks `exp` by hand | A test sends a token with an edited payload or an expired one. It must get 401 | The verify step sits in a central middleware that already wraps the route |
| `session-fixation` | The same session id is kept after login · after logout the token still works | No `regenerate()` after login · logout only deletes the cookie on the client | Log in and compare the session id before and after · use the token after logout | The token is very short-lived and the system states it accepts that |
| `csrf` | A request that changes data through a cookie with no token and no Origin check | A `POST` route with no csrf middleware · `SameSite=None` | Send a POST from another origin with the cookie in the lab. It must get 403 | The system uses the `Authorization` header only, no cookies |
| `cookie-scope` | A cookie holding the session is sent across subdomains or over HTTP · readable from JavaScript | `domain=.example.com` · no `Secure` or `HttpOnly` | Check whether that cookie holds a secret and whether JavaScript really needs to read it | The cookie only holds a language or theme value |
| `oauth-binding` | The callback does not check `state` · `redirect_uri` is compared by prefix · no PKCE in an app that cannot keep a secret | Compares with `startsWith` · no `state` in the session | Test the callback with a wrong state and a redirect_uri with a suffix appended | The provider already enforces an exact redirect_uri (checking at its console = needs_validation) |
| `password-reset` | The reset token is guessable, reusable, or not bound to the account · the link uses the `Host` from the request | A token from `Math.random` or a timestamp · the URL built from `req.headers.host` | Request a reset for account A and use the token on B · send a fake Host and look at the link in the fake email | The token is long, random from a CSPRNG and already bound to the user id |
| `mfa-bypass` | A path that skips the MFA step (an old API version · login with a remember-this-device token) · MFA is turned off without re-confirmation | An `mfaPassed` flag set before the code is checked · a route that does not go through the MFA step | Log in and call an MFA-protected route without doing step 2 | That route is outside the scope the system promised to protect with MFA |
| `account-linking` | Links a LINE or Google account to an existing account by an unverified email | Finds the user by the provider's email without looking at `email_verified` | Create a fake account with a matching email and see whether it reaches the existing account | The provider always verifies email and the code checks the flag |
| `api-key-scope` | Shop A's key works on shop B's data · the key sits in a URL or log | Checks only that the key exists, not whose it is | Test one tenant's key against another tenant's id | The key belongs to a single internal system with no multiple owners |

## Framing, cache and headers

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `host-header` | A link in an email, a redirect or a cache key is built from the `Host` the user sent | `req.headers.host` · `request.host` when building a URL | A test sends a fake Host. Look at the resulting link | The framework sets allowed hosts (`ALLOWED_HOSTS` · `AllowedHosts`) |
| `cache-deception` | A private page is cached and others can open it · the cache key leaves out the user | `Cache-Control: public` on a route that needs login · an in-memory cache keyed by path only | Two fake accounts call the same route through the cache in the lab | The cache is at a CDN outside the repo → needs_validation |
| `response-splitting` | A user value goes into a header without stripping newlines | `setHeader(..., input)` · `Content-Disposition` built from a file name | A test sends `%0d%0a` in the value | Newer frameworks already reject CRLF in headers |
| `request-smuggling` | The proxy and the app read request boundaries differently | A hand-written HTTP parser · uses both `Content-Length` and `Transfer-Encoding` | Needs both the proxy and the app in the lab, so it is mostly needs_validation | No parser of its own, only a standard server |

## Browser side

| Class (`class`) | What it hunts | Signal in code | How to prove it | Often misreported when |
|---|---|---|---|---|
| `xss-dom` | A value from the URL, storage or an API goes into the DOM as HTML | `innerHTML` · `dangerouslySetInnerHTML` · `v-html` · `[innerHTML]` · `bypassSecurityTrust*` | Render `<img src=x onerror=...>` in the lab and see whether it runs | The value goes through a sanitizer (DOMPurify) first, or comes from a constant |
| `postmessage-origin` | Receives `message` without checking `event.origin`, then does something with effect | `addEventListener('message'` with no `origin ===` | A test sends a message from another origin in the lab browser | The handler only logs, or has no effect on state |
| `cors-credentials` | Reflects the Origin back with `Allow-Credentials: true` | `origin: true` · `callback(null, true)` for every origin | A test sends a fake Origin. Look at the response headers | The response holds no private data, or no cookies are used |
| `websocket-origin` | A WebSocket uses a cookie but does not check Origin at the handshake | No origin check in `upgrade` | Open a WebSocket from another origin with the cookie | A token in the first message is used instead of a cookie |
| `storage-token` | A long-lived token in `localStorage` paired with an XSS | `localStorage.setItem('token'` | A confirmed XSS must be the other link, which makes it a chain | There is no confirmable XSS (it is only hardening) |
| `clickjacking` | A page with a button that changes money or rights can be placed in someone else's iframe | No `frame-ancestors` or `X-Frame-Options` on that page | Open the page in an iframe from another origin in the lab | The page has no action with effect |
| `open-redirect` | Redirects to any destination from a parameter | `res.redirect(req.query.next)` | Test `next=https://evil.example` | The destination is checked against an allowlist or forced to be an internal path |

## Method that works across the family

- Trace every credential through its life cycle: issue → store → send → use → renew → revoke. Then compare the normal path with the error, retry and old-version paths.
- Count every door that reaches the same identity and every path that reaches the same important job. Real security equals the weakest path, not the path the web page uses.
- Account recovery and account linking: map what the account is linked to before and after. Every edge needs evidence that the person acting really owns the account.
