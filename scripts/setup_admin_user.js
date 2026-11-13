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

async function setupAdminUser() {
  const email = 'admin@rbmakeover.com';
  const password = 'RBMakeover@2026Admin';

  const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr);
    return;
  }

  const existing = usersData.users.find(u => u.email === email);
  if (existing) {
    console.log('Admin user already exists:', existing.id);
    // Update password to ensure it matches
    const { data: updateData, error: updateErr } = await supabase.auth.admin.updateUserById(
      existing.id,
      { password: password, email_confirm: true }
    );
    console.log('Admin user password verified/updated:', { success: !updateErr, error: updateErr });
  } else {
    const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'admin', name: 'R.B Makeover Administrator' }
    });
    console.log('Created admin user:', { success: !createErr, error: createErr, id: createData?.user?.id });
  }
}

setupAdminUser();
