const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const LIVE_URL = 'https://rb-makeover-salon.vercel.app';

async function verifyLive() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log(`Navigating to ${LIVE_URL}...`);
    await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Check video
    const videoData = await page.evaluate(() => {
      const v = document.querySelector('video');
      if (!v) return null;
      return {
        currentSrc: v.currentSrc,
        autoplay: v.autoplay,
        loop: v.loop,
        muted: v.muted,
        paused: v.paused,
        readyState: v.readyState
      };
    });
    console.log('Hero Video Status on Live Site:', videoData);

    // 2. Check services on page
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasManiPedi = pageText.includes('Mani & Pedicure');
    const hasManicure = pageText.includes('Manicure');
    const hasPedicure = pageText.includes('Pedicure');
    const has2500 = pageText.includes('2,500');
    const has1500 = pageText.includes('1,500');

    console.log('Services Presence Check:', {
      hasManiPedi,
      hasManicure,
      hasPedicure,
      has2500,
      has1500
    });

    // Take screenshot of desktop hero with video and services
    const outDir = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    await page.screenshot({ path: path.join(outDir, 'live_hero_video_desktop.png') });
    console.log('Saved screenshots/live_hero_video_desktop.png');

    // 3. Check mobile view
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outDir, 'live_hero_video_mobile.png') });
    console.log('Saved screenshots/live_hero_video_mobile.png');

  } finally {
    await browser.close();
  }
}

verifyLive().catch(console.error);
