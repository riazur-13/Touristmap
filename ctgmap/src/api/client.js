/**
 * HTTP client for the recommendations backend.
 *
 * The base URL comes from VITE_API_URL. Vite inlines `import.meta.env.*` at
 * build time, so this is a constant in the shipped bundle, not a runtime lookup.
 * When it is unset every call fails fast and the caller falls back to computing
 * suggestions in the browser — see api/localSimilar.js.
 */

// Trailing slashes trimmed so `http://localhost:8000/` and `http://localhost:8000`
// both produce a valid URL.
const BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

/**
 * How long to wait before giving up and using the offline fallback.
 *
 * Short on purpose: these suggestions are a nicety, not the reason anyone opened
 * the page. Three seconds of a spinner is already worse than instantly showing
 * slightly less clever results.
 */
export const API_TIMEOUT_MS = 3000;

export const isApiConfigured = () => BASE_URL !== "";

/**
 * Places similar to `slug`, from the backend.
 *
 * Rejects if the API is not configured, the request fails, the response is not
 * 2xx, or it takes longer than API_TIMEOUT_MS. Callers are expected to treat any
 * rejection the same way: fall back to local suggestions.
 *
 * `signal` lets the caller cancel (e.g. on unmount). It is kept separate from
 * the internal timeout so the caller can tell the two apart: after a caller
 * abort, `signal.aborted` is true and there is nothing to fall back to.
 */
export async function fetchSimilarPlaces(slug, { limit, signal } = {}) {
  if (!isApiConfigured()) {
    throw new Error("VITE_API_URL is not set");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const abortInner = () => controller.abort();
  signal?.addEventListener("abort", abortInner, { once: true });

  try {
    const url = `${BASE_URL}/attractions/${encodeURIComponent(slug)}/similar?limit=${limit}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const body = await response.json();
    return (body.results ?? []).map((result) => ({
      slug: result.slug,
      name: result.name,
      category: result.category,
      distanceKm: result.distanceKm,
    }));
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortInner);
  }
}
