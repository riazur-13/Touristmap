#!/usr/bin/env node
// Exports the attraction data to JSON for the Python backend.
//
//   npm run export:attractions
//
// Run this after editing src/data/attractions.js. If you forget,
// src/data/attractions.export.test.js fails and tells you to run it.
//
// Why load through Vite instead of importing directly: attractions.js uses
// extensionless imports ("../config/constants"), which the browser bundler
// resolves but plain Node ESM does not. Borrowing Vite's resolver means this
// script sees exactly the module graph the app sees, so the export cannot
// drift from what the frontend renders.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createServer } from "vite";
import {
  EXPORT_PATH,
  buildExportJson,
} from "./attractionsExport.mjs";

const server = await createServer({
  server: { middlewareMode: true },
  logLevel: "warn",
  configFile: false,
  // No browser is involved, so skip the index.html handling and the dependency
  // pre-bundling scan. The scan runs in the background and would still be
  // resolving imports when this script closes the server, which it reports as a
  // loud (but harmless) error after the export has already succeeded.
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { default: attractions } = await server.ssrLoadModule(
    "/src/data/attractions.js",
  );

  await mkdir(dirname(EXPORT_PATH), { recursive: true });
  await writeFile(EXPORT_PATH, buildExportJson(attractions), "utf8");

  console.log(
    `Exported ${attractions.length} attractions to ${EXPORT_PATH}`,
  );
} finally {
  await server.close();
}
