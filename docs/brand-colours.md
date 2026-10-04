# ERA AXIS brand colours

Brand anchor: **ERA purple #3B1174**. Shade and tint blends use encoded sRGB,
rounded once to the nearest 8-bit channel. The accent uses HSL.

| Hex | Role | Derivation |
| --- | --- | --- |
| #3B1174 | Primary | Owner-supplied brand anchor. |
| #2F0E5D | Dark | 80% primary + 20% black. |
| #200940 | Deep; browser theme-color | 55% primary + 45% black. |
| #583589 | Soft; disabled primary fill | 85% primary + 15% white. |
| #76589E | Light; essential UI outline | 70% primary + 30% white. |
| #D0ADFF | Lilac accent | Primary HSL hue 265.454545°, saturation 100%, lightness 84%; round to sRGB. |
| #FCFBFD | Top surface | 1.5% primary + 98.5% white. |
| #F7F5F9 | Soft surface | 4% primary + 96% white. |
| #F1EEF5 | Strong surface | 7% primary + 93% white. |
| #EBE7F1 | Pale dark/hero words; decorative soft border | 10% primary + 90% white. |
| #090311 | Dark surface; glass and caption base | 15% primary + 85% black. |
| #040108 | Dark background | 7% primary + 93% black. |
| #FFFFFF | White surface; inverse words | Retained neutral. |
| #111111 | Body words | Retained neutral. |
| #4B5563 | Secondary words | Retained cool neutral. |
| #606877 | Muted words; placeholders | Darkened cool neutral selected for AA on the strongest light tint. |
| #E5E7EB | Decorative neutral border | Retained; essential controls use the UI outline role. |
| #B91C1C | Required marks; invalid words/rings | Semantic red selected for light text and dark-footer UI contrast. |
| #047857 | Light success words/icon | Dark semantic green selected for the light success panel. |
| #6EE7B7 | Dark success words/icon | Pale semantic green selected for the dark success panel. |
| #FCA5A5 | Dark newsletter errors | Pale semantic red selected for the dark context. |
| #FECACA | Revoked certificate badge | Lighter semantic red selected for the combined glow/panel/badge bound. |
| #B45309 | Selected rating marks | Darkened semantic amber for essential star strokes/fills. |
| #FFD230 | Dark warning badges | Retained Tailwind amber-300, resolved to sRGB and measured. |
| #C10007 / #FEF2F2 | Light error words/background | Retained Tailwind red-700/red-50, resolved to sRGB and measured. |

## Accent decision

`#D0ADFF` keeps the lively lilac feel while using the brand hue. Its contrast is
**7.31:1** on primary, **9.45:1** on deep and **10.96:1** on the dark background.
The small photo-hero badge bound gives lilac only **3.11:1**, so those words use
`#EBE7F1` (**4.83:1**). Pale words also replace weak translucent copy in the
FinalCTA and learning-section glows. Lilac remains on passing dark roles.

## Header decision

Scrolled header, dropdown and drawer share `rgba(9,3,17,.794234)` and
`blur(14px)`, without a saturation filter. The top header stays transparent over
the dark hero. Captions use the same dark base at `.85` opacity.

The bound composites the glass over white, then the active dropdown's white
10% layer. Its crossing is approximately `.7942337845`; **.794234** is the
lowest passing six-decimal declaration, at **4.500003428464578:1**.
`.794233` fails the unrounded 4.5 threshold. Chrome's quantized painted active
row measures **4.56:1**. Other header/dropdown/drawer text/UI bounds pass.
The header's black shadow uses `.01` alpha, keeping muted copy below it at
**4.52:1** under the strongest light-tint bound.

## Pairs repaired

- Muted words/placeholders against white, tinted surfaces and selected rows.
- Pale secondary/eyebrow/link words against dark gradients and overlapping glows.
- White button labels against the purple family, including hover/disabled states;
  busy labels retain full opacity instead of the failing 60% opacity treatment.
- Required asterisks, validation/error words and invalid outlines against light
  panels; invalid focus against the dark footer and its dark offset.
- Newsletter success words/icons against light and dark success panels;
  error and already-subscribed helper words against their light/dark contexts.
- Rating/star and radio outlines against white; selected marks against their fill.
- Focus rings against both neighbours: 2px outline, 3px offset, surface-owned ink;
  selected purple controls are separated from purple focus by a white gap.
- Header/dropdown/drawer active and inactive words against white-backed glass.
- Photo captions, badges, gallery arrows and dots against guaranteed dark backing.
- Renewal selector words/chevron against an opaque white field.
- Revoked certificate words against the combined dark glow, panel and badge.
- Focus feedback spacing and header shadow against adjacent light-context words.

## Checks and external evidence

Run `npm run check:contrast` independently of the archived evidence. It reads
`src/styles/theme.css`, measures 195 modeled pairs with the WCAG 2.x
relative-luminance formula, and fails on unrounded ratios below 4.5 for normal
text or 3 for large text/UI/focus. Also run `npm run lint` and `npm run build`.

Full research, JSON measurements and six screenshots live outside this repo at
`C:\Projects\www\brand-colours-evidence\`. The report is
`brand-colours-research.md`; JSON/screenshots remain in its `brand-colours/`
subfolder so the original relative links work. SHA-256 checks confirm all eight
files are unchanged. The archive retains original commit IDs from before the
history cleanup.

Logo/favicon/raster changes remain skipped pending owner masters. Live Google,
payment/email services, physical/coarse-pointer interactions, browsers without
blur and arbitrary future CMS content are outside the archived stationary tests.
The external ERA Tech design-system document was not edited.
