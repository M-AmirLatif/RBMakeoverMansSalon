const puppeteer = require('puppeteer-core');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.rbmakeoversalons.com', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  const debug = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    if (!hero) return { error: 'no hero' };
    const h1 = hero.querySelector('h1');
    const images = Array.from(hero.querySelectorAll('img')).map(img => ({
      src: img.src,
      rect: { top: img.getBoundingClientRect().top, bottom: img.getBoundingClientRect().bottom, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height }
    }));
    const childDivs = Array.from(hero.children).map(c => ({
      tag: c.tagName,
      className: c.className.slice(0, 50),
      rect: { top: c.getBoundingClientRect().top, bottom: c.getBoundingClientRect().bottom, height: c.getBoundingClientRect().height }
    }));
    return {
      heroRect: { top: hero.getBoundingClientRect().top, bottom: hero.getBoundingClientRect().bottom, height: hero.getBoundingClientRect().height },
      h1: h1 ? { text: h1.innerText, top: h1.getBoundingClientRect().top } : null,
      images,
      childDivs
    };
  });
  console.log('DEBUG RESULT:', JSON.stringify(debug, null, 2));
  await browser.close();
}
main().catch(console.error);
