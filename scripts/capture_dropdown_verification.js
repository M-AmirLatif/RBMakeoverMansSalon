const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:3000#contact', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    const formEl = await page.$('#form-barber');
    if (formEl) {
      await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), formEl);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'verify_dropdown_arrows.png') });
      console.log('Saved verify_dropdown_arrows.png');
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
