---
name: Travel Planning
slug: travel-planning
version: 1.0.1
homepage: https://clawic.com/skills/travel-planning
description: Plan trips with itineraries, multi-city routing, budget optimization, family logistics, packing lists, and visa timelines.
metadata: {"clawdbot":{"emoji":"✈️","requires":{"bins":[]},"os":["linux","darwin","win32"]}}
---

## Setup

On first use, read `setup.md`. Help naturally without technical jargon — users can ask about storage details if curious.

## When to Use

User wants to plan a trip, track travel expenses, organize bookings, coordinate group/family travel, or build packing lists. Covers the full lifecycle: dreaming → planning → booking → traveling → documenting.

## Architecture

```
~/travel-planning/
├── memory.md              # Preferences + travel history
├── wishlist/              # Dream destinations
├── trips/{trip-name}/
│   ├── overview.md
│   ├── itinerary.md       # → references/itinerary-template.md
│   ├── bookings.md
│   ├── packing.md
│   ├── budget.md          # → references/budget-template.md
│   └── travelers.md       # Groups/families
├── completed/             # Past trips
├── templates/             # Reusable packing lists
└── documents/             # Passport, visa, insurance info
```

## Core Rules

1. **Check Memory First** — Read `~/travel-planning/memory.md` before any planning (style, past patterns, document status, group composition).
2. **Trip Lifecycle** — Dream → wishlist/; Plan → trips/ (dates confirmed); Book → bookings.md + budget; Travel → reference itinerary; Return → completed/ + document lessons.
3. **Booking Timeline** — Proactively remind based on trip dates. → [booking-guide.md](references/booking-guide.md)
4. **Budget Tracking** — Track planned vs actual per category; include per-person breakdown for groups. → [budget-template.md](references/budget-template.md)
5. **Multi-City Planning** — Min 2 nights/city; group geographically; use open-jaw flights; track connection buffers. → [multi-city-template.md](references/multi-city-template.md)
6. **Family & Group Travel** — Create travelers.md; plan energy breaks; book kitchen access; assign roles; check child consent rules. → [group-travel.md](references/group-travel.md)
7. **Document Safety** — Only store doc info user explicitly shares; never store full scans or payment data. → [document-safety.md](references/document-safety.md)

## Trip Lifecycle Table

| Phase | Action |
|-------|--------|
| Dream | Add to `wishlist/` with why, when, budget estimate |
| Plan | Create `trips/` folder when dates confirmed |
| Book | Log confirmations in `bookings.md`, update `budget.md` |
| Travel | Reference `itinerary.md`, log actual expenses |
| Return | Move to `completed/`, document highlights and lessons |

## Booking Timeline (Key Points)

| Days Out | Action |
|----------|--------|
| 90+ | Complex visas; group flight blocks |
| 60 | International flights; pre-existing condition insurance |
| 45 | Hotels; standard visas; group rentals |
| 30 | Activities; restaurant reservations |
| 14 | General insurance; children's documents |
| 7 | Bank notifications; packing finalize; check-in |

## References

| File | Contents |
|------|----------|
| [references/budget-template.md](references/budget-template.md) | Full budget.md template with per-person & actual tracking |
| [references/itinerary-template.md](references/itinerary-template.md) | Day-by-day itinerary structure |
| [references/multi-city-template.md](references/multi-city-template.md) | Connection table, buffers, routing strategies |
| [references/group-travel.md](references/group-travel.md) | Family & group logistics checklist |
| [references/document-safety.md](references/document-safety.md) | What to store, passport rules, emergency contacts |
| [references/common-traps.md](references/common-traps.md) | 8 common planning traps and counters |
| [references/booking-guide.md](references/booking-guide.md) | Timing table, cost optimization, group booking tips |
