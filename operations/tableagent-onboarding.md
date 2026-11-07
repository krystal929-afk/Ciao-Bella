# TableAgent reservation onboarding — Ciao Bella (staging preparation only)

**No restaurant account has been created or linked yet.** Register as the management administrator at https://tableagent.com/myaccount/register/ and then add the business through https://tableagent.com/submit-restaurant/ . Account verification or restaurant listing approval may be required.

## Verified restaurant details to enter

- Business: Ciao Bella Italian Trattoria
- Address: 1380 South Federal Highway, Deerfield Beach, FL 33441
- Public phone: (954) 428-2676
- Time zone: America/New_York
- Dinner: daily, 5:00 PM–10:00 PM
- Lunch: daily, 11:00 AM–2:00 PM, effective November 26, 2026
- Official logo: approved 3640.png image available in staging assets
- Restaurant-owned food photography is already in the project.
- Restaurant account should be under The Krystal Method's delegated management, with appropriate restaurant owner access.

## What must NOT be guessed

Actual table names, indoor/outdoor count and capacity, turnaround times, joined table pairings, disabled times, deposit policy, emergency contact, host notification address, and whether automatic booking confirmations are enabled. Configure those with the restaurant before enabling online availability.

## Captured bookings (PRIVATE; not in GitHub)

- The user supplied **13 complete reservation screenshots**.
- **11 confirmed**, **2 cancelled**.
- **One upcoming confirmed reservation** on November 7 at 7:00 PM, party of six, inside.
- The other **12 are historical only** and must not be rebooked in the live calendar.
- A historical comment mentions an OpenTable booking. Verify whether that channel is active before using two competing reservation inventories.
- The private handoff package is stored in the user's conversation download, NOT in this repository.
- Original provider reservation IDs were not shown in screenshots, only local screenshot references.
- No marketing consent has been verified; never use reservation contacts for promotional blasts without opt-in evidence.

## First connection procedure

1. Create/verify your TableAgent business account. Request restaurant/host access.
2. Enter actual tables and booking rules, then disable public booking links until staff testing is complete.
3. Use the private packet to manually enter the **one upcoming confirmed booking**. If TableAgent sends notifications on manual entry, ask staff first to avoid duplicate customer confirmations. Preserve the original booking in SpotHopper.
4. Test a staff-authorized synthetic booking for confirmation, cancellation, table assignment, notification delivery and mobile booking page. Do not use actual diners as test reservations.
5. Copy the **actual TableAgent restaurant-specific HTTPS booking URL** from the dashboard. Never invent its slug.
6. For a dry run (no edit): `node operations/tableagent-link-prep.mjs --url "https://tableagent.com/iframe/ACTUAL-VENUE/"`.
7. After successful verification, switch **staging only** with `--booking-page-tested --staff-flow-tested --apply`, commit the changed `site/services.json`, and verify every reservation CTA in staging.
8. Keep the real restaurant production domain and SpotHopper unchanged until the owner-approved overall migration/cutover.

TableAgent publishes a free reservation/table/waitlist system; paid options may include SMS. Source: https://tableagent.com/reservation-system/ . Bulk import support for these historical records has **not** been verified.
