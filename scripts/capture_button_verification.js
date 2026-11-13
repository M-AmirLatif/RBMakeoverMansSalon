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
    await new Promise(r => setTimeout(r, 600));

    // 1. Capture Spotlight button
    const spotEl = await page.$('#spotlight-executive-crop');
    if (spotEl) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), spotEl);
      await new Promise(r => setTimeout(r, 600));
      await spotEl.screenshot({ path: path.join(screenshotsDir, 'verify_button_spotlight_mobile.png') });
      console.log('Saved verify_button_spotlight_mobile.png');
    }

    // 2. Capture About buttons
    const aboutEl = await page.$('#about');
    if (aboutEl) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), aboutEl);
      await new Promise(r => setTimeout(r, 600));
      await aboutEl.screenshot({ path: path.join(screenshotsDir, 'verify_button_about_mobile.png') });
      console.log('Saved verify_button_about_mobile.png');
    }

    // 3. Capture Contact submit button
    const contactEl = await page.$('#contact form');
    if (contactEl) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), contactEl);
      await new Promise(r => setTimeout(r, 600));
      await contactEl.screenshot({ path: path.join(screenshotsDir, 'verify_button_contact_mobile.png') });
      console.log('Saved verify_button_contact_mobile.png');
    }

    console.log('Verification screenshots captured!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
