# Vendored marker icon

`marker-icon-2x-blue.png` is copied from
[pointhi/leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)
and is used by `src/components/map/MapView.jsx` for the user-location marker.
Attraction pins are inline SVG colored per category, so they need no image.

It was previously hot-linked from `raw.githubusercontent.com` at runtime,
which meant the marker rendered broken whenever GitHub was unreachable and
leaked a request to a third party on every map load. It is vendored here so
Vite bundles and fingerprints it like any other local asset.

It is a 50x82 retina PNG, rendered down to 25x41 in `MapView`.

Licensed under BSD 2-Clause — see `LICENSE` in this directory. The marker
shadow comes from the `leaflet` npm package itself and needs no vendoring.
