import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import attractions from "./attractions";
import { CATEGORIES, MAP_CONFIG } from "../config/constants";

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

// Every attraction must have exactly these fields with these types.
const REQUIRED_FIELDS = {
  id: "number",
  name: "string",
  description: "string",
  coordinates: "object",
  category: "string",
  images: "string",
  moreInfoLink: "string",
  address: "string",
  bestTimeToVisit: "string",
  entryFee: "string",
  openingHours: "string",
  facilities: "string",
};
const OPTIONAL_FIELDS = { approximateLocation: "boolean" };

const CATEGORY_NAMES = Object.values(CATEGORIES).map((c) => c.name);
const [[SOUTH, WEST], [NORTH, EAST]] = MAP_CONFIG.MAX_BOUNDS;

// it.each labels: "#<id> <name>"
const cases = attractions.map((a) => [`#${a.id} ${a.name}`, a]);

describe("attractions data", () => {
  it("is a non-empty list", () => {
    expect(attractions.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = attractions.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(cases)("%s", (_label, a) => {
    it("has every required field, non-empty and of the right type", () => {
      for (const [field, type] of Object.entries(REQUIRED_FIELDS)) {
        expect(a[field], field).toBeTypeOf(type);
        if (type === "string") expect(a[field].trim(), field).not.toBe("");
      }
      expect(Number.isInteger(a.id)).toBe(true);
    });

    it("has no unknown fields", () => {
      const known = { ...REQUIRED_FIELDS, ...OPTIONAL_FIELDS };
      expect(Object.keys(a).filter((k) => !(k in known))).toEqual([]);
    });

    it("has a boolean approximateLocation when present", () => {
      if ("approximateLocation" in a) {
        expect(a.approximateLocation).toBeTypeOf("boolean");
      }
    });

    it("uses a category from CATEGORIES", () => {
      expect(CATEGORY_NAMES).toContain(a.category);
    });

    it("has [lat, lng] coordinates inside MAP_CONFIG.MAX_BOUNDS", () => {
      expect(a.coordinates).toHaveLength(2);
      const [lat, lng] = a.coordinates;
      expect(lat).toBeGreaterThanOrEqual(SOUTH);
      expect(lat).toBeLessThanOrEqual(NORTH);
      expect(lng).toBeGreaterThanOrEqual(WEST);
      expect(lng).toBeLessThanOrEqual(EAST);
    });

    it("points to an image file that exists in public/", () => {
      expect(a.images).toMatch(/^\/images\//);
      expect(existsSync(`${PUBLIC_DIR}${a.images}`), a.images).toBe(true);
    });

    it("links to an English Wikipedia article over HTTPS", () => {
      expect(a.moreInfoLink).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\/\S+$/);
    });
  });
});
