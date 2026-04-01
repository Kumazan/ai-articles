# Multi-City Connection Planning

## Connection Table Template

```markdown
## City Connections — {Trip Name}

| From        | To          | Transport | Duration | Cost | Booked |
|-------------|-------------|-----------|----------|------|--------|
| Paris       | Amsterdam   | Train     | 3h 20m   | €80  | ✓      |
| Amsterdam   | Berlin      | Flight    | 1h 15m   | €65  | ✓      |
| Berlin      | Prague      | Bus       | 4h 30m   | €25  | ✗      |

### Connection Risks
- Paris → Amsterdam: Low (frequent trains, no check-in required)
- Amsterdam → Berlin: Medium (need 2h+ buffer at airport)
- Berlin → Prague: Low (bus, flexible timing)

### Luggage Strategy
- Full luggage: check at origin, collect at final destination
- Day bags: carry essentials for city transitions
- Storage: use luggage lockers at stations for same-day city visits
```

## Planning Strategies

### Minimum Stay
- **2 nights minimum per city** — one-night stays are exhausting and wasteful.
- For cities < 2 nights, skip and add as a day trip from a nearby base.

### Routing Logic
1. Group geographically close destinations to minimize backtracking.
2. Consider **open-jaw flights** (fly into A, out of B) — often same price as round-trip.
3. Use trains for distances < 4 hours (city center to city center, no check-in).
4. Use overnight trains/buses for long legs to save on accommodation.

### Connection Buffers
| Connection Type | Minimum Buffer |
|-----------------|----------------|
| International flight | 4+ hours |
| Domestic flight | 2+ hours |
| Train to flight | 3+ hours (check-in + transfer) |
| Train to train | 30 min (same station), 1h+ (different stations) |
| Bus (flexible) | No strict buffer needed |

### Currency Planning
- Note different currencies per country leg.
- Pre-order foreign cash for countries with limited ATMs.
- Track exchange rates used vs actual in budget.md.
