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

  // Desktop capture
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await pageDesktop.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  await pageDesktop.screenshot({
    path: path.join(screenshotsDir, 'hero_gentleman_desktop.png'),
    clip: { x: 0, y: 0, width: 1440, height: 950 }
  });

  // Mobile capture
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await pageMobile.screenshot({
    path: path.join(screenshotsDir, 'hero_gentleman_mobile.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });

  // Scroll down mobile to show between card 1 and card 2
  await pageMobile.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 600));
  await pageMobile.screenshot({
    path: path.join(screenshotsDir, 'hero_gentleman_mobile_scrolled.png')
  });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
