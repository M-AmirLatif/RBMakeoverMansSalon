const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testForm() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#contact', { waitUntil: 'networkidle2' });

  // Type form fields using exact IDs
  await page.type('#form-name', 'Ali Khan');
  await page.type('#form-phone', '03211234567');
  await page.select('#form-service', "Men's Haircuts");
  await page.type('#form-date', '2026-12-01');
  await page.select('#form-time', '3:00 PM');
  await page.type('#form-message', 'First time visit.');

  const formValues = await page.evaluate(() => {
    const name = document.querySelector('#form-name').value;
    const phone = document.querySelector('#form-phone').value;
    const service = document.querySelector('#form-service').value;
    const time = document.querySelector('#form-time').value;
    return { name, phone, service, time };
  });

  console.log('Form test filled successfully:', formValues);

  // Click submit button
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 800));

  // Check if success state rendered
  const successState = await page.evaluate(() => {
    const successTitle = document.querySelector('h4');
    return successTitle ? successTitle.textContent : null;
  });

  console.log('Form submission result:', successState);
  await browser.close();
}

testForm().catch(console.error);
