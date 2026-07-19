#!/usr/bin/env bash
# sync-spreads.sh — build the reader's web image assets from the source spreads.
#
# The reader serves TWO editions: the default "comic" set (../spreads) and the
# "anime" set (../spreads-anime). Landscape spreads (1536x1024) are sliced into
# left/right halves; the portrait cover + closing plate are converted whole.
# This also emits full-spread thumbnails (used by the seek scrubber + jump grid)
# and copies the anime provenance recipes into public/recipes/anime/ so the
# "how this page was made" panel can load the exact prompt.
#
# Requires: cwebp (brew install webp), sips (macOS built-in), jq.
# Usage: bash site/scripts/sync-spreads.sh   (run from anywhere)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOOK="$(cd "$HERE/../.." && pwd)"          # books/origin-of-aitx
PUB="$HERE/../public"                       # site/public
Q=90                                        # webp quality
THUMB_W=420                                 # thumbnail width

SPREADS=(01 02 03 04 05 06 07 08 09 10 11 12 13)

# convert_set <src-dir> <pages-dir> <art-dir> <thumb-dir>
convert_set() {
  local SRC="$1" PAGES="$2" ART="$3" THUMBS="$4"
  mkdir -p "$PAGES" "$ART" "$THUMBS"

  # Cover (portrait) -> full art + thumb
  cwebp -quiet -q "$Q" "$SRC/spread-00-cover.png" -o "$ART/cover-painted.webp"
  cwebp -quiet -q "$Q" -resize "$THUMB_W" 0 "$SRC/spread-00-cover.png" -o "$THUMBS/spread-00-cover.webp"

  # Closing plate (portrait) -> back cover
  cwebp -quiet -q "$Q" "$SRC/spread-99-closing.png" -o "$ART/back-cover.webp"

  # Landscape spreads -> left/right halves + full thumb
  for n in "${SPREADS[@]}"; do
    local png="$SRC/spread-$n.png"
    local w h half
    w=$(sips -g pixelWidth "$png" | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$png" | awk '/pixelHeight/{print $2}')
    half=$(( w / 2 ))
    cwebp -quiet -q "$Q" -crop 0 0 "$half" "$h" "$png" -o "$PAGES/$n-l.webp"
    cwebp -quiet -q "$Q" -crop "$half" 0 "$half" "$h" "$png" -o "$PAGES/$n-r.webp"
    cwebp -quiet -q "$Q" -resize "$THUMB_W" 0 "$png" -o "$THUMBS/spread-$n.webp"
  done
}

echo "[sync-spreads] comic set..."
convert_set "$BOOK/spreads"        "$PUB/pages"       "$PUB/art"       "$PUB/spreads"
echo "[sync-spreads] anime set..."
convert_set "$BOOK/spreads-anime"  "$PUB/pages-anime" "$PUB/art-anime" "$PUB/spreads-anime"

# Anime provenance recipes -> public/recipes/anime/<key>.json (key = source stem)
echo "[sync-spreads] anime recipes..."
RDIR="$PUB/recipes/anime"
mkdir -p "$RDIR"
for f in "$BOOK/spreads-anime"/*.recipe.json; do
  [ -e "$f" ] || continue
  base="$(basename "$f" .recipe.json)"   # e.g. spread-01, spread-00-cover
  cp "$f" "$RDIR/$base.json"
done

echo "[sync-spreads] done."
