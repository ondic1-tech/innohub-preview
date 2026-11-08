# Code and performance review — 8 November 2026

Reviewed the static Czech and English site against commit `1bdd34b`.

## Implemented improvements

- Keep the LinkedIn trigger at least 16 px below the visible masthead, including the blue navigation. Measure real header and trigger dimensions, batch updates with animation frames, and respond to scrolling, resizing and the expanded mobile menu. Use the compact trigger in windows at most 420 px tall as well as on narrow screens.
- Preload all three locally hosted font weights used above the fold, with anonymous CORS. Keep `font-display: swap` and deferred scripts.
- Serve the English TC logo as a responsive WebP: **17,402 bytes instead of 71,420 bytes** (75.6% less). Its 1,079 × 394 dimensions retain the original aspect ratio, white margins and calibrated visible header size; the original PNG remains the fallback.
- Add a 180 px Reactor symbol source: **15,312 bytes instead of the previous smallest 360 px source at 52,126 bytes** (70.6% less). Retain larger sources for high-density displays. Correct the homepage Reactor wordmark's `sizes` from 410 px to its actual 140 px display slot.
- Prefetch up to four likely next same-origin documents on deliberate mouse hover or keyboard focus. Skip data-saving and 2G connections, hidden documents, downloads, external links and query URLs. Native navigation remains intact.
- Prevent repeated selection of the same service from adding duplicate history entries. Cache service panel references, combine history/hash updates into one animation frame and use native `:focus-visible` styling.
- Recalculate the news carousel only when its viewport width changes, combine resize callbacks, avoid redundant accessibility-state writes and remove a permanent `will-change` layer. Add guards for incomplete carousel markup.
- Update the maintenance preparation script to retain approved page titles, descriptions and image alternatives, preserve English organisation metadata and regenerate the new image/font settings.
- Refresh content-based CSS/JS cache keys throughout the site.

## Validation

- JavaScript syntax checks passed for both scripts. The Python maintenance script passed a Python grammar syntax check; it was not executed because Python is unavailable on this workstation.
- Checked all **67 HTML files**, **83 image elements** and **1,073 local resource/link references**, including fragments, cache keys, duplicate IDs, metadata, JSON-LD, reciprocal language links and the 34-page sitemap: no errors. Preview indexing remains disabled.
- Compared approved main content, header wording and page titles against the baseline: unchanged apart from line-ending normalization.
- Opened all **35 full pages** (including the error page) at both **1,275 × 604** and **390 × 604**: no horizontal document overflow, broken visible images or LinkedIn/menu overlap.
- Additionally tested laptop/short-window dimensions (1,366 × 500, 1,024 × 500, 801 × 500, 1,366 × 420, 1,024 × 300), the expanded mobile menu, scrolling, LinkedIn opening/Escape, keyboard prefetch limits, service keyboard selection and Back/Forward history, and news navigation/expansion at three responsive column counts. No browser warnings or errors were observed during these checks.

The percentages above describe individual asset byte reductions, not a measured end-to-end page speed increase. No contact form was submitted during testing.
