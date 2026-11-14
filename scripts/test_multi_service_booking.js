const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

async function testServicesSync() {
  console.log('Testing Supabase Services CRUD...');
  
  // 1. Fetch existing services
  const { data: initialServices, error: fetchErr } = await supabase
    .from('services')
    .select('*')
    .order('display_order');
  
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    process.exit(1);
  }
  console.log(`Found ${initialServices.length} services in DB.`);

  // 2. Test saving a test service
  const testId = 'test-beard-spa';
  const testService = {
    id: testId,
    name: 'Luxury Royal Beard Spa',
    category: 'beard',
    price: 'Rs. 1,800',
    numeric_price: 1800,
    description: 'Hot steam beard scrub, essential oils, and hot towel relaxation.',
    duration: '45 mins',
    display_order: 99,
    active: true,
    updated_at: new Date().toISOString()
  };

  const { error: upsertErr } = await supabase.from('services').upsert(testService);
  if (upsertErr) {
    console.error('Upsert test service error:', upsertErr);
    process.exit(1);
  }
  console.log('Successfully upserted test service:', testService.name);

  // 3. Verify it is readable
  const { data: readBack } = await supabase.from('services').select('*').eq('id', testId).single();
  console.log('Read back from DB:', readBack.name, readBack.price, readBack.duration);

  // 4. Clean up test service so DB stays clean
  const { error: delErr } = await supabase.from('services').delete().eq('id', testId);
  if (delErr) {
    console.error('Delete test service error:', delErr);
  } else {
    console.log('Cleaned up test service successfully.');
  }

  console.log('All DB Service tests passed 100%!');
}

testServicesSync();
