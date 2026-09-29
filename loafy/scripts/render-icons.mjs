// Renders app icons and the splash image from the Loafy Lottie.
// Run with: node scripts/render-icons.mjs (needs lottie-web and playwright-core; set CHROME to a Chromium path)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lottie = readFileSync(join(root, 'node_modules/lottie-web/build/player/lottie.min.js'), 'utf8');
const idle = JSON.parse(readFileSync(join(root, 'assets/lottie/loafy-idle.json'), 'utf8'));

// [file, canvas size, loafy size, background, monochrome]
const targets = [
  ['icon.png', 1024, 900, '#FFE6B8', false],
  ['android-icon-foreground.png', 1024, 640, 'transparent', false],
  ['android-icon-background.png', 1024, 0, '#FFE6B8', false],
  ['android-icon-monochrome.png', 1024, 640, 'transparent', true],
  ['splash-icon.png', 1024, 1024, 'transparent', false],
  ['favicon.png', 96, 96, 'transparent', false],
];

const browser = await chromium.launch({ executablePath: process.env.CHROME });
for (const [file, size, loafySize, bg, mono] of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<body style="margin:0;background:${bg};display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">
      <div id="l" style="width:${loafySize}px;height:${loafySize}px;${mono ? 'filter:brightness(0)' : ''}"></div></body>`,
  );
  await page.addScriptTag({ content: lottie });
  await page.evaluate((data) => {
    const a = lottie.loadAnimation({ container: document.getElementById('l'), renderer: 'svg', autoplay: false, animationData: data });
    a.goToAndStop(0, true);
  }, idle);
  await page.screenshot({ path: join(root, 'assets', file), omitBackground: bg === 'transparent' });
  await page.close();
  console.log(`wrote assets/${file}`);
}
await browser.close();
