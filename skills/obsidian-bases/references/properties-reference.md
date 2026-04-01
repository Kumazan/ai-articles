# Obsidian Bases — Properties Reference

## Three Types of Properties

1. **Note properties** — From frontmatter: `note.author` or just `author`
2. **File properties** — File metadata: `file.name`, `file.mtime`, etc.
3. **Formula properties** — Computed values: `formula.my_formula`

## File Properties Complete Table

| Property | Type | Description |
|----------|------|-------------|
| `file.name` | String | File name |
| `file.basename` | String | File name without extension |
| `file.path` | String | Full path to file |
| `file.folder` | String | Parent folder path |
| `file.ext` | String | File extension |
| `file.size` | Number | File size in bytes |
| `file.ctime` | Date | Created time |
| `file.mtime` | Date | Modified time |
| `file.tags` | List | All tags in file |
| `file.links` | List | Internal links in file |
| `file.backlinks` | List | Files linking to this file |
| `file.embeds` | List | Embeds in the note |
| `file.properties` | Object | All frontmatter properties |

## The `this` Keyword

- In main content area: refers to the base file itself
- When embedded: refers to the embedding file
- In sidebar: refers to the active file in main content

## Configuring Properties

```yaml
properties:
  status:
    displayName: "Status"
  formula.days_until_due:
    displayName: "Days Until Due"
  file.ext:
    displayName: "Extension"
```
