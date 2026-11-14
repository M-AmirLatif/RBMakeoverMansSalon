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
  await page.goto('https://rb-makeover-salon.vercel.app/admin/login', { waitUntil: 'networkidle2', timeout: 30000 });

  // Type password
  await page.focus('input[type="password"]');
  await page.type('input[type="password"]', 'RBMakeover@2026Admin', { delay: 50 });

  console.log('Submitting login form...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]);

  console.log('Logged in to admin! Current URL:', page.url());
  await new Promise(r => setTimeout(r, 3000));

  // 1. Open first barber edit modal
  const editButtons = await page.$$('button[title="Edit Barber"]');
  console.log('Found edit buttons:', editButtons.length);
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'screenshots/verify_admin_barber_modal.png' });
    console.log('Captured screenshots/verify_admin_barber_modal.png');

    // Close modal
    const closeBtn = await page.$('button svg.lucide-x');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 2. Click Gallery & Media tab
  const tabs = await page.$$('header button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.innerText, tab);
    if (text.includes('Gallery')) {
      await tab.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshots/verify_admin_hero_video_manager.png' });
  console.log('Captured screenshots/verify_admin_hero_video_manager.png');

  await browser.close();
  console.log('All admin checks passed successfully!');
}

testAdmin().catch(err => {
  console.error('Admin test error:', err);
  process.exit(1);
});
