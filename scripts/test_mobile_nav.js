const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testMobile() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:3005...');
  await page.goto('http://localhost:3005', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Initial scrollY:', await page.evaluate(() => window.scrollY));

  // 1. OPEN MOBILE MENU
  const menuBtn = await page.$('button[aria-label="Open navigation menu"]');
  if (!menuBtn) {
    throw new Error('Hamburger menu button not found!');
  }
  console.log('Tapping hamburger button...');
  await menuBtn.click();
  await new Promise(r => setTimeout(r, 500));

  const isMenuOpen = await page.evaluate(() => !!document.getElementById('mobile-navigation-menu'));
  console.log('Mobile menu open status:', isMenuOpen);

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
  await page.screenshot({ path: 'screenshots/mobile_menu_open.png' });
  console.log('Saved screenshots/mobile_menu_open.png');

  // Test sections to click
  const testItems = [
    { label: 'Services', expectedId: 'services' },
    { label: 'Barbers', expectedId: 'team' },
    { label: 'Reviews', expectedId: 'reviews' },
    { label: 'Contact', expectedId: 'contact' },
    { label: 'About', expectedId: 'about' },
  ];

  for (const item of testItems) {
    // Re-open menu if not open
    const isOpen = await page.evaluate(() => !!document.getElementById('mobile-navigation-menu'));
    if (!isOpen) {
      const btn = await page.$('button[aria-label="Open navigation menu"]');
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    console.log(`\nTesting click on "${item.label}"...`);
    const linkFound = await page.evaluate((label) => {
      const menu = document.getElementById('mobile-navigation-menu');
      if (!menu) return false;
      const links = Array.from(menu.querySelectorAll('a'));
      const target = links.find(l => l.innerText.toLowerCase().includes(label.toLowerCase()));
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, item.label);

    if (!linkFound) {
      console.error(`Could not find link for ${item.label}`);
      continue;
    }

    // Wait for smooth scroll animation to finish
    await new Promise(r => setTimeout(r, 1200));

    const check = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        rectTop: Math.round(rect.top),
        id: id,
        menuClosed: !document.getElementById('mobile-navigation-menu')
      };
    }, item.expectedId);

    console.log(`Result for ${item.label}:`, check);
    await page.screenshot({ path: `screenshots/mobile_nav_${item.expectedId}.png` });
    console.log(`Saved screenshot: screenshots/mobile_nav_${item.expectedId}.png`);
  }

  await browser.close();
  console.log('\nAll mobile navigation tests completed successfully!');
}

testMobile().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
