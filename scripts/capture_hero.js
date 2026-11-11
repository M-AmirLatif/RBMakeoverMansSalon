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

  // 1. Desktop captures
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const desktopTargets = [
    { id: '#precision', name: 'verify_precision_blurred_edges.png' },
    { id: '#about', name: 'verify_about_blurred_edges.png' },
    { id: '#services', name: 'verify_services_blurred_edges.png' }
  ];

  for (const t of desktopTargets) {
    const el = await page.$(t.id);
    if (el) {
      await page.evaluate(targetEl => {
        targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, el);
      await new Promise(r => setTimeout(r, 800));
      await el.screenshot({
        path: path.join(screenshotsDir, t.name)
      });
      console.log(`Captured desktop: ${t.name}`);
    }
  }

  // 2. Mobile capture
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const mobilePrecision = await mobilePage.$('#precision');
  if (mobilePrecision) {
    await mobilePage.evaluate(targetEl => {
      targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, mobilePrecision);
    await new Promise(r => setTimeout(r, 800));
    await mobilePrecision.screenshot({
      path: path.join(screenshotsDir, 'verify_mobile_precision.png')
    });
    console.log('Captured mobile: verify_mobile_precision.png');
  }

  const mobileSpotlight = await mobilePage.$('#spotlight-executive-crop');
  if (mobileSpotlight) {
    await mobilePage.evaluate(targetEl => {
      targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, mobileSpotlight);
    await new Promise(r => setTimeout(r, 800));
    await mobileSpotlight.screenshot({
      path: path.join(screenshotsDir, 'verify_mobile_spotlight_tight_space.png')
    });
    console.log('Captured mobile: verify_mobile_spotlight_tight_space.png');
  }

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
