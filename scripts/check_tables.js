const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  const tables = ['barbers', 'gallery_items', 'services', 'site_images', 'reviews', 'testimonials', 'contact_inquiries'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: Error - ${error.message}`);
    } else {
      console.log(`Table ${t}: EXISTS! Row count sample:`, data?.length);
    }
  }
}

checkTables();
