---
name: brave-llm-context
description: Deep web search via Brave LLM Context API. Returns smart chunks optimized for LLM consumption — much richer than standard search snippets. Use for research, fact-checking, or when you need detailed web content without browser automation.
---

# Brave LLM Context

Deep search using Brave's LLM Context API — returns smart chunks of web content optimized for LLM consumption, not just snippets.

## Setup

Needs env: `BRAVE_API_KEY` (Search plan key).

## Search

```bash
./search.sh "query"                          # Default (~4000 tokens)
./search.sh "query" --tokens 2000            # Smaller context
./search.sh "query" --tokens 8000            # Larger context
./search.sh "query" --count 3                # Fewer source URLs
./search.sh "query" --count 10               # More source URLs
./search.sh "query" --freshness pw           # Past week only
./search.sh "query" --country TW             # Country-specific
./search.sh "query" --lang zh-hant           # Language filter (繁中)

> Note: If you pass `--lang zh-tw`, the script auto-normalizes it to `zh-hant`.
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--tokens N` | Max tokens in response | 4096 |
| `--count N` | Max number of source URLs | 5 |
| `--freshness F` | `pd` (day), `pw` (week), `pm` (month), `py` (year) | — |
| `--country CC` | 2-letter country code | — |
| `--lang LL` | Search language code | — |
| `--raw` | Output raw JSON instead of formatted text | — |

## Output Format

Formatted output shows source URLs with their smart chunks:

```
=== [1] Page Title ===
URL: https://example.com/page

[chunk 1 text...]

[chunk 2 text...]

---
```

## When to Use

- **Use this** when you need deep, detailed content from web pages (research, analysis, fact-checking)
- **Use built-in `web_search`** for quick lookups where snippets suffice
- This API costs $5/1K requests vs standard search; use judiciously
