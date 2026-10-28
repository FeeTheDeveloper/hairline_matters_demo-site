# Arrival storyboard and shot audit — Hairline Matters

Brand: Hairline Matters only. Reference: Oct 27 screen recording of a scroll-driven barbershop site (sticky full-screen walk-in, then experience, services, "chairs the famous sit in" roll, space, reviews, FAQ, locations, closing CTA). Mirrored in structure and motion grammar only; no reference assets used.

## Sources

| ID | File | Notes |
|---|---|---|
| S1 | `hairline_location_study.mp4` (zip, Oct 28) | 720x1280, 12 s. Street View 0–6 s (Google, unlicensed); Instagram entrance 6–12 s. |
| S2 | `Screen Recording 2026-10-28 092353.mp4` | 478x846, 50.7 s. Owner-supplied client posts: locs, twists, waves, curly taper, plus a child client and non-hair clips (excluded). |
| S3 | `Screen Recording 2026-10-28 093435.mp4` | 1390x830, 51 s. Shop film off the Wix player; picture area 1216x684 at (70,116) from 6 s on. |
| S4 | Screenshots 093714 / 093727 | HM logo, tee promo ("Purchase your #HairlineMatters t-shirt today!"). |

## Opening (scroll-scrubbed, 16.8 s, `scripts/process-walkin.sh`)

Source S5: the owner's real walk-in (`30734990-video.MOV`, 9.2 s, 360x480 portrait). Pipeline: upscale to 810x1080 -> Runway expand to 16:9 (1920x1078) -> Runway video-to-video night re-render (1920x1080, 9 s). Desktop gets the 16:9 cut; phones get an 810x1080 center crop of the same render.

| Beat | Scroll | Source | Headline |
|---|---|---|---|
| ARRIVE | 0–0.30 | Night re-render: sidewalk along the storefronts to the door | Pull up. Step in. |
| THRESHOLD / WELCOME | 0.30–0.54 | Night re-render: door pull, FADED mat, onto the floor with barbers working | Where the line gets drawn. |
| DISCOVER | 0.54–0.80 | S3 19.4–27.2 s (real lineup/edge work) | Hands steady. |
| ACT | 0.80–1 | S3, continued | Book your chair. + CTA |

Known flaw: the re-render morphs window lettering ("FADED" briefly reads "FAJEE"). A cleanup pass (Aleph edit to blank the decals) is possible. Text stays in HTML.

## Film band (`scripts/process-work.sh`)

S3 8.85–29.25 s, 960x540, silent loop. It plays only on screen and only when motion is allowed.

## Generation

Used for the opening only (Runway: image keyframes, then image-to-video). Never on client faces or haircuts, and no baked-in text. Disclosed in the page footer.
