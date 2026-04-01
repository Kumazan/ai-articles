# JSON Canvas — Layout Guidelines

## Coordinate System

- Coordinates can be **negative** (canvas extends infinitely in all directions)
- `x` increases **right**, `y` increases **down**
- Position (`x`, `y`) refers to the **top-left corner** of the node

## Spacing Rules

- Space nodes **50–100px** apart
- Leave **20–50px** padding inside groups
- Align to grid (multiples of **10 or 20**) for cleaner layouts

## Suggested Node Sizes

| Node Type | Suggested Width | Suggested Height |
|-----------|-----------------|------------------|
| Small text | 200–300 | 80–150 |
| Medium text | 300–450 | 150–300 |
| Large text | 400–600 | 300–500 |
| File preview | 300–500 | 200–400 |
| Link preview | 250–400 | 100–200 |

## Group Sizing

- Set group bounds to encompass all child nodes plus padding
- Example: if children span x=0–800, y=0–400, set group at x=-50, y=-50 with width=900, height=500
