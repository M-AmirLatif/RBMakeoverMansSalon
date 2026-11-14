const puppeteer = require('puppeteer-core');

async function testSave() {
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
  await page.type('input[type="password"]', 'RBMakeover@2026Admin', { delay: 50 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]);

  console.log('Logged in successfully, waiting for dashboard data...');
  await new Promise(r => setTimeout(r, 2500));

  // Find Edit Barber button
  const buttons = await page.$$('button');
  let clickedEdit = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Edit Barber')) {
      await btn.click();
      clickedEdit = true;
      console.log('Clicked Edit Barber button!');
      break;
    }
  }

  if (!clickedEdit) {
    console.log('Edit Barber button not found!');
    await browser.close();
    return;
  }

  await new Promise(r => setTimeout(r, 1500));

  // In modal, find Save Changes button and click it
  const modalButtons = await page.$$('button');
  let clickedSave = false;
  for (const btn of modalButtons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Save Changes')) {
      console.log('Found Save Changes button, clicking...');
      await btn.click();
      clickedSave = true;
      break;
    }
  }

  if (clickedSave) {
    console.log('Waiting for toast and save operation...');
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: 'screenshots/verify_barber_saved_success.png' });
    console.log('Saved screenshots/verify_barber_saved_success.png');
  }

  // Also check public site #team
  console.log('Checking public team section...');
  await page.goto('https://rb-makeover-salon.vercel.app/#team', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshots/verify_public_team_photo.png' });
  console.log('Saved screenshots/verify_public_team_photo.png');

  await browser.close();
  console.log('All tests completed.');
}

testSave().catch(console.error);
