import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import attractions from "./attractions";
import {
  EXPORT_FIELDS,
  EXPORT_PATH,
  buildExportJson,
} from "../../scripts/attractionsExport.mjs";

// Guards the one place the data is duplicated: the backend reads a JSON copy of
// attractions.js (see scripts/export-attractions.mjs). Editing the data without
// re-exporting would leave the API serving stale places, which is invisible from
// the frontend — so it fails here instead.

const RE_EXPORT = "run `npm run export:attractions`";

// Git may check the JSON out with CRLF endings depending on core.autocrlf, which
// is not a content change. Compare on normalised endings so the test reflects
// drift in the data, not in the working copy's line endings.
const normalise = (text) => text.replace(/\r\n/g, "\n");

describe("backend attractions export", () => {
  it(`is up to date with attractions.js — if this fails, ${RE_EXPORT}`, () => {
    let onDisk;
    try {
      onDisk = readFileSync(EXPORT_PATH, "utf8");
    } catch {
      throw new Error(`${EXPORT_PATH} is missing — ${RE_EXPORT}`);
    }

    expect(normalise(onDisk), `export is stale — ${RE_EXPORT}`).toBe(
      normalise(buildExportJson(attractions)),
    );
  });

  it("exports every attraction with exactly the backend's fields", () => {
    const records = JSON.parse(readFileSync(EXPORT_PATH, "utf8"));

    expect(records).toHaveLength(attractions.length);
    for (const record of records) {
      expect(Object.keys(record)).toEqual(EXPORT_FIELDS);
    }
  });
});
