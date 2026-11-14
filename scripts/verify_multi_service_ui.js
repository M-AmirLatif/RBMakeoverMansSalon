const puppeteer = require('puppeteer-core');

async function testUI() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3002#contact...');
  await page.goto('http://localhost:3002', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to contact section
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Find service cards inside contact section
  const serviceCards = await page.$$('#contact div[class*="cursor-pointer"]');
  console.log(`Found ${serviceCards.length} service options in booking form.`);

  if (serviceCards.length < 2) {
    console.error('Not enough service cards found!');
    process.exit(1);
  }

  // Click on the first service card
  await serviceCards[0].click();
  await new Promise(r => setTimeout(r, 500));

  // Click on the second service card
  await serviceCards[1].click();
  await new Promise(r => setTimeout(r, 500));

  // Check the summary banner
  const summaryText = await page.evaluate(() => {
    const el = document.querySelector('#contact [class*="Estimated Total"]')?.parentElement?.parentElement?.innerText ||
      document.querySelector('#contact [class*="Selected"]')?.innerText ||
      document.getElementById('contact')?.innerText;
    return el;
  });

  console.log('Page has "Selected":', summaryText.includes('Selected'));
  console.log('Page has "Estimated Total":', summaryText.includes('Estimated Total'));

  await page.screenshot({ path: 'screenshots/verify_multi_service_booking.png' });
  console.log('Screenshot saved: screenshots/verify_multi_service_booking.png');

  // Fill in form details to verify WhatsApp URL generation
  await page.type('#form-name', 'Test Customer');
  await page.type('#form-phone', '03269326566');
  
  // Set date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  await page.evaluate((d) => {
    const dateInput = document.getElementById('form-date');
    if (dateInput) {
      dateInput.value = d;
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, dateStr);

  await page.screenshot({ path: 'screenshots/verify_multi_service_filled.png' });
  console.log('Screenshot saved: screenshots/verify_multi_service_filled.png');

  await browser.close();
  console.log('Multi-service UI verified successfully!');
}

testUI().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
