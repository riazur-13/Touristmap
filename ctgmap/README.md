# Chittagong Explorer (`ctgmap`)

An interactive map of 28 tourist attractions across Chittagong Division,
Bangladesh — beaches, hill stations, waterfalls, religious and historical sites.
Pick a marker to see details for that place, then use **Get Directions** to draw
a driving route from your current location.

Built with React 19, Vite and Leaflet (via react-leaflet).

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
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

## Project layout

```
src/
  App.jsx                              app shell, filtering, routing state
  data/attractions.js                  the 28 attractions + lookup helpers
  components/map/MapView.jsx           Leaflet map, markers, route polyline
  components/attractions/…             details panel for the selected place
  components/ui/SearchBar.jsx          search input
  styles/utils/constants.js            map config, categories, breakpoints
  styles/variables.css                 design tokens (colors, spacing, radii)
public/images/                         attraction photos (c1.jpg … c29.jpg)
```

## Data notes

Attraction records live in `src/data/attractions.js`. Each entry needs a unique
`id`, a `coordinates` pair as `[latitude, longitude]`, a `category` drawn from
`CATEGORIES` in `styles/utils/constants.js`, and an image under
`public/images/`. Note that `id: 2` is intentionally absent, so ids are not
contiguous — never treat an id as an array index.

`MAP_CONFIG.MAX_BOUNDS` is defined but deliberately **not** applied to the map;
see the comment in `constants.js` for why.
