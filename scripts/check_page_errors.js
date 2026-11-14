const puppeteer = require('puppeteer-core');

async function checkErrors() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}\nStack: ${err.stack}`);
  });

  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  // Check what is in the main element
  const mainHtml = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? { innerHTMLSnippet: main.innerHTML.slice(0, 500), childCount: main.children.length } : null;
  });

  console.log('Main element info:', JSON.stringify(mainHtml, null, 2));
  console.log('Captured errors count:', errors.length);
  errors.forEach(e => console.log(e));

  // Also take screenshot of top of the page (hero)
  await page.screenshot({ path: 'screenshots/verify_top_hero.png' });
  console.log('Saved screenshots/verify_top_hero.png');

  await browser.close();
}

checkErrors().catch(console.error);
