// Renders every flier version to a print-ready A4 PDF and a 300 dpi PNG in ./output
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderFlier } from './src/template.mjs';
import { versions } from './src/versions.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'output');
mkdirSync(out, { recursive: true });

const only = process.argv.slice(2); // optional: build only the ids passed on the command line
const A4_PX = { width: 794, height: 1123 }; // 210 x 297 mm at 96 px per inch
const PRINT_SCALE = 2480 / 793.7; // 300 dpi across the 210 mm width
const BLEED_MM = 3;

// Hinting off keeps Poppins letter spacing even in headless Linux renders.
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
try {
  for (const v of versions) {
    if (only.length && !only.includes(v.id)) continue;
    const html = await renderFlier(v);
    const base = join(out, `highview-maths-flier-${v.id}`);
    writeFileSync(`${base}.html`, html);

    const page = await browser.newPage({ viewport: A4_PX, deviceScaleFactor: PRINT_SCALE });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    // Layout guard: fail the build if the content runs into the footer or a section spills off the page.
    const clash = await page.evaluate(() => {
      const footerTop = document.querySelector('.footer').getBoundingClientRect().top;
      const last = document.querySelector('.main > :last-child').getBoundingClientRect().bottom;
      const pageRect = document.querySelector('.page').getBoundingClientRect();
      const wide = [...document.querySelectorAll('.main > *, .offer *, .review *, .footer *')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > pageRect.right + 0.5 || r.left < pageRect.left - 0.5); })
        .map((el) => el.className.baseVal ?? el.className);
      // content spilling out of its own card (e.g. a price too wide for the box)
      const spill = [...document.querySelectorAll('.offer div, .review div')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.className);
      return { gap: footerTop - last, wide, spill };
    });
    if (clash.gap < 8) throw new Error(`${v.id}: content ends ${Math.ceil(8 - clash.gap)}px too low for the footer`);
    if (clash.wide.length) throw new Error(`${v.id}: elements past the page edge: ${clash.wide.join(', ')}`);
    if (clash.spill.length) throw new Error(`${v.id}: content too wide for its box: ${clash.spill.join(', ')}`);

    await page.locator('.page').screenshot({ path: `${base}.png` });
    await page.pdf({ path: `${base}.pdf`, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });

    // Same design with 3 mm bleed on every side, for professional printers.
    await page.setContent(await renderFlier(v, { bleedMm: BLEED_MM }), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `${base}-print-bleed.pdf`, width: `${210 + 2 * BLEED_MM}mm`, height: `${297 + 2 * BLEED_MM}mm`, printBackground: true, preferCSSPageSize: true });
    await page.close();
    console.log(`built ${v.id} (space above footer: ${Math.round(clash.gap)}px)`);
  }
} finally {
  await browser.close();
}
