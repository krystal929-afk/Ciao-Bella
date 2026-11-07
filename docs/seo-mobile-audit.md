# Ciao Bella: SEO / GEO / Mobile-first Code Red audit

**Scope:** GitHub Pages staging only. This file is a development audit, not proof of production compliance.

**Last source review:** November 6, 2026. **Staging repository:** `krystal929-afk/Ciao-Bella`.

## Status by requirement

| Area | Status | Findings / fixes |
| --- | --- | --- |
| Eight distinct page titles and descriptions | PASS (source) | All eight staging HTML documents now use unique Deerfield Beach-specific titles and factual descriptions. |
| Staging indexing protection | PASS (source) | Every page has `meta name="robots" content="noindex,follow,noarchive"`. No production CNAME or DNS changes. The staging robots file no longer conflicts with these tags. GitHub Pages project-path robots.txt is not a hostname-level directive. |
| Restaurant structured data | PASS (JSON syntax / source), NEEDS WORK (external Rich Results test) | Homepage embeds valid JSON-LD `Restaurant` markup with confirmed name, address, phone, Italian cuisine, dinner hours and staging menu URL. Lunch starting November 26 is explicitly visible in HTML but is **not** represented as current opening hours until it begins. No invented ratings. |
| Crawlable menu content | NEEDS WORK | Existing HTML provides approved highlighted items, MKT$ chef specials, and Nov 26 lunch promotions. Full client-approved editable menu is not yet reflected as complete HTML; do not copy outdated live pricing. |
| Local GEO / AI readability | PASS (source), NEEDS WORK (indexing) | Consistent location, dinners, lunch start date, and available specials appear in HTML and JSON-LD. A noindex staging site is intentionally not eligible for search visibility. No AI-only markup. |
| Social sharing metadata | PASS (source), NEEDS WORK (external preview) | Open Graph and Twitter summary meta tags added with the client-owned logo or photos. Validate with real share debuggers after approval. |
| Images & loading | PASS (source), NEEDS WORK (real metrics) | Only Ciao Bella-approved packaged image files; hero image explicitly preloaded and `fetchpriority=high`. Below-fold gallery imagery remains lazy loaded. Actual LCP, INP and CLS not measured from public traffic. |
| Responsive & keyboard code | PASS (source and browser testing) | Site includes styles for 320, 375, 390, 768 and desktop; touch-target and tab-arrow-key improvements added. GitHub Chromium job verified 40 viewport/page combinations at 320, 375, 390, 768 and 1280px with zero test failures on the final commit. |
| Modal accessibility | NEEDS WORK | Native dialogs, close buttons, keyboard Escape and reduced-motion support exist; full screen-reader and WCAG audit still required. |
| External ordering & reservations | NEEDS WORK | Public-facing external actions link to existing systems, not new forms. Do not claim checkout or confirmation testing until verified with the restaurant. |
| Local SEO URL preservation | NEEDS WORK | Verified old URLs mapped in `production/redirect-map.csv`. Full production crawl, Search Console export and edge/host 301 redirect capability require authorization and testing. |
| Production sitemap / indexing | PREPARED, NOT ACTIVATED | `production/sitemap.xml`, `production/robots.txt`, and `production/canonical-map.json` are reference-only files outside `site/`. They are **not** deployed to staging and must not be used until explicit production authorization. |
| Lighthouse / PageSpeed / Core Web Vitals | NEEDS WORK (lab); BLOCKED (field) | Actual mobile Lighthouse lab on the local GitHub runner measured Performance **86**, Accessibility **100**, SEO **66** (staging noindex affects SEO scoring), LCP **4,128ms**, CLS **0.00054** and TBT **83ms**. LCP exceeds the 2.5s target. INP and live field Core Web Vitals remain unmeasured. |

## Targets (not claims)
LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1 at the 75th percentile of real visits (mobile and desktop). These are targets, **not current measurements**.

## Go-live prerequisites. No production modifications authorized.

1. Preserve existing live URL paths wherever feasible, or implement **server-side permanent (301/308) redirects** for every moved path. GitHub Pages alone cannot supply arbitrary server-side redirects.
2. Audit all existing URLs and backlinks from actual production crawls and Search Console, including special, drinks, catering, parties and menu pages.
3. Decide canonical hostname `www` or bare domain, configure equivalent redirect, and then generate the sitemap and canonical tags from the confirmed production URLs.
4. Test mobile screenshots at 320/375/390/768/1280+ px, full forms, screen readers, contrast and keyboard traps.
5. Validate Restaurant structured data, verified profile details and menu accuracy. Add lunch to current structured opening hours only on/after Nov 26 if operational.
6. Run actual Lighthouse (mobile/desktop) and PageSpeed Insights, inspect CrUX/Search Console Core Web Vitals when available. Record data, not estimates.
7. **Only with explicit authorization**: review staging changes, disable staging noindex on the production build, deploy, configure redirects, and submit a verified sitemap. **Never point `ciaobellatrattoria.com` at staging without approval.**
8. This is a same-domain hosting move: Google Search Console's **Change of Address** tool is **not** for this case. Use existing domain property, URL inspection, sitemaps, and appropriate redirects.

## Sources
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://support.google.com/webmasters/answer/9370220
- https://developers.google.com/search/docs/appearance/core-web-vitals

## Confirmed audit executions (November 6, 2026)

- [Chromium mobile & desktop verification](https://github.com/krystal929-afk/Ciao-Bella/actions/runs/42305897092): **PASS**, 40 of 40 checks, including responsive layout, menu tabs, modal interactions, navigation, loaded images, JS errors and horizontal overflow.
- [Mobile Lighthouse lab](https://github.com/krystal929-afk/Ciao-Bella/actions/runs/42305897441): **Performance 86, Accessibility 100, SEO 66.** Lab LCP **4,128ms** (NEEDS WORK), CLS **0.00054** (PASS), TBT **83ms** (context only). These are locally simulated Lighthouse results, **not field scores** and do not measure INP.
- The published [staging preview](https://krystal929-afk.github.io/Ciao-Bella/) passed GitHub Pages deployment. It is still **noindex**, and the complete menu, production SEO, external integrations and actual field data remain outstanding.
- Current production website is still reported on November 6 as closing at **9 PM and omitting Monday**, which conflicts with the approved **daily 5–10 PM** schedule. **No change was made to the production site.** This issue belongs on the operations correction list until migration.
- The staging "Order Online" button was switched to the Ciao Bella Slice address linked directly by the existing production homepage. The existing reservation URL also originates from the live site; new reservation engine not yet live.

## Audit limitations
The responsive workflow tests layout and interactive controls but is **not** a substitute for manual screen-reader testing or a full independent accessibility audit. SEO structured data was JSON-parsed in source; Google's remote Rich Results Test and PageSpeed Insights have **not** been run. No production indexing checks were performed.

## 2026-11-06 launch remediation update
- Complete restaurant-supplied menu inventory now staged as five HTML categories with 137 individually structured menu entries, Code Red adjustments, no gluten-free claims. Owner price/content sign-off **still required**.
- Removed deliberately disabled demo reservation/catering/party forms; each destination now links directly to the verified SpotHopper-hosted booking or inquiry form, not back through the soon-to-be-migrated domain.
- Holiday Parties original JPEG committed under `site/assets/`. No longer fetched from SpotHopper during staging builds.
- Browser CI now scans every internal link and fragment for actual responses, checks provider CTAs, verifies holiday popup and interactions at five widths. The provider forms are still dependent on active SpotHopper services.
- Runbook: `docs/launch-cutover-runbook.md`. Pricing issues: `docs/menu-price-discrepancies.md`.

## Nov 6 website content authority
The user approved Kat’s November 3–4 instructions plus the attached NEW menus for staging; later Nov 4 email and approved Code Red supersede earlier contradictory notes. Website pricing uses the new PDFs, not older Slice listings. NEW, FAMILY RECIPE and HOUSE FAVORITE labels retained in HTML where documented. Dinner daily 5–10 PM; lamb chops from Nov 10 at MKT$; lunch daily 11 AM–2 PM from Nov 26; no gluten-free labels. **This does not authorize publishing to the production domain.**
