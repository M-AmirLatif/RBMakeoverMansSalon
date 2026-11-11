const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'mobile_390', width: 390, height: 844, isMobile: true },
    { name: 'tablet_768', width: 768, height: 1024, isMobile: false },
    { name: 'desktop_1440', width: 1440, height: 900, isMobile: false },
    { name: 'desktop_1920', width: 1920, height: 1080, isMobile: false },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Capture hero viewport
    await page.screenshot({ path: path.join(outputDir, `${vp.name}_hero.png`) });

    // Capture full page
    await page.screenshot({ path: path.join(outputDir, `${vp.name}_full.png`), fullPage: true });

    await page.close();
    console.log(`Captured ${vp.name}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
