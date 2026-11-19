# Details checklist

Organised by component. Read only the parts that apply: check each component once when it is written, and go through the screenshots again when polishing. Every item comes from a problem that actually happened.

The numbers are defaults. Where the project's `DESIGN.md` says otherwise, it wins.

## Alignment and size

- Controls on one line have the same height and are vertically centred, with centre lines within 1px of each other. The same goes for a text label and the control beside it.
- Control heights come only from the steps in the spec (for example 28 / 32 / 36 / 40). Icon buttons are square, with a side from the same steps.
- Nested corners are concentric: outer radius = inner radius + the padding between them.
- Spacing uses multiples of 4 only. Related things sit close, unrelated things sit apart, and the gap within a group is clearly smaller than the gap between groups.
- 6 to 8px between an icon and its text. Only one or two icon sizes (16, 18).
- Numbers that change use tabular figures (`font-variant-numeric: tabular-nums`), otherwise they jitter sideways on update.
- A shared left edge: for different speakers and different kinds of item, the text starts on the same vertical line.

## Text

- Interface text in three steps, 12 / 13 / 14. Long-form body text at 15 or 16. Headings need not be large. Use weight to set them apart.
- Line length for body text: 60 to 75 characters in Latin scripts, 30 to 40 in Chinese, Japanese or Korean.
- A name that does not fit on one line is truncated with an ellipsis, and there is a way to see all of it (a tooltip, or opening the item).
- When the last line of a paragraph holds only a word or two, use `text-wrap: pretty`. For headings use `text-wrap: balance`.
- Contrast between text and background: at least 4.5 for body text, no lower than 3 for secondary grey text. Placeholder text and disabled states may be fainter.
- When scripts and numerals are mixed, check the baseline and spacing. Monospace is for code and paths only.

## Text inputs

- Drafts are stored per object: leave and come back, and what was not sent is still there. An update elsewhere in the interface must not clear a draft.
- Pressing Enter while choosing a candidate in an input method editor (Chinese, Japanese, Korean) must not send the message (check `isComposing`).
- Enter sends, Shift+Enter inserts a line break. After sending, focus stays in the input.
- The input grows with its content up to a limit, then scrolls internally.
- With nothing typed, the send button looks disabled. While sending there is an in-progress state and nothing can be submitted twice.
- On phones the input's font size is at least 16px, otherwise iOS zooms the page.
- Where pasting or dropping files is supported, dragging over shows a clear drop target, and attachments appear as small removable chips.

## Lists and sidebars

- The selected item has a clear background. Hover gives feedback, but weaker than selection.
- Group headings are small and grey and do not compete with the items.
- Status is a small dot plus text, not a full coloured badge.
- Action buttons that appear only on hover take no layout space (position them absolutely in the gap), otherwise they push the rhythm between items out of shape. On touch screens there is another way to reach them.
- A very long name, very many items, and no items at all: look at all three.

## Menus, selects, dialogs

- Use the component library's implementation. Do not position them by hand. They open from the direction of the trigger.
- Escape and clicking outside both close them. After closing, focus returns to the trigger.
- When a dialog opens, focus lands on the first input. With no input, it lands on the dialog itself. The first button should not appear with a focus ring on it.
- When the content is taller than the screen, it scrolls inside the dialog with the title and the bottom buttons fixed. On phones it stays within the screen.
- Doing something inside a dialog does not rebuild the dialog: scroll position, the selected tab and half-filled fields all stay.
- While a dialog is open, an Undo toast on screen can still be clicked (see the pitfalls in `stack.md`).
- Irreversible actions get a confirmation dialog whose button names the action ("Delete this rule"), not "OK".

## A row on a settings page

- The name and one line of description on the left, the control on the right. The control is right-aligned and vertically centred against the block on the left.
- Every row has the same padding, with a hairline between rows.
- Whether changes apply immediately or need a Save button is the same across the whole page. Changes that apply immediately give visible feedback.
- A select is as wide as its longest option and does not jump when the selected value changes.

## Scrolling

- When content keeps being added at the bottom: if the user is at the bottom, follow. If the user has scrolled up, stay put and show a "new content" button.
- A state update elsewhere must not change the scroll position.
- A scrollbar appearing or disappearing should not shift the content sideways (`scrollbar-gutter: stable`).
- On phones use `100dvh`, not `100vh`, otherwise the address bar covers the bottom.
- The page itself never scrolls sideways. Wide tables and code blocks scroll inside their own container.

## Loading, empty, error

- An action that finishes within 300ms shows no loading state, to avoid a flash.
- The loading placeholder has the same dimensions as the loaded content, so the layout does not jump when the content arrives.
- Empty state: one sentence saying what will be here, plus an action to get started.
- Error: say what happened and what can be done now. Offer a retry where one is possible. Nothing the user typed is lost because of an error.

## Feedback

- Pressing shrinks the control slightly (0.98) so it feels pressed.
- A copy button turns into a tick when clicked and returns after a second or two.
- An action that can be undone runs immediately and shows a toast with Undo.
- When the result is already visible on screen, there is no toast.

## Keyboard

- Everything can be done from the keyboard, and the Tab order matches the visual order.
- The focus ring appears only for keyboard use (`:focus-visible`), not on mouse clicks.
- Common actions have shortcuts, shown in the tooltip of the matching button. Products with many items offer a search palette (⌘K).

## Phone width

- The sidebar becomes a drawer that closes by tapping the scrim, tapping an item, or pressing Escape.
- A right-hand panel becomes a layer covering the whole screen, with a clear way back.
- Touch targets are at least 40px square (at least 28 in tight spots, with space around them).
- No horizontal scrolling and nothing cut off.

## Dark mode

- Every colour comes from a variable. No hard-coded colour appears in a component.
- Shadows are barely visible in the dark, so floating layers are set apart by a slightly lighter surface and a hairline ring.
- Status colours switch to lighter, slightly less saturated versions in the dark.
- Offer System / Light / Dark and remember the choice.

## Motion values

- Hover and press: 100 to 150ms.
- Menus, tooltips, dialogs: 150 to 200ms to enter, faster to exit (about 110ms).
- Sliding panels and layout changes: 200 to 250ms.
- Enter on an ease-out curve such as `cubic-bezier(0.22, 1, 0.36, 1)`. Exit on an ease-in curve.
- No springs for exits: a spring has a long tail at the end and leaves a 1px remnant on screen for most of a second. Use a fixed duration.
- Animate only `transform` and `opacity`. Do not animate width, height or position properties, and do not write `transition: all`.
- Respect the system's reduced-motion setting.
- Take screenshots and measurements after animations have finished.
