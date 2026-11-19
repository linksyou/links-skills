---
name: product-ui-craft
description: "Design and build interfaces that look mature and have been tested in a real browser: web apps and tools, admin and data dashboards, content sites, landing pages, mobile-first pages, clickable prototypes. Use when the user wants an interface built, redesigned or polished, or says a UI looks AI-generated, immature, ugly, misaligned or buggy. Gives a workflow that scales with the task and adapts to the scenario: settle the structure, pick a visual direction and write it down, use proven components, cover every state, then verify in real browsers before handing over. Not needed for a one- or two-line style tweak."
---

# Product UI Craft

When an interface looks immature, the colour palette is rarely the reason. It is usually one of four things:

1. **The structure was never thought through.** The page mirrors what is in the database, and the person has to piece the picture together across several screens. New wording and new colours do not fix that.
2. **The values have no source.** Three corner radii on one page, five greys, buttons of different heights. Each value is fine alone; together they read as rough.
3. **The parts are hand-rolled.** A hand-written dropdown, dialog or popover looks right in one browser and is misaligned in the next.
4. **Nobody looked at it or clicked through it.** It was delivered after reading the code or glancing at one static screenshot, and the user found the problems.

This skill exists to deal with those four.

## How to use this skill

What follows is a way of working plus a set of defaults. It is not a template.

- **The user's requirements, the brand, and any design system already in the project take priority over every default here.** The specific numbers, styles and libraries in these files are starting points for when nobody has decided yet.
- The short list under "What does not change" holds in every scenario. Everything else is adjusted to the scenario. If a step makes no sense for the task at hand, skip it and say so in the report.
- Scale the effort to the task:

| Task | What to do |
|---|---|
| A small change in one place | Follow the existing conventions, make the change, look at it in a browser |
| One page or one component | Read the existing spec (write a short one if there is none), build, run the audit, look at the screenshots |
| A whole product or a redesign | Go through the full workflow below |
| Exploring a direction | Show two or three clearly different directions first, then build the chosen one to the full standard |

## What does not change

1. **Find out who it is for and what they come to do before building anything.** If the structure is wrong, no amount of detail work saves it.
2. **Every visual value has a source.** The style can be quiet or loud, but colours, sizes, radii and spacing all come from a written scale. Scales give consistency, and consistency is most of what people mean by "mature".
3. **Controls that float or have keyboard behaviour use a proven implementation.** This is where misalignment and interaction bugs concentrate. Rewriting them is not worth it.
4. **Before delivery, the interface has been seen and clicked in a real browser.** If that was not possible, say so plainly. Reading the code is not a substitute.
5. **Report honestly.** What was verified, what was not, and where it is known to fall short.

## First, work out what kind of job this is

Different interfaces are good in different ways. Identify the scenario, then read the matching section of `references/scenarios.md`:

| Scenario | What matters most |
|---|---|
| Tools and apps (opened daily, used for long stretches) | One main surface, restraint, state that is never lost, keyboard support |
| Admin and data dashboards | Solid tables and filters, high density, aligned numbers |
| Content and reading (docs, blogs, knowledge bases) | Typography, line length, hierarchy, navigation |
| Landing and marketing pages | One idea per screen, a recognisable visual direction, real content |
| Mobile-first | Thumb reach, large touch targets, keyboard and safe areas |
| Forms and multi-step flows | Input is never lost, errors are clear, going back works |
| Prototypes and demos | The main flows are clickable, data looks real, the report says what is faked |
| Adding to an existing design system | Read before building, introduce no new values |
| The user supplied a design or a reference | Follow it, and flag every deviation |

A project often belongs to several at once, for example a mobile-first tool. Read each relevant section.

## Workflow

### 1. Settle the structure

Write down three sentences: who uses it; the one thing they come here to do most often; what they should see first when they open it. If you cannot write them, read the requirements again or ask the user. These three sentences matter more than any visual decision.

- Arrange the main surface around the most frequent task. Everything else appears on demand (a side panel, a dialog, search, a second-level page).
- For every element, ask: **what happens if the person never looks at this?** If nothing, leave it out. The goal is fewer things to look at, not the same number of things arranged neatly.
- Put anything that needs a decision or an action where the person is already looking.
- **Use the user's words**, not internal jargon, table names or terms from the design document.
- Find two or three of the most mature products in the same category and learn from their structure and information density. Learn the structure only. Do not copy the look of a specific product.

Which structure fits depends on the scenario: a tool suits a single main surface, a data dashboard suits navigation plus tables, a landing page is one narrative from top to bottom. Do not force one structure onto every product.

### 2. Pick a visual direction and write the spec

If the project already has a design system or a `DESIGN.md`, read it and follow it. Otherwise:

1. **Pick a direction.** The brand, the audience and how long people spend in the product decide whether it should be restrained or expressive. `references/visual-direction.md` lists the dimensions you can adjust and how to choose. If the user has a clear preference, follow it. If not, choose one and tell the user in a sentence or two what you chose and why.
2. **Write the spec.** Copy `assets/DESIGN.template.md` into the project as `DESIGN.md` and fill it in: colour variables, control heights, radii, spacing, type sizes, motion. The numbers in the template are examples. Change them to fit the direction.

The spec gives every later decision a source. If you want a value that is not on the scale while building, change the spec first, or do without it.

### 3. Choose the parts

If the project has a component library, use it. If not, use a proven headless component library from the project's stack for dropdowns, menus, dialogs, popovers, tooltips, switches and tabs, and take all icons from one set. `references/stack.md` covers the options per stack, what to do without a build tool, and known pitfalls.

Wrap these parts once, in one place, so that sizes and styles come from there and pages stop defining their own buttons. A native `<select>` with custom styling on top is the most common source of misaligned form rows. If its appearance needs customising, replace it with the library's select.

### 4. Build

- **Cover every state of each screen**: empty, loading, error, very long content, very many items. Fill it with realistic content, with names of different lengths.
- **Cover every state of each control**: default, hover, pressed, keyboard focus, disabled, in progress.
- **A change in one place updates only that place.** When something else updates, unsent input, scroll position, focus and expanded sections all stay as they were, and content already on screen does not replay its entrance animation.
- Actions that can be undone run immediately and offer Undo. Actions that cannot be undone ask first.
- Build the screen widths and themes you need to support from the start.

`references/details.md` is a checklist of details by component. Use the parts that apply.

### 5. Verify in a real browser

Use whatever tools are available. Go as deep as you can, and say in the report how deep you went.

1. **The audit script** (needs Node). It opens the page in different engines, themes and widths and reports page errors, blank pages, horizontal overflow, controls on one line that do not line up, a jumble of control heights, clipped or faint text, unnamed controls, missing focus rings and small touch targets. It saves a screenshot of every combination:
   ```bash
   node <this skill's directory>/scripts/ui-audit.mjs <url-or-file> --routes "/,/settings" --open "text=Settings"
   ```
   `--open` clicks something before checking, so that dialogs and menus get audited too. Misalignment hides there most often. Use `--themes light` or `--views desktop` if there is no dark mode or no phone layout. All options are listed at the top of the script. First-time setup is in `references/stack.md`.
2. **Interaction tests.** Drive the main flows with real clicks and check the result after each step. `assets/check.template.mjs` is a starting point. If the project has its own end-to-end tests, add to those. Run in at least Chromium and WebKit. Many alignment problems show up in only one of them.
3. **Look at every screenshot.** The script can measure whether things line up. It cannot tell whether the result looks good. Check the rhythm of the spacing, whether the hierarchy is clear, whether anything is unnecessary. Look at every dialog and menu in its open state.
4. Fix what you find and run again. Everything the script reports as an `ISSUE` should be gone. Judge each `NOTE` individually, and mention in the report any that are intentional.

Without Node but with a browser tool (a browser MCP server, a screenshot tool), use that to open the page, click and capture, and check by hand against `references/details.md`. With no browser at all, state "not verified in a browser" at delivery and list the few places the user should look at first.

When a test fails, find out whether the product is wrong or the test's expectation is wrong before deciding which to change.

### 6. Deliver and report

- Give **one clear way to open it**: a command, a URL, or a file to double-click. Then open it that way yourself once.
- The report covers four things: what was built and which direction was chosen; what was verified (which browsers, how many checks, the results); **what was not verified** (real devices, other browsers, drag-and-drop upload and so on); known shortcomings.
- Do not call something fixed unless it was verified, and do not use words like "perfect". The user will open it and look.

## About the "AI-generated" look

The AI-generated look is not one colour or one effect. It is a set of unchosen defaults all showing up together: a purple-to-blue gradient, a shadowed card around everything, emoji as icons, coloured badges everywhere, everything fading in one after another, "Welcome back!". The way out is not to swap in another fixed style. It is to make each choice for this product, with a reason you can state.

`references/anti-slop.md` lists the common habits, why each looks cheap, and what to use instead when there is no particular reason. Read it when settling the visuals, and go through it again against the screenshots before delivery.

## When the user is not satisfied

How the user phrases the complaint tells you which layer the problem is in:

| The user says | Usually means | What to do |
|---|---|---|
| "This is no different from the last version", "nobody would use this" | The structure did not change, only the skin | Go back to step 1 and redo the structure |
| "The style is wrong", "not the feel I wanted" | The direction was never agreed | Go back to step 2. Ask for one or two references they like, or show two or three clearly different directions |
| "It's misaligned", "it's not refined" | Hand-rolled controls, or testing in one browser only | Ask for a screenshot and the browser name. Reproduce it in that engine and measure it, then fix |
| "There are bugs", "it feels broken" | Nobody clicked through it | Write a failing check that reproduces it, fix it, run the full suite |
| "Polish it more", "not good-looking enough" | Details and rhythm | Go through the screenshots against `details.md` and `anti-slop.md`. Polishing is mostly removing things and tightening the scale, not adding decoration |
| "It opens blank" | The delivery is broken | Open it the way the user does. See the delivery section of `stack.md` |

Say which judgment in the previous version was wrong. Do not defend the previous version. If the same kind of problem is pointed out twice, the approach is wrong, so change the approach instead of patching one more spot.

## Files

- `references/scenarios.md`: what matters, the default approach and what to verify for each scenario. Read the relevant section at the start.
- `references/visual-direction.md`: how to pick a visual direction, which dimensions can move, and what holds in any direction.
- `references/anti-slop.md`: the table of AI-generated habits and their replacements.
- `references/details.md`: interaction and visual details by component.
- `references/stack.md`: component options per stack, how to write the style variables, audit script setup, single-file delivery, known pitfalls.
- `assets/DESIGN.template.md`: the design spec template.
- `assets/check.template.mjs`: a starting point for interaction tests, with alignment helpers.
- `scripts/ui-audit.mjs`: the audit script.
