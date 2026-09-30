import { describe, expect, it } from "vitest";
import { readPlaceSlug, withPlace } from "./placeUrl";

const loc = (pathname, search = "", hash = "") => ({ pathname, search, hash });

describe("readPlaceSlug", () => {
  it("reads the place param", () => {
    expect(readPlaceSlug("?place=foys-lake")).toBe("foys-lake");
    expect(readPlaceSlug("?x=1&place=foys-lake")).toBe("foys-lake");
  });

  it("returns null when absent", () => {
    expect(readPlaceSlug("")).toBeNull();
    expect(readPlaceSlug("?x=1")).toBeNull();
  });
});

describe("withPlace", () => {
  it("adds and replaces the param", () => {
    expect(withPlace(loc("/"), "foys-lake")).toBe("/?place=foys-lake");
    expect(withPlace(loc("/", "?place=a"), "b")).toBe("/?place=b");
  });

  it("removes the param and the empty query string", () => {
    expect(withPlace(loc("/", "?place=a"), null)).toBe("/");
  });

  it("keeps other params, path and hash", () => {
    expect(withPlace(loc("/app/", "?x=1", "#top"), "a")).toBe(
      "/app/?x=1&place=a#top",
    );
    expect(withPlace(loc("/app/", "?x=1&place=a", "#top"), null)).toBe(
      "/app/?x=1#top",
    );
  });
});
