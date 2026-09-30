const PARAM = "place";

export const readPlaceSlug = (search) =>
  new URLSearchParams(search).get(PARAM);

// Relative URL for `loc` with ?place= set to `slug` (or removed when falsy),
// leaving the path, other params and hash untouched.
export function withPlace({ pathname, search, hash }, slug) {
  const params = new URLSearchParams(search);
  if (slug) params.set(PARAM, slug);
  else params.delete(PARAM);
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ""}${hash}`;
}

// History model: an open place panel is one history entry sitting on top of a
// "closed" entry, so Back closes the panel and switching places replaces the
// open entry instead of stacking more. Open entries are marked in history.state.
const PANEL_STATE = { placePanel: true };

const isPanelEntry = () => window.history.state?.placePanel === true;

// Call once on load with the slug of the place the URL opened (or null).
// Puts a closed entry under a place opened by link, and drops an unknown
// ?place= so it does not leave a dead link.
export function initPlaceHistory(slug) {
  const { history, location } = window;
  if (!slug) {
    if (readPlaceSlug(location.search)) {
      history.replaceState(null, "", withPlace(location, null));
    }
    return;
  }
  if (isPanelEntry()) return;
  const openUrl = withPlace(location, slug);
  history.replaceState(null, "", withPlace(location, null));
  history.pushState(PANEL_STATE, "", openUrl);
}

// The panel shows `slug`: push from closed, replace when switching places.
export function showPlaceHistory(slug) {
  const url = withPlace(window.location, slug);
  if (isPanelEntry()) window.history.replaceState(PANEL_STATE, "", url);
  else window.history.pushState(PANEL_STATE, "", url);
}

// The panel closed: go back to the closed entry underneath it.
export function closePlaceHistory() {
  if (isPanelEntry()) window.history.back();
  else
    window.history.replaceState(null, "", withPlace(window.location, null));
}
