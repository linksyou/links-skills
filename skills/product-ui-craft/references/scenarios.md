# Adjusting to the scenario

Each section covers four things: what people are doing in this kind of interface, the default structure, what usually goes wrong, and what to verify specifically. These are starting points, not rules. The user's requirements and the facts of the product come first. When a project belongs to several scenarios, read each relevant section.

## Tools and apps

Things opened every day and used for long stretches: collaboration tools, editors, clients, assistant-style products.

- **What people are doing:** the same one or two things, over and over. The interface should step back so the content and the actions are in front.
- **Structure:** one main surface built around the most frequent task. Secondary things appear on demand (a side panel, a settings dialog, a search palette). Few navigation items, and they stay put.
- **Visuals:** lean restrained. The longer people look at an interface, the better it wears with less colour and less motion. Medium to high density.
- **What goes wrong:** it becomes a multi-page admin panel; the home screen shows numbers nobody acts on; a draft or the scroll position is lost whenever something else updates; it only works with a mouse.
- **Verify specifically:** click each main flow from start to finish; trigger an update elsewhere while half-way through typing, and confirm the input survives; go through it with the keyboard only; while content keeps arriving, the reading position is not pulled away.

## Admin and data dashboards

Management, operations and analytics interfaces. Here navigation plus tables is the right structure. There is no need to avoid it.

- **What people are doing:** finding particular records, comparing numbers, spotting anomalies, handling things in bulk.
- **Structure:** stable navigation; one main table or chart area per page; filters and search above the table; details in a side panel or a second-level page. Filters live in the URL so they survive a reload and can be shared.
- **Tables:** numbers right-aligned in tabular figures; text left-aligned; a header that stays visible while scrolling; stable column widths that do not jump with the content; one row height; long content truncated with a way to see all of it; sorting, pagination, no results and loading all built; row actions at the end of the row or in a menu; a bulk action bar that appears after selecting rows.
- **Charts and figures:** show only what someone will act on. Colour distinguishes data. It does not decorate. If there are stat cards, each one should lead to the detail behind it.
- **Visuals:** dense, little decoration. Status is a small dot plus text. Colour is reserved for what is abnormal.
- **What goes wrong:** every page looks different; the table breaks the layout with many rows, long numbers or many columns; after filtering there is no way back to where you were.
- **Verify specifically:** a thousand rows, zero rows, and a cell with very long content; a narrower screen (1280 wide); filters and pagination still in place after a reload.

## Content and reading

Documentation, blogs, knowledge bases, help centres.

- **What people are doing:** reading, and finding the passage they need to read.
- **Structure:** one text column with a limited line length; a table of contents with the current position for long pages; side navigation grouped by topic; search that is easy to find.
- **Typography carries it:** body text around 16px with a line height of 1.6 to 1.8; 60 to 75 characters per line in Latin scripts, 30 to 40 in Chinese, Japanese or Korean; heading levels separated by weight and spacing, three levels at most; paragraph spacing larger than line spacing; links that look like links.
- **Code, tables, images:** code blocks scroll sideways and can be copied; wide tables scroll inside their own container; images stay within the text column and have a place for a caption.
- **Visuals:** it can have character (the choice of typeface is the biggest expressive lever here), but it must not compete with the text.
- **What goes wrong:** lines too wide; grey text too faint; code highlighting unreadable in dark mode; an anchor jump leaves the heading hidden under a fixed header.
- **Verify specifically:** one very long article; a page with a wide table and long lines of code; phone width; contrast in dark mode.

## Landing and marketing pages

Pages for people arriving for the first time. Expressiveness is part of the job here. The page can and should be more distinctive than a tool interface.

- **What people are doing:** deciding in a few seconds what this is, whether it concerns them, and where to click next.
- **Structure:** one narrative from top to bottom, one idea per screen. On a common laptop size (about 1280×800) the headline, one sentence of explanation and the main action are visible without scrolling.
- **The content must be real.** Do not invent testimonials, numbers, customer logos or case studies. If something does not exist, leave that block out.
- **Visuals:** start from the brand and commit to a clear direction (see `visual-direction.md`). Pick one or two distinctive moves and carry them through. Keep the rest quiet. The product's own screens are usually the most convincing imagery.
- **Motion:** more is acceptable than in a tool, but each animation should guide the eye. Scroll-triggered animation must not get in the way of reading, and with motion turned off all content is still visible.
- **What goes wrong:** every section is "centred heading plus three cards"; every screen is equally loud; images are not compressed; on a wide display the content stretches without limit.
- **Verify specifically:** widths from 320 to 1920; no layout shift before and after fonts and images load; reduced motion; every button and link actually goes somewhere.

## Mobile-first

Pages and apps used mainly on a phone.

- **What people are doing:** using one hand, briefly, and often interrupted.
- **Structure:** one thing per screen; the main action in the lower half where the thumb reaches; a bottom bar for the main navigation (three to five items); secondary content in a sheet that slides up from the bottom instead of a centred dialog.
- **Sizes:** touch targets at least 44px square; inputs at 16px or larger, otherwise iOS zooms the page; `100dvh` instead of `100vh`; keep clear of the notch and the home indicator (`env(safe-area-inset-*)`).
- **Input:** give each field the right type and `autocomplete` so the system shows the right keyboard and autofill; with the keyboard open, the field being filled and the submit button are both visible.
- **What goes wrong:** actions that only appear on hover; gestures with no button equivalent; a desktop layout shrunk down.
- **Verify specifically:** widths of 360, 390 and 430; the layout with the keyboard open; drawers and sheets can be dismissed. An emulator is not a real device, so say in the report that it was not tried on one.

## Forms and multi-step flows

Sign-up, checkout, onboarding, applications, setup wizards.

- **What people are doing:** trying to finish quickly without anything going wrong on the way.
- **Structure:** ask only what must be asked; group related questions; with many steps, show progress and allow going back without losing anything.
- **Fields:** a label above each input, always visible, never replaced by placeholder text; required and optional clearly marked (mark whichever is rarer); sensible default values.
- **Validation:** validate after the person leaves a field, not while they type; put the error next to its field and say what is wrong and how to fix it; on a failed submit, go to the first field with an error and keep everything already entered.
- **Submitting:** the button names the action ("Create account"); while submitting it is disabled and shows progress, so nothing is sent twice; on success, say clearly what happens next.
- **What goes wrong:** everything is gone after a reload or pressing Back; errors are shown by red alone; one error clears the other fields.
- **Verify specifically:** make every kind of mistake on purpose; reload and go back half-way through; complete it with the keyboard only; how it looks after browser autofill.

## Prototypes and demos

Used to judge a direction or to let people try something that has no real backend yet.

- **Purpose:** let someone click through it as if it were the real product, and then say what is right and what is wrong.
- **Build:** all the main flows work; the data looks real (varied lengths, including the awkward cases); actions get plausible fake feedback (a delay, an in-progress state, a result).
- **Do not build:** a real backend, sign-in or persistence. The engineering can be simple.
- **The visual and interaction standard does not drop.** A prototype exists to be judged as an interface. Misalignment and lost drafts pull the review toward trivia.
- **The interface contains only the product itself.** Notes such as "prototype" or "sample data" go in the report, not on the screen.
- **Delivery:** prototypes are often sent to someone to open directly, and one double-clickable file is the least trouble (see `stack.md`). The report lists what is faked and what is not built.

## Adding to an existing design system

A new page, feature or component for a product that already exists.

- **Read before building:** read the spec, the style variables and the component library, then look at how two or three neighbouring pages are done.
- **Introduce no new values:** use the colours, spacing, radii and type sizes that exist. When a component is missing, first look for a close one that can be extended.
- **Look like the neighbours:** the new page's heading position, margins and empty states matching the pages next to it matters more than being "better looking".
- **Do not redo things in passing:** leave pages you were not asked to touch. If the existing system itself seems to have a problem, point it out in the report with a suggestion and let the user decide.
- **Verify specifically:** put screenshots of the new page and its neighbours side by side. It should not be possible to tell they were made at different times.

## The user supplied a design or a reference

The user provided a mockup, screenshots or an existing spec, or said "make it feel like such-and-such".

- **With a design:** follow it. Take spacing, type sizes and colours from the design by measuring or reading them, not from memory. Fill in the states the design does not cover (empty, error, hover, phone width) in the design's own language, and list in the report what you added.
- **With a reference:** find out which aspect the user likes (the structure, the density, the mood, a particular interaction) and learn that aspect. Learn the approach. Do not carry over another product's look and branding.
- **When you disagree:** if something in the design looks like a problem (insufficient contrast, a touch target too small, a conflict with the implementation), build it as designed and raise it separately. Do not change it silently.
- **Verify specifically:** compare screenshots of the implementation with the design side by side.
