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
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runAllCrudTests() {
  console.log('1. Signing in as admin...');
  const { data: auth, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'admin@rbmakeover.com',
    password: 'RBMakeover@2026Admin'
  });
  if (loginErr) {
    console.error('Login failed:', loginErr);
    return;
  }
  console.log('Logged in as user:', auth.user.id);

  // Test 1: Services UPDATE
  console.log('Test 1: Updating service "fade-haircuts"...');
  const { data: sData, error: sErr } = await supabase
    .from('services')
    .update({ price: 'Rs. 1,000' })
    .eq('id', 'fade-haircuts')
    .select();
  console.log('Service update result:', sData ? 'SUCCESS' : 'FAILED', sErr);

  // Test 2: Services INSERT
  console.log('Test 2: Inserting temp service...');
  const testServiceId = 'test-service-' + Date.now();
  const { data: sIns, error: sInsErr } = await supabase
    .from('services')
    .insert({
      id: testServiceId,
      name: 'Test Service',
      category: 'Haircuts & Styling',
      price: 'Rs. 999',
      numeric_price: 999,
      duration: '30 mins',
      description: 'Test description',
      display_order: 999
    })
    .select();
  console.log('Service insert result:', sIns ? 'SUCCESS' : 'FAILED', sInsErr);

  // Test 3: Services DELETE
  if (sIns) {
    const { error: sDelErr } = await supabase
      .from('services')
      .delete()
      .eq('id', testServiceId);
    console.log('Service delete result:', !sDelErr ? 'SUCCESS' : 'FAILED', sDelErr);
  }

  // Test 4: Barbers UPDATE
  console.log('Test 4: Updating barber "qasim-ali"...');
  const { data: bData, error: bErr } = await supabase
    .from('barbers')
    .update({ experience: '5 Years' })
    .eq('id', 'qasim-ali')
    .select();
  console.log('Barber update result:', bData ? 'SUCCESS' : 'FAILED', bErr);

  // Test 5: Site Images (Hero Video)
  console.log('Test 5: Updating site_images "hero_video"...');
  const { data: imgData, error: imgErr } = await supabase
    .from('site_images')
    .upsert({
      key: 'hero_video',
      label: 'Hero Showcase Video',
      url: '/videos/hero-salon-loop-720p.mp4'
    })
    .select();
  console.log('Site images upsert result:', imgData ? 'SUCCESS' : 'FAILED', imgErr);

  // Test 6: Gallery Items INSERT & DELETE
  console.log('Test 6: Gallery items test...');
  const { data: gData, error: gErr } = await supabase
    .from('gallery_items')
    .insert({
      title: 'Test Gallery Item',
      alt: 'Test',
      category: 'Interiors',
      media_type: 'image',
      url: 'https://test.com/img.jpg',
      featured: false,
      display_order: 999,
      active: true
    })
    .select();
  console.log('Gallery insert result:', gData ? 'SUCCESS' : 'FAILED', gErr);
  if (gData && gData[0]) {
    const { error: gDelErr } = await supabase.from('gallery_items').delete().eq('id', gData[0].id);
    console.log('Gallery delete result:', !gDelErr ? 'SUCCESS' : 'FAILED', gDelErr);
  }
}

runAllCrudTests().catch(console.error);
