---
name: obsidian-bases
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases Skill

## Workflow

1. **Create the file** — Create a `.base` file in the vault with valid YAML content
2. **Define scope** — Add `filters` to select which notes appear (by tag, folder, property, or date)
3. **Add formulas** (optional) — Define computed properties in the `formulas` section
4. **Configure views** — Add one or more views (`table`, `cards`, `list`, `map`) with `order` specifying which properties to display
5. **Validate** — Verify valid YAML, no syntax errors. Check all referenced properties and formulas exist. See [troubleshooting](references/troubleshooting.md) for common issues
6. **Test in Obsidian** — Open the `.base` file to confirm the view renders. If YAML error shows, check quoting rules below

## YAML Core Rules

1. **Quote strings with special chars** — Any value containing `:`, `{`, `}`, `[`, `]`, `#`, `!`, etc. must be quoted
2. **Formula quoting** — Use single quotes for formulas that contain double quotes: `'if(done, "Yes", "No")'`

## References

| File | Contents |
|------|----------|
| [schema.md](references/schema.md) | Complete YAML schema + default summary formulas table |
| [filter-syntax.md](references/filter-syntax.md) | Filter YAML examples + operators table |
| [properties-reference.md](references/properties-reference.md) | Three property types + file properties table + `this` keyword |
| [formula-syntax.md](references/formula-syntax.md) | Formula examples + key functions + Duration type + date arithmetic |
| [view-types.md](references/view-types.md) | Table / Cards / List / Map YAML examples + view options + embedding |
| [examples.md](references/examples.md) | Task Tracker, Reading List, Daily Notes complete YAML |
| [troubleshooting.md](references/troubleshooting.md) | YAML errors + formula errors with before/after fixes |
| [FUNCTIONS_REFERENCE.md](references/FUNCTIONS_REFERENCE.md) | Complete function reference (Date, String, Number, List, File, Link, Object, RegExp) |
