const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'noir_blade_revision');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('--- Desktop 1440px ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Desktop Hero
  const heroEl = await desktopPage.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(outputDir, 'desktop_1440_hero.png') });
    console.log('Captured desktop_1440_hero.png');
  }

  // 2. Desktop Precision in Every Cut
  const precisionEl = await desktopPage.$('#precision');
  if (precisionEl) {
    await precisionEl.screenshot({ path: path.join(outputDir, 'desktop_1440_precision.png') });
    console.log('Captured desktop_1440_precision.png');
  }

  // 3. Desktop Services / Grooming Menu
  const servicesEl = await desktopPage.$('#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(outputDir, 'desktop_1440_services.png') });
    console.log('Captured desktop_1440_services.png');
  }

  // 4. Desktop About Us
  const aboutEl = await desktopPage.$('#about');
  if (aboutEl) {
    await aboutEl.screenshot({ path: path.join(outputDir, 'desktop_1440_about.png') });
    console.log('Captured desktop_1440_about.png');
  }

  // 5. Desktop Testimonials with Centerpiece Chair
  const reviewsEl = await desktopPage.$('#reviews');
  if (reviewsEl) {
    await reviewsEl.screenshot({ path: path.join(outputDir, 'desktop_1440_testimonials.png') });
    console.log('Captured desktop_1440_testimonials.png');
  }

  // 6. Desktop Team Roster
  const teamEl = await desktopPage.$('#team');
  if (teamEl) {
    await teamEl.screenshot({ path: path.join(outputDir, 'desktop_1440_team.png') });
    console.log('Captured desktop_1440_team.png');
  }

  // 7. Full Page Desktop Capture
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_1440_fullpage.png'), fullPage: true });
  console.log('Captured desktop_1440_fullpage.png');

  console.log('--- Mobile 390px ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Check horizontal overflow
  const hasHorizontalScroll = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 390px horizontal scroll: ${hasHorizontalScroll} (width: ${await mobilePage.evaluate(() => document.documentElement.scrollWidth)})`);

  // Mobile Hero
  const mobileHero = await mobilePage.$('#hero');
  if (mobileHero) {
    await mobileHero.screenshot({ path: path.join(outputDir, 'mobile_390_hero.png') });
    console.log('Captured mobile_390_hero.png');
  }

  // Mobile Precision
  const mobilePrecision = await mobilePage.$('#precision');
  if (mobilePrecision) {
    await mobilePrecision.screenshot({ path: path.join(outputDir, 'mobile_390_precision.png') });
    console.log('Captured mobile_390_precision.png');
  }

  // Mobile Services
  const mobileServices = await mobilePage.$('#services');
  if (mobileServices) {
    await mobileServices.screenshot({ path: path.join(outputDir, 'mobile_390_services.png') });
    console.log('Captured mobile_390_services.png');
  }

  // Mobile Testimonials
  const mobileReviews = await mobilePage.$('#reviews');
  if (mobileReviews) {
    await mobileReviews.screenshot({ path: path.join(outputDir, 'mobile_390_testimonials.png') });
    console.log('Captured mobile_390_testimonials.png');
  }

  // Mobile 360px check
  await mobilePage.setViewport({ width: 360, height: 740 });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  const hasHorizontalScroll360 = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 360px horizontal scroll: ${hasHorizontalScroll360}`);

  await browser.close();
  console.log('--- Visual Capture Finished ---');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
