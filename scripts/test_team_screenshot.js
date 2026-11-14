const puppeteer = require('puppeteer-core');

async function testTeam() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Opening homepage...');
  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    const el = document.getElementById('team');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'screenshots/verify_team_qasim_photo.png' });
  console.log('SUCCESS: verify_team_qasim_photo.png created');

  await browser.close();
}

testTeam().catch(console.error);
