# Stack, project layout and delivery

## Choosing parts

**If the project already has a framework and a component library, use them.** This skill requires no particular stack. It requires one thing: dropdowns, menus, dialogs, popovers and tooltips use a proven implementation, and style values come from one place.

Libraries that can fill that role in each stack (names change, so check the official documentation for the current state before using one):

| Stack | Headless or customisable components | Notes |
|---|---|---|
| React | Radix, Base UI, React Aria. shadcn/ui is styled source code built on top | The default set below uses this |
| Vue | Reka UI, Headless UI. shadcn-vue | |
| Svelte | Bits UI, Melt UI. shadcn-svelte | |
| No framework, no build step | Native `<dialog>`, the `popover` attribute, `<details>` | See the end of this section |
| An enterprise component library already in place (Ant Design, MUI, Element and so on) | Use its components directly | Change variables through its theming mechanism. Do not override styles one component at a time |
| Others (server templates, mini programs, native apps and so on) | The platform's own controls | The workflow and the spec still apply. The audit script only works on pages that open in a browser |

**A default set for starting from nothing with no other constraints** (tested working together on a complete prototype in November 2026. Run `npm view <package> version` for current versions before installing):

| Purpose | Choice | Notes |
|---|---|---|
| Build | Vite + React + TypeScript | Enough for tools and prototypes that do not need server rendering. If routing and a server are needed, use the framework the project chose |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) | Every colour mapped to a CSS variable, see below. Without Tailwind, the same variables work with plain CSS |
| Components | `radix-ui` | Select, menu, dialog, tooltip, switch, tabs |
| Icons | `lucide-react` | One stroke width set globally |
| Motion | CSS animations. `motion` for complex layout animation | |
| Search palette | `cmdk` | When ⌘K is needed |
| Toasts | `sonner` | Undo, and feedback when the result is not visible |
| Class merging | `clsx` + `tailwind-merge` | For merging class names passed into wrapped components |
| Fonts | Self-hosted (for example `@fontsource-variable/*`) | No dependence on an external network. Fall back to system fonts for scripts the font does not cover |

A pre-styled component set such as shadcn/ui gets you started quickly, but everyone has seen its default look. Write `DESIGN.md` first, then change its variables to your scale and direction.

**With no build tool and just one HTML file**, the spec, the scale and the verification all still apply. Use what the browser provides in place of hand-written floating layers: native `<dialog>` for dialogs, the `popover` attribute for menus and popovers, a segmented control or radio group in place of a select that needs a custom look. A native `<select>` used as it is, with no restyling, is fine. The trouble comes from styling over it.

## Setting up the audit script and tests

`scripts/ui-audit.mjs` and the interaction tests both run on Playwright and need Node 18 or later. Install either way:

```bash
# In the project being checked (recommended for Node projects; the interaction tests need it too)
npm i -D playwright && npx playwright install chromium webkit

# Or in the skill directory, once, so the audit script works from any folder and any kind of project
cd <this skill's directory>/scripts && npm install && npx playwright install chromium webkit
```

The script looks for Playwright in the current project first and falls back to the copy in the skill directory. If WebKit cannot be downloaded, run with `--engines chromium` for now and say in the report that only one engine was tested.

The page being checked can be a local file or any reachable URL, whatever language it is written in. If the theme does not follow the system setting but is switched by the page's own toggle or a URL parameter, put the parameter in `--routes` (for example `"?theme=dark"`), or use `--open` to click the toggle first.

Where there is no Node, use whatever browser tool is available (a browser MCP server, a screenshot tool) to open the page, click and capture, and check by hand against `details.md`.

## Project layout

Using the default set as the example. Other stacks divide things the same way: the spec in one place, the variables in one place, the base controls in one place.

```
DESIGN.md            the design spec, written before the interface
src/index.css        colour variables (light and dark), scales, motion utilities
src/ui.tsx           every base control wrapped once: button, icon button, select, menu, dialog, switch, tooltip
src/…                pages and feature components, which use only the controls from ui.tsx
tests/check.mjs      interaction tests (adapted from assets/check.template.mjs)
```

Put a single command in `package.json`, for example `"check": "npm run build && node tests/check.mjs"`, and run it after every change.

## Writing the style variables (Tailwind 4)

Define colours as semantic variables, one set for light and one for dark, then map them to Tailwind colour names. Components write names such as `bg-subtle`, `text-fg2` and `border-line`. No colour values appear in them, and there is no need for `dark:` everywhere.

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  --bg: #ffffff;  --bg-subtle: #f9f9f9;  --bg-muted: #f3f3f3;  --bg-float: #ffffff;
  --hover: rgb(0 0 0 / 0.045);  --active: rgb(0 0 0 / 0.08);
  --fg: #0d0d0d;  --fg-2: #5d5d5d;  --fg-3: #8f8f8f;  --fg-4: #c4c4c4;
  --line: rgb(0 0 0 / 0.08);  --line-2: rgb(0 0 0 / 0.15);
  --shadow-float: 0 0 0 1px rgb(0 0 0 / 0.06), 0 4px 12px rgb(0 0 0 / 0.06), 0 16px 40px -8px rgb(0 0 0 / 0.16);
  color-scheme: light;
}
[data-theme="dark"] {
  --bg: #212121;  --bg-subtle: #171717;  --bg-muted: #2c2c2c;  --bg-float: #2a2a2a;
  --hover: rgb(255 255 255 / 0.06);  --active: rgb(255 255 255 / 0.1);
  --fg: #ececec;  --fg-2: #b4b4b4;  --fg-3: #8a8a8a;  --fg-4: #5a5a5a;
  --line: rgb(255 255 255 / 0.09);  --line-2: rgb(255 255 255 / 0.18);
  --shadow-float: 0 0 0 1px rgb(255 255 255 / 0.09), 0 16px 48px rgb(0 0 0 / 0.5);
  color-scheme: dark;
}
@theme inline {
  --color-bg: var(--bg);  --color-subtle: var(--bg-subtle);  --color-fg: var(--fg);  --color-fg2: var(--fg-2);
  --color-line: var(--line);  /* and so on for the rest */
  --shadow-float: var(--shadow-float);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}

@layer base {
  :focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
  svg.lucide { stroke-width: 1.75; }
}

/* Enter and exit for floating layers: keyed on the component library's data-state, exit faster than enter */
@keyframes pop-in { from { opacity: 0; transform: scale(0.96); } }
@keyframes pop-out { to { opacity: 0; transform: scale(0.97); } }
@utility pop {
  &[data-state="open"] { animation: pop-in 160ms var(--ease-out-quint); }
  &[data-state="closed"] { animation: pop-out 110ms ease-in; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
```

The theme is set on `<html data-theme="…">`. For "follow the system", a script reads the system setting and writes the same attribute, so the styles have a single path. To make screenshots easier, the page can accept a URL parameter such as `?theme=dark` for its initial state.

## Managing state

Prototypes and small tools do not need a state library. A module-level object, a `mutate(fn)` that notifies subscribers after a change, and components subscribing through `useSyncExternalStore` are enough. The library matters less than two things:

- Interface state such as drafts, scroll position and expanded sections lives somewhere that is not rebuilt when something else updates.
- List items have stable `key`s. When a `key` changes, the component is destroyed and recreated, the draft is lost and the animation replays.

Do not rewrite the page in bulk with `innerHTML`.

## Delivering one file that opens on double-click

Prototypes are often sent to someone to open directly. How:

1. Use `vite-plugin-singlefile` to inline scripts, styles and fonts into one HTML file.
2. Put Vite's source entry inside `src/` (`root: "src"` in the config, output to `../dist`). **Leave no `index.html` in the project root.** That file is the source entry. Double-clicking it shows a blank page, and it is the first file the user sees and the first one they click.
3. After the build, copy the result to a clearly named file in the project root (such as `preview.html`), and remove the `crossorigin` attribute from the inline script tag (under `file://` it can stop the script from running).
4. Double-click it yourself once, and point the test script at the same file.

```ts
// vite.config.ts
export default defineConfig({
  root: "src",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: "../dist", emptyOutDir: true, assetsInlineLimit: 100_000_000 },
});
```

```js
// scripts/postbuild.mjs
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8")
  .replace('<script type="module" crossorigin>', '<script type="module">');
writeFileSync(new URL("../preview.html", import.meta.url), html);
```

## Known pitfalls

All of these were actually hit. The fix is in brackets.

**Controls**

- A native `<select>` with custom styling has a different height and text position in Chrome and Safari (replace it with the component library's select).
- A Radix dialog moves focus to the first focusable element when it opens, so the first button appears with a focus ring (prevent the default in `onOpenAutoFocus` and focus the first input, or the dialog content itself).
- While a modal dialog is open, sonner toasts receive no clicks and Undo cannot be pressed (give `[data-sonner-toaster]` `pointer-events: auto`, and in the dialog's `onInteractOutside` prevent the default for clicks coming from the toaster, otherwise clicking the toast closes the dialog).
- A dialog needs a title for screen readers even when the design shows none (use a visually hidden title. Do not leave it out).
- In Tailwind 4, `-translate-x-1/2` uses the `translate` property, not `transform`, so a centred dialog can use `transform: scale()` for its entrance animation at the same time without conflict. In older versions the two overwrite each other.

**Updates and motion**

- Redrawing the whole page clears drafts, resets scroll and focus, and replays animations (update only the part that changed).
- A row of hover-only action buttons that takes up layout height makes the spacing between items uneven (position it absolutely in the gap).
- A spring used for an exit animation trails a 1px remnant for most of a second (use a fixed duration for exits, such as 240ms with an ease-out curve).
- Several asynchronous replies written to the same place at once interleave (queue them per object and finish one before starting the next).

**Testing and screenshots**

- Headless Chrome has a minimum window width (about 500px). Setting the window itself to 390 wide gives a cropped screenshot (use Playwright's `viewport`, or device metrics emulation).
- The command-line flag for forcing dark mode does not always take effect (use Playwright's `colorScheme`, or the page's own `?theme=` parameter).
- Changing only the part of the URL after `#` does not reload the page, so a dialog opened in the previous step is still there (go to a blank page and back when a clean state is needed).
- The Vite dev server may listen only on `localhost` and not answer on `127.0.0.1` (use `localhost`, or start it with `--host`).
- A failing test is not always the product's fault. Check that the expected count, the selector and the viewport height are right before changing the product.
- Testing in Chromium alone is not enough. WebKit differs in font metrics, form controls, scrolling and `backdrop-filter`.
