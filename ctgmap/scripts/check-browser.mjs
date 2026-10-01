#!/usr/bin/env node
// Checks the "You might also like" section in real headless Chrome.
//
//   node scripts/check-browser.mjs <pageUrl> [--deadline=15000] [--click=1]
//
// Prints which source the suggestions came from ("api" or "local"), the places
// shown, and how long the section took to settle. Exits non-zero if it never
// settles or renders nothing.
//
// --click=N clicks the Nth suggestion (1-based) and additionally reports the
// resulting URL and panel title, which checks that a suggestion selects its
// place through the same ?place= behaviour as a map pin.
//
// Why the DevTools Protocol rather than `chrome --dump-dom`: --dump-dom prints
// at the load event, before an async fetch resolves. Adding
// --virtual-time-budget makes Chrome wait, but it also pauses virtual time while
// a fetch is pending, so a setTimeout-based request timeout never fires and a
// slow backend is indistinguishable from a fast one. This polls in real time, so
// timeout and fallback behaviour is actually observable.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

const PORT = 9333;
const POLL_INTERVAL_MS = 250;

const [pageUrl, ...flags] = process.argv.slice(2);
const deadlineMs = Number(
  flags.find((f) => f.startsWith("--deadline="))?.split("=")[1] ?? 15000,
);
const clickNth = Number(flags.find((f) => f.startsWith("--click="))?.split("=")[1] ?? 0);

if (!pageUrl) {
  console.error("usage: node scripts/check-browser.mjs <pageUrl> [--deadline=ms]");
  process.exit(2);
}

const chromePath = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
if (!chromePath) {
  console.error(`Could not find Chrome. Checked:\n  ${CHROME_CANDIDATES.join("\n  ")}`);
  process.exit(2);
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    `--user-data-dir=${process.env.TEMP ?? "/tmp"}/ctgmap-cdp-profile`,
    `--remote-debugging-port=${PORT}`,
    pageUrl,
  ],
  { stdio: "ignore" },
);
process.on("exit", () => chrome.kill());

async function findPageTarget() {
  for (let attempt = 0; attempt * POLL_INTERVAL_MS < deadlineMs; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await response.json();
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // The debugging port is not open yet.
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error("Chrome did not expose a page target in time");
}

const target = await findPageTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function evaluate(expression) {
  const id = Math.floor(Math.random() * 1e9);
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      socket.removeEventListener("message", onMessage);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result.result.value);
    };
    socket.addEventListener("message", onMessage);
    socket.send(
      JSON.stringify({ id, method: "Runtime.evaluate", params: { expression } }),
    );
  });
}

const PROBE = `JSON.stringify({
  source: document.querySelector(".similar-places")?.dataset.source ?? null,
  loading: Boolean(document.querySelector(".similar-places__status")),
  heading: document.querySelector(".similar-places__title")?.textContent.trim() ?? null,
  places: [...document.querySelectorAll(".similar-place")].map((el) => ({
    name: el.querySelector(".similar-place__name")?.textContent,
    meta: el.querySelector(".similar-place__meta")?.textContent,
  })),
  title: document.querySelector(".attraction-card__title")?.textContent ?? null,
})`;

// Poll in real time until the section commits to a source. The deadline must
// exceed the client's own request timeout, or this would report "never settled"
// for a slow backend that does in fact fall back correctly.
const started = Date.now();
let state;
let elapsed = 0;
while (elapsed < deadlineMs) {
  state = JSON.parse(await evaluate(PROBE));
  elapsed = Date.now() - started;
  if (state.source !== null) break;
  await sleep(POLL_INTERVAL_MS);
}

const report = { ...state, settledAfterMs: elapsed };

if (clickNth > 0 && state.source !== null) {
  const clicked = JSON.parse(
    await evaluate(`(() => {
      const target = document.querySelectorAll(".similar-place")[${clickNth - 1}];
      if (!target) return JSON.stringify({ error: "no such suggestion" });
      const name = target.querySelector(".similar-place__name")?.textContent;
      target.click();
      return JSON.stringify({ clickedName: name });
    })()`),
  );

  // One frame for React to re-render and push the history entry.
  await sleep(500);

  report.click = {
    ...clicked,
    ...JSON.parse(
      await evaluate(`JSON.stringify({
        url: location.search,
        panelTitle: document.querySelector(".attraction-card__title")?.textContent ?? null,
      })`),
    ),
  };
}

socket.close();
chrome.kill();

console.log(JSON.stringify(report, null, 2));

if (state.source === null) {
  console.error(`FAIL: suggestions never settled within ${deadlineMs}ms`);
  process.exit(1);
}
if (state.places.length === 0) {
  console.error("FAIL: settled but rendered no suggestions");
  process.exit(1);
}
if (clickNth > 0 && report.click?.panelTitle !== report.click?.clickedName) {
  console.error(
    `FAIL: clicked "${report.click?.clickedName}" but panel shows "${report.click?.panelTitle}"`,
  );
  process.exit(1);
}
