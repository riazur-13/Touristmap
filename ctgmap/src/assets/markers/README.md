# Vendored marker icons

`marker-icon-2x-red.png` and `marker-icon-2x-blue.png` are copied from
[pointhi/leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)
and are used by `src/components/map/MapView.jsx` for the selected-attraction
marker and the user-location marker respectively.

They were previously hot-linked from `raw.githubusercontent.com` at runtime,
which meant both markers rendered broken whenever GitHub was unreachable and
leaked a request to a third party on every map load. They are vendored here so
Vite bundles and fingerprints them like any other local asset.

Both are 50x82 retina PNGs, rendered down to 30x48 and 25x41 in `MapView`.

Licensed under BSD 2-Clause — see `LICENSE` in this directory. The marker
shadow comes from the `leaflet` npm package itself and needs no vendoring.
