# Highview Tutors — A4 flyer

Flyer content from the original Ealing flyer, rebuilt for clarity and print.

| File | What it's for |
| --- | --- |
| `highview-flyer.html` | The source. Open in a browser, then **Print → Save as PDF** (A4, margins *None*, **Background graphics on**). |
| `highview-flyer-A4.pdf` | Ready to send to a print shop or WhatsApp to a parent. Exactly one A4 page. |
| `highview-flyer-preview.png` | Preview image for social posts and messages. |

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
