const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const inputPath = 'C:/Users/user/.gemini/antigravity/brain/28bfd25b-2b74-4698-b8b5-faea4a51bd51/.user_uploaded/media_1794550106307_281b580a.jpg';

async function processLogo() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync(inputPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c"></canvas>
      <script>
        const img = new Image();
        img.src = 'data:image/jpeg;base64,${imgBase64}';
        window.isReady = false;
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          const canvas = document.getElementById('c');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          window.imgWidth = w;
          window.imgHeight = h;
          window.isReady = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction('window.isReady === true');

  // Generate 1: Gold Logo with Transparent Background
  const goldBase64 = await page.evaluate(() => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    // Gold RGB: #DFC074 = (223, 192, 116)
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const brightness = (r + g + b) / 3;

      if (brightness > 225) {
        // pure background
        d[i + 3] = 0;
      } else {
        // Darkness determines alpha for smooth edges
        const alpha = Math.min(255, Math.max(0, (255 - brightness) * 1.3));
        d[i] = 223;     // R
        d[i + 1] = 192; // G
        d[i + 2] = 116; // B
        d[i + 3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  });

  const outGold = path.join(__dirname, '..', 'public', 'images', 'rb-makeover-logo-gold.png');
  fs.writeFileSync(outGold, Buffer.from(goldBase64, 'base64'));
  console.log('Saved Gold Logo:', outGold);

  // Generate 2: Circular Luxury Dark Emblem with Gold Border & Gold Artwork
  const badgeBase64 = await page.evaluate(() => {
    const origCanvas = document.getElementById('c');
    const badgeCanvas = document.createElement('canvas');
    const size = 512;
    badgeCanvas.width = size;
    badgeCanvas.height = size;
    const bCtx = badgeCanvas.getContext('2d');

    // Draw luxury dark background circle
    const center = size / 2;
    const radius = size / 2 - 8;

    // Dark gradient background
    const bgGrad = bCtx.createRadialGradient(center, center, 50, center, center, radius);
    bgGrad.addColorStop(0, '#141C18');
    bgGrad.addColorStop(0.85, '#0E1411');
    bgGrad.addColorStop(1, '#070A08');

    bCtx.beginPath();
    bCtx.arc(center, center, radius, 0, Math.PI * 2);
    bCtx.fillStyle = bgGrad;
    bCtx.fill();

    // Gold outer ring
    bCtx.lineWidth = 4;
    const ringGrad = bCtx.createLinearGradient(0, 0, size, size);
    ringGrad.addColorStop(0, '#DFC074');
    ringGrad.addColorStop(0.5, '#C59B46');
    ringGrad.addColorStop(1, '#9A752B');
    bCtx.strokeStyle = ringGrad;
    bCtx.stroke();

    // Inner subtle ring
    bCtx.beginPath();
    bCtx.arc(center, center, radius - 8, 0, Math.PI * 2);
    bCtx.lineWidth = 1.2;
    bCtx.strokeStyle = 'rgba(197, 155, 70, 0.4)';
    bCtx.stroke();

    // Draw the gold logo inside
    const pad = 36;
    bCtx.drawImage(origCanvas, pad, pad, size - pad * 2, size - pad * 2);

    return badgeCanvas.toDataURL('image/png').split(',')[1];
  });

  const outBadge = path.join(__dirname, '..', 'public', 'images', 'rb-makeover-logo-badge.png');
  fs.writeFileSync(outBadge, Buffer.from(badgeBase64, 'base64'));
  console.log('Saved Badge Logo:', outBadge);

  // Copy raw image too
  const outRaw = path.join(__dirname, '..', 'public', 'images', 'rb-makeover-logo-original.jpg');
  fs.copyFileSync(inputPath, outRaw);
  console.log('Saved Raw Logo:', outRaw);

  await browser.close();
}

processLogo().catch(console.error);
