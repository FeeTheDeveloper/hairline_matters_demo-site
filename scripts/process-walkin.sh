#!/usr/bin/env sh
# Builds the scroll-scrubbed opening (silent).
# Source chain: the owner's real walk-in (portrait MOV) -> Runway expand to 16:9 ->
# Runway video-to-video night re-render -> Runway decal cleanup -> local frosted blur on the
# door-glass band at 2.35-4.95 s where lettering still warped (walk-night-16x9.mp4),
# then the shop's film.
#   Desktop (16:9): the night walk-in, then the film.
#   Phones   (3:4): center crop of the same night walk-in, then the film center-cropped.
# Both cuts share segment lengths, so the chapter timings match.
# Short GOP so scroll seeking stays smooth.
# Usage: sh scripts/process-walkin.sh walk-night-16x9.mp4 "Screen Recording 2026-10-28 093435.mp4"
set -eu
WIDE="${1:?pass the 16:9 night walk-in}"
FILM="${2:?pass the Wix film recording}"
OUT="$(dirname "$0")/../public/hairline_matters_demo/assets/media"
mkdir -p "$OUT"
F="fps=24,setsar=1,format=yuv420p"
PIC="crop=1216:684:70:116"
WALK_T=9.0
FILM_SS=19.4
FILM_T=7.8
X264="-c:v libx264 -preset slow -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart -an"

ffmpeg -v error -y \
  -t "$WALK_T" -i "$WIDE" -ss "$FILM_SS" -t "$FILM_T" -i "$FILM" \
  -filter_complex "\
[0:v]scale=1280:720:flags=lanczos,$F[a];\
[1:v]$PIC,scale=1280:720:flags=lanczos,$F[b];\
[a][b]concat=n=2:v=1:a=0[v]" \
  -map "[v]" $X264 -crf 27 "$OUT/walkin.mp4"

ffmpeg -v error -y \
  -t "$WALK_T" -i "$WIDE" -ss "$FILM_SS" -t "$FILM_T" -i "$FILM" \
  -filter_complex "\
[0:v]crop=810:1080:555:0,scale=540:720:flags=lanczos,$F[a];\
[1:v]$PIC,crop=513:684:351:0,scale=540:720:flags=lanczos,$F[b];\
[a][b]concat=n=2:v=1:a=0[v]" \
  -map "[v]" $X264 -crf 26 "$OUT/walkin-480.mp4"

# Poster: first frame of the wide cut (the sidewalk outside the shop at night).
ffmpeg -v error -y -i "$OUT/walkin.mp4" -frames:v 1 -c:v libwebp -quality 75 "$OUT/walkin-poster.webp"
