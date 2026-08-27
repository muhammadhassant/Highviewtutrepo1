# Highview Tutors — flyer

Flyer content from the original Ealing flyer, rebuilt for clarity and print.

## Which file to print

**`highview-flyer-a5`** is the one to use — laid out natively for A5 (148 × 210mm).
Do **not** print the A4 files scaled down to A5: that drops the body text to about
6pt, past comfortable reading. The A5 version is a real relayout, not a shrink —
two card columns instead of three, with the parent review running full width, and
type rescaled for the smaller page.

The two A4 files are kept as the earlier full-size cuts:

| File | Page | Notes |
| --- | --- | --- |
| `highview-flyer-a5` | **A5** | **Print this one.** |
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
- The QR code encodes `https://wa.me/447392202168` and is drawn as vector SVG, so
  it stays sharp at any print size.
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
