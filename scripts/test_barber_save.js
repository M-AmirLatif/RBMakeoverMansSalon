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

async function checkBarbers() {
  const { data, error } = await supabase.from('barbers').select('*').limit(1);
  console.log('Barber row sample:', data, error);

  // Try updating avatar_url on Qasim Ali
  const testPayload = {
    avatar_url: 'https://test.com/avatar.jpg'
  };
  const { data: updateData, error: updateErr } = await supabase
    .from('barbers')
    .update(testPayload)
    .eq('name', 'Qasim Ali')
    .select();
  console.log('Update result:', updateData, updateErr);
}

checkBarbers();
