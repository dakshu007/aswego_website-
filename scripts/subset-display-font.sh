#!/usr/bin/env bash
# Cut a display font down to caps, digits and punctuation (display text is always uppercase).
# Usage: scripts/subset-display-font.sh path/to/Mangelic.ttf src/assets/fonts/mangelic-caps.woff2
# Requires: pip install fonttools brotli
set -euo pipefail
pyftsubset "$1" \
  --unicodes="U+0020-0060,U+007B-007E,U+00A0,U+00B7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026" \
  --layout-features=kern --flavor=woff2 --output-file="$2"
ls -l "$2"
