import { describe, expect, it } from "vitest";
import attractions from "../data/attractions";
import { getGoogleMapsUrl } from "./maps";

describe("getGoogleMapsUrl", () => {
  it("builds a Maps URLs search link from [lat, lng]", () => {
    expect(getGoogleMapsUrl([21.4506, 91.9524])).toBe(
      "https://www.google.com/maps/search/?api=1&query=21.4506,91.9524",
    );
  });

  it("round-trips every attraction's coordinates through the query", () => {
    for (const a of attractions) {
      const url = new URL(getGoogleMapsUrl(a.coordinates));
      expect(url.origin + url.pathname).toBe("https://www.google.com/maps/search/");
      expect(url.searchParams.get("api")).toBe("1");
      expect(url.searchParams.get("query").split(",").map(Number)).toEqual(
        a.coordinates,
      );
    }
  });
});
