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

const newServices = [
  {
    id: 'mani-pedi',
    name: 'Mani & Pedicure',
    category: 'grooming',
    price: 'Rs. 2,500',
    numeric_price: 2500,
    description: 'Complete luxury manicure and pedicure treatment with hand soak, cuticle care, foot scrub, and nail grooming.',
    duration: '60 min',
    display_order: 14
  },
  {
    id: 'manicure',
    name: 'Manicure',
    category: 'grooming',
    price: 'Rs. 1,500',
    numeric_price: 1500,
    description: 'Executive men\'s hand grooming, cuticle treatment, nail shaping, and relaxing hand massage.',
    duration: '35 min',
    display_order: 15
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    category: 'grooming',
    price: 'Rs. 1,500',
    numeric_price: 1500,
    description: 'Relaxing foot soak, dead skin exfoliation, cuticle care, nail buffing, and rejuvenating foot massage.',
    duration: '40 min',
    display_order: 16
  }
];

async function insertNewServices() {
  for (const svc of newServices) {
    const { data, error } = await supabase.from('services').upsert(svc, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error inserting ${svc.name}:`, error);
    } else {
      console.log(`Successfully upserted ${svc.name}:`, data);
    }
  }

  const { data: all, error: fetchErr } = await supabase.from('services').select('id, name, price, numeric_price, category').order('display_order');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
  } else {
    console.log('Total services now:', all.length);
    console.log(all);
  }
}

insertNewServices();
