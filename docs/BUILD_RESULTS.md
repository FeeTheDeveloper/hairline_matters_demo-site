# Build results

There is no build step: the site is static. These results are from the gate run on 2026-10-28, local preview `scripts/serve.mjs`, Chrome via DevTools. Re-run `npm test` before any release.

## Automated

| Check | Command | Result |
|---|---|---|
| Static release checks (74) | `node scripts/check.mjs` | 74 passed, 0 failed (with media built) |
| Runtime behaviour of `main.js` (13) | `node --test scripts/main.test.mjs` | 13 passed, 0 failed |
| Cloudflare config | `npx wrangler@4 deploy --dry-run` (wrangler 4.154.0) | OK: 29 asset files read, no bindings, route `ftdsitepreviews.com/hairline_matters_demo*` |
| Mutation sanity | booking URL swapped to another host | check fails as expected |

## Browser (Chrome DevTools)

| Check | Result |
|---|---|
| Scroll scrub, 1440x900 | Video seeks with scroll; chapter headline follows the clip |
| Scroll scrub, 390x844 mobile | Final beat "Book your chair." + CTA; no horizontal scroll (scrollWidth 390) |
| Reduced motion | No scrub, stacked chapter text, native video controls, work film stays paused |
| Anchor offset | `#services` heading lands below the sticky header (178px vs 71px) |
| Lighthouse mobile | Accessibility 97 → contrast fix applied (green on light 6.0:1), Best Practices 100, SEO 63 (noindex, intended) |
| Performance trace, Fast 4G + 4x CPU, 390x844 | LCP 1.93 s, CLS 0.00 |

## Not run

- Full no-JS render: headless Chrome with scripts disabled did not write a screenshot on this machine. No-JS behaviour is covered by the static checks: native controls, `preload="none"`, stacked chapters.
- Live deploy: not deployed (needs King Fee's approval).
- Real-device Safari: not tested. A `MediaQueryList.addListener` fallback is covered by the code; scrub seeking on iOS needs a device check.
