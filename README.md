# Ciao Bella Trattoria · Independent Staging Preview

This repository contains **only a public-facing static design preview** commissioned for Ciao Bella Trattoria. It is **not** the restaurant's live site.

## Staging safety rules
- **Never** add a CNAME file or point `ciaobellatrattoria.com` DNS at this repository without explicit authorization.
- Never publish customer lists, reservation records, payment information, passwords, API keys, or private management code.
- Reservation and catering/event forms are deliberately disabled in this preview. No real bookings or leads are submitted.
- All pages use `noindex,nofollow`. The published staging URL is not for customer use.
- Existing brand wording, approved schedule, menus, and prices are preserved where confirmed.
- There are no stock photos or AI-generated photos. Brand logo and client-owned photography are pending delivery and should be added only when approved.

## Preview pages
`site/index.html`, `site/menus.html`, `site/specials.html`, `site/reservations.html`, `site/catering.html`, `site/events.html`, `site/vip.html`, `site/contact.html`.

## GitHub Pages
A GitHub Actions workflow is included to publish **only** `site/` to the repository's GitHub Pages URL. This requires GitHub Pages and GitHub Actions to be enabled in repository settings.

## Menu notes
Approved Code Red edits: MKT$ for Grilled Australian Lamb Chops, Lamb & Bottle for Two, Braised Ribs, Pork Chops; no gluten-free copy or badges; retain vegetarian and allergy notices; dinner every day 5–10 PM; lunch every day 11 AM–2 PM beginning November 26, 2026; Wine Night Tuesday–Friday 5–10 PM; Mama's Sunday Supper $75. Other menu content awaits editable client-approved source files.

## Site preview checklist
- [ ] All eight navigation routes open
- [ ] No external image or photography substitutions
- [ ] Layout at 375px, 768px, and desktop
- [ ] Fonts and CSS load from staging subpath
- [ ] Mobile navigation opens and closes
- [ ] Menu category tabs switch content
- [ ] No customer submissions are accepted
- [ ] No CNAME or production domain references in deployment settings
