import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import attractions from "./attractions";
import { CATEGORIES, MAP_CONFIG } from "../config/constants";

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

// Every attraction must have these fields with these types.
const REQUIRED_FIELDS = {
  id: "number",
  name: "string",
  description: "string",
  coordinates: "object",
  category: "string",
  address: "string",
  bestTimeToVisit: "string",
};
// Optional fields may be absent, but when present they must be the right type
// (and non-empty, for strings). Fees, hours and facilities are left out when
// no reliable source gives them; the details panel then hides the row. A place
// with no freely licensed photo has no `images`/`photoCredit` and shows the
// placeholder; one with no Wikipedia article has no `moreInfoLink`.
const OPTIONAL_FIELDS = {
  approximateLocation: "boolean",
  entryFee: "string",
  openingHours: "string",
  facilities: "string",
  images: "string",
  photoCredit: "object",
  moreInfoLink: "string",
};

// Photos may only come from Wikimedia Commons under these licenses.
const FREE_LICENSE = /^(CC0|CC BY(-SA)? \d\.\d|Public domain)$/;
const COMMONS_FILE_URL = /^https:\/\/commons\.wikimedia\.org\/wiki\/File:\S+$/;
const WIKIPEDIA_URL = /^https:\/\/(en|bn)\.wikipedia\.org\/wiki\/\S+$/;

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

    it("has optional fields of the right type when present", () => {
      for (const [field, type] of Object.entries(OPTIONAL_FIELDS)) {
        if (!(field in a)) continue;
        expect(a[field], field).toBeTypeOf(type);
        if (type === "string") expect(a[field].trim(), field).not.toBe("");
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

    it("has an existing image file and a photo credit, or neither", () => {
      if (!("images" in a)) {
        expect("photoCredit" in a, "photoCredit without images").toBe(false);
        return;
      }
      expect(a.images).toMatch(/^\/images\/c\d+\.webp$/);
      expect(existsSync(`${PUBLIC_DIR}${a.images}`), a.images).toBe(true);
      expect(a.photoCredit, "images without photoCredit").toBeDefined();
    });

    it("credits its photo with author, a free license and the Commons source", () => {
      if (!a.photoCredit) return;
      expect(Object.keys(a.photoCredit).sort()).toEqual([
        "author",
        "license",
        "sourceUrl",
      ]);
      expect(a.photoCredit.author.trim()).not.toBe("");
      expect(a.photoCredit.license).toMatch(FREE_LICENSE);
      expect(a.photoCredit.sourceUrl).toMatch(COMMONS_FILE_URL);
    });

    it("links to an English or Bengali Wikipedia article when it has a link", () => {
      if (!("moreInfoLink" in a)) return;
      expect(a.moreInfoLink).toMatch(WIKIPEDIA_URL);
    });
  });

  it("has no image files in public/images that no attraction uses", () => {
    const used = new Set(attractions.map((a) => a.images).filter(Boolean));
    const files = readdirSync(`${PUBLIC_DIR}/images`).map(
      (f) => `/images/${f}`,
    );
    expect(files.filter((f) => !used.has(f))).toEqual([]);
  });
});
