# Chittagong Explorer

Live demo: <https://touristmappp.vercel.app/>

An interactive map of 90 tourist attractions across Chittagong Division,
Bangladesh — beaches, hill stations, waterfalls, religious and historical sites
in 10 of the division's 11 districts.
Pick a marker to see details for that place, then use **Get Directions** to draw
a driving route from your current location.

Built with React 19, Vite and Leaflet (via react-leaflet). The app lives in
[`ctgmap/`](ctgmap).

## Features

- Map pins colored by category; the category chips double as the legend.
  Nearby pins group into numbered clusters that expand as you zoom in.
- Search by name or address (e.g. "Bandarban") combined with multi-select
  category filters, with an empty state that offers to clear everything.
- Details panel with a credited photo, best season, links to Wikipedia and
  Google Maps, and opening hours, entry fee and facilities where a reliable
  source gives them.
- Driving directions from your location, with a draggable "you are here"
  marker and a straight-line fallback when routing is unavailable.
- Keyboard accessible: pins and clusters are focusable and open with
  Enter/Space, Escape closes the details panel.
- Responsive: on small screens the details panel slides up under the map.

## Getting started

```bash
cd ctgmap
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts (run inside `ctgmap/`):

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
npm test         # Vitest: validates src/data/attractions.js (schema, ids,
                 # bounds, photo files and credits, links);
                 # `npm run test:watch` to re-run on save
```

> **Geolocation needs a secure context.** Browsers only expose
> `navigator.geolocation` over HTTPS or on `localhost`. Opening the dev server
> from a phone via a plain `http://<your-lan-ip>:5173` URL will disable
> "Get Directions"; use `vite --host` behind HTTPS, or a tunnel, to test on a
> real device.

## How routing works

Routes come from the public [OSRM demo server](https://router.project-osrm.org).
If it is unreachable, rate-limits the request, or takes longer than 10 seconds,
the app falls back to a straight-line estimate calculated with the haversine
formula and labels the result accordingly in the details panel.

The OSRM demo server carries no uptime guarantee and is not intended for
production traffic. Swap in your own routing endpoint before deploying.

The blue "your location" marker is draggable — drag it to correct poor GPS
accuracy and the route recalculates from the new position.

Map tiles come from OpenStreetMap's volunteer-run tile servers, which require
a `Referer` header. Do not add a `no-referrer` policy to `index.html`; the
tiles are replaced with "Access blocked" images when it is missing.

## Project layout

```
ctgmap/
  index.html
  public/images/                         attraction photos (c<id>.webp, ≤1200px wide)
  src/
    App.jsx                              app shell, filtering, routing state
    data/attractions.js                  the 90 attractions + lookup helpers
    components/map/MapView.jsx           Leaflet map, category pins, clusters, route line
    components/attractions/…             details panel for the selected place
    components/ui/SearchBar.jsx          search input
    config/constants.js                  map config, categories, breakpoints
    utils/maps.js                        Google Maps link helper
    styles/variables.css                 design tokens (colors, spacing, radii)
```

CSS uses BEM class names (`block__element--modifier`), one stylesheet per
component, and colors from the custom properties in `styles/variables.css`.

## Data notes

Attraction records live in `ctgmap/src/data/attractions.js`, and `npm test`
enforces these rules.

**Required fields:**
- `id`: unique;
- `name`, `description`, `address`;
- `coordinates` as `[latitude, longitude]`;
- `category` from `CATEGORIES` in `config/constants.js`;
- `bestTimeToVisit`.

`id: 2` is intentionally absent, so ids are not contiguous. Never treat an id as an array index.

**Optional fields:**
- `entryFee`, `openingHours`, `facilities`: only when a reliable source gives them. Never guess; the details panel hides a row with no value.
- `approximateLocation: true`: when no source gives a precise point. The details panel tells the user the pin is approximate.
- `moreInfoLink`: an English or Bengali Wikipedia article.
- `images` + `photoCredit`, always together (see Photos).

Coordinates come from OpenStreetMap or Wikidata. The research behind them is in [`docs/new-attractions-candidates.md`](docs/new-attractions-candidates.md) and [`docs/expansion-2026-10-01.md`](docs/expansion-2026-10-01.md).

### Photos

Every photo is a Wikimedia Commons file under CC0, CC BY, CC BY-SA or public domain. No other source is allowed. `photoCredit` is `{ author, license, sourceUrl }`, where `sourceUrl` is the Commons file page. The details panel shows it as a credit line under the photo, as the licenses require.

Photos are converted to WebP at most 1200 px wide, quality 80. A place with no free photo has neither `images` nor `photoCredit`, and shows the local placeholder (`src/assets/placeholder.webp`).

The map opens fitted to the bounds of all attractions. `MAP_CONFIG.MAX_BOUNDS`
keeps panning within the region around Bangladesh. It is tied to `MIN_ZOOM`:
if the viewport is ever larger than the box, Leaflet stops panning on that
axis. See the comment in `constants.js` before changing either.

## Roadmap

A Python/FastAPI backend with a TF-IDF recommendation engine is planned but not
yet in this repository.
