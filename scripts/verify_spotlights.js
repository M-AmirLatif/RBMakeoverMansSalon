const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function verify() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const spotlightEl = await desktopPage.$('#spotlight-executive-crop');
  if (spotlightEl) {
    await desktopPage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), spotlightEl);
    await new Promise(r => setTimeout(r, 600));
    await spotlightEl.screenshot({ path: path.join(screenshotsDir, 'v_spotlight1_desktop.png') });
    console.log('Captured v_spotlight1_desktop.png');
  }

  const precisionEl = await desktopPage.$('#precision');
  if (precisionEl) {
    await desktopPage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), precisionEl);
    await new Promise(r => setTimeout(r, 600));
    await precisionEl.screenshot({ path: path.join(screenshotsDir, 'v_precision_desktop.png') });
    console.log('Captured v_precision_desktop.png');
  }

  // 2. Mobile
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const mSpotlight = await mobilePage.$('#spotlight-executive-crop');
  if (mSpotlight) {
    await mobilePage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), mSpotlight);
    await new Promise(r => setTimeout(r, 600));
    await mSpotlight.screenshot({ path: path.join(screenshotsDir, 'v_spotlight1_mobile.png') });
    console.log('Captured v_spotlight1_mobile.png');
  }

  const mPrecision = await mobilePage.$('#precision');
  if (mPrecision) {
    await mobilePage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), mPrecision);
    await new Promise(r => setTimeout(r, 600));
    await mPrecision.screenshot({ path: path.join(screenshotsDir, 'v_precision_mobile.png') });
    console.log('Captured v_precision_mobile.png');
  }

  await browser.close();
  console.log('All verification screenshots complete!');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
