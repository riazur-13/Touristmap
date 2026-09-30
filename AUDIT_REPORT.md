# Audit report — 2026-09-30

Branch: `audit/cleanup-2026-09-30` (15 commits on top of `main`, including this report; not pushed).

## 1. Summary

- The app is **frontend only**. No Python/FastAPI backend exists in the repo or anywhere in the project folder, so every backend check was skipped (see §4).
- The worst bug: a `no-referrer` meta tag made OpenStreetMap serve **"403 Access blocked" tiles** instead of map tiles. Removed.
- **15 of 28 attraction pins were in the wrong place** (up to ~36 km off), and one Wikipedia link opened a disambiguation page. All were checked against OSM and Wikipedia and fixed.
- New behavior: pins colored by category, multi-select category filters, keyboard access to pins, a race-free "Get Directions", and BEM + design tokens across all CSS.
- Build and lint were clean before and after. The only new warning, a dependency audit finding, was fixed. No console warnings in dev (StrictMode) or production.

## 2. Problems found and fixed

### Map and routing

| File | Issue | Fix |
|---|---|---|
| `ctgmap/index.html` | `<meta name="referrer" content="no-referrer">` makes tile.openstreetmap.org return an "Access blocked" tile for every request (confirmed with curl: 403 image without a Referer, real tile with one). | Removed the tag. The browser default policy is fine because the photos are local now. Added a meta description. |
| `MapView.jsx` | Every attraction pin was the same blue default icon. `CATEGORIES[*].color` was defined but never used. | Pins are inline-SVG `divIcon`s in the category color, cached per color and state. The selected pin is larger, outlined and raised. |
| `MapView.jsx` | Leaflet 1.9 gives markers `role="button"` and a tab stop but ignores Enter, so keyboard users could focus a pin and do nothing. | Enter and Space on a focused pin select it. Pins get a `title` (their accessible name) and a visible focus ring. |
| `MapView.jsx` | The tooltip covered the pin when opened by keyboard focus, because Leaflet ignores `tooltipAnchor` for sticky tooltips. | Tooltips are no longer sticky and are anchored above the pin. |
| `MapView.jsx` / `main.jsx` | `leaflet.css` was imported twice. | The import is kept in `main.jsx` only. |
| `MapView.jsx` | The Leaflet default-icon path bug under Vite. | No marker uses `L.Icon.Default` anymore; each one passes an explicit icon. A comment documents this. |
| `App.jsx` | Clicking **Get Directions** and then picking another place (or closing the panel) during the up-to-15-second location lookup still routed to the first place. | The lookup is fenced with the same request id that `clearRoute` bumps. |

### Filters and search

| File | Issue | Fix |
|---|---|---|
| `App.jsx` | Category filter was single-select. | Multi-select: categories combine with OR, and the search combines with them using AND. "All" clears the selection. Chips have `aria-pressed` and a color swatch that matches the pins, so they double as the map legend. |
| `App.jsx` | The empty state only covered the search text and wrongly implied the category played no part. | The message names both the search and the categories, is a live `role="status"`, and has one "Clear filters" action. |
| `App.jsx` | A search with a trailing space (`"cox "`) matched nothing. | The query is trimmed. |
| `App.jsx` | The details panel could only be closed with the mouse. | Escape closes it. |

### Attraction data (`ctgmap/src/data/attractions.js`)

Count confirmed: **28** attractions (ids 1 and 3–29). The README already said 28. Schema, unique ids, image files and categories all passed an automated check.

Distances below are how far each pin moved.

| Attraction | Issue | Fix |
|---|---|---|
| Shoilo Propat | Moved 35.6 km; it was nowhere near Milonchari. Linked to the district article. | Coordinates and link now come from the dedicated article. |
| Dulahazara Safari Park | Moved 20.4 km; it was placed at Cox's Bazar town. | Moved to the OSM location. Link uses the canonical title. |
| Jadipai Waterfall | Moved 19.6 km, and it was listed in Thanchi. OSM tags it near Keokradong in Ruma. | Coordinates moved, and the address and description corrected. |
| Moheshkhali Island | Moved 14.5 km; it was in the sea. | Moved to the island. |
| Boga Lake | Moved 14.2 km. The link opened a disambiguation page. | Moved to the OSM lake. Link now points to `Boga_Lake_(Bangladesh)`. |
| Cox's Bazar Beach, Parki, Inani, Teknaf, Patenga | Moved 6.1, 4.4, 4.3, 3.8 and 0.6 km. Cox's Bazar sat on Link Road by the railway station. | Moved onto the beaches. Parki and Teknaf now link to their own articles. |
| Buddha Dhatu Jadi, Nilgiri, Chandranath Temple, War Cemetery, Foy's Lake | Moved 4.3, 4.2, 2.9, 2.6 and 2.2 km. | Moved to OSM-verified points. |
| Karnaphuli, Alikadam | Links went through redirects. | Links use canonical titles. |

### CSS and design system

| File | Issue | Fix |
|---|---|---|
| `index.css` | Nothing set `font-family`, so the header and details panel rendered in the browser's default serif. | Added a system font stack, one global `:focus-visible` ring and `prefers-reduced-motion` support. |
| All CSS | Class names mixed several styles (`header-top`, `card-body`, `chip.active`, and generic globals like `.label`, `.value`, `.spin`). | Switched to BEM: `app__*`, `filter-bar__*`, `chip--active`, `search-bar__*`, `attraction-card__*`, `info-item__*`, `route-status--*`, `btn--*`. |
| All CSS | About 60 hardcoded hex/rgba colors. `--color-primary` was an unused purple (`#667eea`), while the UI is blue. | Every UI color now comes from `styles/variables.css`. Unused tokens were dropped. |
| `App.css` | A second `.directions-btn` rule scaled the button on hover even while it was disabled. | Removed. Both action buttons share `.btn`. |
| `App.css` | On mobile the map was fixed at 55% height, even with no attraction selected, leaving 45% of the screen blank. `100vh` overflowed behind mobile browser toolbars. | The map fills whatever the details panel leaves. The shell uses `height: 100%`. |

### Accessibility

| File | Issue | Fix |
|---|---|---|
| `SearchBar.jsx` | The input had only a placeholder, and the clear button had only an icon. | Added `aria-label`s, `role="search"` and `type="search"`. |
| `AttractionDetails.jsx` | The close label was just "Close". Icons weren't hidden from screen readers. The "Learn More" link didn't say it opens a new tab. | Label is now "Close details". Decorative icons have `aria-hidden`. Screen-reader text says "(opens in a new tab)". |
| `AttractionDetails.jsx` | `onError` swapped in a remote placeholder with no guard. If that also failed, the handler re-fired forever. | Fires once per image. `loading="lazy"` was removed from the image at the top of the panel. |
| `AttractionDetails.jsx` | Five copy-pasted info rows. | Extracted an `InfoItem` component. |

### Tooling and repo

| File | Issue | Fix |
|---|---|---|
| `ctgmap/package-lock.json` | `npm audit`: 2 high-severity advisories in `brace-expansion` and `js-yaml`, both dev-only via eslint. | `npm audit fix`. Now 0 vulnerabilities. |
| `.gitignore` (new, repo root) | `.env` files weren't ignored (`ctgmap/.gitignore` only matches `*.local`). There were no Python rules for the planned backend. | Root `.gitignore` covers `.env*` (except `.env.example`), `node_modules`, `dist`, `__pycache__`, `venv`/`.venv`. |
| `README.md` | Was in `ctgmap/`, so the GitHub repo root showed no README. | Moved to the root, commands point at `ctgmap/`, and it documents the new features and conventions. |

## 3. Deleted

Each item was grepped for references first, and nothing referenced it.

- `ctgmap/src/assets/markers/marker-icon-2x-red.png`: the old selected-pin image, replaced by SVG pins. The marker README was updated.
- Dead CSS in `App.css`: `.sidebar-header`, `.sidebar-body`, `.detail-image-container`, `.detail-image`, `.category-tag`, `.detail-info`, `.description`, `.locate-btn`, `.leaflet-control-bar`, `.results-badge:empty`, the duplicate `.directions-btn`, and a redundant `.leaflet-container` size override.
- Dead CSS in `AttractionDetails.css`: the "legacy" `.close-btn`, `.info-row`, and a second `.directions-btn` block. The unstyled `full-width` and `info-text` class hooks were removed from the JSX.
- Unused imports of `leaflet/dist/images/marker-icon.png` and `marker-icon-2x.png`.
- Unused CSS tokens: `--color-primary-dark`, `--color-secondary`, `--color-accent`, `--spacing-xs`, `--spacing-xl`, `--radius-full`, `--z-sticky`, `--transition-base`.

Nothing else needed removing:
- No console.logs, commented-out code, Vite boilerplate (logos, counter, demo styles) or scratch files remained.
- `dist/` and `node_modules/` exist locally but are ignored and were never committed.

## 4. Not changed, needs a decision or a human check

**Backend (all Phase 2 backend items).** The repo has no Python code, `requirements.txt` or `pyproject.toml`. I did not scaffold one. FastAPI startup, Pydantic models, CORS, the recommendation endpoint and input validation can't be checked yet. For the same reason I did not add `VITE_API_URL` or a `.env.example`: nothing calls an API, so it would be dead config. When the backend lands:
- Read `import.meta.env.VITE_API_URL` in one small API module.
- Commit `ctgmap/.env.example`.
- Keep the current static `attractions.js` as the fallback when the API is down. The `.gitignore` rules are already in place.

**Data that needs a local check:**
- **Meghla Tourist Complex.** The description says a hilltop resort in Mirsharai with tea gardens. The well-known Meghla Parjatan Complex is in Bandarban, and no OSM or Wikipedia match exists for a Mirsharai one. The description, address, coordinates and link may all describe the wrong place.
- **Chimbuk Hill, Nafakhum, Tajingdong, Himchari.** OSM and Wikipedia either disagree or have no precise point. Left as is.
- **Kaptai Lake and Sangu River** are large features. The pins are representative points, so they weren't moved.
- **Links to parent articles.** Nilgiri, Chimbuk, Meghla, the Hanging Bridge and Khyang Para link to their upazila, district or people article because no dedicated English Wikipedia article exists.
- **Categories.** Dulahazara Safari Park is filed as "Cultural Center". A wildlife park might fit "Natural Wonder" better.
- **Google Maps links.** The data has none, so there was nothing to validate. Directions use OSRM.

**Looks unused, but I kept it:**
- `CATEGORIES[*].icon` (emoji): unused, but plausible future UI.
- `MAP_CONFIG.MAX_BOUNDS`: intentionally unapplied and documented.
- `BREAKPOINTS.MOBILE`, `DESKTOP` and `WIDE`: only `TABLET` is used.

**Other:**
- npm prints an `allow-scripts` warning for esbuild's install script. The build works without it. Approving it (`npm approve-scripts esbuild`) is your call.

## 5. Baseline vs. final

| Check | Baseline (`main`) | Final (this branch) |
|---|---|---|
| `npm run build` | ✓ 0 errors, 0 warnings (JS 387.3 kB / 124.3 kB gzip) | ✓ 0 errors, 0 warnings (JS 383.8 kB / 121.0 kB gzip) |
| `npm run lint` | ✓ clean | ✓ clean |
| `npm audit` | ✗ 2 high | ✓ 0 |
| Browser console (dev, StrictMode) | not checked | ✓ no warnings or errors |
| Map tiles | ✗ "Access blocked" (no Referer) | ✓ load |
| Attraction coordinates | 14 of 28 off by more than 1 km | ✓ 15 pins moved where OSM or Wikipedia had a precise match (see §4 for the rest) |
| Backend startup | n/a (no backend) | n/a |

The browser checks used headless Chrome against both `vite preview` and `vite dev`, at 1366×800 and a 390×844 mobile viewport:
- 28 pins render in category colors.
- Selecting Beach + Religious Site shows 8 results.
- Search "zzz" shows the empty state, and "Clear filters" restores all 28.
- Tab to a pin + Enter opens its details, and Escape closes them.
- No horizontal scroll on mobile.

## 6. Suggested next steps

1. **Compress the photos.** `public/images` is 6.8 MB, and `c16.jpg` alone is 4.6 MB. Converting to ~1200 px WebP would cut this by about 90%.
2. **Replace the remote `placehold.co` fallback** with a local placeholder image, so a broken photo doesn't need a third-party request.
3. **Move `styles/utils/constants.js`** to something like `src/config/`. It holds map config and category data, not styles.
4. **Match search against address too**, so "Bandarban" finds the nine places there.
5. **Add a data test** (for example with Vitest) that locks in the schema, unique-id, bounds and image checks from this audit.
6. **Use a self-hosted or keyed routing endpoint and tile provider** before any real deployment. The OSRM demo and OSM tile servers are not meant for production traffic.
