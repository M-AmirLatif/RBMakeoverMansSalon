const puppeteer = require('puppeteer-core');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Barbers (10)" navbar link! That triggers the smooth scroll exactly like a user!
  const navLink = await page.evaluateHandle(() => {
    const links = Array.from(document.querySelectorAll('nav a, nav button'));
    return links.find(l => l.textContent.includes('Barbers'));
  });

  if (navLink) {
    console.log('Clicking Barbers navbar link...');
    await navLink.click();
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'screenshots/verify_team_via_nav_click.png' });
    console.log('Saved screenshots/verify_team_via_nav_click.png');
  }

  await browser.close();
}

test().catch(console.error);
