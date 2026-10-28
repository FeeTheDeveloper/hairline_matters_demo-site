#!/usr/bin/env sh
# Builds the scroll-scrubbed walk-in sequence (4:5, 640x800, silent).
# Segments: the Instagram entrance clip from the location study (6-12 s; the Google
# Street View exterior at 0-6 s is excluded, it is not licensed for publication), then
# three in-chair clips from the owner-supplied recording. Short GOP so scroll seeking stays smooth.
# Usage: sh scripts/process-walkin.sh path/to/hairline_location_study.mp4 "path/to/Screen Recording 2026-10-28 092353.mp4"
set -eu
STUDY="${1:?pass the location study mp4}"
OFFICIAL="${2:?pass the owner recording}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
F="fps=24,setsar=1,format=yuv420p"

ffmpeg -v error -y \
  -ss 6 -t 6 -i "$STUDY" \
  -ss 0.2 -t 4.5 -i "$OFFICIAL" \
  -ss 10.6 -t 7.4 -i "$OFFICIAL" \
  -ss 42.1 -t 4.9 -i "$OFFICIAL" \
  -filter_complex "\
[0:v]crop=656:820:32:220,scale=640:800,$F[a];\
[1:v]crop=478:598:0:120,scale=640:800:flags=lanczos,$F[b];\
[2:v]crop=478:598:0:170,scale=640:800:flags=lanczos,$F[c];\
[3:v]crop=478:598:0:130,scale=640:800:flags=lanczos,$F[d];\
[a][b][c][d]concat=n=4:v=1:a=0,hqdn3d=1:1:2:2[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 29 -g 6 -keyint_min 6 -sc_threshold 0 \
  -movflags +faststart "$OUT/walkin.mp4"

# Poster: first frame of the walk-in.
ffmpeg -v error -y -i "$OUT/walkin.mp4" -frames:v 1 -c:v libwebp -quality 72 "$OUT/walkin-poster.webp"

# The shop: stations and mirrors behind the waves client (top band of the frame).
ffmpeg -v error -y -ss 12 -i "$OFFICIAL" -frames:v 1 \
  -vf "crop=478:300:0:0,scale=960:-2:flags=lanczos,unsharp=5:5:0.5" -c:v libwebp -quality 78 "$OUT/space-stations.webp"
