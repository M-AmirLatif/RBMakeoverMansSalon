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

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  const teamEl = await page.$('#team');
  console.log('#team exists:', !!teamEl);
  if (teamEl) {
    const bbox = await teamEl.boundingBox();
    console.log('#team bbox:', bbox);
    await page.evaluate(() => {
      document.getElementById('team').scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/verify_team_debug.png' });
    console.log('Saved screenshots/verify_team_debug.png');
  }

  await browser.close();
}

test().catch(console.error);
