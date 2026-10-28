#!/usr/bin/env sh
# Polishes portfolio stills from the owner-supplied recording (Oct 28 2026).
# Faithful only: crop out Instagram UI, light denoise/sharpen, 2x upscale, mild grade.
# No generative edits: haircut shapes and faces stay as recorded.
# Usage: sh scripts/process-portfolio.sh "path/to/Screen Recording 2026-10-28 092353.mp4"
set -eu
SRC="${1:?pass the source recording}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
POLISH="hqdn3d=1.5:1.5:3:3,scale=960:1200:flags=lanczos,unsharp=5:5:0.6:5:5:0,eq=contrast=1.03:saturation=1.04"

# name  time(s)  crop-y (478x598 window, 4:5, clears the mute icon and carousel dots)
while read -r NAME T Y; do
  ffmpeg -v error -y -ss "$T" -i "$SRC" -frames:v 1 \
    -vf "crop=478:598:0:$Y,$POLISH" -c:v libwebp -quality 80 "$OUT/cut-$NAME-960.webp"
  ffmpeg -v error -y -i "$OUT/cut-$NAME-960.webp" -vf "scale=480:600:flags=lanczos" \
    -c:v libwebp -quality 78 "$OUT/cut-$NAME-480.webp"
done <<LIST
locs-lineup 6 120
twists-taper 8 20
waves-front 12 150
waves-profile 16 190
curly-taper-front 43 130
curly-taper-profile 48 120
LIST
