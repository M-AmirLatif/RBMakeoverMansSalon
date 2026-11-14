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

async function setup() {
  console.log('Setting up reviews table and barber columns...');

  // 1. Create client_reviews table via SQL / rpc or direct check
  // Since Supabase JS client doesn't run raw DDL directly without rpc, let's test if table exists
  const { data: testRev, error: revErr } = await supabase.from('client_reviews').select('id').limit(1);
  if (revErr) {
    console.log('client_reviews table not found or error:', revErr.message);
  } else {
    console.log('client_reviews table already exists!');
  }

  // 2. Check barbers columns
  const { data: bData, error: bErr } = await supabase.from('barbers').select('*').limit(1);
  if (bErr) {
    console.error('Error querying barbers:', bErr);
  } else {
    console.log('Barbers columns:', Object.keys(bData[0] || {}));
  }
}

setup();
