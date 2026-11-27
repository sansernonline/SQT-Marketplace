# Playwright MCP in the lab · docker-sandbox

Open from `docker-sandbox.md` section 5 when you run Playwright MCP inside the lab.

- Playwright MCP in the lab (examples from teaching work, not yet a standard): running as root needs `--no-sandbox` · the `--browser` value must match the `--help` of the installed version (`chromium` or `chrome`; if it does not match, it cannot find the browser) · screenshots with a relative file name land in the process's working directory, not `--output-dir`, so move them yourself · a click that times out with "not visible/stable" may be a background tab; see `test-automation`.
