import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const logo = await sharp(fileURLToPath(new URL('src/assets/images/logo/logo.svg', root)))
  .resize({ width: 1000, height: 248, fit: 'contain', background: '#ff3696' })
  .png().toBuffer();
const caption = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect x="26" y="26" width="1148" height="578" fill="none" stroke="#171714" stroke-width="8"/>
  <rect x="280" y="425" width="640" height="92" fill="#f7f35b" stroke="#171714" stroke-width="5"/>
  <text x="600" y="482" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#171714">CANALES DE TELEGRAM</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ff3696' } })
  .composite([{ input: logo, left: 100, top: 120 }, { input: caption }])
  .png().toFile(fileURLToPath(new URL('public/social-preview.png', root)));
