const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto('https://rb-makeover-salon.vercel.app/admin/login', { waitUntil: 'domcontentloaded' });
  const hasLogoBadge = await page.evaluate(() => !!document.querySelector('img[src*="rb-makeover-logo-badge"]'));
  console.log('Admin login has new badge logo:', hasLogoBadge);
  await browser.close();
}
run().catch(console.error);
