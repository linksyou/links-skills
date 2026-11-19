# Picking a visual direction

A good-looking interface does not have one face. This page covers how to choose a direction for a particular product, what can be adjusted, and what holds whatever the direction.

## Where the direction comes from

Go through these in order. Once an earlier one answers the question, there is no need to guess from the later ones.

1. **What the user said.** If they gave a brand colour, a typeface, a reference or some adjectives, follow them.
2. **What the project already has.** A logo, existing pages, style variables, a marketing site. The new interface should visibly belong to the same family.
3. **The nature of the product.** With neither of the above, ask three questions:
   - How long does someone use it at a time? The longer, the more restrained it should be. A page people glance at and leave can be louder.
   - Who is the audience? Professionals want density and efficiency. A general audience wants clarity and warmth. Products for children or creative work can be more playful.
   - What is the main thing on screen? When the content is already rich (images, charts, code), the interface steps back. When the content is plain text and forms, the interface can carry more of the character.

Once chosen, write it at the top of `DESIGN.md` in a sentence or two and tell the user. For example: "This is an admin panel that operations staff use all day, so I chose high density, neutral colours and almost no motion. The accent is the blue from your logo." A direction with a stated reason gives every later value something to rest on.

When the user has no clear idea of the style but cares a lot about it, build the same screen in two or three directions and let them choose. The directions should be clearly different from each other, not three shades of one direction.

## Dimensions you can adjust

Each dimension is a range. Pick a position and hold it across the whole product.

| Dimension | One end | Other end | How to choose |
|---|---|---|---|
| Density | Compact: rows of 28 to 32px, tight spacing | Spacious: rows of 44px and up, generous whitespace | Professional tools and data dashboards lean compact. Consumer products, mobile and landing pages lean spacious |
| Amount of colour | Almost entirely neutral, colour only for status | Brand colour across large areas | Less for long sessions. More for marketing pages and products with a strong brand |
| Temperature of the neutrals | Cool or pure grey | Warm grey, off-white | Technical products lean cool. Reading, lifestyle and editorial products lean warm |
| Contrast | Soft: light grey surfaces, hairlines | Strong: black on white, heavy rules | Soft wears well. Strong contrast has attitude and suits pages with little, carefully chosen content |
| Corner radius | Square, or 2 to 4px | 12px and up, fully rounded | Small radii read as precise and professional. Large radii read as friendly. Use one set across the product |
| Character of the type | A neutral sans-serif | A serif, a monospace, a display face with personality | Keep interface text neutral and legible. Put the character mainly in the headings |
| How depth is shown | Flat: surface tints and hairlines | Layered: shadows and overlap | Choose one as the main method. Do not mix them |
| Motion | Almost none | Rich and choreographed | Less for interfaces with high-frequency actions. More is acceptable on pages that tell a story |

Some common combinations, as starting points and not as templates:

- **A restrained tool:** medium density, neutral greys, colour only for status, small to medium radii, a sans-serif, flat depth, very little motion. Suits apps used every day.
- **A dense professional interface:** compact, cool greys, hairline dividers, small radii, tabular or monospace figures, no motion. Suits admin panels, analytics and developer tools.
- **Warm and editorial:** spacious, a warm paper-like background, serif headings with sans-serif body text, soft contrast. Suits reading, writing and knowledge products.
- **A strong brand:** the brand colour used boldly, large headings with personality, strong contrast, a definite layout device. Suits landing pages and consumer products.
- **Friendly and approachable:** spacious, large radii, bright colours but few of them, illustrations or icons drawn in one consistent manner. Suits products for a general audience and onboarding flows.

## How to make it recognisable

An interface gets its own look from **a few choices carried all the way through**, not from piling on effects.

- Pick one or two things to be this product's signature: a heading typeface, a colour, a layout device, a way of drawing icons or illustrations.
- Carry it through fully and consistently, and keep everything else quiet. Five signatures at once amount to none.
- The signature works best when it relates to the product: its name, the content it handles, its audience. Not whatever is fashionable this year.

## What holds in any direction

The style can change. These do not. They determine whether the result is mature, not what style it is.

- **Every value comes from a scale.** Colours are variables. Control heights, radii, spacing and type sizes each have a fixed set of steps.
- **Consistency.** Things of the same kind look exactly the same.
- **Alignment.** Content sits on a small number of vertical lines. Controls on one line share a centre line.
- **One point of emphasis per screen.** The eye knows where to go first.
- **Legibility.** Body text has a contrast ratio of at least 4.5, secondary text at least 3. Status is never conveyed by colour alone.
- **Depth means something.** A shadow means "floating above". Colour means status or brand. One device does not express two meanings.
- **Every element earns its place.** Removing it would lose some information. Otherwise remove it.
- **The keyboard works and focus is visible. The system's reduced-motion setting is respected.**
- **Every supported width and theme is done properly.** It is fine to have no dark mode or no phone layout. If one exists, it has to hold up equally well.
