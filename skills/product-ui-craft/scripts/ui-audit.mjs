#!/usr/bin/env node
// Opens a page in Chromium and WebKit, at desktop and phone widths, light and dark,
// and reports what a careful reviewer would catch by eye: page errors, blank pages,
// horizontal overflow, controls on one line that do not line up, off-scale control
// heights, clipped text, unreadable contrast, unnamed buttons, native <select>,
// invisible keyboard focus and small touch targets.
// It saves a screenshot of every combination so you can look at them yourself.
//
// It needs playwright. Either the project you run it from has it, or install it once
// next to this script so it works from any folder, including non-Node projects:
//   cd <skill>/scripts && npm install && npx playwright install chromium webkit
//
//   node <skill>/scripts/ui-audit.mjs <url-or-file> [options]
//
// Options (all optional)
//   --routes "/,/settings"       pages to visit, appended to the url ("#home" style works too)
//   --open "text=Settings"       click this before checking, to reach a dialog or menu.
//                                Repeat the flag for several. "A => B" clicks A, then B
//   --views desktop,phone        which widths to check                  (default: both)
//   --desktop 1440x900           desktop size       --phone 390x844     phone size
//   --themes light,dark          which colour schemes to check          (default: both)
//                                Use "light" if the product has no dark mode
//   --engines chromium,webkit    browser engines; firefox also works    (default: chromium,webkit)
//   --heights 28,32,36,40        the control heights your DESIGN.md allows. Without it the
//                                script only warns when a screen mixes many different heights
//   --tolerance 1                how many px two centre lines may differ (default 1)
//   --out ui-audit               where screenshots and report.json go
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve } from "node:path";

const usage = 'Usage: node ui-audit.mjs <url-or-file> [--routes "/,/settings"] [--open "selector"]... [--views desktop,phone] [--themes light,dark] [--engines chromium,webkit] [--heights 28,32,36,40] [--tolerance 1] [--out dir]';
const opt = { routes: "", out: "ui-audit", heights: "", open: [], views: "desktop,phone", themes: "light,dark", engines: "chromium,webkit", desktop: "1440x900", phone: "390x844", tolerance: "1" };
let target, chromiumOnly = false;
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === "--chromium-only") chromiumOnly = true;
  else if (a === "--open") opt.open.push(process.argv[++i]);
  else if (a.startsWith("--") && a.slice(2) in opt) opt[a.slice(2)] = process.argv[++i];
  else if (a.startsWith("--")) { console.error("Unknown option " + a + "\n" + usage); process.exit(2); }
  else target = a;
}
if (!target) { console.error(usage); process.exit(2); }
const base = /^(https?|file):/.test(target) ? target : pathToFileURL(resolve(target)).href;
const routes = opt.routes.split(",").map((s) => s.trim());
const heights = opt.heights ? opt.heights.split(",").map(Number) : null;
const tol = Number(opt.tolerance);
const list = (v) => v.split(",").map((x) => x.trim()).filter(Boolean);
const out = resolve(opt.out);
mkdirSync(out, { recursive: true });

// playwright from the current project if it has one, otherwise from next to this script.
let pw;
for (const from of [pathToFileURL(process.cwd() + "/").href, import.meta.url]) { try { pw = createRequire(from)("playwright"); break; } catch {} }
if (!pw) {
  console.error("playwright was not found. Install it either way:\n  in the current project:  npm i -D playwright && npx playwright install chromium webkit\n  or next to this script (once, then it works from any folder):  cd " + fileURLToPath(new URL(".", import.meta.url)) + " && npm install && npx playwright install chromium webkit");
  process.exit(2);
}

// Runs inside the page and returns plain strings.
function audit({ heights, phone, tol }) {
  const errors = [], warnings = [];
  const rect = (e) => e.getBoundingClientRect();
  const vis = (e) => { const r = rect(e), s = getComputedStyle(e); return r.width > 1 && r.height > 1 /* skips screen-reader-only text */ && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const name = (e) => (e.getAttribute("aria-label") || e.innerText || e.getAttribute("placeholder") || e.getAttribute("title") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 24);
  const mid = (r) => r.top + r.height / 2;
  // When a dialog is open, only what is inside it can be seen and used.
  const scope = [...document.querySelectorAll('[role=dialog], [role=alertdialog], dialog[open]')].filter(vis).pop() || document.body;
  const all = [...scope.querySelectorAll("*")].filter(vis);
  const controls = all.filter((e) => e.matches("button, a[href], input:not([type=hidden]):not([type=file]), select, textarea, [role=button], [role=switch], [role=combobox], [role=tab], [role=menuitem], [role=option]"));
  const small = controls.filter((c) => rect(c).height <= 56 && !c.matches("textarea"));

  // 1. horizontal overflow
  if (document.documentElement.scrollWidth > innerWidth + 1) {
    const wide = [...document.querySelectorAll("body *")].filter((e) => rect(e).width > 0 && rect(e).right > innerWidth + 1).slice(0, 3).map(name);
    errors.push(`The page scrolls horizontally (content ${document.documentElement.scrollWidth}px wide, viewport ${innerWidth}px). Overflowing: ${wide.map((w) => `"${w}"`).join(", ") || "not located"}`);
  }

  // 2. things on one line that do not line up
  const rowOf = (e) => { for (let p = e.parentElement, i = 0; p && i < 3; p = p.parentElement, i++) { const d = getComputedStyle(p).display; if (d.includes("flex") || d.includes("grid")) return p; } return e.parentElement; };
  const sameLine = (ra, rb) => Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top) >= Math.min(ra.height, rb.height) * 0.5 && (ra.right <= rb.left + 1 || rb.right <= ra.left + 1);
  const rows = new Map();
  for (const c of small) { const row = rowOf(c); (rows.get(row) || rows.set(row, []).get(row)).push(c); }
  for (const [row, list] of rows) {
    // control next to control
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j]; if (a.contains(b) || b.contains(a)) continue;
      const ra = rect(a), rb = rect(b); if (!sameLine(ra, rb)) continue;
      const d = Math.abs(mid(ra) - mid(rb));
      if (d > tol) errors.push(`Two controls on one line are not aligned: the centre lines of "${name(a)}" and "${name(b)}" are ${d.toFixed(1)}px apart`);
    }
    // control next to a one-line label
    for (const c of list) for (const sib of row.children) {
      if (sib === c || sib.contains(c) || c.contains(sib) || !vis(sib) || controls.includes(sib) || sib.querySelector("button, input, select, textarea, [role]")) continue;
      const s = getComputedStyle(sib), rs = rect(sib), rc = rect(c), lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5;
      if (!sib.innerText?.trim() || sib.children.length > 1 || rs.height > lh * 1.6 || !sameLine(rs, rc)) continue;
      const d = Math.abs(mid(rs) - mid(rc));
      if (d > tol + 0.5) errors.push(`A control is not aligned with the text beside it: the centre lines of "${name(c)}" and "${name(sib)}" are ${d.toFixed(1)}px apart`);
    }
  }

  // 3. control heights: outside the given scale, or (with no scale given) simply too many of them
  const seen = new Map();
  for (const c of small) {
    if (c.matches("a[href], [role=switch], [role=option], [role=menuitem], [role=tab], input[type=checkbox], input[type=radio], input[type=range]")) continue;
    const h = Math.round(rect(c).height); (seen.get(h) || seen.set(h, []).get(h)).push(name(c));
  }
  if (heights) { for (const [h, names] of seen) if (!heights.includes(h)) warnings.push(`Control height ${h} is not on the scale (${heights.join(" / ")}): ${[...new Set(names)].slice(0, 3).map((n) => `"${n}"`).join(", ")}`); }
  else if (seen.size > 4) warnings.push(`Buttons and inputs on this screen come in ${seen.size} different heights (${[...seen.keys()].sort((x, y) => x - y).join(" / ")}). A mature interface usually has three or four. Settle on a scale`);

  // 4. text: clipped, too small, too faint
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = (color) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = color; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));
  const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const backdrop = (e) => { const layers = []; for (let p = e; p; p = p.parentElement) { const s = getComputedStyle(p); if (s.backgroundImage !== "none") return null; const c = rgba(s.backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 0.99) break; } let bg = [255, 255, 255]; for (const c of layers.reverse()) bg = over(c, bg); return bg; };
  for (const e of all) {
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const s = getComputedStyle(e);
    if (e.scrollWidth > e.clientWidth + 1 && s.overflowX === "hidden" && s.textOverflow !== "ellipsis" && s.whiteSpace.includes("nowrap")) warnings.push(`Text is cut off with no ellipsis: "${name(e)}"`);
    if (parseFloat(s.fontSize) < 11) warnings.push(`Text smaller than 11px (${s.fontSize}): "${name(e)}"`);
    if (e.closest("[disabled], [aria-disabled=true], [data-disabled]")) continue;
    const bg = backdrop(e); if (!bg) continue;
    const fg = over(rgba(s.color), bg), a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 3) warnings.push(`Text is too faint to read (contrast ${ratio.toFixed(1)}; body text needs at least 4.5): "${name(e)}"`);
  }

  // 5. controls nobody can name
  for (const c of controls) if (!(c.getAttribute("aria-label") || c.innerText?.trim() || c.value || c.getAttribute("title") || c.getAttribute("placeholder") || c.getAttribute("aria-labelledby") || (c.id && document.querySelector(`label[for="${c.id}"]`)) || c.closest("label") || c.querySelector("img[alt]:not([alt=''])"))) errors.push(`A control has no name (nothing for a tooltip or a screen reader to say): ${c.outerHTML.replace(/\s+/g, " ").slice(0, 70)}`);

  // 6. native select
  const sel = controls.filter((c) => c.matches("select"));
  if (sel.length) warnings.push(`${sel.length} native <select> in use. If it has custom styling, its height, arrow and alignment will differ between browsers, so replace it with the component library's select. If it is unstyled, ignore this`);

  // 7. small touch targets
  if (phone) for (const c of small) { const r = rect(c); if (Math.min(r.width, r.height) < 28 && !c.matches("a[href]")) warnings.push(`Small touch target on a phone (${Math.round(r.width)}×${Math.round(r.height)}): "${name(c)}"`); }

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)].slice(0, 14) };
}

// Tab into the page and see whether anything changes on the focused control.
async function focusCheck(page) {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab"); await page.waitForTimeout(260);
    const res = await page.evaluate(async () => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      // The ring is often drawn on a wrapper (focus-within), so look two levels up as well.
      const snap = () => [e, e.parentElement, e.parentElement?.parentElement].filter(Boolean).map((n) => { const s = getComputedStyle(n); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine].join("|"); }).join("||");
      const on = snap(); e.blur(); await new Promise((r) => setTimeout(r, 300)); const off = snap(); e.focus();
      return { same: on === off, label: (e.getAttribute("aria-label") || e.innerText || e.getAttribute("placeholder") || e.tagName).trim().slice(0, 24) };
    });
    if (res && res.same) return `Tabbing to "${res.label}" shows no visible focus (no focus ring)`;
  }
  return null;
}

const engineNames = { chromium: "Chromium", webkit: "WebKit (Safari engine)", firefox: "Firefox" };
const engines = (chromiumOnly ? ["chromium"] : list(opt.engines)).map((e) => { if (!engineNames[e]) { console.error("Unknown engine " + e + ". Choose from chromium, webkit, firefox"); process.exit(2); } return [e, engineNames[e]]; });
const size = (v) => { const [width, height] = v.split("x").map(Number); return { width, height }; };
const views = [];
for (const v of list(opt.views)) for (const t of list(opt.themes)) {
  const phone = v === "phone";
  views.push([`${v}-${t}`, `${phone ? "phone" : "desktop"} ${t === "dark" ? "dark" : "light"}`, { viewport: size(phone ? opt.phone : opt.desktop), colorScheme: t, ...(phone ? { deviceScaleFactor: 2, hasTouch: true } : {}) }, phone]);
}
if (!views.length) { console.error("Nothing to check. Look at --views and --themes\n" + usage); process.exit(2); }
const slug = (s) => s.replace(/[^\w一-龥-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
const report = []; let errorCount = 0, warnCount = 0;

for (const [eng, engName] of engines) {
  let browser;
  try { browser = await pw[eng].launch(); } catch { console.error(`${engName} failed to start, most likely because the browser has not been downloaded. Run: npx playwright install ${eng} (or leave this engine out with --engines for now)`); process.exit(2); }
  for (const [key, viewName, ctxOpts, phone] of views) {
    const ctx = await browser.newContext(ctxOpts), page = await ctx.newPage(), pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    page.on("console", (m) => m.type() === "error" && pageErrors.push(m.text()));
    for (const route of routes) for (const open of [null, ...opt.open]) {
      const res = { errors: [], warnings: [] };
      // A hash-only change does not reload, so start each screen from a clean page.
      await page.goto("about:blank"); await page.goto(route.startsWith("/") ? base.replace(/\/$/, "") + route : base + route); await page.waitForTimeout(700);
      if (open) for (const step of open.split("=>").map((s) => s.trim())) {
        const click = () => page.locator(step).first().click({ timeout: 4000 });
        try { await click().catch(() => page.waitForTimeout(1500).then(click)); await page.waitForTimeout(500); }  // one retry: a slow first paint is not a finding
        catch { res.warnings.push(`Could not click "${step}", so this screen did not open as intended (it may be collapsed at this width)`); break; }
      }
      const blank = await page.evaluate(() => document.body.innerText.trim().length === 0 && document.querySelectorAll("img,svg,canvas").length === 0);
      const found = await page.evaluate(audit, { heights, phone, tol });
      res.errors.push(...found.errors); res.warnings.push(...found.warnings);
      if (blank) res.errors.unshift("The page is blank");
      for (const e of pageErrors.splice(0)) res.errors.unshift("Page error: " + e.slice(0, 160));
      const file = [eng, key, slug(route), open && slug(open)].filter(Boolean).join("-") + ".png";
      await page.screenshot({ path: resolve(out, file) });
      if (!open && !phone) { const f = await focusCheck(page); if (f) res.warnings.push(f); }
      report.push({ engine: eng, view: key, route, open, screenshot: file, ...res });
      errorCount += res.errors.length; warnCount += res.warnings.length;
      if (res.errors.length || res.warnings.length) {
        console.log(`\n${engName} · ${viewName}${route ? " · " + route : ""}${open ? " · after clicking " + open : ""}`);
        for (const e of res.errors) console.log("  ISSUE  " + e);
        for (const w of res.warnings) console.log("  NOTE   " + w);
      }
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(resolve(out, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n${report.length} screens checked: ${errorCount} issues, ${warnCount} notes. Screenshots and report.json are in ${out}`);
console.log("This covers only what a machine can measure. Now open each screenshot and look: the rhythm of the spacing, the hierarchy, anything that does not need to be there.");
process.exit(errorCount ? 1 : 0);
