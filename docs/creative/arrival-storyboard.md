# Arrival storyboard and shot audit — Hairline Matters

Brand: Hairline Matters only. Reference: Oct 27 screen recording of a scroll-driven barbershop site (sticky full-screen walk-in, then experience, services, "chairs the famous sit in" roll, space, reviews, FAQ, locations, closing CTA). Mirrored in structure and motion grammar only; no reference assets used.

## Sources

| ID | File | Notes |
|---|---|---|
| S1 | `hairline_location_study.mp4` (zip, Oct 28) | 720x1280, 12 s. Street View 0–6 s (Google, unlicensed); Instagram entrance 6–12 s. |
| S2 | `Screen Recording 2026-10-28 092353.mp4` | 478x846, 50.7 s. Owner-supplied client posts: locs, twists, waves, curly taper, plus a child client and non-hair clips (excluded). |
| S3 | `Screen Recording 2026-10-28 093435.mp4` | 1390x830, 51 s. Shop film off the Wix player; picture area 1216x684 at (70,116) from 6 s on. |
| S4 | Screenshots 093714 / 093727 | HM logo, tee promo ("Purchase your #HairlineMatters t-shirt today!"). |

## Walk-in (scroll-scrubbed, 4:5, 22.8 s, `scripts/process-walkin.sh`)

| Beat | Scroll | Source | Headline |
|---|---|---|---|
| THRESHOLD | 0–0.26 | S1 6–12 s (entrance) | Pull up. Step in. |
| WELCOME | 0.26–0.46 | S2 0.2–4.7 s (locs) | Into the chair. |
| DISCOVER | 0.46–0.78 | S2 10.6–18 s (waves orbit) | Lines that hold. |
| ACT | 0.78–1 | S2 42.1–47 s (curly taper) | Book your chair. + CTA |

ARRIVE (parking lot → door) is cut: the only exterior source is Google Street View (S1 0–6 s), which is not licensed. It returns when the owner supplies exterior footage.

Encoding: H.264, GOP 6, so seeking stays smooth while scrolling. Text is HTML, never baked into video.

## Film band (`scripts/process-work.sh`)

S3 8.85–29.25 s, 960x540, silent loop. It plays only on screen and only when motion is allowed.

## Generation (not used)

Runway / OpenArt are available. Candidate use once S1's exterior is replaced with licensed footage: bridge the hard cuts (door → chair) with image-to-video using real frames as geometry locks. Never text-only, never on client faces, never with baked-in text.
