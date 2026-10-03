import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// client.js reads import.meta.env.VITE_API_URL at module scope, so each test
// stubs the value it needs and then imports a fresh copy of the module.
const loadClient = async (apiUrl) => {
  vi.stubEnv("VITE_API_URL", apiUrl);
  vi.resetModules();
  return import("./client.js");
};

describe("fetchSimilarPlaces", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("rejects when VITE_API_URL is not set", async () => {
    const { fetchSimilarPlaces } = await loadClient("");

    await expect(fetchSimilarPlaces("patenga-beach", { limit: 4 })).rejects.toThrow(
      /VITE_API_URL/,
    );
  });

  it("returns the results array on success", async () => {
    const { fetchSimilarPlaces } = await loadClient("http://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              slug: "parki-beach",
              name: "Parki Beach",
              category: "Beach",
              score: 0.55,
              distanceKm: 5.2,
            },
          ],
        }),
      }),
    );

    const places = await fetchSimilarPlaces("patenga-beach", { limit: 4 });

    expect(places).toEqual([
      {
        slug: "parki-beach",
        name: "Parki Beach",
        category: "Beach",
        distanceKm: 5.2,
      },
    ]);
  });

  it("rejects on a non-2xx response", async () => {
    const { fetchSimilarPlaces } = await loadClient("http://api.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(
      fetchSimilarPlaces("patenga-beach", { limit: 4 }),
    ).rejects.toThrow(/500/);
  });

  it("aborts the request once API_TIMEOUT_MS has elapsed", async () => {
    const { fetchSimilarPlaces, API_TIMEOUT_MS } = await loadClient("http://api.test");

    // A fetch that only settles when its signal aborts — i.e. a server that
    // never answers in time.
    const fetchMock = vi.fn(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const pending = fetchSimilarPlaces("patenga-beach", { limit: 4 });
    // Attach the expectation before advancing timers, so the rejection is never
    // unhandled.
    const assertion = expect(pending).rejects.toThrow(/Aborted/);

    await vi.advanceTimersByTimeAsync(API_TIMEOUT_MS + 1);

    await assertion;
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it("does not abort a request that answers in time", async () => {
    const { fetchSimilarPlaces, API_TIMEOUT_MS } = await loadClient("http://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );

    const places = await fetchSimilarPlaces("patenga-beach", { limit: 4 });
    // Advancing past the budget must not now blow up on an already-settled call.
    await vi.advanceTimersByTimeAsync(API_TIMEOUT_MS + 1);

    expect(places).toEqual([]);
  });
});
