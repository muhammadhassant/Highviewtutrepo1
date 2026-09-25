# Highview Tutors maths flier

Three versions of the maths tutoring flier, one per venue. Finished files are in `output/`.

| Version | Venue | Price | Times |
| --- | --- | --- | --- |
| `v1-highview-road` | 107 Highview Road, West Ealing, W13 0HL | £25 Year 2–6, £30 Year 7–11, £35 Year 12–13 | Flexible weekdays and weekends |
| `v2-chardon-house` | Singapore Road (1–2 Chardon House), West Ealing, W13 0EP | £20 | Monday 6pm–8pm, Saturday 2pm–4pm |
| `v3-west-ealing-library` | West Ealing Community Library (opposite Sainsbury's) | £20 | Monday 6pm–8pm, Saturday 2pm–4pm |

Each version comes in three files:

- `*.png`: A4 at 300 dpi. Use this for WhatsApp, social media and email.
- `*.pdf`: A4 with no bleed. Use this for home or office printing.
- `*-print-bleed.pdf`: A4 plus 3 mm bleed on every side (216 × 303 mm). Send this one to a print shop.

The QR code opens a WhatsApp chat with 07392 202168. Its pre-filled message names the venue,
so you can see which flier each enquiry came from.

## Editing and rebuilding

Prices, venues, times and QR messages are in `src/versions.mjs`. The layout is in
`src/template.mjs` and the picture of the class is drawn in `src/illustration.mjs`.

```sh
npm install
npx playwright install chromium   # first time only
npm run build                     # all versions
npm run build -- v2-chardon-house # one version
```

The build fails if the content would run into the footer or off the page.

Fonts: Poppins and Patrick Hand (SIL Open Font License). Icons: Phosphor (MIT).
