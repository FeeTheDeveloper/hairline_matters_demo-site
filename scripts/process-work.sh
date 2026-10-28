#!/usr/bin/env sh
# Builds the "masters at work" band from the shop's own film (recorded off the
# hairlinematters.wixsite.com player, Oct 28 2026). Crops the player to the
# picture area (no Wix chrome or controls), 16:9, silent, looping.
# Usage: sh scripts/process-work.sh "path/to/Screen Recording 2026-10-28 093435.mp4"
set -eu
SRC="${1:?pass the Wix film recording}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
PIC="crop=1216:684:70:116,scale=960:540:flags=lanczos,setsar=1"

ffmpeg -v error -y -ss 8.85 -t 20.4 -i "$SRC" -an \
  -vf "$PIC,fps=24,format=yuv420p" -c:v libx264 -preset slow -crf 28 -movflags +faststart "$OUT/work.mp4"
ffmpeg -v error -y -ss 14 -i "$SRC" -frames:v 1 -vf "$PIC" -c:v libwebp -quality 72 "$OUT/work-poster.webp"

# Still for the "more than a cut" section: barber caping a client.
ffmpeg -v error -y -ss 27.6 -i "$SRC" -frames:v 1 -vf "crop=1216:684:70:116,setsar=1" -c:v libwebp -quality 80 "$OUT/work-chair.webp"
