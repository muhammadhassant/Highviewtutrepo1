# Highview Tutors — A4 flyer

Flyer content from the original Ealing flyer, rebuilt for clarity and print.
Two cuts of the same sheet — pick one, they are otherwise identical:

| Version | Card headings | Student card |
| --- | --- | --- |
| `highview-flyer` | Tutors heading is a full sentence ("Our tutors include university lecturers & professionals at global firms") | Has a subheading |
| `highview-flyer-compact` | All three short ("Our tutors are university lecturers & professionals"); tutors heading fits two lines | No subheading |

Each version ships three files:

| File | What it's for |
| --- | --- |
| `*.html` | The source. Open in a browser, then **Print → Save as PDF** (A4, margins *None*, **Background graphics on**). |
| `*-A4.pdf` | Ready to send to a print shop or WhatsApp to a parent. Exactly one A4 page. |
| `*-preview.png` | Preview image for social posts and messages. |

## Notes

- Fonts (Playfair Display, Source Sans 3) are embedded in the HTML, so the flyer
  prints identically on any machine, online or not. Nothing external to download.
- The QR code encodes `https://wa.me/447392202168` and is drawn as vector SVG, so
  it stays sharp at any print size.
- To edit copy, change the text in `highview-flyer.html` and re-export the PDF.
  Colours and type sizes are all set as CSS variables at the top of the `<style>`
  block (`--gold`, `--ink`, `--paper` and friends).
- On screen the flyer scales down to fit narrow phones; printing always uses the
  full A4 sheet.
- The sheet is a fixed A4 with `overflow:hidden`, so content that grows past
  the page edge gets clipped rather than spilling onto a second page. After
  editing copy, check there is still navy margin below the green contact
  block — if it sits flush to the edge, the sheet has overflowed.
