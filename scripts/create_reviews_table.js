const fs = require('fs');
const path = require('path');
const https = require('https');

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

const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const sql = `
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  service_tag TEXT,
  barber_name TEXT,
  source TEXT DEFAULT 'Website review',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage reviews" ON public.reviews;
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

async function tryExecuteSql() {
  const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  console.log('Testing RPC exec_sql...');
  
  // Try sending SQL to pg-meta or rest query endpoint
  const body = JSON.stringify({ query: sql });
  const options = {
    hostname: 'rkfqzokuofvztofkpzxs.supabase.co',
    path: '/pg/query',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response /pg/query:', res.statusCode, data);
    });
  });

  req.on('error', (e) => console.error(e));
  req.write(body);
  req.end();
}

tryExecuteSql();
