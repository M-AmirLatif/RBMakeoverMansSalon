const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'revision3');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function scrollPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 200);
    });
  });
  await new Promise(r => setTimeout(r, 600));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop 1440px
  console.log('--- Capturing Desktop 1440px ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Hero viewport capture
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_1440_hero.png') });
  console.log('Captured desktop_1440_hero.png');

  // Scroll 400px steps with 200ms wait
  await scrollPage(desktopPage);

  // Full page capture
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_1440_full.png'), fullPage: true });
  console.log('Captured desktop_1440_full.png');

  // Individual desktop sections
  const sections = ['hero', 'about', 'why-us', 'gallery', 'reviews', 'team', 'facilities', 'contact'];
  for (const s of sections) {
    const el = await desktopPage.$('#' + s);
    if (el) {
      await el.screenshot({ path: path.join(outputDir, `desktop_1440_section_${s}.png`) });
      console.log(`Captured desktop_1440_section_${s}.png`);
    }
  }

  // Services tab 1, 2, 3, 4 captures
  const tabs = ['haircuts', 'beard', 'facial', 'grooming'];
  const tabButtons = await desktopPage.$$('#services button[role="tab"]');
  for (let i = 0; i < tabButtons.length; i++) {
    await tabButtons[i].click();
    await new Promise(r => setTimeout(r, 400));
    const sEl = await desktopPage.$('#services');
    if (sEl) {
      await sEl.screenshot({ path: path.join(outputDir, `desktop_1440_services_tab_${tabs[i]}.png`) });
      console.log(`Captured desktop_1440_services_tab_${tabs[i]}.png`);
    }
  }

  await desktopPage.close();

  // 2. Mobile 390px
  console.log('--- Capturing Mobile 390px ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true });
  await mobilePage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Mobile hero viewport
  await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_390_hero.png') });
  console.log('Captured mobile_390_hero.png');

  // Scroll in steps
  await scrollPage(mobilePage);

  // Mobile full page
  await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_390_full.png'), fullPage: true });
  console.log('Captured mobile_390_full.png');

  // Mobile Services & Gallery sections
  const mobileSections = ['hero', 'services', 'gallery', 'reviews', 'facilities'];
  for (const s of mobileSections) {
    const el = await mobilePage.$('#' + s);
    if (el) {
      await el.screenshot({ path: path.join(outputDir, `mobile_390_section_${s}.png`) });
      console.log(`Captured mobile_390_section_${s}.png`);
    }
  }

  await mobilePage.close();

  // 3. Check 360px and 430px for overflow
  console.log('--- Testing 360px and 430px viewports ---');
  for (const width of [360, 430]) {
    const p = await browser.newPage();
    await p.setViewport({ width, height: 800, isMobile: true });
    await p.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const hasHorizontalOverflow = await p.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Viewport ${width}px overflow test:`, hasHorizontalOverflow ? 'FAIL (Overflow)' : 'PASS (No overflow)');
    await p.screenshot({ path: path.join(outputDir, `mobile_${width}_hero.png`) });
    await p.close();
  }

  await browser.close();
  console.log('=== ALL SCREENSHOTS CAPTURED IN PRODUCTION MODE ===');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
