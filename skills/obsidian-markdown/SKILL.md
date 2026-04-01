---
name: obsidian-markdown
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.
---

# Obsidian Flavored Markdown Skill

Create and edit valid Obsidian Flavored Markdown. Obsidian extends CommonMark and GFM with wikilinks, embeds, callouts, properties, comments, and other syntax. Standard Markdown (headings, bold, italic, lists, tables, code blocks) is assumed knowledge.

## Workflow: Creating an Obsidian Note

1. **Add frontmatter** with properties (title, tags, aliases) at the top. → [PROPERTIES.md](references/PROPERTIES.md)
2. **Write content** using standard Markdown for structure, plus Obsidian-specific syntax below.
3. **Link related notes** using wikilinks (`[[Note]]`) for vault notes; `[text](url)` for external URLs only. → [wikilinks.md](references/wikilinks.md)
4. **Embed content** from other notes, images, or PDFs using `![[embed]]` syntax. → [EMBEDS.md](references/EMBEDS.md)
5. **Add callouts** for highlighted info using `> [!type]` syntax. → [CALLOUTS.md](references/CALLOUTS.md)
6. **Verify** the note renders correctly in Obsidian's reading view.

## Syntax Quick Reference

| Feature | Syntax | Details |
|---------|--------|---------|
| Wikilink | `[[Note]]`, `[[Note\|Text]]`, `[[Note#Heading]]` | [wikilinks.md](references/wikilinks.md) |
| Embed | `![[Note]]`, `![[image.png\|300]]` | [EMBEDS.md](references/EMBEDS.md) |
| Callout | `> [!note]`, `> [!warning]- Title` | [CALLOUTS.md](references/CALLOUTS.md) |
| Properties | YAML frontmatter `---` block | [PROPERTIES.md](references/PROPERTIES.md) |
| Tags | `#tag`, `#nested/tag` (body or frontmatter) | [PROPERTIES.md](references/PROPERTIES.md) |
| Comment | `%%hidden%%` or `%%\nblock\n%%` | [syntax-extras.md](references/syntax-extras.md) |
| Highlight | `==text==` | [syntax-extras.md](references/syntax-extras.md) |
| Math | `$inline$`, `$$block$$` (MathJax) | [syntax-extras.md](references/syntax-extras.md) |
| Mermaid | ` ```mermaid ` code fence | [syntax-extras.md](references/syntax-extras.md) |
| Footnote | `[^1]` / `^[inline]` | [syntax-extras.md](references/syntax-extras.md) |

## References

| File | Contents |
|------|----------|
| [references/wikilinks.md](references/wikilinks.md) | Internal link syntax, block IDs, heading links |
| [references/EMBEDS.md](references/EMBEDS.md) | All embed types (audio, video, PDF, search) |
| [references/CALLOUTS.md](references/CALLOUTS.md) | Full callout list, aliases, nesting, custom CSS |
| [references/PROPERTIES.md](references/PROPERTIES.md) | Property types, default properties, inline tags |
| [references/syntax-extras.md](references/syntax-extras.md) | Comments, highlight, LaTeX, Mermaid, footnotes |
| [references/example-note.md](references/example-note.md) | Complete working Obsidian note example |

- [Obsidian Help: Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)
- [Obsidian Help: Internal links](https://help.obsidian.md/links)
- [Obsidian Help: Properties](https://help.obsidian.md/properties)
