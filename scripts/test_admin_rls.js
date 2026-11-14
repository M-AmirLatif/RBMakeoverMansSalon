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

async function testAdminSave() {
  // 1. Sign in as admin
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@rbmakeover.com',
    password: 'RBMakeover@2026Admin'
  });
  console.log('Admin login error:', authErr);
  console.log('Admin user ID:', authData?.user?.id);

  // 2. Try upserting Qasim Ali as this user
  const payload = {
    id: 'qasim-ali',
    name: 'Qasim Ali',
    title: 'Barber & Stylist',
    category: 'haircut',
    initials: 'QA',
    experience: '5 Years',
    rating: 5,
    review_count: 10,
    specialties: ['Fade Haircut', 'Beard Trim'],
    bio: '5 years of experience',
    avatar_url: 'https://test.com/new-avatar.jpg',
    rates: {
      haircut: 1000,
      beard: 600,
      hairAndBeard: 1500,
      facial: 1800,
      groomingPackage: 3500
    },
    is_popular: true,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('barbers').upsert(payload);
  console.log('Upsert result with admin user:', data, error);
}

testAdminSave();
