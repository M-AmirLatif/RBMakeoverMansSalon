const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, serviceKey);

async function test() {
  try {
    const { data, error } = await supabase.from('barbers').select('*').limit(1);
    console.log('Barbers table check:', { data, error });
  } catch (err) {
    console.error('Catch error:', err);
  }
}

test();
