#!/usr/bin/env bash

set -e

BASE="src/app/component"

mkdir -p "$BASE/circular-testimonials" \
         "$BASE/color-card" \
         "$BASE/inflected-card" \
         "$BASE/playing-card" \
         "$BASE/project-showcase" \
         "$BASE/item-showcase" \
         "$BASE/slider-hero-section" \
         "$BASE/custom-slider" \
         "$BASE/fishy-button" \
         "$BASE/halomot-button" \
         "$BASE/refind-chronicle-button" \
         "$BASE/stager-text"

create_page() {
  local dir="$1"
  local id="$2"
  cat <<TSX > "$BASE/$dir/page.tsx"
"use client";

import ComponentRouteProcessor from "@/components/ComponentRouteProcessor";

export default function ${id//-/ }Page() {
  return <ComponentRouteProcessor id="$id" />;
}
TSX
}

create_page "circular-testimonials" "circular-testimonials"
create_page "color-card" "color-card"
create_page "inflected-card" "inflected-card"
create_page "playing-card" "playing-card"
create_page "project-showcase" "project-showcase"
create_page "item-showcase" "item-showcase"
create_page "slider-hero-section" "slider-hero-section"
create_page "custom-slider" "custom-slider"
create_page "fishy-button" "fishy-button"
create_page "halomot-button" "halomot-button"
create_page "refind-chronicle-button" "refind-chronicle-button"
create_page "stager-text" "stager-text"

echo "Component route files created under $BASE"
