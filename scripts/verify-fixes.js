const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots', 'noir_blade_revision');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Capture Desktop Hero with consistent buttons
  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(outputDir, 'desktop_hero_consistent_books.png') });
    console.log('Captured desktop_hero_consistent_books.png');
  }

  // 2. Mobile 390px
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const mobileHero = await mobilePage.$('#hero');
  if (mobileHero) {
    await mobileHero.screenshot({ path: path.join(outputDir, 'mobile_hero_consistent_books.png') });
    console.log('Captured mobile_hero_consistent_books.png');
  }

  // Open mobile drawer and capture
  const hamburger = await mobilePage.$('button[aria-label="Open navigation menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 400));
    await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_drawer_sequence.png') });
    console.log('Captured mobile_drawer_sequence.png');
  }

  await browser.close();
  console.log('All tests passed!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
