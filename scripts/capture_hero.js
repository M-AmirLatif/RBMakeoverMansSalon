const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop View (1440 x 1000)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({
      path: path.join(screenshotsDir, 'hero_gentleman_desktop_updated.png')
    });
  }

  // 2. Mobile View (390 x 844 - iPhone 12/13/14)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const mobileHeroEl = await mobilePage.$('#hero');
  if (mobileHeroEl) {
    await mobileHeroEl.screenshot({
      path: path.join(screenshotsDir, 'hero_gentleman_mobile_updated.png')
    });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
