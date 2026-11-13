const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

async function checkEndpoints() {
  // Try pg query endpoint
  try {
    const res = await fetch(`${supabaseUrl}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ query: 'SELECT 1;' })
    });
    console.log('/pg/query status:', res.status, await res.text());
  } catch (e) {
    console.log('/pg/query failed:', e.message);
  }

  // Check storage buckets
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  console.log('Storage buckets:', { buckets, bError });
}

checkEndpoints();
