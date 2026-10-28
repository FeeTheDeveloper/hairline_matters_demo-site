#!/usr/bin/env sh
# Builds the scroll-scrubbed opening (16:9, silent) in two sizes.
# Segments:
#   1. Generated night walk-in, parking lot -> through the glass door (Runway, from real shop frames)
#   2. Generated interior reveal: bulb mirrors, chairs, tile (Runway, from a real shop frame)
#   3. The shop's own film: lineup and edge work (recorded off the Wix player)
# Short GOP so scroll seeking stays smooth.
# Usage: sh scripts/process-walkin.sh walkin-gen.mp4 interior-gen.mp4 "Screen Recording 2026-10-28 093435.mp4"
set -eu
WALK="${1:?pass the generated walk-in clip}"
INSIDE="${2:?pass the generated interior clip}"
FILM="${3:?pass the Wix film recording}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
F="fps=24,setsar=1,format=yuv420p"
PIC="crop=1216:684:70:116"

build() {
  W="$1"; H="$2"; CRF="$3"; NAME="$4"
  ffmpeg -v error -y \
    -i "$WALK" -i "$INSIDE" -ss 19.4 -t 7.8 -i "$FILM" \
    -filter_complex "\
[0:v]scale=$W:$H:flags=lanczos,$F[a];\
[1:v]scale=$W:$H:flags=lanczos,$F[b];\
[2:v]$PIC,scale=$W:$H:flags=lanczos,$F[c];\
[a][b][c]concat=n=3:v=1:a=0[v]" \
    -map "[v]" -an -c:v libx264 -preset slow -crf "$CRF" -g 6 -keyint_min 6 -sc_threshold 0 \
    -movflags +faststart "$OUT/$NAME"
}

build 1280 720 28 walkin.mp4
build 854 480 29 walkin-480.mp4

# Poster: first frame of the walk-in (the storefront at night).
ffmpeg -v error -y -i "$OUT/walkin.mp4" -frames:v 1 -c:v libwebp -quality 75 "$OUT/walkin-poster.webp"
