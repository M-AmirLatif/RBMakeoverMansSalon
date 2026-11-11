const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'fixes');

async function test() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Mobile top & headline
  await page.screenshot({ path: path.join(outputDir, 'mobile_hero_headline.png') });
  console.log('Captured mobile_hero_headline.png');

  // 2. Scroll to mobile hero service rates
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outputDir, 'mobile_hero_services.png') });
  console.log('Captured mobile_hero_services.png');

  // 3. Scroll to team section to verify Select Barber & WhatsApp button alignment
  await page.evaluate(() => {
    const el = document.getElementById('team');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outputDir, 'team_buttons_mobile.png') });
  console.log('Captured team_buttons_mobile.png');

  // 4. Open mobile menu drawer
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));
  const hamburger = await page.$('button[aria-label="Open navigation menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outputDir, 'mobile_menu_drawer_visible.png') });
    console.log('Captured mobile_menu_drawer_visible.png');
  }

  // 5. Desktop Hero view
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_hero.png') });
  console.log('Captured desktop_hero.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
