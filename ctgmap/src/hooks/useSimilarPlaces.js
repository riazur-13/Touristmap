import { useEffect, useMemo, useState } from "react";
import { fetchSimilarPlaces, isApiConfigured } from "../api/client";
import { localSimilarPlaces } from "../api/localSimilar";

/** How many suggestions the details panel shows. */
export const SIMILAR_LIMIT = 4;

const NONE = { places: [], source: null, loading: false };

/**
 * Suggestions for `attraction`, from the backend when it is reachable and from
 * the browser when it is not.
 *
 * Returns `{ places, source, loading }`, where `source` is "api" or "local".
 * Never returns an error state: a failure is not worth showing the user when a
 * reasonable answer can be computed locally, so every failure path — API not
 * configured, network error, non-2xx, timeout — resolves to local suggestions.
 */
export function useSimilarPlaces(attraction) {
  // Pure and cheap, so it is derived during render instead of being stored in
  // state. This is the answer whenever the backend cannot supply one.
  const localPlaces = useMemo(
    () => (attraction ? localSimilarPlaces(attraction, SIMILAR_LIMIT) : []),
    [attraction],
  );

  // Keyed by slug so a response is only ever applied to the place it was
  // requested for. That is also what lets this hook avoid resetting state when
  // `attraction` changes: a stale entry simply stops matching.
  const [resolved, setResolved] = useState(null);

  useEffect(() => {
    if (!attraction || !isApiConfigured()) return;

    // Fences off a response that arrives after the user moved on, which would
    // otherwise show the previous place's suggestions under the new one.
    let cancelled = false;
    const controller = new AbortController();

    fetchSimilarPlaces(attraction.slug, {
      limit: SIMILAR_LIMIT,
      signal: controller.signal,
    })
      .then((places) => {
        if (!cancelled) {
          setResolved({ slug: attraction.slug, places, source: "api" });
        }
      })
      .catch(() => {
        // Network error, non-2xx, or the 3 s timeout. Also fires for the abort
        // this effect's own cleanup triggers, which `cancelled` filters out.
        if (!cancelled) {
          setResolved({
            slug: attraction.slug,
            places: localPlaces,
            source: "local",
          });
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attraction, localPlaces]);

  if (!attraction) return NONE;

  // With no API configured there is nothing to wait for, so the local results
  // render on the first paint with no loading state at all.
  if (!isApiConfigured()) {
    return { places: localPlaces, source: "local", loading: false };
  }

  if (resolved?.slug === attraction.slug) {
    return {
      places: resolved.places,
      source: resolved.source,
      loading: false,
    };
  }

  return { places: [], source: null, loading: true };
}
