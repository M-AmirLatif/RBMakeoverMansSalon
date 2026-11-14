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

async function checkGallery() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('id, title, media_type, url, webp')
    .order('display_order', { ascending: true });
  console.log('Gallery Items in DB:', JSON.stringify(data, null, 2), error);
}

checkGallery();
