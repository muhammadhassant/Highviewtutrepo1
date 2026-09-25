// Embeds the fonts as base64 so the rendered PDF/PNG never depends on network or system fonts.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const file = (pkg, name) => require.resolve(`${pkg}/files/${name}`);
const dataUri = (path) => `data:font/woff2;base64,${readFileSync(path).toString('base64')}`;

export function fontFaceCSS() {
  return [400, 500, 600, 700, 800, 900]
    .map((w) => `@font-face{font-family:'Poppins';font-style:normal;font-weight:${w};font-display:block;src:url(${dataUri(file('@fontsource/poppins', `poppins-latin-${w}-normal.woff2`))}) format('woff2');}`)
    .join('\n');
}
