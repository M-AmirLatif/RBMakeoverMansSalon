const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function updateOgBranding() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const logoBadgeBase64 = fs.readFileSync(path.join(__dirname, '..', 'public', 'images', 'rb-makeover-logo-badge.png')).toString('base64');
    const interiorBase64 = fs.readFileSync(path.join(__dirname, '..', 'public', 'images', 'about-interior-floor.webp')).toString('base64');

    // 1. Generate 600x600 hero-og-chat.jpg (Optimal for WhatsApp square preview)
    await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 1 });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width:600px; height:600px;
            background:#0B0F0D;
            position:relative;
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow:hidden;
          }
          .bg-photo {
            position:absolute; inset:0;
            background: url('data:image/webp;base64,${interiorBase64}') center/cover no-repeat;
            filter: brightness(0.25) saturate(1.2);
          }
          .card {
            position:relative; z-index:10;
            display:flex; flex-direction:column; align-items:center; text-align:center;
            padding:30px;
          }
          .logo {
            width:220px; height:220px;
            border-radius:50%;
            border:3px solid #C59B46;
            box-shadow: 0 0 40px rgba(197,155,70,0.5);
            margin-bottom:24px;
          }
          h1 {
            color:#F5EFEB; font-size:36px; font-weight:800; letter-spacing:3px;
            text-transform:uppercase; margin-bottom:8px;
          }
          .tag {
            color:#DFC074; font-size:16px; font-weight:600; letter-spacing:4px;
            text-transform:uppercase; margin-bottom:14px;
          }
          .loc {
            color:#A8A193; font-size:13px; letter-spacing:1px;
          }
        </style>
      </head>
      <body>
        <div class="bg-photo"></div>
        <div class="card">
          <img class="logo" src="data:image/png;base64,${logoBadgeBase64}" />
          <h1>R.B Makeover</h1>
          <div class="tag">Men's Luxury Salon</div>
          <div class="loc">Rose Commercial • Park View City Lahore</div>
        </div>
      </body>
      </html>
    `);

    const chatPath = path.join(__dirname, '..', 'public', 'images', 'hero-og-chat.jpg');
    await page.screenshot({ path: chatPath, type: 'jpeg', quality: 85 });
    console.log('Updated hero-og-chat.jpg');

    // 2. Generate 1200x630 og-share-card.jpg
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width:1200px; height:630px;
            background:#0B0F0D;
            position:relative;
            display:flex; align-items:center; justify-content:space-between;
            padding:60px 80px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow:hidden;
          }
          .bg-photo {
            position:absolute; inset:0;
            background: url('data:image/webp;base64,${interiorBase64}') center/cover no-repeat;
            filter: brightness(0.2) saturate(1.2);
          }
          .content {
            position:relative; z-index:10;
            max-width:680px;
          }
          .eyebrow {
            color:#C59B46; font-size:18px; font-weight:700; letter-spacing:5px;
            text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; gap:12px;
          }
          .line { width:40px; height:2px; background:#C59B46; }
          h1 {
            color:#F5EFEB; font-size:62px; font-weight:900; letter-spacing:4px;
            text-transform:uppercase; line-height:1.1; margin-bottom:16px;
          }
          p {
            color:#B8B0A2; font-size:22px; line-height:1.5; margin-bottom:24px;
          }
          .badge-row {
            display:flex; gap:16px;
          }
          .pill {
            background:rgba(20,28,24,0.85); border:1px solid #C59B46;
            color:#DFC074; font-size:15px; font-weight:600; padding:8px 18px; border-radius:30px;
          }
          .logo-box {
            position:relative; z-index:10;
            display:flex; align-items:center; justify-content:center;
          }
          .logo {
            width:320px; height:320px;
            border-radius:50%;
            border:4px solid #C59B46;
            box-shadow: 0 0 60px rgba(197,155,70,0.4);
          }
        </style>
      </head>
      <body>
        <div class="bg-photo"></div>
        <div class="content">
          <div class="eyebrow"><span class="line"></span> Park View City Lahore</div>
          <h1>R.B Makeover<br><span style="color:#C59B46;">Man's Salon</span></h1>
          <p>Haircuts, Beard Grooming, Mani & Pedicure, and Facial Skincare by 10 Master Barbers.</p>
          <div class="badge-row">
            <div class="pill">★ 4.9 Rated • 36 Reviews</div>
            <div class="pill">Rose Commercial</div>
          </div>
        </div>
        <div class="logo-box">
          <img class="logo" src="data:image/png;base64,${logoBadgeBase64}" />
        </div>
      </body>
      </html>
    `);

    const ogCardPath = path.join(__dirname, '..', 'public', 'images', 'og-share-card.jpg');
    await page.screenshot({ path: ogCardPath, type: 'jpeg', quality: 85 });
    console.log('Updated og-share-card.jpg');

  } finally {
    await browser.close();
  }
}

updateOgBranding().catch(console.error);
