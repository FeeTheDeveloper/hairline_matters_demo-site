# Hairline Matters — private concept demo

Fee The Developer prospect presentation. **Not client-approved, no affiliation or endorsement claimed, not for redistribution.** Every page is `noindex` (meta tag and `X-Robots-Tag` header).

Target URL: `https://ftdsitepreviews.com/hairline_matters_demo/` (Cloudflare Workers static assets). **Not deployed.** See "Deploy" below.

## What it is

A static, dependency-free, mobile-first landing page:

- Walk-in: a scroll-driven sequence (storefront → door → chair) with chapter headlines, a Skip intro button, and a stacked-text fallback for reduced motion, Save-Data and no-JS visitors.
- At work: full-width loop of the shop's film. It plays only on screen when motion is allowed, and has a pause button.
- Recent cuts roll, the space, merch (the #HairlineMatters tee), and visit/booking.
- Services, policies, address, hours, reviews and shop stats are **empty slots or left out** until the owner supplies real content. Nothing is invented.
- Every booking button goes to the shop's existing scheduler, `https://hairlinematters.as.me`. No forms, no fake scheduling, no deposit capture.

## Layout

| Path | Purpose |
|---|---|
| `public/hairline_matters_demo/` | The site (`index.html`, `styles.css`, `main.js`, `404.html`, `assets/media/`) |
| `public/_headers` | Noindex, security headers, no-store on media (read by Cloudflare) |
| `wrangler.jsonc` | Assets-only Worker, route `ftdsitepreviews.com/hairline_matters_demo*` |
| `scripts/process-walkin.sh`, `process-work.sh`, `process-portfolio.sh`, `process-video.sh` | Reproducible media pipelines (ffmpeg) |
| `scripts/check.mjs`, `scripts/main.test.mjs` | Release checks and runtime tests (`npm test`) |
| `scripts/serve.mjs` | Zero-dependency local preview |
| `scripts/package.ps1` | Builds the private handoff ZIP |
| `docs/` | Owner handoff, rights ledger, build results, rollback, storyboard, original brief |

The site lives under `public/hairline_matters_demo/` because Cloudflare matches static assets on the full request path.

## Media is not in git

`origin` is a **public** GitHub repo, and the footage is not cleared (see [docs/ASSET_RIGHTS_LEDGER.md](docs/ASSET_RIGHTS_LEDGER.md)). `public/hairline_matters_demo/assets/media/` is git-ignored. Rebuild it from the source recordings (ffmpeg required; sources listed in `docs/creative/arrival-storyboard.md`):

```sh
sh scripts/process-walkin.sh STUDY.mp4 OWNER_RECORDING.mp4
sh scripts/process-portfolio.sh OWNER_RECORDING.mp4
sh scripts/process-work.sh WIX_FILM_RECORDING.mp4
sh scripts/process-video.sh STUDY.mp4
```

`npm test` skips the media checks when the folder is absent.

## Run locally

```sh
npm run serve      # http://localhost:4173/hairline_matters_demo/
npm test           # static checks + main.js runtime tests, zero dependencies
```

## Package the handoff ZIP

```sh
npm run package    # dist/hairline-matters-demo.zip (Windows PowerShell)
```

## Deploy

Needs King Fee's go-ahead. Credentials come from `.env.local` (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`), which is git-ignored.

```sh
set -a; . ./.env.local; set +a
npx wrangler@4 deploy --dry-run   # validate
npx wrangler@4 deploy
```

`workers_dev` and preview URLs are off, so the only address is the `ftdsitepreviews.com` route. noindex is not access control. Rollback: [docs/ROLLBACK.md](docs/ROLLBACK.md).

DNS: `ftdsitepreviews.com` is a demo-only zone. Its only record is a proxied `AAAA @ 100::` placeholder, which lets the Worker route fire. There is no mail, auth or root site on it by design, so `/` returns 522. Never set that record to DNS-only.
