import { SupabaseClient } from "@supabase/supabase-js";

export default async function AuthUsersSeed(
  supabase: SupabaseClient<any, "public", any>,
): Promise<void> {
  const users = [
    {
      email: "admin@gmail.com",
      password: "admin1234",
      full_name: "Admin User",
    },
    { email: "user@gmail.com", password: "user1234", full_name: "Normal User" },
  ];

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name },
    });

    if (error) console.error(`❌ Error creating user ${u.email}:`, error);
    else console.log(`✅ Created user ${u.email}`);
  }
}
