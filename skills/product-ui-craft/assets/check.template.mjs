// Interaction test: drives the real page with real clicks in Chromium and WebKit
// and checks what the user would see. Copy to tests/check.mjs and replace the
// example checks with your product's main flows.
//
//   npm i -D playwright && npx playwright install chromium webkit
//   node tests/check.mjs
import { chromium, webkit } from "playwright";

// What the user will actually open: a built file, or a running dev server.
const TARGET = process.env.TARGET || new URL("../preview.html", import.meta.url).href;

let total = 0, failed = 0;

async function run(engineName, engine) {
  const results = [], pageErrors = [];
  const ok = (what, pass) => results.push([what, !!pass]);
  const browser = await engine.launch();
  const open = async (contextOptions, route = "") => {
    const page = await (await browser.newContext(contextOptions)).newPage();
    page.on("pageerror", (e) => pageErrors.push(e.message));
    page.on("console", (m) => m.type() === "error" && pageErrors.push(m.text()));
    await page.goto(TARGET + route); await page.waitForTimeout(400);
    return page;
  };

  // ---- helpers -------------------------------------------------------------
  // The vertical centres of these elements differ by at most 1px.
  const aligned = async (p, selectors) => {
    const ys = [];
    for (const s of selectors) { const b = await p.locator(s).first().boundingBox(); if (!b) return false; ys.push(b.y + b.height / 2); }
    return Math.max(...ys) - Math.min(...ys) <= 1;
  };
  // In every row matching rowSel that contains both a and b, they share a centre line.
  const rowsAligned = (p, rowSel, a, b) => p.evaluate(([rowSel, a, b]) =>
    [...document.querySelectorAll(rowSel)].filter((r) => r.querySelector(a) && r.querySelector(b)).every((r) => {
      const mid = (s) => { const x = r.querySelector(s).getBoundingClientRect(); return x.top + x.height / 2; };
      return Math.abs(mid(a) - mid(b)) <= 1;
    }), [rowSel, a, b]);
  // Nothing is wider than the screen.
  const fits = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  // The element is fully inside the viewport.
  const onScreen = (p, sel) => p.locator(sel).first().evaluate((el) => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; });
  const scrollTop = (p, sel) => p.locator(sel).first().evaluate((el) => el.scrollTop);

  // ---- desktop -------------------------------------------------------------
  let p = await open({ viewport: { width: 1440, height: 900 } });

  // Replace everything below with your own flows. The comments name the kinds of
  // checks worth having; each one has caught a real bug.

  // 1. Alignment of the rows people look at most.
  // ok("aligned: header title and buttons share a centre line", await aligned(p, ["header h1", "header button >> nth=0"]));

  // 2. A draft survives an unrelated update.
  // await p.locator("textarea").fill("a message not sent yet");
  // await p.getByRole("button", { name: "Approve" }).click(); await p.waitForTimeout(300);
  // ok("the draft is still there after pressing another button", (await p.locator("textarea").inputValue()) === "a message not sent yet");

  // 3. The main action does what it says, and the result is visible.
  // await p.keyboard.press("Enter"); await p.waitForTimeout(600);
  // ok("after sending, the message appears and the input is empty and still focused", (await p.getByText("a message not sent yet").count()) === 1 && (await p.locator("textarea").inputValue()) === "" && await p.locator("textarea").evaluate((el) => el === document.activeElement));

  // 4. A dialog keeps its place while you use it, and closes properly.
  // await p.getByRole("button", { name: "Settings" }).click(); await p.waitForTimeout(300);
  // ok("no button carries a focus ring when the dialog opens", await p.evaluate(() => !document.activeElement.matches("button")));
  // ok("aligned: select and switch share a centre line in every settings row", await rowsAligned(p, "[role=dialog] .row", "[role=combobox]", "[role=switch]"));
  // const before = await scrollTop(p, "[role=dialog] .scroll"); await p.getByRole("switch").first().click();
  // ok("the dialog does not jump to the top after toggling a switch", (await scrollTop(p, "[role=dialog] .scroll")) === before);
  // await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  // ok("Escape closes the dialog", (await p.locator("[role=dialog]").count()) === 0);

  // 5. Undo works, including while a dialog is open.
  // 6. While new content streams in, a reader who scrolled up is left where they are.
  // 7. Back and forward buttons, and reloading on any route, land on the same screen.
  // 8. Keyboard: the shortcuts in the tooltips work.

  // ---- dark ----------------------------------------------------------------
  p = await open({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  // ok("the background really is dark in dark mode", await p.evaluate(() => { const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number); return r + g + b < 200; }));

  // ---- phone ---------------------------------------------------------------
  p = await open({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  ok("phone: no horizontal scrolling", await fits(p));
  // await p.getByRole("button", { name: "Open sidebar" }).click(); await p.waitForTimeout(300);
  // await p.mouse.click(370, 400); await p.waitForTimeout(300);
  // ok("phone: tapping the scrim closes the sidebar", !(await p.locator("aside").isVisible()));
  // ok("phone: the dialog stays within the screen", await onScreen(p, "[role=dialog]"));

  ok("no page errors during the whole run", pageErrors.length === 0);
  await browser.close();

  console.log(`\n${engineName}`);
  for (const [what, pass] of results) { total++; if (!pass) failed++; console.log(`  ${pass ? "pass" : "FAIL"}  ${what}`); }
  for (const e of pageErrors) console.log("  page error: " + e.slice(0, 200));
}

await run("Chromium", chromium);
await run("WebKit (Safari engine)", webkit);
console.log(`\n${total} checks, ${failed} failed`);
process.exit(failed ? 1 : 0);
