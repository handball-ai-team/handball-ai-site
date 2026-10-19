# Self-hosted fonts

These are unmodified Google Fonts WOFF2 files downloaded on 19 October 2026.
The original font weights, Unicode subsets and `font-display: swap` declarations
are preserved at the beginning of `../css/styles.css`. The existing layout CSS
follows them unchanged.

Files are numbered in Google Fonts' subset order, not by font weight. The Latin
subsets used by the English page are `bricolage-grotesque-3.woff2`,
`caveat-4.woff2` and `inter-7.woff2`. The other subsets are retained so the same
character coverage is available. Only subsets needed by the page are loaded.

The heading and body Latin fonts are preloaded in `../../index.html` so they
can download without waiting for CSS discovery. Fonts are served from the site;
the page no longer needs the Google Fonts stylesheet or third-party connections.

Source stylesheet:
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap

Font sources and licences (SIL Open Font License 1.1):
- https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque
- https://github.com/google/fonts/tree/main/ofl/caveat
- https://github.com/google/fonts/tree/main/ofl/inter

Each family's licence is included in this directory. Keep it with redistributed
font files. When updating the fonts, update their CSS declarations, preloads and
licences together.
