const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'revision4');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  console.log('--- Desktop Verification (1440px) ---');

  // Verify Team Section Barbers count
  const barberCards = await page.$$('#team [data-barber-card]');
  console.log(`Found ${barberCards.length} barber cards in DOM`);

  // Verify Google Maps URL in Location Section
  const mapsLink = await page.$eval('a[href*="maps.app.goo.gl"]', el => el.href).catch(() => null);
  console.log(`Google Maps link found: ${mapsLink}`);

  // Capture Desktop Team Section
  const teamEl = await page.$('#team');
  if (teamEl) {
    await teamEl.screenshot({ path: path.join(outputDir, 'desktop_1440_team.png') });
    console.log('Captured desktop_1440_team.png');
  }

  // Click "Select Barber" on Asfand Imtiaz or Ijaz Bhai
  const selectBtns = await page.$$('#team button');
  let clicked = false;
  for (const btn of selectBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Select Barber')) {
      await btn.click();
      clicked = true;
      console.log('Clicked "Select Barber" button');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  // Check contact form barber select value
  const selectedBarberVal = await page.$eval('#form-barber', el => el.value).catch(() => null);
  const selectedBarberText = await page.$eval('#form-barber option:checked', el => el.textContent.trim()).catch(() => null);
  console.log(`Contact form selected barber: ${selectedBarberVal} (${selectedBarberText})`);

  // Capture Contact Section showing preselected barber
  const contactEl = await page.$('#contact');
  if (contactEl) {
    await contactEl.screenshot({ path: path.join(outputDir, 'desktop_1440_contact_selected.png') });
    console.log('Captured desktop_1440_contact_selected.png');
  }

  // Capture Location Section
  const locationEl = await page.$('#location');
  if (locationEl) {
    await locationEl.screenshot({ path: path.join(outputDir, 'desktop_1440_location.png') });
    console.log('Captured desktop_1440_location.png');
  }

  // --- Mobile 390px ---
  console.log('--- Mobile Verification (390px) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Check horizontal overflow
  const hasHorizontalScroll = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 390px horizontal scroll detected: ${hasHorizontalScroll} (scrollWidth=${await mobilePage.evaluate(() => document.documentElement.scrollWidth)})`);

  // Mobile Team Section
  const mobileTeamEl = await mobilePage.$('#team');
  if (mobileTeamEl) {
    await mobileTeamEl.screenshot({ path: path.join(outputDir, 'mobile_390_team.png') });
    console.log('Captured mobile_390_team.png');
  }

  // Click "Select Barber" on mobile
  const mobileSelectBtns = await mobilePage.$$('#team button');
  for (const btn of mobileSelectBtns) {
    const text = await mobilePage.evaluate(el => el.textContent, btn);
    if (text && text.includes('Select Barber')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Mobile Contact Section
  const mobileContactEl = await mobilePage.$('#contact');
  if (mobileContactEl) {
    await mobileContactEl.screenshot({ path: path.join(outputDir, 'mobile_390_contact_selected.png') });
    console.log('Captured mobile_390_contact_selected.png');
  }

  // Mobile Location Section
  const mobileLocationEl = await mobilePage.$('#location');
  if (mobileLocationEl) {
    await mobileLocationEl.screenshot({ path: path.join(outputDir, 'mobile_390_location.png') });
    console.log('Captured mobile_390_location.png');
  }

  // Mobile 360px check
  await mobilePage.setViewport({ width: 360, height: 740 });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  const hasHorizontalScroll360 = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 360px horizontal scroll detected: ${hasHorizontalScroll360} (scrollWidth=${await mobilePage.evaluate(() => document.documentElement.scrollWidth)})`);

  await browser.close();
  console.log('--- Verification Complete ---');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
