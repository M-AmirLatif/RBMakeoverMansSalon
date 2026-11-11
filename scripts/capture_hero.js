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
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const targets = [
    { id: '#spotlight-executive-crop', name: 'spotlight_1_executive_crop.png' },
    { id: '#precision', name: 'precision_center_cutout.png' },
    { id: '#spotlight-scalp', name: 'spotlight_7_scalp_therapy.png' },
    { id: '#spotlight-keratin', name: 'spotlight_9_keratin_silk.png' },
    { id: '#spotlight-razor-lineup', name: 'spotlight_11_razor_lineup.png' },
    { id: '#spotlight-executive-finish', name: 'spotlight_12_executive_finish.png' }
  ];

  for (const t of targets) {
    const el = await page.$(t.id);
    if (el) {
      await page.evaluate(targetEl => {
        targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, el);
      
      // Wait for image within element to load
      await page.evaluate(async (selector) => {
        const container = document.querySelector(selector);
        if (!container) return;
        const img = container.querySelector('img');
        if (img && !img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 2000);
          });
        }
      }, t.id);

      await new Promise(r => setTimeout(r, 600));

      await el.screenshot({
        path: path.join(screenshotsDir, t.name)
      });
      console.log(`Captured ${t.name}`);
    }
  }

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
