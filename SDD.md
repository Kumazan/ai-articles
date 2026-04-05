# SDD: Add .gitignore for ai-articles (GitHub Pages / Jekyll site)

## Goal
Add a `.gitignore` to prevent OS junk, editor temp files, and Jekyll build artifacts from being tracked in git.

## Scope

### In
- Add `.gitignore` with standard Jekyll/GitHub Pages + macOS + editor patterns

### Out
- No content changes
- No config changes

## Approach
The repo currently has no `.gitignore`. For a Jekyll-based GitHub Pages site, common artifacts to ignore include `_site/` (Jekyll build output), `.sass-cache/`, `.jekyll-cache/`, `Gemfile.lock`, `.DS_Store`, editor dirs (`.vscode/`, `.idea/`), and OS metadata.

**Alternative:** Minimal .gitignore with just `.DS_Store` — rejected because Jekyll cache dirs and editor files will accumulate.

**Trade-offs:** More comprehensive gitignore = less accidental noise in PRs. No downside for a static site repo.

## Change List

| File | Change | Why |
|------|--------|-----|
| `.gitignore` | Create new file | Prevent OS/editor/Jekyll artifacts from being tracked |

## Tests
- `git check-ignore -v .DS_Store` — must match
- `git check-ignore -v _site/` — must match
- `git status` — must show only `.gitignore` as new file

### Results
✅ All checks passed — .DS_Store matched, git status clean

## Rollback
Delete `.gitignore` — no other files touched.

## Risk Notes
- Zero risk: `.gitignore` only affects untracked files
- No currently-tracked files will be removed from git
