# Chittagong Explorer

An interactive map of 28 tourist attractions across Chittagong Division,
Bangladesh — beaches, hill stations, waterfalls, religious and historical sites.
Pick a marker to see details for that place, then use **Get Directions** to draw
a driving route from your current location.

Built with React 19, Vite and Leaflet (via react-leaflet). The app lives in
[`ctgmap/`](ctgmap).

## Features

- Map pins colored by category; the category chips double as the legend.
- Search by name or address (e.g. "Bandarban") combined with multi-select
  category filters, with an empty state that offers to clear everything.
- Details panel with photo, opening hours, entry fee, best season, facilities
  and links to Wikipedia and Google Maps.
- Driving directions from your location, with a draggable "you are here"
  marker and a straight-line fallback when routing is unavailable.
- Keyboard accessible: pins are focusable and open with Enter/Space, Escape
  closes the details panel.
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
                 # bounds, image files); `npm run test:watch` to re-run on save
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
  public/images/                         attraction photos (c1.webp … c29.webp, ≤1200px wide)
  src/
    App.jsx                              app shell, filtering, routing state
    data/attractions.js                  the 28 attractions + lookup helpers
    components/map/MapView.jsx           Leaflet map, category pins, route line
    components/attractions/…             details panel for the selected place
    components/ui/SearchBar.jsx          search input
    config/constants.js                  map config, categories, breakpoints
    utils/maps.js                        Google Maps link helper
    styles/variables.css                 design tokens (colors, spacing, radii)
```

CSS uses BEM class names (`block__element--modifier`), one stylesheet per
component, and colors from the custom properties in `styles/variables.css`.

## Data notes

Attraction records live in `ctgmap/src/data/attractions.js`. Each entry needs a
unique `id`, a `coordinates` pair as `[latitude, longitude]`, a `category`
drawn from `CATEGORIES` in `config/constants.js`, and an image under
`public/images/`. Note that `id: 2` is intentionally absent, so ids are not
contiguous — never treat an id as an array index.

Coordinates were checked against OpenStreetMap, Wikipedia and Wikidata. Where no
source gives a precise point, the entry sets the optional
`approximateLocation: true`, and the details panel tells the user the pin is
approximate.

`MAP_CONFIG.MAX_BOUNDS` keeps panning within the region around Bangladesh. It is
tied to `MIN_ZOOM`: if the viewport is ever larger than the box, Leaflet stops
panning on that axis. See the comment in `constants.js` before changing either.

## Roadmap

A Python/FastAPI backend with a TF-IDF recommendation engine is planned but not
yet in this repository.
