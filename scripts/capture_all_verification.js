const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // 1. Mobile View (390 x 844)
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));
    
    // Screenshot mobile hero
    await mobilePage.screenshot({ path: path.join(screenshotsDir, 'v_mobile_hero.png') });
    console.log('Saved v_mobile_hero.png');
    
    // Gap 1: Quiff
    const elQuiff = await mobilePage.$('#showcase-quiff-taper');
    if (elQuiff) {
      await mobilePage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), elQuiff);
      await new Promise(r => setTimeout(r, 600));
      await mobilePage.screenshot({ path: path.join(screenshotsDir, 'v_mobile_gap1_quiff.png') });
      console.log('Saved v_mobile_gap1_quiff.png');
    }

    // Gap 3: Drop fade
    const elDrop = await mobilePage.$('#showcase-razor-dropfade');
    if (elDrop) {
      await mobilePage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), elDrop);
      await new Promise(r => setTimeout(r, 600));
      await mobilePage.screenshot({ path: path.join(screenshotsDir, 'v_mobile_gap3_dropfade.png') });
      console.log('Saved v_mobile_gap3_dropfade.png');
    }

    // Gap 4: Royal beard
    const elBeard = await mobilePage.$('#showcase-pompadour-beard');
    if (elBeard) {
      await mobilePage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), elBeard);
      await new Promise(r => setTimeout(r, 600));
      await mobilePage.screenshot({ path: path.join(screenshotsDir, 'v_mobile_gap4_beard.png') });
      console.log('Saved v_mobile_gap4_beard.png');
    }

    // 2. Desktop View (1440 x 900)
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    await desktopPage.screenshot({ path: path.join(screenshotsDir, 'v_desktop_hero.png') });
    console.log('Saved v_desktop_hero.png');

    const elDropDesktop = await desktopPage.$('#showcase-razor-dropfade');
    if (elDropDesktop) {
      await desktopPage.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), elDropDesktop);
      await new Promise(r => setTimeout(r, 600));
      await desktopPage.screenshot({ path: path.join(screenshotsDir, 'v_desktop_showcase.png') });
      console.log('Saved v_desktop_showcase.png');
    }

    console.log('All verification screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
