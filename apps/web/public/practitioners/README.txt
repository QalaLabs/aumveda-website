Practitioner photograph drop point.

Filenames the app looks for:
  sejal-jain.jpg     — Sejal Jain (Somatic Healing • Mumbai)
  archana-jain.jpg   — Archana Jain (Vedic Astrology • Jaipur)

Specs:
  - Aspect ratio: 4:5 (portrait). Anything else will crop.
  - Recommended resolution: 1000 x 1250 minimum, 2000 x 2500 preferred.
  - Format: JPG (Next/Image proxies to AVIF/WebP automatically at render time).
  - Colour: original, natural — the HealersSection component applies its own
    editorial grayscale filter that lifts on hover. Do NOT pre-desaturate.

To activate: drop the two files here, then in
  apps/web/src/components/HealersSection.tsx
edit the two constants at the top:
  const SEJAL_IMAGE   = '/practitioners/sejal-jain.jpg';
  const ARCHANA_IMAGE = '/practitioners/archana-jain.jpg';
No other changes needed. CLS stays at 0 because the wrapper is aspect-ratio locked.
