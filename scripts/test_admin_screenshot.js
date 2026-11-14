const puppeteer = require('puppeteer-core');

async function testAdmin() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to admin login...');
  await page.goto('https://rb-makeover-salon.vercel.app/admin/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.type('input[type="password"]', 'RBMakeover@2026Admin', { delay: 50 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 45000 }),
    page.click('button[type="submit"]')
  ]);
  console.log('Logged into admin, waiting for data...');
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: 'screenshots/verify_admin_barbers_with_photo.png' });
  console.log('SUCCESS: verify_admin_barbers_with_photo.png created');

  await browser.close();
}

testAdmin().catch(console.error);
