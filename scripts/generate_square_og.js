const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function generateSquare() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });

  const imgPath = path.join(__dirname, '..', 'public', 'images', 'gentleman-hero-profile.jpg');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

  await page.setContent(`
    <body style="margin:0;padding:0;background:#000;overflow:hidden;width:800px;height:800px;">
      <img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;" />
    </body>
  `);

  const outPath = path.join(__dirname, '..', 'public', 'images', 'og-hero-square.jpg');
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 85 });
  console.log('Square OG image created:', fs.statSync(outPath).size, 'bytes');

  await browser.close();
}

generateSquare().catch(console.error);
