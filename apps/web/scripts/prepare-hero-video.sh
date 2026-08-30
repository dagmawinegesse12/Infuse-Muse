#!/usr/bin/env bash
# Turn a source clip into the three files the hero needs.
#
#   ./scripts/prepare-hero-video.sh <source> [END] [XFADE]
#
#     END    seconds of source to keep (default 10.25 — the launch cut ends
#            here, right before the footage blurs into its end card)
#     XFADE  seconds of tail crossfaded back over the head (default 0.80)
#
# Produces, in public/video/:
#   hero.mp4         H.264 + faststart — broad-compatibility track
#   hero.webm        VP9 — smaller, preferred by Chrome/Firefox
#   hero-poster.jpg  poster, and the still shown under reduced motion
#
# Two things this handles that a plain copy does not:
#   1. .mov/HEVC is not a web delivery format. Safari plays it; Chrome and
#      Firefox largely do not. Always ship mp4 + webm.
#   2. A hero loops forever, so the clip must not end on a title card, and its
#      last frame must flow into its first. The tail is dissolved back over the
#      head, which makes the wrap invisible. Output runs END-XFADE seconds.

set -euo pipefail

SRC="${1:?usage: prepare-hero-video.sh <source-video> [END] [XFADE]}"
END="${2:-10.25}"
XF="${3:-0.80}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/video"
mkdir -p "$OUT"

BODY_START="$XF"
TAIL_START="$(echo "$END - $XF" | bc -l)"

echo "→ source: $SRC   keep 0–${END}s, ${XF}s loop dissolve"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,codec_name \
  -show_entries format=duration -of default=noprint_wrappers=1 "$SRC"

LOOP="[0:v]trim=0:${END},setpts=PTS-STARTPTS,scale='min(1920,iw)':-2:flags=lanczos[c];\
[c]split=3[c1][c2][c3];\
[c1]trim=0:${XF},setpts=PTS-STARTPTS[head];\
[c2]trim=${TAIL_START}:${END},setpts=PTS-STARTPTS[tail];\
[c3]trim=${BODY_START}:${TAIL_START},setpts=PTS-STARTPTS[body];\
[tail][head]blend=all_expr='A*(1-(T/${XF}))+B*(T/${XF})'[blend];\
[blend][body]concat=n=2:v=1:a=0[out]"

echo "→ hero.mp4"
ffmpeg -v error -y -i "$SRC" -filter_complex "$LOOP" -map "[out]" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -preset slow \
  -movflags +faststart "$OUT/hero.mp4"

echo "→ hero.webm"
ffmpeg -v error -y -i "$OUT/hero.mp4" -an \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good "$OUT/hero.webm"

# Sampled past the dissolve so the poster is a clean, un-ghosted frame.
echo "→ hero-poster.jpg"
ffmpeg -v error -y -ss 2 -i "$OUT/hero.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

echo
ls -lh "$OUT"
