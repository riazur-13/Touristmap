import { describe, expect, it } from "vitest";
import attractions from "../data/attractions";
import { getGoogleMapsUrl } from "./maps";

const BASE = "https://www.google.com/maps/search/?api=1&query=";

describe("getGoogleMapsUrl", () => {
  it("uses exact coordinates for a precisely located attraction", () => {
    expect(
      getGoogleMapsUrl({
        name: "Cox's Bazar Beach",
        address: "Cox's Bazar, Chittagong Division",
        coordinates: [21.4506, 91.9524],
      }),
    ).toBe(`${BASE}21.4506,91.9524`);
  });

  it("uses the URL-encoded name and address when approximateLocation is true", () => {
    expect(
      getGoogleMapsUrl({
        name: "Chimbuk Hill",
        address: "Bandarban Sadar, Bandarban",
        coordinates: [21.8667, 92.2667],
        approximateLocation: true,
      }),
    ).toBe(`${BASE}Chimbuk%20Hill%2C%20Bandarban%20Sadar%2C%20Bandarban`);
  });

  it("treats approximateLocation: false like an absent flag", () => {
    expect(
      getGoogleMapsUrl({
        name: "X",
        address: "Y",
        coordinates: [22, 92],
        approximateLocation: false,
      }),
    ).toBe(`${BASE}22,92`);
  });

  it("round-trips every attraction's query through the URL", () => {
    for (const a of attractions) {
      const url = new URL(getGoogleMapsUrl(a));
      expect(url.origin + url.pathname).toBe("https://www.google.com/maps/search/");
      expect(url.searchParams.get("api")).toBe("1");
      const query = url.searchParams.get("query");
      if (a.approximateLocation) {
        expect(query, a.name).toBe(`${a.name}, ${a.address}`);
      } else {
        expect(query.split(",").map(Number), a.name).toEqual(a.coordinates);
      }
    }
  });
});
