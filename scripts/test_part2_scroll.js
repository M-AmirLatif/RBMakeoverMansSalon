const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to "Beauty Beholds"
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const h = headings.find(el => el.textContent.includes('Beauty Beholds'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(screenshotsDir, 'verify_hero_part2_mobile_top.png') });
    console.log('Saved verify_hero_part2_mobile_top.png');

    // Scroll down 450px to see Explore Services, the image below it, and the scrolling strap!
    await page.evaluate(() => window.scrollBy(0, 480));
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(screenshotsDir, 'verify_explore_image_and_strap_mobile.png') });
    console.log('Saved verify_explore_image_and_strap_mobile.png');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
