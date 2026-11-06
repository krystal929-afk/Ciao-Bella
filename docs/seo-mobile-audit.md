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
| Responsive & keyboard code | PASS (source), BROWSER VERIFICATION PENDING | Site includes styles for 320, 375, 390, 768 and desktop; touch-target and tab-arrow-key improvements added. See GitHub Actions browser report for actual overflow/interactions. |
| Modal accessibility | NEEDS WORK | Native dialogs, close buttons, keyboard Escape and reduced-motion support exist; full screen-reader and WCAG audit still required. |
| External ordering & reservations | NEEDS WORK | Public-facing external actions link to existing systems, not new forms. Do not claim checkout or confirmation testing until verified with the restaurant. |
| Local SEO URL preservation | NEEDS WORK | Verified old URLs mapped in `production/redirect-map.csv`. Full production crawl, Search Console export and edge/host 301 redirect capability require authorization and testing. |
| Production sitemap / indexing | PREPARED, NOT ACTIVATED | `production/sitemap.xml`, `production/robots.txt`, and `production/canonical-map.json` are reference-only files outside `site/`. They are **not** deployed to staging and must not be used until explicit production authorization. |
| Lighthouse / PageSpeed / Core Web Vitals | BLOCKED (measurement) | Public remote benchmark and field data cannot be verified from this environment. Browser-based staging layout checks run separately in CI, but do not substitute for Lighthouse or real-user CWV measurements. |

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
