const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // 1. Scroll to Explore Services & below
    const buttons = await page.$$('a[href="#services"]');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Explore Services')) {
        await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), btn);
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(screenshotsDir, 'verify_mobile_hero_below_explore.png') });
        console.log('Saved verify_mobile_hero_below_explore.png');
        break;
      }
    }

    // Scroll down slightly to capture the image and scrolling strap
    await page.evaluate(() => window.scrollBy(0, 320));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, 'verify_mobile_image_and_strap.png') });
    console.log('Saved verify_mobile_image_and_strap.png');

    // 2. Scroll to Contact form dropdowns
    const formDate = await page.$('#form-date');
    if (formDate) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), formDate);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(screenshotsDir, 'verify_mobile_dropdown_date_fixed.png') });
      console.log('Saved verify_mobile_dropdown_date_fixed.png');
    }

    console.log('Screenshots completed!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
