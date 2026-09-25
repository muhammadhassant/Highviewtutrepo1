# Highview Tutors maths flier

Three versions of the maths tutoring flier, one per venue. Finished files are in `output/`.

| Version | Venue | Price | Times |
| --- | --- | --- | --- |
| `v1-highview-road` | 107 Highview Road, West Ealing, W13 0HL | £25 Year 2–6, £30 Year 7–11, £35 Year 12–13 | Flexible weekdays and weekends |
| `v2-chardon-house` | Singapore Road (1–2 Chardon House), West Ealing, W13 0EP | £15 (was £25) | Monday 6pm–8pm, Saturday 2pm–4pm |
| `v3-west-ealing-library` | West Ealing Community Library (opposite Sainsbury's), W13 9BT | £15 (was £25) | Monday 6pm–8pm, Saturday 2pm–4pm |

Versions 1 and 3 show Mustafa Ahmed's 5-star review, with his photo (`assets/mustafa-ahmed.jpg`),
above the footer. It is the optional `review` field in `src/versions.mjs`.

Each version comes in three files:

- `*.png`: A4 at 300 dpi. Use this for WhatsApp, social media and email.
- `*.pdf`: A4 with no bleed. Use this for home or office printing.
- `*-print-bleed.pdf`: A4 plus 3 mm bleed on every side (216 × 303 mm). Send this one to a print shop.

The QR code opens a WhatsApp chat with 07392 202168. Its pre-filled message names the venue,
so you can see which flier each enquiry came from.

## Editing and rebuilding

Prices, venues, times and QR messages are in `src/versions.mjs`. The layout is in
`src/template.mjs`. The classroom photo is `assets/classroom-photo.jpg`: replace that file
(same name) with a higher-resolution copy for sharper prints. At 1069 px wide it prints at about 145 dpi.

```sh
npm install
npx playwright install chromium   # first time only
npm run build                     # all versions
npm run build -- v2-chardon-house # one version
```

The build fails if any content runs into the footer, off the page, or out of its card.

Font: Poppins (SIL Open Font License). Icons: Phosphor (MIT).
