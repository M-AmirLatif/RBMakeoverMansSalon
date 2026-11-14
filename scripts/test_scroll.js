const puppeteer = require('puppeteer-core');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));

  const teamEl = await page.$('#team');
  const bbox = await teamEl.boundingBox();
  console.log('team bbox y:', bbox.y);

  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY - 100);
  }, bbox.y);

  await new Promise(r => setTimeout(r, 2000));
  const currentY = await page.evaluate(() => window.scrollY);
  console.log('Current scrollY:', currentY);

  await page.screenshot({ path: 'screenshots/verify_team_scrolled.png' });
  console.log('Saved screenshots/verify_team_scrolled.png');

  await browser.close();
}

test().catch(console.error);
