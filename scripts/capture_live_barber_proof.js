const puppeteer = require('puppeteer-core');

async function captureProof() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check admin dashboard
  console.log('Navigating to admin login...');
  await page.goto('https://rb-makeover-salon.vercel.app/admin/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.type('input[type="password"]', 'RBMakeover@2026Admin', { delay: 50 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]);
  console.log('Waiting on admin dashboard...');
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'screenshots/verify_admin_barbers_list.png' });
  console.log('Saved screenshots/verify_admin_barbers_list.png');

  // 2. Check public team section
  console.log('Navigating to homepage...');
  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Scroll to team
  await page.evaluate(() => {
    const el = document.getElementById('team');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'screenshots/verify_team_qasim_photo.png' });
  console.log('Saved screenshots/verify_team_qasim_photo.png');

  await browser.close();
  console.log('Done.');
}

captureProof().catch(console.error);
