# Highview Tutors — flyer

Flyer content from the original Ealing flyer, rebuilt for clarity and print.

## Which file to print

Print one of the two **A5** files — both are laid out natively for A5 (148 × 210mm).
Do **not** print the A4 files scaled down to A5: that drops the body text to about
6pt, past comfortable reading. The A5 version is a real relayout, not a shrink —
two card columns instead of three, with the parent review running full width, and
type rescaled for the smaller page.

The two A4 files are kept as the earlier full-size cuts:

| File | Page | Notes |
| --- | --- | --- |
| `highview-flyer-a5` | **A5** | Led by the standard: "A/A* at A-Level. 7 to 9 at GCSE." |
| `highview-flyer-a5-goal` | **A5** | Led by a time-bound goal: "…&nbsp;in 12 months". See the note below. |
| `highview-flyer-a5-white` | **A5** | The 12-month cut on a white ground. Cheaper to print. |
| `highview-flyer-compact` | A4 | Short card headings, no subheadings. |
| `highview-flyer` | A4 | Tutors heading is a full sentence; student card has a subheading. |

Each ships three files:

| File | What it's for |
| --- | --- |
| `*.html` | The source. Open in a browser, then **Print → Save as PDF** (margins *None*, **Background graphics on**). |
| `*-A5.pdf` / `*-A4.pdf` | Ready to send to a print shop or WhatsApp to a parent. Exactly one page. |
| `*-preview.png` | Preview image for social posts and messages. |

## Notes

- Fonts (Playfair Display, Source Sans 3) are embedded in every HTML file, so the
  flyer prints identically on any machine, online or not. Nothing to download.
- The QR code opens WhatsApp with a message already typed:
  `Hi Highview Tutors, I'd like to book a lesson for:` — the parent's cursor lands
  at the end, so they just add the details and send. It is drawn as vector SVG, so
  it stays sharp at any size.
- **Do not shrink the QR below 20mm.** The prefilled message makes it a 41-module
  symbol; at 20mm that is ~0.41mm per module, which decodes reliably at 300dpi with
  some blur. At the old 16mm it is borderline. If you ever lengthen the message the
  symbol gets denser again — re-check before printing. Error correction is level M
  (15%), which is what buys the size; a longer message or a smaller code would need
  a rethink rather than a tweak.
- To edit copy, change the text in the `.html` and re-export the PDF. Colours and
  type sizes are CSS variables at the top of the `<style>` block (`--gold`,
  `--ink`, `--paper` and friends).
- On screen each flyer scales down to fit narrow phones; printing always uses the
  full sheet.
- The sheet is a fixed page size with `overflow:hidden`, so content that grows past
  the page edge gets clipped rather than spilling onto a second page. After editing
  copy, check there is still navy margin below the green contact block — if it sits
  flush to the edge, the sheet has overflowed.
- The PDFs are trim-size with no bleed. Most online printers handle this fine, but
  if yours asks for 3mm bleed on a full-colour background, say so and it can be
  re-exported oversized.
- The `-goal` version leads with "in 12 months", which is an objective claim rather
  than an aspiration. It sits under "The bar we work to", which frames it as an
  internal standard rather than a promise — a materially weaker claim, and easier
  to stand behind if anyone asks you to evidence it. If you reword it as a guarantee, be
  ready to substantiate it — note the money-back guarantee covers the first two
  sessions, not grades.
- The tutor card is filled gold on both A5 cuts, to pull the eye to it. Its text
  sits at 84-86% navy on that gold rather than the 72% used elsewhere, because
  low-contrast small text on a light ground is much harder to read on paper than
  on screen. If you edit that card, keep the text dark.
- The parent quote is set in Source Sans 3 italic, not Playfair. Playfair is a
  high-contrast serif whose hairlines close up at small sizes when reversed out
  of a dark ground on press — it read fine on screen and poorly on paper. Keep
  small reversed text in the sans; Playfair is fine at the larger sizes and where
  it sits dark-on-gold.
- The white cut is a rethought palette, not an inverted one. Gold used as *type*
  darkens to `#8A6410` (5.4:1 on white); the brand `#E3B23C` is only 1.96:1 there
  and is unreadable as text. Bright gold survives only as a fill carrying navy on
  top — the tutor card, the guarantee band, and the pill. If you edit the white
  version, keep that split.
- The white cut uses far less ink than the navy ones, which usually makes it
  cheaper on a large run, and it will not show handling marks the way a solid dark
  background does.
