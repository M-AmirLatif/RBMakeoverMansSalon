const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '..', 'screenshots');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Scroll down smoothly through the page to trigger all lazy loading
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  });

  // Wait for all lazy images to finish decoding/loading
  await new Promise(r => setTimeout(r, 2000));

  const sections = ['services', 'gallery', 'facilities', 'contact'];
  for (const s of sections) {
    const el = await page.$('#' + s);
    if (el) {
      await el.screenshot({ path: path.join(outputDir, `section_${s}.png`) });
      console.log(`Captured section: ${s}`);
    }
  }

  await browser.close();
  console.log('Sections re-captured successfully with loaded images!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
