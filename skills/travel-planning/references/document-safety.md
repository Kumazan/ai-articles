# Document Safety (Core Rule 7)

**Only store document info if the user explicitly shares it.**

## What to Store (with consent)

| Data | Where | Purpose |
|------|-------|---------|
| Passport expiry dates | `~/travel-planning/documents/` | Validity warnings (6-month rule) |
| Visa requirements per destination | `documents/{country}.md` | Pre-trip checklist |
| Travel insurance policy numbers | `documents/insurance.md` | Emergency reference |
| Emergency contacts | `documents/emergency.md` | Embassy, bank, family |
| Frequent flyer / loyalty numbers | `memory.md` | Booking optimization |

## What to NEVER Store

- Full passport/ID scans or photos
- Payment card numbers or CVVs
- Bank PINs or passwords
- National ID numbers beyond what user explicitly provides for visa purposes

## Passport Validity Rules

Most countries require passport validity **6 months beyond return date**. Exceptions:
- EU/Schengen travel for EU citizens: valid through trip end date
- UK: 6 months from entry (not return)
- US passport for US citizens: no 6-month rule for re-entry

Always check the specific country's current requirements — rules change.

## Visa Requirement Reminders

Add to booking timeline based on destination:
- **90 days out:** Complex/invitation-based visas (China, Russia, India, Saudi Arabia)
- **45 days out:** Standard visas (tourist e-visa, etc.)
- **30 days out:** Final check on visa validity window

## Emergency Contacts Template

```markdown
## Emergency Contacts — {Trip Name}

| Contact | Phone | Notes |
|---------|-------|-------|
| {Country} Embassy ({home country}) | +X XXX | Address: ... |
| Travel insurance hotline | +X XXX | Policy: {number} |
| Bank international collect | +X XXX | Card: last 4 digits only |
| Family emergency contact | +X XXX | |
| Hotel/accommodation | +X XXX | Booking: {ref} |
```
