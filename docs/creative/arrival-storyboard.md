# Arrival storyboard and shot audit — Hairline Matters

Brand: Hairline Matters only. Reference: Oct 27 screen recording of a scroll-driven barbershop site (sticky full-screen walk-in, then experience, services, "chairs the famous sit in" roll, space, reviews, FAQ, locations, closing CTA). Mirrored in structure and motion grammar only; no reference assets used.

## Sources

| ID | File | Notes |
|---|---|---|
| S1 | `hairline_location_study.mp4` (zip, Oct 28) | 720x1280, 12 s. Street View 0–6 s (Google, unlicensed); Instagram entrance 6–12 s. |
| S2 | `Screen Recording 2026-10-28 092353.mp4` | 478x846, 50.7 s. Owner-supplied client posts: locs, twists, waves, curly taper, plus a child client and non-hair clips (excluded). |
| S3 | `Screen Recording 2026-10-28 093435.mp4` | 1390x830, 51 s. Shop film off the Wix player; picture area 1216x684 at (70,116) from 6 s on. |
| S4 | Screenshots 093714 / 093727 | HM logo, tee promo ("Purchase your #HairlineMatters t-shirt today!"). |

## Opening (scroll-scrubbed, 16:9, ~21 s, `scripts/process-walkin.sh`)

Modeled on the reference's full-bleed night arrival. Generated in Runway from two real frames (S1 entrance at 7.2 s, S2 interior at 20.2 s):

| Beat | Scroll | Source | Headline |
|---|---|---|---|
| ARRIVE → THRESHOLD | 0–0.38 | Generated 8 s: night parking lot, dolly through the glass door into the shop | Pull up. Step in. |
| WELCOME | 0.38–0.62 | Generated 5 s: interior push toward the bulb mirrors | Where the line gets drawn. |
| DISCOVER | 0.62–0.82 | S3 19.4–27.2 s (real lineup/edge work) | Hands steady. |
| ACT | 0.82–1 | S3, same segment, continued | Book your chair. + CTA |

Keyframes: night exterior (strip-center glass storefront, barber pole, bulb mirrors visible inside), interior wide (bulb mirrors, blue stations, black chairs, white tile with border, mat). Prompts forbid people and generated text. Encoding: H.264, GOP 6, 1280x720 and 854x480 (mobile). Text stays in HTML.

## Film band (`scripts/process-work.sh`)

S3 8.85–29.25 s, 960x540, silent loop. It plays only on screen and only when motion is allowed.

## Generation

Used for the opening only (Runway: image keyframes, then image-to-video). Never on client faces or haircuts, and no baked-in text. Disclosed in the page footer.
