# CODE RED — Ciao Bella production cutover runbook (NOT authorization)

**Current decision: NO-GO unless every mandatory gate below is signed off.** Last reviewed: 2026-11-06. Staging only. Do not change `ciaobellatrattoria.com`, DNS, emails or SpotHopper production.

## P0: Customer operations

- [x] Staging routes to five HTML menu categories, 137 menu entries, and the four confirmed market-priced chef specials. Based on the restaurant-supplied PDF menu files with Code Red dietary, hours, and pricing overrides.
- [x] **Staging menu authority approved:** Use Kat's November 3–4 email and supplied new menu PDFs, applying later Code Red corrections first. User decides the exact production version. Slice price variance remains a restaurant operations follow-up.
- [x] Staging booking/lead CTAs open the **verified provider-hosted** endpoints for reservations (`tmt.spotapps.co/reservations?spot_id=344525`), private parties (`tmt.spotapps.co/private-parties?spot_id=344525`) and catering (`tmt.spotapps.co/catering?spot_id=344525`). The existing Slice ordering link was verified against the live restaurant homepage.
- [ ] **Must confirm with SpotHopper that direct hosted booking/inquiry forms continue functioning after website hosting changes.** Do not terminate service or unlink forms.
- [ ] Test an owner-approved *actual* reservation, catering request and private event request end-to-end and verify staff notification/recording; never create arbitrary customer bookings as a test.
- [ ] Confirm staff can receive and fulfill Slice orders and manage all form submissions. Web landing-page checks do not prove backend delivery.
- [x] Contact fallback: public phone `(954) 428-2676` and listed restaurant email `orfeopizzeriarestaurant@mail.com`.

## P1: Visual & interaction

- [x] Authentic-only image ZIP supplied, extracted during staging deployment; no stock or generated photographs.
- [x] Carousel manual buttons, gallery, popup close, responsive navigation and booking CTA tested by Chromium at 320 / 375 / 390 / 768 / 1280px. Auto carousel transition begins after initial content stabilizes.
- [x] Holiday Parties artwork is the original SpotHopper promotion; staged modal includes verified provider-hosted party destination.
- [x] Original Holiday Parties JPEG copied into `site/assets/holiday-party-original.jpg` and verified in the public staging repository. Deploy/test workflows now use the local file rather than fetching live from SpotHopper.

## P2: SEO & performance

- [x] Staging pages have separate title/meta, Restaurant JSON-LD, noindex, and visible text menu. Production canonicals/sitemap staged under `docs/production/`, not published.
- [ ] Resolve Lighthouse mobile LCP (last lab reading was above 2.5s); repeat real mobile audit and evaluate before launch.
- [ ] Manual ADA screen-reader review, Web Vitals and Google Search Console verification unavailable.
- [ ] Publish production canonical tags, robots and sitemap **only after explicit production authorization**.

## P3: DNS and rollback

1. **Owner/registrar gate**: Verify lawful domain owner, GoDaddy transfer completion or registrar access and DNS edit permissions. None confirmed here.
2. **Full DNS snapshot before any change**: Export current authoritative NS, A, AAAA, CNAME, MX, TXT (SPF, DKIM, DMARC, domain verifications), CAA and any SRV records. Confirm mail delivery services. Preserve the exact current DNS values and TTLs in a secure owner-held location, **not public GitHub**.
3. **Old paths inventory**: Confirmed: `/`, `/food-menu`, `/reservations`, `/catering`, `/party`, `/-party`. Full crawl and Search Console export are outstanding. Watch query-parameter paths, alternate hostnames and the correct canonical host. **Printed QR menu codes may still target `/food-menu`** and need continuity testing.
4. **Redirect solution required**: GitHub Pages cannot issue arbitrary path-specific server-side 301s. Arrange an authorized edge/proxy redirect service (for example DNS/CDN rules) or a host capable of 301/308 redirects for old paths, without creating loops. Test each old URL before cutover. `docs/production/redirect-map.csv` is **preparation only**.
5. **Hosting gate**: Verify the final production hosting and customer-service endpoints first, leaving old services live. Staging remains isolated and noindexed.
6. **Owner approval gate**: Require explicit approval for the exact DNS/hosting cutover and a rollback decision-maker. A deadline alone is not authorization.
7. **Cutover**: Only with that permission, configure production host + certificates, approved redirects/canonicals, and DNS after recording current values. Confirm home, all menu categories, contact, ordering, reservations, catering, private parties, mobile and mail flows. Preserve the existing MX/TXT email records. **Do not cancel SpotHopper**.
8. **Rollback**: If any critical flow fails, restore the recorded prior website DNS A/AAAA/CNAME and/or prior nameservers (as appropriate), while retaining all MX/TXT records and leaving SpotHopper running. Test public home + legacy URLs + ordering + booking + email after restoration. DNS cache/TTL means restoration may not be instant. Call owner before switching.
9. **Go-live SEO**: Only once approved, remove noindex in the **production** build, publish correct canonical links and sitemap; validate with Search Console URL inspection. This is a same-domain hosting move, not a Change of Address event.

**Hard stop:** Without explicit user approval for the exact production cutover, DNS control/backup, proven redirects, or proven booking/inquiry backend continuity, **keep the existing production website operational**. Price variances with Slice are tracked for operational cleanup.
