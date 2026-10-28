# Asset rights ledger

Status as of 2026-10-28. "Owner-supplied" means King Fee provided it as official Hairline Matters material. Client consent for the people shown in the portfolio cuts and the shop film was confirmed by King Fee on 2026-10-28.

| Asset (under `public/hairline_matters_demo/assets/`) | Derived from | Rights holder | Status | Public use allowed? | Action needed |
|---|---|---|---|---|---|
| Google Street View exterior (location study 0–6 s) | Phone screen recording of Google Street View | Google | Not licensed | **No** | **Excluded from the site.** Replace with owner-shot exterior footage to restore the parking-lot beat. |
| `media/walkin.mp4`, `walkin-480.mp4` 0–9 s, `media/walkin-poster.webp` | The owner's real walk-in video (Oct 28 2026), widened to 16:9 with Runway, then re-rendered at night with Runway video-to-video | Hairline Matters (source footage); FTD-generated re-render | AI re-render of real footage, disclosed in the page footer. Night generation approved by King Fee, 2026-10-28. | Yes, with the disclosure | Known flaw: window lettering morphs in the re-render (e.g. "FADED" reads "FAJEE" for a moment). The real mat stays legible. |
| `media/cut-*.webp` (6 cuts × 2 sizes) | Owner-supplied recording of the shop's client posts | Hairline Matters | Owner-supplied; identifiable clients. **Client consent confirmed by King Fee, 2026-10-28.** | Yes | No action needed. Polish is faithful only: crop, denoise, sharpen, 2x upscale, mild grade. No generative edits. |
| `media/work.mp4`, `media/work-poster.webp`, `media/work-chair.webp`, `media/walkin.mp4` 9–17 s | Shop's film, recorded from the hairlinematters.wixsite.com player | Hairline Matters (and its videographer) | Owner-supplied. **Clients shown: consent confirmed by King Fee, 2026-10-28.** | Yes, pending one check | Confirm the videographer's license covers web reuse. |
| `brand/hm-logo.svg`, header monogram | Vector redraw of the HM logo on the shop's site | Hairline Matters | Redrawn by FTD from the owner's mark | Yes, for the shop's own site | Ask the owner for the original vector file and font name. |
| Tee mockup (inline SVG) | Drawn by FTD from the shop's tee promo | Hairline Matters (design) | FTD drawing of the owner's product | Yes, for the shop's own site | Owner confirms colorway and print placement. |
| Excluded on purpose | Child client clip, airplane and "Mood" clips, night outfit photo | — | Not used | — | A minor needs guardian consent; the others don't show the work. |
| Storefront signage "FADED" visible in footage | Business signage | Unknown | Unverified relationship | **Unresolved** | Owner to confirm how "FADED" and "Hairline Matters" relate. |
| Services, prices, policies, hours, address | Not supplied | Owner | Missing | — | Owner validates. |
| Accent color `#2fd47a` | Provisional | — | Provisional | Yes | Owner confirms the brand value. |
| Booking link `https://hairlinematters.as.me` | Brief | Owner | Sourced | Yes | Keep until the owner authorizes a replacement. |
| Tee link `https://hairlinematters.wixsite.com/hairlinematters` | Shop's current site | Owner | Sourced | Yes | Swap for a store URL when the owner picks one. |

No audio is used anywhere.

Storage: all media is git-ignored because the `origin` GitHub repo is public. It travels only in the private handoff ZIP, or is rebuilt with the `scripts/process-*.sh` pipelines from the source recordings.
