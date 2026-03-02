#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGES_DIR="$ROOT_DIR/images"
MANIFEST="$IMAGES_DIR/wetsuit-source-urls.txt"

if [[ ! -f "$MANIFEST" ]]; then
  echo "Missing manifest: $MANIFEST" >&2
  exit 1
fi

while IFS=$'\t' read -r filename url; do
  [[ -z "${filename:-}" || -z "${url:-}" ]] && continue
  echo "Downloading $filename"
  curl -fL "$url" -o "$IMAGES_DIR/$filename"
done < "$MANIFEST"

echo "Done. Images saved to $IMAGES_DIR"
