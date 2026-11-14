const puppeteer = require('puppeteer-core');

async function testBarberModal() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://rb-makeover-salon.vercel.app/admin/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.type('input[type="password"]', 'RBMakeover@2026Admin', { delay: 50 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]);

  await new Promise(r => setTimeout(r, 2000));

  // Click Edit Barber
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Edit Barber')) {
      await btn.click();
      console.log('Clicked Edit Barber!');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'screenshots/verify_admin_barber_modal_perfect.png' });
  console.log('Captured screenshots/verify_admin_barber_modal_perfect.png');

  await browser.close();
}

testBarberModal().catch(console.error);
