const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureGaps() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile viewport (matching user's phone screenshot)
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture Hero Section (showing the quiff cutout below the strap and above stats)
  const heroEl = await page.$('#hero');
  if (heroEl) {
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, 'gap_hero_strap_mobile.png') });
    console.log('Captured gap_hero_strap_mobile.png');
  }

  // 2. Capture Services Section category feature image
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), servicesEl);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, 'gap_services_blurred_mobile.png') });
    console.log('Captured gap_services_blurred_mobile.png');
  }

  // 3. Capture Precision Section
  const precisionEl = await page.$('#precision');
  if (precisionEl) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), precisionEl);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, 'gap_precision_mobile.png') });
    console.log('Captured gap_precision_mobile.png');
  }

  // 4. Capture Team Section
  const teamEl = await page.$('#barbers');
  if (teamEl) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), teamEl);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, 'gap_team_mobile.png') });
    console.log('Captured gap_team_mobile.png');
  }

  await browser.close();
  console.log('Done capturing gaps!');
}

captureGaps().catch(err => {
  console.error(err);
  process.exit(1);
});
