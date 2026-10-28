#!/usr/bin/env sh
# Builds the entrance still from the location study.
# Usage: sh scripts/process-video.sh path/to/hairline_location_study.mp4
# The crop (720x820 at y=220) removes the letterbox plus the Instagram UI
# burned into the screen recording.
set -eu
SRC="${1:?pass the source mp4}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
CROP="crop=720:820:0:220"

ffmpeg -v error -y -ss 11 -i "$SRC" -frames:v 1 -vf "$CROP,scale=640:-2" \
  -c:v libwebp -quality 72 "$OUT/interior-study.webp"
