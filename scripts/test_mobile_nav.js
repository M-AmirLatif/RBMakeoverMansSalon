const puppeteer = require('puppeteer-core');

async function testMobile() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Initial scrollY:', await page.evaluate(() => window.scrollY));

  // Find hamburger button
  const menuBtn = await page.$('button[aria-label="Open navigation menu"]');
  if (menuBtn) {
    console.log('Clicking hamburger...');
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Get current menu state
    const links = await page.evaluate(() => {
      const el = document.getElementById('mobile-navigation-menu');
      if (!el) return [];
      return Array.from(el.querySelectorAll('a')).map(a => ({ text: a.innerText.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') }));
    });
    console.log('Menu links on live site:', links);

    // Click Services link
    const servicesHandle = await page.evaluateHandle(() => {
      const el = document.getElementById('mobile-navigation-menu');
      return Array.from(el.querySelectorAll('a')).find(a => a.textContent.includes('Services'));
    });

    if (servicesHandle) {
      console.log('Clicking Services link in mobile menu...');
      await servicesHandle.click();
      await new Promise(r => setTimeout(r, 3000));

      const afterScrollY = await page.evaluate(() => window.scrollY);
      const servicesRect = await page.evaluate(() => {
        const el = document.getElementById('services');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, y: r.y, offsetTop: el.offsetTop };
      });
      console.log('After click scrollY:', afterScrollY);
      console.log('Services rect:', servicesRect);
      await page.screenshot({ path: 'screenshots/verify_mobile_nav_click_services.png' });
      console.log('Screenshot saved to screenshots/verify_mobile_nav_click_services.png');
    }
  }

  await browser.close();
}

testMobile().catch(console.error);
