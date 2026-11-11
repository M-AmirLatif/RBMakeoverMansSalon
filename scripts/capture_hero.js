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

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Spotlight 1: Skin Fade on Desktop
  const fadeEl = await page.$('#spotlight-skin-fade');
  if (fadeEl) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), fadeEl);
    await new Promise(r => setTimeout(r, 800));
    await fadeEl.screenshot({
      path: path.join(screenshotsDir, 'spotlight_skin_fade_desktop.png')
    });
  }

  // Spotlight 5: Facial Skincare on Desktop
  const facialEl = await page.$('#spotlight-facial');
  if (facialEl) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), facialEl);
    await new Promise(r => setTimeout(r, 800));
    await facialEl.screenshot({
      path: path.join(screenshotsDir, 'spotlight_facial_desktop.png')
    });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
