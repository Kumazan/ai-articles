# Internal Links (Wikilinks)

## Basic Syntax

```markdown
[[Note Name]]                          Link to note
[[Note Name|Display Text]]             Custom display text
[[Note Name#Heading]]                  Link to heading
[[Note Name#^block-id]]                Link to block
[[#Heading in same note]]              Same-note heading link
[[#^block-id-in-same-note]]            Same-note block link
```

## Block IDs

Define a block ID by appending `^block-id` to any paragraph:

```markdown
This paragraph can be linked to. ^my-block-id
```

For lists and quotes, place the block ID on a separate line after the block:

```markdown
> A quote block

^quote-id
```

Block IDs may contain letters, numbers, and hyphens only. No spaces or special characters.

## Heading Links

```markdown
[[Note Name#Exact Heading Text]]       Must match heading exactly (case-sensitive)
[[Note Name#Sub Heading]]              Works with any heading level (H1–H6)
```

## Embed Variant

Prefix any wikilink with `!` to embed rather than link:

```markdown
![[Note Name]]                         Embed full note
![[Note Name#Heading]]                 Embed section
![[Note Name#^block-id]]               Embed single block
```

## Decision Rule

| Target | Syntax |
|--------|--------|
| Note in vault | `[[Note Name]]` |
| External URL | `[text](https://...)` |
| Email / tel | `[text](mailto:x@y.com)` |

Use `[[wikilinks]]` for vault-internal notes — Obsidian tracks renames automatically. Use standard Markdown links only for external URLs.
