# Obsidian Bases — Formula Syntax

## Formula Examples

```yaml
formulas:
  # Simple arithmetic
  total: "price * quantity"

  # Conditional logic
  status_icon: 'if(done, "✅", "⏳")'

  # String formatting
  formatted_price: 'if(price, price.toFixed(2) + " dollars")'

  # Date formatting
  created: 'file.ctime.format("YYYY-MM-DD")'

  # Calculate days since created (use .days for Duration)
  days_old: '(now() - file.ctime).days'

  # Calculate days until due date
  days_until_due: 'if(due_date, (date(due_date) - today()).days, "")'
```

## Key Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `date()` | `date(string): date` | Parse string to date (`YYYY-MM-DD HH:mm:ss`) |
| `now()` | `now(): date` | Current date and time |
| `today()` | `today(): date` | Current date (time = 00:00:00) |
| `if()` | `if(condition, trueResult, falseResult?)` | Conditional |
| `duration()` | `duration(string): duration` | Parse duration string |
| `file()` | `file(path): file` | Get file object |
| `link()` | `link(path, display?): Link` | Create a link |

## Duration Type

When subtracting two dates, the result is a **Duration** type (not a number).

**Duration Fields:** `duration.days`, `duration.hours`, `duration.minutes`, `duration.seconds`, `duration.milliseconds`

**IMPORTANT:** Duration does NOT support `.round()`, `.floor()`, `.ceil()` directly. Access a numeric field first (like `.days`), then apply number functions.

```yaml
# CORRECT
"(date(due_date) - today()).days"          # Returns number of days
"(now() - file.ctime).days"               # Days since created
"(date(due_date) - today()).days.round(0)" # Rounded days

# WRONG - will cause error
# "((date(due) - today()) / 86400000).round(0)"
```

## Date Arithmetic

```yaml
# Duration units: y/year/years, M/month/months, d/day/days,
#                 w/week/weeks, h/hour/hours, m/minute/minutes, s/second/seconds
"now() + \"1 day\""           # Tomorrow
"today() + \"7d\""            # A week from today
"now() - file.ctime"          # Returns Duration
"(now() - file.ctime).days"   # Get days as number
```

## YAML Quoting Rules for Formulas

- Use **single quotes** for formulas containing double quotes: `'if(done, "Yes", "No")'`
- Use **double quotes** for simple strings: `"My View Name"`
- Escape nested quotes properly in complex expressions
