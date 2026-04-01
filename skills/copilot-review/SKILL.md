---
name: copilot-review
description: Review GitHub PRs or local diffs using GitHub Copilot CLI. Use when asked to review a PR, code review, diff review, or PR feedback. Requires `gh copilot` (bundled with `gh` CLI) and a Copilot subscription.
---

# Copilot Code Review

Use GitHub Copilot CLI (`gh copilot -p`) in non-interactive mode to review code changes.

## Prerequisites

- `gh` CLI installed (`brew install gh`) and authenticated (`gh auth status`)
- GitHub Copilot CLI available (bundled with `gh`; auto-downloaded on first run of `gh copilot`)
- Active GitHub Copilot subscription
- Verify installation: `gh copilot -- --version`

## Workflow

### 1. Identify the target

Determine what to review:
- **PR by number**: `gh pr diff <number> --repo <owner/repo>`
- **PR by URL**: extract owner/repo and number from URL
- **Local changes**: `git diff`, `git diff --staged`, or `git diff main..HEAD`

### 2. Save diff to temp file

```bash
gh pr diff <number> --repo <owner/repo> > /tmp/pr-review.diff
```

### 3. Run Copilot review

```bash
gh copilot -p "Review the code diff in /tmp/pr-review.diff. Focus on: bugs, security issues, code quality, edge cases, and suggestions. Be concise and actionable." --allow-all-tools
```

#### Custom focus areas

Append focus instructions to the prompt as needed:
- Security audit: `"...Focus specifically on security vulnerabilities, injection risks, and auth issues."`
- Performance: `"...Focus on performance bottlenecks, N+1 queries, and memory leaks."`
- Architecture: `"...Focus on design patterns, separation of concerns, and maintainability."`

### 4. Optional: post review as PR comment

```bash
# Capture output and post to PR
gh copilot -p "..." --allow-all-tools 2>&1 | tee /tmp/review-output.txt
gh pr comment <number> --repo <owner/repo> --body-file /tmp/review-output.txt
```

## Notes

- Copilot CLI uses its own model selection (currently defaults to Claude Sonnet 4.6); each call costs ~1 Premium request.
- Use `--add-dir <path>` if the review needs access to surrounding source files for context.
- For large PRs, consider splitting the diff by file and reviewing in parts.
- The `--allow-all-tools` flag lets Copilot read files; use `--allow-read` for read-only access.

## Troubleshooting

- **`gh copilot` not found / command not recognized**: Ensure `gh` CLI is installed (`brew install gh`). The Copilot CLI is bundled with `gh` and auto-downloads on first use. If it still fails, try `gh copilot --remove` then re-run `gh copilot` to re-download.
- **Authentication failure / 401 errors**: Run `gh auth status` to check login. Re-authenticate with `gh auth login` if needed. Ensure your GitHub account has an active Copilot subscription.
- **"No Copilot access" or subscription errors**: Verify your Copilot subscription is active at https://github.com/settings/copilot. Organization-managed subscriptions may require admin approval.
- **Timeout on large diffs**: Split the diff into smaller files by path (`gh pr diff <n> -- '*.ts'`) or review file-by-file to stay within token limits.
