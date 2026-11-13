const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function makeChatOg() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 1 });

  const imgPath = path.join(__dirname, '..', 'public', 'images', 'gentleman-hero-profile.jpg');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

  // Clean, focused square hero image
  await page.setContent(`
    <body style="margin:0;padding:0;background:#070A08;overflow:hidden;width:600px;height:600px;display:flex;align-items:center;justify-content:center;">
      <img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;object-position:center;" />
    </body>
  `);

  const outPath = path.join(__dirname, '..', 'public', 'images', 'hero-og-chat.jpg');
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 80 });

  const stats = fs.statSync(outPath);
  console.log('hero-og-chat.jpg created:', stats.size, 'bytes (600x600)');

  await browser.close();
}

makeChatOg().catch(console.error);
