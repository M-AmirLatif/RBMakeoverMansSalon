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

async function checkSiteImages() {
  const { data, error } = await supabase.from('site_images').select('*');
  console.log('Site Images rows:', data, error);

  // Upsert default hero_video row if not exists
  const { data: upsertData, error: upsertErr } = await supabase
    .from('site_images')
    .upsert({
      key: 'hero_video',
      label: 'Hero Showcase Video',
      description: 'Continuous hair salon loop video in Hero Section Part 2',
      url: '/videos/hero-salon-loop-720p.mp4',
      updated_at: new Date().toISOString()
    });
  console.log('Upsert hero_video:', upsertData, upsertErr);
}

checkSiteImages();
