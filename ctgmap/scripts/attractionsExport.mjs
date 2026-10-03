// Shared definition of the backend's copy of the attraction data.
//
// `attractions.js` stays the single source of truth. The backend never imports
// it (it is JavaScript, and the backend is Python), so `npm run export:attractions`
// projects it to JSON and the backend reads that.
//
// Both the export script and the drift test in `src/data/attractions.export.test.js`
// import this module, so the field list and the formatting live in exactly one
// place and the test can never check a different shape than the script writes.
import { fileURLToPath } from "node:url";

// Only what the recommender and its API responses need. Photos, credits,
// opening hours and the rest stay frontend-only — shipping them would mean a
// second thing to keep in sync for no gain.
export const EXPORT_FIELDS = [
  "slug",
  "name",
  "category",
  "description",
  "address",
  "coordinates",
];

export const EXPORT_PATH = fileURLToPath(
  new URL("../../backend/app/data/attractions.json", import.meta.url),
);

/**
 * The exported JSON text for `attractions`, as a complete file body.
 *
 * Source order is preserved and the keys are written in EXPORT_FIELDS order, so
 * re-exporting unchanged data produces a byte-identical file and `git diff`
 * shows only real content changes.
 */
export function buildExportJson(attractions) {
  const records = attractions.map((attraction) =>
    Object.fromEntries(
      EXPORT_FIELDS.map((field) => [field, attraction[field]]),
    ),
  );
  return `${JSON.stringify(records, null, 2)}\n`;
}
