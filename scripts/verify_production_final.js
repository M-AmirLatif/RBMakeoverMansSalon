const puppeteer = require('puppeteer-core');

async function verifyProduction() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to live production site...');
  await page.goto('https://rb-makeover-salon.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Part 1: First slot video check
  const firstSlotVideo = await page.$('#hero video');
  console.log('Part 1 First Hero Slot Video present:', !!firstSlotVideo);
  await page.screenshot({ path: 'screenshots/verify_part1_video_live.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  console.log('Captured screenshots/verify_part1_video_live.png');

  // 2. Part 2: Second slot barber craft image check
  const part2BarberImg = await page.$('img[src*="hero-barber-craft"]');
  console.log('Part 2 Barber Craft Photo present:', !!part2BarberImg);

  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'screenshots/verify_part2_photo_live.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  console.log('Captured screenshots/verify_part2_photo_live.png');

  // 3. Test Navbar Click Smooth Scroll to #services
  console.log('Testing navbar smooth scroll to #services...');
  const servicesLink = await page.$('nav a[href="#services"]');
  if (servicesLink) {
    await servicesLink.click();
    await new Promise(r => setTimeout(r, 1500));
    const scrollPos = await page.evaluate(() => window.scrollY);
    console.log('Scrolled to position:', scrollPos);
    await page.screenshot({ path: 'screenshots/verify_nav_scroll_services.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  }

  await browser.close();
  console.log('Production verification complete!');
}

verifyProduction().catch(err => {
  console.error('Verify error:', err);
  process.exit(1);
});
