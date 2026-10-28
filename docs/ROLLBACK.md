# Rollback

The site is static: no data, no backend, no build step. Rollback means pointing the Worker at an earlier upload, or removing it.

Worker: `hairline-matters-demo`. Route: `ftdsitepreviews.com/hairline_matters_demo*`.

## Revert to the previous version

```sh
set -a; . ./.env.local; set +a
npx wrangler@4 deployments list
npx wrangler@4 rollback <version-id> --message "reason"
```

Verify: `curl -sI https://ftdsitepreviews.com/hairline_matters_demo/` returns 200, and the page shows the expected content.

## Take the demo offline (owner or rights-holder request)

1. Remove the route: Cloudflare dashboard → Workers & Pages → `hairline-matters-demo` → Settings → Domains & Routes → delete `ftdsitepreviews.com/hairline_matters_demo*`. Or delete the Worker: `npx wrangler@4 delete`.
2. Verify: `curl -sI https://ftdsitepreviews.com/hairline_matters_demo/` no longer returns the demo.
3. Media is served `Cache-Control: no-store`, so browsers and Cloudflare's edge hold no long-lived copies.

## Remove specific footage or photos

Delete the files from `public/hairline_matters_demo/assets/media/`, remove their references in `index.html`, run `npm test`, and redeploy. Media is git-ignored, so git history holds no copy.

## Owner

King Fee executes; Claude can prepare the commands.
