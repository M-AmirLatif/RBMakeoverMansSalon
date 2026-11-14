const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

  console.log('Navigating to live site...');
  await page.goto('https://www.rbmakeoversalons.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Check what is visible in viewport
  const visibilityReport = await page.evaluate(() => {
    const elAtCenter = document.elementFromPoint(720, 450);
    const hero = document.getElementById('hero');
    return {
      elementInCenter: elAtCenter ? { tag: elAtCenter.tagName, id: elAtCenter.id, class: elAtCenter.className } : null,
      heroStyles: hero ? {
        display: window.getComputedStyle(hero).display,
        visibility: window.getComputedStyle(hero).visibility,
        opacity: window.getComputedStyle(hero).opacity,
        height: hero.getBoundingClientRect().height,
        top: hero.getBoundingClientRect().top
      } : null,
      firstHeading: document.querySelector('h1') ? {
        text: document.querySelector('h1').innerText,
        top: document.querySelector('h1').getBoundingClientRect().top,
        opacity: window.getComputedStyle(document.querySelector('h1')).opacity,
        color: window.getComputedStyle(document.querySelector('h1')).color
      } : null
    };
  });

  console.log('Visibility Report:', JSON.stringify(visibilityReport, null, 2));
  await page.screenshot({ path: 'screenshots/debug_viewport.png' });
  await browser.close();
}

test().catch(console.error);
