# [Product name] interface design spec

Read this page before writing any interface. If you want a value that is not here while building, come back and change this page first.

[How to use: replace everything in square brackets. The values in the tables are examples. Change them to fit the direction you chose. Delete any section you do not need. For example, with no dark mode, delete that column.]

## The product

- **Who uses it:** [one sentence]
- **The one thing they come here to do most often:** [one sentence]
- **What they should see first when they open it:** [one sentence]
- **Scenario:** [tool / data dashboard / content / landing page / mobile-first / form flow / prototype; more than one is fine]
- **References:** [two or three of the most mature products in the same category, and what to learn from each]

## Direction

[One or two sentences: which direction was chosen and why. For example: "An admin panel that operations staff use all day, so high density, neutral colours and almost no motion. The accent is the blue from the logo."]

- **This product's signature:** [one or two choices carried all the way through, such as a heading typeface, a colour, a layout device]
- **Density:** [compact / medium / spacious]
- **Amount of colour:** [almost all neutral / a little accent / brand colour across large areas]
- **How depth is shown:** [surface tints and hairlines / shadows]

## Wording

- Use: [the nouns and verbs that will appear in the interface]
- Do not use: [internal jargon, table names, terms from the design document]
- Tone: [for example: direct, no exclamation marks, buttons are a verb plus its object]

## Colour

Every colour is defined as a variable in `[style variables file]`. Components contain no colour values.

| Purpose | Variable | Light | Dark [delete this column if not needed] |
|---|---|---|---|
| Page background | `--bg` | [#ffffff] | [#1f1f1f] |
| Secondary surface (sidebar, sections) | `--bg-subtle` | [#f9f9f9] | [#171717] |
| Floating surface | `--bg-float` | [#ffffff] | [#2a2a2a] |
| Primary text | `--fg` | [#0d0d0d] | [#ececec] |
| Secondary text | `--fg-2` | [#5d5d5d] | [#b4b4b4] |
| Divider | `--line` | [black 8%] | [white 9%] |
| Accent | `--accent` | [ ] | [ ] |
| Status: success / in progress / attention / error | `--ok` `--info` `--warn` `--bad` | [ ] | [ ] |

- The accent appears on: [primary buttons / links / focus ring / logo / large background areas… depending on the direction]
- When colour conveys status, there is also text or an icon. Never colour alone.
- Shadows are used on: [floating layers only / cards too… depending on the direction, and the same across the product]

## Sizes

| Item | Values |
|---|---|
| Control height | [28 / 32 / 36 / 40]. Controls on one line share a height and are vertically centred |
| Corner radius | [6 / 8 / 12]; buttons [ ]; when nested, outer radius = inner radius + padding |
| Spacing | Multiples of [4] |
| Type size | Interface [12 / 13 / 14], body [15 or 16], headings [20 / 28] |
| Line length | Text column at most [720] wide |
| Typefaces | Interface [ ]; headings [ ]; monospace [ ] for code and paths only |
| Icons | [icon set], stroke width [1.75], size [16 or 18] |
| Supported widths | [desktop from 1280 / phone from 360 / …] |

## Controls

- Selects, menus, dialogs, switches and tooltips come from [component library], wrapped in `[file]`. Pages do not set the size or style of these controls directly.
- One primary button per group of actions.
- Every icon-only button has a tooltip, including the shortcut where there is one.
- Actions that can be undone run immediately and offer Undo. Actions that cannot be undone ask first.

## Motion

- Intensity: [almost none / only on state changes / choreographed]
- Animations on frequent interactions are shorter than [250]ms. Exits are faster than entrances.
- Floating layers enter from [scale(0.96) with a fade], originating at the trigger.
- Content already on screen does not replay its animation when something else updates.
- The system's reduced-motion setting is respected.

## Before delivery

- Looked at in [Chromium, WebKit] at [the supported widths and themes], including every dialog and menu in its open state.
- The main actions were actually clicked through.
- Controls on one line have centre lines within 1px of each other.
- Opened once yourself in the way the delivery notes describe.
