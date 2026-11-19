# The AI-generated look

The AI-generated look is not one colour or one effect. It is a set of unchosen defaults all appearing at once. None of them is wrong alone. Together they make the face that every generated interface shares.

**This table is not a list of bans.** Gradients, illustrations, generous whitespace and rich motion can all be used, as long as they were chosen for this product, the reason can be stated, and they are carried through consistently. The right-hand column is the default replacement "when there is no particular reason". It leans restrained and suits tools and dashboards. Landing pages and strongly branded products can be more expressive. See `visual-direction.md` for how to choose. There is one test: was this choice thought about, or did it just happen?

## Colour and surface

| What gets written by default | Why it looks cheap | Without a particular reason, use |
|---|---|---|
| Purple-to-blue gradients, gradient text, glowing outlines, frosted glass | Decoration that carries no information, and it is everywhere | Neutral greys over nine-tenths of the area, plus one restrained accent |
| A different colour for every module, coloured badges all over | When everything shouts, nothing is heard | Colour means status only. The normal state has no colour, just grey text |
| A shadow on every card | A shadow means "floating above". If everything floats there is no depth | Separate layers with very slight surface tints and 1px translucent lines. Shadows only for menus, dialogs and a floating input |
| Solid dark-grey borders | The lines draw more attention than the content | Translucent lines (black or white at about 8%), which sit naturally in both themes |
| Dark mode with a pure black background and pure white text | The contrast is harsh, and hairlines and shadows stop working | A dark grey background (about `#1f1f1f` to `#212121`), text at about 90% white, depth from a slightly lighter surface |
| Callout boxes with a tinted background and a coloured bar on the left | A documentation-site habit that is noisy inside a product | A plain line of text, or a very light grey block |

## Layout and structure

| What gets written by default | Why it looks cheap | Without a particular reason, use |
|---|---|---|
| Seven or eight items in a left nav, each leading to a near-identical list page | The database tables were laid out as pages, and the person has to assemble the picture | For tools, one main surface built around the most frequent task. For data dashboards, keep the navigation but give every page a clear purpose |
| A row of four stat cards on the home screen | Nobody acts on most of those numbers | Show only what needs handling and what has gone wrong |
| Everything in a card, and cards inside cards | Each extra frame is extra noise | Group with spacing. Where a boundary is really needed, use one line |
| A large heading on every page with a sentence explaining what the page is for | The tone of a landing page. A tool does not need to introduce itself | A small heading, or none. The interface should explain itself |
| Large radii, lots of whitespace and everything centred, inside a tool | A landing-page approach moved into a tool. Density is too low and it takes a lot of scrolling | Let density follow the scenario. Limit the width of the text column, align lists to the left |
| An empty state with a large illustration unrelated to the product | It upstages the content, and the style varies from place to place | One sentence of explanation and one action to get started. If illustrations are used, one drawing style across the product |
| A right-hand column of nice-to-have information | It is there to make the screen look full | If nothing has to be seen at the same time, use a single centred column |

## Controls

| What gets written by default | Why it looks cheap | Without a particular reason, use |
|---|---|---|
| Emoji as icons | Every system draws them differently and the style cannot be controlled | One set of line icons with one stroke width and size |
| An icon on every button | The icons stop pointing at anything | An icon only where it speeds up recognition |
| Three or four equally prominent buttons in a row | It is not clear which to press | One primary action. The rest in a secondary style or inside a menu |
| Buttons of different heights and radii | There is no scale | Heights and radii from the spec |
| A native select with custom styling layered on | Height, arrow and alignment differ between browsers | The component library's select |
| Icon-only buttons with no tooltip | The user has to guess | A tooltip on hover, including the shortcut if there is one |
| The focus ring removed with `outline: none` | Keyboard users cannot see where they are | Keep the `:focus-visible` ring |

## Motion

| What gets written by default | Why it looks cheap | Without a particular reason, use |
|---|---|---|
| Page elements fading and rising in one after another | Every visit means waiting for the show to finish | The first screen simply appears |
| Springs and bounces | Fun the first time, tiresome the tenth | A short ease-out curve, under 250ms for frequent actions |
| Popovers that scale up from zero | Exaggerated, like a performance | Scale from 0.96 with a fade, originating at the trigger |
| Cards that lift and gain a shadow on hover | It conveys nothing | A background one step darker |
| A whole block replaying its entrance whenever data updates | It shows the page is being redrawn wholesale | Entrance animation only for elements that are actually new |

## Copy

| What gets written by default | Why it looks cheap | Without a particular reason, use |
|---|---|---|
| "Welcome back!", "Let's get started 🚀" | No information | Delete it, or say something specific ("3 things are waiting for your decision") |
| "Powerful", "all-in-one", "effortlessly manage your…" | Advertising language, not interface language | Say what it does |
| "Submit", "OK" | Does not say what will happen | A verb plus its object: "Publish", "Delete this rule" |
| Internal jargon, table names, raw field names | Users do not talk that way | The users' own words, written into the spec's word list |
| "Success!" | The result is already visible on screen and does not need saying again | No message. Show one only when the result is not visible or can be undone |
| An error that just says "Something went wrong" | The person does not know what to do | What happened, and what they can do now |
| Sample data like "John Doe", "Test Project 1" and round numbers | Obviously fake, and it never exposes problems with long text | Realistic content of varied lengths, including the longest kind |
| "Prototype" or "sample data" written in a corner of the interface | That is for reviewers. It is not part of the product | Only the product itself in the interface. Put notes in the report |

## What mature interfaces have in common

Check the screenshots. Each of these should be true:

- One thing is most prominent on each screen, and the eye knows where to go first.
- Everything aligns to a small number of vertical lines.
- Hierarchy comes from weight and tone, not from stepping the font size up level after level.
- Things of the same kind look exactly the same: same height, same spacing, same radius.
- Removing any element would lose some information. Anything that can go without affecting use should go.
- It holds up equally in dark mode and at phone width, where those exist. It does not merely get by.
