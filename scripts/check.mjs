// Static release checks for the demo. Zero dependencies: `node scripts/check.mjs`.
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'public', 'hairline_matters_demo');
const mediaDir = join(site, 'assets', 'media');
const html = readFileSync(join(site, 'index.html'), 'utf8');
const BOOKING = 'https://hairlinematters.as.me';
const MERCH = 'https://hairlinematters.wixsite.com/hairlinematters';
const MEDIA_BUDGET_BYTES = 2_000_000;
// The scroll-scrubbed walk-in uses a short GOP for smooth seeking, so it gets more room.
const MEDIA_BUDGET_OVERRIDES = { 'walkin.mp4': 7_000_000, 'walkin-480.mp4': 4_000_000 };
// Media is git-ignored (rights-restricted); a fresh clone has none until `npm run media`.
const hasMedia = existsSync(mediaDir);

const failures = [];
let passed = 0;
let skipped = 0;
function check(name, ok, detail = '') {
  if (ok) passed++;
  else failures.push(`${name}${detail ? `: ${detail}` : ''}`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? ` (${detail})` : ''}`);
}
function skip(name, why) {
  skipped++;
  console.log(`SKIP  ${name} (${why})`);
}

// Required deliverables from the production handoff, with real content.
for (const f of ['README.md', 'docs/OWNER_HANDOFF.md', 'docs/ASSET_RIGHTS_LEDGER.md', 'docs/BUILD_RESULTS.md', 'docs/ROLLBACK.md']) {
  const p = join(root, f);
  check(`deliverable has content: ${f}`, existsSync(p) && statSync(p).size > 200);
}

// Every local src/href/poster resolves to a file.
const refs = [...html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)].map((m) => m[1]);
const srcsetRefs = [...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));
const local = [...new Set([...refs, ...srcsetRefs])].filter((r) => !/^(https?:|#|mailto:|tel:)/.test(r));
for (const r of local) {
  if (r.startsWith('assets/media/') && !hasMedia) skip(`local asset resolves: ${r}`, 'media not built; run npm run media');
  else check(`local asset resolves: ${r}`, existsSync(join(site, r)));
}
check('page uses relative URLs only (served under a sub-path)', local.every((r) => !r.startsWith('/')));

// In-page anchors point at real ids.
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
for (const r of refs.filter((r) => r.startsWith('#'))) {
  check(`anchor target exists: ${r}`, ids.has(r.slice(1)));
}

// Booking stays on the existing external scheduler: nav, hero, services, visit.
const bookingLinks = refs.filter((r) => r.includes('as.me'));
check('booking links all point at the existing scheduler', bookingLinks.every((r) => r === BOOKING), bookingLinks.join(', '));
const ctas = [...html.matchAll(/<a\b[^>]*class="btn[^"]*"[^>]*>/g)].map((m) => m[0]).filter((a) => !/href="#/.test(a));
const bookingCtas = ctas.filter((a) => a.includes('as.me'));
check('exactly 4 booking CTAs (nav, walk-in, services, visit)', bookingCtas.length === 4, String(bookingCtas.length));
check('every booking CTA targets the scheduler exactly', bookingCtas.every((a) => a.includes(`href="${BOOKING}"`)));
const ALLOWED = [BOOKING, 'https://www.instagram.com/hairlinematters/', MERCH];
const external = refs.filter((r) => /^https?:/.test(r));
check('external links limited to booking, Instagram and the current tee page', external.every((r) => ALLOWED.includes(r)), external.filter((r) => !ALLOWED.includes(r)).join(', '));

// External links opened in a new tab carry rel="noopener".
const blankAnchors = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
check('target=_blank links use rel noopener', blankAnchors.every((a) => /rel="[^"]*noopener/.test(a)));

// No third-party scripts, no forms (no fake scheduling or payment capture).
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map((m) => m[1]);
check('no third-party scripts', scripts.every((s) => !/^https?:/.test(s)), scripts.join(', '));
check('no forms or payment inputs', !/<form\b|type="(?:password|tel|email)"/i.test(html));

// Private concept guardrails.
check('noindex meta present', /<meta name="robots" content="noindex, nofollow">/.test(html));
check('concept disclaimer present', /Not affiliated with or endorsed by Hairline Matters/.test(html));
check('no unverified prices published', !/\$\s?\d|\b\d+(?:\.\d{2})?\s?(?:USD|dollars)\b/i.test(html));
check('no street address published', !/\b(?:Duncanville|Lancaster)\b|\bSuite\s*405\b/i.test(html));
check('address slot shows pending text', /<dt>Address<\/dt>\s*<dd[^>]*>Published after the owner verifies it/.test(html));

// Cloudflare deploy config.
const headers = readFileSync(join(root, 'public', '_headers'), 'utf8');
check('_headers sends X-Robots-Tag noindex for the demo path', /^\/hairline_matters_demo\/\*\n(?:\s+.+\n)*?\s+X-Robots-Tag: noindex/m.test(headers));
check('_headers sets no long-lived cache on unhashed media', !/immutable|max-age=\d{5,}/.test(headers));
const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
check('wrangler serves ./public', /"directory":\s*"\.\/public"/.test(wrangler));
check('wrangler routes ftdsitepreviews.com/hairline_matters_demo', /"pattern":\s*"ftdsitepreviews\.com\/hairline_matters_demo\*"/.test(wrangler));
check('workers.dev and preview URLs disabled', /"workers_dev":\s*false/.test(wrangler) && /"preview_urls":\s*false/.test(wrangler));
check('no docs, scripts or manifests inside the deploy directory', readdirSync(site).every((f) => !/\.(md|mjs|json|sh|ps1)$/.test(f)));

// Repo hygiene: the origin remote is public.
const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');
check('.gitignore keeps rights-restricted media out of git', /^public\/hairline_matters_demo\/assets\/media\/$/m.test(gitignore));
check('.gitignore covers env files and keys', ['.env', '.env.*', '*.pem', '*.key'].every((p) => gitignore.split('\n').includes(p)));

// Accessibility basics the gate relies on.
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
check('images have alt, width and height', imgs.every((i) => /\balt="[^"]+"/.test(i) && /\bwidth="/.test(i) && /\bheight="/.test(i)));
const videoTags = [...html.matchAll(/<video\b[^>]*>/g)].map((m) => m[0]);
check('two videos: walk-in and work film', videoTags.length === 2, String(videoTags.length));
for (const [i, v] of videoTags.entries()) {
  check(`video ${i + 1} is muted and playsinline`, /\smuted\b/.test(v) && /\splaysinline\b/.test(v));
  check(`video ${i + 1} keeps native controls without JS`, /\scontrols\b/.test(v));
  check(`video ${i + 1} preloads nothing until JS allows it`, /\spreload="none"/.test(v));
  check(`video ${i + 1} has no autoplay attribute`, !/\sautoplay\b/.test(v));
  check(`video ${i + 1} has a text description`, /\saria-describedby="[^"]+"/.test(v));
}
check('work film toggle hidden until JS runs', /<button\b[^>]*id="work-toggle"[^>]*\shidden\b/.test(html));
check('walk-in chapters stay readable as stacked text (no-JS fallback)', (html.match(/class="chapter"/g) || []).length >= 4);
check('main.js loaded with defer', /<script src="main.js" defer><\/script>/.test(html));
check('html lang set', /<html lang="en">/.test(html));
check('skip link present', /class="skip-link" href="#main"/.test(html));
check('generated footage is disclosed', /AI-generated rendering of the shop/.test(html));
check('walk-in has a Skip intro link past the scroll sequence', /class="skip-intro" href="#work"/.test(html));

// Media weight budget and no stray files.
if (hasMedia) {
  const mediaFiles = readdirSync(mediaDir);
  const over = mediaFiles.filter((f) => statSync(join(mediaDir, f)).size >= (MEDIA_BUDGET_OVERRIDES[f] || MEDIA_BUDGET_BYTES));
  check('every media file within its byte budget', over.length === 0, over.join(', '));
  const unreferenced = mediaFiles.filter((f) => !local.includes(`assets/media/${f}`));
  check('every media file is referenced by the page', unreferenced.length === 0, unreferenced.join(', '));
} else {
  skip('media budget and references', 'media not built');
}

console.log(`\n${passed} passed, ${failures.length} failed, ${skipped} skipped`);
if (failures.length) process.exit(1);
