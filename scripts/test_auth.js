const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkAuth() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  console.log('Current users:', { count: users?.users?.length, error });
}

checkAuth();
