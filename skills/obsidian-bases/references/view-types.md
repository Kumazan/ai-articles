# Obsidian Bases — View Types

## Table View

```yaml
views:
  - type: table
    name: "My Table"
    order:
      - file.name
      - status
      - due_date
    summaries:
      price: Sum
      count: Average
```

## Cards View

```yaml
views:
  - type: cards
    name: "Gallery"
    order:
      - file.name
      - cover_image
      - description
```

## List View

```yaml
views:
  - type: list
    name: "Simple List"
    order:
      - file.name
      - status
```

## Map View

Requires latitude/longitude properties and the Maps community plugin.

```yaml
views:
  - type: map
    name: "Locations"
    # Map-specific settings for lat/lng properties
```

## View Options (All Types)

| Option | Description |
|--------|-------------|
| `name` | Display name for the view tab |
| `limit` | Max number of items to show |
| `groupBy.property` | Property to group by |
| `groupBy.direction` | `ASC` or `DESC` |
| `filters` | View-level filters (same syntax as global) |
| `order` | Array of properties to display |
| `summaries` | Map property → summary formula name |

## Embedding Views

```markdown
![[MyBase.base]]

<!-- Specific view -->
![[MyBase.base#View Name]]
```
