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
