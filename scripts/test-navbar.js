const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const links = await page.$$eval('nav a', els => els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') })));
  console.log('Desktop Nav Links:', links);

  await page.screenshot({ path: 'screenshots/noir_blade_revision/desktop_navbar_barbers.png' });
  await browser.close();
  console.log('Verified & Captured desktop_navbar_barbers.png');
})();
