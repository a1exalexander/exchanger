#!/bin/sh
# Render the app icon (web AppLogo, full bleed; iOS applies the mask) to 1024px PNGs.
# Requires rsvg-convert and magick (brew install librsvg imagemagick).
set -eu
OUT="$(cd "$(dirname "$0")/.." && pwd)/Exchanger/Resources/Assets.xcassets/AppIcon.appiconset"

ARROWS='<path d="M8.5 13h15l-5-5"/><path d="M23.5 19h-15l5 5"/>'
GRAD='<linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#2a5cff"/></linearGradient>'

render() { # name, svg body
  printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1024" height="1024"><defs>%s</defs>%s</svg>' "$GRAD" "$2" \
    | rsvg-convert -w 1024 -h 1024 -o "$OUT/$1.png"
}

stroke='fill="none" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"'
render AppIcon "<rect width=\"32\" height=\"32\" fill=\"url(#g)\"/><g $stroke stroke=\"#fff\">$ARROWS</g>"
# Dark: transparent background, the system draws its dark backdrop.
render AppIcon-Dark "<g $stroke stroke=\"#4f8bff\">$ARROWS</g>"
# Tinted: grayscale glyph on black, the system applies the tint.
render AppIcon-Tinted "<rect width=\"32\" height=\"32\" fill=\"#000\"/><g $stroke stroke=\"#fff\">$ARROWS</g>"
# App Store rejects an alpha channel in the opaque icons (brew install imagemagick).
magick "$OUT/AppIcon.png" -alpha off "$OUT/AppIcon.png"
magick "$OUT/AppIcon-Tinted.png" -alpha off -colorspace Gray "$OUT/AppIcon-Tinted.png"

cat > "$OUT/Contents.json" <<'JSON'
{
  "images": [
    { "filename": "AppIcon.png", "idiom": "universal", "platform": "ios", "size": "1024x1024" },
    { "appearances": [{ "appearance": "luminosity", "value": "dark" }], "filename": "AppIcon-Dark.png", "idiom": "universal", "platform": "ios", "size": "1024x1024" },
    { "appearances": [{ "appearance": "luminosity", "value": "tinted" }], "filename": "AppIcon-Tinted.png", "idiom": "universal", "platform": "ios", "size": "1024x1024" }
  ],
  "info": { "author": "xcode", "version": 1 }
}
JSON
echo "wrote $OUT"
