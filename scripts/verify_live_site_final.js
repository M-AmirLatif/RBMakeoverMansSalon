const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testLive() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to live site...');
  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Check Part 1: Gentleman cutout image
  const gentlemanImg = await page.$('img[src*="gentleman-hero-cutout"]');
  console.log('Gentleman cutout present in Part 1:', !!gentlemanImg);

  // Check Part 2: Video
  const videoElements = await page.$$('video');
  console.log('Total video elements on page:', videoElements.length);

  // Take screenshot of Hero Part 1
  await page.screenshot({ path: 'screenshots/final_part1_gentleman.png', clip: { x: 0, y: 0, width: 1440, height: 950 } });
  console.log('Captured screenshots/final_part1_gentleman.png');

  // Scroll to Part 2
  await page.evaluate(() => window.scrollBy(0, 750));
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshots/final_part2_video.png', clip: { x: 0, y: 0, width: 1440, height: 950 } });
  console.log('Captured screenshots/final_part2_video.png');

  // Check rates in rates table
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('Contains "Mani & Pedicure":', pageText.includes('Mani & Pedicure'));
  console.log('Contains "2,500":', pageText.includes('2,500') || pageText.includes('2500'));
  console.log('Contains "Manicure":', pageText.includes('Manicure'));
  console.log('Contains "Pedicure":', pageText.includes('Pedicure'));

  await browser.close();
}

testLive().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
