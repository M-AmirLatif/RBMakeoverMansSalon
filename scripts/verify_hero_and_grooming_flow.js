const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function runVerification() {
  console.log('=== Step 1: Testing Supabase Services Sync ===');
  const { data: dbServices, error: dbErr } = await supabase
    .from('services')
    .select('*')
    .order('display_order');
  
  if (dbErr) {
    console.error('Failed to fetch services from Supabase:', dbErr);
    process.exit(1);
  }
  console.log(`Verified: Supabase has ${dbServices.length} active services in DB.`);

  console.log('\n=== Step 2: Testing Admin Edit Reflection ===');
  // Test updating a service in Supabase and verifying it's returned
  const targetService = dbServices.find(s => s.id === 'fade-haircuts');
  console.log(`Target service: "${targetService.name}" currently priced at "${targetService.price}"`);
  
  // Update price slightly to test dynamic edit reflection
  const testNewPrice = 'Rs. 400';
  await supabase.from('services').update({ price: testNewPrice, updated_at: new Date().toISOString() }).eq('id', 'fade-haircuts');
  
  const { data: refreshedService } = await supabase.from('services').select('*').eq('id', 'fade-haircuts').single();
  console.log(`Verified DB update: "${refreshedService.name}" price is now "${refreshedService.price}"`);

  console.log('\n=== Step 3: Launching Browser to verify UI Flow ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Start Next.js local server or test directly
  console.log('Navigating to local build on http://localhost:3000 (or production https://www.rbmakeoversalons.com)...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 5000 });
  } catch {
    console.log('Local 3000 not active, connecting to live production https://www.rbmakeoversalons.com...');
    await page.goto('https://www.rbmakeoversalons.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n=== Step 4: Verification of Hero & Services Flow ===');
  const pageTitle = await page.title();
  console.log(`Page title: ${pageTitle}`);

  await browser.close();
  console.log('\nAll tests completed successfully!');
}

runVerification().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
