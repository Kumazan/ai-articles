# x-reader/scripts

## Scripts

### bird_with_auth.sh

Wrapper script that extracts X/Twitter authentication cookies (`auth_token`, `ct0`) from the OpenClaw browser via CDP, exports them as environment variables, and then executes the `bird` CLI with the provided arguments. Cookies are held in memory only for the duration of the command.

### cdp_cookies.py

Connects to the OpenClaw browser's Chrome DevTools Protocol (CDP) endpoint, finds an open x.com tab, and extracts the `auth_token` and `ct0` cookies. Prints `export` lines to stdout so the caller can `eval` them. Requires the `websockets` Python package. The CDP port defaults to 18800 but can be overridden with the `CDP_PORT` environment variable.

### x_reader.py

CLI tool for X Reader state management and tweet filtering. Subcommands:

- `filter` -- Reads raw tweet JSON from stdin, applies signal/noise rules (external links, threads, code blocks, benchmarks vs. engagement bait), deduplicates against seen state, and outputs kept tweets as JSON.
- `mark-read` -- Records tweet IDs as seen so they are skipped in future filter runs.
- `status` -- Displays last scan time and cumulative fetch/keep/skip statistics.
- `add-account` / `remove-account` -- Helpers for managing the follow list in `config.yaml`.
- `accounts` -- Lists all tracked X handles from the config.
