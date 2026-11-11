const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'animations');

async function test() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  // 1. Desktop View with Hero + Marquee Ticker 1
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_hero_with_typewriter.png') });
  console.log('Captured desktop_hero_with_typewriter.png');

  // Scroll to Marquee Ticker 1 and Precision Section
  await desktopPage.evaluate(() => window.scrollBy(0, 750));
  await new Promise(r => setTimeout(r, 500));
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_marquee_ticker_1.png') });
  console.log('Captured desktop_marquee_ticker_1.png');

  // Scroll to Marquee Ticker 2 (between Reviews & Interior)
  await desktopPage.evaluate(() => {
    const el = document.getElementById('reviews');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await desktopPage.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 400));
  await desktopPage.screenshot({ path: path.join(outputDir, 'desktop_marquee_ticker_2.png') });
  console.log('Captured desktop_marquee_ticker_2.png');

  // 2. Mobile 390px View with Typewriter + Marquee
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_hero_with_typewriter.png') });
  console.log('Captured mobile_hero_with_typewriter.png');

  // Scroll mobile to Marquee Ticker 1
  await mobilePage.evaluate(() => window.scrollBy(0, 950));
  await new Promise(r => setTimeout(r, 500));
  await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_marquee_ticker_1.png') });
  console.log('Captured mobile_marquee_ticker_1.png');

  await browser.close();
  console.log('All animation screenshots captured successfully!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
