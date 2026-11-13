const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function generateOgImage() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  // Read the gentleman image as base64 so it renders with 0 latency
  const imgPath = path.join(__dirname, '..', 'public', 'images', 'gentleman-hero-profile.jpg');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background-color: #070A08;
      color: #F5EFEB;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: hidden;
      display: flex;
      position: relative;
    }

    /* Ambient Gold Light */
    .glow {
      position: absolute;
      top: 50%;
      right: 25%;
      transform: translate(50%, -50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(197, 155, 70, 0.12) 0%, rgba(7, 10, 8, 0) 70%);
      pointer-events-none;
    }

    /* Left Side: Gentleman Image */
    .image-container {
      width: 560px;
      height: 630px;
      position: relative;
      flex-shrink: 0;
    }
    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 70% 30%;
    }
    .image-fade {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 160px;
      background: linear-gradient(to right, transparent, #070A08);
    }

    /* Right Side: Content */
    .content {
      flex: 1;
      padding: 56px 56px 56px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 10;
    }

    .brand-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #C59B46;
      margin-bottom: 12px;
    }
    .brand-eyebrow::before {
      content: '';
      display: inline-block;
      width: 28px;
      height: 2px;
      background: #C59B46;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      line-height: 1.15;
      color: #F5EFEB;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    h1 span {
      color: #C59B46;
      font-style: italic;
    }

    .tagline {
      font-size: 15px;
      color: #B8B0A2;
      margin-bottom: 24px;
      line-height: 1.4;
    }

    /* Services Card */
    .services-card {
      background: rgba(20, 28, 24, 0.7);
      border: 1px solid rgba(197, 155, 70, 0.25);
      border-radius: 16px;
      padding: 20px 24px;
      backdrop-filter: blur(10px);
    }

    .services-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #DFC074;
      margin-bottom: 12px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-size: 14px;
      color: #F5EFEB;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .service-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #C59B46;
      flex-shrink: 0;
    }

    .footer-badge {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
      font-size: 13px;
      color: #7A756B;
    }
    .footer-badge strong {
      color: #DFC074;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  
  <div class="image-container">
    <img src="${imgSrc}" alt="Gentleman Profile" />
    <div class="image-fade"></div>
  </div>

  <div class="content">
    <div class="brand-eyebrow">Executive Man's Salon</div>
    <h1>R.B Makeover <span>Salon</span></h1>
    <p class="tagline">Park View City, Rose Commercial • Main Boulevard, Lahore</p>

    <div class="services-card">
      <div class="services-title">Featured Services &amp; Direct Booking</div>
      <div class="services-grid">
        <div class="service-item"><span class="service-dot"></span>Haircuts &amp; Skin Fades</div>
        <div class="service-item"><span class="service-dot"></span>Beard Trimming &amp; Lineup</div>
        <div class="service-item"><span class="service-dot"></span>Professional Hot Towel Shave</div>
        <div class="service-item"><span class="service-dot"></span>Hair &amp; Beard Styling</div>
        <div class="service-item"><span class="service-dot"></span>Facial &amp; Skin Treatments</div>
        <div class="service-item"><span class="service-dot"></span>VIP Royal Grooming</div>
      </div>
    </div>

    <div class="footer-badge">
      <span>★ <strong>4.9 / 5.0 Rating</strong> (36 Google Reviews)</span>
      <span>•</span>
      <span>10 Master Barbers Available</span>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const outPath1 = path.join(__dirname, '..', 'public', 'images', 'og-share-card.jpg');
  const outPath2 = path.join(__dirname, '..', 'public', 'og-image.jpg');
  const outPath3 = path.join(__dirname, '..', 'src', 'app', 'opengraph-image.jpg');

  // Screenshot at 85% quality to keep under 200KB (perfect for WhatsApp)
  await page.screenshot({ path: outPath1, type: 'jpeg', quality: 85 });
  fs.copyFileSync(outPath1, outPath2);
  fs.copyFileSync(outPath1, outPath3);

  const stats = fs.statSync(outPath1);
  console.log(`Generated OG Share Card: ${outPath1} (${stats.size} bytes)`);

  await browser.close();
}

generateOgImage().catch(console.error);
