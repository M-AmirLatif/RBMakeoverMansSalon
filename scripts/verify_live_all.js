const puppeteer = require('puppeteer-core');

async function verifyAll() {
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
  await new Promise(r => setTimeout(r, 2000));

  // 1. Check Hero Part 1 image & Part 2 video
  const heroPart1Img = await page.$('img[src*="gentleman-hero-cutout"]');
  console.log('Hero Part 1 Gentleman cutout image loaded:', !!heroPart1Img);

  // Scroll to Part 2
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  const heroPart2Video = await page.$('video');
  console.log('Hero Part 2 Video player loaded:', !!heroPart2Video);

  // 2. Scroll to Textured Quiff Showcase (media_1794563049012_1ef9c0ba.png fix)
  await page.evaluate(() => {
    const el = document.getElementById('showcase-quiff-taper');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/verify_live_quiff_showcase.png' });
  console.log('Captured screenshots/verify_live_quiff_showcase.png');

  // 3. Scroll to Executive Comb-over Showcase (media_1794563068857_46b8f585.png fix)
  await page.evaluate(() => {
    const el = document.getElementById('showcase-combover-razor');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/verify_live_combover_showcase.png' });
  console.log('Captured screenshots/verify_live_combover_showcase.png');

  // 4. Scroll to Gallery Section (media_1794563100181_29ab0879.jpg fix)
  await page.evaluate(() => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshots/verify_live_gallery.png' });
  console.log('Captured screenshots/verify_live_gallery.png');

  await browser.close();
  console.log('Verification done!');
}

verifyAll().catch(err => {
  console.error('Verify error:', err);
  process.exit(1);
});
