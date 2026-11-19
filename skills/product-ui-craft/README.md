# product-ui-craft

A skill for coding agents. It gets them to produce interfaces that look mature and have been tested in a real browser, instead of something recognisably machine-generated. It covers web apps, admin dashboards, content sites, landing pages, mobile-first pages and clickable prototypes.

It does not prescribe a style or a tech stack. It prescribes an order of work and a few principles that hold everywhere: settle the structure first, give every visual value a source, use proven implementations for complex controls, look at and click through the result in a real browser before delivery, and report honestly. Everything else is a default that can be adjusted to the scenario and the brand.

## Install

Put the whole directory where your agent reads skills from:

| Tool | Location |
|---|---|
| Claude Code | `~/.claude/skills/product-ui-craft/` (personal), or `.claude/skills/product-ui-craft/` inside a project (shared with the team) |
| Codex | `~/.codex/skills/product-ui-craft/` |
| Other agents | Anywhere it can read, and tell it in the prompt to read `SKILL.md` first |

The audit script needs Node 18 or later and Playwright. Install once and it works from any project:

```bash
cd product-ui-craft/scripts
npm install
npx playwright install chromium webkit
```

The skill is usable without this. The verification step then relies on whatever other browser tools the agent has, or the agent tells you plainly that nothing was verified in a browser.

## Use

Say what you want. The more specific you are, the less the agent has to guess. Some examples:

- "Use product-ui-craft to build an order management dashboard for this project. Keep the existing component library."
- "Use product-ui-craft to redesign the home page. It is for first-time visitors, the brand colour is #1f6feb, and it should be more recognisable than it is now. Show me two directions first."
- "This settings page is misaligned, especially in Safari. Use product-ui-craft to find out why and fix it."
- "Implement the sign-in and sign-up flow from this design, mobile first."

The audit script on its own:

```bash
node scripts/ui-audit.mjs http://localhost:3000 --routes "/,/settings" --open "text=Settings"
node scripts/ui-audit.mjs ./dist/index.html --themes light --views desktop
```

It opens the page in Chromium and WebKit, in light and dark, at desktop and phone widths, reports misalignment, overflow, unreadable text and similar problems, and saves a screenshot of every combination to `ui-audit/`. All options are described in the comment at the top of the script.

## Adapting it

The skill is meant to be edited. Common changes:

- **Your team has a design system:** replace `assets/DESIGN.template.md` with your filled-in spec, and name your component library at the top of `references/stack.md`.
- **A fixed brand direction:** write it at the top of `references/visual-direction.md` so the agent does not choose again every time.
- **Different audit standards:** widths, themes, engines, alignment tolerance and the control-height scale are all script options.
- **A new scenario:** add a section to `references/scenarios.md` in the same format as the others.
- **A new pitfall:** add it to "Known pitfalls" in `references/stack.md` so it is not hit a second time.

## Layout

```
SKILL.md                        workflow and principles; the agent reads this first
references/scenarios.md         what matters in each scenario and the default approach
references/visual-direction.md  how to pick a visual direction
references/anti-slop.md         AI-generated habits and their replacements
references/details.md           details by component
references/stack.md             stack choices, setup, single-file delivery, known pitfalls
assets/DESIGN.template.md       design spec template
assets/check.template.mjs       interaction test template
scripts/ui-audit.mjs            audit script
agents/openai.yaml              display metadata for Codex
```

## Limits

- The audit script measures whether things line up. It cannot judge whether the result looks good. That still takes looking at the screenshots, and in the end your own eyes.
- An emulated phone width is not a real phone.
- It reduces problems. It does not guarantee there are none. The agent's report lists what was not verified, and those are the places worth trying yourself.
