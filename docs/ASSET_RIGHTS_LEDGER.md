# Asset rights ledger

Status as of 2026-10-28. "Owner-supplied" means King Fee provided it as official Hairline Matters material. Faces of clients still need the owner's confirmation that those clients agreed to appear before any public launch.

| Asset (under `public/hairline_matters_demo/assets/`) | Derived from | Rights holder | Status | Public use allowed? | Action needed |
|---|---|---|---|---|---|
| Google Street View exterior (location study 0–6 s) | Phone screen recording of Google Street View | Google | Not licensed | **No** | **Excluded from the site.** Replace with owner-shot exterior footage to restore the parking-lot beat. |
| `media/walkin.mp4`, `walkin-480.mp4` 0–13 s, `media/walkin-poster.webp` | Generated with Runway (image keyframes, then image-to-video) from two real shop frames: the Instagram entrance clip and the owner's interior footage | FTD-generated; references owned by Hairline Matters | AI-generated rendering, disclosed in the page footer. **Approved by King Fee (FTD), 2026-10-28.** | Yes, with the disclosure | Approved, so no action needed. Keep the footer disclosure; no people or signage text are generated. |
| `media/cut-*.webp` (6 cuts × 2 sizes) | Owner-supplied recording of the shop's client posts | Hairline Matters | Owner-supplied; identifiable clients | Owner to confirm | Owner confirms each client agreed. Polish is faithful only: crop, denoise, sharpen, 2x upscale, mild grade. No generative edits. |
| `media/work.mp4`, `media/work-poster.webp`, `media/work-chair.webp`, `media/walkin.mp4` 13–21 s | Shop's film, recorded from the hairlinematters.wixsite.com player | Hairline Matters (and its videographer) | Owner-supplied | Owner to confirm | Confirm the videographer's license covers web reuse. |
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
