#!/bin/bash
# Regenerate broken 512x512 webp from JPG sources using ImageMagick
set -euo pipefail

cd public/images

fix() {
  local src="$1" dst="$2"
  local orig=$(identify -format "%wx%h" "$src" 2>/dev/null)
  local old=$(identify -format "%wx%h" "$dst" 2>/dev/null)
  convert "$src" -resize 2000x2000\> -quality 85 "$dst"
  local new=$(identify -format "%wx%h" "$dst" 2>/dev/null)
  echo "OK: $dst  ${old:-MISSING} → ${new} (was ${orig})"
}

# Shared images
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  fix "shared/shared-${i}.jpg" "shared/shared-${i}.webp"
done

# Sarpras
for i in 5 6 7 8 9 10; do
  fix "sarana/sarpras-${i}.jpg" "sarana/sarpras-${i}.webp"
done

# Listrik
fix "listrik/muhammad-rizky-1.jpg" "listrik/muhammad-rizky-1.webp"

# Drive-new/sarpras
for i in 1 3 4 5 6 7 8 9 10; do
  fix "drive-new/sarpras/${i}.jpg" "drive-new/sarpras/${i}.webp"
done

# Drive-new/makan
for i in 1 2 3; do
  fix "drive-new/makan/bagi-makan-${i}.jpg" "drive-new/makan/bagi-makan-${i}.webp"
done

# Home kondisi
for name in al-quran anak-yatim antrean kelas sampah; do
  fix "home/${name}.jpg" "home/${name}.webp"
done

echo ""
echo "=== Verification ==="
cd ../..

# Verify none are 512x512 anymore
BAD=$(identify -format "%f: %wx%h\n" public/images/shared/shared-*.webp public/images/sarana/sarpras-*.webp public/images/listrik/muhammad-rizky-1.webp public/images/drive-new/sarpras/*.webp public/images/drive-new/makan/bagi-makan-*.webp public/images/home/*.webp 2>/dev/null | grep "512x512" || true)
if [ -n "$BAD" ]; then
  echo "STILL BROKEN:"
  echo "$BAD"
  exit 1
fi
echo "All fixed — no 512x512 images remain in checked dirs."
